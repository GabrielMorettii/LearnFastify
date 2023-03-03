import { ApiError } from "../../utils/error";
import { hashPassword, verifyPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, LoginInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = await hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
}

export async function login({email, password}: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  const correctPassword = await verifyPassword({
    candidatePassword: password,
    salt: user.salt,
    hash: user.password,
  });

  if (!correctPassword) {
    throw new ApiError(401, "Invalid email or password")
  }

  const { password: _, salt, ...rest } = user;
  
  return { payload: rest };
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
