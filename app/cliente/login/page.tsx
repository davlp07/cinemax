"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleLogin from "@/components/GoogleLogin";
import { login, register } from "@/core/actions/login.action";
import toast from 'react-hot-toast';

export default function ClienteLogin() {
    const [loginMode, setLoginMode] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
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
                const res = await login(email, password);
                if (res.success) {
                    toast.success("Login realizado com sucesso!");
                    setTimeout(() => {
                        router.push("/cliente");
                    }, 1000);
                }
            } else {
                const res = await register(name, email, password);
                if (res.success) {
                    toast.success("Cadastro realizado com sucesso!");
                }
            }
        } catch (error) {
            toast.error((error as Error).message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="max-w-4xl md:w-3xl px-4 sm:px-6 lg:px-8 mb-16 bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50 mb-8">
                    {loginMode === "login" ? "Login" : "Cadastro"}
                </h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div>
                        {loginMode === "register" && (
                            <>
                                <label htmlFor="name" className="label-inpt">Nome</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field mb-8"
                                />
                            </>
                        )}
                        <label htmlFor="email" className="label-inpt">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
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
                        className="w-full cursor-pointer mt-6 py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors text-center"
                        disabled={loading}
                    >
                        {loading ? "Processando..." : loginMode === "login" ? "Fazer Login" : "Cadastrar"}
                    </button>
                </form>

                <section className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <div className="w-full sm:w-1/2">
                        <GoogleLogin />
                    </div>
                    <button
                        type="button"
                        onClick={() => setLoginMode(loginMode === "login" ? "register" : "login")}
                        className="w-full sm:w-1/2 cursor-pointer py-3.5 px-6 bg-transparent hover:bg-slate-700/60 rounded-lg text-slate-300 hover:text-slate-50 text-sm font-semibold text-center transition-all duration-200 ease-in-out border border-transparent hover:border-slate-600"
                    >
                        {loginMode === "login" ? "Não tenho uma conta" : "Já tenho uma conta"}
                    </button>
                </section>
            </div>
        </div>
    );
}