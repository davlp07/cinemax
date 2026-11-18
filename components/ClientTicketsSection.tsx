"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getTicketsByUserId } from "@/core/actions/user.action";
import Link from "next/link";

const TICKETS_PER_PAGE = 4;

export default function ClientTicketsSection() {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? null;
    const [ticketErrorMessage, setTicketErrorMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tickets, setTickets] = useState<Array<{
        id: string;
        session: {
            start_time: Date;
            movie: { title: string; duration_minutes: number };
            room: { name: string; cinema: { name: string } };
        };
    }>>([]);
    const pageCount = Math.ceil(tickets.length / TICKETS_PER_PAGE);
    const visibleTickets = tickets.slice(
        (currentPage - 1) * TICKETS_PER_PAGE,
        currentPage * TICKETS_PER_PAGE,
    );

    useEffect(() => {
        if (!userId) return;

        getTicketsByUserId(userId)
            .then((ticketsData) => {
                setTickets(ticketsData);
                setCurrentPage(1);
            })
            .catch(() => setTicketErrorMessage("Erro ao buscar ingressos."));
    }, [userId]);

    return (
        <section className="user-section h-full w-full justify-start md:h-full md:w-2/5">
            <h2 className="fixed top-[19vh] mb-6 text-center text-xl font-bold">Meus Ingressos</h2>
            {userId ? (
                <div className="w-full">
                    {tickets.length > 0 ? (
                        <>
                            <ul className="grid grid-cols-1 gap-4">
                                {visibleTickets.map((ticket) => (
                                    <li key={ticket.id} className="rounded-lg border border-slate-600 p-4">
                                        <h3 className="text-lg font-bold">{ticket.session.movie.title}</h3>
                                        <p className="text-slate-300">
                                            Horário de início: {ticket.session.start_time.toDateString()}
                                        </p>
                                        <p className="text-slate-300">
                                            Duração: {new Date(ticket.session.movie.duration_minutes).toLocaleTimeString()}
                                        </p>
                                        <Link
                                            href={`/ticket/${ticket.id}`}
                                            className="mt-3 inline-flex shrink-0 items-center gap-1 font-semibold text-yellow-500 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
                                        >
                                            Ver detalhes{" "}
                                            <span
                                                className="inline-block text-sm transition-transform duration-200 group-hover:translate-x-1"
                                                aria-hidden="true"
                                            >
                                                →
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {pageCount > 1 && (
                                <nav
                                    className="mt-6 flex items-center justify-center gap-2"
                                    aria-label="Paginação dos ingressos"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((page) => page - 1)}
                                        disabled={currentPage === 1}
                                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-yellow-500 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            aria-current={currentPage === page ? "page" : undefined}
                                            aria-label={`Página ${page}`}
                                            className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                                                currentPage === page
                                                    ? "border-yellow-500 bg-yellow-500 text-slate-900"
                                                    : "border-slate-700 text-slate-300 hover:border-yellow-500 hover:text-yellow-400"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((page) => page + 1)}
                                        disabled={currentPage === pageCount}
                                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-yellow-500 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Próxima
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : ticketErrorMessage ? (
                        <p className="text-center text-red-500">{ticketErrorMessage}</p>
                    ) : (
                        <p className="text-slate-500 text-lg text-center">Você não possui ingressos.</p>
                    )}
                </div>
            ) : (
                <p className="text-slate-500 text-lg text-center">Por favor, faça login para ver seus ingressos.</p>
            )}
        </section>
    );
}
