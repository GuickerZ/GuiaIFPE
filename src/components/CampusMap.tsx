import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";

interface Room {
  id: number;
  numero: string;
  bloco: string;
  status: 'disponivel' | 'ocupada';
  mapa_x?: number | null;
  mapa_y?: number | null;
  mapa_bloco_id?: string | null;
  aula_atual?: string;
  professor_atual?: string;
}

const CampusMap = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data.filter(r => r.mapa_x !== null && r.mapa_y !== null));
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  const mappedRooms = rooms.filter(r => r.mapa_x && r.mapa_y);

  return (
    <section id="mapa" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Mapa do Campus</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore as salas do campus e suas localizações em tempo real.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Mapa Interativo - {mappedRooms.length} salas mapeadas
            </h3>
            <Button variant="outline" onClick={() => navigate('/map-editor')}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Mapa
            </Button>
          </div>

          <div 
            className="relative w-full bg-muted rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            <img 
              src="/mapa-ifpe-gus.png" 
              alt="Mapa IFPE Garanhuns"
              className="w-full h-full object-contain"
            />

            {/* Marcadores das salas */}
            {mappedRooms.map(room => (
              <div
                key={room.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${room.mapa_x}%`,
                  top: `${room.mapa_y}%`
                }}
                onClick={() => setSelectedRoom(room)}
              >
                <MapPin 
                  className={`w-6 h-6 drop-shadow-lg ${
                    room.status === 'ocupada' 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-green-500 fill-green-500'
                  }`} 
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/90 text-xs px-2 py-1 rounded whitespace-nowrap">
                  {room.numero}
                </div>
              </div>
            ))}
          </div>

          {/* Detalhes da sala selecionada */}
          {selectedRoom && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-lg mb-2">
                Sala {selectedRoom.numero} - Bloco {selectedRoom.bloco}
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={selectedRoom.status === 'ocupada' ? 'text-red-600' : 'text-green-600'}>
                    {selectedRoom.status === 'ocupada' ? 'Ocupada' : 'Disponível'}
                  </span>
                </p>
                {selectedRoom.aula_atual && (
                  <>
                    <p><span className="font-medium">Disciplina:</span> {selectedRoom.aula_atual}</p>
                    <p><span className="font-medium">Professor:</span> {selectedRoom.professor_atual}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Legenda */}
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500 fill-green-500" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Ocupada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusMap;
