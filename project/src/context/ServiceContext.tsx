import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceContextType {
  selectedServices: string[];
  toggleService: (id: string) => void;
  clearServices: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(serviceId => serviceId !== id)
        : [...prev, id]
    );
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  return (
    <ServiceContext.Provider value={{ selectedServices, toggleService, clearServices }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServiceContext() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
}