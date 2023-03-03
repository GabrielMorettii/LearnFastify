import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyEnv from "@fastify/env";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { version } from "../package.json";
import { envSchema } from "./config/env.schema";
import { loggerConfig } from "./config/logger.enviroment";

class Server {
  public server = Fastify({
    logger: loggerConfig['development'] ?? true
  });

  constructor() {
    this.registryDecorators();
    this.registryHooks();
    this.registrySchemas();
    this.registrySwagger();
    this.registryRoutes();
  }

  private registryDecorators(){
    this.server.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) =>  await request.jwtVerify()
    );
  }

  private registryHooks(){
    this.server.addHook("preHandler", async (req, reply) => {
      req.jwt = this.server.jwt;
    });

    this.server.addHook('onRequest', async ()=>{
      this.server.log.info('Got a request 🚀')
    })

    this.server.addHook('onResponse', async (request, reply: FastifyReply)=>{
      this.server.log.info(`Time to answer: ${reply.getResponseTime()}`)
    })
  }

  private registrySchemas(){
    for (const schema of [...userSchemas, ...productSchemas]) {
      this.server.addSchema(schema);
    }
  }

  private registryRoutes(){
    this.server.register(userRoutes, { prefix: "api/users" });
    this.server.register(productRoutes, { prefix: "api/products" });
    this.server.get("/health", async function () {
      return { status: "OK" };
    });

    this.server.log.info('Registered routes');
  }

  private registrySwagger(){
    this.server.register(
      swagger,
      withRefResolver({
        routePrefix: "/docs",
        exposeRoute: true,
        staticCSP: true,
        openapi: {
          info: {
            title: "Fastify API",
            description: "API for some products",
            version,
          },
        },
      })
    );

    this.server.log.info('Registered swagger');
  }

  private registryJwt(JWT_SECRET: string){
    return this.server.register(fjwt, {
      secret: JWT_SECRET,
    })
  }

  public async openListener(){
    await this.server.register(fastifyEnv, { schema: envSchema });

    this.server.log.info('Registered envs');

    const {JWT_SECRET, PORT} = this.server.config

    await this.registryJwt(JWT_SECRET);

    this.server.log.info('Registered jwt');

    this.server.listen({port: PORT});
  }
}

export default new Server();
