import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimeDebugContextType {
  testTime: string;
  setTestTime: (time: string) => void;
}

const TimeDebugContext = createContext<TimeDebugContextType | undefined>(undefined);

export const TimeDebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testTime, setTestTime] = useState<string>('');

  useEffect(() => {
    const handleTestTimeChange = (event: CustomEvent) => {
      const newTime = event.detail.time || '';
      console.log('TimeDebugContext recebeu evento:', newTime);
      setTestTime(newTime);
    };

    window.addEventListener('test-time-change', handleTestTimeChange as EventListener);
    return () => {
      window.removeEventListener('test-time-change', handleTestTimeChange as EventListener);
    };
  }, []);

  return (
    <TimeDebugContext.Provider value={{ testTime, setTestTime }}>
      {children}
    </TimeDebugContext.Provider>
  );
};

export const useTimeDebug = () => {
  const context = useContext(TimeDebugContext);
  if (context === undefined) {
    throw new Error('useTimeDebug must be used within a TimeDebugProvider');
  }
  return context;
};
