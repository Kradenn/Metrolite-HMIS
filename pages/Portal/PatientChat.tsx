
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const PatientChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Support', text: 'Hello, how can we help you today?', time: '09:00 AM', isMe: false },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const contacts = [
    { name: 'Dr. James Wilson', role: 'Cardiologist', status: 'Online', avatar: 'JW' },
    { name: 'Pharmacy Support', role: 'General', status: 'Online', avatar: 'PH' },
    { name: 'Billing Desk', role: 'Finance', status: 'Away', avatar: 'BD' },
  ];

  const [activeContact, setActiveContact] = useState(contacts[0]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'Me',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
       const replyMsg: Message = {
          id: Date.now() + 1,
          sender: activeContact.name,
          text: "Thank you for your message. We will get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
       };
       setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  return (
    <div className="animate-bottom flex h-[calc(100vh-180px)] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-100 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">My Care Team</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c, i) => (
            <div 
              key={i} 
              onClick={() => setActiveContact(c)}
              className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors border-b border-gray-100 ${activeContact.name === c.name ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-white'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs relative bg-blue-100 text-blue-600`}>
                {c.avatar}
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${c.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 truncate">{c.name}</h4>
                <p className="text-[10px] text-gray-500 truncate font-medium">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                {activeContact.avatar}
             </div>
             <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">{activeContact.name}</h4>
                <p className="text-[10px] text-green-500 font-bold">{activeContact.status}</p>
             </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${m.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-xs font-medium leading-relaxed ${
                  m.isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-widest">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button type="submit" className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition transform active:scale-95">
              <i className="fa fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
