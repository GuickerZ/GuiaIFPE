
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClassroomFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("salas");

  // Sample data - in a real app, this would come from a database
  const classrooms = [
    { id: "101", name: "Sala 101", block: "bloco-c", floor: "1", type: "sala", capacity: 30, currentClass: "Matemática", available: false },
    { id: "102", name: "Sala 102", block: "bloco-c", floor: "1", type: "sala", capacity: 25, currentClass: "Livre", available: true },
    { id: "201", name: "Sala 201", block: "bloco-c", floor: "2", type: "sala", capacity: 35, currentClass: "Física", available: false },
    { id: "202", name: "Sala 202", block: "bloco-c", floor: "2", type: "sala", capacity: 30, currentClass: "Livre", available: true },
    { id: "301", name: "Sala 301", block: "bloco-b", floor: "1", type: "sala", capacity: 40, currentClass: "Química", available: false },
    { id: "302", name: "Sala 302", block: "bloco-b", floor: "1", type: "sala", capacity: 35, currentClass: "Livre", available: true },
    { id: "lab1", name: "Lab. Informática 1", block: "bloco-d", floor: "1", type: "laboratorio", capacity: 20, currentClass: "Programação", available: false },
    { id: "lab2", name: "Lab. Química", block: "bloco-d", floor: "1", type: "laboratorio", capacity: 15, currentClass: "Livre", available: true },
    { id: "401", name: "Sala 401", block: "bloco-e", floor: "1", type: "sala", capacity: 25, currentClass: "História", available: false },
    { id: "402", name: "Sala 402", block: "bloco-e", floor: "1", type: "sala", capacity: 30, currentClass: "Livre", available: true },
  ];

  // Filter results based on search and tab
  const filteredResults = classrooms.filter(room => {
    // Filter by tab (room type)
    if (selectedTab !== "todos" && room.type !== selectedTab) return false;
    
    // Filter by search query
    if (searchQuery === "") return true;
    
    return (
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section id="salas" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Encontre Salas e Espaços</h2>
          <p className="text-lg text-gray-600">
            Precisa encontrar uma sala específica? Use nossa ferramenta de busca para localizar qualquer espaço no campus.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Busque por número, nome ou bloco..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Buscar <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <Tabs defaultValue="salas" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="sala">Salas</TabsTrigger>
              <TabsTrigger value="laboratorio">Laboratórios</TabsTrigger>
              <TabsTrigger value="auditorio">Auditórios</TabsTrigger>
              <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {filteredResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">
                      Nenhum resultado encontrado. Tente uma busca diferente.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredResults.map((room) => (
                  <Card key={room.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <CardDescription className="mb-2">
                            {room.block.replace('bloco-', 'Bloco ').toUpperCase()}, {room.floor === "T" ? "Térreo" : `${room.floor}º andar`}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              Capacidade: {room.capacity}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${
                              room.available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {room.available ? 'Disponível' : 'Ocupada'}
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {room.currentClass}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 ml-2"
                          onClick={() => {
                            // Dispatch event to navigate to map and highlight the room
                            window.dispatchEvent(new CustomEvent('navigate-to-map', { 
                              detail: { 
                                block: room.block,
                                room: room.id
                              } 
                            }));
                          }}
                        >
                          Ver Rota
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ClassroomFinder;
