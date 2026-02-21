
import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- INTERFACES ---
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount?: number;
}

interface Privilege {
  id: number;
  name: string;
  group: string;
}

// --- MOCK DATA ---
const combinedMockRolesData: Role[] = [
  { id: 'admin', name: 'Administrator', description: 'Full system access, configuration, and user management.', userCount: 2 },
  { id: 'doctor', name: 'Doctor', description: 'Access to clinical modules, patient charts, and prescribing.', userCount: 15 },
  { id: 'nurse', name: 'Nurse', description: 'Access to triage, vitals entry, and patient care modules.', userCount: 25 },
  { id: 'reception', name: 'Receptionist', description: 'Access to patient registration, appointments, and queue management.', userCount: 5 },
  { id: 'pharmacy_manager', name: 'Pharmacist Manager', description: 'Manages pharmacy sales, inventory, and reporting.', userCount: 3 },
  { id: 'pharmacy_staff', name: 'Pharmacy Staff', description: 'Can only view pharmacy sales reports.', userCount: 1 },
  { id: 'lab_technician', name: 'Lab Technician', description: 'Can process lab requests and enter results.', userCount: 8 },
  { id: 'billing_clerk', name: 'Billing Clerk', description: 'Manages patient invoices, payments, and scheme relations.', userCount: 4 },
  { id: 'hr_manager', name: 'HR Manager', description: 'Access to employee records, payroll, and leave management.', userCount: 1 },
];

const mockPrivilegesData: Privilege[] = [
  { id: 1, name: 'Manage Users (Create, Edit, Delete)', group: 'Security' },
  { id: 2, name: 'Manage Roles & Privileges', group: 'Security' },
  { id: 3, name: 'View Audit Logs', group: 'Security' },
  { id: 10, name: 'View Patient Records', group: 'Clinical' },
  { id: 11, name: 'Register New Patients', group: 'Clinical' },
  { id: 12, name: 'Edit Patient Demographics', group: 'Clinical' },
  { id: 13, name: 'Enter Patient Vitals', group: 'Clinical' },
  { id: 14, name: 'Edit Patient Vitals', group: 'Clinical' },
  { id: 15, name: 'Create Consultations', group: 'Clinical' },
  { id: 16, name: 'Manage Appointments', group: 'Clinical' },
  { id: 20, name: 'View Patient Bills', group: 'Billing' },
  { id: 21, name: 'Generate New Bill', group: 'Billing' },
  { id: 22, name: 'Edit Bill Items', group: 'Billing' },
  { id: 23, name: 'Finalize Bills', group: 'Billing' },
  { id: 24, name: 'Process Payments/Receipts', group: 'Billing' },
  { id: 25, name: 'View Billing Reports', group: 'Billing' },
  { id: 30, name: 'View Pharmacy Inventory', group: 'Pharmacy' },
  { id: 31, name: 'Dispense Medication from Prescription', group: 'Pharmacy' },
  { id: 32, name: 'Create Pharmacy Sale (OTC)', group: 'Pharmacy' },
  { id: 33, name: 'View Pharmacy Sales Reports', group: 'Pharmacy' },
  { id: 40, name: 'Access Financial Reports', group: 'Reporting' },
  { id: 41, name: 'Access Clinical Reports', group: 'Reporting' },
  { id: 42, name: 'Access HR Reports', group: 'Reporting' },
];

const mockRolePrivilegeMapData: { [key: string]: number[] } = {
  admin: mockPrivilegesData.map(p => p.id),
  doctor: [10, 11, 12, 13, 14, 15, 16, 31],
  nurse: [10, 13, 14, 16],
  reception: [10, 11, 12, 16, 20],
  pharmacy_manager: [30, 31, 32, 33],
  pharmacy_staff: [33],
  billing_clerk: [20, 21, 22, 23, 24, 25],
  lab_technician: [10, 13],
  hr_manager: [42]
};


// --- CONTEXT DEFINITION ---
interface SecurityContextType {
  roles: Role[];
  rolePrivileges: { [key: string]: number[] };
  addRole: (roleData: { id: string, name: string, description: string }) => void;
  updateRole: (roleData: Role) => void;
  deleteRole: (roleId: string) => void;
  setRolePrivileges: (roleId: string, privilegeIds: number[]) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(combinedMockRolesData);
  const [rolePrivilegesMap, setRolePrivilegesMap] = useState<{ [key: string]: number[] }>(mockRolePrivilegeMapData);

  const addRole = (roleData: { id: string, name: string, description: string }) => {
    const newRole: Role = {
      ...roleData,
      userCount: 0,
    };
    setRoles(prevRoles => [newRole, ...prevRoles]);
    setRolePrivilegesMap(prevMap => ({
      ...prevMap,
      [newRole.id]: []
    }));
  };

  const updateRole = (roleData: Role) => {
    setRoles(prevRoles => prevRoles.map(r => (r.id === roleData.id ? { ...r, ...roleData } : r)));
  };

  const deleteRole = (roleId: string) => {
    setRoles(prevRoles => prevRoles.filter(r => r.id !== roleId));
    setRolePrivilegesMap(prevMap => {
        const newMap = { ...prevMap };
        delete newMap[roleId];
        return newMap;
    });
  };

  const setRolePrivileges = (roleId: string, privilegeIds: number[]) => {
      setRolePrivilegesMap(prevMap => ({
          ...prevMap,
          [roleId]: privilegeIds
      }));
  };

  const value = {
    roles,
    rolePrivileges: rolePrivilegesMap,
    addRole,
    updateRole,
    deleteRole,
    setRolePrivileges,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// --- HOOK ---
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
