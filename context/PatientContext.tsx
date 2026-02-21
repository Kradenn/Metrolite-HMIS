
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PatientRecord {
  id: string;
  surname: string;
  othernames: string;
  gender: string;
  dob?: string;
  age: number;
  
  // Contact & Address
  telephone: string;
  telephone2?: string;
  email?: string;
  residence?: string;
  town?: string;
  postalAddress?: string;
  postalCode?: string;
  nationality?: string;

  // Identification
  idType?: string;
  idNumber?: string; // Mapped to 'idNo' in some views, keeping consistent
  referenceNumber?: string;

  // Socio-economic
  occupation?: string;
  
  // Medical / Visit Context
  scheme: string;
  outpatientNo: string;
  inpatientNo?: string;
  status: 'Queue' | 'Admitted' | 'Discharged' | 'None';
  diagnosis?: string;
  diet?: string;
  allergies?: string;
  
  // Next of Kin / Emergency
  parentName?: string; // Legacy field, can map to NOK Name
  emergencyContactName?: string; // NOK Name
  emergencyContactPhone?: string; // NOK Contact
  nokRelation?: string;

  // Metadata
  primaryLanguage?: string;
  notes?: string;
  room?: string;
}

interface PatientContextType {
  activePatient: PatientRecord | null;
  setActivePatient: (patient: PatientRecord | null) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePatient, setActivePatient] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PatientContext.Provider value={{ activePatient, setActivePatient, isLoading, setIsLoading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
