
import React, { useState, useEffect } from 'react';
import { MapPin, Users, Home, Clock } from 'lucide-react';

import { useRooms } from '@/hooks/useRooms';

// Mapeamento de blocos para áreas interativas
const BLOCK_MAPPING: Record<string, string> = {
  'A': 'bloco-a',
  'B': 'bloco-b',
  'C': 'bloco-c',
  'D': 'bloco-d',
  'E': 'bloco-e',
  'Biblioteca': 'biblioteca',
  'Banheiros': 'banheiros'
};

const interactiveAreas = [
  { id: 'bloco-b', name: 'Bloco B', style: { top: '24.7%', left: '40%', width: '20%', height: '29%' } },
  { id: 'bloco-c', name: 'Bloco C', style: { top: '40.2%', left: '15%', width: '20%', height: '29%' } },
  { id: 'bloco-d', name: 'Bloco D', style: { top: '40.2%', left: '65%', width: '20%', height: '29%' } },
  { id: 'bloco-e', name: 'Bloco E', style: { top: '70.2%', left: '66.5%', width: '20%', height: '29%' } },
  { 
    id: 'biblioteca', 
    name: 'Biblioteca', 
    style: { 
      top: '8.9%', 
      left: '60.8%', 
      width: '17%', 
      height: '24.22%', 
      transform: 'rotate(-38deg)' 
    } 
  },
  { id: 'banheiros', name: 'Banheiros', style: { top: '55.2%', left: '50.2%', width: '8%', height: '6%' } },
];

const MobileImageMap = () => {
  const { data: rooms, isLoading } = useRooms();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [highlightRoom, setHighlightRoom] = useState<string | null>(null);

  // Agrupar salas por bloco do mapa
  const roomsByBlock = React.useMemo(() => {
    if (!rooms) return {};
    
    const grouped: Record<string, any[]> = {};
    
    rooms.forEach(room => {
      const blockId = BLOCK_MAPPING[room.bloco] || 'outros';
      
      if (!grouped[blockId]) {
        grouped[blockId] = [];
      }
      
      grouped[blockId].push({
        id: room.id,
        room: room.numero,
        type: room.tipo,
        capacity: room.capacidade,
        currentClass: room.aula_atual || (room.status === 'disponivel' ? 'Livre' : 'Ocupada'),
        floor: `${room.andar}º Andar`,
        status: room.status,
        professor: room.professor_atual
      });
    });
    
    return grouped;
  }, [rooms]);

  // Escutar eventos de destaque do mapa
  useEffect(() => {
    const handleMapHighlight = (event: CustomEvent) => {
      console.log('Evento map-highlight recebido:', event.detail);
      const { room, block } = event.detail;
      if (block) {
        console.log('Selecionando área:', block);
        setSelectedArea(block);
      }
      if (room) {
        console.log('Destacando sala:', room);
        setHighlightRoom(room);
        // Scroll suave para o mapa
        setTimeout(() => {
          const mapElement = document.getElementById('interactive-map');
          if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        // Auto-destacar por alguns segundos
        setTimeout(() => setHighlightRoom(null), 5000);
      }
    };

    window.addEventListener('map-highlight', handleMapHighlight as EventListener);
    return () => {
      window.removeEventListener('map-highlight', handleMapHighlight as EventListener);
    };
  }, []);

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(prev => (prev === areaId ? null : areaId));
  };

  const getStatusColor = (currentClass: string) => {
    return currentClass === 'Livre' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Mapa do Campus</h2>
            <p className="text-white/80 text-sm">Clique nos blocos para ver as salas</p>
          </div>
        </div>
      </div>

      {/* Mapa interativo */}
      <div id="interactive-map" className="bg-white rounded-3xl p-3 shadow-xl border-none">
        <div className="relative w-full" style={{ aspectRatio: '0.75' }}>
          <img
            src="/mapa-ifpe-gus.png"
            alt="Mapa do Campus IFPE Garanhuns"
            className="absolute top-0 left-0 w-full h-full object-contain rounded-2xl"
          />

          {/* Camada de áreas interativas */}
          {interactiveAreas.map((area) => (
            <button
              key={area.id}
              title={area.name}
              onClick={() => handleAreaClick(area.id)}
              className="absolute transition-all duration-200 ease-in-out focus:outline-none hover:bg-blue-200/50"
              style={{
                ...area.style,
                backgroundColor: selectedArea === area.id ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                border: selectedArea === area.id 
                  ? '3px solid #2563EB' 
                  : '2px dashed rgba(107, 114, 128, 0.6)',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Painel de informações das salas */}
      {selectedArea && (
        <div className="bg-white rounded-3xl shadow-xl border-none animate-fade-in">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Home size={22} className="text-blue-600" />
              {interactiveAreas.find(a => a.id === selectedArea)?.name}
            </h3>
          </div>
          
          <div className="p-5">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Carregando salas...</div>
            ) : roomsByBlock[selectedArea]?.length > 0 ? (
              <div className="grid gap-3">
                {roomsByBlock[selectedArea].map((room, index) => (
                <button 
                  key={index} 
                  className={`bg-white rounded-2xl p-5 border-2 transition-all duration-200 text-left group shadow-md hover:shadow-xl ${
                    highlightRoom === room.room 
                      ? 'border-green-400 bg-green-50 scale-105' 
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => {
                    console.log('Sala selecionada:', room.room);
                    setHighlightRoom(room.room);
                    setTimeout(() => setHighlightRoom(null), 3000);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                        <Home size={18} className="text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">{room.room}</h4>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(room.currentClass)}`}>
                      {room.currentClass === 'Livre' || room.currentClass === 'Disponível' ? 'Disponível' : 'Ocupada'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      <p className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">Andar:</span>
                        {room.floor}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">Tipo:</span>
                        {room.type}
                      </p>
                    </div>
                    {room.capacity > 0 && (
                      <p className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        <span>Capacidade: {room.capacity} pessoas</span>
                      </p>
                     )}
                     {room.currentClass !== 'Livre' && room.currentClass !== 'Disponível' && (
                       <p className="flex items-center gap-2 bg-blue-50 rounded-2xl p-3 mt-2">
                         <Clock size={16} className="text-blue-600" />
                         <span className="font-medium text-blue-700">
                           Aula: {room.currentClass}
                           {room.professor && <span className="block text-sm">Prof. {room.professor}</span>}
                         </span>
                       </p>
                     )}
                   </div>
                   
                   <div className="mt-3 pt-3 border-t border-gray-100">
                     <p className="text-xs text-gray-500 flex items-center gap-1">
                       <MapPin size={12} />
                       Sala ID: {room.id}
                     </p>
                   </div>
                 </button>
               ))}
             </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma sala cadastrada neste bloco
              </div>
            )}
           </div>
        </div>
      )}
    </div>
  );
};

export default MobileImageMap;
