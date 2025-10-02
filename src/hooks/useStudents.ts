import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useStudents = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['students'],
    queryFn: () => api.getAccessibleStudents(),
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useStudentSearch = (query: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['students', 'search', query],
    queryFn: () => api.searchStudents(query),
    enabled: isAuthenticated && query.length > 0,
    retry: false,
  });
};