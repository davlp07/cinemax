'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; 
// Usar depois quando mudarmos para icones: import { MdLogout } from "react-icons/md";
import LogoutModal from './LogoutModal';


export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const { status } = useSession(); 
    const isLoggedIn = status === 'authenticated';

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const closeMenu = () => {
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    };

    return (
        <>
        <header className="fixed top-0 left-0 z-50 w-full bg-slate-900 text-slate-50 shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <Image 
                                src="/text_logo.png" 
                                alt="Cinemax Logo" 
                                width={128} 
                                height={40} 
                                className="h-10 w-auto object-contain" 
                            />
                        </Link>
                    </div>

                    <nav className="hidden md:flex md:space-x-8 md:items-center">
                        <Link href="/" className="link-menu">Home</Link>
                        <Link href="/about" className="link-menu">Sobre</Link>
                        <Link href="/contact" className="link-menu">Contato</Link>
                        {(isLoggedIn) && (
                            <button 
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="link-menu flex items-center cursor-pointer"
                            >
                                Sair
                            </button>
                        )} 
                    </nav>

                    <div className="flex items-center md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-6 pr-2 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none"
                        >
                            <span className="sr-only">Abrir menu principal</span>
                            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                                {isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            
                <nav 
                    className={`md:hidden border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100 border-t' : 'max-h-0 opacity-0 border-t-0'
                    }`}
                >
                    <div className="flex flex-col space-y-6 px-4 pb-4 pt-2">
                        <Link href="/" className="link-menu-mobile" onClick={closeMenu}>Home</Link>
                        <Link href="/about" className="link-menu-mobile" onClick={closeMenu}>Sobre</Link>
                        <Link href="/contact" className="link-menu-mobile" onClick={closeMenu}>Contato</Link>
                        {(isLoggedIn) && (
                            <button 
                                onClick={() => {
                                    setIsLogoutModalOpen(true);
                                    closeMenu();
                                }}
                                className="link-menu-mobile flex items-center cursor-pointer"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                </nav>
        </header>
        <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogout} 
            />
        </>
    );
}