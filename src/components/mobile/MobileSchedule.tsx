import { useState, useEffect } from "react";
import { Clock, MapPin, User, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveStudent } from "@/hooks/useActiveStudent";
import { api } from "@/services/api";
import { useMapNavigation } from "@/hooks/useMapNavigation";

const MobileSchedule = () => {
  const { student } = useActiveStudent();
  const { navigateToMap } = useMapNavigation();
  const [schedule, setSchedule] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!student?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const scheduleData = await api.getStudentSchedule(student.id);
        setSchedule(scheduleData);
      } catch (error) {
        console.error('Erro ao buscar horários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [student?.id]);
  
  // Se não há aluno disponível, mostra mensagem
  if (!student) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum aluno selecionado
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Para visualizar o horário de aulas, selecione primeiro um aluno na aba "Busca".
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando horários...</p>
        </div>
      </div>
    );
  }

  const days = [
    { key: "segunda", label: "SEG" },
    { key: "terca", label: "TER" },
    { key: "quarta", label: "QUA" },
    { key: "quinta", label: "QUI" },
    { key: "sexta", label: "SEX" }
  ];

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case "teorica": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pratica": return "bg-green-100 text-green-800 border-green-200";
      case "projeto": return "bg-purple-100 text-purple-800 border-purple-200";
      case "seminario": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">
            Horário - {student.nome.split(' ')[0]}
          </h2>
          <Clock size={24} />
        </div>
        <p className="text-white/80 text-sm relative z-10">
          {student.turma} - {student.curso}
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

        {days.map((day) => {
          const dayClasses = schedule[day.key] || [];
          return (
            <TabsContent key={day.key} value={day.key} className="space-y-3">
              {dayClasses && dayClasses.length > 0 ? (
                dayClasses.map((aula: any, index: number) => (
                <Card key={index} className={`border-l-4 ${aula.is_current ? 'border-l-green-500' : 'border-l-blue-500'} rounded-2xl shadow-lg border-none`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-600">
                            {aula.time}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSubjectTypeColor(aula.type)}`}>
                            {aula.type}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                        <Book size={18} className="text-blue-600" />
                        {aula.subject}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} />
                          <span>{aula.teacher}</span>
                        </div>
                        <button 
                          onClick={() => {
                            // Extrair número da sala e bloco se possível
                            const roomMatch = aula.room?.match(/^([A-E]|Biblioteca|Banheiros)(.+)$/);
                            const bloco = roomMatch?.[1] || undefined;
                            const numeroSala = roomMatch?.[2] || aula.room;
                            console.log('Schedule - Navegando:', numeroSala, bloco);
                            navigateToMap(numeroSala, bloco);
                          }}
                          className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all active:scale-95 font-medium"
                        >
                          <MapPin size={16} />
                          <span>Sala {aula.room}</span>
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
          );
        })}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Book className="text-blue-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">20</p>
            <p className="text-xs text-gray-600">Aulas/Semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Clock className="text-green-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">40h</p>
            <p className="text-xs text-gray-600">Carga Horária</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <User className="text-purple-600" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-800">12</p>
            <p className="text-xs text-gray-600">Professores</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileSchedule;
