
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Users, Map, Search } from "lucide-react";

const MobileHero = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao IFPE!</h2>
        <p className="text-blue-100 mb-4">
          Seu guia completo para navegar pelo Campus Garanhuns
        </p>
        <Button className="bg-white text-blue-600 hover:bg-blue-50">
          Começar Tour <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">50+</p>
          <p className="text-xs text-gray-600">Salas</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">1200+</p>
          <p className="text-xs text-gray-600">Alunos</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="text-amber-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">13</p>
          <p className="text-xs text-gray-600">Anos</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Ações Rápidas</h3>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Map className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Explorar Mapa</p>
              <p className="text-sm text-gray-500">Navegue pelo campus</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" size={20} />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Search className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Encontrar Sala</p>
              <p className="text-sm text-gray-500">Localize rapidamente</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Campus Image */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400" 
          alt="Campus IFPE Garanhuns" 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-1">Campus Garanhuns</h4>
          <p className="text-sm text-gray-600">Instituto Federal de Pernambuco</p>
        </div>
      </div>
    </div>
  );
};

export default MobileHero;
