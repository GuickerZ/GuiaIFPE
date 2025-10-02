import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ cpf });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md text-white rounded-b-[3rem]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 blur-2xl"></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10 p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Guia IFPE</h1>
            </div>
          </div>
          <p className="text-sm text-white/80">Instituto Federal de Pernambuco - Campus Garanhuns</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-2 bg-gradient-to-br from-blue-50/50 to-green-50/50 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Acesso</CardTitle>
            <CardDescription className="text-muted-foreground">
              Digite seu CPF para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-foreground font-medium">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  disabled={loading}
                  className="text-center text-lg font-mono rounded-2xl border-2 focus:border-blue-500 transition-colors h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-br from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl h-12 text-base font-semibold shadow-lg active:scale-95 transition-all" 
                disabled={loading || cpf.length < 14}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border border-blue-200/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>CPF Aluno: 100.200.300-02</strong><br />
                <strong>CPF Responsável: 200.300.400-08</strong><br />
                <strong>CPF Professor: 666.777.888-99</strong><br />
                <strong>CPF Professor-Responsável: 777.888.999-00</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;