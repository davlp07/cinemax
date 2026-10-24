"use server"

import z from "zod";
import { StateUF } from "@/app/generated/prisma/enums";
import { createCinema } from "../services/cinema.service";
import { cnpjValidator } from "@/utils/validators";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

/* Owner Login */
const loginSchema = z.object({
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function ownerLogin(email: string, password: string) {
    const validatedData = loginSchema.parse({ email, password });

    try {
        await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            throw new Error("Acesso negado. Verifique suas credenciais.");
        }
        throw error;
    }

    revalidatePath("/cinema");
    return { success: true };
}

/* Cinema Register */
const cinemaSchema = z.object({
    ownerName: z.string().min(2).max(100),
    cinemaName: z.string().min(2).max(100),
    cnpj: z.string().refine(cnpjValidator, { message: "CNPJ inválido" }),
    address: z.string().min(2).max(200),
    city: z.string().min(2).max(100),
    state: z.enum(StateUF),
    email: z.email(),
    password: z.string().min(6),
});

export async function registerCinema(ownerName: string, cinemaName: string, cnpj: string, address: string, city: string, state: StateUF, email: string, password: string) {
    try{
        const validatedData = cinemaSchema.parse({ ownerName, cinemaName, cnpj, address, city, state, email, password });
        const cinema = await createCinema(validatedData);
        return { success: true, cinema };
    } catch (error: unknown) {
        throw new Error((error as Error).message, { cause: error });
    }
}