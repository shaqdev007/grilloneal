import React, { useState } from 'react';
import { Comanda, MetodoPagamento, ProdutoCardapio } from '../types';
import { Plus, Banknote, CreditCard, Zap, X } from 'lucide-react';

interface Props {
  comandas: Comanda[];
  cardapio: ProdutoCardapio[];
  adicionarComanda: (nome: string) => void;
  adicionarItemComanda: (comandaId: string, nomeProduto: string, preco: number) => void;
  fecharComanda: (comandaId: string, metodo: MetodoPagamento) => void;
}

export function ComandasView({ comandas, cardapio, adicionarComanda, adicionarItemComanda, fecharComanda }: Props) {
  const [comandaEmFechamento, setComandaEmFechamento] = useState<Comanda | null>(null);
  const [showNovaMesaModal, setShowNovaMesaModal] = useState(false);
  const [novaMesaNome, setNovaMesaNome] = useState('');

  const handleNovaComandaSubmit = () => {
    const nome = novaMesaNome.trim();
    if (nome && nome.length <= 50) {
      adicionarComanda(nome);
      setShowNovaMesaModal(false);
      setNovaMesaNome('');
    } else if (nome.length > 50) {
      alert("O nome da mesa não pode exceder 50 caracteres.");
    }
  };

  const handleFecharModal = () => {
    setComandaEmFechamento(null);
  };

  const handleProcessarPagamento = (metodo: MetodoPagamento) => {
    if (comandaEmFechamento) {
      fecharComanda(comandaEmFechamento.id, metodo);
      // Removed window.alert to avoid iframe issues, visual feedback can be added later if needed
      setComandaEmFechamento(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#1a1a1e] p-3 rounded-lg border border-gray-800">
        <h2 className="text-lg font-bold text-white">Comandas Ativas</h2>
        <button
          onClick={() => setShowNovaMesaModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 flex items-center gap-1 rounded text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Mesa
        </button>
      </div>

      <div className="space-y-3">
        {comandas.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Nenhuma comanda aberta no momento.</p>
        ) : (
          comandas.map(comanda => {
            const total = comanda.itens.reduce((acc, item) => acc + item.preco, 0);
            return (
              <div key={comanda.id} className="bg-[#1a1a1e] p-4 rounded-lg border-l-4 border-amber-500 space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-white">{comanda.nome}</span>
                  <span className="font-bold text-amber-500 text-lg">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {comanda.itens.length > 0 
                    ? comanda.itens.map(i => i.nome).join(', ') 
                    : 'Nenhum item consumido'}
                </div>
                <div className="grid grid-cols-2 gap-2 py-2">
                  {cardapio.map((produto) => (
                    <button
                      key={produto.id}
                      onClick={() => adicionarItemComanda(comanda.id, produto.nome, produto.preco)}
                      className="bg-[#29292e] text-amber-500 text-xs p-2 rounded border border-gray-700 hover:border-amber-500 hover:bg-[#323238] transition-colors text-left flex flex-col justify-between h-full"
                    >
                      <span className="font-semibold block line-clamp-2">+ {produto.nome}</span>
                      <span className="text-gray-400 mt-1">R$ {produto.preco.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setComandaEmFechamento(comanda)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors text-white py-2 rounded font-bold text-sm mt-2 flex items-center justify-center gap-2"
                >
                  <Banknote className="w-4 h-4" /> Receber Pagamento
                </button>
              </div>
            );
          })
        )}
      </div>

      {showNovaMesaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1e] p-6 rounded-lg w-full max-w-xs space-y-5 border border-gray-800 shadow-xl relative">
             <button onClick={() => setShowNovaMesaModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white">
               <X className="w-5 h-5"/>
             </button>
             <h3 className="text-lg font-bold text-center text-amber-500">Nova Mesa</h3>
             <input 
               type="text"
               value={novaMesaNome}
               onChange={(e) => setNovaMesaNome(e.target.value)}
               maxLength={50}
               placeholder="Nome da Mesa ou Cliente"
               className="w-full p-2.5 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
               autoFocus
               onKeyDown={(e) => e.key === 'Enter' && handleNovaComandaSubmit()}
             />
             <button
               onClick={handleNovaComandaSubmit}
               className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold py-2.5 rounded mt-2"
             >
               Adicionar Mesa
             </button>
          </div>
        </div>
      )}

      {comandaEmFechamento && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1e] p-6 rounded-lg w-full max-w-xs space-y-5 border border-gray-800 shadow-xl relative">
             <button onClick={handleFecharModal} className="absolute top-3 right-3 text-gray-500 hover:text-white">
               <X className="w-5 h-5"/>
             </button>
            
            <h3 className="text-lg font-bold text-center text-amber-500">Fechar Comanda</h3>
            <div className="text-center text-sm text-gray-300">
               <strong>{comandaEmFechamento.nome}</strong><br/>
               <span className="text-2xl text-emerald-400 font-bold mt-1 block">
                  Total: R$ {comandaEmFechamento.itens.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}
               </span>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">Forma de Pagamento</p>
              <button onClick={() => handleProcessarPagamento('Dinheiro')} className="w-full bg-[#202024] hover:bg-emerald-600 hover:text-white border border-gray-700 hover:border-emerald-500 py-3 rounded font-bold text-sm transition flex items-center justify-center gap-2 text-gray-200">
                <Banknote className="w-4 h-4 text-emerald-400"/> Dinheiro
              </button>
              <button onClick={() => handleProcessarPagamento('Pix')} className="w-full bg-[#202024] hover:bg-[#00B4D8] hover:text-white border border-gray-700 hover:border-[#00B4D8] py-3 rounded font-bold text-sm transition flex items-center justify-center gap-2 text-gray-200">
                <Zap className="w-4 h-4 text-[#00B4D8]"/> Pix
              </button>
              <button onClick={() => handleProcessarPagamento('Cartão')} className="w-full bg-[#202024] hover:bg-amber-500 hover:text-black border border-gray-700 hover:border-amber-500 py-3 rounded font-bold text-sm transition flex items-center justify-center gap-2 text-gray-200">
                <CreditCard className="w-4 h-4 text-amber-500"/> Cartão
              </button>
            </div>
            
            <button onClick={handleFecharModal} className="w-full text-xs text-gray-500 hover:text-white pt-2 uppercase font-bold tracking-wider">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
