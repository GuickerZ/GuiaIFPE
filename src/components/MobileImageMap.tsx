// src/components/mobile/MobileImageMap.tsx

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

// Coordenadas e Transformação FINAIS e CORRIGIDAS
const interactiveAreas = [

{ id: 'bloco-c', name: 'Bloco C', style: { top: '40.2%', left: '15%', width: '20%', height: '29%' } },
{ id: 'bloco-b', name: 'Bloco b', style: { top: '24.7%', left: '40%', width: '20%', height: '29%' } },
{ id: 'bloco-d', name: 'Bloco D', style: { top: '40.2%', left: '65%', width: '20%', height: '29%' } },
{ id: 'bloco-e', name: 'Bloco E', style: { top: '70.2%', left: '66.5%', width: '20%', height: '29%' } },
{ 
    id: 'biblioteca', 
    name: 'Biblioteca', 
    // Usando CSS rotate para inclinar a área, muito mais preciso que clip-path
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
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(prev => (prev === areaId ? null : areaId));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-800">Mapa Interativo do Campus</p>
            <p className="text-sm text-gray-500">Clique em uma área para detalhes</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 shadow-sm border">
        <div className="relative w-full" style={{ aspectRatio: '0.75' }}>
          <img
            src="/mapa-ifpe-gus.png"
            alt="Mapa do Campus IFPE Garanhuns"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />

          {/* Camada de áreas interativas */}
          {interactiveAreas.map((area) => (
            <button
              key={area.id}
              title={area.name}
              onClick={() => handleAreaClick(area.id)}
              className="absolute transition-all duration-200 ease-in-out focus:outline-none"
              style={{
                ...area.style,
                backgroundColor: selectedArea === area.id ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                border: selectedArea === area.id 
                  ? '2px solid #2563EB' 
                  : '2px dashed rgba(107, 114, 128, 0.6)',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Painel de Informações */}
      {selectedArea && (
        <div className="bg-white rounded-xl p-4 shadow-sm border animate-fade-in">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 capitalize">
            {interactiveAreas.find(a => a.id === selectedArea)?.name}
          </h3>
          <p className="text-sm text-gray-600">
            Informações sobre o {interactiveAreas.find(a => a.id === selectedArea)?.name}.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileImageMap;