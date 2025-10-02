import React, { useState } from 'react';
import { Search, MapPin, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRooms, useRoomSearch } from '@/hooks/useRooms';
import { useAuth } from '@/contexts/AuthContext';
import { useMapNavigation } from '@/hooks/useMapNavigation';

const MobileRoomFinderReal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'disponiveis' | 'ocupadas'>('todas');
  const { isAuthenticated } = useAuth();
  const { navigateToMap } = useMapNavigation();

  const { data: allRooms, isLoading: loadingAll } = useRooms();
  const { data: searchResults, isLoading: loadingSearch } = useRoomSearch(searchTerm);

  const rooms = searchTerm ? searchResults : allRooms;
  const isLoading = searchTerm ? loadingSearch : loadingAll;

  const filteredRooms = rooms?.filter(room => {
    if (selectedFilter === 'disponiveis') return room.status === 'disponivel';
    if (selectedFilter === 'ocupadas') return room.status === 'ocupada';
    return true;
  }) || [];

  const getStatusIcon = (status: string) => {
    return status === 'disponivel' 
      ? <CheckCircle className="text-green-600" size={16} />
      : <XCircle className="text-red-600" size={16} />;
  };

  const getStatusColor = (status: string) => {
    return status === 'disponivel' 
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200';
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Faça login para acessar as informações das salas.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500/90 to-pink-500/90 backdrop-blur-md rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Encontrar Salas</h2>
            <p className="text-white/80 text-sm">Localize salas disponíveis no campus</p>
          </div>
        </div>
        
        <div className="relative mb-4 z-10">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Digite número da sala ou bloco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 z-10 relative">
          <button
            onClick={() => setSelectedFilter('todas')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md ${
              selectedFilter === 'todas' 
                ? 'bg-white/30 text-white border border-white/40' 
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedFilter('disponiveis')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md ${
              selectedFilter === 'disponiveis' 
                ? 'bg-white/30 text-white border border-white/40' 
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
            }`}
          >
            Disponíveis
          </button>
          <button
            onClick={() => setSelectedFilter('ocupadas')}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md ${
              selectedFilter === 'ocupadas' 
                ? 'bg-white/30 text-white border border-white/40' 
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
            }`}
          >
            Ocupadas
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando salas...</p>
        </div>
      )}

      {/* Stats */}
      {!isLoading && rooms && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-lg border-none text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <MapPin className="text-blue-600" size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900">{rooms.length}</p>
            <p className="text-xs text-gray-600 font-medium">Total</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-lg border-none text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <CheckCircle className="text-green-600" size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {rooms.filter(r => r.status === 'disponivel').length}
            </p>
            <p className="text-xs text-gray-600 font-medium">Livres</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-lg border-none text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <XCircle className="text-red-600" size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {rooms.filter(r => r.status === 'ocupada').length}
            </p>
            <p className="text-xs text-gray-600 font-medium">Ocupadas</p>
          </div>
        </div>
      )}

      {/* Lista de salas */}
      {!isLoading && filteredRooms && (
        <div className="space-y-3">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin size={24} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma sala encontrada</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-3xl shadow-xl border-none p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Sala {room.numero}</h3>
                    <p className="text-sm text-gray-600">
                      Bloco {room.bloco.toUpperCase()}, {room.andar}º andar
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(room.status)}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                      {room.status === 'disponivel' ? 'Disponível' : 'Ocupada'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>Cap. {room.capacidade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{room.tipo}</span>
                  </div>
                </div>

                {room.status === 'ocupada' && room.aula_atual && (
                  <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                    <p className="text-sm font-medium text-gray-800">{room.aula_atual}</p>
                    {room.professor_atual && (
                      <p className="text-xs text-gray-600">{room.professor_atual}</p>
                    )}
                    {room.alunos_presentes && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {room.alunos_presentes} alunos presentes
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {room.proximas_aulas && room.proximas_aulas.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Próximas aulas:</p>
                    <div className="space-y-1">
                      {room.proximas_aulas.slice(0, 2).map((aula, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{aula.disciplina}</span>
                          <span className="text-gray-500">{aula.hora_inicio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    console.log('Clicando em Ver no Mapa para:', room.numero, room.bloco);
                    navigateToMap(room.numero, room.bloco);
                  }}
                  className="w-full mt-3 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MapPin size={16} />
                  Ver no Mapa
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MobileRoomFinderReal;