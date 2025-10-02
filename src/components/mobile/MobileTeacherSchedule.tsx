import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Book, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useMapNavigation } from '@/hooks/useMapNavigation';

interface TeacherClass {
  disciplina_id: number;
  dia_semana: string;
  horario: string;
  sala: string;
  sala_numero: string;
  sala_bloco: string;
  tipo_aula: string;
  total_alunos: number;
  is_current: boolean;
}

interface TeacherClasses {
  [disciplina: string]: TeacherClass[];
}

const MobileTeacherSchedule = () => {
  const [classes, setClasses] = useState<TeacherClasses>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { navigateToMap } = useMapNavigation();

  const days = [
    { key: "segunda", label: "SEG" },
    { key: "terca", label: "TER" },
    { key: "quarta", label: "QUA" },
    { key: "quinta", label: "QUI" },
    { key: "sexta", label: "SEX" }
  ];

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

  // Organizar aulas por dia da semana
  const getClassesForDay = (day: string) => {
    const dayClasses: Array<{ aula: TeacherClass; disciplina: string }> = [];
    
    Object.entries(classes).forEach(([disciplina, aulas]) => {
      aulas.forEach(aula => {
        if (aula.dia_semana === day) {
          dayClasses.push({ aula, disciplina });
        }
      });
    });
    
    // Ordenar por horário
    return dayClasses.sort((a, b) => a.aula.horario.localeCompare(b.aula.horario));
  };

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case "teorica": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pratica": return "bg-green-100 text-green-800 border-green-200";
      case "projeto": return "bg-purple-100 text-purple-800 border-purple-200";
      case "seminario": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">
            Horário - Prof. {user?.nome?.split(' ')[0]}
          </h2>
          <Clock size={24} />
        </div>
        <p className="text-white/80 text-sm relative z-10">
          Suas aulas da semana
        </p>
      </div>

      {/* Schedule Tabs */}
      <Tabs defaultValue="segunda" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          {days.map((day) => (
            <TabsTrigger key={day.key} value={day.key} className="text-xs">
              {day.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day.key} value={day.key} className="space-y-3">
            {getClassesForDay(day.key).length > 0 ? (
              getClassesForDay(day.key).map(({ aula, disciplina }, index) => (
                <Card key={index} className={`border-l-4 ${aula.is_current ? 'border-l-green-500' : 'border-l-blue-500'} rounded-2xl shadow-lg border-none`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-600">
                          {aula.horario}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSubjectTypeColor(aula.tipo_aula)}`}>
                          {aula.tipo_aula}
                        </span>
                      </div>
                      {aula.is_current && (
                        <Badge variant="default" className="bg-green-500 text-xs rounded-full">
                          ● Agora
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                      <Book size={18} className="text-blue-600" />
                      {disciplina}
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{aula.total_alunos} alunos</span>
                      </div>
                      <button 
                        onClick={() => {
                          console.log('TeacherSchedule - Navegando:', aula.sala_numero, aula.sala_bloco);
                          navigateToMap(aula.sala_numero, aula.sala_bloco);
                        }}
                        className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all active:scale-95 font-medium"
                      >
                        <MapPin size={16} />
                        <span>Sala {aula.sala} - Bloco {aula.sala_bloco}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                <p>Nenhuma aula para este dia</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Book className="text-blue-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">
              {Object.values(classes).reduce((acc, aulas) => acc + aulas.length, 0)}
            </p>
            <p className="text-xs text-gray-600">Aulas/Semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Clock className="text-green-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">
              {Object.keys(classes).length}
            </p>
            <p className="text-xs text-gray-600">Disciplinas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Users className="text-purple-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">
              {Object.values(classes).reduce((acc, aulas) => {
                const uniqueStudents = new Set(aulas.map(a => a.total_alunos));
                return acc + Array.from(uniqueStudents).reduce((sum, num) => sum + num, 0);
              }, 0)}
            </p>
            <p className="text-xs text-gray-600">Total Alunos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileTeacherSchedule;
