import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTimeDebug } from '@/contexts/TimeDebugContext';

export const useRooms = () => {
  const { isAuthenticated } = useAuth();
  const { testTime } = useTimeDebug();

  return useQuery({
    queryKey: ['rooms', testTime],
    queryFn: () => {
      console.log('useRooms queryFn chamado com testTime:', testTime);
      return api.getRooms(testTime);
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useRoomSearch = (query: string, filters?: { bloco?: string; tipo?: string; disponivel?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const { testTime } = useTimeDebug();

  return useQuery({
    queryKey: ['rooms', 'search', query, filters, testTime],
    queryFn: () => {
      console.log('useRoomSearch queryFn chamado com testTime:', testTime);
      return api.searchRooms(query, { ...filters, testTime });
    },
    enabled: isAuthenticated && query.length > 0,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};