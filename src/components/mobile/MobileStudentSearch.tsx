import React from 'react';
import { User, Clock, GraduationCap, ChevronLeft } from 'lucide-react';
import { useStudent } from '@/contexts/StudentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveStudent } from '@/hooks/useActiveStudent';
import { StudentInfoDisplay } from './StudentInfoDisplay';
import { Button } from '@/components/ui/button';

interface Student {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  turma: string;
  modalidade: string;
  parentesco?: string;
}

const MobileStudentSearchReal = () => {
  const { setSelectedStudent, selectedStudent } = useStudent();
  const { user } = useAuth();
  const { student: activeStudent, isViewingDependent } = useActiveStudent();

  // Debug logs
  console.log('MobileStudentSearch - user:', user);
  console.log('MobileStudentSearch - user.tipo:', user?.tipo);
  console.log('MobileStudentSearch - selectedStudent:', selectedStudent);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      nome: student.nome,
      matricula: student.matricula,
      cpf: '',
      email: '',
      telefone: '',
      curso: student.curso,
      turma: student.turma,
      modalidade: student.modalidade as 'integrado' | 'subsequente'
    });
  };

  const handleClearSelection = () => {
    setSelectedStudent(null);
  };

  // Se é aluno logado, sempre mostrar suas informações
  if (user?.tipo === 'aluno') {
    return (
      <div className="p-4 space-y-6">
        {activeStudent && (
          <StudentInfoDisplay
            student={activeStudent}
            isViewingAsDependent={false}
          />
        )}
      </div>
    );
  }

  // Se é professor sem dependentes, não deve mostrar nada aqui
  // (a página Index.tsx já renderiza MobileTeacherView para professores)
  if (user?.tipo === 'professor' && !selectedStudent) {
    return null;
  }

  // Se é responsável ou professor e selecionou um dependente, mostrar informações do dependente
  if (selectedStudent && activeStudent) {
    return (
      <div className="p-4 space-y-6">
        {/* Botão de voltar */}
        <Button
          variant="outline"
          onClick={handleClearSelection}
          className="w-full flex items-center justify-center gap-2"
        >
          <ChevronLeft size={18} />
          Voltar para lista de dependentes
        </Button>

        <StudentInfoDisplay
          student={activeStudent}
          isViewingAsDependent={true}
          onClose={handleClearSelection}
        />
      </div>
    );
  }

  // Responsável sem dependente selecionado - mostrar lista de dependentes
  return (
    <div className="p-4 space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
            <GraduationCap size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              Olá, {user?.nome?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-white/80">
              👤 Responsável
            </p>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('change-tab', { detail: { tab: 'mapa' } }));
          }}
          className="relative z-10 w-full bg-white/20 backdrop-blur-sm rounded-2xl p-3.5 border border-white/30 hover:bg-white/30 active:scale-95 transition-all mt-4 shadow-lg"
        >
          <p className="text-xs font-medium text-white mb-1">🗺️ Mapa do Campus</p>
          <p className="text-xs text-white/80">Localizar salas e dependências</p>
        </button>
      </div>

      {/* Seção de Dependentes */}
      {user?.alunosResponsaveis && user.alunosResponsaveis.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {user.alunosResponsaveis.length === 1 ? 'Seu Dependente' : 'Seus Dependentes'} ({user.alunosResponsaveis.length})
          </h2>
          <div className="bg-white rounded-3xl shadow-xl border-none overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 px-5 py-3.5 border-b border-gray-100">
              <p className="text-xs text-muted-foreground">
                Toque em um dependente para ver suas informações e horários
              </p>
            </div>
            <div className="p-4 space-y-3">
              {user.alunosResponsaveis.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => handleStudentSelect(aluno)}
                  className="w-full text-left p-5 bg-gradient-to-br from-blue-50/50 to-green-50/50 hover:from-blue-100/50 hover:to-green-100/50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg group active:scale-95"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md">
                          {aluno.nome.charAt(0)}
                        </div>
                        <p className="font-semibold text-foreground text-base truncate">
                          {aluno.nome}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">Mat:</span> 
                          {aluno.matricula}
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <span className="font-medium text-foreground">Curso:</span> 
                          {aluno.curso}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">Turma:</span> 
                          {aluno.turma} • {aluno.modalidade}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full font-medium shadow-md">
                        {aluno.parentesco}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full font-medium group-hover:bg-green-200 transition-colors shadow-sm">
                        <Clock size={12} />
                        Ver detalhes
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 text-yellow-900 mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <span className="font-bold text-base">Nenhum dependente vinculado</span>
          </div>
          <p className="text-sm text-yellow-800 leading-relaxed">
            Entre em contato com a secretaria acadêmica para vincular dependentes à sua conta e acompanhar suas atividades.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileStudentSearchReal;