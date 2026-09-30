"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import z from "zod";
import { findUserByEmail, createUser } from "../services/login.service";

const loginSchema = z.object({
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function login(email: string, password: string) {
    const validatedData = loginSchema.parse({ email, password });
    const user = await findUserByEmail(validatedData.email);
    const hashedPassword = user?.password_hash;
    if (!user || !hashedPassword) {
        throw new Error("Email ou senha incorretos");
    }
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
        throw new Error("Email ou senha incorretos");
    }

    const cookieStore = await cookies();
    
    const sessionData = JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
    });

    cookieStore.set("auth_session", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 2, // 2d
    });

    revalidatePath("/cliente");
    return { success: true };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
}


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