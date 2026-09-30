import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./login.service"; 
import { StateUF } from "@/app/generated/prisma/enums";

export async function findCinemaById(id: string) {
  return await prisma.cinema.findUnique({ where: { id } });
}

export async function findCinemaByCNPJ(cnpj: string) {
  return await prisma.cinema.findUnique({ where: { cnpj } });
}

export async function createCinema(
  ownerName: string, 
  cinemaName: string, 
  cnpj: string, 
  address: string, 
  city: string, 
  state: StateUF, 
  email: string, 
  password: string
) {
    const existingCinema = await findCinemaByCNPJ(cnpj);
    if (existingCinema) {
        throw new Error("Cinema com CNPJ já cadastrado.");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("E-mail já está em uso por outro usuário.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: { 
            name: ownerName, 
            email: email, 
            password_hash: hashedPassword,
            role: "CINEMA_ADMIN", 
            
            cinemas: {
                create: {
                    name: cinemaName,
                    cnpj: cnpj,
                    address: address,
                    city: city,
                    state: state
                }
            }
        },
        include: {
            cinemas: true 
        }
    });
}