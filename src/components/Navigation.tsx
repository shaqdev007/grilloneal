import React from 'react';
import { TelaAtiva } from '../types';
import { Beer, TrendingDown, PieChart, BookOpen } from 'lucide-react';

interface Props {
  telaAtiva: TelaAtiva;
  setTelaAtiva: (tela: TelaAtiva) => void;
}

export function Navigation({ telaAtiva, setTelaAtiva }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1e] border-t border-gray-800 flex justify-around py-2 z-50">
      <div className="max-w-md mx-auto w-full flex justify-around">
        <button 
          onClick={() => setTelaAtiva('comandas')} 
          className={`flex flex-col items-center flex-1 py-2 text-xs font-bold transition-colors ${telaAtiva === 'comandas' ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Beer className="w-5 h-5 mb-1" />
          Comandas
        </button>
        <button 
          onClick={() => setTelaAtiva('gastos')} 
          className={`flex flex-col items-center flex-1 py-2 text-xs font-bold transition-colors ${telaAtiva === 'gastos' ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <TrendingDown className="w-5 h-5 mb-1" />
          Gastos
        </button>
        <button 
          onClick={() => setTelaAtiva('caixa')} 
          className={`flex flex-col items-center flex-1 py-2 text-xs font-bold transition-colors ${telaAtiva === 'caixa' ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <PieChart className="w-5 h-5 mb-1" />
          Caixa
        </button>
        <button 
          onClick={() => setTelaAtiva('cardapio')} 
          className={`flex flex-col items-center flex-1 py-2 text-xs font-bold transition-colors ${telaAtiva === 'cardapio' ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <BookOpen className="w-5 h-5 mb-1" />
          Cardápio
        </button>
      </div>
    </nav>
  );
}
