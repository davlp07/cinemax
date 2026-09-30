import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLogin() {
    return (
        <button 
            className="w-full cursor-pointer py-3 px-6 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-colors text-center"
            onClick={() => signIn("google", { redirectTo: "/cliente" })}
        >
            <FcGoogle className="inline mr-2 text-2xl" />
            <span className="md:inline hidden">Continuar com Google</span>
        </button>
    );
}