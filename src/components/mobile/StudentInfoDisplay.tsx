import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, GraduationCap, Clock, BookOpen, X, Map } from 'lucide-react';
import CurrentClassCard from './CurrentClassCard';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface StudentInfoDisplayProps {
  student: {
    id?: number;
    nome: string;
    matricula: string;
    cpf: string;
    email?: string;
    telefone?: string;
    curso: string;
    turma: string;
    modalidade: 'integrado' | 'subsequente';
  };
  isViewingAsDependent?: boolean;
  onClose?: () => void;
}

export const StudentInfoDisplay: React.FC<StudentInfoDisplayProps> = ({ 
  student, 
  isViewingAsDependent = false, 
  onClose
}) => {
  const { user } = useAuth();
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [nextClass, setNextClass] = useState<any>(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [testTime, setTestTime] = useState<string>('');

  // Listen for test time changes
  useEffect(() => {
    const handleTestTimeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setTestTime(customEvent.detail?.time || '');
    };

    window.addEventListener('test-time-change', handleTestTimeChange);
    return () => {
      window.removeEventListener('test-time-change', handleTestTimeChange);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentAndNextClass = async () => {
      if (!student?.id) {
        setLoadingClasses(false);
        return;
      }

      try {
        setLoadingClasses(true);
        const scheduleData: any = await api.getStudentSchedule(student.id);
        
        // Flatten all classes from schedule object
        const allClasses: any[] = [];
        Object.entries(scheduleData).forEach(([dia, classes]: [string, any]) => {
          if (Array.isArray(classes)) {
            classes.forEach((c: any) => {
              allClasses.push({
                dia_semana: dia,
                horario: c.time,
                disciplina: c.subject,
                professor: c.teacher,
                sala: c.room,
                tipo_aula: c.type
              });
            });
          }
        });
        
        // Encontrar aula atual e próxima
        const now = new Date();
        const currentDay = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][now.getDay()];
        
        // Use test time if available, otherwise use current time
        let currentTime: number;
        if (testTime) {
          const [hours, minutes] = testTime.split(':').map(Number);
          currentTime = hours * 60 + minutes;
        } else {
          currentTime = now.getHours() * 60 + now.getMinutes();
        }

        const todayClasses = allClasses
          .filter((h: any) => h.dia_semana === currentDay)
          .map((h: any) => {
            const [startHour, startMin] = h.horario.split(' - ')[0].split(':').map(Number);
            const startTime = startHour * 60 + startMin;
            const [endHour, endMin] = h.horario.split(' - ')[1].split(':').map(Number);
            const endTime = endHour * 60 + endMin;
            return { ...h, startTime, endTime };
          })
          .sort((a: any, b: any) => a.startTime - b.startTime);

        // Aula atual
        const current = todayClasses.find((c: any) => 
          currentTime >= c.startTime && currentTime <= c.endTime
        );

        // Próxima aula
        const next = todayClasses.find((c: any) => 
          currentTime < c.startTime
        );

        setCurrentClass(current ? { ...current, is_current: true } : null);
        setNextClass(next ? { ...next, is_current: false } : null);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchCurrentAndNextClass();
  }, [student?.id, testTime]);
  return (
    <div className="space-y-6">
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
              {isViewingAsDependent ? student.nome : `Olá, ${student.nome?.split(' ')[0]}!`}
            </h1>
            <p className="text-sm text-white/80">
              {isViewingAsDependent 
                ? `Mat: ${student.matricula}` 
                : user?.tipo === 'aluno' 
                  ? '🎓 Estudante' 
                  : '👤 Responsável'}
            </p>
          </div>
        </div>
        
        {/* Quick Navigation Buttons */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 mt-4">
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('change-tab', { detail: { tab: 'horario' } }));
            }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-3.5 border border-white/30 hover:bg-white/30 active:scale-95 transition-all shadow-lg"
          >
            <p className="text-xs font-medium text-white mb-1">📚 Horários</p>
            <p className="text-xs text-white/80">Ver todas as aulas</p>
          </button>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('change-tab', { detail: { tab: 'mapa' } }));
            }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-3.5 border border-white/30 hover:bg-white/30 active:scale-95 transition-all shadow-lg"
          >
            <p className="text-xs font-medium text-white mb-1">🗺️ Mapa</p>
            <p className="text-xs text-white/80">Localizar salas</p>
          </button>
        </div>
      </div>

      {/* Card de Aula Atual/Próxima */}
      {!loadingClasses && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {isViewingAsDependent ? 'Aula do Dependente' : 'Sua Aula'}
          </h3>
          <CurrentClassCard
            currentClass={currentClass}
            nextClass={nextClass}
            userType="aluno"
          />
        </div>
      )}

      {/* Informações Acadêmicas */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
          Informações Acadêmicas
        </h3>
        <div className="bg-white rounded-3xl shadow-xl border-none overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Nome Completo</p>
                <p className="font-semibold text-gray-900 break-words text-base">{student.nome}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Matrícula</p>
                <p className="font-semibold text-gray-900 text-base">{student.matricula}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Curso</p>
                <p className="font-semibold text-gray-900 break-words text-base">{student.curso}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Turma</p>
                <p className="font-semibold text-gray-900 text-base">{student.turma}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Modalidade</p>
                <p className="font-semibold text-gray-900 text-base">
                  {student.modalidade === 'integrado' ? 'Técnico Integrado' : 'Técnico Subsequente'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações de Contato */}
      {(student.email || student.telefone) && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Contato
          </h3>
          <div className="bg-white rounded-3xl shadow-xl border-none overflow-hidden">
            <div className="p-5 space-y-4">
              {student.email && (
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">E-mail</p>
                    <p className="font-semibold text-gray-900 break-all text-base">{student.email}</p>
                  </div>
                </div>
              )}
              {student.telefone && (
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Telefone</p>
                    <p className="font-semibold text-gray-900 text-base">{student.telefone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
