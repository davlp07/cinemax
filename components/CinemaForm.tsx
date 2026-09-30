import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CinemaForm({ props }: { props: any }) {
    const [cep, setCep] = useState("");

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorCep = e.target.value.replace(/\D/g, '');
        setCep(valorCep);

        if (valorCep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
                const data = await res.json();
                
                if (!data.erro) {
                    props.setEndereco(data.logradouro);
                    props.setCidade(data.localidade);
                    props.setEstado(data.uf);
                }
            } catch (error) {
                console.error("Erro ao buscar o CEP:", error);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
            
            <div className="md:col-span-6 flex flex-col">
                <label className="label-inpt">Nome do Proprietário</label>
                <input 
                    type="text" 
                    name="ownerName" 
                    placeholder="Nome do proprietário" 
                    className="input-field"
                    value={props.ownerName} 
                    onChange={(e) => props.setOwnerName(e.target.value)} 
                />
            </div>

            <div className="md:col-span-6 flex flex-col">
                <label className="label-inpt">Nome do Cinema</label>
                <input 
                    type="text" 
                    name="cinemaName" 
                    placeholder="Nome do cinema" 
                    className="input-field"
                    value={props.cinemaName} 
                    onChange={(e) => props.setCinemaName(e.target.value)} 
                />
            </div>

            <div className="md:col-span-4 flex flex-col">
                <label className="label-inpt">CNPJ</label>
                <input 
                    type="text" 
                    name="cnpj" 
                    placeholder="00.000.000/0000-00" 
                    className="input-field"
                    value={props.cnpj} 
                    onChange={(e) => props.setCnpj(e.target.value)} 
                />
            </div>

            <div className="md:col-span-3 flex flex-col">
                <label className="label-inpt">CEP</label>
                <input 
                    type="text" 
                    name="cep" 
                    placeholder="00000-000" 
                    className="input-field"
                    value={cep} 
                    onChange={handleCepChange}
                    maxLength={9}
                />
            </div>

            <div className="md:col-span-5 flex flex-col">
                <label className="label-inpt">Endereço</label>
                <input 
                    type="text" 
                    name="endereco" 
                    placeholder="Rua, Avenida, etc." 
                    className="input-field"
                    value={props.endereco} 
                    onChange={(e) => props.setEndereco(e.target.value)} 
                />
            </div>

            <div className="md:col-span-8 flex flex-col">
                <label className="label-inpt">Cidade</label>
                <input 
                    type="text" 
                    name="cidade" 
                    placeholder="Nome da cidade" 
                    className="input-field"
                    value={props.cidade} 
                    onChange={(e) => props.setCidade(e.target.value)} 
                />
            </div>

            <div className="md:col-span-4 flex flex-col">
                <label className="label-inpt">Estado</label>
                <select 
                    name="estado" 
                    className="input-field bg-slate-800 text-slate-50"
                    value={props.estado} 
                    onChange={(e) => props.setEstado(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                </select>
            </div>
        </div>
    );
}