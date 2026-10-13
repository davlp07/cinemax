'use client';

import { useEffect } from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            {/* Modal responsivo: maior no mobile (90vw) e controlado em telas maiores */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 md:p-10 w-[90vw] md:w-[60vw] lg:w-[40vw] max-w-2xl min-h-[35vh] flex flex-col justify-center animate-in fade-in zoom-in duration-200">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-50 mb-6">
                    Sair da conta?
                </h3>
                
                <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                    Tem certeza que deseja encerrar sua sessão atual? <br className="hidden md:block" />
                    Você precisará fazer login novamente para acessar o painel.
                </p>
                
                <div className="flex justify-end space-x-3 md:space-x-4 mt-auto">
                    <button 
                        onClick={onClose}
                        className="cursor-pointer px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-slate-300 hover:text-slate-50 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="cursor-pointer px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-md"
                    >
                        Sim, sair
                    </button>
                </div>
            </div>
        </div>
    );
}