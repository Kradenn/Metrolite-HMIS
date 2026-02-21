
import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Clinical Management
import OPDManagement from './pages/Clinical/OPDManagement';
import IPDManagement from './pages/Clinical/IPDManagement';

// Clinical Core
import Consultation from './pages/Clinical/Consultation';
import Triage from './pages/Clinical/Triage';
import Queue from './pages/Clinical/Queue';
import Appointments from './pages/Clinical/Appointments';
import BillingForm from './pages/Clinical/BillingForm';
import PatientChart from './pages/Clinical/PatientChart';
import Referrals from './pages/Clinical/Referrals';
import Nursing from './pages/Clinical/Nursing';
import CDSOrderSets from './pages/Clinical/CDSOrderSets';

// Billing
import ARInvoices from './pages/Billing/ARInvoices';
import GatePass from './pages/Billing/GatePass';
import PatientBills from './pages/Billing/PatientBills';
import ProFormaInvoices from './pages/Billing/ProFormaInvoices';
import Receipts from './pages/Billing/Receipts';

// Telehealth
import Telehealth from './pages/Telehealth/Telehealth';
import VirtualEncounter from './pages/Telehealth/VirtualEncounter';
import TelehealthSettings from './pages/Telehealth/TelehealthSettings';

// CME Module
import CME from './pages/CME/CME';
import CMEAdmin from './pages/CME/CMEAdmin';
import CMEConfig from './pages/CME/CMEConfig';

// Frontend Module
import FrontendDashboard from './pages/Frontend/FrontendDashboard';
import FrontendContent from './pages/Frontend/FrontendContent';
import FrontendConfig from './pages/Frontend/FrontendConfig';
import FrontendLayouts from './pages/Frontend/FrontendLayouts';
import BlogManager from './pages/Frontend/BlogManager';
import EventManager from './pages/Frontend/EventManager';

// Reports
import AccountsReports from './pages/Reports/AccountsReports';
import AssetManagementReports from './pages/Reports/AssetManagementReports';
import BudgetingReports from './pages/Reports/BudgetingReports';
import ClinicalReports from './pages/Reports/ClinicalReports';
import ComparisonReports from './pages/Reports/ComparisonReports';
import HRReports from './pages/Reports/HRReports';
import InventoryReports from './pages/Reports/InventoryReports';
import MaternityReports from './pages/Reports/MaternityReports';
import MorgueReports from './pages/Reports/MorgueReports';
import PayablesReports from './pages/Reports/PayablesReports';
import QueueReports from './pages/Reports/QueueReports';
import ReceivablesReports from './pages/Reports/ReceivablesReports';
import RevenueReports from './pages/Reports/RevenueReports';
import SecurityReports from './pages/Reports/SecurityReports';
import TheatreReports from './pages/Reports/TheatreReports';

// Dashboards (Business Intelligence)
import FinancialDashboard from './pages/Dashboard/FinancialDashboard';
import HealthcareDashboard from './pages/Dashboard/HealthcareDashboard';
import HRDashboard from './pages/Dashboard/HRDashboard';
import InventoryDashboard from './pages/Dashboard/InventoryDashboard';
import ProcurementDashboard from './pages/Dashboard/ProcurementDashboard';

// Portal
import PortalHome from './pages/Portal/PortalHome';
import Leaves from './pages/Portal/Leaves';
import SalaryAdvances from './pages/Portal/SalaryAdvances';
import PaySlips from './pages/Portal/PaySlips';
import ResetPassword from './pages/Portal/ResetPassword';
import PortalPatientBills from './pages/Portal/PatientBills';
import PortalPrescriptions from './pages/Portal/PatientPrescriptions';
import PortalLabTests from './pages/Portal/PatientLabTests';
import PortalAppointments from './pages/Portal/PatientAppointments';
import PortalTelehealth from './pages/Portal/PatientTelehealth';
import PatientChat from './pages/Portal/PatientChat';
import PatientNotifications from './pages/Portal/PatientNotifications';

// Diagnostics
import Laboratory from './pages/Diagnostics/Laboratory';
import Radiology from './pages/Diagnostics/Radiology';
import Theatre from './pages/Diagnostics/Theatre';
import EntClinic from './pages/Diagnostics/EntClinic';
import OncologyClinic from './pages/Diagnostics/OncologyClinic';
import OrthoClinic from './pages/Diagnostics/OrthoClinic';
import UrologyClinic from './pages/Diagnostics/UrologyClinic';
import SopcGeneral from './pages/Diagnostics/SopcGeneral';

// Medical (MOPC)
import CardiologyClinic from './pages/MedicalMopc/CardiologyClinic';
import DiabeticClinic from './pages/MedicalMopc/DiabeticClinic';
import MopcGeneral from './pages/MedicalMopc/MopcGeneral';
import DermatologyClinic from './pages/MedicalMopc/DermatologyClinic';
import NeurologyClinic from './pages/MedicalMopc/NeurologyClinic';
import RenalClinic from './pages/MedicalMopc/RenalClinic';

// Dental & Eye
import DentalClinic from './pages/DentalEye/DentalClinic';
import EyeClinic from './pages/DentalEye/EyeClinic';
import GlaucomaScreening from './pages/DentalEye/GlaucomaScreening';

// MCH / Maternity
import Antenatal from './pages/MCH/Antenatal';
import Postnatal from './pages/MCH/Postnatal';
import Intrapartum from './pages/MCH/Intrapartum';
import AdolescentHealth from './pages/MCH/AdolescentHealth';
import HighRiskClinic from './pages/MCH/HighRiskClinic';
import CommunityHealth from './pages/MCH/CommunityHealth';
import PaediatricClinic from './pages/MCH/PaediatricClinic';

// Rehab & Wellness
import PhysioClinic from './pages/RehabWellness/PhysioClinic';
import NutritionClinic from './pages/RehabWellness/NutritionClinic';
import OccupationalClinic from './pages/RehabWellness/OccupationalClinic';
import PsychiatryClinic from './pages/RehabWellness/PsychiatryClinic';

// Morgue
import Morgue from './pages/Morgue/Morgue';
import MorgueChambers from './pages/Morgue/MorgueChambers';
import MorgueStorageAreas from './pages/Morgue/MorgueStorageAreas';

// Pharmacy
import Pharmacy from './pages/Pharmacy/Pharmacy';
import DirectSales from './pages/Pharmacy/DirectSales';
import POS from './pages/Pharmacy/POS';

// Kitchen
import KitchenDashboard from './pages/Kitchen/KitchenDashboard';
import MealOrdering from './pages/Kitchen/MealOrdering';
import DietaryPlans from './pages/Kitchen/DietaryPlans';
import KitchenInventory from './pages/Kitchen/KitchenInventory';

// Procurement
import Suppliers from './pages/Procurement/Suppliers';
import RequisitionNote from './pages/Procurement/RequisitionNote';
import PurchaseOrder from './pages/Procurement/PurchaseOrder';
import GoodsReceivedNotes from './pages/Procurement/GoodsReceivedNotes';
import SupplierBills from './pages/Procurement/SupplierBills';
import PatientVouchers from './pages/Procurement/PaymentVouchers';

// UM Chat Module
import UMChat from './pages/UMChat/UMChat';
import Sms from './pages/UMChat/Sms';
import SmsTemplates from './pages/UMChat/SmsTemplates';
import Diary from './pages/UMChat/Diary';
import NotificationsList from './pages/UMChat/NotificationsList';
import Feedback from './pages/UMChat/Feedback';
import HelpDesk from './pages/UMChat/HelpDesk';

// Legal
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';

// Accounts & Finance
import GeneralLedgerAccounts from './pages/Accounts/GeneralLedgerAccounts';
import FixedAssetManagement from './pages/Accounts/FixedAssetManagement';
import JournalVouchers from './pages/Accounts/JournalVouchers';
import CashierShifts from './pages/Accounts/CashierShifts';
import OpeningBalances from './pages/Accounts/OpeningBalances';
import BankReconciliation from './pages/Accounts/BankReconciliation';
import BankDeposits from './pages/Accounts/BankDeposits';
import Banks from './pages/Accounts/Banks';
import Budgeting from './pages/Accounts/Budgeting';
import Capitations from './pages/Accounts/Capitations';
import CashTransfers from './pages/Accounts/CashTransfers';
import Cheques from './pages/Accounts/Cheques';
import CurrencyUnit from './pages/Accounts/CurrencyUnit';
import FiscalPeriods from './pages/Accounts/FiscalPeriods';
import PaymentModes from './pages/Accounts/PaymentModes';
import RefundsOnAdvance from './pages/Accounts/RefundsOnAdvance';
import Taxes from './pages/Accounts/Taxes';

// HR
import SalaryAdvanceHR from './pages/HR/SalaryAdvance';
import Consultants from './pages/HR/Consultants';
import Employees from './pages/HR/Employees';
import LeavesHR from './pages/HR/Leaves';
import PayPeriods from './pages/HR/PayPeriods';
import PayrollParameters from './pages/HR/PayrollParameters';
import PayslipsHR from './pages/HR/Payslips';
import Scheduling from './pages/HR/Scheduling';
import PAYETaxRanges from './pages/HR/PAYETaxRanges';

// Inventory
import UnitOfMeasure from './pages/Inventory/UnitOfMeasure';
import StockTake from './pages/Inventory/StockTake';
import MaterialConsumption from './pages/Inventory/MaterialConsumption';
import InternalOrders from './pages/Inventory/InternalOrders';
import InterbranchOrders from './pages/Inventory/InterbranchOrders';
import Inventory from './pages/Inventory/Inventory';

// Configurations
import HospitalInformation from './pages/Configurations/hospital_information';
import NotificationsAlert from './pages/Configurations/NotificationsAlert';
import RoomsWards from './pages/Configurations/rooms_wards';
import ServicesBilling from './pages/Configurations/services_billing';
import DocumentDesigner from './pages/Configurations/DocumentDesigner';
import ModuleSettings from './pages/Configurations/ModuleSettings';
import SchemesManagement from './pages/Configurations/SchemesManagement';
import ICDConfiguration from './pages/Configurations/ICDConfiguration';
import PaymentGateways from './pages/Configurations/PaymentGateways';
import DisplaySettings from './pages/Configurations/DisplaySettings';
import DicomConfig from './pages/Configurations/DicomConfig';
import KRAConfig from './pages/Configurations/KRAConfig';
import HospitalDepartments from './pages/Configurations/hospitaldepartments';
import PortalManager from './pages/Configurations/PortalManager';

// Security
import Privileges from './pages/Security/Privileges';
import Users from './pages/Security/Users';
import UserRoles from './pages/Security/UserRoles';
import Installer from './pages/Installer';
import IoTMonitor from './pages/IoTMonitor';
import { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/system/status');
        const data = await res.json();
        setIsInstalled(data.installed);
      } catch (e) {
        setIsInstalled(true); // Fallback to true if API fails
      }
    };
    checkStatus();
  }, []);

  if (isInstalled === null) return null;

  return (
    <Routes>
      <Route path="/install" element={<Installer />} />
      <Route path="*" element={
        !isInstalled ? <Navigate to="/install" replace /> : (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Dashboards / BI */}
        <Route path="/dashboard/financial" element={<FinancialDashboard />} />
        <Route path="/dashboard/healthcare" element={<HealthcareDashboard />} />
        <Route path="/dashboard/hr" element={<HRDashboard />} />
        <Route path="/dashboard/inventory" element={<InventoryDashboard />} />
        <Route path="/dashboard/procurement" element={<ProcurementDashboard />} />

        {/* Portal */}
        <Route path="/portal/home" element={<PortalHome />} />
        <Route path="/portal/leaves" element={<Leaves />} />
        <Route path="/portal/advances" element={<SalaryAdvances />} />
        <Route path="/portal/payslips" element={<PaySlips />} />
        <Route path="/portal/password" element={<ResetPassword />} />
        <Route path="/portal/bills" element={<PortalPatientBills />} />
        <Route path="/portal/prescriptions" element={<PortalPrescriptions />} />
        <Route path="/portal/tests" element={<PortalLabTests />} />
        <Route path="/portal/appointments" element={<PortalAppointments />} />
        <Route path="/portal/telehealth" element={<PortalTelehealth />} />
        <Route path="/portal/chat" element={<PatientChat />} />
        <Route path="/portal/notifications" element={<PatientNotifications />} />

        {/* Telehealth */}
        <Route path="/telehealth" element={<Telehealth />} />
        <Route path="/telehealth/encounter/:id" element={<VirtualEncounter />} />
        <Route path="/telehealth/settings" element={<TelehealthSettings />} />

        {/* CME Module */}
        <Route path="/cme" element={<CME />} />
        <Route path="/cme/admin" element={<CMEAdmin />} />
        <Route path="/cme/config" element={<CMEConfig />} />

        {/* Frontend Module */}
        <Route path="/frontend" element={<FrontendDashboard />} />
        <Route path="/frontend/content" element={<FrontendContent />} />
        <Route path="/frontend/config" element={<FrontendConfig />} />
        <Route path="/frontend/layouts" element={<FrontendLayouts />} />
        <Route path="/frontend/blog" element={<BlogManager />} />
        <Route path="/frontend/events" element={<EventManager />} />

        {/* Reports */}
        <Route path="/reports/accounts" element={<AccountsReports />} />
        <Route path="/reports/assets" element={<AssetManagementReports />} />
        <Route path="/reports/budgeting" element={<BudgetingReports />} />
        <Route path="/reports/clinical" element={<ClinicalReports />} />
        <Route path="/reports/comparison" element={<ComparisonReports />} />
        <Route path="/reports/hr" element={<HRReports />} />
        <Route path="/reports/inventory" element={<InventoryReports />} />
        <Route path="/reports/maternity" element={<MaternityReports />} />
        <Route path="/reports/morgue" element={<MorgueReports />} />
        <Route path="/reports/payables" element={<PayablesReports />} />
        <Route path="/reports/queue" element={<QueueReports />} />
        <Route path="/reports/receivables" element={<ReceivablesReports />} />
        <Route path="/reports/revenue" element={<RevenueReports />} />
        <Route path="/reports/security" element={<SecurityReports />} />
        <Route path="/reports/theatre" element={<TheatreReports />} />

        {/* Clinical Management */}
        <Route path="/clinical/opd-management" element={<OPDManagement />} />
        <Route path="/clinical/ipd-management" element={<IPDManagement />} />

        {/* Clinical Core */}
        <Route path="/clinical/consultation" element={<Consultation />} />
        <Route path="/clinical/triage" element={<Triage />} />
        <Route path="/clinical/queue" element={<Queue />} />
        <Route path="/clinical/appointments" element={<Appointments />} />
        <Route path="/clinical/billing" element={<BillingForm />} />
        <Route path="/clinical/chart" element={<PatientChart />} />
        <Route path="/clinical/referrals" element={<Referrals />} />
        <Route path="/clinical/nursing" element={<Nursing />} />
        <Route path="/clinical/cds" element={<CDSOrderSets />} />

        {/* Billing */}
        <Route path="/billing/invoices" element={<ARInvoices />} />
        <Route path="/billing/gate-pass" element={<GatePass />} />
        <Route path="/billing/bills" element={<PatientBills />} />
        <Route path="/billing/proforma" element={<ProFormaInvoices />} />
        <Route path="/billing/receipts" element={<Receipts />} />

        {/* Diagnostics Localized Clinics */}
        <Route path="/lab" element={<Laboratory />} />
        <Route path="/radiology" element={<Radiology />} />
        <Route path="/theatre" element={<Theatre />} />
        <Route path="/diagnostics/ent" element={<EntClinic />} />
        <Route path="/diagnostics/oncology" element={<OncologyClinic />} />
        <Route path="/diagnostics/ortho" element={<OrthoClinic />} />
        <Route path="/diagnostics/urology" element={<UrologyClinic />} />
        <Route path="/diagnostics/sopc" element={<SopcGeneral />} />

        {/* Medical (MOPC) Localized Clinics */}
        <Route path="/medical/cardiology" element={<CardiologyClinic />} />
        <Route path="/medical/diabetic" element={<DiabeticClinic />} />
        <Route path="/medical/mopc" element={<MopcGeneral />} />
        <Route path="/medical/dermatology" element={<DermatologyClinic />} />
        <Route path="/medical/neurology" element={<NeurologyClinic />} />
        <Route path="/medical/renal" element={<RenalClinic />} />

        {/* Dental & Eye Localized Clinics */}
        <Route path="/dental-eye/dental" element={<DentalClinic />} />
        <Route path="/dental-eye/eye" element={<EyeClinic />} />
        <Route path="/dental-eye/glaucoma" element={<GlaucomaScreening />} />

        {/* MCH / Maternity Localized Clinics */}
        <Route path="/mch/antenatal" element={<Antenatal />} />
        <Route path="/mch/postnatal" element={<Postnatal />} />
        <Route path="/mch/intrapartum" element={<Intrapartum />} />
        <Route path="/mch/ayfhs" element={<AdolescentHealth />} />
        <Route path="/mch/high-risk" element={<HighRiskClinic />} />
        <Route path="/mch/chv" element={<CommunityHealth />} />
        <Route path="/mch/paediatric" element={<PaediatricClinic />} />

        {/* Rehab & Wellness Localized Clinics */}
        <Route path="/rehab/physio" element={<PhysioClinic />} />
        <Route path="/rehab/nutrition" element={<NutritionClinic />} />
        <Route path="/rehab/occupational" element={<OccupationalClinic />} />
        <Route path="/rehab/psychiatry" element={<PsychiatryClinic />} />

        {/* Morgue */}
        <Route path="/morgue/main" element={<Morgue />} />
        <Route path="/morgue/chambers" element={<MorgueChambers />} />
        <Route path="/morgue/storage" element={<MorgueStorageAreas />} />

        {/* Pharmacy */}
        <Route path="/pharmacy/main" element={<Pharmacy />} />
        <Route path="/pharmacy/direct" element={<DirectSales />} />
        <Route path="/pharmacy/pos" element={<POS />} />

        {/* Kitchen */}
        <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />
        <Route path="/kitchen/ordering" element={<MealOrdering />} />
        <Route path="/kitchen/plans" element={<DietaryPlans />} />
        <Route path="/kitchen/inventory" element={<KitchenInventory />} />

        {/* Procurement */}
        <Route path="/kitchen/suppliers" element={<Suppliers />} />
        <Route path="/procurement/requisitions" element={<RequisitionNote />} />
        <Route path="/procurement/orders" element={<PurchaseOrder />} />
        <Route path="/procurement/grn" element={<GoodsReceivedNotes />} />
        <Route path="/procurement/bills" element={<SupplierBills />} />
        <Route path="/procurement/vouchers" element={<PatientVouchers />} />

        {/* UM Chat Routes */}
        <Route path="/um-chat" element={<UMChat />} />
        <Route path="/um-chat/sms" element={<Sms />} />
        <Route path="/um-chat/sms-templates" element={<SmsTemplates />} />
        <Route path="/um-chat/diary" element={<Diary />} />
        <Route path="/um-chat/notifications" element={<NotificationsList />} />
        <Route path="/um-chat/feedback" element={<Feedback />} />
        <Route path="/um-chat/help-desk" element={<HelpDesk />} />

        {/* Accounts */}
        <Route path="/accounts/ledger" element={<GeneralLedgerAccounts />} />
        <Route path="/accounts/assets" element={<FixedAssetManagement />} />
        <Route path="/accounts/journal" element={<JournalVouchers />} />
        <Route path="/accounts/shifts" element={<CashierShifts />} />
        <Route path="/accounts/opening-balances" element={<OpeningBalances />} />
        <Route path="/accounts/reconciliation" element={<BankReconciliation />} />
        <Route path="/accounts/deposits" element={<BankDeposits />} />
        <Route path="/accounts/banks" element={<Banks />} />
        <Route path="/accounts/budgeting" element={<Budgeting />} />
        <Route path="/accounts/capitations" element={<Capitations />} />
        <Route path="/accounts/transfers" element={<CashTransfers />} />
        <Route path="/accounts/cheques" element={<Cheques />} />
        <Route path="/accounts/currency" element={<CurrencyUnit />} />
        <Route path="/accounts/fiscal" element={<FiscalPeriods />} />
        <Route path="/accounts/payment-modes" element={<PaymentModes />} />
        <Route path="/accounts/refunds" element={<RefundsOnAdvance />} />
        <Route path="/accounts/taxes" element={<Taxes />} />

        {/* HR */}
        <Route path="/hr/advance" element={<SalaryAdvanceHR />} />
        <Route path="/hr/consultants" element={<Consultants />} />
        <Route path="/hr/employees" element={<Employees />} />
        <Route path="/hr/leaves" element={<LeavesHR />} />
        <Route path="/hr/periods" element={<PayPeriods />} />
        <Route path="/hr/parameters" element={<PayrollParameters />} />
        <Route path="/hr/payslips" element={<PayslipsHR />} />
        <Route path="/hr/scheduling" element={<Scheduling />} />
        <Route path="/hr/tax-ranges" element={<PAYETaxRanges />} />

        {/* Inventory */}
        <Route path="/inventory/uom" element={<UnitOfMeasure />} />
        <Route path="/inventory/stock-take" element={<StockTake />} />
        <Route path="/inventory/consumption" element={<MaterialConsumption />} />
        <Route path="/inventory/internal" element={<InternalOrders />} />
        <Route path="/inventory/interbranch" element={<InterbranchOrders />} />
        <Route path="/inventory/main" element={<Inventory />} />

        {/* Legal */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* Configurations */}
        <Route path="/configurations/hospital-info" element={<HospitalInformation />} />
        <Route path="/configurations/notifications" element={<NotificationsAlert />} />
        <Route path="/configurations/rooms" element={<RoomsWards />} />
        <Route path="/configurations/services" element={<ServicesBilling />} />
        <Route path="/configurations/document-designer" element={<DocumentDesigner />} />
        <Route path="/configurations/modules" element={<ModuleSettings />} />
        <Route path="/configurations/schemes" element={<SchemesManagement />} />
        <Route path="/configurations/display" element={<DisplaySettings />} />
        <Route path="/configurations/icd" element={<ICDConfiguration />} />
        <Route path="/configurations/gateways" element={<PaymentGateways />} />
        <Route path="/configurations/dicom" element={<DicomConfig />} />
        <Route path="/configurations/etims" element={<KRAConfig />} />
        <Route path="/configurations/departments" element={<HospitalDepartments />} />
        <Route path="/configurations/portal-manager" element={<PortalManager />} />

        {/* Security */}
        <Route path="/security/privileges" element={<Privileges />} />
        <Route path="/security/users" element={<Users />} />
        <Route path="/security/roles" element={<UserRoles />} />
        <Route path="/iot-monitor" element={<IoTMonitor />} />

        <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )
      } />
    </Routes>
  );
};

export default App;
