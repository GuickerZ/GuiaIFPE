
import { Award, BookOpen, Users, Calendar, Star, Zap } from "lucide-react";

const MobileFacts = () => {
  const facts = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      title: "Fundado em 2010",
      description: "13 anos transformando vidas através da educação"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "1200+ Alunos",
      description: "Comunidade diversa e acolhedora"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      title: "15+ Cursos",
      description: "Técnicos, superiores e pós-graduação"
    },
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: "Reconhecimento",
      description: "Excelência em ensino público"
    }
  ];

  const curiosities = [
    {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      title: "Área Verde Preservada",
      description: "Campus possui espécies nativas da Caatinga mantidas e protegidas."
    },
    {
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      title: "Literatura Regional",
      description: "Biblioteca especializada em literatura nordestina com acervo único."
    },
    {
      icon: <Zap className="h-5 w-5 text-green-500" />,
      title: "Sustentabilidade",
      description: "Prédio projetado com conceitos de eficiência energética."
    },
    {
      icon: <Award className="h-5 w-5 text-purple-500" />,
      title: "Competições Científicas",
      description: "Alunos premiados em competições nacionais e internacionais."
    },
    {
      icon: <Users className="h-5 w-5 text-red-500" />,
      title: "Semana de C&T",
      description: "Maior evento científico da região acontece anualmente no campus."
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sobre o Campus</h2>
        <p className="text-gray-600">Descubra fatos e curiosidades sobre o IFPE Garanhuns</p>
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-2 gap-3">
        {facts.map((fact, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              {fact.icon}
            </div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">{fact.title}</h4>
            <p className="text-xs text-gray-600">{fact.description}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Nossa Missão</h3>
        <p className="text-blue-100 text-sm leading-relaxed">
          Promover educação pública, gratuita e de qualidade, contribuindo para 
          o desenvolvimento sustentável do Agreste Meridional de Pernambuco através 
          da formação de cidadãos críticos e profissionais qualificados.
        </p>
      </div>

      {/* Curiosities */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Você Sabia?</h3>
        <div className="space-y-4">
          {curiosities.map((curiosity, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                {curiosity.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm mb-1">{curiosity.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{curiosity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Contato</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">📍 Rua Padre Agobar Valença, Garanhuns - PE</p>
          <p className="text-gray-600">📞 (87) 3761-8200</p>
          <p className="text-gray-600">✉️ contato@garanhuns.ifpe.edu.br</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <h3 className="font-semibold text-gray-800 mb-2">Visite Nosso Campus!</h3>
        <p className="text-sm text-gray-600 mb-4">
          Venha conhecer nossa estrutura e faça parte da nossa comunidade.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Agendar Visita
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Site Oficial
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFacts;
