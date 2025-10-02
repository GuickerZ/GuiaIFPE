import { Clock, MapPin, Book, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useMapNavigation } from '@/hooks/useMapNavigation';

interface ClassInfo {
  disciplina: string;
  professor?: string;
  sala: string;
  sala_numero?: string;
  sala_bloco?: string;
  horario: string;
  tipo_aula?: string;
  total_alunos?: number;
  is_current: boolean;
}

interface CurrentClassCardProps {
  currentClass: ClassInfo | null;
  nextClass: ClassInfo | null;
  userType: 'aluno' | 'professor';
}

const CurrentClassCard = ({ currentClass, nextClass, userType }: CurrentClassCardProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { navigateToMap } = useMapNavigation();
  
  const today = new Date();
  const dateStr = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR });
  
  // Criar array de aulas disponíveis
  const classes = [currentClass, nextClass].filter(Boolean) as ClassInfo[];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  if (classes.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Sem aulas no momento</p>
            <p className="text-sm text-gray-500 mt-1">Aproveite seu tempo livre!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleNavigateToMap = (classInfo: ClassInfo) => {
    // Se temos sala_numero e sala_bloco diretamente, usar
    let numeroSala = classInfo.sala_numero || classInfo.sala;
    let bloco = classInfo.sala_bloco;
    
    // Se não temos sala_bloco, tentar extrair da string sala
    if (!bloco && classInfo.sala) {
      // Padrão: "ASala 2" -> bloco: "A", sala: "Sala 2"
      const match = classInfo.sala.match(/^([A-E]|Biblioteca|Banheiros)(.+)$/);
      if (match) {
        bloco = match[1];
        numeroSala = match[2].trim();
      }
    }
    
    if (numeroSala) {
      console.log('CurrentClassCard - Navegando:', numeroSala, bloco);
      navigateToMap(numeroSala, bloco);
    }
  };

  const renderClassCard = (classInfo: ClassInfo) => {
    const isCurrent = classInfo.is_current;
    const gradientClass = isCurrent 
      ? "from-green-500 to-emerald-600" 
      : "from-blue-500 to-cyan-600";

    return (
      <Card className={`bg-gradient-to-br ${gradientClass} border-0 shadow-xl overflow-hidden rounded-3xl`}>
        <CardContent className="p-0">
          {/* Header Badge */}
          <div className="bg-white/20 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                {isCurrent ? (
                  <>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Aula em Andamento
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    Próxima Aula
                  </>
                )}
              </span>
              <span className="text-white/80 text-xs flex items-center gap-1 capitalize">
                <Calendar size={12} />
                {dateStr}
              </span>
            </div>
            <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs rounded-full px-3 py-1.5">
              {classInfo.horario}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Book size={20} />
                {classInfo.disciplina}
              </h3>
              {classInfo.tipo_aula && (
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs rounded-full capitalize">
                  {classInfo.tipo_aula}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {userType === 'aluno' && classInfo.professor && (
                <div className="flex items-center gap-2 text-white/90">
                  <User size={16} />
                  <span className="text-sm">{classInfo.professor}</span>
                </div>
              )}
              
              {userType === 'professor' && classInfo.total_alunos && (
                <div className="flex items-center gap-2 text-white/90">
                  <User size={16} />
                  <span className="text-sm">{classInfo.total_alunos} alunos</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-white/90">
                <MapPin size={16} />
                <span className="text-sm">
                  Sala {classInfo.sala}
                  {classInfo.sala_bloco && ` - Bloco ${classInfo.sala_bloco}`}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                onClick={() => handleNavigateToMap(classInfo)}
                className="w-full bg-white hover:bg-white/90 text-gray-800 font-semibold rounded-2xl shadow-lg"
                size="sm"
              >
                <MapPin size={16} className="mr-2" />
                Ver no Mapa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {classes.map((classInfo, index) => (
            <CarouselItem key={index}>
              {renderClassCard(classInfo)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {classes.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {classes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentClassCard;
