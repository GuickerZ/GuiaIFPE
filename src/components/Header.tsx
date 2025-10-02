
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">IF</span>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl">IFPE Garanhuns</h1>
            <p className="text-xs text-gray-500">Campus Garanhuns</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#inicio" className="font-medium text-gray-700 hover:text-blue-600">
            Início
          </a>
          <a href="#mapa" className="font-medium text-gray-700 hover:text-blue-600">
            Mapa do Campus
          </a>
          <a href="#salas" className="font-medium text-gray-700 hover:text-blue-600">
            Localizar Salas
          </a>
          <a href="#curiosidades" className="font-medium text-gray-700 hover:text-blue-600">
            Curiosidades
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden z-50 animate-fade-in">
            <div className="flex flex-col p-4">
              <a
                href="#inicio"
                className="py-2 px-4 hover:bg-gray-100 rounded"
                onClick={toggleMenu}
              >
                Início
              </a>
              <a
                href="#mapa"
                className="py-2 px-4 hover:bg-gray-100 rounded"
                onClick={toggleMenu}
              >
                Mapa do Campus
              </a>
              <a
                href="#salas"
                className="py-2 px-4 hover:bg-gray-100 rounded"
                onClick={toggleMenu}
              >
                Localizar Salas
              </a>
              <a
                href="#curiosidades"
                className="py-2 px-4 hover:bg-gray-100 rounded"
                onClick={toggleMenu}
              >
                Curiosidades
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
