import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(name: string, email: string, password: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Usuário inválido, tente novamente com outro e-mail.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: { 
      name, 
      email, 
      password_hash: hashedPassword 
    },
  });
}