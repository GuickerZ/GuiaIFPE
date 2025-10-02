
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">IF</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">IFPE Garanhuns</h3>
                <p className="text-xs text-gray-400">Instituto Federal de Pernambuco</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Educação pública, gratuita e de qualidade para transformar vidas e desenvolver a região.
            </p>
            <div className="space-y-2">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <MapPin size={18} />
                <span>Rua Padre Agobar Valença, Garanhuns - PE</span>
              </a>
              <a 
                href="tel:+558737618200" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                <span>(87) 3761-8200</span>
              </a>
              <a 
                href="mailto:contato@garanhuns.ifpe.edu.br" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail size={18} />
                <span>contato@garanhuns.ifpe.edu.br</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Links Rápidos</h3>
            <nav className="grid grid-cols-2 gap-2">
              <a href="#inicio" className="text-gray-400 hover:text-white transition-colors py-1">Início</a>
              <a href="#mapa" className="text-gray-400 hover:text-white transition-colors py-1">Mapa do Campus</a>
              <a href="#salas" className="text-gray-400 hover:text-white transition-colors py-1">Localizar Salas</a>
              <a href="#curiosidades" className="text-gray-400 hover:text-white transition-colors py-1">Curiosidades</a>
              <a href="https://www.ifpe.edu.br" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors py-1">Site Oficial</a>
              <a href="https://www.ifpe.edu.br/campus/garanhuns" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors py-1">Portal do Campus</a>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Portal do Estudante</h3>
            <p className="text-gray-400 mb-4">
              Acesse o Portal do Estudante para consultar notas, frequência e informações acadêmicas.
            </p>
            <a 
              href="https://qacademico.ifpe.edu.br" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Acessar Portal
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} IFPE Campus Garanhuns. Todos os direitos reservados.</p>
          <p className="mt-2">
            Este é um site de demonstração criado com fins educacionais.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
