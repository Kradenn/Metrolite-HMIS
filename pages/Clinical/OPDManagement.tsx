
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../../context/NotificationContext';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import QueueModal from '../../components/QueueModal';

interface OPDPatient {
    id: string;
    name: string;
    opNumber: string;
    age: number;
    gender: string;
    scheme: string;
    phone: string;
    arrival: string;
    waitTime: string;
    priority: 'Normal' | 'High' | 'Urgent' | 'Critical';
    currentStation: 'Reception' | 'Triage' | 'Consultation' | 'Laboratory' | 'Radiology' | 'Pharmacy' | 'Billing' | 'Departed';
    status: 'Waiting' | 'In-Service' | 'Completed';
    attending?: string;
    balance: number;
}

const OPDManagement: React.FC = () => {
    const navigate = useNavigate();
    const { notify } = useNotification();
    const { setActivePatient } = usePatient();
    
    // --- UI States ---
    const [selectedPatient, setSelectedPatient] = useState<OPDPatient | null>(null);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [activeStationFilter, setActiveStationFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showQueueModal, setShowQueueModal] = useState(false);
    
    // New Feature States
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [registrationMode, setRegistrationMode] = useState<'NEW' | 'REVISIT'>('REVISIT');
    const [revisitSearch, setRevisitSearch] = useState('');
    const [foundPatients, setFoundPatients] = useState<any[]>([]);

    // Extended Form State based on Screenshot
    const [regForm, setRegForm] = useState({
        surname: '',
        othernames: '',
        sex: 'Female',
        dob: '',
        idType: 'National ID',
        idNumber: '',
        telephone1: '',
        telephone2: '',
        email: '',
        postalAddress: '',
        postalCode: '',
        occupation: '',
        residence: '',
        town: '',
        referenceNumber: '',
        nationality: 'Kenyan',
        nokName: '',
        nokContact: '',
        nokRelation: '',
        notes: '',
        // Payment Details
        paymentMode: 'Cash', // Cash, NHIF/SHA, Insurance, Corporate
        insurer: '',
        memberNo: '',
        station: 'Triage (Baseline)',
        priority: 'Routine'
    });

    // Custom Entry Toggles
    const [customEntry, setCustomEntry] = useState({
        town: false,
        nationality: false,
        occupation: false,
        insurer: false,
        relationship: false
    });
    
    // Lookup State
    const [lookupQuery, setLookupQuery] = useState('');
    const [lookupResults, setLookupResults] = useState<any[]>([]);

    // --- Mock Data Options ---
    const townOptions = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
    const nationalityOptions = ['Kenyan', 'Ugandan', 'Tanzanian', 'Rwandan', 'South Sudanese', 'Ethiopian', 'Other'];
    const occupationOptions = ['Employed', 'Self Employed', 'Student', 'Unemployed', 'Retired', 'Minor'];
    const relationshipOptions = ['Father', 'Mother', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Friend', 'Other'];
    const insurerOptions = ['Jubilee Insurance', 'AON Minet', 'Britam', 'APA Insurance', 'UAP Old Mutual', 'Madison Insurance'];
    const corporateOptions = ['Safaricom', 'Equity Bank', 'KCB', 'Kenya Airways', 'UN Bodies'];

    // --- Mock Data: OPD Today's Census ---
    const [census, setCensus] = useState<OPDPatient[]>([
        { id: '1', name: 'JANE DOE', opNumber: 'OP-23-001', age: 24, gender: 'Female', scheme: 'CASH', phone: '0711000999', arrival: '08:30 AM', waitTime: '45m', priority: 'High', currentStation: 'Consultation', status: 'In-Service', attending: 'Dr. Wilson', balance: 0 },
        { id: '2', name: 'JOHN SMITH', opNumber: 'OP-23-042', age: 45, gender: 'Male', scheme: 'JUBILEE', phone: '0722111222', arrival: '09:15 AM', waitTime: '15m', priority: 'Normal', currentStation: 'Triage', status: 'Waiting', balance: 1200 },
        { id: '3', name: 'MARY ANN', opNumber: 'OP-23-115', age: 32, gender: 'Female', scheme: 'NHIF', phone: '0733222333', arrival: '10:00 AM', waitTime: '5m', priority: 'Critical', currentStation: 'Reception', status: 'In-Service', attending: 'Records 01', balance: 0 },
        { id: '4', name: 'BABY LIAM', opNumber: 'OP-23-502', age: 3, gender: 'Male', scheme: 'CASH', phone: '0744333444', arrival: '09:45 AM', waitTime: '30m', priority: 'Urgent', currentStation: 'Laboratory', status: 'Waiting', balance: 2500 },
        { id: '5', name: 'SARAH CONNOR', opNumber: 'OP-23-882', age: 29, gender: 'Female', scheme: 'AON MINET', phone: '0755444555', arrival: '08:00 AM', waitTime: '-', priority: 'Normal', currentStation: 'Pharmacy', status: 'Completed', attending: 'Pharm-01', balance: 0 },
    ]);

    // --- Filtering Logic ---
    const filteredCensus = useMemo(() => {
        return census.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.opNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStation = activeStationFilter === 'All' || p.currentStation === activeStationFilter;
            return matchesSearch && matchesStation;
        });
    }, [census, searchQuery, activeStationFilter]);

    const stats = useMemo(() => ({
        total: census.length,
        waiting: census.filter(p => p.status === 'Waiting').length,
        inService: census.filter(p => p.status === 'In-Service').length,
        completed: census.filter(p => p.status === 'Completed').length,
    }), [census]);

    // --- Handlers ---
    const toggleCustomEntry = (field: keyof typeof customEntry) => {
        setCustomEntry(prev => ({ ...prev, [field]: !prev[field] }));
        // Clear value when switching to ensure fresh input
        if (field === 'town') setRegForm(prev => ({...prev, town: ''}));
        if (field === 'nationality') setRegForm(prev => ({...prev, nationality: ''}));
        if (field === 'occupation') setRegForm(prev => ({...prev, occupation: ''}));
        if (field === 'insurer') setRegForm(prev => ({...prev, insurer: ''}));
        if (field === 'relationship') setRegForm(prev => ({...prev, nokRelation: ''}));
    };

    const handleAction = (path: string) => {
        if (!selectedPatient) return;
        setActivePatient({
            id: selectedPatient.id,
            surname: selectedPatient.name.split(' ')[1] || selectedPatient.name,
            othernames: selectedPatient.name.split(' ')[0],
            age: selectedPatient.age,
            gender: selectedPatient.gender,
            scheme: selectedPatient.scheme,
            outpatientNo: selectedPatient.opNumber,
            telephone: selectedPatient.phone,
            status: 'Queue'
        });
        navigate(path);
    };

    const handleRowClick = (patient: OPDPatient) => {
        setSelectedPatient(patient);
        setIsPatientModalOpen(true);
    };

    const handleRevisitSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRevisitSearch(val);
        if (val.length > 2) {
            // Mock Search
            setFoundPatients([
                { id: '101', name: 'James Cameron', op: 'OP-2022-991', age: 54, gender: 'Male', phone: '0700000001' },
                { id: '102', name: 'James Earl Jones', op: 'OP-2021-002', age: 70, gender: 'Male', phone: '0700000002' },
            ]);
        } else {
            setFoundPatients([]);
        }
    };

    const populateForm = (patient: any) => {
        setRegForm(prev => ({
            ...prev,
            surname: patient.surname,
            othernames: patient.othernames,
            dob: patient.dob || '',
            sex: patient.gender,
            idNumber: patient.idNo,
            telephone1: patient.phone,
            nokName: patient.emergencyContactName,
            nokContact: patient.emergencyContactPhone,
        }));
        setLookupQuery('');
        setLookupResults([]);
        notify('info', 'Form Populated', `Loaded details for ${patient.surname} ${patient.othernames}`);
    };

    const confirmRevisit = (p: any) => {
        const newVisit: OPDPatient = {
            id: Date.now().toString(),
            name: p.name,
            opNumber: p.op,
            age: p.age,
            gender: p.gender,
            scheme: 'CASH',
            phone: p.phone,
            arrival: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            waitTime: '0m',
            priority: 'Normal',
            currentStation: 'Triage',
            status: 'Waiting',
            balance: 0
        };
        setCensus([newVisit, ...census]);
        setIsRegisterModalOpen(false);
        setRevisitSearch('');
        notify('success', 'Revisit Created', `${p.name} checked in successfully to Triage.`);
    };

    const handleNewRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Calculate Age from DOB if present
        let age = 0;
        if(regForm.dob) {
            age = new Date().getFullYear() - new Date(regForm.dob).getFullYear();
        }

        // Construct scheme label
        let displayScheme = regForm.paymentMode;
        if (regForm.paymentMode === 'Insurance Scheme' || regForm.paymentMode === 'Corporate') {
            displayScheme = regForm.insurer || regForm.paymentMode;
        } else if (regForm.paymentMode === 'NHIF/SHA') {
            displayScheme = 'NHIF/SHA';
        }

        const newPatient: OPDPatient = {
            id: Date.now().toString(),
            name: `${regForm.surname} ${regForm.othernames}`,
            opNumber: `OP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            age: age,
            gender: regForm.sex,
            scheme: displayScheme,
            phone: regForm.telephone1,
            arrival: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            waitTime: '0m',
            priority: regForm.priority as any,
            currentStation: 'Triage',
            status: 'Waiting',
            attending: '',
            balance: 0
        };

        // Update Patient Context
        const patientRecord: PatientRecord = {
            id: newPatient.id,
            surname: regForm.surname,
            othernames: regForm.othernames,
            gender: regForm.sex,
            dob: regForm.dob,
            age: age,
            telephone: regForm.telephone1,
            telephone2: regForm.telephone2,
            email: regForm.email,
            residence: regForm.residence,
            town: regForm.town,
            postalAddress: regForm.postalAddress,
            postalCode: regForm.postalCode,
            nationality: regForm.nationality,
            idType: regForm.idType,
            idNumber: regForm.idNumber,
            referenceNumber: regForm.referenceNumber,
            occupation: regForm.occupation,
            scheme: displayScheme,
            outpatientNo: newPatient.opNumber,
            status: 'Queue',
            emergencyContactName: regForm.nokName,
            emergencyContactPhone: regForm.nokContact,
            nokRelation: regForm.nokRelation,
            notes: regForm.notes
        };
        
        setActivePatient(patientRecord);
        setCensus([newPatient, ...census]);
        setIsRegisterModalOpen(false);
        notify('success', 'Registration Successful', 'Patient registered and queued for Triage.');
    };

    const getPriorityStyle = (p: OPDPatient['priority']) => {
        switch(p) {
            case 'Critical': return 'bg-red-600 text-white border-red-700 animate-pulse';
            case 'Urgent': return 'bg-orange-50 text-white border-orange-600';
            case 'High': return 'bg-yellow-400 text-black border-yellow-500';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const getStationIcon = (station: string) => {
        switch(station) {
            case 'Triage': return 'fa-heartbeat';
            case 'Consultation': return 'fa-user-md';
            case 'Laboratory': return 'fa-flask';
            case 'Radiology': return 'fa-x-ray';
            case 'Pharmacy': return 'fa-pills';
            case 'Billing': return 'fa-file-invoice-dollar';
            default: return 'fa-user-circle';
        }
    };

    const inputClass = "w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400";
    const labelClass = "block text-[10px] font-bold text-slate-500 mb-1 ml-0.5";
    const requiredLabel = (text: string) => <span className="block text-[10px] font-bold text-slate-500 mb-1 ml-0.5">{text} <span className="text-red-500">*</span></span>;

    // Helper to toggle icons
    const ToggleButton = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
        <button 
            type="button" 
            onClick={onClick} 
            className={`px-2 rounded border font-bold hover:bg-opacity-80 transition-colors ${active ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
            title={active ? "Switch to list" : "Add new entry"}
        >
            <i className={`fa ${active ? 'fa-list' : 'fa-plus'}`}></i>
        </button>
    );

    return (
        <div className="animate-bottom h-[calc(100vh-80px)] flex flex-col font-helvetica overflow-hidden bg-slate-50 -m-4 md:-m-6">
            
            {/* 1. Header: Industrial Command Style */}
            <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 shrink-0 shadow-lg z-20">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-none flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-users-viewfinder"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Outpatient Operations</h2>
                        <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Live Patient Flow & Station Control</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]"></i>
                        <input 
                            type="text" 
                            placeholder="SEARCH REGISTRY..." 
                            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-none text-[10px] font-bold text-slate-300 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 uppercase tracking-wider"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setIsRegisterModalOpen(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-none text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition whitespace-nowrap">Register / Check-In</button>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto lg:overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full">
                    
                    {/* LEFT (Col-9): Patient Registry Table */}
                    <div className="lg:col-span-9 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] lg:min-h-0">
                        {/* Search & Filter Bar */}
                        <div className="bg-white border-b border-slate-100 flex items-center p-2 shrink-0 overflow-x-auto">
                            <div className="flex flex-1 overflow-x-auto scrollbar-hide px-2 gap-2">
                                {['All', 'Reception', 'Triage', 'Consultation', 'Pharmacy', 'Billing'].map(station => (
                                    <button
                                        key={station}
                                        onClick={() => setActiveStationFilter(station)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap rounded-lg ${activeStationFilter === station ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {station}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left text-[11px] border-collapse min-w-[800px]">
                                <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tight sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 border-b border-slate-200">Patient Identity</th>
                                        <th className="px-4 md:px-6 py-4 border-b border-slate-200">Wait Time</th>
                                        <th className="px-4 md:px-6 py-4 border-b border-slate-200">Station</th>
                                        <th className="px-4 md:px-6 py-4 border-b border-slate-200 text-center">Status</th>
                                        <th className="px-4 md:px-6 py-4 border-b border-slate-200 text-right">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCensus.map(p => (
                                        <tr 
                                            key={p.id} 
                                            onClick={() => handleRowClick(p)}
                                            className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 uppercase leading-none">{p.name}</div>
                                                        <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">{p.opNumber} &bull; <span className="text-indigo-500">{p.scheme}</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-black ${parseInt(p.waitTime) > 30 ? 'text-red-500' : 'text-slate-700'}`}>{p.waitTime}</span>
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Arr: {p.arrival}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center space-x-2 text-indigo-600">
                                                    <i className={`fa ${getStationIcon(p.currentStation)} text-[10px]`}></i>
                                                    <span className="font-black uppercase tracking-tight">{p.currentStation}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border ${
                                                    p.status === 'Waiting' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    p.status === 'In-Service' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    'bg-slate-100 text-slate-400 border-slate-200'
                                                }`}>{p.status}</span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block ${getPriorityStyle(p.priority)}`}>
                                                    {p.priority}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT (Col-3): Insights Column */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        {/* 1. Today Total */}
                        <div className="bg-indigo-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
                             <div className="relative z-10">
                                <h3 className="text-4xl font-black">{stats.total}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Today Total</p>
                             </div>
                             <i className="fa fa-users text-6xl absolute -right-2 -bottom-4 opacity-20 rotate-12 group-hover:scale-110 transition-transform"></i>
                        </div>

                        {/* 2. Waiting */}
                        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                             <div className="relative z-10">
                                <h3 className="text-3xl font-black text-orange-600">{stats.waiting}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Waiting</p>
                             </div>
                             <div className="absolute right-4 top-4 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <i className="fa fa-clock"></i>
                             </div>
                        </div>

                        {/* 3. In-Service */}
                        <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                             <div className="relative z-10">
                                <h3 className="text-3xl font-black text-green-600">{stats.inService}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">In-Service</p>
                             </div>
                             <div className="absolute right-4 top-4 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <i className="fa fa-stethoscope"></i>
                             </div>
                        </div>

                        {/* 4. Completed */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                             <div className="relative z-10">
                                <h3 className="text-3xl font-black text-slate-700">{stats.completed}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Completed</p>
                             </div>
                             <div className="absolute right-4 top-4 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                <i className="fa fa-check-double"></i>
                             </div>
                        </div>
                        
                        {/* Summary Button */}
                        <button className="w-full py-3 bg-white border border-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition shadow-sm mt-auto">
                            View Shift Report
                        </button>
                    </div>

                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Patient Hub Popup Modal */}
            {isPatientModalOpen && selectedPatient && (
                <div 
                    className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsPatientModalOpen(false)}
                >
                    <div 
                        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <i className="fa fa-hospital-user text-9xl transform -rotate-12"></i>
                            </div>

                            <div className="flex items-center space-x-5 relative z-10">
                                <div className="w-16 h-16 bg-white text-indigo-900 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight leading-none">{selectedPatient.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getPriorityStyle(selectedPatient.priority)}`}>{selectedPatient.priority}</span>
                                         <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-700/50">{selectedPatient.opNumber}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        {selectedPatient.age} Yrs &bull; {selectedPatient.gender} &bull; {selectedPatient.scheme}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsPatientModalOpen(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                        </div>

                        {/* Modal Content - Hub Actions */}
                        <div className="p-8 bg-slate-50 flex-1 overflow-y-auto">
                             
                             {/* Status Indicator */}
                             <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                                        <i className={`fa ${getStationIcon(selectedPatient.currentStation)}`}></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Location</p>
                                        <p className="text-sm font-black text-slate-800 uppercase">{selectedPatient.currentStation}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending</p>
                                     <p className="text-sm font-bold text-slate-700">{selectedPatient.attending || 'Unassigned'}</p>
                                 </div>
                             </div>

                             <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Move Patient To</h6>
                             
                             {/* Navigation Grid */}
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: 'Triage', station: 'Triage', icon: 'fa-heartbeat', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                    { label: 'Doctor', station: 'Consultation', icon: 'fa-user-md', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                                    { label: 'Lab', station: 'Laboratory', icon: 'fa-flask', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                    { label: 'Imaging', station: 'Radiology', icon: 'fa-x-ray', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
                                    { label: 'Pharmacy', station: 'Pharmacy', icon: 'fa-pills', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                                    { label: 'Procedures', station: 'Treatment Room', icon: 'fa-syringe', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                    { label: 'Billing', station: 'Billing', icon: 'fa-file-invoice-dollar', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                    { label: 'Discharge', station: 'Departed', icon: 'fa-door-open', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
                                ].map(item => (
                                    <button 
                                        key={item.station}
                                        onClick={() => { setShowQueueModal(true); setIsPatientModalOpen(false); }}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${item.bg} ${item.border} hover:shadow-md transition-all group active:scale-95`}
                                    >
                                        <div className={`text-2xl mb-2 ${item.color} group-hover:scale-110 transition-transform`}>
                                            <i className={`fa ${item.icon}`}></i>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tight ${item.color.replace('600', '800')}`}>{item.label}</span>
                                    </button>
                                ))}
                             </div>

                             {/* Bottom Action Bar */}
                             <div className="grid grid-cols-2 gap-4">
                                 <button 
                                    onClick={() => handleAction('/clinical/chart')}
                                    className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                 >
                                    <i className="fa fa-file-medical-alt text-indigo-500"></i> Open Clinical Chart
                                 </button>
                                 <button 
                                    className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                 >
                                    <i className="fa fa-print text-slate-400"></i> Print Labels
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration / Check-In Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                 <i className="fa fa-id-card text-9xl transform -rotate-12"></i>
                             </div>
                             <div className="relative z-10">
                                 <h3 className="text-xl font-black uppercase tracking-tight">Patient Registration</h3>
                                 <div className="flex gap-4 mt-2">
                                     <button 
                                         onClick={() => setRegistrationMode('REVISIT')}
                                         className={`text-[10px] font-black uppercase tracking-widest transition-colors ${registrationMode === 'REVISIT' ? 'text-white border-b-2 border-white' : 'text-slate-400 hover:text-white'}`}
                                     >
                                         Revisit Check-In
                                     </button>
                                     <button 
                                         onClick={() => setRegistrationMode('NEW')}
                                         className={`text-[10px] font-black uppercase tracking-widest transition-colors ${registrationMode === 'NEW' ? 'text-white border-b-2 border-white' : 'text-slate-400 hover:text-white'}`}
                                     >
                                         New Patient
                                     </button>
                                 </div>
                             </div>
                             <button onClick={() => setIsRegisterModalOpen(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto scrollbar-hide flex-1 bg-slate-50">
                            
                            {/* MODE: REVISIT */}
                            {registrationMode === 'REVISIT' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm text-indigo-600"><i className="fa fa-search"></i></div>
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Search Existing Record</h3>
                                        <div className="max-w-xl mx-auto relative">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-inner"
                                                placeholder="Enter Name, OP Number, or Phone ID..."
                                                value={revisitSearch}
                                                onChange={handleRevisitSearch}
                                            />
                                            <i className="fa fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                        </div>
                                    </div>

                                    {foundPatients.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            {foundPatients.map(p => (
                                                <div key={p.id} onClick={() => confirmRevisit(p)} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group flex items-start space-x-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-black text-slate-800 uppercase text-xs group-hover:text-indigo-600">{p.name}</h5>
                                                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{p.op} &bull; {p.phone}</p>
                                                        <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block mt-2">{p.age} Yrs / {p.gender}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* MODE: NEW REGISTRATION */}
                            {registrationMode === 'NEW' && (
                                <form className="space-y-6 animate-in fade-in" onSubmit={handleNewRegistration}>
                                    
                                    <div className="space-y-6">
                                        {/* Row 1: Basic Identity */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className={labelClass}>Surname <span className="text-red-500">*</span></label>
                                                <input required className={inputClass} placeholder="Surname..." value={regForm.surname} onChange={e => setRegForm({...regForm, surname: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Other Names <span className="text-red-500">*</span></label>
                                                <input required className={inputClass} placeholder="Other Names..." value={regForm.othernames} onChange={e => setRegForm({...regForm, othernames: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Sex <span className="text-red-500">*</span></label>
                                                <select className={inputClass} value={regForm.sex} onChange={e => setRegForm({...regForm, sex: e.target.value})}>
                                                    <option>Female</option><option>Male</option><option>Intersex</option>
                                                </select>
                                            </div>
                                            <div>
                                                {requiredLabel('Date Of Birth')}
                                                <div className="flex items-center gap-1">
                                                    <input type="date" required className={inputClass} value={regForm.dob} onChange={e => setRegForm({...regForm, dob: e.target.value})} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Identification & Contact */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                {requiredLabel('ID Type')}
                                                <select className={inputClass} value={regForm.idType} onChange={e => setRegForm({...regForm, idType: e.target.value})}>
                                                    <option>National ID</option><option>Passport</option><option>Alien ID</option><option>Birth Cert</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>{regForm.idType} Number</label>
                                                <input className={inputClass} placeholder="ID NO..." value={regForm.idNumber} onChange={e => setRegForm({...regForm, idNumber: e.target.value})} />
                                            </div>
                                            <div>
                                                {requiredLabel('Telephone 1')}
                                                <input className={inputClass} placeholder="Telephone 1..." value={regForm.telephone1} onChange={e => setRegForm({...regForm, telephone1: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Telephone 2</label>
                                                <input className={inputClass} placeholder="Telephone 2..." value={regForm.telephone2} onChange={e => setRegForm({...regForm, telephone2: e.target.value})} />
                                            </div>
                                        </div>

                                        {/* Row 3: Address & Demographics */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                             <div>
                                                <label className={labelClass}>Email</label>
                                                <input className={inputClass} placeholder="Email..." value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
                                             </div>
                                             <div>
                                                {requiredLabel('Residence')}
                                                <input className={inputClass} placeholder="Residence..." value={regForm.residence} onChange={e => setRegForm({...regForm, residence: e.target.value})} />
                                             </div>
                                             <div>
                                                {requiredLabel('Town')}
                                                 <div className="flex gap-1">
                                                    {customEntry.town ? (
                                                        <input 
                                                            className={inputClass} 
                                                            placeholder="Enter new town..." 
                                                            value={regForm.town}
                                                            onChange={e => setRegForm({...regForm, town: e.target.value})}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <select className={inputClass} value={regForm.town} onChange={e => setRegForm({...regForm, town: e.target.value})}>
                                                            <option value="">Select Town...</option>
                                                            {townOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    )}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => toggleCustomEntry('town')}
                                                        className={`px-2 rounded border font-bold hover:bg-opacity-80 transition-colors ${customEntry.town ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
                                                        title={customEntry.town ? "Select from list" : "Add new town"}
                                                    >
                                                        <i className={`fa ${customEntry.town ? 'fa-list' : 'fa-plus'}`}></i>
                                                    </button>
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className={labelClass}>Postal Address</label>
                                                 <input className={inputClass} placeholder="Postal Address..." value={regForm.postalAddress} onChange={e => setRegForm({...regForm, postalAddress: e.target.value})} />
                                             </div>
                                        </div>

                                        {/* Row 4: More Demographics & NOK */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                 <label className={labelClass}>Postal Code</label>
                                                 <input className={inputClass} placeholder="Postal Code..." value={regForm.postalCode} onChange={e => setRegForm({...regForm, postalCode: e.target.value})} />
                                             </div>
                                             <div>
                                                {requiredLabel('Nationality')}
                                                <div className="flex gap-1">
                                                    {customEntry.nationality ? (
                                                        <input 
                                                            className={inputClass} 
                                                            placeholder="Enter Nationality..." 
                                                            value={regForm.nationality}
                                                            onChange={e => setRegForm({...regForm, nationality: e.target.value})}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <select className={inputClass} value={regForm.nationality} onChange={e => setRegForm({...regForm, nationality: e.target.value})}>
                                                            {nationalityOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                                        </select>
                                                    )}
                                                    <ToggleButton active={customEntry.nationality} onClick={() => toggleCustomEntry('nationality')} />
                                                </div>
                                             </div>
                                             <div>
                                                 {requiredLabel('Occupation')}
                                                 <div className="flex gap-1">
                                                      {customEntry.occupation ? (
                                                          <input 
                                                            className={inputClass}
                                                            placeholder="Enter Occupation..."
                                                            value={regForm.occupation}
                                                            onChange={e => setRegForm({...regForm, occupation: e.target.value})}
                                                            autoFocus
                                                          />
                                                      ) : (
                                                          <select className={inputClass} value={regForm.occupation} onChange={e => setRegForm({...regForm, occupation: e.target.value})}>
                                                             <option value="">Select Occupation...</option>
                                                             {occupationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                                         </select>
                                                      )}
                                                      <ToggleButton active={customEntry.occupation} onClick={() => toggleCustomEntry('occupation')} />
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className={labelClass}>Reference Number</label>
                                                 <input className={inputClass} placeholder="Reference Number..." value={regForm.referenceNumber} onChange={e => setRegForm({...regForm, referenceNumber: e.target.value})} />
                                             </div>
                                        </div>

                                        {/* Row 5: Next of Kin */}
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                            <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Next of Kin Details</h6>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    {requiredLabel('Next Of Kin Name')}
                                                    <input className={inputClass} placeholder="NOK Name..." value={regForm.nokName} onChange={e => setRegForm({...regForm, nokName: e.target.value})} />
                                                </div>
                                                <div>
                                                    {requiredLabel("NOK Contact")}
                                                    <input className={inputClass} placeholder="NOK Contact..." value={regForm.nokContact} onChange={e => setRegForm({...regForm, nokContact: e.target.value})} />
                                                </div>
                                                <div>
                                                    {requiredLabel('Relationship')}
                                                    <div className="flex gap-1">
                                                        {customEntry.relationship ? (
                                                            <input 
                                                                className={inputClass} 
                                                                placeholder="Enter Relationship..." 
                                                                value={regForm.nokRelation}
                                                                onChange={e => setRegForm({...regForm, nokRelation: e.target.value})}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <select className={inputClass} value={regForm.nokRelation} onChange={e => setRegForm({...regForm, nokRelation: e.target.value})}>
                                                                <option value="">Select Relationship...</option>
                                                                {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                                            </select>
                                                        )}
                                                        <ToggleButton active={customEntry.relationship} onClick={() => toggleCustomEntry('relationship')} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 6: Notes */}
                                        <div>
                                            <label className={labelClass}>Notes</label>
                                            <textarea className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none h-16 resize-none" placeholder="Notes..." value={regForm.notes} onChange={e => setRegForm({...regForm, notes: e.target.value})}></textarea>
                                        </div>

                                        {/* Row 7: Payment Configuration */}
                                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                            <h6 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3 border-b border-indigo-200 pb-1">Payment & Billing Context</h6>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className={labelClass}>Payment Mode <span className="text-red-500">*</span></label>
                                                    <select 
                                                        className={inputClass} 
                                                        value={regForm.paymentMode} 
                                                        onChange={e => setRegForm({...regForm, paymentMode: e.target.value, insurer: '', memberNo: ''})}
                                                    >
                                                        <option>Cash</option>
                                                        <option>NHIF/SHA</option>
                                                        <option>Insurance Scheme</option>
                                                        <option>Corporate</option>
                                                    </select>
                                                </div>

                                                {/* Conditional Fields */}
                                                {(regForm.paymentMode === 'Insurance Scheme' || regForm.paymentMode === 'Corporate') && (
                                                    <>
                                                        <div>
                                                            <label className={labelClass}>{regForm.paymentMode === 'Corporate' ? 'Company Name' : 'Insurer'}</label>
                                                            <div className="flex gap-1">
                                                                {customEntry.insurer ? (
                                                                    <input 
                                                                        className={inputClass}
                                                                        placeholder={`Enter New ${regForm.paymentMode === 'Corporate' ? 'Company' : 'Insurer'}`}
                                                                        value={regForm.insurer}
                                                                        onChange={e => setRegForm({...regForm, insurer: e.target.value})}
                                                                        autoFocus
                                                                    />
                                                                ) : (
                                                                    <select 
                                                                        className={inputClass}
                                                                        value={regForm.insurer}
                                                                        onChange={e => setRegForm({...regForm, insurer: e.target.value})}
                                                                    >
                                                                        <option value="">Select Payer...</option>
                                                                        {regForm.paymentMode === 'Corporate' 
                                                                            ? corporateOptions.map(c => <option key={c} value={c}>{c}</option>)
                                                                            : insurerOptions.map(i => <option key={i} value={i}>{i}</option>)
                                                                        }
                                                                    </select>
                                                                )}
                                                                <ToggleButton active={customEntry.insurer} onClick={() => toggleCustomEntry('insurer')} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 items-end">
                                                            <div className="flex-1">
                                                                <label className={labelClass}>Member / Policy No</label>
                                                                <input 
                                                                    className={inputClass} 
                                                                    placeholder="Member No..." 
                                                                    value={regForm.memberNo}
                                                                    onChange={e => setRegForm({...regForm, memberNo: e.target.value})}
                                                                />
                                                            </div>
                                                            <button type="button" className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-50 h-[38px]">Verify</button>
                                                        </div>
                                                    </>
                                                )}

                                                {regForm.paymentMode === 'NHIF/SHA' && (
                                                    <>
                                                        <div>
                                                            <label className={labelClass}>Card Number</label>
                                                            <input 
                                                                className={inputClass} 
                                                                placeholder="NHIF/SHA No..." 
                                                                value={regForm.memberNo}
                                                                onChange={e => setRegForm({...regForm, memberNo: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="flex items-end">
                                                            <button type="button" className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-200 h-[38px] flex items-center justify-center gap-2">
                                                                <i className="fa fa-fingerprint"></i> Biometric Verify
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                    
                                    <div className="border-t border-slate-100 pt-6 flex justify-end items-center">
                                         <button type="submit" className="bg-indigo-600 text-white px-12 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform active:scale-95">Complete Registration</button>
                                    </div>

                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <QueueModal 
                isOpen={showQueueModal} 
                onClose={() => setShowQueueModal(false)}
                patientName={selectedPatient?.name}
                patientId={selectedPatient?.id}
            />
        </div>
    );
};

export default OPDManagement;
