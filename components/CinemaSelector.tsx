import { auth } from "@/auth";
import { ACTIVE_CINEMA_COOKIE, findCinemasByOwnerId } from "@/core/services/cinema.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CinemaSelector() {
    const session = await auth();
    const ownerId = session?.user?.id;

    if (!ownerId || session.user.role !== "CINEMA_ADMIN") {
        redirect("/cinema/login");
    }

    const cinemas = await findCinemasByOwnerId(ownerId);
    const activeCinemaId = (await cookies()).get(ACTIVE_CINEMA_COOKIE)?.value;
    const currentCinema = cinemas.find((cinema) => cinema.id === activeCinemaId) ?? cinemas[0];

    if (!currentCinema) {
        return <p>Nenhum cinema está vinculado a esta conta.</p>;
    }

    return (
        <section className="flex w-full max-w-3xl flex-col gap-4 rounded-lg border border-red-500/40 bg-slate-800 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                    Cinema atual
                </h1>
                <div className="mt-2 border-l-2 border-red-500/60 pl-3">
                    <h2 className="text-lg font-semibold text-slate-50">{currentCinema.name}</h2>
                    <p className="mt-1 text-sm text-slate-300">{currentCinema.address}</p>
                    <p className="text-sm text-slate-400">{currentCinema.city} - {currentCinema.state}</p>
                </div>
            </div>
            <Link
                href="/cinema/selecionar"
                className="shrink-0 self-start rounded-md border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 font-semibold text-yellow-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-400 hover:text-slate-900 hover:shadow-lg hover:shadow-yellow-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 sm:self-center"
            >
                Trocar de cinema
            </Link>
        </section>
    );
}