import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, MapPin, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, Room as ApiRoom } from '@/services/api';

interface Room extends ApiRoom {
  mapa_x: number | null;
  mapa_y: number | null;
  mapa_bloco_id: string | null;
}

const BLOCK_MAPPING: Record<string, string> = {
  'B': 'bloco-b',
  'C': 'bloco-c',
  'D': 'bloco-d',
  'E': 'bloco-e',
  'Biblioteca': 'biblioteca'
};

export default function MapEditor() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await api.getRooms();
      console.log('Salas recebidas:', data);
      console.log('Salas com coordenadas:', data.filter(r => r.mapa_x !== null && r.mapa_x !== undefined));
      setRooms(data as Room[]);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as salas. Verifique se você está autenticado.",
        variant: "destructive"
      });
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedRoom || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingCoordinates({ x, y });
  };

  const saveCoordinates = async () => {
    if (!selectedRoom || !pendingCoordinates) return;

    try {
      const response = await fetch(`https://85804b720d36.ngrok-free.app/api/rooms/${selectedRoom.id}/coordinates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          mapa_x: Math.round(pendingCoordinates.x * 10) / 10,
          mapa_y: Math.round(pendingCoordinates.y * 10) / 10,
          mapa_bloco_id: BLOCK_MAPPING[selectedRoom.bloco] || null
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar coordenadas');
      }

      toast({
        title: "Sucesso!",
        description: `Coordenadas da ${selectedRoom.numero} salvas`
      });
      
      await fetchRooms();
      setSelectedRoom(null);
      setPendingCoordinates(null);
    } catch (error) {
      console.error('Erro ao salvar coordenadas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as coordenadas",
        variant: "destructive"
      });
    }
  };

  const unmappedRooms = rooms.filter(r => r.mapa_x === null || r.mapa_x === undefined || r.mapa_y === null || r.mapa_y === undefined);
  const mappedRooms = rooms.filter(r => r.mapa_x !== null && r.mapa_x !== undefined && r.mapa_y !== null && r.mapa_y !== undefined);
  
  console.log('Total de salas:', rooms.length);
  console.log('Salas mapeadas:', mappedRooms.length, mappedRooms);
  console.log('Salas não mapeadas:', unmappedRooms.length);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Editor de Mapa</h1>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowMarkers(!showMarkers)}
          >
            {showMarkers ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar Marcadores
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Mostrar Marcadores
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Mapa do Campus</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedRoom 
                    ? `Clique no mapa para marcar: ${selectedRoom.numero} - ${selectedRoom.bloco}`
                    : 'Selecione uma sala na lista para começar'}
                </p>
              </div>

              <div 
                ref={imageRef}
                className="relative w-full bg-muted rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleMapClick}
                style={{ aspectRatio: '16/9' }}
              >
                <img 
                  src="/mapa-ifpe-gus.png" 
                  alt="Mapa IFPE Garanhuns"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Marcadores salvos */}
                {showMarkers && mappedRooms.map(room => (
                  <div
                    key={room.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${room.mapa_x}%`,
                      top: `${room.mapa_y}%`
                    }}
                  >
                    <div className="relative">
                      <MapPin className="w-6 h-6 text-primary fill-primary drop-shadow-lg" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/90 text-xs px-2 py-1 rounded whitespace-nowrap">
                        {room.numero}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Marcador pendente */}
                {pendingCoordinates && selectedRoom && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{
                      left: `${pendingCoordinates.x}%`,
                      top: `${pendingCoordinates.y}%`
                    }}
                  >
                    <MapPin className="w-8 h-8 text-destructive fill-destructive drop-shadow-lg" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded text-sm font-semibold whitespace-nowrap">
                      {selectedRoom.numero}
                    </div>
                  </div>
                )}
              </div>

              {pendingCoordinates && selectedRoom && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={saveCoordinates} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Coordenadas
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPendingCoordinates(null);
                      setSelectedRoom(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Lista de Salas */}
          <div className="space-y-4">
            {/* Salas não mapeadas */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                Salas sem coordenadas ({unmappedRooms.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unmappedRooms.map(room => (
                  <Button
                    key={room.id}
                    variant={selectedRoom?.id === room.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedRoom(room);
                      setPendingCoordinates(null);
                    }}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{room.numero}</div>
                      <div className="text-xs opacity-70">
                        Bloco {room.bloco} - {room.tipo}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Salas mapeadas */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Salas mapeadas ({mappedRooms.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mappedRooms.map(room => (
                  <Button
                    key={room.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedRoom(room)}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <div className="text-left text-sm">
                      {room.numero} - Bloco {room.bloco}
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
