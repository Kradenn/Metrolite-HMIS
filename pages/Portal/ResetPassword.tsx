
import React, { useState } from 'react';

const ResetPassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Password reset successful');
      setMessage({ type: 'success', text: 'Your password has been changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 800);
  };

  return (
    <div className="animate-bottom space-y-6 max-w-lg mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Change Password</h5>
        </div>
        
        <div className="p-8">
          {message && (
            <div className={`p-3 mb-6 text-xs font-bold rounded border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <i className={`fa ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                required 
                placeholder="Enter current password"
              />
            </div>
            
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                required 
                placeholder="Enter new password"
              />
              <p className="text-[9px] text-gray-400 mt-1 italic font-medium"><i className="fa fa-info-circle mr-1"></i> 6 characters with at least 1 uppercase and 1 number</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                required 
                placeholder="Re-enter new password"
              />
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-50 mt-6">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
