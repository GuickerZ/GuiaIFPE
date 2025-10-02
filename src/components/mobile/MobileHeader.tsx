import { GraduationCap, Bell, User, X, LogOut } from "lucide-react";
import { useStudent } from "@/contexts/StudentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
const MobileHeader = () => {
  const { selectedStudent, setSelectedStudent } = useStudent();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    setSelectedStudent(null);
    await logout();
  };
  return (
    <header className="bg-gradient-to-br from-blue-500/90 to-green-500/90 backdrop-blur-md relative overflow-hidden rounded-b-[2rem]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 blur-2xl"></div>
      </div>
      
      {/* Header content */}
      <div className="relative z-10 p-5 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Guia IFPE</h1>
              <p className="text-xs text-white/80">Campus Garanhuns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all active:scale-95 shadow-lg">
              <Bell size={18} className="text-white" />
            </button>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm p-0 transition-all active:scale-95 shadow-lg"
              title="Sair da conta"
            >
              <LogOut size={18} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default MobileHeader;