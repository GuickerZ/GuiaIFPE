
import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MobileRoomFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const rooms = [
    { id: "101", name: "Sala 101", block: "A", floor: "1", type: "sala", distance: "50m" },
    { id: "102", name: "Sala 102", block: "A", floor: "1", type: "sala", distance: "55m" },
    { id: "lab1", name: "Lab. Informática 1", block: "B", floor: "1", type: "laboratorio", distance: "120m" },
    { id: "lab2", name: "Lab. Química", block: "B", floor: "1", type: "laboratorio", distance: "150m" },
    { id: "201", name: "Sala 201", block: "A", floor: "2", type: "sala", distance: "80m" },
    { id: "aud1", name: "Auditório Principal", block: "C", floor: "T", type: "auditorio", distance: "200m" },
    { id: "biblioteca", name: "Biblioteca", block: "D", floor: "1", type: "especial", distance: "180m" },
  ];

  const filters = [
    { id: "todos", label: "Todos" },
    { id: "sala", label: "Salas" },
    { id: "laboratorio", label: "Labs" },
    { id: "auditorio", label: "Auditórios" },
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = selectedFilter === "todos" || room.type === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Buscar sala, laboratório..."
            className="pl-10 h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap rounded-full"
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h3 className="font-semibold text-gray-800 mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
            <span className="text-xs">Salas</span>
            <span className="font-semibold">Bloco A</span>
          </Button>
          <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
            <span className="text-xs">Labs</span>
            <span className="font-semibold">Bloco B</span>
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Resultados ({filteredRooms.length})
          </h3>
          <Button variant="ghost" size="sm">
            <Filter size={16} />
          </Button>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 mb-2">Nenhum resultado encontrado</p>
            <p className="text-sm text-gray-400">Tente uma busca diferente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRooms.map(room => (
              <div key={room.id} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{room.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {room.type === "sala" ? "Sala" : 
                         room.type === "laboratorio" ? "Lab" :
                         room.type === "auditorio" ? "Aud" : "Esp"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Bloco {room.block}</span>
                      <span>{room.floor === "T" ? "Térreo" : `${room.floor}º andar`}</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{room.distance}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="ml-3">
                    Ver Rota
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileRoomFinder;
