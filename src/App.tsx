import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TimeDebugProvider } from "@/contexts/TimeDebugContext";
import { StudentProvider, useStudent } from "@/contexts/StudentContext";
import LoginForm from "@/components/auth/LoginForm";
import StudentSelector from "@/components/auth/StudentSelector";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapEditor from "./pages/MapEditor";
import React from "react";

const queryClient = new QueryClient();

// Componente wrapper para verificar autenticação
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <StudentProvider>
      <StudentSelectionWrapper />
    </StudentProvider>
  );
};

// Componente para gerenciar seleção de estudante
const StudentSelectionWrapper = () => {
  // Não precisamos mais selecionar automaticamente o aluno aqui
  // O useActiveStudent já cuida disso
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/map-editor" element={<MapEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TimeDebugProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </TimeDebugProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
