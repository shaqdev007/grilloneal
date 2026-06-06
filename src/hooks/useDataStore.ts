import { useState, useEffect } from 'react';
import { Comanda, CaixaMetodos, Gasto, MetodoPagamento, ProdutoCardapio, Rendimento } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const DEFAULT_CAIXA: CaixaMetodos = { Dinheiro: 0, Pix: 0, Cartão: 0 };

export function useDataStore(userId: string | null) {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [caixaMetodos, setCaixaMetodos] = useState<CaixaMetodos>(DEFAULT_CAIXA);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cardapio, setCardapio] = useState<ProdutoCardapio[]>([]);
  const [rendimentos, setRendimentos] = useState<Rendimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setComandas([]);
      setCaixaMetodos(DEFAULT_CAIXA);
      setGastos([]);
      setCardapio([]);
      setRendimentos([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubComandas = onSnapshot(collection(db, 'users', userId, 'comandas'), (snapshot) => {
      setComandas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comanda)));
    });

    const unsubGastos = onSnapshot(collection(db, 'users', userId, 'gastos'), (snapshot) => {
      setGastos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gasto)));
    });

    const unsubCardapio = onSnapshot(collection(db, 'users', userId, 'cardapio'), (snapshot) => {
      setCardapio(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProdutoCardapio)));
    });

    const unsubRendimentos = onSnapshot(collection(db, 'users', userId, 'rendimentos'), (snapshot) => {
      setRendimentos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rendimento)));
    });

    const unsubCaixa = onSnapshot(doc(db, 'users', userId, 'caixa', 'atual'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCaixaMetodos({ Dinheiro: data.Dinheiro, Pix: data.Pix, Cartão: data['Cartão'] });
      } else {
        setCaixaMetodos(DEFAULT_CAIXA);
        // Create it initially
        setDoc(doc(db, 'users', userId, 'caixa', 'atual'), { ...DEFAULT_CAIXA, userId }).catch(console.error);
      }
      setLoading(false);
    });

    return () => {
      unsubComandas();
      unsubGastos();
      unsubCardapio();
      unsubRendimentos();
      unsubCaixa();
    };
  }, [userId]);

  const adicionarComanda = async (nome: string) => {
    if (!userId) return;
    const sanitizedNome = nome.trim().substring(0, 50);
    if (!sanitizedNome) return;
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, 'users', userId, 'comandas', id), {
        nome: sanitizedNome,
        itens: [],
        createdAt: Date.now(),
        userId
      });
    } catch (e) { console.error('Error adding comanda', e); }
  };

  const adicionarItemComanda = async (comandaId: string, nomeProduto: string, preco: number) => {
    if (!userId) return;
    if (!nomeProduto.trim() || isNaN(preco) || preco < 0 || preco > 100000) return;
    const comanda = comandas.find(c => c.id === comandaId);
    if (!comanda) return;
    try {
      const novosItens = [...comanda.itens, { id: Date.now().toString() + Math.random(), nome: nomeProduto.trim().substring(0, 50), preco }];
      await updateDoc(doc(db, 'users', userId, 'comandas', comandaId), {
        itens: novosItens
      });
    } catch (e) { console.error('Error adding item', e); }
  };

  const fecharComanda = async (comandaId: string, metodo: MetodoPagamento) => {
    if (!userId) return;
    const comanda = comandas.find((c) => c.id === comandaId);
    if (!comanda) return;

    const total = comanda.itens.reduce((acc, item) => acc + item.preco, 0);
    const novoCaixa = { ...caixaMetodos, [metodo]: caixaMetodos[metodo] + total };

    try {
      await updateDoc(doc(db, 'users', userId, 'caixa', 'atual'), {
        [metodo]: novoCaixa[metodo]
      });
      // Registrar rendimento
      if (total > 0) {
        await setDoc(doc(db, 'users', userId, 'rendimentos', Date.now().toString()), {
          valor: total,
          metodo,
          data: new Date().toISOString(),
          userId
        });
      }
      await deleteDoc(doc(db, 'users', userId, 'comandas', comandaId));
    } catch (e) { console.error('Error closing comanda', e); }
  };

  const adicionarProduto = async (nome: string, preco: number) => {
    if (!userId) return;
    const sanitizedNome = nome.trim().substring(0, 50);
    if (!sanitizedNome || isNaN(preco) || preco <= 0 || preco > 100000) return;
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, 'users', userId, 'cardapio', id), {
        nome: sanitizedNome,
        preco,
        userId
      });
    } catch (e) { console.error('Error adding product', e); }
  };

  const removerProduto = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'cardapio', id));
    } catch (e) { console.error('Error removing product', e); }
  };

  const lancarGasto = async (descricao: string, valor: number) => {
    if (!userId) return;
    const sanitizedDesc = descricao.trim().substring(0, 100);
    if (!sanitizedDesc || isNaN(valor) || valor <= 0 || valor > 100000) return;
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, 'users', userId, 'gastos', id), {
        descricao: sanitizedDesc,
        valor,
        data: new Date().toISOString(),
        userId
      });
    } catch (e) { console.error('Error adding gasto', e); }
  };

  const limparDados = async () => {
    if (!userId) return;
    try {
      // In a real app we'd batch delete, but for simplicity we iterate.
      for (const c of comandas) await deleteDoc(doc(db, 'users', userId, 'comandas', c.id));
      for (const g of gastos) await deleteDoc(doc(db, 'users', userId, 'gastos', g.id));
      // Reset caixa
      await setDoc(doc(db, 'users', userId, 'caixa', 'atual'), { ...DEFAULT_CAIXA, userId });
    } catch (e) { console.error('Error clearing data', e); }
  };

  return {
    comandas,
    caixaMetodos,
    gastos,
    cardapio,
    rendimentos,
    loading,
    adicionarComanda,
    adicionarItemComanda,
    fecharComanda,
    lancarGasto,
    limparDados,
    adicionarProduto,
    removerProduto
  };
}
