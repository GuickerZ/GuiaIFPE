
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import MobileStudentSearch from "@/components/mobile/MobileStudentSearch";
import MobileImageMap from "@/components/mobile/MobileImageMap";
import MobileRoomFinder from "@/components/mobile/MobileRoomFinder";
import MobileFacts from "@/components/mobile/MobileFacts";
import MobileCalendar from "@/components/mobile/MobileCalendar";
import MobileSchedule from "@/components/mobile/MobileSchedule";
import MobileTeacherView from "@/components/mobile/MobileTeacherView";
import MobileTeacherSchedule from "@/components/mobile/MobileTeacherSchedule";
import TimeDebugger from "@/components/mobile/TimeDebugger";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useStudent } from "@/contexts/StudentContext";
import { useState, useEffect } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("busca");
  const { isAuthenticated, loading, user } = useAuth();
  const { selectedStudent } = useStudent();

  // Escutar eventos de navegação
  useEffect(() => {
    const handleNavigateToMap = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Navegando para o mapa com dados:', customEvent.detail);
      setActiveTab("mapa");
      // Transmitir dados para o componente do mapa após mudança de tab
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('map-highlight', { detail: customEvent.detail }));
      }, 150);
    };

    const handleChangeTab = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleMapNavigate = (event: Event) => {
      // Evento gerado pelo hook useMapNavigation
      setActiveTab("mapa");
    };

    window.addEventListener('navigate-to-map', handleNavigateToMap);
    window.addEventListener('change-tab', handleChangeTab);
    window.addEventListener('map-navigate', handleMapNavigate);
    
    return () => {
      window.removeEventListener('navigate-to-map', handleNavigateToMap);
      window.removeEventListener('change-tab', handleChangeTab);
      window.removeEventListener('map-navigate', handleMapNavigate);
    };
  }, []);

  // Show loading or login without layout to prevent shift
  if (loading || !isAuthenticated) {
    return loading ? (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    ) : (
      <LoginForm />
    );
  }

  const renderContent = () => {
    // Fluxo unificado baseado na presença de aluno selecionado
    switch (activeTab) {
      case "busca":
        // Professores sem dependente selecionado veem suas aulas
        if (user?.tipo === 'professor' && !selectedStudent) {
          return <MobileTeacherView />;
        }
        // Todos os outros casos (alunos, responsáveis, professores com dependente)
        return <MobileStudentSearch />;
      
      case "mapa":
        return <MobileImageMap />;
      
      case "salas":
        return <MobileRoomFinder />;
      
      case "calendario":
        // Calendário acadêmico é o mesmo para todos
        return <MobileCalendar />;
      
      case "horario":
        // Professores sem dependente veem seu próprio horário
        if (user?.tipo === 'professor' && !selectedStudent) {
          return <MobileTeacherSchedule />;
        }
        // Alunos, responsáveis, e professores com dependente veem horário do aluno
        return <MobileSchedule />;
      
      default:
        return user?.tipo === 'professor' && !selectedStudent 
          ? <MobileTeacherView /> 
          : <MobileStudentSearch />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative">
      <MobileHeader />
      <TimeDebugger />
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
