"use server";

import { findTicketsByUserId } from "@/core/services/user.service";

export async function getTicketsByUserId(userId: string) {
    return findTicketsByUserId(userId);
}