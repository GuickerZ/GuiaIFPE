import { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TimeDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testTime, setTestTime] = useState<string>("");

  const timeSlots = [
    "07:00", "07:50", "08:40", "09:50", "10:40",
    "11:30", "13:00", "13:50", "14:40", "15:50",
    "16:40", "17:30", "19:00", "19:50", "20:40", "21:30",
  ];

  const handleSetTime = (time: string) => {
    setTestTime(time);
    window.dispatchEvent(
      new CustomEvent("test-time-change", { detail: { time } })
    );
  };

  const handleReset = () => {
    setTestTime("");
    window.dispatchEvent(
      new CustomEvent("test-time-change", { detail: { time: "" } })
    );
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed top-16 right-4 z-50"
      animate={{
        width: isOpen ? 260 : 20,
        height: isOpen ? "auto" : 20,
        borderRadius: isOpen ? "1rem" : "9999px",
      }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`shadow-lg border-2 border-orange-500 overflow-hidden ${
          isOpen ? "cursor-default" : "cursor-pointer"
        }`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <CardContent className={`p-3 ${!isOpen && "p-0"}`}>
          {isOpen ? (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-orange-600" />
                  <span className="font-semibold text-sm">
                    {testTime ? `Teste: ${testTime}` : "Testar Horários"}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-600 mb-2">
                    Selecione um horário para simular:
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        onClick={() => handleSetTime(time)}
                        variant={testTime === time ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-8"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {testTime && (
                    <Button
                      onClick={handleReset}
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                    >
                      Resetar para Hora Real
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            // Pontinho fechado
            <div className="w-full h-full" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimeDebugger;
