import prisma from "@/lib/prisma";

export async function findTicketsByUserId(userId: string) {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                user_id: userId
            },
            include: {
                session: {
                    select: {
                        start_time: true,
                        room: {
                            select: {
                                name: true,
                                cinema: {
                                    select: {
                                        name: true,
                                    }
                                },
                            },
                        },
                        movie: {
                            select: {
                                title: true,
                                duration_minutes: true,
                            }
                        }
                    }
                }
            }
        });
        return tickets;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw new Error("Failed to fetch tickets");
    }
}