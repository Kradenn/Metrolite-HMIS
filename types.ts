
export interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  submenu?: MenuItem[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  status: 'Waiting' | 'In Progress' | 'Completed';
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  doctor: string;
  type: string;
}
