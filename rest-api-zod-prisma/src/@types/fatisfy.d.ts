export declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest<{Body: any}>,
      reply: FastifyReply
    ) => Promise<void>;
    config: {
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }

  interface FastifyLoggerOptions {
    transport: any;
  }
}
