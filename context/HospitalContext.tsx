
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HospitalContextType {
  hospitalName: string;
  updateHospitalName: (name: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hospitalName, setHospitalName] = useState('UltraHub HMIS');

  const updateHospitalName = (name: string) => {
    setHospitalName(name);
  };

  return (
    <HospitalContext.Provider value={{ hospitalName, updateHospitalName }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
