import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, MapPin, GraduationCap } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';

interface TeacherClass {
  disciplina_id: number;
  dia_semana: string;
  horario: string;
  sala: string;
  sala_numero: string;
  sala_bloco: string;
  tipo_aula: string;
  total_alunos: number;
  aluno_ids: number[];
  alunos_nomes: string;
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
  status_atual?: string;
  sala_atual?: string;
}

const TeacherDashboard = () => {
  const [classes, setClasses] = useState<TeacherClasses>({});
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const { user } = useAuth();
  const { setSelectedStudent } = useStudent();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await api.getTeacherClasses();
        setClasses(classes);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.tipo === 'professor') {
      fetchClasses();
    }
  }, [user]);

  const handleDisciplineClick = async (disciplina: string, disciplineId?: number) => {
    setSelectedDiscipline(disciplina);
    setStudentsLoading(true);
    
    try {
      // Por enquanto, buscar todos os alunos do professor
      const students = await api.getTeacherStudents();
      setStudents(students);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

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

  const getDayDisplayName = (day: string) => {
    const days = {
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira',
      'sabado': 'Sábado'
    };
    return days[day as keyof typeof days] || day;
  };

  const getTypeDisplayName = (type: string) => {
    const types = {
      'teorica': 'Teórica',
      'pratica': 'Prática',
      'laboratorio': 'Laboratório'
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando aulas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Aulas</h1>
          <p className="text-muted-foreground">Prof. {user?.nome}</p>
        </div>
      </div>

      {!selectedDiscipline ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(classes).map(([subject, subjectClasses]) => (
            <div key={subject} className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject}</h3>
                <p className="text-sm text-gray-600">
                  {subjectClasses.length} {subjectClasses.length === 1 ? 'aula' : 'aulas'} na semana
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {subjectClasses.map((classItem: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-l-4 ${
                        classItem.is_current 
                          ? 'bg-green-50 border-l-green-500 border border-green-200' 
                          : 'bg-gray-50 border-l-blue-500 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {classItem.dia_semana}
                            </span>
                            {classItem.is_current && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium animate-pulse">
                                ● Aula Atual
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <Clock size={14} className="inline mr-1" />
                            {classItem.horario}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <MapPin size={14} className="inline mr-1" />
                            Sala {classItem.sala} - Bloco {classItem.sala_bloco}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {classItem.tipo_aula}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {classItem.total_alunos} alunos
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleDisciplineClick(subject)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ver Alunos ({classItem.total_alunos})
                        </button>
                        {classItem.is_current && (
                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('navigate-to-map', { 
                                detail: { 
                                  room: classItem.sala_numero,
                                  block: classItem.sala_bloco
                                }
                              }));
                            }}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <MapPin size={12} />
                            Ir para Sala
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alunos - {selectedDiscipline}</h2>
            <Button variant="outline" onClick={() => setSelectedDiscipline(null)}>
              Voltar às Disciplinas
            </Button>
          </div>

          {studentsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Carregando alunos...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {students.map((student) => (
                <Card key={student.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">{student.nome}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Mat: {student.matricula}</span>
                          <span>{student.curso}</span>
                          <span>Turma: {student.turma}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {student.modalidade}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        {student.status_atual === 'presente' && student.sala_atual && (
                          <Badge variant="default" className="text-xs">
                            Na sala {student.sala_atual}
                          </Badge>
                        )}
                        <Button size="sm" onClick={() => handleStudentSelect(student)}>
                          Ver Dados
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;