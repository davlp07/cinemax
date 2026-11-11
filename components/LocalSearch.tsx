"use client";

import { useState } from 'react';

interface LocalSearchProps {
    onCityFound: (cityName: string) => void;
    SearchError?: (errorMessage: string) => void;
}

export default function LocalSearch({ onCityFound, SearchError }: LocalSearchProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        setError("");

        try {
            const isCep = query.replace(/\D/g, '').length === 8;

            if (isCep) {
                const cep = query.replace(/\D/g, '');
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                
                if (data.erro) {
                    SearchError?.("CEP não encontrado.");
                } else {
                    onCityFound(data.localidade);
                    setQuery(data.localidade);
                }
            } else {
                const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
                const cities = await res.json();
                
                // Normaliza o texto (remove acentos e deixa minúsculo) para evitar erros de digitação
                const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                const foundCity = cities.find((c: { nome: string }) => {
                    const cityName = c.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return cityName === normalizedQuery;
                });

                if (foundCity) {
                    onCityFound(foundCity.nome);
                    setQuery(foundCity.nome);
                } else {
                    SearchError?.("Cidade não encontrada. Verifique a ortografia.");
                }
            }
        } catch (err) {
            console.error(err);
            SearchError?.("Erro ao buscar a cidade. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-lg">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Pesquise pelo nome ou CEP de sua cidade" 
                    className="input-field flex-grow"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="py-2 px-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </div>
        </div>
    );
}