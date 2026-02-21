
import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { MenuItem } from '../types';
import { useModules, GlobalModuleState } from '../context/ModuleContext';

export interface ColoredMenuItem extends MenuItem {
  color?: string;
  submenu?: ColoredMenuItem[];
  moduleKey?: keyof GlobalModuleState;
  subModuleKey?: string;
}

// --- PORTAL MENU DEFINITION ---
export const portalMenuItems: ColoredMenuItem[] = [
  {
    title: 'Portal Dashboard',
    icon: 'fa-th-large',
    path: '/portal/home',
    color: 'text-indigo-400'
  },
  {
    title: 'My Health',
    icon: 'fa-heartbeat',
    color: 'text-rose-400',
    submenu: [
      { title: 'My Appointments', icon: 'fa-calendar-check', path: '/portal/appointments' },
      { title: 'Telehealth', icon: 'fa-video', path: '/portal/telehealth' },
      { title: 'Lab Results', icon: 'fa-flask', path: '/portal/tests' },
      { title: 'Medications', icon: 'fa-pills', path: '/portal/prescriptions' },
    ]
  },
  {
    title: 'Finance & HR',
    icon: 'fa-wallet',
    color: 'text-emerald-400',
    submenu: [
      { title: 'My Bills', icon: 'fa-file-invoice-dollar', path: '/portal/bills' },
      { title: 'My Payslips', icon: 'fa-file-contract', path: '/portal/payslips' },
      { title: 'Salary Advances', icon: 'fa-hand-holding-usd', path: '/portal/advances' },
      { title: 'Leave Requests', icon: 'fa-plane-departure', path: '/portal/leaves' },
    ]
  },
  {
    title: 'Support',
    icon: 'fa-headset',
    color: 'text-blue-400',
    submenu: [
      { title: 'Secure Chat', icon: 'fa-comments', path: '/portal/chat' },
      { title: 'Notifications', icon: 'fa-bell', path: '/portal/notifications' },
      { title: 'Security', icon: 'fa-lock', path: '/portal/password' },
    ]
  }
];

// 1. Clinical Modules
export const clinicalMenuItems: ColoredMenuItem[] = [
  {
    title: 'Clinical',
    icon: 'fa-user-md',
    color: 'text-sky-400',
    moduleKey: 'clinical',
    submenu: [
      { title: 'OPD Management', icon: 'fa-users-viewfinder', path: '/clinical/opd-management', subModuleKey: 'queue' },
      { title: 'IPD Management', icon: 'fa-bed', path: '/clinical/ipd-management', subModuleKey: 'admissions' },
      { title: 'Appointments', icon: 'fa-calendar-check', path: '/clinical/appointments', subModuleKey: 'appointments' },
      { title: 'Queue', icon: 'fa-list-ol', path: '/clinical/queue', subModuleKey: 'queue' },
      { title: 'Triage', icon: 'fa-heartbeat', path: '/clinical/triage', subModuleKey: 'triage' },
      { title: 'Consultation', icon: 'fa-stethoscope', path: '/clinical/consultation', subModuleKey: 'consultation' },
      { title: 'Nursing', icon: 'fa-user-nurse', path: '/clinical/nursing', subModuleKey: 'nursing' },
      { title: 'Patient Chart', icon: 'fa-file-medical', path: '/clinical/chart', subModuleKey: 'chart' },
      { title: 'CDS Orders (Smart Sets)', icon: 'fa-list-check', path: '/clinical/cds', subModuleKey: 'cds' },
      { title: 'Referrals', icon: 'fa-exchange-alt', path: '/clinical/referrals', subModuleKey: 'referrals' },
    ]
  },
  {
    title: 'CME Portal',
    icon: 'fa-graduation-cap',
    color: 'text-teal-400',
    moduleKey: 'cmePortal',
    submenu: [
      { title: 'Administration', icon: 'fa-user-shield', path: '/cme/admin', subModuleKey: 'admin' },
      { title: 'Configuration', icon: 'fa-cog', path: '/cme/config', subModuleKey: 'config' },
      { title: 'Learning Center', icon: 'fa-book-reader', path: '/cme', subModuleKey: 'learning' },
    ]
  },
  {
    title: 'Diagnostics',
    icon: 'fa-procedures',
    color: 'text-red-400',
    moduleKey: 'diagnostics',
    submenu: [
      { title: 'IoT Monitor', icon: 'fa-microchip', path: '/iot-monitor', subModuleKey: 'lab' },
      { title: 'ENT Clinic', icon: 'fa-head-side-mask', path: '/diagnostics/ent', subModuleKey: 'ent' },
      { title: 'Laboratory', icon: 'fa-vials', path: '/lab', subModuleKey: 'lab' },
      { title: 'Oncology', icon: 'fa-ribbon', path: '/diagnostics/oncology', subModuleKey: 'oncology' },
      { title: 'Orthopedic', icon: 'fa-bone', path: '/diagnostics/ortho', subModuleKey: 'ortho' },
      { title: 'Radiology', icon: 'fa-x-ray', path: '/radiology', subModuleKey: 'radiology' },
      { title: 'SOPC General', icon: 'fa-user-injured', path: '/diagnostics/sopc', subModuleKey: 'sopc' },
      { title: 'Theatre', icon: 'fa-procedures', path: '/theatre', subModuleKey: 'theatre' },
      { title: 'Urology', icon: 'fa-tint', path: '/diagnostics/urology', subModuleKey: 'urology' },
    ]
  },
  {
    title: 'Dental & Eye',
    icon: 'fa-teeth',
    color: 'text-amber-500',
    moduleKey: 'dentalEye',
    submenu: [
      { title: 'Dental Clinic', icon: 'fa-tooth', path: '/dental-eye/dental', subModuleKey: 'dental' },
      { title: 'Eye Clinic', icon: 'fa-eye', path: '/dental-eye/eye', subModuleKey: 'eye' },
      { title: 'Glaucoma Screening', icon: 'fa-microscope', path: '/dental-eye/glaucoma', subModuleKey: 'glaucoma' },
    ]
  },
  {
    title: 'RMNCH',
    icon: 'fa-baby',
    color: 'text-rose-400',
    moduleKey: 'mch',
    submenu: [
      { title: 'Adolescent Health', icon: 'fa-user-graduate', path: '/mch/ayfhs', subModuleKey: 'ayfhs' },
      { title: 'Antenatal Clinic', icon: 'fa-baby-carriage', path: '/mch/antenatal', subModuleKey: 'antenatal' },
      { title: 'Intrapartum Care', icon: 'fa-procedures', path: '/mch/intrapartum', subModuleKey: 'intrapartum' },
      { title: 'Community Health (CHV)', icon: 'fa-house-user', path: '/mch/chv', subModuleKey: 'chv' },
      { title: 'High-Risk Clinic', icon: 'fa-exclamation-triangle', path: '/mch/high-risk', subModuleKey: 'highRisk' },
      { title: 'Paediatric Clinic', icon: 'fa-child', path: '/mch/paediatric', subModuleKey: 'paediatric' },
      { title: 'Postnatal Clinic', icon: 'fa-hands-holding-child', path: '/mch/postnatal', subModuleKey: 'postnatal' },
    ]
  },
  {
    title: 'Medical (MOPC)',
    icon: 'fa-heart-pulse',
    color: 'text-indigo-400',
    moduleKey: 'medicalMopc',
    submenu: [
      { title: 'Cardiology', icon: 'fa-heartbeat', path: '/medical/cardiology', subModuleKey: 'cardiology' },
      { title: 'Dermatology', icon: 'fa-hand-sparkles', path: '/medical/dermatology', subModuleKey: 'dermatology' },
      { title: 'Diabetic Clinic', icon: 'fa-syringe', path: '/medical/diabetic', subModuleKey: 'diabetic' },
      { title: 'MOPC General', icon: 'fa-user-tie', path: '/medical/mopc', subModuleKey: 'mopc' },
      { title: 'Neurology', icon: 'fa-brain', path: '/medical/neurology', subModuleKey: 'neurology' },
      { title: 'Renal / Nephrology', icon: 'fa-hospital-user', path: '/medical/renal', subModuleKey: 'renal' },
    ]
  },
  {
    title: 'Morgue',
    icon: 'fa-hourglass-end',
    color: 'text-slate-500',
    moduleKey: 'morgue',
    submenu: [
      { title: 'Chambers', icon: 'fa-door-closed', path: '/morgue/chambers', subModuleKey: 'chambers' },
      { title: 'Morgue', icon: 'fa-book-dead', path: '/morgue/main', subModuleKey: 'main' },
      { title: 'Storage Areas', icon: 'fa-warehouse', path: '/morgue/storage', subModuleKey: 'storage' },
    ]
  },
  {
    title: 'Pharmacy',
    icon: 'fa-medkit',
    color: 'text-red-400',
    moduleKey: 'pharmacy',
    submenu: [
      { title: 'Over The Counter', icon: 'fa-shopping-basket', path: '/pharmacy/direct', subModuleKey: 'direct' },
      { title: 'Pharmacy', icon: 'fa-capsules', path: '/pharmacy/main', subModuleKey: 'main' },
      { title: 'Point of Sale', icon: 'fa-cash-register', path: '/pharmacy/pos', subModuleKey: 'pos' },
    ]
  },
  {
    title: 'Rehab & Wellness',
    icon: 'fa-walking',
    color: 'text-teal-500',
    moduleKey: 'rehabWellness',
    submenu: [
      { title: 'Nutrition', icon: 'fa-apple-alt', path: '/rehab/nutrition', subModuleKey: 'nutrition' },
      { title: 'Occupational Therapy', icon: 'fa-hands-helping', path: '/rehab/occupational', subModuleKey: 'occupational' },
      { title: 'Physiotherapy', icon: 'fa-walking', path: '/rehab/physio', subModuleKey: 'physio' },
      { title: 'Psychiatry', icon: 'fa-head-side-virus', path: '/rehab/psychiatry', subModuleKey: 'psychiatry' },
    ]
  },
  {
    title: 'Telehealth',
    icon: 'fa-video',
    color: 'text-purple-400',
    moduleKey: 'telehealth',
    submenu: [
      { title: 'Command Center', icon: 'fa-tower-broadcast', path: '/telehealth', subModuleKey: 'command' },
      { title: 'Telehealth Settings', icon: 'fa-cog', path: '/telehealth/settings', subModuleKey: 'settings' },
      { title: 'Virtual Appointments', icon: 'fa-calendar-check', path: '/clinical/appointments', subModuleKey: 'virtual' },
    ]
  },
];

// 2. ERP Modules
export const erpMenuItems: ColoredMenuItem[] = [
  {
    title: 'Accounts',
    icon: 'fa-bank',
    color: 'text-lime-400',
    moduleKey: 'accounts',
    submenu: [
      { title: 'Asset Management', icon: 'fa-cubes', path: '/accounts/assets', subModuleKey: 'assets' },
      { title: 'Bank Deposits', icon: 'fa-piggy-bank', path: '/accounts/deposits', subModuleKey: 'deposits' },
      { title: 'Bank Reconciliation', icon: 'fa-scale-balanced', path: '/accounts/reconciliation', subModuleKey: 'reconciliation' },
      { title: 'Banks', icon: 'fa-university', path: '/accounts/banks', subModuleKey: 'banks' },
      { title: 'Budgeting', icon: 'fa-chart-pie', path: '/accounts/budgeting', subModuleKey: 'budgeting' },
      { title: 'Capitations', icon: 'fa-hand-holding-usd', path: '/accounts/capitations', subModuleKey: 'capitations' },
      { title: 'Cash Transfers', icon: 'fa-exchange-alt', path: '/accounts/transfers', subModuleKey: 'transfers' },
      { title: 'Cashier Shifts', icon: 'fa-user-clock', path: '/accounts/shifts', subModuleKey: 'shifts' },
      { title: 'Cheques', icon: 'fa-money-check', path: '/accounts/cheques', subModuleKey: 'cheques' },
      { title: 'Currency Units', icon: 'fa-coins', path: '/accounts/currency', subModuleKey: 'currency' },
      { title: 'Fiscal Periods', icon: 'fa-calendar-alt', path: '/accounts/fiscal', subModuleKey: 'fiscal' },
      { title: 'Journal Vouchers', icon: 'fa-book', path: '/accounts/journal', subModuleKey: 'journal' },
      { title: 'Ledger Accounts', icon: 'fa-sitemap', path: '/accounts/ledger', subModuleKey: 'ledger' },
      { title: 'Opening Balances', icon: 'fa-door-open', path: '/accounts/opening-balances', subModuleKey: 'opening' },
      { title: 'Payment Modes', icon: 'fa-wallet', path: '/accounts/payment-modes', subModuleKey: 'payment_modes' },
      { title: 'Refund Voucher', icon: 'fa-file-invoice-dollar', path: '/accounts/refunds', subModuleKey: 'refunds' },
      { title: 'Taxes', icon: 'fa-percent', path: '/accounts/taxes', subModuleKey: 'taxes' },
    ]
  },
  {
    title: 'Billing',
    icon: 'fa-credit-card',
    color: 'text-emerald-400',
    moduleKey: 'billing',
    submenu: [
      { title: 'A/R Invoices', icon: 'fa-file-invoice', path: '/billing/invoices', subModuleKey: 'invoices' },
      { title: 'Gate Pass', icon: 'fa-ticket-alt', path: '/billing/gate-pass', subModuleKey: 'gatepass' },
      { title: 'Generate Bill', icon: 'fa-plus-circle', path: '/clinical/billing', subModuleKey: 'patient_bills' },
      { title: 'Patient Bills', icon: 'fa-user-invoice', path: '/billing/bills', subModuleKey: 'patient_bills' },
      { title: 'ProForma Invoices', icon: 'fa-file-alt', path: '/billing/proforma', subModuleKey: 'proforma' },
      { title: 'Receipts', icon: 'fa-receipt', path: '/billing/receipts', subModuleKey: 'receipts' },
    ]
  },
  {
    title: 'Human Resource',
    icon: 'fa-users',
    color: 'text-orange-400',
    moduleKey: 'hr',
    submenu: [
      { title: 'Advance Salary', icon: 'fa-hand-holding-usd', path: '/hr/advance', subModuleKey: 'advance' },
      { title: 'Consultants', icon: 'fa-user-tie', path: '/hr/consultants', subModuleKey: 'consultants' },
      { title: 'Employees', icon: 'fa-id-card', path: '/hr/employees', subModuleKey: 'employees' },
      { title: 'Leaves', icon: 'fa-plane-departure', path: '/hr/leaves', subModuleKey: 'leaves' },
      { title: 'Pay Periods', icon: 'fa-calendar-alt', path: '/hr/periods', subModuleKey: 'periods' },
      { title: 'PAYE Tax Ranges', icon: 'fa-percent', path: '/hr/tax-ranges', subModuleKey: 'taxes' },
      { title: 'Payroll Parameters', icon: 'fa-sliders-h', path: '/hr/parameters', subModuleKey: 'parameters' },
      { title: 'Payslips', icon: 'fa-file-invoice-dollar', path: '/hr/payslips', subModuleKey: 'payslips' },
      { title: 'Scheduling', icon: 'fa-clock', path: '/hr/scheduling', subModuleKey: 'scheduling' },
    ]
  },
  {
    title: 'Inventory',
    icon: 'fa-archive',
    color: 'text-slate-400',
    moduleKey: 'inventory',
    submenu: [
      { title: 'Add Stock', icon: 'fa-plus-square', path: '/inventory/stock-take', subModuleKey: 'stock' },
      { title: 'Interbranch Orders', icon: 'fa-truck-moving', path: '/inventory/interbranch', subModuleKey: 'interbranch' },
      { title: 'Internal Orders', icon: 'fa-dolly', path: '/inventory/internal', subModuleKey: 'internal' },
      { title: 'Inventory', icon: 'fa-boxes', path: '/inventory/main', subModuleKey: 'inventory' },
      { title: 'Material Consumption', icon: 'fa-box-open', path: '/inventory/consumption', subModuleKey: 'consumption' },
      { title: 'Unit of Measure', icon: 'fa-ruler-combined', path: '/inventory/uom', subModuleKey: 'uom' },
    ]
  },
  {
    title: 'Kitchen',
    icon: 'fa-utensils',
    color: 'text-orange-400',
    moduleKey: 'kitchen',
    submenu: [
        { title: 'Dashboard', icon: 'fa-chart-line', path: '/kitchen/dashboard', subModuleKey: 'dashboard' },
        { title: 'Dietary Plans', icon: 'fa-apple-alt', path: '/kitchen/plans', subModuleKey: 'plans' },
        { title: 'Inventory', icon: 'fa-warehouse', path: '/kitchen/inventory', subModuleKey: 'inventory' },
        { title: 'Meal Ordering', icon: 'fa-hand-pointer', path: '/kitchen/ordering', subModuleKey: 'ordering' },
    ]
  },
  {
    title: 'Procurement',
    icon: 'fa-money-bill-transfer',
    color: 'text-teal-400',
    moduleKey: 'procurement',
    submenu: [
      { title: 'A/P Invoices', icon: 'fa-file-invoice', path: '/procurement/bills', subModuleKey: 'bills' },
      { title: 'A/P Payment Vouchers', icon: 'fa-money-check-alt', path: '/procurement/vouchers', subModuleKey: 'vouchers' },
      { title: 'Goods Received Notes', icon: 'fa-dolly-flatbed', path: '/procurement/grn', subModuleKey: 'grn' },
      { title: 'Purchase Orders', icon: 'fa-file-contract', path: '/procurement/orders', subModuleKey: 'orders' },
      { title: 'Requisition Note', icon: 'fa-file-signature', path: '/procurement/requisitions', subModuleKey: 'requisitions' },
      { title: 'Suppliers', icon: 'fa-truck-field', path: '/procurement/suppliers', subModuleKey: 'suppliers' },
    ]
  },
];

// 3. UM Chat Modules
export const communicationMenuItems: ColoredMenuItem[] = [
  {
    title: 'UM Chat',
    icon: 'fa-comments',
    color: 'text-amber-400',
    moduleKey: 'communication',
    submenu: [
      { title: 'Messaging Hub', icon: 'fa-comment-dots', path: '/um-chat', subModuleKey: 'chat' },
      { title: 'Broadcast SMS', icon: 'fa-sms', path: '/um-chat/sms', subModuleKey: 'sms' },
      { title: 'SMS Templates', icon: 'fa-file-lines', path: '/um-chat/sms-templates', subModuleKey: 'sms_templates' },
      { title: 'Staff Diary', icon: 'fa-calendar-days', path: '/um-chat/diary', subModuleKey: 'diary' },
      { title: 'System Alerts', icon: 'fa-bell', path: '/um-chat/notifications', subModuleKey: 'notifications' },
      { title: 'Feedback Hub', icon: 'fa-bullhorn', path: '/um-chat/feedback', subModuleKey: 'feedback' },
      { title: 'Support Help Desk', icon: 'fa-headset', path: '/um-chat/help-desk', subModuleKey: 'helpdesk' },
    ]
  }
];

// 4. Analytics, Security, Website & Admin
export const adminMenuItems: ColoredMenuItem[] = [
  {
    title: 'Dashboards',
    icon: 'fa-chart-pie',
    color: 'text-blue-50',
    submenu: [
      { title: 'Financial', icon: 'fa-dollar-sign', path: '/dashboard/financial' },
      { title: 'Healthcare', icon: 'fa-heartbeat', path: '/dashboard/healthcare' },
      { title: 'HR Analytics', icon: 'fa-users', path: '/dashboard/hr' },
      { title: 'Inventory', icon: 'fa-boxes', path: '/dashboard/inventory' },
      { title: 'Procurement', icon: 'fa-shopping-cart', path: '/dashboard/procurement' },
    ]
  },
  {
    title: 'Reports',
    icon: 'fa-file-alt',
    color: 'text-violet-500',
    submenu: [
      { title: 'Accounts', icon: 'fa-calculator', path: '/reports/accounts' },
      { title: 'Asset Mgmt', icon: 'fa-cubes', path: '/reports/assets' },
      { title: 'Budgeting', icon: 'fa-chart-line', path: '/reports/budgeting' },
      { title: 'Clinical', icon: 'fa-stethoscope', path: '/reports/clinical' },
      { title: 'Comparison', icon: 'fa-balance-scale', path: '/reports/comparison' },
      { title: 'Human Resource', icon: 'fa-id-badge', path: '/reports/hr' },
      { title: 'Inventory', icon: 'fa-warehouse', path: '/reports/inventory' },
      { title: 'RMNCH', icon: 'fa-baby', path: '/reports/maternity' },
      { title: 'Morgue', icon: 'fa-book-dead', path: '/reports/morgue' },
      { title: 'Payables', icon: 'fa-file-invoice', path: '/reports/payables' },
      { title: 'Queue Analysis', icon: 'fa-users-cog', path: '/reports/queue' },
      { title: 'Receivables', icon: 'fa-file-invoice-dollar', path: '/reports/receivables' },
      { title: 'Revenue', icon: 'fa-money-bill-wave', path: '/reports/revenue' },
      { title: 'Security Logs', icon: 'fa-shield-alt', path: '/reports/security' },
      { title: 'Theatre', icon: 'fa-procedures', path: '/reports/theatre' },
    ]
  },
  {
    title: 'Security',
    icon: 'fa-lock',
    color: 'text-red-500',
    submenu: [
      { title: 'Privileges', icon: 'fa-key', path: '/security/privileges' },
      { title: 'System Users', icon: 'fa-users-cog', path: '/security/users' },
      { title: 'User Roles', icon: 'fa-user-tag', path: '/security/roles' },
    ]
  },
  {
    title: 'Settings',
    icon: 'fa-cog',
    color: 'text-slate-400',
    submenu: [
      { title: 'Departments', icon: 'fa-sitemap', path: '/configurations/departments' },
      { title: 'Dicom PACS', icon: 'fa-radiation', path: '/configurations/dicom' },
      { title: 'Display & Themes', icon: 'fa-palette', path: '/configurations/display' },
      { title: 'Document Templates', icon: 'fa-pencil-ruler', path: '/configurations/document-designer' },
      { title: 'Hospital Information', icon: 'fa-hospital', path: '/configurations/hospital-info' },
      { title: 'ICD Management', icon: 'fa-book-medical', path: '/configurations/icd' },
      { title: 'KRA eTIMS', icon: 'fa-university', path: '/configurations/etims' },
      { title: 'Module Control', icon: 'fa-toggle-on', path: '/configurations/modules' },
      { title: 'Notification Management', icon: 'fa-bullhorn', path: '/configurations/notifications' },
      { title: 'Payment Gateways', icon: 'fa-credit-card', path: '/configurations/gateways' },
      { title: 'Portal Manager', icon: 'fa-laptop-medical', path: '/configurations/portal-manager' },
      { title: 'Rooms & Wards', icon: 'fa-door-open', path: '/configurations/rooms' },
      { title: 'Schemes Management', icon: 'fa-building-shield', path: '/configurations/schemes' },
      { title: 'Services & Billing', icon: 'fa-file-invoice-dollar', path: '/configurations/services' },
    ]
  },
  {
    title: 'Website',
    icon: 'fa-globe',
    color: 'text-indigo-400',
    moduleKey: 'website',
    submenu: [
      { title: 'Blog Manager', icon: 'fa-pen-nib', path: '/frontend/blog', subModuleKey: 'blog' },
      { title: 'Event Manager', icon: 'fa-calendar-star', path: '/frontend/events', subModuleKey: 'events' },
      { title: 'Layout Manager', icon: 'fa-pencil-ruler', path: '/frontend/layouts', subModuleKey: 'layouts' },
      { title: 'Page Content', icon: 'fa-edit', path: '/frontend/content', subModuleKey: 'content' },
      { title: 'Site Configuration', icon: 'fa-cog', path: '/frontend/config', subModuleKey: 'config' },
      { title: 'Website Manager', icon: 'fa-laptop-code', path: '/frontend', subModuleKey: 'manager' },
    ]
  },
];

export const normalMenuItems: ColoredMenuItem[] = [
  ...clinicalMenuItems,
  ...erpMenuItems,
  ...communicationMenuItems,
  ...adminMenuItems
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { modules } = useModules();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if we are in Portal View
  const isPortal = location.pathname.startsWith('/portal');

  const allItems = useMemo(() => {
    if (isPortal) {
        return portalMenuItems;
    }
    return [
        ...clinicalMenuItems,
        ...erpMenuItems,
        ...communicationMenuItems,
        ...adminMenuItems
    ];
  }, [isPortal]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    
    let results: ColoredMenuItem[] = [];
    
    allItems.forEach(item => {
        // Parent matches
        if (item.title.toLowerCase().includes(lowerQuery)) {
            results.push(item);
        } else if (item.submenu) {
             // Check children if parent doesn't match
             const matchingSubs = item.submenu.filter(sub => sub.title.toLowerCase().includes(lowerQuery));
             if (matchingSubs.length > 0) {
                 // Clone item with only matching children, or push children as flat items
                 // Flattening might be cleaner for search results
                 matchingSubs.forEach(sub => {
                     results.push({ ...sub, icon: sub.icon || item.icon, color: sub.color || item.color });
                 });
             }
        }
    });
    return results;
  }, [searchQuery, allItems]);

  const handleParentClick = (item: ColoredMenuItem) => {
    if (!isOpen) {
      if (item.submenu && item.submenu.length > 0) {
        const firstEnabledSub = item.submenu.find(sub => {
          if (!sub.subModuleKey || !item.moduleKey) return true;
          return (modules as any)[item.moduleKey]?.submodules[sub.subModuleKey] !== false;
        });
        if (firstEnabledSub?.path) {
          navigate(firstEnabledSub.path);
        } else if (item.path) {
          navigate(item.path);
        }
      } else if (item.path) {
        navigate(item.path);
      }
    } else {
      if (item.path && !item.submenu) {
          navigate(item.path);
      } else {
          setOpenSubmenu(openSubmenu === item.title ? null : item.title);
      }
    }
  };

  const renderSection = (title: string, items: ColoredMenuItem[]) => {
    const filtered = items.filter(item => {
      // If portal, show all defined portal items
      if (isPortal) return true;
      if (!item.moduleKey) return true;
      return (modules as any)[item.moduleKey]?.enabled;
    });

    if (filtered.length === 0) return null;

    return (
      <div className="space-y-1">
        {/* REPLACED Title with Green Separator Line */}
        {isOpen && <div className="mx-4 my-2 h-px bg-green-600/30"></div>}
        
        {filtered.map((item) => (
          <div key={item.title} className="px-2">
            <button
              onClick={() => handleParentClick(item)}
              className={`w-full flex items-center p-2 transition-all rounded-lg ${openSubmenu === item.title ? 'bg-white/10' : 'hover:bg-white/5'} ${location.pathname.includes(item.path || 'INVALID') ? 'bg-indigo-600/20 text-white' : ''}`}
            >
              <i className={`fa ${item.icon} w-5 text-center ${item.color || 'text-slate-400'}`}></i>
              {isOpen && (
                <div className="flex-1 flex justify-between items-center ml-3">
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${location.pathname.includes(item.path || 'INVALID') ? 'text-white' : 'text-slate-300'}`}>{item.title}</span>
                  {item.submenu && (
                      <i className={`fa fa-chevron-down text-[9px] text-slate-600 transition-transform ${openSubmenu === item.title ? 'rotate-180' : ''}`}></i>
                  )}
                </div>
              )}
            </button>
            {isOpen && openSubmenu === item.title && item.submenu && (
              <div className="mt-1 ml-6 space-y-1 border-l-2 border-slate-800 pl-2">
                {item.submenu.map((sub) => {
                  if (sub.subModuleKey && (modules as any)[item.moduleKey!]?.submodules[sub.subModuleKey] === false) return null;
                  return (
                    <Link
                      key={sub.title}
                      to={sub.path || '#'}
                      onClick={() => {
                        // Close sidebar on mobile when a link is clicked
                        if (window.innerWidth < 768 && toggleSidebar) {
                           toggleSidebar();
                        }
                      }}
                      className={`block px-3 py-2 text-[10px] font-bold transition-all uppercase tracking-tighter rounded-r-md ${
                        location.pathname === sub.path ? 'text-white bg-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {sub.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside 
      className={`fixed md:static inset-y-0 left-0 z-[60] bg-slate-950 h-full flex flex-col transition-all duration-300 ease-in-out shadow-2xl overflow-hidden md:translate-x-0 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-16'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0 mb-2">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white shadow-xl cursor-pointer rounded-lg" onClick={() => navigate('/')}>
              <i className="fa fa-hospital-alt"></i>
            </div>
            {isOpen && <span className="text-white font-black uppercase tracking-tighter text-lg">UltraHub</span>}
        </div>
        {/* Mobile Close Button */}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white md:hidden">
            <i className="fa fa-times text-lg"></i>
        </button>
      </div>

      {isOpen && (
          <div className="px-3 mb-2 shrink-0">
            <div className="relative">
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
              <input
                type="text"
                placeholder={isPortal ? "Search portal..." : "Search panels..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-green-600 transition-colors uppercase font-bold tracking-wider"
              />
            </div>
          </div>
      )}

      <div className="flex-1 overflow-y-auto sidebar-scroll pb-10">
        {/* Explicit Home Button - Hide in Portal Mode */}
        {!isPortal && (
          <div className="px-2 mb-1">
             <Link to="/" className={`w-full flex items-center p-2.5 rounded-lg transition-all hover:bg-white/5 ${location.pathname === '/' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>
                 <i className="fa fa-th-large w-5 text-center text-emerald-400"></i>
                 {isOpen && <span className="ml-3 text-[11px] font-black uppercase tracking-tight">Dashboard</span>}
             </Link>
          </div>
        )}

        {searchQuery ? (
             // Search Results View
             <div className="px-2 space-y-1 mt-2">
                 {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                     <Link
                       key={`${item.title}-${idx}`}
                       to={item.path || '#'}
                       onClick={() => {
                          if (window.innerWidth < 768 && toggleSidebar) {
                             toggleSidebar();
                          }
                       }}
                       className="block px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors flex items-center"
                     >
                        <i className={`fa ${item.icon} w-5 text-center ${item.color} mr-3`}></i>
                        <span className="text-[10px] font-bold uppercase">{item.title}</span>
                     </Link>
                 )) : (
                     <div className="text-center py-4 text-slate-600 text-[10px] uppercase font-bold">No modules found</div>
                 )}
             </div>
        ) : (
            // Standard Categorized View
            isPortal ? (
                renderSection('Patient Portal', portalMenuItems)
            ) : (
                <>
                    {renderSection('Clinical Services', clinicalMenuItems)}
                    {renderSection('ERP & Logistics', erpMenuItems)}
                    {renderSection('UM Chat', communicationMenuItems)}
                    {renderSection('System Admin', adminMenuItems)}
                </>
            )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
