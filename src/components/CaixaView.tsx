import React, { useState } from 'react';
import { CaixaMetodos, Gasto } from '../types';

interface Props {
  caixaMetodos: CaixaMetodos;
  gastos: Gasto[];
  limparDados: () => void;
}

export function CaixaView({ caixaMetodos, gastos, limparDados }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const totalFaturamento = caixaMetodos.Dinheiro + caixaMetodos.Pix + caixaMetodos.Cartão;
  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
  const lucro = totalFaturamento - totalGastos;

  const handleLimparDados = () => {
    limparDados();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1a1e] p-5 rounded-lg space-y-5 text-center border border-gray-800 shadow-md">
        <h2 className="text-xl font-bold text-emerald-400">Fechamento do Mês</h2>
        
        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#202024] p-4 rounded border border-gray-800">
                <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider font-semibold">Faturamento (+)</span>
                <span className="text-xl font-bold text-emerald-400">R$ {totalFaturamento.toFixed(2)}</span>
            </div>
            <div className="bg-[#202024] p-4 rounded border border-gray-800">
                <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider font-semibold">Gastos (-)</span>
                <span className="text-xl font-bold text-red-400">R$ {totalGastos.toFixed(2)}</span>
            </div>
        </div>

        {/* Divisão Detalhada das Entradas */}
        <div className="bg-[#202024] p-4 rounded-lg text-left space-y-3 text-sm border border-gray-800">
            <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider border-b border-gray-700 pb-2">Entradas por Tipo:</p>
            <div className="flex justify-between items-center text-gray-300">
               <span className="flex items-center gap-2">💵 Dinheiro</span>
               <span className="font-bold text-white">R$ {caixaMetodos.Dinheiro.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
               <span className="flex items-center gap-2">⚡ Pix</span>
               <span className="font-bold text-white">R$ {caixaMetodos.Pix.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
               <span className="flex items-center gap-2">💳 Cartão</span>
               <span className="font-bold text-white">R$ {caixaMetodos.Cartão.toFixed(2)}</span>
            </div>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-[#29292e] p-5 rounded-lg border border-amber-500/30">
            <span className="text-sm text-gray-400 block mb-1 font-medium">SOBROU NO BOLSO (Lucro Líquido)</span>
            <span className={`text-3xl font-bold ${lucro >= 0 ? 'text-white' : 'text-red-400'}`}>
               R$ {lucro.toFixed(2)}
            </span>
        </div>
      </div>
      
      <button 
        onClick={() => setShowConfirm(true)} 
        className="w-full bg-gray-800 hover:bg-red-900/50 transition-colors text-gray-400 hover:text-red-400 text-xs py-3 rounded uppercase tracking-wider font-bold"
      >
        Zerar Todos os Dados do Sistema
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1e] p-6 rounded-lg w-full max-w-xs space-y-5 border border-gray-800 shadow-xl relative text-center">
             <h3 className="text-lg font-bold text-red-500">Atenção!</h3>
             <p className="text-sm text-gray-300 text-left">
               Tem certeza que deseja apagar todas as comandas, faturamento e gastos? Esta ação não pode ser desfeita.
             </p>
             <div className="flex gap-3">
               <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition-colors">Cancelar</button>
               <button onClick={handleLimparDados} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors">Apagar Tudo</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
