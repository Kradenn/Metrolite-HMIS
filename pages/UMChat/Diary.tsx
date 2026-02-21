import React, { useState } from 'react';

interface DiaryEvent {
   id: number;
   date: string; // YYYY-MM-DD
   title: string;
   type: 'Consultation' | 'Meeting' | 'Personal' | 'Surgery';
   time: string;
}

const Diary: React.FC = () => {
  const [activeStaff, setActiveStaff] = useState('My');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'Consultation' });
  
  // Mock Events
  const [events, setEvents] = useState<DiaryEvent[]>([
     { id: 1, date: '2023-10-24', title: 'Consultation: Jane Doe', type: 'Consultation', time: '10:00' },
     { id: 2, date: '2023-10-24', title: 'Follow-up: John Smith', type: 'Consultation', time: '14:30' },
     { id: 3, date: '2023-10-25', title: 'Dept Meeting', type: 'Meeting', time: '09:00' },
  ]);

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
     const year = date.getFullYear();
     const month = date.getMonth();
     const daysInMonth = new Date(year, month + 1, 0).getDate();
     const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
     
     // Adjust for Monday start if needed, currently Sunday start (0)
     // Let's assume Monday start (1) for business calendar usually
     const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

     const days = [];
     // Previous month filler
     for(let i=0; i < startDay; i++) days.push(null);
     // Current month
     for(let i=1; i <= daysInMonth; i++) days.push(i);
     return days;
  };

  const days = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
     setSelectedDay(day);
     setShowAddModal(true);
     setNewEvent({ title: '', time: '08:00', type: 'Consultation' });
  };

  const handleAddEvent = (e: React.FormEvent) => {
     e.preventDefault();
     if(selectedDay) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        const newEv: DiaryEvent = {
           id: Date.now(),
           date: dateStr,
           title: newEvent.title,
           time: newEvent.time,
           type: newEvent.type as any
        };
        setEvents([...events, newEv]);
        setShowAddModal(false);
     }
  };

  const getTypeColor = (type: string) => {
     switch(type) {
        case 'Consultation': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Meeting': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Surgery': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
     }
  };

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <h6 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">
            <span className="text-blue-600">{activeStaff}</span> - Schedule
          </h6>
          <div className="flex items-center space-x-2">
             <select 
               className="bg-white border border-gray-300 rounded text-[10px] font-bold p-1 outline-none"
               onChange={(e) => setActiveStaff(e.target.value)}
             >
                <option value="My">My Diary</option>
                <option value="Dr. Wilson">Dr. Wilson</option>
                <option value="Nurse Kennedy">Nurse Kennedy</option>
             </select>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-100 overflow-hidden flex flex-col">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
               <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                     {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-1">
                     <button onClick={handlePrevMonth} className="p-1 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded transition"><i className="fa fa-chevron-left text-xs"></i></button>
                     <button onClick={handleNextMonth} className="p-1 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded transition"><i className="fa fa-chevron-right text-xs"></i></button>
                  </div>
                  <button onClick={() => setCurrentDate(new Date())} className="bg-white border border-gray-300 px-3 py-1 rounded text-[10px] font-black uppercase shadow-sm hover:bg-gray-50">Today</button>
               </div>
               <div className="flex space-x-1">
                  {['Month', 'Week', 'Day'].map(view => (
                    <button key={view} className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-tighter transition-all ${view === 'Month' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{view}</button>
                  ))}
               </div>
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] overflow-hidden">
               {/* Days Header */}
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                 <div key={day} className="p-2 bg-gray-50 border-r border-b border-gray-100 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
               ))}
               
               {/* Calendar Body */}
               <div className="col-span-7 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                  {days.map((d, i) => {
                     const dateKey = d ? `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : '';
                     const dayEvents = d ? events.filter(e => e.date === dateKey) : [];
                     const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                     return (
                       <div 
                           key={i} 
                           onClick={() => d && handleDayClick(d)}
                           className={`min-h-[100px] p-2 border-r border-b border-gray-100 group transition-colors hover:bg-blue-50/20 relative cursor-pointer ${!d ? 'bg-gray-50/30' : 'bg-white'}`}
                       >
                          {d && (
                             <>
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'}`}>
                                   {d}
                                </span>
                                <div className="mt-1 space-y-1">
                                   {dayEvents.map(ev => (
                                      <div key={ev.id} className={`text-[9px] p-1 rounded font-bold border-l-2 truncate ${getTypeColor(ev.type)}`}>
                                         {ev.time} {ev.title}
                                      </div>
                                   ))}
                                </div>
                                <button className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-600 transition"><i className="fa fa-plus-circle"></i></button>
                             </>
                          )}
                       </div>
                     );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                 Add Event: {selectedDay}/{currentDate.getMonth()+1}
              </h5>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
            </div>
            <div className="p-6">
               <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Event Type</label>
                     <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none"
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                     >
                        <option>Consultation</option>
                        <option>Meeting</option>
                        <option>Surgery</option>
                        <option>Personal</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Time</label>
                     <input 
                        type="time" 
                        className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Title / Patient</label>
                     <input 
                        type="text" 
                        className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. John Doe - Checkup"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        required
                     />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Save Event</button>
               </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
