'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; 
import LogoutModal from './LogoutModal';

import { FaCartShopping, FaUser } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { GiTheater, GiFilmProjector } from "react-icons/gi";




export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const { status, data } = useSession(); 
    const isLoggedIn = status === 'authenticated';
    const role = data?.user.role;
    const homePage = isLoggedIn && role === 'CLIENT'
        ? '/cliente'
        : isLoggedIn && role === 'CINEMA_ADMIN'
            ? '/cinema'
            : '/';


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
                        <Link href="/" aria-label="Cinemax Logo">
                            <Image 
                                src="/text_logo.png" 
                                alt="Cinemax Logo" 
                                width={128} 
                                height={40} 
                                className="h-10 w-auto object-contain" 
                            />
                        </Link>
                    </div>
                
                
                {status !== 'loading' && (
                    <nav className="hidden md:flex md:space-x-8 md:items-center">
                        <Link href={homePage} className="link-menu fade-element delay-100" aria-label="Home">
                            <IoMdHome className="h-7 w-7 flex-shrink-0" />
                            <span className="text-lg font-medium">Início</span>
                        </Link>

                        {/* Links para não usuários autenticados */}
                        {!isLoggedIn && (
                            <>
                                <Link href="/about" className="link-menu fade-element delay-200" aria-label="Sobre">
                                    <FaQuestionCircle className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Sobre</span>
                                </Link>
                                <Link href="/contact" className="link-menu fade-element delay-300" aria-label="Contato">
                                    <BsFillTelephoneFill className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Contato</span>
                                </Link>
                            </>
                        )}

                        {/** Links para usuários autenticados como CLIENTES */}
                        {(isLoggedIn) && role === 'CLIENT' && (
                            <>
                                <Link href="/profile" className="link-menu fade-element delay-200" aria-label="Perfil">
                                    <FaUser className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Perfil</span>
                                </Link>
                                <Link href="/cart" className="link-menu fade-element delay-300" aria-label="Carrinho">
                                    <FaCartShopping className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Carrinho</span>
                                </Link>
                                <button 
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="link-menu fade-element delay-400 flex items-center cursor-pointer"
                                    aria-label="Sair"
                                >
                                    <MdLogout className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Sair</span>
                                </button>
                            </>
                        )} 

                        {(isLoggedIn) && role === 'CINEMA_ADMIN' && (
                            <>
                                <Link href="/admin" className="link-menu fade-element delay-200" aria-label="Meu Cinema">
                                    <GiTheater className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Meu Cinema</span>
                                </Link>
                                <Link href="/sessoes" className="link-menu fade-element delay-300" aria-label="Filmes">
                                    <GiFilmProjector className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Filmes e Sessões</span>
                                </Link>
                                <button 
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="link-menu fade-element delay-400 flex items-center cursor-pointer"
                                    aria-label="Sair"
                                >
                                    <MdLogout className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-lg font-medium">Sair</span>
                                </button>
                            </>
                        )}

                    </nav>
                )}

                {/* --------------------------------- ESTILIZAÇÃO PARA MOBILE -------------------------------------- */}
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
                        <Link href={homePage} className="link-menu-mobile" onClick={closeMenu} aria-label="Home">
                            <IoMdHome className="h-7 w-7" />
                            <span className="ml-2">Início</span>
                        </Link>
                        {!isLoggedIn && (
                            <>
                                <Link href="/about" className="link-menu-mobile" onClick={closeMenu} aria-label="Sobre">
                                    <FaQuestionCircle className="h-5 w-5" />
                                    <span className="ml-2">Sobre</span>
                                </Link>
                                <Link href="/contact" className="link-menu-mobile" onClick={closeMenu} aria-label="Contato">
                                    <BsFillTelephoneFill className="h-5 w-5" />
                                    <span className="ml-2">Contato</span>
                                </Link>
                            </>
                        )}
                        {(isLoggedIn) && role === 'CLIENT' && (
                            <button 
                                onClick={() => {
                                    setIsLogoutModalOpen(true);
                                    closeMenu();
                                }}
                                className="link-menu-mobile flex items-center cursor-pointer"
                                aria-label="Sair"
                            >
                                <MdLogout className="h-5 w-5" />
                                <span className="ml-2">Sair</span>
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