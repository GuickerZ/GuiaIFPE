import { useNavigate } from 'react-router-dom';

/**
 * Hook para navegação para o mapa com destaque de sala
 */
export const useMapNavigation = () => {
  const navigateToMap = (roomNumber: string, bloco?: string) => {
    // Mapear bloco para ID da área interativa
    const blockMapping: Record<string, string> = {
      'A': 'bloco-a',
      'B': 'bloco-b',
      'C': 'bloco-c',
      'D': 'bloco-d',
      'E': 'bloco-e',
      'Biblioteca': 'biblioteca',
      'Banheiros': 'banheiros'
    };
    
    const blockId = bloco ? blockMapping[bloco] : undefined;
    
    console.log('useMapNavigation - Sala:', roomNumber, 'Bloco:', bloco, 'BlockId:', blockId);
    
    // Disparar evento para mudar a aba primeiro
    const navEvent = new CustomEvent('map-navigate');
    window.dispatchEvent(navEvent);

    // Aguardar um pouco para garantir que a aba foi mudada
    setTimeout(() => {
      // Disparar evento personalizado para destacar sala no mapa
      const event = new CustomEvent('map-highlight', {
        detail: { room: roomNumber, block: blockId }
      });
      console.log('Disparando evento map-highlight:', { room: roomNumber, block: blockId });
      window.dispatchEvent(event);
    }, 200);
  };

  return { navigateToMap };
};
