import React, { useState, useMemo } from 'react';

interface Contact {
  id: number;
  name: string;
  phone: string;
  type: 'Patient' | 'Staff';
  gender: string;
}

interface SmsMessage {
  id: number;
  date: string;
  recipients: number;
  content: string;
  status: 'Sent' | 'Failed';
}

const Sms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set());
  
  const [contacts] = useState<Contact[]>([
     { id: 1, name: 'Jane Doe', phone: '254700000000', type: 'Patient', gender: 'F' },
     { id: 2, name: 'John Smith', phone: '254711111111', type: 'Patient', gender: 'M' },
     { id: 3, name: 'Dr. Wilson', phone: '254722222222', type: 'Staff', gender: 'M' },
     { id: 4, name: 'Nurse Kennedy', phone: '254733333333', type: 'Staff', gender: 'F' },
  ]);

  const [history, setHistory] = useState<SmsMessage[]>([
     { id: 101, date: '2023-10-20 10:30', recipients: 1, content: 'Your appointment is confirmed.', status: 'Sent' },
     { id: 102, date: '2023-10-22 14:15', recipients: 25, content: 'Health Camp this Saturday!', status: 'Sent' },
  ]);

  const templates = [
     { title: 'Appt Reminder', text: 'Dear [Name], reminder for your appointment tomorrow at [Time].' },
     { title: 'Results Ready', text: 'Dear [Name], your lab results are ready for collection.' },
     { title: 'Payment Rec', text: 'We have received your payment of KES [Amount]. Thank you.' },
  ];

  const filteredContacts = useMemo(() => {
     return contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
     );
  }, [contacts, searchQuery]);

  const charCount = message.length;
  const smsUnits = Math.ceil(charCount / 160) || 1;

  const toggleContact = (id: number) => {
     const newSet = new Set(selectedContactIds);
     if (newSet.has(id)) newSet.delete(id);
     else newSet.add(id);
     setSelectedContactIds(newSet);
  };

  const toggleSelectAll = () => {
     if (selectedContactIds.size === filteredContacts.length) {
        setSelectedContactIds(new Set());
     } else {
        const newSet = new Set(filteredContacts.map(c => c.id));
        setSelectedContactIds(newSet);
     }
  };

  const insertTemplate = (text: string) => {
     setMessage(prev => prev + (prev ? ' ' : '') + text);
  };

  const handleSend = (e: React.FormEvent) => {
     e.preventDefault();
     if (selectedContactIds.size === 0) {
        alert("Please select at least one recipient.");
        return;
     }
     if (!message.trim()) {
        alert("Message cannot be empty.");
        return;
     }

     const newMessage: SmsMessage = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        recipients: selectedContactIds.size,
        content: message,
        status: 'Sent'
     };

     setHistory([newMessage, ...history]);
     setMessage('');
     setSelectedContactIds(new Set());
     alert(`Message sent to ${selectedContactIds.size} recipients.`);
  };

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        <div className="flex border-b border-gray-100 bg-gray-50">
           <button 
              onClick={() => setActiveTab('compose')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'compose' ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
           >
              Compose Message
           </button>
           <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
           >
              Sent History
           </button>
        </div>

        {activeTab === 'compose' && (
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 border-r border-gray-100 bg-white flex flex-col">
                 <div className="flex-1 space-y-6">
                    <div>
                       <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Recipients</label>
                       <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                          <span className="text-xs font-bold text-blue-800">{selectedContactIds.size} Contacts Selected</span>
                          <button onClick={() => setSelectedContactIds(new Set())} className="text-[10px] font-bold text-blue-500 hover:underline uppercase">Clear</button>
                       </div>
                    </div>
                    
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Message Content</label>
                          <div className="relative group">
                             <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Insert Template</button>
                             <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-10 py-1">
                                {templates.map((t, i) => (
                                   <button key={i} onClick={() => insertTemplate(t.text)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 block text-gray-700">
                                      <span className="font-bold block">{t.title}</span>
                                      <span className="text-[9px] text-gray-400 truncate block">{t.text}</span>
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                       <textarea 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 h-64 shadow-inner resize-none text-gray-700 leading-relaxed"
                          placeholder="Type your message here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                       ></textarea>
                       <div className="mt-2 flex justify-between items-center text-[10px] font-bold text-gray-400 bg-gray-50 p-2 rounded border border-gray-100">
                          <span className={charCount > 160 ? 'text-orange-500' : 'text-green-500'}>{charCount} Characters</span>
                          <span className="text-blue-600">{smsUnits} SMS Unit(s)</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-6 mt-auto">
                    <button onClick={handleSend} className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 transform active:scale-95">
                       <i className="fa fa-paper-plane"></i> Send Broadcast
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-7 flex flex-col h-[600px]">
                 <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Contacts</h6>
                    <div className="relative w-1/2">
                       <input 
                          type="text" 
                          className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Search name or phone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                       />
                       <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tighter sticky top-0 z-10">
                          <tr>
                             <th className="px-4 py-3 w-10 text-center">
                                <input 
                                   type="checkbox" 
                                   className="rounded cursor-pointer" 
                                   onChange={toggleSelectAll} 
                                   checked={filteredContacts.length > 0 && selectedContactIds.size === filteredContacts.length}
                                />
                             </th>
                             <th className="px-4 py-3">Name</th>
                             <th className="px-4 py-3">Phone</th>
                             <th className="px-4 py-3 text-right">Type</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                          {filteredContacts.map(c => (
                             <tr key={c.id} className={`hover:bg-blue-50 transition-colors cursor-pointer ${selectedContactIds.has(c.id) ? 'bg-blue-50/50' : ''}`} onClick={() => toggleContact(c.id)}>
                                <td className="px-4 py-3 text-center">
                                   <input 
                                      type="checkbox" 
                                      className="rounded cursor-pointer" 
                                      checked={selectedContactIds.has(c.id)}
                                      readOnly
                                   />
                                </td>
                                <td className="px-4 py-3 font-bold text-gray-800 uppercase">{c.name}</td>
                                <td className="px-4 py-3 font-mono text-gray-500">{c.phone}</td>
                                <td className="px-4 py-3 text-right">
                                   <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${c.type === 'Staff' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                      {c.type}
                                   </span>
                                </td>
                             </tr>
                          ))}
                          {filteredContacts.length === 0 && (
                             <tr><td colSpan={4} className="p-8 text-center text-gray-400 italic">No contacts found</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-3 bg-gray-50 border-t border-gray-100 text-right text-[10px] font-bold text-gray-400 uppercase">
                    Total Contacts: {contacts.length}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'history' && (
           <div className="flex-1 overflow-y-auto p-6 bg-white">
               <table className="w-full text-left text-[11px] border border-gray-100 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tight">
                     <tr>
                        <th className="px-6 py-4">Date Sent</th>
                        <th className="px-6 py-4">Message Preview</th>
                        <th className="px-6 py-4 text-center">Recipients</th>
                        <th className="px-6 py-4 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                     {history.map(msg => (
                        <tr key={msg.id} className="hover:bg-gray-50">
                           <td className="px-6 py-4 font-mono text-gray-500">{msg.date}</td>
                           <td className="px-6 py-4 font-medium max-w-lg truncate" title={msg.content}>{msg.content}</td>
                           <td className="px-6 py-4 text-center font-bold">{msg.recipients}</td>
                           <td className="px-6 py-4 text-center">
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">{msg.status}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
           </div>
        )}
      </div>
    </div>
  );
};

export default Sms;