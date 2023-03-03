import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, login, findUsers } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await createUser(body);

  return reply.code(201).send(user);
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const {payload} = await login(body)

  return { accessToken: request.jwt.sign(payload) }
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}
