import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      
      {/* Seção Hero (Destaque Principal) */}
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-50 mb-6">
          Bem-vindo ao <span className="text-yellow-500">Cinemax</span>, a melhor plataforma de gestão de cinemas!
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed">
          Com o Cinemax, você pode gerenciar facilmente os filmes em exibição, controlar as sessões e ingressos, e muito mais. Nossa plataforma intuitiva e fácil de usar garante que você possa se concentrar no que realmente importa: proporcionar uma experiência de cinema inesquecível para seus clientes.
        </p>
        <p className="text-md md:text-lg text-slate-400">
          Explore nossas funcionalidades e descubra como o Cinemax pode transformar a maneira como você administra seu cinema. Estamos aqui para ajudar você a cada passo do caminho!
        </p>
      </div>

      {/* Seção de Escolha de Login (Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 sm:px-6">
        
        {/* Card: Cinema / Admin */}
        <div className="flex flex-col items-center justify-between p-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:scale-105">
          <div>
            <h3 className="text-2xl font-bold text-slate-50 mb-3">Para Cinemas</h3>
            <p className="text-slate-400 mb-8 text-center">
              Gerencie suas salas, sessões, ingressos e acompanhe o desempenho do seu negócio em tempo real.
            </p>
          </div>
          <Link 
            href="/login/cinema" 
            className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors text-center"
          >
            Acessar Painel do Cinema
          </Link>
        </div>

        {/* Card: Cliente */}
        <div className="flex flex-col items-center justify-between p-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-400 transition-all duration-300 hover:scale-105">
          <div>
            <h3 className="text-2xl font-bold text-slate-50 mb-3">Para Clientes</h3>
            <p className="text-slate-400 mb-8 text-center">
              Compre ingressos rapidamente, escolha seus assentos favoritos e evite filas na bilheteria.
            </p>
          </div>
          <Link 
            href="/login/cliente" 
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-50 font-bold rounded-lg transition-colors text-center"
          >
            Acessar Área do Cliente
          </Link>
        </div>

      </section>
    </div>
  );
}