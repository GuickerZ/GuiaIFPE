import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, GraduationCap, Users, Map } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';
import CurrentClassCard from './CurrentClassCard';

interface TeacherClass {
  disciplina_id: number;
  dia_semana: string;
  horario: string;
  sala: string;
  sala_numero: string;
  sala_bloco: string;
  tipo_aula: string;
  total_alunos: number;
  status_aula: string;
  is_current: boolean;
}

interface TeacherClasses {
  [disciplina: string]: TeacherClass[];
}

interface Student {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  turma: string;
  modalidade: string;
  parentesco?: string;
}

const MobileTeacherView = () => {
  const [classes, setClasses] = useState<TeacherClasses>({});
  const [loading, setLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [nextClass, setNextClass] = useState<any>(null);
  const [testTime, setTestTime] = useState<string>('');
  const { user } = useAuth();
  const { setSelectedStudent } = useStudent();

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
    const fetchClasses = async () => {
      console.log('MobileTeacherView - user:', user);
      console.log('MobileTeacherView - user.tipo:', user?.tipo);
      
      if (user?.tipo !== 'professor') {
        console.log('MobileTeacherView - Usuário não é professor, retornando');
        setLoading(false);
        return;
      }

      try {
        console.log('MobileTeacherView - Buscando aulas do professor...');
        const fetchedClasses: TeacherClasses = await api.getTeacherClasses();
        console.log('MobileTeacherView - Aulas recebidas:', fetchedClasses);
        setClasses(fetchedClasses);

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

        const allClasses: Array<{ aula: TeacherClass; disciplina: string }> = [];
        Object.entries(fetchedClasses).forEach(([disciplina, aulas]) => {
          aulas.forEach(aula => {
            if (aula.dia_semana === currentDay) {
              allClasses.push({ aula, disciplina });
            }
          });
        });

        const todayClasses = allClasses
          .map(({ aula, disciplina }) => {
            const [startHour, startMin] = aula.horario.split(' - ')[0].split(':').map(Number);
            const startTime = startHour * 60 + startMin;
            const [endHour, endMin] = aula.horario.split(' - ')[1].split(':').map(Number);
            const endTime = endHour * 60 + endMin;
            return { 
              ...aula, 
              disciplina,
              startTime, 
              endTime,
              is_current: aula.is_current || (currentTime >= startTime && currentTime <= endTime)
            };
          })
          .sort((a, b) => a.startTime - b.startTime);

        const current = todayClasses.find(c => c.is_current);
        const next = todayClasses.find(c => currentTime < c.startTime);

        console.log('MobileTeacherView - Aula atual:', current);
        console.log('MobileTeacherView - Próxima aula:', next);

        setCurrentClass(current || null);
        setNextClass(next ? next : null);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user, testTime]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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
              Olá,  {user?.nome?.split(' ')[2]}!
            </h1>
            <p className="text-sm text-white/80">
              {currentClass 
                ? "🎯 Você está em aula agora" 
                : nextClass 
                  ? "⏰ Prepare-se para sua próxima aula"
                  : "☕ Sem aulas no momento"}
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

      {/* Aula Atual / Próxima Aula */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
          Sua Aula
        </h2>
        <CurrentClassCard
          currentClass={currentClass}
          nextClass={nextClass}
          userType="professor"
        />
      </div>

      {/* Seção de Dependentes */}
      {user?.alunosResponsaveis && user.alunosResponsaveis.length > 0 && (
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
      )}
    </div>
  );
};

export default MobileTeacherView;
