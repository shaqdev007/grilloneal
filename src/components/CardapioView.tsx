import React, { useState } from 'react';
import { ProdutoCardapio } from '../types';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  cardapio: ProdutoCardapio[];
  adicionarProduto: (nome: string, preco: number) => void;
  removerProduto: (id: string) => void;
}

export function CardapioView({ cardapio, adicionarProduto, removerProduto }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const handleAdicionar = () => {
    const val = parseFloat(preco);
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || nomeLimpo.length > 50) {
      alert("O nome deve ter entre 1 e 50 caracteres.");
      return;
    }
    if (isNaN(val) || val <= 0 || val > 100000) {
      alert("Preço inválido.");
      return;
    }
    
    adicionarProduto(nomeLimpo, val);
    setNome('');
    setPreco('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1a1e] p-4 rounded-lg space-y-3 border border-gray-800 shadow-md">
        <h2 className="text-lg font-bold text-amber-500">Novo Produto (Cardápio)</h2>
        <input 
          type="text" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={50}
          placeholder="Ex: Porção de Fritas" 
          className="w-full p-2.5 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <input 
          type="number" 
          value={preco}
          step="0.01"
          min="0.01"
          max="100000"
          onChange={(e) => setPreco(e.target.value)}
          placeholder="Preço (R$)" 
          className="w-full p-2.5 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button 
          onClick={handleAdicionar} 
          className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold py-2.5 rounded mt-2 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5"/> Adicionar ao Cardápio
        </button>
      </div>

      <div className="bg-[#1a1a1e] p-4 rounded-lg border border-gray-800 shadow-md">
        <h3 className="font-bold mb-3 text-white">Opções de Venda</h3>
        <div className="space-y-2 text-sm text-gray-300">
          {cardapio.length === 0 ? (
             <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado.</p>
          ) : (
            cardapio.map(p => (
               <div key={p.id} className="flex justify-between bg-[#202024] p-3 rounded items-center border border-gray-800/50">
                 <div className="flex flex-col">
                   <span className="font-bold text-white">{p.nome}</span>
                   <span className="text-amber-500 text-xs">R$ {p.preco.toFixed(2)}</span>
                 </div>
                 <button onClick={() => removerProduto(p.id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors">
                   <Trash2 className="w-4 h-4"/>
                 </button>
               </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
