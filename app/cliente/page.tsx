"use client";

import { useState } from 'react';
import LocalSearch from "@/components/LocalSearch";
import { getCinemasByCity } from "@/core/actions/cinema.action";
import Link from "next/link";

const CINEMAS_PER_PAGE = 4;

export default function ClientePage() {
    const [foundCity, setFoundCity] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cinemas, setCinemas] = useState<Array<{ id: string; name: string; address: string }>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);

    const pageCount = Math.ceil(cinemas.length / CINEMAS_PER_PAGE);
    const visibleCinemas = cinemas.slice(
        (currentPage - 1) * CINEMAS_PER_PAGE,
        currentPage * CINEMAS_PER_PAGE,
    );
    const cinemaSlots = Array.from(
        { length: CINEMAS_PER_PAGE },
        (_, index) => visibleCinemas[index] ?? null,
    );

    const handleCityFound = async (cityName: string) => {
        setFoundCity(cityName);
        setErrorMessage(null); 
        setCinemas([]);
        setCurrentPage(1);
        await fetchCinemas(cityName);
    };

    const handleSearchError = (error: string) => {
        setErrorMessage(error);
        setFoundCity(null); 
        setCinemas([]);
        setCurrentPage(1);
    };

    const fetchCinemas = async (city: string) => {
        setIsLoading(true);
        try {
            const cinemasData = await getCinemasByCity(city);
            setCinemas(cinemasData);
        } catch {
            setErrorMessage("Erro ao buscar cinemas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-col items-center md:flex-row">
            <section className="user-section h-auto w-full md:h-full md:w-3/5">
                <LocalSearch onCityFound={handleCityFound} SearchError={handleSearchError}/>

                <div className="mt-4">
                    {errorMessage && (
                        <p className="text-red-500 text-center">{errorMessage}</p>
                    )}
                </div>

                <div className="mt-6">
                    {foundCity && (
                        <div className="text-slate-300 text-center">
                            <h2 className="text-xl font-bold mb-6">Cinemas em <span className="text-yellow-500">{foundCity}</span></h2>
                                {cinemas.length > 0 && !isLoading ? (
                                    <>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                                            {cinemaSlots.map((cinema, index) => (
                                                <li
                                                    key={cinema?.id ?? `empty-slot-${index}`}
                                                    aria-hidden={cinema ? undefined : true}
                                                    className="h-40 w-full md:w-80"
                                                >
                                                    {cinema && (
                                                        <div className="group flex h-full flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-500 hover:shadow-lg">
                                                            <div className="min-h-0 flex-1 overflow-hidden">
                                                                <h3 className="mb-2 break-words text-lg font-semibold text-slate-50">{cinema.name}</h3>
                                                                <p className="break-words text-sm leading-relaxed text-slate-400">{cinema.address.slice(0, 40)}{cinema.address.length > 40 ? '...' : ''}</p>
                                                            </div>
                                                            <Link
                                                                href={`/cinema/${cinema.id}`}
                                                                className="mt-3 inline-flex shrink-0 items-center gap-1 font-semibold text-yellow-500 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
                                                            >
                                                                Ver detalhes <span className="inline-block text-sm transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        {pageCount > 1 && (
                                            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Paginação dos cinemas">
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
                                ) : isLoading ? (
                                    <p className="text-slate-500">Carregando...</p>
                                ) : (
                                    <p className="text-slate-500">Nenhum cinema encontrado.</p>
                                )}
                        </div>
                    )}
                </div>
            </section>

            <section className="user-section h-auto w-full md:h-full md:w-2/5">
                <h2 className="text-xl font-bold mb-2">Meus Ingressos</h2>
                <p className="text-slate-300">
                    Em desenvolvimento. Em breve você poderá visualizar e gerenciar seus ingressos comprados diretamente nesta seção.
                </p>
            </section>
        </div>
    );
}