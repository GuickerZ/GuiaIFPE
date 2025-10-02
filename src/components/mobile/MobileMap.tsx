
import { useState } from "react";
import { MapPin, Navigation, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showRooms, setShowRooms] = useState(false);

  // Definindo as salas para cada bloco - posições ajustadas para o mapa SVG
  const roomsData = {
    "bloco-b": [
      { id: "101", name: "Sala 101", x: 37, y: 18, type: "aula" },
      { id: "102", name: "Sala 102", x: 42, y: 18, type: "aula" },
      { id: "103", name: "Sala 103", x: 47, y: 18, type: "aula" },
      { id: "coord", name: "Coordenação", x: 45, y: 22, type: "admin" },
    ],
    "bloco-c": [
      { id: "lab1", name: "Lab Informática", x: 22, y: 38, type: "lab" },
      { id: "lab2", name: "Lab Redes", x: 26, y: 38, type: "lab" },
      { id: "lab3", name: "Lab Hardware", x: 22, y: 45, type: "lab" },
      { id: "prof", name: "Sala Professores", x: 26, y: 45, type: "admin" },
    ],
    "bloco-d": [
      { id: "201", name: "Sala 201", x: 67, y: 38, type: "aula" },
      { id: "202", name: "Sala 202", x: 72, y: 38, type: "aula" },
      { id: "labcien", name: "Lab Ciências", x: 67, y: 45, type: "lab" },
      { id: "labfis", name: "Lab Física", x: 72, y: 45, type: "lab" },
    ],
    "bloco-e": [
      { id: "audit", name: "Auditório Principal", x: 45, y: 64, type: "evento" },
      { id: "miniaudit", name: "Mini Auditório", x: 52, y: 64, type: "evento" },
    ],
    "biblioteca": [
      { id: "acervo", name: "Acervo", x: 75, y: 22, type: "estudo" },
      { id: "estudo1", name: "Estudo Individual", x: 80, y: 22, type: "estudo" },
      { id: "estudo2", name: "Estudo Grupo", x: 75, y: 27, type: "estudo" },
    ]
  };

  const buildings = [
    { id: "acetec", name: "ACETEC", x: 15, y: 35, color: "bg-orange-500", width: "w-12", height: "h-20" },
    { id: "empresa-junior", name: "Empresa Júnior", x: 15, y: 50, color: "bg-orange-400", width: "w-8", height: "h-12" },
    { id: "edificios", name: "Edifícios", x: 75, y: 45, color: "bg-gray-500", width: "w-16", height: "h-24" },
    { id: "estacionamento", name: "Estacionamento", x: 25, y: 75, color: "bg-blue-400", width: "w-20", height: "h-8" },
    { id: "ifpe", name: "Instituto Federal de Pernambuco", x: 45, y: 70, color: "bg-green-600", width: "w-24", height: "h-16" },
    { id: "quadra", name: "Quadra Verde", x: 25, y: 15, color: "bg-green-400", width: "w-16", height: "h-12" },
    { id: "area-verde-1", name: "Área Verde", x: 85, y: 25, color: "bg-green-300", width: "w-8", height: "h-8" },
    { id: "area-verde-2", name: "Área Verde", x: 85, y: 85, color: "bg-green-300", width: "w-12", height: "h-6" },
  ];

  const getRoomColor = (type) => {
    switch(type) {
      case "aula": return "bg-blue-500";
      case "lab": return "bg-purple-500";
      case "admin": return "bg-orange-500";
      case "evento": return "bg-green-500";
      case "estudo": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  const handleBuildingClick = (buildingId) => {
    setSelectedBuilding(buildingId);
    setShowRooms(!showRooms || selectedBuilding !== buildingId);
    setSelectedRoom("");
    setShowRoute(false);
  };

  const handleRoomClick = (roomId, room) => {
    setSelectedRoom(roomId);
    // Se há uma sala selecionada anteriormente, mostrar rota
    if (selectedRoom && selectedRoom !== roomId) {
      setShowRoute(true);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Location Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md">
            <MapPin className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Você está aqui</p>
            <p className="text-sm text-gray-600">Entrada Principal - R. Agobar Valença</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-2xl shadow-md">
          <Navigation size={16} className="mr-1" />
          Navegar
        </Button>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-none">
        <div className="relative bg-green-100 rounded-2xl h-[480px] border-none overflow-hidden shadow-inner">{/* ... keep existing code */}
          {/* Campus Layout - Coded Map */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 480">
            {/* Background areas */}
            <rect width="400" height="480" fill="#f0fdf4" />
            
            {/* Ruas/Caminhos */}
            <path d="M0 440 L400 440" stroke="#94a3b8" strokeWidth="8" fill="none" />
            <path d="M50 0 L50 480" stroke="#94a3b8" strokeWidth="6" fill="none" />
            <path d="M350 0 L350 480" stroke="#94a3b8" strokeWidth="6" fill="none" />
            <path d="M0 200 L400 200" stroke="#94a3b8" strokeWidth="4" fill="none" />
            
            {/* Áreas verdes */}
            <rect x="20" y="20" width="80" height="60" fill="#22c55e" rx="8" />
            <rect x="300" y="20" width="60" height="40" fill="#22c55e" rx="8" />
            <rect x="320" y="400" width="70" height="40" fill="#22c55e" rx="8" />
            
            {/* Estacionamento */}
            <rect x="60" y="350" width="120" height="60" fill="#64748b" rx="4" />
            <text x="120" y="385" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Estacionamento</text>
            
            {/* Bloco B - Topo central */}
            <rect x="140" y="80" width="80" height="40" fill="#3b82f6" rx="4" />
            <text x="180" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Bloco B</text>
            
            {/* Bloco C - Esquerda */}
            <rect x="80" y="180" width="60" height="80" fill="#3b82f6" rx="4" />
            <text x="110" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Bloco</text>
            <text x="110" y="220" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            {/* Bloco D - Direita */}
            <rect x="260" y="180" width="60" height="80" fill="#3b82f6" rx="4" />
            <text x="290" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Bloco</text>
            <text x="290" y="220" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">D</text>
            
            {/* Bloco E - Inferior */}
            <rect x="160" y="300" width="80" height="50" fill="#3b82f6" rx="4" />
            <text x="200" y="330" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Bloco E</text>
            
            {/* Biblioteca - Superior direita */}
            <rect x="280" y="80" width="70" height="60" fill="#7c3aed" rx="4" />
            <text x="315" y="110" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Biblioteca</text>
            
            {/* Banheiros - Centro */}
            <rect x="180" y="240" width="40" height="30" fill="#059669" rx="4" />
            <text x="200" y="258" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">WC</text>
            
            {/* Entrada Principal */}
            <rect x="170" y="450" width="60" height="20" fill="#dc2626" rx="4" />
            <text x="200" y="465" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Entrada</text>
          </svg>
          
          {/* Sua Localização - na entrada */}
          <div className="absolute bottom-[5%] left-[47%] w-4 h-4 bg-red-600 rounded-full animate-pulse z-20 border-2 border-white shadow-lg">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
          </div>
          
          {/* Pontos interativos dos blocos */}
          {/* Bloco B */}
          <div 
            className="absolute top-[18%] left-[42%] w-4 h-4 bg-blue-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("bloco-b")}
            title="Bloco B - Salas 101-120"
          >
            {selectedBuilding === "bloco-b" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Bloco B
              </div>
            )}
          </div>
          
          {/* Bloco C */}
          <div 
            className="absolute top-[40%] left-[25%] w-4 h-4 bg-blue-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("bloco-c")}
            title="Bloco C - Laboratórios"
          >
            {selectedBuilding === "bloco-c" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Bloco C
              </div>
            )}
          </div>
          
          {/* Bloco D */}
          <div 
            className="absolute top-[40%] right-[25%] w-4 h-4 bg-blue-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("bloco-d")}
            title="Bloco D - Salas 201-220"
          >
            {selectedBuilding === "bloco-d" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Bloco D
              </div>
            )}
          </div>
          
          {/* Bloco E */}
          <div 
            className="absolute bottom-[25%] left-[47%] w-4 h-4 bg-blue-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("bloco-e")}
            title="Bloco E - Auditório"
          >
            {selectedBuilding === "bloco-e" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Bloco E
              </div>
            )}
          </div>
          
          {/* Biblioteca */}
          <div 
            className="absolute top-[25%] right-[15%] w-4 h-4 bg-purple-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("biblioteca")}
            title="Biblioteca"
          >
            {selectedBuilding === "biblioteca" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Biblioteca
              </div>
            )}
          </div>
          
          {/* Banheiros */}
          <div 
            className="absolute top-[53%] left-[47%] w-3 h-3 bg-green-600 rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-20 border-2 border-white shadow-lg"
            onClick={() => handleBuildingClick("banheiros")}
            title="Banheiros"
          >
            {selectedBuilding === "banheiros" && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Banheiros
              </div>
            )}
          </div>
          
          {/* Salas individuais - aparecem apenas quando o bloco está selecionado */}
          {selectedBuilding && showRooms && roomsData[selectedBuilding] && 
            roomsData[selectedBuilding].map((room) => (
              <div
                key={room.id}
                className={`absolute w-2 h-2 ${getRoomColor(room.type)} rounded-full cursor-pointer hover:scale-150 transition-all duration-200 z-30 border border-white shadow animate-fade-in`}
                style={{ 
                  left: `${room.x}%`, 
                  top: `${room.y}%` 
                }}
                onClick={() => handleRoomClick(room.id, room)}
                title={room.name}
              >
                {selectedRoom === room.id && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40">
                    {room.name}
                  </div>
                )}
              </div>
            ))
          }
          
          {/* Rota entre salas adjacentes */}
          {selectedRoom && showRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-25">
              <path
                d="M 25% 92% L 35% 20% L 40% 20%"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                strokeDasharray="3,3"
                className="animate-pulse"
              />
            </svg>
          )}
          
          {/* Rota animada quando selecionado */}
          {selectedBuilding && showRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <path
                d="M 80% 92% Q 60% 70% 48% 45%"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
          
          {/* Legend */}
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-2xl p-3 text-xs space-y-2 z-10 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
              <span>Você está aqui</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              <span>Blocos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full border border-white"></div>
              <span>Biblioteca</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full border border-white"></div>
              <span>Banheiros</span>
            </div>
          </div>
          
          {/* Botão de rota */}
          {selectedBuilding && (
            <div className="absolute bottom-2 right-2 z-20">
              <Button 
                size="sm" 
                onClick={() => setShowRoute(!showRoute)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl"
              >
                <Navigation size={14} className="mr-1" />
                {showRoute ? "Ocultar" : "Mostrar"} Rota
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Informações do local selecionado */}
      {selectedBuilding && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border-none animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            {selectedBuilding === "bloco-b" && "Bloco B - Salas de Aula"}
            {selectedBuilding === "bloco-c" && "Bloco C - Laboratórios"}
            {selectedBuilding === "bloco-d" && "Bloco D - Salas de Aula"}
            {selectedBuilding === "bloco-e" && "Bloco E - Auditório"}
            {selectedBuilding === "biblioteca" && "Biblioteca"}
            {selectedBuilding === "banheiros" && "Banheiros"}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            {selectedBuilding === "bloco-b" && (
              <>
                <p>• Salas 101 a 120</p>
                <p>• Coordenação de Cursos</p>
                <p>• Secretaria Acadêmica</p>
                <p>• Direção Geral</p>
              </>
            )}
            
            {selectedBuilding === "bloco-c" && (
              <>
                <p>• Laboratório de Informática</p>
                <p>• Laboratório de Redes</p>
                <p>• Laboratório de Hardware</p>
                <p>• Sala dos Professores</p>
              </>
            )}
            
            {selectedBuilding === "bloco-d" && (
              <>
                <p>• Salas 201 a 220</p>
                <p>• Laboratório de Ciências</p>
                <p>• Laboratório de Física</p>
                <p>• Laboratório de Química</p>
              </>
            )}
            
            {selectedBuilding === "bloco-e" && (
              <>
                <p>• Auditório Principal (200 lugares)</p>
                <p>• Mini Auditório (50 lugares)</p>
                <p>• Depósito de Material</p>
              </>
            )}
            
            {selectedBuilding === "biblioteca" && (
              <>
                <p>• Acervo Geral</p>
                <p>• Sala de Estudo Individual</p>
                <p>• Sala de Estudo em Grupo</p>
                <p>• Computadores para Pesquisa</p>
              </>
            )}
            
            {selectedBuilding === "banheiros" && (
              <>
                <p>• Banheiro Masculino</p>
                <p>• Banheiro Feminino</p>
                <p>• Banheiro Adaptado</p>
              </>
            )}
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4 rounded-2xl w-full shadow-md"
            onClick={() => setSelectedBuilding("")}
          >
            Fechar
          </Button>
        </div>
      )}
      
      {/* Informações da sala individual selecionada */}
      {selectedRoom && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border-none animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            {roomsData[selectedBuilding]?.find(room => room.id === selectedRoom)?.name}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Tipo: {roomsData[selectedBuilding]?.find(room => room.id === selectedRoom)?.type}</p>
            <p>• Bloco: {selectedBuilding.replace('bloco-', '').toUpperCase()}</p>
            <p>• Clique em outra sala para ver a rota</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4 rounded-2xl w-full shadow-md"
            onClick={() => {
              setSelectedRoom("");
              setShowRoute(false);
            }}
          >
            Fechar
          </Button>
        </div>
      )}
      
      {/* Lista de salas exemplo */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-none">
        <h3 className="font-bold text-gray-900 mb-3 text-lg">Encontrar Sala</h3>
        <p className="text-xs text-gray-500 mb-4">Clique em um bloco para ver suas salas individuais</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { sala: "101", bloco: "B", tipo: "Aula" },
            { sala: "Lab 1", bloco: "C", tipo: "Informática" },
            { sala: "205", bloco: "D", tipo: "Aula" },
            { sala: "Audit.", bloco: "E", tipo: "Eventos" },
          ].map((item) => (
            <Button
              key={item.sala}
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto p-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
              onClick={() => handleBuildingClick(`bloco-${item.bloco.toLowerCase()}`)}
            >
              <div>
                <div className="font-semibold">{item.sala}</div>
                <div className="text-xs text-gray-500">Bloco {item.bloco} - {item.tipo}</div>
              </div>
            </Button>
          ))}
        </div>
        
        {/* Legenda das cores das salas */}
        {showRooms && selectedBuilding && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Tipos de Sala:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Aula</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Laboratório</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Administração</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Evento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span>Estudo</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMap;
