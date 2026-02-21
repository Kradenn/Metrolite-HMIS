
import React, { useState, useMemo, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';

// Types
interface Appointment {
  id: number;
  bookingNo: string; // Separated Booking Number
  opNo: string;      // Outpatient Number
  ipNo: string;      // Inpatient Number
  patientName: string;
  doctor: string;
  dateTime: Date;
  purpose: string;
  status: 'Scheduled' | 'Checked-In' | 'Seen' | 'Cancelled' | 'No-Show';
  notes: string;
}

const Appointments: React.FC = () => {
  const { activePatient } = usePatient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedApptId, setSelectedApptId] = useState<number | null>(null);
  
  // Mock User Role for Demonstration
  const [isAdmin, setIsAdmin] = useState(true); 

  // Reschedule State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Booking Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [newApptForm, setNewApptForm] = useState({
      patientName: '',
      bookingNo: '',
      opNo: '',
      ipNo: '',
      doctor: '',
      date: '',
      time: '',
      purpose: '',
      notes: ''
  });

  // Mock data generator
  const [appointments, setAppointments] = useState<Appointment[]>([
      { id: 1, bookingNo: 'BK-20231024-001', opNo: 'OP-2023-001', ipNo: 'IP-2023-9001', patientName: 'JANE DOE', doctor: 'Dr. James Wilson', dateTime: new Date(new Date().setHours(9, 0, 0, 0)), purpose: 'General Checkup', status: 'Scheduled', notes: '' },
      { id: 2, bookingNo: 'BK-20231024-002', opNo: 'OP-2023-042', ipNo: 'IP-2023-9002', patientName: 'JOHN SMITH', doctor: 'Dr. Sarah Jane', dateTime: new Date(new Date().setHours(10, 30, 0, 0)), purpose: 'Cardiology Review', status: 'Checked-In', notes: 'BP history needed' },
      { id: 3, bookingNo: 'BK-20231024-003', opNo: 'OP-2023-088', ipNo: 'IP-2023-9003', patientName: 'ALICE WONG', doctor: 'Dr. James Wilson', dateTime: new Date(new Date().setHours(11, 0, 0, 0)), purpose: 'Lab Results', status: 'Seen', notes: 'Prescription renewed' },
      { id: 4, bookingNo: 'BK-20231024-004', opNo: 'OP-2023-102', ipNo: 'IP-2023-9004', patientName: 'PETER PAN', doctor: 'Dr. Sarah Jane', dateTime: new Date(new Date().setHours(14, 0, 0, 0)), purpose: 'Consultation', status: 'Cancelled', notes: 'Patient called to cancel' },
  ]);

  // Helper: Sequential ID Generator
  const generateNextId = (prefix: string) => {
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      // Find max sequence for today to increment
      const count = appointments.length + 1; 
      const seq = count.toString().padStart(3, '0');
      return `${prefix}-${dateStr}-${seq}`;
  };

  const generateOpNumber = () => {
       const year = new Date().getFullYear();
       const count = Math.floor(Math.random() * 1000) + 100; // Mock sequence
       return `OP-${year}-${count}`;
  };

  // Derived Data
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app =>
      app.dateTime.getFullYear() === selectedDate.getFullYear() &&
      app.dateTime.getMonth() === selectedDate.getMonth() &&
      app.dateTime.getDate() === selectedDate.getDate()
    ).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [selectedDate, appointments]);

  const selectedAppointment = useMemo(() => 
    appointments.find(a => a.id === selectedApptId), 
  [selectedApptId, appointments]);

  const appointmentDates = useMemo(() => {
    const dates = new Set();
    appointments.forEach(app => {
        if (app.dateTime.getFullYear() === currentDate.getFullYear() && app.dateTime.getMonth() === currentDate.getMonth()) {
            dates.add(app.dateTime.getDate());
        }
    });
    return dates;
  }, [appointments, currentDate]);

  // Calendar Logic
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, isCurrentMonth: true });
    return days;
  }, [currentDate]);

  // Actions
  const handleStatusChange = (status: Appointment['status']) => {
    if (selectedApptId) {
        // Admin check for Cancellation
        if (status === 'Cancelled' && !isAdmin) {
            alert("ACCESS DENIED: Only Administrators can cancel or delete bookings.");
            return;
        }
        setAppointments(prev => prev.map(a => a.id === selectedApptId ? { ...a, status } : a));
    }
  };

  const handleReschedule = () => {
      if (selectedApptId && rescheduleDate) {
          const newDate = new Date(rescheduleDate);
          setAppointments(prev => prev.map(a => a.id === selectedApptId ? { ...a, dateTime: newDate, status: 'Scheduled' } : a));
          setIsRescheduling(false);
          setSelectedDate(newDate); // Jump to new date
      }
  };

  const openBookModal = (prefillData?: Partial<typeof newApptForm>) => {
      // Sequence Logic: Booking and IP always new sequence. OP is persistent.
      const nextBookingNo = generateNextId('BK');
      const nextIpNo = generateNextId('IP');
      
      // Determine OP Number
      let opToUse = '';
      if (prefillData?.opNo) {
          opToUse = prefillData.opNo; // Use provided (Follow up)
      } else if (activePatient) {
          opToUse = activePatient.outpatientNo; // Use active context
      } else {
          opToUse = generateOpNumber(); // New patient = New OP
      }

      if (prefillData) {
          setNewApptForm({
              patientName: prefillData.patientName || '',
              bookingNo: nextBookingNo, 
              opNo: opToUse,
              ipNo: nextIpNo,
              doctor: prefillData.doctor || '',
              date: '',
              time: '',
              purpose: 'Follow-up',
              notes: ''
          });
      } else {
          // Reset form for brand new
          setNewApptForm({
              patientName: activePatient ? `${activePatient.surname} ${activePatient.othernames}` : '',
              bookingNo: nextBookingNo,
              opNo: opToUse,
              ipNo: nextIpNo,
              doctor: '',
              date: new Date().toISOString().split('T')[0],
              time: '09:00',
              purpose: 'Consultation',
              notes: ''
          });
      }
      setShowBookModal(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
      e.preventDefault();
      const newId = Math.max(...appointments.map(a => a.id)) + 1;
      const dateTime = new Date(`${newApptForm.date}T${newApptForm.time}`);
      
      const newAppt: Appointment = {
          id: newId,
          bookingNo: newApptForm.bookingNo,
          opNo: newApptForm.opNo,
          ipNo: newApptForm.ipNo,
          patientName: newApptForm.patientName,
          doctor: newApptForm.doctor,
          dateTime: dateTime,
          purpose: newApptForm.purpose,
          status: 'Scheduled',
          notes: newApptForm.notes
      };

      setAppointments([...appointments, newAppt]);
      setShowBookModal(false);
      setSelectedDate(dateTime); // Jump to that day
  };

  const handleDelete = () => {
      if(!isAdmin) {
          alert("ACCESS DENIED: Only Administrators can delete records.");
          return;
      }
      if(confirm("Admin Action: Are you sure you want to permanently delete this booking?")) {
          setAppointments(prev => prev.filter(a => a.id !== selectedApptId));
          setSelectedApptId(null);
      }
  }

  const monthYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();

  // Helper styles
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Checked-In': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'Seen': return 'bg-green-100 text-green-700 border-green-200';
          case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-600 border-gray-200';
      }
  };

  return (
    <div className="animate-bottom h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Appointment Scheduler</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Manage Bookings & Patient Flow</p>
          </div>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Admin Mode:</span>
                <button 
                    onClick={() => setIsAdmin(!isAdmin)} 
                    className={`w-8 h-4 rounded-full transition-colors relative ${isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isAdmin ? 'left-4.5' : 'left-0.5'}`}></div>
                </button>
             </div>
             <button onClick={() => openBookModal()} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition flex items-center">
                <i className="fa fa-plus mr-2"></i> Book New
             </button>
          </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden">
          
          {/* LEFT: Calendar Navigation */}
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="text-gray-500 hover:text-blue-600"><i className="fa fa-chevron-left"></i></button>
                  <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">{monthYearFormat.format(currentDate)}</h6>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="text-gray-500 hover:text-blue-600"><i className="fa fa-chevron-right"></i></button>
              </div>
              
              <div className="p-4">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                      {calendarGrid.map((dayInfo, i) => {
                          const isToday = dayInfo.isCurrentMonth && dayInfo.day === today.getDate() && currentDate.getMonth() === today.getMonth();
                          const isSelected = dayInfo.isCurrentMonth && dayInfo.day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();
                          const hasAppt = dayInfo.isCurrentMonth && appointmentDates.has(dayInfo.day);

                          return (
                              <div key={i} 
                                  onClick={() => dayInfo.day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayInfo.day))}
                                  className={`
                                      h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold cursor-pointer transition-all relative
                                      ${!dayInfo.isCurrentMonth ? 'invisible' : ''}
                                      ${isSelected ? 'bg-blue-600 text-white shadow-md scale-110' : 'text-gray-800 hover:bg-gray-100'}
                                      ${isToday && !isSelected ? 'border border-blue-600 text-blue-600' : ''}
                                  `}
                              >
                                  {dayInfo.day}
                                  {hasAppt && !isSelected && <div className="absolute bottom-0.5 w-1 h-1 bg-green-500 rounded-full"></div>}
                              </div>
                          );
                      })}
                  </div>
              </div>

              <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100">
                  <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Filters</h6>
                  <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600"><span>My Appointments</span> <span className="bg-blue-100 text-blue-700 px-1.5 rounded text-[9px]">12</span></div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600"><span>Checked In</span> <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[9px]">4</span></div>
                  </div>
              </div>
          </div>

          {/* MIDDLE: Appointment List */}
          <div className="md:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">
                      {selectedDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long'})}
                  </h6>
                  <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{filteredAppointments.length} Bookings</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                  {filteredAppointments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                          <i className="fa fa-calendar-times text-4xl mb-2 opacity-20"></i>
                          <p className="text-xs font-bold uppercase tracking-widest">No appointments</p>
                      </div>
                  ) : (
                      filteredAppointments.map(app => (
                          <div 
                              key={app.id} 
                              onClick={() => { setSelectedApptId(app.id); setIsRescheduling(false); }}
                              className={`
                                  p-3 rounded-lg border cursor-pointer transition-all group relative
                                  ${selectedApptId === app.id ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}
                                  ${app.status === 'Cancelled' ? 'opacity-70 grayscale-[0.5]' : ''}
                              `}
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-black text-gray-800 uppercase">{app.patientName}</span>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${getStatusColor(app.status)}`}>{app.status}</span>
                              </div>
                              <div className="flex justify-between items-end">
                                  <div className="text-[10px] text-gray-500 font-bold uppercase">
                                      <p>{app.dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                      <p className="text-blue-600 mt-0.5">{app.doctor}</p>
                                  </div>
                                  <div className="text-[9px] text-gray-400 text-right">
                                    <p>BK: {app.bookingNo}</p>
                                    <p>OP: {app.opNo}</p>
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* RIGHT: Inspector / Detail Pane */}
          <div className="md:col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
              {selectedAppointment ? (
                  <>
                      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                          <div>
                              <h5 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedAppointment.patientName}</h5>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                <span className="text-blue-600">{selectedAppointment.bookingNo}</span>
                              </p>
                          </div>
                          <div className="text-right">
                              <p className="text-2xl font-black text-blue-600">{selectedAppointment.dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">{selectedAppointment.dateTime.toDateString()}</p>
                          </div>
                      </div>

                      <div className="p-6 flex-1 overflow-y-auto">
                          {/* Auto-Generated Numbers Card */}
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-6">
                             <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">System Identifiers</h6>
                             <div className="grid grid-cols-3 gap-2 text-[10px]">
                                <div>
                                   <span className="block font-bold text-gray-500">Booking No</span>
                                   <span className="block font-black text-gray-800">{selectedAppointment.bookingNo}</span>
                                </div>
                                <div>
                                   <span className="block font-bold text-gray-500">Outpatient No</span>
                                   <span className="block font-black text-gray-800">{selectedAppointment.opNo}</span>
                                </div>
                                <div>
                                   <span className="block font-bold text-gray-500">Inpatient No</span>
                                   <span className="block font-black text-gray-800">{selectedAppointment.ipNo}</span>
                                </div>
                             </div>
                          </div>

                          {/* Main Details */}
                          <div className="grid grid-cols-2 gap-6 mb-6">
                              <div>
                                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctor</label>
                                  <p className="text-xs font-bold text-gray-800">{selectedAppointment.doctor}</p>
                              </div>
                              <div>
                                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Purpose</label>
                                  <p className="text-xs font-bold text-gray-800">{selectedAppointment.purpose}</p>
                              </div>
                              <div className="col-span-2">
                                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Clinical Notes / Reason</label>
                                  <p className="text-xs font-medium text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                                      {selectedAppointment.notes || 'No notes provided.'}
                                  </p>
                              </div>
                          </div>

                          {/* Action Area */}
                          <div className="space-y-4 border-t border-gray-100 pt-6">
                              <div className="flex items-center justify-between">
                                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Update Status</label>
                                  <select 
                                      value={selectedAppointment.status}
                                      onChange={(e) => handleStatusChange(e.target.value as any)}
                                      className="text-xs font-bold border border-gray-300 rounded px-2 py-1 outline-none bg-white focus:ring-1 focus:ring-blue-500"
                                  >
                                      <option value="Scheduled">Scheduled</option>
                                      <option value="Checked-In">Checked In</option>
                                      <option value="Seen">Seen / Completed</option>
                                      <option value="Cancelled">Cancelled</option>
                                      <option value="No-Show">No Show</option>
                                  </select>
                              </div>

                              {isRescheduling ? (
                                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                                      <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Reschedule Appointment</h6>
                                      <input 
                                          type="datetime-local" 
                                          className="w-full p-2 text-xs border border-orange-200 rounded mb-2 bg-white outline-none"
                                          onChange={(e) => setRescheduleDate(e.target.value)}
                                      />
                                      <div className="flex justify-end space-x-2">
                                          <button onClick={() => setIsRescheduling(false)} className="px-3 py-1 bg-white text-gray-600 border border-gray-200 rounded text-[10px] font-bold uppercase hover:bg-gray-50">Cancel</button>
                                          <button onClick={handleReschedule} className="px-3 py-1 bg-orange-500 text-white rounded text-[10px] font-bold uppercase hover:bg-orange-600 shadow-sm">Confirm Change</button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="grid grid-cols-2 gap-3">
                                      <button 
                                        onClick={() => setIsRescheduling(true)}
                                        className="py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                                      >
                                          <i className="fa fa-clock mr-2"></i> Reschedule
                                      </button>
                                      <button 
                                        onClick={handleDelete}
                                        className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition ${
                                            isAdmin 
                                            ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100' 
                                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                      >
                                          <i className="fa fa-ban mr-2"></i> Delete {isAdmin ? '' : '(Admin)'}
                                      </button>
                                  </div>
                              )}

                              {/* Next Appointment Shortcut */}
                              <div className="pt-4 mt-2 border-t border-gray-100 text-center">
                                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Follow-up needed?</p>
                                  <button 
                                    onClick={() => openBookModal({ 
                                        patientName: selectedAppointment.patientName, 
                                        opNo: selectedAppointment.opNo,
                                        doctor: selectedAppointment.doctor
                                    })}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700"
                                  >
                                      Book Next Appointment
                                  </button>
                              </div>
                          </div>
                      </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                      <i className="fa fa-mouse-pointer text-5xl mb-4 opacity-20"></i>
                      <p className="text-sm font-black uppercase tracking-widest">Select an Appointment</p>
                      <p className="text-xs font-medium mt-1">Click on a booking from the list to manage details, reschedule, or cancel.</p>
                  </div>
              )}
          </div>
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                 <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Book Appointment</h5>
                 <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
              </div>
              <form onSubmit={handleSaveBooking} className="p-6 space-y-4 overflow-y-auto">
                 
                 {/* Auto-Generated System IDs */}
                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                     <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">System Generated Identifiers (Read Only)</h6>
                     <div className="grid grid-cols-3 gap-3">
                        <div>
                           <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Booking No</label>
                           <input type="text" readOnly value={newApptForm.bookingNo} className="w-full p-1.5 bg-gray-200 border border-gray-300 rounded text-[10px] font-mono text-gray-700 select-none cursor-not-allowed" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Outpatient No</label>
                           <input type="text" readOnly value={newApptForm.opNo} className="w-full p-1.5 bg-gray-200 border border-gray-300 rounded text-[10px] font-mono text-gray-700 select-none cursor-not-allowed" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Inpatient No</label>
                           <input type="text" readOnly value={newApptForm.ipNo} className="w-full p-1.5 bg-gray-200 border border-gray-300 rounded text-[10px] font-mono text-gray-700 select-none cursor-not-allowed" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Patient Name</label>
                       <input 
                          type="text" required 
                          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                          value={newApptForm.patientName}
                          onChange={e => setNewApptForm({...newApptForm, patientName: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Date</label>
                       <input 
                          type="date" required 
                          className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                          value={newApptForm.date}
                          onChange={e => setNewApptForm({...newApptForm, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Time</label>
                       <input 
                          type="time" required 
                          className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                          value={newApptForm.time}
                          onChange={e => setNewApptForm({...newApptForm, time: e.target.value})}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Doctor / Consultant</label>
                    <select 
                       className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                       value={newApptForm.doctor}
                       onChange={e => setNewApptForm({...newApptForm, doctor: e.target.value})}
                       required
                    >
                       <option value="">Select Doctor...</option>
                       <option value="Dr. James Wilson">Dr. James Wilson</option>
                       <option value="Dr. Sarah Jane">Dr. Sarah Jane</option>
                       <option value="Nurse Kennedy">Nurse Kennedy</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Purpose</label>
                    <input 
                       type="text" 
                       className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                       value={newApptForm.purpose}
                       onChange={e => setNewApptForm({...newApptForm, purpose: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Notes</label>
                    <textarea 
                       className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                       value={newApptForm.notes}
                       onChange={e => setNewApptForm({...newApptForm, notes: e.target.value})}
                    ></textarea>
                 </div>
                 <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                    <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-600 uppercase hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700">Confirm Booking</button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;
