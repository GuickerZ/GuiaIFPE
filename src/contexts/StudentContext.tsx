import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: number;
  nome: string;
  matricula: string;
  cpf: string;
  email: string;
  telefone: string;
  curso: string;
  turma: string;
  modalidade: 'integrado' | 'subsequente';
  aula_atual?: {
    disciplina: string;
    professor: string;
    sala: string;
    horario: string;
  };
  horarios?: Array<{
    dia_semana: string;
    horario: string;
    disciplina: string;
    professor: string;
    sala: string;
    tipo_aula: string;
  }>;
}

interface StudentContextType {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <StudentContext.Provider value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </StudentContext.Provider>
  );
};