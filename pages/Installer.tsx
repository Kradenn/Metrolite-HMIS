import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Installer: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hospitalName: 'UltraHub HMIS',
    adminEmail: '',
    adminPassword: '',
    dbHost: 'localhost',
    dbName: 'ultrahub_hmis',
    licenseKey: 'FREE-TRIAL-2026'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstall = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          installedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        // Wait a bit to simulate processing
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Installation failed', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white shadow-2xl overflow-hidden border-t-8 border-blue-600">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white text-2xl">
              <i className="fa fa-hospital-alt"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">System Installer</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">UltraHub HMIS v1.0.0</p>
            </div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tight">Welcome to UltraHub</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                This wizard will guide you through the initial configuration of your Hospital Management Information System. 
                Please ensure you have your database credentials ready.
              </p>
              <div className="bg-blue-50 p-4 border-l-4 border-blue-600 mb-8">
                <p className="text-xs text-blue-800 font-bold">
                  <i className="fa fa-info-circle mr-2"></i>
                  System requirements: Node.js 18+, 2GB RAM, 10GB Storage.
                </p>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-4 font-black uppercase tracking-widest hover:bg-blue-700 transition"
              >
                Start Installation <i className="fa fa-arrow-right ml-2"></i>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">Organization Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hospital Name</label>
                  <input 
                    type="text" 
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Email</label>
                    <input 
                      type="email" 
                      name="adminEmail"
                      placeholder="admin@hospital.com"
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Password</label>
                    <input 
                      type="password" 
                      name="adminPassword"
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-4 font-black uppercase tracking-widest hover:bg-gray-50 transition">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-4 font-black uppercase tracking-widest hover:bg-blue-700 transition">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">System Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Database Host</label>
                  <input 
                    type="text" 
                    name="dbHost"
                    value={formData.dbHost}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">License Key</label>
                  <input 
                    type="text" 
                    name="licenseKey"
                    value={formData.licenseKey}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-4 font-black uppercase tracking-widest hover:bg-gray-50 transition">Back</button>
                <button 
                  onClick={handleInstall} 
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-4 font-black uppercase tracking-widest hover:bg-green-700 transition flex items-center justify-center"
                >
                  {loading ? (
                    <><i className="fa fa-spinner fa-spin mr-2"></i> Installing...</>
                  ) : (
                    <>Finish Setup <i className="fa fa-check ml-2"></i></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex space-x-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-8 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>
      </div>
    </div>
  );
};

export default Installer;
