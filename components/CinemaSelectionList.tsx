"use client";

import { useState } from "react";
import { selectCinema } from "@/core/actions/cinema.action";

const CINEMAS_PER_PAGE = 4;

type Cinema = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
};

type CinemaSelectionListProps = {
    cinemas: Cinema[];
    currentCinemaId?: string;
};

export default function CinemaSelectionList({
    cinemas,
    currentCinemaId,
}: CinemaSelectionListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageCount = Math.ceil(cinemas.length / CINEMAS_PER_PAGE);
    const visibleCinemas = cinemas.slice(
        (currentPage - 1) * CINEMAS_PER_PAGE,
        currentPage * CINEMAS_PER_PAGE,
    );

    return (
        <>
            <ul className="space-y-4">
                {visibleCinemas.map((cinema) => {
                    const isCurrent = cinema.id === currentCinemaId;

                    return (
                        <li
                            key={cinema.id}
                            className="flex flex-col gap-4 rounded-lg border border-red-500/40 bg-slate-800 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0 border-l-2 border-red-500/60 pl-3">
                                <h2 className="text-lg font-semibold text-slate-50">{cinema.name}</h2>
                                <p className="mt-1 text-sm text-slate-300">{cinema.address}</p>
                                <p className="text-sm text-slate-400">{cinema.city} - {cinema.state}</p>
                            </div>
                            {isCurrent ? (
                                <span className="shrink-0 self-start rounded-md border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 font-semibold text-yellow-400 sm:self-center">
                                    Cinema atual
                                </span>
                            ) : (
                                <form action={selectCinema} className="shrink-0 self-start sm:self-center">
                                    <input type="hidden" name="cinemaId" value={cinema.id} />
                                    <button
                                        type="submit"
                                        className="cursor-pointer rounded-md border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 font-semibold text-yellow-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-400 hover:text-slate-900 hover:shadow-lg hover:shadow-yellow-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                                    >
                                        Usar este cinema
                                    </button>
                                </form>
                            )}
                        </li>
                    );
                })}
            </ul>

            {pageCount > 1 && (
                <nav
                    className="mt-6 flex flex-wrap items-center justify-center gap-2"
                    aria-label="Paginação dos cinemas"
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
    );
}
