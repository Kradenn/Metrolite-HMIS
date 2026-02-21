
import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNotification } from '../context/NotificationContext';
import { useLocation } from 'react-router';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientId?: string;
}

const QueueModal: React.FC<QueueModalProps> = ({ isOpen, onClose, patientName = 'Unknown Patient', patientId }) => {
  const { setActivePatient } = usePatient();
  const { notify } = useNotification();
  const location = useLocation();
  const [currentPatient, setCurrentPatient] = useState(patientName);
  const [isReopenable, setIsReopenable] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [priority, setPriority] = useState('Normal');

  const STORAGE_KEY = patientId ? `closed_visit_${patientId}` : null;

  useEffect(() => {
    if (location.pathname.includes('/opd-management')) setSelectedDestination('Triage Desk');
    else if (location.pathname.includes('/triage')) setSelectedDestination('Consultation (Doctor)');
    else if (location.pathname.includes('/consultation')) setSelectedDestination('Pharmacy (Dispensing)');
    else if (location.pathname.includes('/lab')) setSelectedDestination('Consultation (Doctor)');
    else setSelectedDestination('Billing Desk');
  }, [location.pathname, isOpen]);

  const checkReopenStatus = () => {
    if (!STORAGE_KEY) return;
    const closedAt = localStorage.getItem(STORAGE_KEY);
    if (closedAt) {
      const diff = Date.now() - parseInt(closedAt);
      const thirtyMins = 30 * 60 * 1000;
      if (diff < thirtyMins) {
        setIsReopenable(true);
        setTimeLeft(Math.ceil((thirtyMins - diff) / 60000));
      } else {
        setIsReopenable(false);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      setIsReopenable(false);
    }
  };

  useEffect(() => {
    setCurrentPatient(patientName);
    if (isOpen) checkReopenStatus();
  }, [patientName, isOpen, patientId]);

  const handleEndVisit = () => {
    if (patientId) {
      localStorage.setItem(`closed_visit_${patientId}`, Date.now().toString());
      notify('info', 'Visit Closed', `The hospital visit for ${currentPatient} has been marked as complete for today.`);
      setActivePatient(null);
      onClose();
    }
  };

  const handleReopenVisit = () => {
    if (patientId) {
      localStorage.removeItem(`closed_visit_${patientId}`);
      setIsReopenable(false);
      notify('success', 'Visit Reopened', `Session for ${currentPatient} has been restored.`);
    }
  };

  const handleQueueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notify('success', 'Queued Successfully', `Patient transferred to ${selectedDestination} (${priority} Priority).`);
    onClose();
  };

  const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-inner";
  const labelStyle = "block text-[9px] font-black text-slate-500 uppercase mb-1.5 tracking-widest";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <i className="fa fa-people-arrows text-9xl transform -rotate-12"></i>
             </div>
             <div className="relative z-10">
                 <h3 className="text-xl font-black uppercase tracking-tight">Patient Transfer</h3>
                 <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Care Transition • {currentPatient}</p>
             </div>
             <button onClick={onClose} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
        </div>
        
        <div className="p-8 bg-slate-50 overflow-y-auto">
            {isReopenable ? (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-10 text-center space-y-6 animate-in zoom-in-95">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-sm">
                        <i className="fa fa-door-closed text-5xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight">Visit Closed</h3>
                        <p className="text-sm text-amber-700 font-medium mt-2">This patient's journey for today was recently finalized. Would you like to continue the session?</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={handleReopenVisit}
                            className="bg-amber-500 text-white px-12 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-200 hover:bg-amber-600 transition transform active:scale-95 flex items-center"
                        >
                            <i className="fa fa-redo-alt mr-2"></i> Reopen Visit
                        </button>
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center">
                            <i className="fa fa-clock mr-1.5"></i> Option valid for another {timeLeft} minutes
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleQueueSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Destination Selection */}
                        <div className="space-y-5">
                            <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">Next Destination</h6>
                            <div>
                                <label className={labelStyle}>Target Department</label>
                                <select 
                                    value={selectedDestination} 
                                    onChange={(e) => setSelectedDestination(e.target.value)}
                                    className={inputStyle}
                                >
                                    <option>Triage Desk</option>
                                    <option>Consultation (Doctor)</option>
                                    <option>Pharmacy (Dispensing)</option>
                                    <option>Laboratory (Sample Collection)</option>
                                    <option>Radiology (Imaging)</option>
                                    <option>Nursing Procedures</option>
                                    <option>Billing Desk</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyle}>Room / Service Point</label>
                                <select className={inputStyle}>
                                    <option>General Pool</option>
                                    <option>Consultation Room 1</option>
                                    <option>Consultation Room 2</option>
                                    <option>Emergency Room</option>
                                    <option>Laboratory Hub</option>
                                </select>
                            </div>
                        </div>

                        {/* Priority & Notes */}
                        <div className="space-y-5">
                            <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">Queue Parameters</h6>
                            <div>
                                <label className={labelStyle}>Priority Level</label>
                                <div className="flex gap-2">
                                   {['Normal', 'Urgent', 'Emergency'].map(lvl => (
                                     <button 
                                        key={lvl} 
                                        type="button" 
                                        onClick={() => setPriority(lvl)}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all ${priority === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                     >
                                        {lvl}
                                     </button>
                                   ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Clinical Handoff Notes</label>
                                <textarea className={`${inputStyle} h-24 resize-none`} placeholder="Enter clinical or logistic notes for the next station..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center">
                        <button 
                            type="button" 
                            onClick={handleEndVisit}
                            className="bg-red-50 text-red-600 border border-red-200 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 hover:border-red-300 transition transform active:scale-95 shadow-sm flex items-center"
                        >
                            <i className="fa fa-user-check mr-2"></i> Discharge / Close Visit
                        </button>
                        <button type="submit" className="bg-indigo-600 text-white px-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform active:scale-95 flex items-center">
                            <i className="fa fa-share-square mr-2"></i> Transfer to {selectedDestination.split(' ')[0]}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default QueueModal;
