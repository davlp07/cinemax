"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ownerLogin, registerCinema } from "@/core/actions/cinema.action";
import { StateUF } from "@/app/generated/prisma/enums";
import CinemaForm from "@/components/CinemaForm";
import toast from 'react-hot-toast';


export default function CinemaLogin() {
    const [loginMode, setLoginMode] = useState<"login" | "register">("login");
    const [ownerName, setOwnerName] = useState("");
    const [cinemaName, setCinemaName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("" as StateUF);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (loginMode === "login") {
                await ownerLogin(email, password);
                toast.success("Login realizado com sucesso!");
                setTimeout(() => {
                    router.push("/cinema");
                }, 1000);
            } else {
                await registerCinema(ownerName, cinemaName, cnpj, address, city, state as StateUF, email, password);
                toast.success("Cadastro realizado com sucesso! Faça login para acessar o painel.");
                setLoginMode("login");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
            toast.error(message, {
                duration: 4000,
                style: {
                    background: "#1e293b",
                    border: "1px solid #ef4444",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 25px rgb(0 0 0 / 0.25)",
                    color: "#f1f5f9",
                    padding: "1rem",
                },
                iconTheme: {
                    primary: "#f87171",
                    secondary: "#1e293b",
                },
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="max-w-4xl md:w-3xl px-4 sm:px-6 lg:px-8 mb-16 bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50 mb-2">
                    Portal do Parceiro
                </h1>
                <p className="text-slate-400 mb-8">
                    {loginMode === "login" ? "Acesse o painel de gestão do seu cinema" : "Cadastre seu cinema e comece a vender ingressos"}
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                    {loginMode === "register" && (
                        <CinemaForm props={{ ownerName, setOwnerName, cinemaName, setCinemaName, cnpj, setCnpj, address, setAddress, city, setCity, state, setState }}/>
                    )}

                    <div>
                        <label htmlFor="email" className="label-inpt">Email corporativo</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="label-inpt">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-50 transition-colors"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer mt-4 py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors text-center"
                        disabled={loading}
                    >
                        {loading ? "Processando..." : loginMode === "login" ? "Acessar Painel" : "Criar Conta Parceiro"}
                    </button>
                </form>

                <section className="flex flex-col items-center justify-center gap-4 mt-6 border-t border-slate-700 pt-6">
                    <button
                        type="button"
                        onClick={() => setLoginMode(loginMode === "login" ? "register" : "login")}
                        className="w-full sm:w-3/4 cursor-pointer py-3.5 px-6 bg-transparent hover:bg-slate-700/60 rounded-lg text-slate-300 hover:text-slate-50 text-sm font-semibold text-center transition-all duration-200 ease-in-out border border-transparent hover:border-slate-600"
                    >
                        {loginMode === "login" ? "Deseja se tornar parceiro? Cadastre seu cinema" : "Já é parceiro? Faça login"}
                    </button>
                </section>
            </div>
        </div>
    );
}