import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInMaster: (usuario: string, senha: string) => Promise<boolean | string>;
  resetPassword: (usuario: string) => Promise<boolean | string>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInMaster = async (usuario: string, senha: string) => {
    const email = usuario.includes('@') ? usuario : `${usuario}@onealgrill.com`;
    try {
      // Tenta logar
      await signInWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (error: any) {
      // Verifica se o provedor de Email/Senha está desativado no Firebase
      if (error.code === 'auth/operation-not-allowed') {
        return "Erro: Faça login no console do Firebase, acesse 'Authentication' e ative o provedor de 'Email/Senha'.";
      }
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        return "Credenciais inválidas ou usuário não autorizado.";
      }
      return error.message;
    }
  };

  const resetPassword = async (usuario: string) => {
    const email = usuario.includes('@') ? usuario : `${usuario}@onealgrill.com`;
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return "Usuário não encontrado.";
      }
      return error.message;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInMaster, resetPassword, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
