import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';

/**
 * Hook centralizado para obter o aluno ativo no sistema.
 * Retorna o aluno selecionado (para responsáveis/professores) ou o próprio usuário (se for aluno).
 * Isso garante que todos os componentes mostrem as informações corretas de forma consistente.
 */
export const useActiveStudent = () => {
  const { user } = useAuth();
  const { selectedStudent } = useStudent();

  // Se há um aluno selecionado (responsável ou professor visualizando dependente)
  if (selectedStudent) {
    return {
      student: selectedStudent,
      isViewingDependent: true,
      viewerType: user?.tipo
    };
  }

  // Se o usuário logado é um aluno, retornar seus próprios dados
  if (user?.tipo === 'aluno' && user.aluno) {
    return {
      student: {
        id: user.aluno.id,
        nome: user.nome,
        matricula: user.aluno.matricula,
        cpf: user.aluno.cpf,
        email: user.email,
        telefone: user.aluno.telefone,
        curso: user.aluno.curso,
        turma: user.aluno.turma,
        modalidade: user.aluno.modalidade,
        horarios: [] // Horários serão buscados pelos componentes quando necessário
      },
      isViewingDependent: false,
      viewerType: 'aluno'
    };
  }

  // Nenhum aluno disponível
  return {
    student: null,
    isViewingDependent: false,
    viewerType: user?.tipo
  };
};
