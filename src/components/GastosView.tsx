import React, { useState } from 'react';
import { Gasto } from '../types';

interface Props {
  gastos: Gasto[];
  lancarGasto: (descricao: string, valor: number) => void;
}

export function GastosView({ gastos, lancarGasto }: Props) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const handleLancar = () => {
    const val = parseFloat(valor);
    const descLimpa = descricao.trim();
    if (!descLimpa || descLimpa.length > 100) {
      alert("A descrição deve ter entre 1 e 100 caracteres.");
      return;
    }
    if (isNaN(val) || val <= 0 || val > 100000) {
      alert("Valor inválido.");
      return;
    }
    
    lancarGasto(descLimpa, val);
    setDescricao('');
    setValor('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1a1e] p-4 rounded-lg space-y-3 border border-gray-800 shadow-md">
        <h2 className="text-lg font-bold text-red-400">Lançar Novo Gasto</h2>
        <input 
          type="text" 
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={100}
          placeholder="Ex: Carvão, Carne, Energia" 
          className="w-full p-2.5 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        <input 
          type="number" 
          value={valor}
          step="0.01"
          min="0.01"
          max="100000"
          onChange={(e) => setValor(e.target.value)}
          placeholder="Valor R$" 
          className="w-full p-2.5 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button 
          onClick={handleLancar} 
          className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white font-bold py-2.5 rounded mt-2"
        >
          Salvar Gasto
        </button>
      </div>

      <div className="bg-[#1a1a1e] p-4 rounded-lg border border-gray-800 shadow-md">
        <h3 className="font-bold mb-3 text-white">Histórico de Gastos do Mês</h3>
        <div className="space-y-2 text-sm text-gray-300">
          {gastos.length === 0 ? (
             <p className="text-gray-500 text-center py-4">Nenhum gasto registrado.</p>
          ) : (
            gastos.map(g => (
               <div key={g.id} className="flex justify-between bg-[#202024] p-3 rounded items-center border border-gray-800/50">
                 <span>{g.descricao}</span>
                 <span className="text-red-400 font-medium">- R$ {g.valor.toFixed(2)}</span>
               </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
