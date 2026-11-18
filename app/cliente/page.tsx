import ClientCinemaSection from "@/components/ClientCinemaSection";
import ClientTicketsSection from "@/components/ClientTicketsSection";

export default function ClientePage() {
    return (
        <div className="flex h-full flex-col items-center md:flex-row">
            <ClientCinemaSection />
            <ClientTicketsSection />
        </div>
    );
}
