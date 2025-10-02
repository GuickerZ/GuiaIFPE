
import { Search, Map, Calendar, Clock, Building } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: "busca", label: "Busca", icon: Search },
    { id: "mapa", label: "Mapa", icon: Map },
    { id: "salas", label: "Salas", icon: Building },
    { id: "calendario", label: "Calendário", icon: Calendar },
    { id: "horario", label: "Horário", icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-xl rounded-t-3xl">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive 
                  ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-500"} />
              <span className={`text-xs mt-1 ${isActive ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
