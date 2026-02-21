
import React, { useState } from 'react';
import { Link } from 'react-router';
import { useUser } from '../../context/UserContext';

const PortalHome: React.FC = () => {
  const { user } = useUser();
  const [showWellnessTip, setShowWellnessTip] = useState(true);

  // Mock Data for Dashboard Visualization
  const nextAppointment = {
    date: '26 Oct 2023',
    time: '10:00 AM',
    doctor: 'Dr. James Wilson',
    department: 'Cardiology',
    type: 'Follow-up'
  };

  const vitals = {
    bp: '120/80',
    weight: '72 kg',
    bmi: '24.5',
    lastChecked: '24 Oct 2023'
  };

  const recentActivity = [
    { id: 1, icon: 'fa-file-invoice-dollar', color: 'text-orange-500', title: 'Invoice Generated', desc: 'Consultation fee posted', time: '2 hours ago' },
    { id: 2, icon: 'fa-flask', color: 'text-purple-500', title: 'Lab Results Ready', desc: 'Full Haemogram available', time: 'Yesterday' },
    { id: 3, icon: 'fa-pills', color: 'text-green-500', title: 'Prescription Filled', desc: 'Amoxicillin dispensed', time: '2 days ago' },
  ];

  const portalModules = [
    { title: 'Appointments', path: '/portal/appointments', icon: 'fa-calendar-check', color: 'bg-blue-500', desc: 'Book & Manage Visits' },
    { title: 'My Bills', path: '/portal/bills', icon: 'fa-file-invoice-dollar', color: 'bg-amber-500', desc: 'Pay Outstanding Balances' },
    { title: 'Prescriptions', path: '/portal/prescriptions', icon: 'fa-pills', color: 'bg-emerald-500', desc: 'Active Medications' },
    { title: 'Lab Results', path: '/portal/tests', icon: 'fa-microscope', color: 'bg-purple-600', desc: 'Pathology Reports' },
    { title: 'Telehealth', path: '/portal/telehealth', icon: 'fa-video', color: 'bg-rose-500', desc: 'Virtual Consultations' },
    { title: 'Secure Chat', path: '/portal/chat', icon: 'fa-comments', color: 'bg-indigo-600', desc: 'Message Care Team' },
  ];

  // HR Modules (Only show if employee)
  const staffModules = [
    { title: 'Payslips', path: '/portal/payslips', icon: 'fa-file-contract' },
    { title: 'Leave Request', path: '/portal/leaves', icon: 'fa-plane-departure' },
    { title: 'Salary Advance', path: '/portal/advances', icon: 'fa-hand-holding-usd' },
  ];

  return (
    <div className="animate-bottom space-y-8 pb-10">
      
      {/* 1. Welcome Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-black border-2 border-white/20 shadow-inner">
               {user.name.charAt(0)}
            </div>
            <div>
               <p className="text-blue-300 font-bold uppercase tracking-widest text-xs mb-1">Patient Portal</p>
               <h1 className="text-3xl font-black tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
               <p className="text-slate-400 text-sm mt-1 font-medium">Member ID: <span className="text-white font-mono">{user.id}</span></p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 backdrop-blur-sm min-w-[280px]">
             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                <i className="fa fa-calendar-day"></i>
             </div>
             <div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Next Appointment</p>
                <h4 className="text-lg font-bold">{nextAppointment.date}</h4>
                <p className="text-[10px] text-slate-300">{nextAppointment.time} with {nextAppointment.doctor}</p>
             </div>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* 2. Main Navigation Grid */}
         <div className="lg:col-span-2 space-y-8">
            <div>
               <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Health Services</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portalModules.map((mod, idx) => (
                    <Link 
                      key={idx} 
                      to={mod.path}
                      className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center text-center relative overflow-hidden"
                    >
                       <div className={`w-12 h-12 ${mod.color} text-white rounded-xl flex items-center justify-center text-xl shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                          <i className={`fa ${mod.icon}`}></i>
                       </div>
                       <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{mod.title}</h4>
                       <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">{mod.desc}</p>
                    </Link>
                  ))}
               </div>
            </div>

            {/* HR / Staff Section (Conditional) */}
            <div>
               <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Staff Zone</h3>
               <div className="grid grid-cols-3 gap-4">
                  {staffModules.map((mod, idx) => (
                    <Link 
                      key={idx} 
                      to={mod.path}
                      className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-xl hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                       <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
                          <i className={`fa ${mod.icon}`}></i>
                       </div>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight group-hover:text-blue-700">{mod.title}</span>
                    </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* 3. Sidebar Widgets */}
         <div className="space-y-6">
            
            {/* Vitals Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Health Snapshot</h3>
                  <span className="text-[9px] font-bold text-slate-400">{vitals.lastChecked}</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
                     <p className="text-[9px] font-black text-red-400 uppercase tracking-wider">Blood Pressure</p>
                     <p className="text-xl font-black text-red-700 mt-1">{vitals.bp}</p>
                     <p className="text-[8px] font-bold text-red-300 uppercase">mmHg</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                     <p className="text-[9px] font-black text-blue-400 uppercase tracking-wider">Weight</p>
                     <p className="text-xl font-black text-blue-700 mt-1">{vitals.weight}</p>
                     <p className="text-[8px] font-bold text-blue-300 uppercase">BMI: {vitals.bmi}</p>
                  </div>
               </div>
               <Link to="/portal/appointments" className="block w-full text-center mt-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition">
                  Book Check-up
               </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
               <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4">Timeline</h3>
               <div className="space-y-4">
                  {recentActivity.map((act) => (
                     <div key={act.id} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className={`mt-0.5 w-2 h-2 rounded-full ${act.color.replace('text-', 'bg-')}`}></div>
                        <div className="flex-1">
                           <p className="text-[11px] font-bold text-slate-800">{act.title}</p>
                           <p className="text-[10px] text-slate-500">{act.desc}</p>
                           <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">{act.time}</p>
                        </div>
                        <i className={`fa ${act.icon} text-xs ${act.color} opacity-50`}></i>
                     </div>
                  ))}
               </div>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 w-full text-center hover:underline">View All History</button>
            </div>

            {/* Wellness Tip */}
            {showWellnessTip && (
               <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden">
                  <button onClick={() => setShowWellnessTip(false)} className="absolute top-3 right-3 text-emerald-300 hover:text-emerald-600"><i className="fa fa-times"></i></button>
                  <div className="flex items-center space-x-2 mb-2 text-emerald-700">
                     <i className="fa fa-leaf"></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">Wellness Tip</span>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-800 leading-relaxed">
                     Did you know? Staying hydrated helps maintain energy levels and brain function. Aim for 8 glasses of water today!
                  </p>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default PortalHome;
