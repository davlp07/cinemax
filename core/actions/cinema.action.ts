"use server"

import z from "zod";
import { StateUF } from "@/app/generated/prisma/enums";
import {
    ACTIVE_CINEMA_COOKIE,
    createCinema,
    findCinemaByOwnerId,
    findCinemasByCity,
    findCinemasByOwnerId,
} from "../services/cinema.service";
import { cnpjValidator } from "@/utils/validators";
import { revalidatePath } from "next/cache";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail } from "../services/login.service";

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

    const user = await findUserByEmail(validatedData.email);
    if (!user) {
        throw new Error("Não foi possível carregar os dados da conta.");
    }

    if (user.role === "CINEMA_ADMIN") {
        const firstCinema = (await findCinemasByOwnerId(user.id))[0];
        const cookieStore = await cookies();

        if (firstCinema) {
            cookieStore.set(ACTIVE_CINEMA_COOKIE, firstCinema.id, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
            });
        } else {
            cookieStore.delete(ACTIVE_CINEMA_COOKIE);
        }
    }

    revalidatePath("/cinema");
    return { success: true };
}

export async function selectCinema(formData: FormData) {
    const session = await auth();
    const ownerId = session?.user?.id;

    if (!ownerId || session.user.role !== "CINEMA_ADMIN") {
        throw new Error("É necessário estar autenticado como administrador de cinema.");
    }

    const cinemaId = formData.get("cinemaId");
    if (typeof cinemaId !== "string" || !cinemaId) {
        throw new Error("Cinema inválido.");
    }

    const cinema = await findCinemaByOwnerId(ownerId, cinemaId);
    if (!cinema) {
        throw new Error("Este cinema não pertence à sua conta.");
    }

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_CINEMA_COOKIE, cinema.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    redirect("/cinema");
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

export async function getCinemasByCity(city: string) {
    return findCinemasByCity(city);
}

export async function registerCinema(ownerName: string, cinemaName: string, cnpj: string, address: string, city: string, state: StateUF, email: string, password: string) {
    try{
        const validatedData = cinemaSchema.parse({ ownerName, cinemaName, cnpj, address, city, state, email, password });
        const cinema = await createCinema(validatedData);
        return { success: true, cinema };
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw new Error(error.issues.map((issue) => issue.message).join(" · "), { cause: error });
        }

        if (error instanceof Error) {
            throw new Error(error.message, { cause: error });
        }

        throw new Error("Não foi possível cadastrar o cinema.", { cause: error });
    }
}