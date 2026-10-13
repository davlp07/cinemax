"use server";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/auth"; 
import { AuthError } from "next-auth";
import z from "zod";
import { createUser } from "../services/login.service";

/* Login */
const loginSchema = z.object({
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function login(email: string, password: string) {
    const validatedData = loginSchema.parse({ email, password });

    try {
        await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false, 
        });
    } catch (error) {
        if (error instanceof AuthError) {
            throw new Error("E-mail ou senha incorretos.");
        }
        throw error;
    }

    revalidatePath("/cliente");
    return { success: true };
}

/* Logout */
export async function logout() {
    await signOut({ redirectTo: "/cliente/login" });
}

/* Register */
const registerSchema = z.object({
    name: z.string().min(1, { message: "O nome não pode estar vazio" }),
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function register(name: string, email: string, password: string) {
    try {
        const validatedData = registerSchema.parse({ name, email, password });
        const user = await createUser(validatedData.name, validatedData.email, validatedData.password);
        return { success: true, user };
    } catch (error: unknown) {
        throw new Error((error as Error).message, { cause: error });
    }
}