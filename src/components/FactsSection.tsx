
import { Award, BookOpen, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FactsSection = () => {
  const facts = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Fundação",
      description: "O IFPE Campus Garanhuns foi inaugurado em 2010 como parte da expansão da Rede Federal de Educação Profissional e Tecnológica."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Comunidade",
      description: "Mais de 1.200 alunos e 100 servidores compõem nossa comunidade acadêmica, contribuindo para o desenvolvimento da região."
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Excelência",
      description: "Reconhecido por sua qualidade de ensino, o campus oferece cursos técnicos, superiores e de pós-graduação em diversas áreas."
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      title: "Localização",
      description: "Situado na região do Agreste Meridional de Pernambuco, o campus está estrategicamente posicionado para atender toda a região."
    }
  ];

  const curiosities = [
    "O campus possui uma área verde preservada com espécies nativas da Caatinga.",
    "A biblioteca do campus tem um acervo especializado em literatura regional nordestina.",
    "O prédio principal foi projetado seguindo conceitos de sustentabilidade e eficiência energética.",
    "O campus realiza anualmente a Semana de Ciência e Tecnologia, um dos maiores eventos científicos da região.",
    "Alunos do IFPE Garanhuns já conquistaram prêmios nacionais e internacionais em competições científicas."
  ];

  return (
    <section id="curiosidades" className="py-16 px-4 bg-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Curiosidades e Fatos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra informações interessantes sobre o IFPE Campus Garanhuns e sua história.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {facts.map((fact, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {fact.icon}
                <CardTitle className="text-xl">{fact.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{fact.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Você Sabia?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {curiosities.slice(0, Math.ceil(curiosities.length / 2)).map((curiosity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{curiosity}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {curiosities.slice(Math.ceil(curiosities.length / 2)).map((curiosity, index) => (
                  <div key={index + Math.ceil(curiosities.length / 2)} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + Math.ceil(curiosities.length / 2) + 1}
                    </div>
                    <p className="text-gray-700">{curiosity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-white">
            <p className="text-center font-medium">
              Venha conhecer nosso campus e faça parte da nossa história!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactsSection;
