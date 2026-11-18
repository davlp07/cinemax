import { auth } from "@/auth";
import { ACTIVE_CINEMA_COOKIE, findCinemasByOwnerId } from "@/core/services/cinema.service";
import CinemaSelectionList from "@/components/CinemaSelectionList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SelectCinemaPage() {
    const session = await auth();
    const ownerId = session?.user?.id;

    if (!ownerId || session.user.role !== "CINEMA_ADMIN") {
        redirect("/cinema/login");
    }

    const cinemas = await findCinemasByOwnerId(ownerId);
    const activeCinemaId = (await cookies()).get(ACTIVE_CINEMA_COOKIE)?.value;
    const activeCinema = cinemas.find((cinema) => cinema.id === activeCinemaId);
    const currentCinemaId = activeCinema?.id ?? cinemas[0]?.id;
    const orderedCinemas = activeCinema
        ? [activeCinema, ...cinemas.filter((cinema) => cinema.id !== activeCinema.id)]
        : cinemas;

    return (
        <section className="mx-auto max-w-3xl p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-50">Selecione um cinema</h1>
                <p className="mt-1 text-slate-300">Escolha qual cinema deseja utilizar agora.</p>
            </header>

            {cinemas.length === 0 ? (
                <p className="rounded-lg border border-red-500/40 bg-slate-800 p-4 text-slate-300">
                    Nenhum cinema está vinculado a esta conta.
                </p>
            ) : (
                <CinemaSelectionList cinemas={orderedCinemas} currentCinemaId={currentCinemaId} />
            )}

            <Link
                href="/cinema"
                className="mt-6 inline-flex rounded-md border border-red-500/40 px-4 py-2 font-semibold text-slate-300 transition-colors hover:border-red-400 hover:text-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            >
                Voltar ao painel
            </Link>
        </section>
    );
}
