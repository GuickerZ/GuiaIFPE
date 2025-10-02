import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, LoginRequest, LoginResponse } from '@/services/api';

interface AuthUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'aluno' | 'responsavel' | 'admin' | 'professor';
  aluno?: {
    id: number;
    matricula: string;
    cpf: string;
    telefone: string;
    curso: string;
    turma: string;
    modalidade: 'integrado' | 'subsequente';
  };
  responsavel?: {
    id: number;
    cpf: string;
    telefone: string;
  };
  professor?: {
    id: number;
    cpf: string;
    telefone: string;
  };
  alunosResponsaveis?: Array<{
    id: number;
    nome: string;
    matricula: string;
    curso: string;
    turma: string;
    modalidade: 'integrado' | 'subsequente';
    parentesco: string;
  }>;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          const response = await api.verifyToken();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Token inválido, remover
        await api.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await api.login(credentials);
      console.log('AuthContext - Login response:', response);
      console.log('AuthContext - User data:', response.user);
      console.log('AuthContext - User tipo:', response.user.tipo);
      setUser(response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};