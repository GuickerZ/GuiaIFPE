
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useActiveStudent } from "@/hooks/useActiveStudent";

const MobileCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedModality, setSelectedModality] = useState<'integrado' | 'subsequente'>('subsequente');
  const { student } = useActiveStudent();
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Define modalidade baseada no aluno ativo
  useEffect(() => {
    if (student?.modalidade) {
      setSelectedModality(student.modalidade);
    }
  }, [student]);

  // Dados reais do Calendário Acadêmico 2025.2 - Superior/Integrado
  const eventsIntegrado = [
    // Agosto
    { date: "2025-08-26", endDate: "2025-08-28", title: "Matrícula (veteranos)", type: "matricula" },
    // Setembro
    { date: "2025-09-01", title: "Início das Aulas / Aula Magna", type: "importante" },
    { date: "2025-09-07", title: "Independência do Brasil", type: "feriado" },
    { date: "2025-09-10", endDate: "2025-09-13", title: "Jogos Interclasse", type: "evento" },
    { date: "2025-09-19", title: "Prazo final - Ajustes de matrícula", type: "prazo" },
    { date: "2025-09-30", title: "Entrega Plano de Trabalho Docente", type: "prazo" },
    // Outubro
    { date: "2025-10-01", title: "15 anos do IFPE Campus Garanhuns", type: "evento" },
    { date: "2025-10-12", title: "Nossa Senhora Aparecida", type: "feriado" },
    { date: "2025-10-15", title: "Dia do Professor", type: "academico" },
    { date: "2025-10-20", endDate: "2025-10-26", title: "Semana Nacional de Ciência e Tecnologia", type: "evento" },
    { date: "2025-10-31", title: "Término da Unidade I", type: "importante" },
    // Novembro
    { date: "2025-11-02", title: "Finados", type: "feriado" },
    { date: "2025-11-03", title: "Início da Unidade II", type: "importante" },
    { date: "2025-11-15", title: "Proclamação da República", type: "feriado" },
    { date: "2025-11-20", title: "Dia da Consciência Negra", type: "feriado" },
    // Dezembro
    { date: "2025-12-24", title: "Véspera de Natal (Recesso)", type: "recesso" },
    { date: "2025-12-25", title: "Natal", type: "feriado" },
    { date: "2025-12-26", title: "Recesso", type: "recesso" },
    { date: "2025-12-31", title: "Véspera de Ano Novo (Recesso)", type: "recesso" },
    // Janeiro 2026
    { date: "2026-01-01", title: "Ano Novo", type: "feriado" },
    { date: "2026-01-02", endDate: "2026-01-23", title: "Férias Docentes", type: "ferias" },
    { date: "2026-01-26", title: "Retorno pós-férias", type: "importante" },
    // Fevereiro 2026
    { date: "2026-02-04", title: "Aniversário de Garanhuns", type: "feriado" },
    { date: "2026-02-06", title: "Término da Unidade II", type: "importante" },
    { date: "2026-02-09", endDate: "2026-02-11", title: "Exames Finais", type: "prova" },
    { date: "2026-02-13", title: "Último dia para fechamento de diários", type: "prazo" },
    { date: "2026-02-16", endDate: "2026-02-18", title: "Carnaval", type: "feriado" },
  ];

  // Calendário Subsequente (usando base do Superior até ter dados específicos)
  const eventsSubsequente = [
    { date: "2025-08-26", endDate: "2025-08-28", title: "Matrícula (veteranos)", type: "matricula" },
    { date: "2025-09-01", title: "Início das Aulas / Aula Magna", type: "importante" },
    { date: "2025-09-07", title: "Independência do Brasil", type: "feriado" },
    { date: "2025-09-10", endDate: "2025-09-13", title: "Jogos Interclasse", type: "evento" },
    { date: "2025-10-12", title: "Nossa Senhora Aparecida", type: "feriado" },
    { date: "2025-10-15", title: "Dia do Professor", type: "academico" },
    { date: "2025-10-20", endDate: "2025-10-26", title: "SNCT", type: "evento" },
    { date: "2025-11-02", title: "Finados", type: "feriado" },
    { date: "2025-11-15", title: "Proclamação da República", type: "feriado" },
    { date: "2025-11-20", title: "Dia da Consciência Negra", type: "feriado" },
    { date: "2025-12-25", title: "Natal", type: "feriado" },
    { date: "2026-01-01", title: "Ano Novo", type: "feriado" },
    { date: "2026-02-04", title: "Aniversário de Garanhuns", type: "feriado" },
    { date: "2026-02-09", endDate: "2026-02-11", title: "Exames Finais", type: "prova" },
    { date: "2026-02-16", endDate: "2026-02-18", title: "Carnaval", type: "feriado" },
  ];

  const events = selectedModality === 'integrado' ? eventsIntegrado : eventsSubsequente;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "prova":
        return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg";
      case "feriado":
        return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg";
      case "academico":
        return "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg";
      case "importante":
        return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg";
      case "matricula":
        return "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg";
      case "prazo":
        return "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg";
      case "evento":
        return "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg";
      case "recesso":
        return "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg";
      case "ferias":
        return "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "prova": return "Prova";
      case "feriado": return "Feriado";
      case "academico": return "Acadêmico";
      case "importante": return "Importante";
      case "matricula": return "Matrícula";
      case "prazo": return "Prazo";
      case "evento": return "Evento";
      case "recesso": return "Recesso";
      case "ferias": return "Férias";
      default: return "Outro";
    }
  };

  const formatEventDate = (event: any) => {
    const startDate = new Date(event.date + 'T00:00:00');
    if (event.endDate) {
      const endDate = new Date(event.endDate + 'T00:00:00');
      return `${startDate.getDate()}/${startDate.getMonth() + 1} a ${endDate.getDate()}/${endDate.getMonth() + 1}`;
    }
    return `${startDate.getDate()}/${startDate.getMonth() + 1}`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Calendário Acadêmico</h2>
          <Calendar size={24} />
        </div>
        <p className="text-white/80 text-sm mb-4 relative z-10">
          Acompanhe os eventos e datas importantes
        </p>
        
        {/* Modalidade selector */}
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => setSelectedModality('subsequente')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md ${
              selectedModality === 'subsequente'
                ? 'bg-white/30 text-white border border-white/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Subsequente
          </button>
          <button
            onClick={() => setSelectedModality('integrado')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md ${
              selectedModality === 'integrado'
                ? 'bg-white/30 text-white border border-white/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Integrado
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="rounded-3xl shadow-lg border-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <ChevronLeft size={18} />
            </Button>
            <CardTitle className="text-lg font-bold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <ChevronRight size={18} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Próximos Eventos</h3>
        
        {events.map((event, index) => (
          <div
            key={index}
            className="p-4 rounded-3xl shadow-xl backdrop-blur-md bg-white/95 border border-white/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-2xl text-xs font-bold ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    {formatEventDate(event)}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 leading-relaxed">{event.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl shadow-lg backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Dias Letivos</p>
              <p className="text-2xl font-bold text-gray-900">100</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-3xl shadow-lg backdrop-blur-md bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Dias Restantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(0, Math.ceil((new Date('2026-02-13').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legenda de tipos de eventos */}
      <div className="p-4 rounded-3xl shadow-lg backdrop-blur-md bg-white/90 border border-white/20">
        <h4 className="font-bold text-gray-900 mb-3">Legenda</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600"></span>
            <span>Provas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></span>
            <span>Feriados</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-600"></span>
            <span>Importantes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></span>
            <span>Eventos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600"></span>
            <span>Prazos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600"></span>
            <span>Matrícula</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCalendar;
