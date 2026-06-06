/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ComandasView } from './components/ComandasView';
import { GastosView } from './components/GastosView';
import { CaixaView } from './components/CaixaView';
import { CardapioView } from './components/CardapioView';
import { FaturamentoView } from './components/FaturamentoView';
import { Navigation } from './components/Navigation';
import { useDataStore } from './hooks/useDataStore';
import { TelaAtiva } from './types';
import { useAuth } from './AuthContext';
import { LogOut, Loader2, KeyRound, User as UserIcon } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, signInMaster, resetPassword, logOut } = useAuth();
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('comandas');
  
  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetando, setIsResetando] = useState(false);

  const {
    comandas,
    caixaMetodos,
    gastos,
    cardapio,
    rendimentos,
    adicionarComanda,
    adicionarItemComanda,
    fecharComanda,
    lancarGasto,
    limparDados,
    adicionarProduto,
    removerProduto,
    loading: storeLoading
  } = useDataStore(user?.uid || null);

  useEffect(() => {
    document.body.className = 'bg-[#121214] text-[#e1e1e6] selection:bg-amber-500/30';
  }, []);

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setIsLoggingIn(true);
    const result = await signInMaster(loginUser, loginSenha);
    if (result !== true) {
      setLoginError(result as string);
    }
    setIsLoggingIn(false);
  };

  const handleResetPassword = async () => {
    if (!loginUser) {
      setLoginError('Por favor, informe seu usuário para redefinir a senha.');
      return;
    }
    setLoginError('');
    setLoginSuccess('');
    setIsResetando(true);
    const result = await resetPassword(loginUser);
    if (result === true) {
      setLoginSuccess('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } else {
      setLoginError(result as string);
    }
    setIsResetando(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center p-4">
         <div className="bg-[#1a1a1e] p-8 rounded-lg shadow-xl border border-gray-800 text-center max-w-sm w-full space-y-6">
           <div>
             <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">O'Neal Grill</h1>
             <p className="text-gray-400 text-sm mt-2">Sistema de Gestão</p>
           </div>
           
           <form onSubmit={handleMasterLogin} className="space-y-4">
             {loginError && (
               <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded text-left">
                 {loginError}
               </div>
             )}
             {loginSuccess && (
               <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-xs p-3 rounded text-left">
                 {loginSuccess}
               </div>
             )}
             
             <div className="relative">
               <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
               <input 
                 type="text" 
                 required
                 maxLength={64}
                 value={loginUser}
                 onChange={(e) => setLoginUser(e.target.value)}
                 placeholder="Usuário" 
                 className="w-full pl-10 pr-3 py-3 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
               />
             </div>
             
             <div className="relative">
               <KeyRound className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
               <input 
                 type="password" 
                 required
                 maxLength={128}
                 value={loginSenha}
                 onChange={(e) => setLoginSenha(e.target.value)}
                 placeholder="Senha" 
                 className="w-full pl-10 pr-3 py-3 rounded bg-[#202024] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
               />
             </div>
             
             <button 
               type="submit"
               disabled={isLoggingIn || isResetando}
               className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
             >
               {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Sistema"}
             </button>

             <button 
               type="button"
               onClick={handleResetPassword}
               disabled={isLoggingIn || isResetando}
               className="w-full mt-2 text-gray-400 hover:text-amber-500 text-xs underline decoration-transparent hover:decoration-amber-500 transition-all flex justify-center items-center h-6"
             >
               {isResetando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Esqueci minha senha"}
             </button>
           </form>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] pb-24 font-sans">
      <div className="max-w-md mx-auto p-4">
        <header className="relative text-center my-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-start mb-2">
            <div className="flex flex-col items-start">
               <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Usuário Logado</span>
               <span className="text-sm text-gray-300">{user.email?.replace('@onealgrill.com', '')}</span>
            </div>
            <button onClick={logOut} className="text-gray-500 hover:text-red-400 p-2 transition-colors">
              <LogOut className="w-5 h-5"/>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight mt-2">O'Neal Grill</h1>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold">Sistema de Caixa</p>
        </header>

        {(storeLoading) ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {telaAtiva === 'comandas' && (
              <ComandasView 
                comandas={comandas}
                cardapio={cardapio}
                adicionarComanda={adicionarComanda}
                adicionarItemComanda={adicionarItemComanda}
                fecharComanda={fecharComanda}
              />
            )}

            {telaAtiva === 'gastos' && user?.email?.startsWith('master') && (
              <GastosView 
                gastos={gastos}
                lancarGasto={lancarGasto}
              />
            )}

            {telaAtiva === 'caixa' && user?.email?.startsWith('master') && (
              <CaixaView 
                caixaMetodos={caixaMetodos}
                gastos={gastos}
                limparDados={limparDados}
              />
            )}

            {telaAtiva === 'cardapio' && (
              <CardapioView 
                cardapio={cardapio}
                adicionarProduto={adicionarProduto}
                removerProduto={removerProduto}
              />
            )}

            {telaAtiva === 'faturamento' && user?.email?.startsWith('master') && (
              <FaturamentoView 
                rendimentos={rendimentos}
                gastos={gastos}
              />
            )}
          </main>
        )}
      </div>

      <Navigation telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} userEmail={user?.email} />
    </div>
  );
}

