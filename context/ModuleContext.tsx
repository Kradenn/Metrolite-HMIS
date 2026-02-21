import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ModuleState {
  enabled: boolean;
  submodules: Record<string, boolean>;
}

export interface GlobalModuleState {
  clinical: ModuleState;
  medicalMopc: ModuleState;
  diagnostics: ModuleState;
  mch: ModuleState;
  dentalEye: ModuleState;
  rehabWellness: ModuleState;
  pharmacy: ModuleState;
  morgue: ModuleState;
  telehealth: ModuleState;
  cmePortal: ModuleState;
  accounts: ModuleState;
  billing: ModuleState;
  procurement: ModuleState;
  inventory: ModuleState;
  hr: ModuleState;
  kitchen: ModuleState;
  website: ModuleState;
  portalManager: ModuleState;
  communication: ModuleState;
}

const DEFAULT_STATE: GlobalModuleState = {
  clinical: { 
    enabled: true, 
    submodules: { admissions: true, appointments: true, cds: true, consultation: true, nursing: true, chart: true, queue: true, referrals: true, registration: true, triage: true } 
  },
  medicalMopc: { 
    enabled: true, 
    submodules: { cardiology: true, dermatology: true, diabetic: true, neurology: true, renal: true, mopc: true } 
  },
  diagnostics: { 
    enabled: true, 
    submodules: { ent: true, oncology: true, ortho: true, urology: true, sopc: true, lab: true, radiology: true, theatre: true } 
  },
  mch: { 
    enabled: true, 
    submodules: { antenatal: true, intrapartum: true, paediatric: true, postnatal: true, ayfhs: true, highRisk: true, chv: true } 
  },
  dentalEye: { 
    enabled: true, 
    submodules: { dental: true, eye: true, glaucoma: true } 
  },
  rehabWellness: { 
    enabled: true, 
    submodules: { nutrition: true, occupational: true, physio: true, psychiatry: true } 
  },
  pharmacy: { 
    enabled: true, 
    submodules: { direct: true, main: true, pos: true } 
  },
  morgue: { 
    enabled: true, 
    submodules: { chambers: true, main: true, storage: true } 
  },
  telehealth: { 
    enabled: true, 
    submodules: { command: true, settings: true, virtual: true } 
  },
  cmePortal: { 
    enabled: true, 
    submodules: { admin: true, config: true, learning: true } 
  },
  accounts: { 
    enabled: true, 
    submodules: { assets: true, deposits: true, reconciliation: true, banks: true, budgeting: true, capitations: true, shifts: true, transfers: true, cheques: true, currency: true, fiscal: true, journal: true, ledger: true, opening: true, payment_modes: true, refunds: true, taxes: true } 
  },
  billing: { 
    enabled: true, 
    submodules: { invoices: true, gatepass: true, patient_bills: true, proforma: true, receipts: true } 
  },
  procurement: { 
    enabled: true, 
    submodules: { bills: true, vouchers: true, grn: true, orders: true, requisitions: true, suppliers: true } 
  },
  inventory: { 
    enabled: true, 
    submodules: { stock: true, interbranch: true, internal: true, inventory: true, consumption: true, uom: true } 
  },
  hr: { 
    enabled: true, 
    submodules: { advance: true, consultants: true, employees: true, leaves: true, taxes: true, periods: true, parameters: true, payslips: true, scheduling: true } 
  },
  kitchen: { 
    enabled: true, 
    submodules: { dashboard: true, plans: true, inventory: true, ordering: true } 
  },
  website: { 
    enabled: true, 
    submodules: { blog: true, events: true, layouts: true, content: true, config: true, manager: true } 
  },
  portalManager: { 
    enabled: true, 
    submodules: { dashboard: true, access: true, toggles: true, branding: true } 
  },
  communication: {
    enabled: true,
    submodules: { sms: true, sms_templates: true, diary: true, chat: true, ultra_chat: true, notifications: true, feedback: true, helpdesk: true }
  }
};

interface ModuleContextType {
  modules: GlobalModuleState;
  toggleModule: (key: keyof GlobalModuleState) => void;
  toggleSubmodule: (moduleKey: keyof GlobalModuleState, subKey: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<GlobalModuleState>(() => {
    const saved = localStorage.getItem('ultrahub_modules_v3');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('ultrahub_modules_v3', JSON.stringify(modules));
  }, [modules]);

  const toggleModule = (key: keyof GlobalModuleState) => {
    setModules(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const toggleSubmodule = (moduleKey: keyof GlobalModuleState, subKey: string) => {
    setModules(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        submodules: {
          ...prev[moduleKey].submodules,
          [subKey]: !prev[moduleKey].submodules[subKey]
        }
      }
    }));
  };

  return (
    <ModuleContext.Provider value={{ modules, toggleModule, toggleSubmodule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};