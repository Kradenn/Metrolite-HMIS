import React, { useState } from 'react';

interface FeedbackItem {
  id: number;
  date: string;
  type: string;
  subject: string;
  description: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
}

const Feedback: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Form State
  const [type, setType] = useState('Suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Mock History
  const [history, setHistory] = useState<FeedbackItem[]>([
    { id: 101, date: '2023-10-20', type: 'Issue', subject: 'Pharmacy stock not updating', description: 'Real-time updates lagging by 5 mins.', status: 'Resolved' },
    { id: 102, date: '2023-10-22', type: 'Suggestion', subject: 'Add dark mode', description: 'Night shifts are hard on the eyes.', status: 'Pending' },
    { id: 103, date: '2023-10-24', type: 'Compliment', subject: 'Great UI Update', description: 'The new dashboard is very fast.', status: 'Reviewed' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      const newItem: FeedbackItem = { 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0], 
        type, 
        subject, 
        description: message,
        status: 'Pending' 
      };
      setHistory([newItem, ...history]);
      setShowModal(false);
      resetForm();
      alert("Feedback submitted successfully!");
    }, 1000);
  };

  const resetForm = () => {
      setType('Suggestion');
      setSubject('');
      setMessage('');
  };

  // Admin Action: Change Status (Mock)
  const changeStatus = (id: number, newStatus: FeedbackItem['status']) => {
      setHistory(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const getTypeColor = (t: string) => {
    switch(t) {
      case 'Issue': return 'text-red-500 bg-red-50 border-red-100';
      case 'Suggestion': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'Compliment': return 'text-green-500 bg-green-50 border-green-100';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Reviewed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  const filteredHistory = history.filter(h => statusFilter === 'All' || h.status === statusFilter);

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
              <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">System Feedback</h5>
              <p className="text-[10px] text-gray-500 font-medium">Help us improve the HMIS experience.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none"
            >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
            </select>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition flex items-center"
            >
                <i className="fa fa-plus mr-2"></i> Submit Feedback
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto border border-gray-100 rounded-lg">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Subject & Description</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors bg-white group">
                    <td className="px-6 py-4 font-mono text-gray-500">{item.date}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded border text-[9px] font-black uppercase tracking-wide ${getTypeColor(item.type)}`}>
                            {item.type}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 mb-0.5">{item.subject}</p>
                        <p className="text-gray-500 truncate max-w-md">{item.description}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status !== 'Resolved' && (
                             <button onClick={() => changeStatus(item.id, 'Resolved')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Mark Resolved"><i className="fa fa-check"></i></button>
                          )}
                          {item.status === 'Pending' && (
                             <button onClick={() => changeStatus(item.id, 'Reviewed')} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Mark Reviewed"><i className="fa fa-eye"></i></button>
                          )}
                          <button className="text-red-400 hover:bg-red-50 p-1 rounded" title="Delete"><i className="fa fa-trash"></i></button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No feedback items found matching filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 bg-[#f8f9fa] flex justify-between items-center">
              <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Submit Feedback</h5>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg transition-colors"><i className="fa fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                 <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Feedback Type</label>
                 <div className="grid grid-cols-2 gap-4">
                    {['Suggestion', 'Issue', 'Compliment', 'Other'].map(t => (
                      <label key={t} className={`flex items-center p-3 border rounded cursor-pointer transition-all ${type === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}>
                        <input 
                          type="radio" 
                          name="feedbackType" 
                          value={t}
                          checked={type === t}
                          onChange={(e) => setType(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-xs font-bold uppercase">{t}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 font-normal outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Brief summary..." 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Description</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 font-normal outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none transition-all placeholder-gray-400"
                  placeholder="Please provide detailed feedback..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-50 mt-4 space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-[10px] font-bold text-gray-600 uppercase hover:bg-gray-50 transition bg-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition flex items-center disabled:opacity-70"
                >
                  {isSubmitting ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-paper-plane mr-2"></i>}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
