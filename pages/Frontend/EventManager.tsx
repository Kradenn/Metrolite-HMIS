
import React, { useState } from 'react';

interface HospitalEvent {
    id: number;
    title: string;
    type: string;
    date: string;
    location: string;
    registrations: number;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Draft';
}

const EventManager: React.FC = () => {
    const [events, setEvents] = useState<HospitalEvent[]>([
        { id: 1, title: 'Annual Free Health Camp', type: 'Health Camp', date: '2023-11-15', location: 'Main Grounds', registrations: 450, status: 'Upcoming' },
        { id: 2, title: 'Cardiac Care Webinar', type: 'Webinar', date: '2023-10-28', location: 'Online', registrations: 120, status: 'Upcoming' },
    ]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Simple form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const newEv: HospitalEvent = {
            id: Date.now(),
            title,
            type: 'General',
            date,
            location: 'TBD',
            registrations: 0,
            status: 'Upcoming'
        };
        setEvents([newEv, ...events]);
        setIsCreating(false);
        setTitle('');
    };

    return (
        <div className="animate-bottom space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-calendar-star"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Public Events Registry</h2>
                        <p className="text-xs text-gray-500 font-medium">Coordinate outreach and webinars.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition"
                >
                    <i className="fa fa-calendar-plus mr-2"></i> Register New Event
                </button>
            </div>

            {isCreating ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm animate-in zoom-in-95 duration-200 max-w-2xl mx-auto">
                    <h3 className="text-lg font-black text-gray-800 uppercase mb-8 border-b pb-4">New Event Details</h3>
                    <form onSubmit={handleCreateEvent} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Event Title</label>
                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Date</label>
                            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-xs font-black uppercase">Schedule</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-50 text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-center">RSVPs</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {events.map(event => (
                                <tr key={event.id} className="hover:bg-indigo-50/20 transition-colors">
                                    <td className="px-6 py-4 font-black text-gray-800 uppercase">{event.title}</td>
                                    <td className="px-6 py-4">{event.date}</td>
                                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{event.registrations}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border bg-blue-50 text-blue-700">{event.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-red-500" onClick={() => setEvents(events.filter(e => e.id !== event.id))}><i className="fa fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventManager;
