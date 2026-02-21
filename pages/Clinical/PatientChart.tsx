
import React, { useState, useMemo, useRef } from 'react';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { Link, useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';

// --- Sub-Component: Vital Trends Graph (SVG) ---
const VitalTrendChart: React.FC<{ data: number[]; color: string; label: string; unit: string }> = ({ data, color, label, unit }) => {
  const height = 60;
  const width = 200;
  const max = Math.max(...data) * 1.1 || 100;
  const min = Math.min(...data) * 0.9 || 0;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</span>
      <div className="relative h-12 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
           <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
           {data.map((val, i) => {
              const x = (i / (data.length - 1)) * width;
              const y = height - ((val - min) / (max - min)) * height;
              return <circle key={i} cx={x} cy={y} r="2.5" fill="white" stroke={color} strokeWidth="2" />;
           })}
        </svg>
      </div>
      <div className="flex justify-between items-end mt-1 border-t border-slate-50 pt-1">
         <span className="text-[8px] font-bold text-slate-300 uppercase">Trend</span>
         <span className="text-xs font-black text-slate-700">{data[data.length-1]} <span className="text-[9px] text-slate-400 font-bold">{unit}</span></span>
      </div>
    </div>
  );
};

// --- Sub-Component: Printable Medical Report ---
const PrintableReport = React.forwardRef<HTMLDivElement, { visit: any; patient: PatientRecord | null; hospitalName: string }>((props, ref) => {
    const { visit, patient, hospitalName } = props;
    if (!visit || !patient) return null;

    return (
        <div ref={ref} className="bg-white p-12 max-w-[21cm] mx-auto text-slate-800 hidden print:block print:w-full print:h-full">
            {/* Header */}
            <div className="border-b-4 border-slate-800 pb-6 mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">{hospitalName}</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Clinical Encounter Report</p>
                    <p className="text-xs text-slate-400 mt-2">P.O Box 10293, Nairobi • +254 700 000 000</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-black text-blue-600">CONFIDENTIAL</h2>
                    <p className="text-xs font-mono font-bold mt-1 text-slate-500">REF: {visit.id}-{patient.outpatientNo}</p>
                    <p className="text-xs font-bold mt-1">{visit.date}</p>
                </div>
            </div>

            {/* Patient Info */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl mb-8 grid grid-cols-2 gap-6 text-sm">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                    <p className="font-bold text-lg uppercase">{patient.surname}, {patient.othernames}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Age / Gender</p>
                        <p className="font-bold">{patient.age} Yrs / {patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">OP Number</p>
                        <p className="font-bold">{patient.outpatientNo}</p>
                    </div>
                </div>
            </div>

            {/* Clinical Content */}
            <div className="space-y-6 mb-10">
                <div>
                    <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-3">Reason for Visit</h3>
                    <p className="text-sm font-medium">{visit.reason}</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Subjective / History</h3>
                        <p className="text-sm leading-relaxed text-slate-700 bg-white p-0">{visit.notes.s}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Objective / Exam Findings</h3>
                        <p className="text-sm leading-relaxed text-slate-700 bg-white p-0">{visit.notes.o}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Assessment / Diagnosis</h3>
                        <p className="text-sm leading-relaxed text-slate-900 font-bold">{visit.notes.a}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Plan / Treatment</h3>
                        <p className="text-sm leading-relaxed text-slate-700">{visit.notes.p}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-12 flex justify-between items-end border-t border-slate-200">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Attending Clinician</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{visit.doctor}</p>
                    <p className="text-[10px] text-slate-400 italic">Electronic Signature Verified</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Generated On</p>
                    <p className="text-xs font-medium">{new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
});


const PatientChart: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [selectedVisitId, setSelectedVisitId] = useState(1);
  const [activeTab, setActiveTab] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('');
  
  // --- Modal States ---
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  // --- Admission Form ---
  const [admitForm, setAdmitForm] = useState({
      ward: 'General Ward - Male',
      priority: 'Routine',
      admittingDoctor: 'Dr. James Wilson',
      notes: ''
  });

  // --- Order Form ---
  const [orderType, setOrderType] = useState<'Lab' | 'Radiology'>('Lab');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  // --- Mock Catalogs ---
  const LAB_CATALOG = [
      { id: 'L01', name: 'Full Haemogram', cost: 800 },
      { id: 'L02', name: 'U&Es', cost: 1500 },
      { id: 'L03', name: 'Malaria Slide', cost: 300 },
      { id: 'L04', name: 'Urinalysis', cost: 400 },
  ];
  const RAD_CATALOG = [
      { id: 'R01', name: 'CXR PA', cost: 1200 },
      { id: 'R02', name: 'US Abdomen', cost: 2500 },
      { id: 'R03', name: 'CT Brain Plain', cost: 6000 },
  ];
  const WARDS = ['General Ward - Male', 'General Ward - Female', 'Private Wing', 'ICU / HDU', 'Maternity', 'Pediatric'];

  // --- Vital Signs State ---
  const [vitalsForm, setVitalsForm] = useState({
    temp: '',
    bpSys: '',
    bpDia: '',
    pulse: '',
    spo2: ''
  });

  const [vitalsHistory, setVitalsHistory] = useState([
    { id: 1, date: '24-Oct-2023', time: '10:30 AM', temp: '36.8', bp: '120/80', pulse: '72', spo2: '98', user: 'Nurse Joy' },
    { id: 2, date: '10-Sep-2023', time: '02:15 PM', temp: '37.2', bp: '130/85', pulse: '78', spo2: '97', user: 'Admin' },
    { id: 3, date: '05-Aug-2023', time: '09:00 AM', temp: '36.5', bp: '118/78', pulse: '70', spo2: '99', user: 'Admin' },
  ]);

  // --- New Mock Data for Expanded Chart ---
  const encountersHistory = [
    { id: 101, date: '24-Oct-2023', type: 'OPD', doctor: 'Dr. James Wilson', facility: 'Main Clinic', status: 'Closed' },
    { id: 102, date: '10-Sep-2023', type: 'Specialist', doctor: 'Dr. Sarah Smith', facility: 'ENT Clinic', status: 'Closed' },
    { id: 103, date: '05-Aug-2023', type: 'Emergency', doctor: 'Dr. Mike Ross', facility: 'ER', status: 'Closed' },
  ];

  const specialClinics = [
    { id: 1, name: 'Diabetic Clinic', enrolledDate: '12-Jan-2023', lastVisit: '20-Oct-2023', status: 'Active' },
    { id: 2, name: 'Hypertension Clinic', enrolledDate: '15-Mar-2023', lastVisit: '24-Oct-2023', status: 'Active' },
    { id: 3, name: 'Eye Clinic', enrolledDate: '05-Jun-2023', lastVisit: '10-Sep-2023', status: 'Active' },
  ];

  const appointmentsHistory = [
    { id: 1, date: '15-Nov-2023', time: '10:00 AM', doctor: 'Dr. James Wilson', type: 'Follow-up', status: 'Scheduled' },
    { id: 2, date: '24-Oct-2023', time: '09:00 AM', doctor: 'Dr. James Wilson', type: 'Consultation', status: 'Completed' },
    { id: 3, date: '10-Sep-2023', time: '11:30 AM', doctor: 'Dr. Sarah Smith', type: 'Specialist Review', status: 'Completed' },
  ];

  const insuranceDetails = {
    provider: 'Jubilee Insurance',
    policyNumber: 'POL-99283-X',
    scheme: 'Corporate Gold',
    validUntil: '31-Dec-2024',
    status: 'Active',
    limit: '500,000',
    balance: '420,000',
    dependents: 3
  };

  const reportsHistory = [
    { id: 1, name: 'Clinical Summary - 24-Oct-2023', type: 'Encounter Report', date: '24-Oct-2023', author: 'Dr. James Wilson' },
    { id: 2, name: 'Lab Results - Full Haemogram', type: 'Lab Report', date: '10-Sep-2023', author: 'Lab Tech' },
    { id: 3, name: 'Radiology Report - CXR', type: 'Imaging Report', date: '10-Sep-2023', author: 'Dr. Miller (Radiologist)' },
  ];

  const filesHistory = [
    { id: 1, name: 'X-Ray Chest PA.jpg', type: 'Image', size: '2.4 MB', date: '10-Sep-2023' },
    { id: 2, name: 'Previous Referral Letter.pdf', type: 'Document', size: '1.1 MB', date: '05-Aug-2023' },
    { id: 3, name: 'Insurance Card Copy.pdf', type: 'Document', size: '0.5 MB', date: '01-Jan-2023' },
  ];

  const billingHistory = [
    { id: 'INV-001', date: '24-Oct-2023', amount: '2,500', status: 'Paid', type: 'Consultation' },
    { id: 'INV-002', date: '10-Sep-2023', amount: '4,800', status: 'Paid', type: 'Lab & Pharmacy' },
    { id: 'INV-003', date: '05-Aug-2023', amount: '12,000', status: 'Partially Paid', type: 'Emergency' },
  ];

  // Mock Patient Data for Selection
  const mockPatients: PatientRecord[] = [
    { id: '1', surname: 'DOE', othernames: 'JANE', age: 24, gender: 'Female', scheme: 'CASH', outpatientNo: 'OP-2023-001', telephone: '0711000000', status: 'None' },
    { id: '2', surname: 'SMITH', othernames: 'JOHN', age: 45, gender: 'Male', scheme: 'JUBILEE', outpatientNo: 'OP-2023-042', telephone: '0722000000', status: 'None' },
    { id: '3', surname: 'ANN', othernames: 'MARY', age: 32, gender: 'Female', scheme: 'NHIF', outpatientNo: 'OP-2023-115', telephone: '0733000000', status: 'None' },
  ];

  // Filtered Results for the search
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return mockPatients.filter(p => 
      p.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.othernames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.outpatientNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectPatient = (p: PatientRecord) => {
    setActivePatient(p);
    setSearchTerm('');
    setSelectedVisitId(1);
    setActiveTab('summary');
  };

  const handleSaveVitals = () => {
    if (!vitalsForm.temp && !vitalsForm.bpSys && !vitalsForm.pulse) {
        notify('warning', 'Missing Data', 'Please enter at least one vital sign reading.');
        return;
    }

    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: vitalsForm.temp || '-',
      bp: vitalsForm.bpSys ? `${vitalsForm.bpSys}/${vitalsForm.bpDia || '?'}` : '-',
      pulse: vitalsForm.pulse || '-',
      spo2: vitalsForm.spo2 || '-',
      user: 'Current User'
    };

    setVitalsHistory([newRecord, ...vitalsHistory]);
    setVitalsForm({ temp: '', bpSys: '', bpDia: '', pulse: '', spo2: '' });
    notify('success', 'Vitals Saved', 'Patient physiological data has been committed to the chart.');
  };

  const visits = [
    { id: 1, date: '24-Oct-2023', type: 'Consultation', doctor: 'Dr. James Wilson', reason: 'Persistent Migraine', notes: { s: 'Patient reports severe throbbing pain for 3 days. Photophobia present.', o: 'BP 140/90. No focal neuro deficits.', a: 'Migraine with Aura', p: 'Rx: Sumatriptan 50mg PO. Dark room rest.' }, diagnosis: 'Migraine', outcome: 'Home' },
    { id: 2, date: '10-Sep-2023', type: 'Lab Review', doctor: 'Dr. Sarah Smith', reason: 'Post-Op Follow-up', notes: { s: 'Wound healing well, minimal pain.', o: 'Incision clean, no discharge.', a: 'Normal post-op recovery', p: 'Continue light activity.' }, diagnosis: 'Post-Surgical Care', outcome: 'Discharged' },
    { id: 3, date: '05-Aug-2023', type: 'Emergency', doctor: 'Dr. Mike Ross', reason: 'Acute Abdominal Pain', notes: { s: 'Sudden onset RLQ pain.', o: 'Rebound tenderness positive.', a: 'Suspected Appendicitis', p: 'Emergency Appendectomy performed.' }, diagnosis: 'Acute Appendicitis', outcome: 'Admitted' },
  ];

  const filteredVisits = useMemo(() => {
    return visits.filter(v => 
        timelineFilter === '' || 
        v.type.toLowerCase().includes(timelineFilter.toLowerCase()) ||
        v.reason.toLowerCase().includes(timelineFilter.toLowerCase())
    );
  }, [visits, timelineFilter]);

  const currentVisit = visits.find(v => v.id === selectedVisitId) || visits[0];

  const handlePrint = useReactToPrint({
      contentRef: reportRef,
  });

  const handleEditNote = () => {
      notify('info', 'Edit Mode', 'Clinical note unlocked for editing.');
  };

  // --- Handlers for Action Buttons ---
  const handleRepeatRx = () => {
      setShowRxModal(true);
  };

  const handleOrderLabs = () => {
      setShowOrderModal(true);
  };

  const handleAdmit = () => {
      setShowAdmitModal(true);
  };

  const handleNewRequest = () => {
      setShowOrderModal(true);
  };

  // --- Handlers for Modal Actions ---
  const submitAdmission = (e: React.FormEvent) => {
      e.preventDefault();
      setShowAdmitModal(false);
      notify('success', 'Admission Request Sent', `${activePatient?.surname} queued for ${admitForm.ward}.`);
      navigate('/clinical/ipd-management');
  };

  const addOrderToPending = (item: any) => {
      setPendingOrders([...pendingOrders, { ...item, id: Date.now() }]);
  };

  const submitOrders = () => {
      setShowOrderModal(false);
      notify('success', 'Orders Placed', `${pendingOrders.length} diagnostic requests sent.`);
      setPendingOrders([]);
  };

  const confirmRepeatRx = () => {
      setShowRxModal(false);
      notify('success', 'Prescription Repeated', 'Medications added to current visit.');
      navigate('/pharmacy/main');
  };

  if (!activePatient) {
    return (
      <div className="animate-bottom flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-300 shadow-inner">
             <i className="fa fa-folder-open text-5xl opacity-40"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Patient Medical Record</h2>
          <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">Please search and select a patient to view their comprehensive longitudinal medical history.</p>
        </div>

        <div className="w-full max-w-xl relative">
           <div className="relative group">
              <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name, OP Number or Phone..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-xl outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
              />
           </div>

           {searchResults.length > 0 && (
             <div className="absolute top-full left-0 w-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {searchResults.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => handleSelectPatient(p)}
                    className="p-4 border-b last:border-0 border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center group"
                  >
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {p.surname[0]}
                       </div>
                       <div>
                          <h6 className="text-sm font-black text-slate-800 uppercase">{p.surname}, {p.othernames}</h6>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{p.outpatientNo} • {p.gender} • {p.age} Yrs</p>
                       </div>
                    </div>
                    <i className="fa fa-chevron-right text-slate-200 group-hover:text-blue-500 transition-colors"></i>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-bottom space-y-4 pb-20 print:hidden h-[calc(100vh-100px)] flex flex-col -m-4 md:-m-6">
      
      {/* 1. Sticky Header & Identity */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-xl shrink-0 z-20">
        <div className="flex items-center space-x-4 overflow-hidden">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-blue-500 shrink-0">
            {activePatient.surname?.[0] || 'P'}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black uppercase tracking-tight leading-none truncate">
                 {activePatient.surname}, {activePatient.othernames}
            </h2>
            <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span>{activePatient.outpatientNo}</span>
               <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
               <span>{activePatient.age} Yrs</span>
               <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
               <span className="text-blue-400">{activePatient.scheme}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
           <div className="relative hidden md:block">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Quick Switch..."
                className="w-48 bg-slate-800/50 border border-slate-700 rounded-lg py-1.5 pl-3 pr-3 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              />
               {searchResults.length > 0 && (
                 <div className="absolute top-full right-0 w-64 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 text-slate-800">
                    {searchResults.map(p => (
                      <button key={p.id} onClick={() => handleSelectPatient(p)} className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-50 last:border-0">
                        <p className="text-[10px] font-black text-slate-800 uppercase">{p.surname}, {p.othernames}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{p.outpatientNo}</p>
                      </button>
                    ))}
                 </div>
               )}
           </div>
           
           <button onClick={() => setActivePatient(null)} className="text-[10px] bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest transition-colors border border-slate-700">Exit Chart</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-slate-50">
        
        {/* 2. Left Sidebar: Interactive Timeline */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                    <i className="fa fa-filter absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                    <input 
                        type="text" 
                        placeholder="Filter Timeline..." 
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500"
                    />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="relative pl-6 py-4 space-y-6">
                    {/* Timeline Line */}
                    <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-100"></div>
                    
                    {filteredVisits.map((v) => (
                       <div 
                         key={v.id} 
                         onClick={() => setSelectedVisitId(v.id)}
                         className={`relative pl-6 pr-4 cursor-pointer group ${selectedVisitId === v.id ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}
                       >
                          {/* Dot */}
                          <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 z-10 transition-all ${selectedVisitId === v.id ? 'bg-blue-600 border-blue-100 scale-110' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}></div>
                          
                          <div className={`p-3 rounded-xl border transition-all ${selectedVisitId === v.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                              <div className="flex justify-between items-start mb-1">
                                  <span className="text-[9px] font-black uppercase text-slate-400">{v.date}</span>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${v.type === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{v.type}</span>
                              </div>
                              <h6 className={`text-xs font-bold uppercase leading-tight mb-1 ${selectedVisitId === v.id ? 'text-blue-700' : 'text-slate-700'}`}>{v.reason}</h6>
                              <p className="text-[9px] text-slate-500 font-medium truncate">By: {v.doctor}</p>
                          </div>
                       </div>
                    ))}
                    
                    {filteredVisits.length === 0 && (
                        <div className="px-6 py-4 text-center text-[10px] text-slate-400 italic">No visits match filter</div>
                    )}
                </div>
             </div>
        </div>

        {/* 3. Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
           <div className="flex border-b border-slate-200 bg-white px-4 shrink-0 shadow-sm z-10 overflow-x-auto scrollbar-hide">
                 {[
                  { id: 'summary', label: 'Summary', icon: 'fa-id-card' },
                  { id: 'visits', label: 'Visits', icon: 'fa-history' },
                  { id: 'clinics', label: 'Clinics', icon: 'fa-hospital-user' },
                  { id: 'vitals', label: 'Vitals', icon: 'fa-heartbeat' },
                  { id: 'clinical', label: 'Clinical', icon: 'fa-flask' },
                   { id: 'finance', label: 'Finance', icon: 'fa-receipt' },
                  { id: 'docs', label: 'Docs', icon: 'fa-folder-open' },
                  ].map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => setActiveTab(s.id)}
                      className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === s.id ? 'border-blue-600 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                       <i className={`fa ${s.icon} ${activeTab === s.id ? 'text-blue-500' : 'text-slate-300'}`}></i>
                       <span>{s.label}</span>
                    </button>
                 ))}
           </div>

           <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-slate-50/50">
                 {activeTab === 'visits' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Encounter History</h4>
                                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">Export History</button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Clinician</th>
                                            <th className="px-6 py-4">Facility</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {encountersHistory.map(e => (
                                            <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold">{e.date}</td>
                                                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase text-[9px]">{e.type}</span></td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{e.doctor}</td>
                                                <td className="px-6 py-4 text-slate-500">{e.facility}</td>
                                                <td className="px-6 py-4"><span className="text-emerald-600 font-bold uppercase text-[9px]">{e.status}</span></td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 font-black uppercase text-[9px]">View Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Appointments</h4>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">+ Schedule New</button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Clinician</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointmentsHistory.map(a => (
                                            <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold">{a.date} <span className="text-slate-400 font-medium ml-1">{a.time}</span></td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{a.doctor}</td>
                                                <td className="px-6 py-4 text-slate-500">{a.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${a.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{a.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-slate-400 hover:text-red-600"><i className="fa fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                 )}

                 {activeTab === 'clinics' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Special Clinics</h4>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">+ Enroll Clinic</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {specialClinics.map(c => (
                                <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <i className="fa fa-hospital-user"></i>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">{c.status}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-slate-800 uppercase mb-1">{c.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Enrolled: {c.enrolledDate}</p>
                                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Last Visit: {c.lastVisit}</span>
                                        <button className="text-[9px] font-black text-blue-600 uppercase hover:underline">View Chart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                 {activeTab === 'clinical' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Prescriptions</h4>
                                <button onClick={handleRepeatRx} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">+ New Prescription</button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Medication</th>
                                            <th className="px-6 py-4">Dosage</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Prescribed By</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {[
                                            { name: 'Amoxicillin 500mg', dose: '1x3', duration: '5 Days', doctor: 'Dr. James Wilson', date: '24-Oct-2023', status: 'Active' },
                                            { name: 'Paracetamol 1g', dose: '1x3 PRN', duration: '3 Days', doctor: 'Dr. James Wilson', date: '24-Oct-2023', status: 'Active' },
                                            { name: 'Cetirizine 10mg', dose: '1x1', duration: '10 Days', doctor: 'Dr. Sarah Smith', date: '10-Sep-2023', status: 'Completed' },
                                        ].map((r, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-black text-slate-800">{r.name}</td>
                                                <td className="px-6 py-4 font-bold text-blue-600">{r.dose}</td>
                                                <td className="px-6 py-4 text-slate-600">{r.duration}</td>
                                                <td className="px-6 py-4 text-slate-500">{r.doctor}</td>
                                                <td className="px-6 py-4 text-slate-400">{r.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${r.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Diagnostic History</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => setOrderType('Lab')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${orderType === 'Lab' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>Lab Results</button>
                                    <button onClick={() => setOrderType('Radiology')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${orderType === 'Radiology' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>Imaging</button>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Test Name</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Result</th>
                                            <th className="px-6 py-4">Reference</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {[
                                            { name: 'Full Haemogram', date: '10-Sep-2023', result: 'Normal', ref: 'See Report', status: 'Final' },
                                            { name: 'U&Es', date: '10-Sep-2023', result: 'Elevated Creatinine', ref: '0.6 - 1.2', status: 'Final' },
                                            { name: 'CXR PA', date: '10-Sep-2023', result: 'Clear Lung Fields', ref: '-', status: 'Final' },
                                        ].map((d, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-black text-slate-800">{d.name}</td>
                                                <td className="px-6 py-4 text-slate-400">{d.date}</td>
                                                <td className={`px-6 py-4 font-bold ${d.result.includes('Elevated') ? 'text-red-500' : 'text-slate-700'}`}>{d.result}</td>
                                                <td className="px-6 py-4 text-slate-500 italic">{d.ref}</td>
                                                <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">{d.status}</span></td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 font-black uppercase text-[9px]">View Report</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                 )}


                 {activeTab === 'finance' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Insurance Coverage</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm border-t-4 border-t-blue-600">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h5 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{insuranceDetails.provider}</h5>
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">{insuranceDetails.scheme}</p>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{insuranceDetails.status}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Policy Number</p>
                                            <p className="text-sm font-bold text-slate-700">{insuranceDetails.policyNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valid Until</p>
                                            <p className="text-sm font-bold text-slate-700">{insuranceDetails.validUntil}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dependents</p>
                                            <p className="text-sm font-bold text-slate-700">{insuranceDetails.dependents} Registered</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fa fa-wallet text-8xl"></i></div>
                                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Benefit Utilization</h6>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-bold">Annual Limit</span>
                                                    <span className="font-black">KES {insuranceDetails.limit}</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: '84%' }}></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end pt-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-500 uppercase">Remaining Balance</p>
                                                    <p className="text-2xl font-black text-emerald-400">KES {insuranceDetails.balance}</p>
                                                </div>
                                                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">View Statement</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Billing History</h4>
                                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">Statement of Account</button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Invoice #</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4">Amount (KES)</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {billingHistory.map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-800">{b.id}</td>
                                                <td className="px-6 py-4 text-slate-400">{b.date}</td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{b.type}</td>
                                                <td className="px-6 py-4 font-black text-slate-900">{b.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${b.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{b.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 font-black uppercase text-[9px]">View Invoice</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                 )}


                 {activeTab === 'docs' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Clinical Reports</h4>
                                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">Generate New</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportsHistory.map(r => (
                                    <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <i className="fa fa-file-pdf text-xl"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-xs font-black text-slate-800 uppercase">{r.name}</h6>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{r.type} &bull; {r.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><i className="fa fa-download"></i></button>
                                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Patient Files</h4>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">+ Upload File</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {filesHistory.map(f => (
                                    <div key={f.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center group hover:border-blue-300 transition-all cursor-pointer">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors mb-3">
                                            <i className={`fa ${f.type === 'Image' ? 'fa-image' : 'fa-file-alt'} text-2xl`}></i>
                                        </div>
                                        <h6 className="text-[10px] font-black text-slate-800 uppercase truncate w-full mb-1">{f.name}</h6>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase">{f.size} &bull; {f.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 )}



                 {activeTab === 'summary' && (
                    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto">
                       {/* Encounter Header */}
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <div className="flex items-center gap-3">
                                 <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{currentVisit.reason}</h4>
                                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-slate-200">{currentVisit.type}</span>
                             </div>
                             <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">
                                {currentVisit.date} &bull; Attending: {currentVisit.doctor}
                             </p>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={handleEditNote} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-sm">Edit Note</button>
                              <button onClick={() => setShowReportModal(true)} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-slate-900 transition"><i className="fa fa-print mr-2"></i> Report</button>
                          </div>
                       </div>

                       <div className="grid grid-cols-12 gap-8">
                          {/* SOAP Notes Column */}
                          <div className="col-span-12 lg:col-span-8 space-y-6">
                             {/* Subjective */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-400 relative">
                                <span className="absolute top-4 right-4 text-[10px] font-black text-slate-200 uppercase">Subjective</span>
                                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center"><i className="fa fa-comments mr-2"></i> Patient History</h6>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">"{currentVisit.notes.s}"</p>
                             </div>
                             
                             {/* Objective */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-400 relative">
                                <span className="absolute top-4 right-4 text-[10px] font-black text-slate-200 uppercase">Objective</span>
                                <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center"><i className="fa fa-eye mr-2"></i> Examination Findings</h6>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">"{currentVisit.notes.o}"</p>
                             </div>

                             {/* Assessment & Plan */}
                             <div className="grid grid-cols-2 gap-6">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h6 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Assessment (Dx)</h6>
                                    <p className="text-sm text-indigo-900 font-black leading-relaxed">{currentVisit.notes.a}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                    <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plan of Care</h6>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentVisit.notes.p}</p>
                                </div>
                             </div>
                          </div>
                          
                          {/* Context Sidebar */}
                          <div className="col-span-12 lg:col-span-4 space-y-6">
                             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Encounter Snapshot</h6>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-500 uppercase">Outcome</span>
                                        <span className="font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{currentVisit.outcome}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-500 uppercase">Diagnosis</span>
                                        <span className="font-black text-blue-600">{currentVisit.diagnosis}</span>
                                    </div>
                                </div>
                             </div>

                             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Quick Actions</h6>
                                <div className="space-y-2">
                                    <button 
                                        onClick={handleRepeatRx}
                                        className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-blue-50 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600 rounded-lg transition-colors flex items-center"
                                    >
                                        <i className="fa fa-pills w-5 text-center mr-2"></i> Repeat Prescription
                                    </button>
                                    <button 
                                        onClick={handleOrderLabs}
                                        className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-purple-50 text-[10px] font-bold uppercase text-slate-600 hover:text-purple-600 rounded-lg transition-colors flex items-center"
                                    >
                                        <i className="fa fa-flask w-5 text-center mr-2"></i> Order Diagnostics
                                    </button>
                                    <button 
                                        onClick={handleAdmit}
                                        className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-orange-50 text-[10px] font-bold uppercase text-slate-600 hover:text-orange-600 rounded-lg transition-colors flex items-center"
                                    >
                                        <i className="fa fa-procedures w-5 text-center mr-2"></i> Admit Patient
                                    </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'vitals' && (
                    <div className="animate-in slide-in-from-bottom-2 duration-300 max-w-6xl mx-auto space-y-8">
                       <div className="flex justify-between items-center">
                          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Vitals Monitor</h4>
                          <button 
                             onClick={handleSaveVitals}
                             className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition"
                          >
                             + Record Reading
                          </button>
                       </div>

                       {/* Input Form Compact */}
                       <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4 shadow-inner">
                           <div><label className="block text-[9px] font-black text-blue-400 uppercase mb-1">BP (Sys/Dia)</label><div className="flex gap-1"><input value={vitalsForm.bpSys} onChange={e=>setVitalsForm({...vitalsForm, bpSys: e.target.value})} className="w-full p-2 rounded text-xs font-bold text-center outline-none" placeholder="120" /><input value={vitalsForm.bpDia} onChange={e=>setVitalsForm({...vitalsForm, bpDia: e.target.value})} className="w-full p-2 rounded text-xs font-bold text-center outline-none" placeholder="80" /></div></div>
                           <div><label className="block text-[9px] font-black text-blue-400 uppercase mb-1">Pulse</label><input value={vitalsForm.pulse} onChange={e=>setVitalsForm({...vitalsForm, pulse: e.target.value})} className="w-full p-2 rounded text-xs font-bold outline-none" placeholder="72" /></div>
                           <div><label className="block text-[9px] font-black text-blue-400 uppercase mb-1">Temp (°C)</label><input value={vitalsForm.temp} onChange={e=>setVitalsForm({...vitalsForm, temp: e.target.value})} className="w-full p-2 rounded text-xs font-bold outline-none" placeholder="36.5" /></div>
                           <div><label className="block text-[9px] font-black text-blue-400 uppercase mb-1">SpO2 (%)</label><input value={vitalsForm.spo2} onChange={e=>setVitalsForm({...vitalsForm, spo2: e.target.value})} className="w-full p-2 rounded text-xs font-bold outline-none" placeholder="98" /></div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <VitalTrendChart data={[36.2, 36.5, 36.8, 37.1]} color="#f97316" label="Temperature Trend" unit="°C" />
                           <VitalTrendChart data={[110, 115, 120, 118]} color="#3b82f6" label="Systolic BP Trend" unit="mmHg" />
                       </div>

                       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left text-[11px]">
                             <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight">
                                <tr>
                                   <th className="px-6 py-4">Date & Time</th>
                                   <th className="px-6 py-4">Temp (°C)</th>
                                   <th className="px-6 py-4">BP (mmHg)</th>
                                   <th className="px-6 py-4">Pulse (BPM)</th>
                                   <th className="px-6 py-4">SpO2 (%)</th>
                                   <th className="px-6 py-4 text-right">Captured By</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50 text-slate-700">
                                {vitalsHistory.map(v => (
                                   <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-6 py-4 font-bold">{v.date} <span className="text-slate-400 font-medium ml-1">{v.time}</span></td>
                                      <td className="px-6 py-4 font-black text-orange-500">{v.temp}</td>
                                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{v.bp}</td>
                                      <td className="px-6 py-4 font-bold">{v.pulse}</td>
                                      <td className="px-6 py-4 font-bold">{v.spo2}%</td>
                                      <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase">{v.user}</td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {['labs', 'imaging'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-300 animate-in fade-in">
                       <i className={`fa ${activeTab === 'labs' ? 'fa-vials' : activeTab === 'rx' ? 'fa-pills' : 'fa-x-ray'} text-6xl mb-4 opacity-10`}></i>
                       <p className="text-sm font-bold uppercase tracking-widest">No recent {activeTab.toUpperCase()} records</p>
                       <button onClick={handleNewRequest} className="mt-4 text-[10px] font-black text-blue-600 uppercase hover:underline">Create New Request</button>
                    </div>
                 )}
           </div>
        </div>
      </div>

      {/* Hidden Print Component Logic */}
      <PrintableReport 
         ref={reportRef} 
         visit={currentVisit} 
         patient={activePatient} 
         hospitalName="UltraHub Hospital" 
      />

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h5 className="font-black text-gray-800 uppercase tracking-widest text-xs">Print Preview</h5>
                    <div className="flex space-x-2">
                        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Print Document</button>
                        <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600 px-4"><i className="fa fa-times text-lg"></i></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-200 p-8 flex justify-center">
                     <div className="scale-75 origin-top transform transition-transform shadow-xl">
                        <PrintableReport 
                             visit={currentVisit} 
                             patient={activePatient} 
                             hospitalName="UltraHub Hospital" 
                        />
                     </div>
                </div>
            </div>
        </div>
      )}

      {/* --- Admission Modal --- */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-bed text-9xl transform -rotate-12"></i></div>
                     <div className="relative z-10">
                         <h3 className="text-xl font-black uppercase tracking-tight">Admit Patient</h3>
                         <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">{activePatient.surname}, {activePatient.othernames}</p>
                     </div>
                     <button onClick={() => setShowAdmitModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                </div>
                <div className="p-8 flex-1 bg-slate-50">
                    <form onSubmit={submitAdmission} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Target Ward</label>
                            <select value={admitForm.ward} onChange={e => setAdmitForm({...admitForm, ward: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none">
                                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Priority</label>
                                <select value={admitForm.priority} onChange={e => setAdmitForm({...admitForm, priority: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none">
                                    <option>Routine</option><option>Urgent</option><option>Emergency</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Admitting Doctor</label>
                                <input value={admitForm.admittingDoctor} onChange={e => setAdmitForm({...admitForm, admittingDoctor: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                            </div>
                        </div>
                        <div>
                             <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Admission Notes</label>
                             <textarea value={admitForm.notes} onChange={e => setAdmitForm({...admitForm, notes: e.target.value})} className="w-full h-24 p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 outline-none resize-none" placeholder="Reason for admission..."></textarea>
                        </div>
                        <div className="pt-4 border-t border-slate-200 flex justify-end">
                             <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Confirm Admission</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      {/* --- Clinical Order Modal (Labs/Radiology) --- */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in-95 duration-200">
                 <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                     <div>
                         <h3 className="text-xl font-black uppercase tracking-tight">Clinical Orders</h3>
                         <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1">Diagnostics & Procedures</p>
                     </div>
                     <button onClick={() => setShowOrderModal(false)} className="text-white/50 hover:text-white transition-colors"><i className="fa fa-times text-2xl"></i></button>
                 </div>
                 <div className="flex flex-1 overflow-hidden">
                     {/* Left: Catalog */}
                     <div className="w-1/2 border-r border-slate-200 flex flex-col bg-slate-50">
                         <div className="p-4 border-b border-slate-200 flex gap-2">
                             <button onClick={() => setOrderType('Lab')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition ${orderType === 'Lab' ? 'bg-purple-600 text-white' : 'bg-white text-slate-500 border'}`}>Laboratory</button>
                             <button onClick={() => setOrderType('Radiology')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition ${orderType === 'Radiology' ? 'bg-teal-600 text-white' : 'bg-white text-slate-500 border'}`}>Radiology</button>
                         </div>
                         <div className="p-4 flex-1 overflow-y-auto space-y-2">
                             {(orderType === 'Lab' ? LAB_CATALOG : RAD_CATALOG).map(item => (
                                 <div key={item.id} onClick={() => addOrderToPending({...item, type: orderType})} className="p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition flex justify-between items-center group">
                                     <div>
                                         <p className="text-xs font-black text-slate-700">{item.name}</p>
                                         <p className="text-[9px] text-slate-400 font-bold uppercase">Code: {item.id}</p>
                                     </div>
                                     <i className="fa fa-plus-circle text-slate-300 group-hover:text-blue-500"></i>
                                 </div>
                             ))}
                         </div>
                     </div>
                     {/* Right: Selected Basket */}
                     <div className="w-1/2 flex flex-col bg-white">
                         <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                             <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Requests ({pendingOrders.length})</h6>
                         </div>
                         <div className="flex-1 p-4 overflow-y-auto space-y-2">
                             {pendingOrders.map((order, idx) => (
                                 <div key={idx} className="p-3 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50">
                                     <div>
                                         <p className="text-xs font-bold text-slate-800">{order.name}</p>
                                         <span className={`text-[8px] font-black px-1.5 rounded uppercase ${order.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>{order.type}</span>
                                     </div>
                                     <button onClick={() => setPendingOrders(pendingOrders.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><i className="fa fa-times"></i></button>
                                 </div>
                             ))}
                             {pendingOrders.length === 0 && <div className="text-center py-10 text-slate-300 text-xs italic">No items selected</div>}
                         </div>
                         <div className="p-6 border-t border-slate-100">
                             <button onClick={submitOrders} disabled={pendingOrders.length === 0} className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition disabled:opacity-50">Sign & Submit Orders</button>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      )}

      {/* --- Repeat Rx Modal --- */}
      {showRxModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                     <h3 className="text-xl font-black uppercase tracking-tight">Repeat Prescription</h3>
                     <button onClick={() => setShowRxModal(false)} className="text-white/50 hover:text-white"><i className="fa fa-times text-xl"></i></button>
                 </div>
                 <div className="p-6 bg-slate-50">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-4">Previous Medications</p>
                     <div className="space-y-3 mb-6">
                         {['Amoxicillin 500mg', 'Paracetamol 1g', 'Cetirizine 10mg'].map((drug, i) => (
                             <label key={i} className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-400">
                                 <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                                 <span className="text-xs font-bold text-slate-700">{drug}</span>
                             </label>
                         ))}
                     </div>
                     <button onClick={confirmRepeatRx} className="w-full bg-green-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-green-700 transition">Prescribe Selected</button>
                 </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default PatientChart;
