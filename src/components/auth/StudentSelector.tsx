import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, User, LogOut } from 'lucide-react';

const StudentSelector = () => {
  const { user, logout } = useAuth();
  const { setSelectedStudent } = useStudent();

  const handleStudentSelect = (student: any) => {
    setSelectedStudent({
      id: student.id,
      nome: student.nome,
      matricula: student.matricula,
      cpf: '', // CPF não é retornado na lista de alunos responsáveis
      email: '', // Email não é retornado na lista de alunos responsáveis
      telefone: '',
      curso: student.curso,
      turma: student.turma,
      modalidade: student.modalidade
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user?.alunosResponsaveis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Guia IFPE</h1>
                <p className="text-xs text-primary-foreground/80">Instituto Federal de Pernambuco - Campus Garanhuns</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <LogOut size={16} />
            </Button>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2">
              <User size={16} className="text-white/80" />
              <p className="text-sm font-medium text-white">Olá, {user.nome}</p>
            </div>
            <p className="text-xs text-white/80 mt-1">Selecione qual estudante você deseja acompanhar:</p>
          </div>
        </div>
      </div>

      {/* Student Selection */}
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {user.alunosResponsaveis.map((student) => (
            <Card 
              key={student.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border-none shadow-sm"
              onClick={() => handleStudentSelect(student)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{student.nome}</h3>
                      <Badge variant="outline" className="text-xs">
                        {student.parentesco}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        <strong>Matrícula:</strong> {student.matricula}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Curso:</strong> {student.curso}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Turma:</strong> {student.turma}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {student.modalidade.charAt(0).toUpperCase() + student.modalidade.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap size={20} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSelector;