
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section 
      id="inicio" 
      className="relative bg-gradient-to-r from-blue-800 to-green-700 py-20 px-4 text-white"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Bem-vindo ao IFPE <br />
            <span className="text-green-300">Campus Garanhuns</span>
          </h1>
          <p className="text-lg max-w-lg">
            Conheça nosso campus, localize salas e descubra curiosidades sobre 
            nossa instituição. Seu guia completo para navegar pelo IFPE Garanhuns.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-100">
              <a href="#mapa">Explorar o Mapa</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="#salas">Localizar Salas</a>
            </Button>
          </div>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <img 
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800" 
            alt="IFPE Garanhuns Campus" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-12" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,.05.01Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
