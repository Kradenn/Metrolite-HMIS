
import React, { useState, useMemo } from 'react';

interface Employee {
  id: string;
  staffNo: string;
  surname: string;
  othernames: string;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  phone: string;
  email: string;
  dateEmployed: string;
  idNo: string;
}

const Employees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'financial' | 'nok'>('details');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock Data
  const [employees] = useState<Employee[]>([
    { id: '1', staffNo: 'EMP-001', surname: 'DOE', othernames: 'JOHN', department: 'Clinical', designation: 'Medical Officer', status: 'Active', phone: '0711223344', email: 'john.doe@med.com', dateEmployed: '2020-01-15', idNo: '23456789' },
    { id: '2', staffNo: 'EMP-002', surname: 'SMITH', othernames: 'JANE', department: 'Nursing', designation: 'Head Nurse', status: 'On Leave', phone: '0722334455', email: 'jane.smith@med.com', dateEmployed: '2019-05-10', idNo: '34567890' },
    { id: '3', staffNo: 'EMP-003', surname: 'KAMAU', othernames: 'PETER', department: 'Administration', designation: 'Accountant', status: 'Active', phone: '0733445566', email: 'p.kamau@med.com', dateEmployed: '2021-08-01', idNo: '12345678' },
    { id: '4', staffNo: 'EMP-004', surname: 'OTIENO', othernames: 'GRACE', department: 'Pharmacy', designation: 'Pharmacist', status: 'Terminated', phone: '0744556677', email: 'g.otieno@med.com', dateEmployed: '2022-02-01', idNo: '98765432' },
  ]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
      e.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.othernames.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.staffNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const selectedEmployee = employees.find(e => e.id === selectedId) || employees[0];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Terminated': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="animate-bottom space-y-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
               <h3 className="text-2xl font-black text-gray-800">{employees.length}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><i className="fa fa-users"></i></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</p>
               <h3 className="text-2xl font-black text-green-600">{employees.filter(e => e.status === 'Active').length}</h3>
            </div>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><i className="fa fa-user-check"></i></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">On Leave</p>
               <h3 className="text-2xl font-black text-orange-500">{employees.filter(e => e.status === 'On Leave').length}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center"><i className="fa fa-plane-departure"></i></div>
         </div>
         <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center hover:bg-blue-700 transition">
            <i className="fa fa-plus-circle text-2xl mb-1"></i>
            <span className="text-xs font-black uppercase tracking-widest">New Employee</span>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
         
         {/* Left: Employee List */}
         <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
               <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Staff Directory</h5>
               <div className="relative">
                  <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input 
                     type="text" 
                     placeholder="Search name, staff no..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
               {filteredEmployees.map(emp => (
                  <div 
                     key={emp.id}
                     onClick={() => setSelectedId(emp.id)}
                     className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 group ${
                        selectedEmployee?.id === emp.id 
                        ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                     }`}
                  >
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {emp.surname.charAt(0)}{emp.othernames.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                           <h6 className="text-xs font-black text-gray-800 uppercase truncate">{emp.surname}, {emp.othernames}</h6>
                           {selectedEmployee?.id === emp.id && <i className="fa fa-chevron-right text-blue-500 text-[10px]"></i>}
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{emp.designation}</p>
                        <div className="flex justify-between items-center mt-1">
                           <span className="text-[9px] font-mono text-gray-400">{emp.staffNo}</span>
                           <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black border ${getStatusColor(emp.status)}`}>{emp.status}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Detailed Profile */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            {selectedEmployee ? (
               <>
                  <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                     <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                           {selectedEmployee.surname.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tight">{selectedEmployee.surname} {selectedEmployee.othernames}</h4>
                           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                              {selectedEmployee.designation} • {selectedEmployee.department}
                           </p>
                           <div className="flex items-center space-x-4 mt-2 text-[10px] text-gray-600 font-medium">
                              <span className="flex items-center"><i className="fa fa-id-badge mr-1 text-gray-400"></i> {selectedEmployee.staffNo}</span>
                              <span className="flex items-center"><i className="fa fa-envelope mr-1 text-gray-400"></i> {selectedEmployee.email}</span>
                              <span className="flex items-center"><i className="fa fa-phone mr-1 text-gray-400"></i> {selectedEmployee.phone}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded text-[10px] font-black uppercase border ${getStatusColor(selectedEmployee.status)}`}>{selectedEmployee.status}</span>
                        <button className="text-blue-600 text-[10px] font-bold hover:underline uppercase"><i className="fa fa-edit mr-1"></i> Edit Profile</button>
                     </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 px-6 bg-white sticky top-0 z-10">
                     <button onClick={() => setActiveTab('details')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Basic Details</button>
                     <button onClick={() => setActiveTab('financial')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'financial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Payroll & Banking</button>
                     <button onClick={() => setActiveTab('nok')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'nok' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Next of Kin</button>
                  </div>

                  <div className="p-8 flex-1 overflow-y-auto bg-white">
                     {activeTab === 'details' && (
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Personal Info</h6>
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                                    <input type="date" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" defaultValue="1990-01-01" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Gender</label>
                                    <select className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50"><option>Male</option><option>Female</option></select>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ID Number</label>
                                    <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" defaultValue={selectedEmployee.idNo} />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Marital Status</label>
                                    <select className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50"><option>Single</option><option>Married</option></select>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Employment Info</h6>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date Employed</label>
                                 <input type="date" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" defaultValue={selectedEmployee.dateEmployed} />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Employment Type</label>
                                 <select className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50"><option>Permanent</option><option>Contract</option><option>Casual</option></select>
                              </div>
                           </div>
                           <div className="col-span-2 space-y-4">
                              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Address</h6>
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Postal Address</label>
                                    <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Physical Location</label>
                                    <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'financial' && (
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Bank Details</h6>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bank Name</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50" />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Account Number</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50 font-mono" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Statutory Details</h6>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">KRA PIN</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50 font-mono" />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">NHIF Number</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50 font-mono" />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">NSSF Number</label>
                                 <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs bg-gray-50 font-mono" />
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <i className="fa fa-user-tie text-6xl mb-4 opacity-20"></i>
                  <p className="text-sm font-bold uppercase tracking-widest">Select an employee to view details</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Employees;
