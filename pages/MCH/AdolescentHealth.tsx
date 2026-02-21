
import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import DictationButton from '../../components/DictationButton';

const AdolescentHealth: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { notify } = useNotification();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'clinical' | 'counseling' | 'social'>('clinical');

  const handleSave = () => {
    notify('success', 'YFS Record Saved', 'Adolescent health indicators and HEEADSSS assessment synchronized.');
  };

  const inputStyle = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm";
  const labelStyle = "block text-[10px] font-semibold text-slate-500 uppercase mb-1.5 tracking-wider";

  // Validate Age (10-24)
  const isValidAge = activePatient && activePatient.age >= 10 && activePatient.age <= 24;

  if (!activePatient || !isValidAge) {
    return (
      <div className="animate-bottom min-h-[70vh] flex flex-col items-center justify-center space-y-8">
        <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="adolescents" title="Adolescent Health Registry" />
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-inner border border-purple-100">
            <i className="fa fa-user-graduate text-5xl opacity-40"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Adolescent & Youth Friendly Services</h2>
          <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">Comprehensive care for patients aged 10-24 years (YFS).</p>
          {activePatient && !isValidAge && (
             <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl text-xs font-bold max-w-md mx-auto">
                 <i className="fa fa-exclamation-circle mr-2"></i>
                 Active patient is {activePatient.age} years old. This clinic is restricted to ages 10-24.
             </div>
          )}
        </div>
        <button onClick={() => setIsSelectorOpen(true)} className="bg-purple-600 text-white px-10 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition">
          <i className="fa fa-search mr-2"></i> Find Youth Record
        </button>
      </div>
    );
  }

  return (
    <div className="animate-bottom space-y-6 pb-20">
      <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="adolescents" title="Switch Adolescent Patient" />

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-purple-600">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-purple-100">
            <i className="fa fa-users-rays"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight leading-none">Adolescent Health Center</h2>
            <div className="flex items-center space-x-3 mt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                {activePatient.surname}, {activePatient.othernames} &bull; <span className="text-purple-600 font-bold">{activePatient.outpatientNo}</span> &bull; {activePatient.age} Yrs &bull; {activePatient.gender}
              </p>
              <button onClick={() => setIsSelectorOpen(true)} className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase hover:bg-purple-100 transition">Change</button>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
           <button onClick={() => setActiveTab('clinical')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clinical' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>Clinical & Vitals</button>
           <button onClick={() => setActiveTab('counseling')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'counseling' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>HEEADSSS / Counseling</button>
           <button onClick={() => setActiveTab('social')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'social' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>Social Context</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden min-h-[600px]">
        <div className="p-8">
            {activeTab === 'clinical' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-1">Biometrics & Nutrition</h6>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelStyle}>Weight (kg)</label><input className={inputStyle} type="number" /></div>
                                <div><label className={labelStyle}>Height (cm)</label><input className={inputStyle} type="number" /></div>
                                <div className="col-span-2">
                                  <label className={labelStyle}>BMI Calculation</label>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Auto-Calculated</span>
                                    <span className="text-sm font-black text-slate-800">--</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-1">Pubertal Assessment</h6>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Tanner Staging</label>
                                    <select className={inputStyle}>
                                        <option>Stage 1 (Pre-pubertal)</option>
                                        <option>Stage 2</option>
                                        <option>Stage 3</option>
                                        <option>Stage 4</option>
                                        <option>Stage 5 (Adult)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>Menarche / Spermarche</label>
                                    <select className={inputStyle}>
                                        <option>Not yet attained</option>
                                        <option>Attained</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className={labelStyle}>Dermatology / Acne</label>
                                    <select className={inputStyle}>
                                        <option>Clear</option>
                                        <option>Mild Acne</option>
                                        <option>Moderate/Severe Acne</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-1">Physical Examination Findings</h6>
                        <textarea className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500/10 shadow-inner resize-none leading-relaxed" placeholder="General systems review, musculoskeletal exam, thyroid check..."></textarea>
                    </div>
                </div>
            )}

            {activeTab === 'counseling' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest">HEEADSSS & Risk Screening</h6>
                        <DictationButton onTranscript={(t) => {}} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className={labelStyle}>Mental Health (PHQ-9 Screen)</label>
                                <select className={inputStyle}>
                                    <option>Negative / Low Risk</option>
                                    <option>Mild Symptoms</option>
                                    <option>Moderate Depression</option>
                                    <option>Severe / Immediate Referral</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyle}>Substance Use (CRAFFT)</label>
                                <select className={inputStyle}>
                                    <option>None Reported</option>
                                    <option>Experimental Use</option>
                                    <option>Regular Use</option>
                                    <option>Dependency Signs</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyle}>Sexual & Reproductive Health (SRH)</label>
                                <select className={inputStyle}>
                                    <option>Not Sexually Active</option>
                                    <option>Active - Protected</option>
                                    <option>Active - Unprotected</option>
                                    <option>STI Symptoms Reported</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className={labelStyle}>Psychosocial Assessment Notes</label>
                            <textarea className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500/10 shadow-inner resize-none leading-relaxed" placeholder="Detailed notes on Home, Education, Eating, Activities, Drugs, Sexuality, Suicide/Depression, Safety..."></textarea>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'social' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-1">Socio-Environmental Context</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl">
                             <label className={labelStyle}>School / Vocation</label>
                             <select className={inputStyle}>
                                <option>In School (Performing Well)</option>
                                <option>In School (Struggling)</option>
                                <option>Out of School / Dropout</option>
                                <option>Employed / Training</option>
                                <option>NEET (Not in Edu, Employment, Training)</option>
                             </select>
                        </div>
                        <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl">
                             <label className={labelStyle}>Home Environment</label>
                             <select className={inputStyle}>
                                <option>Supportive Family</option>
                                <option>Single Parent Household</option>
                                <option>Child Headed Household</option>
                                <option>Living with Relatives/Guardian</option>
                                <option>Institutional Care</option>
                             </select>
                        </div>
                        <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl">
                             <label className={labelStyle}>Nutrition Security</label>
                             <select className={inputStyle}>
                                <option>Food Secure</option>
                                <option>Occasional Insecurity</option>
                                <option>Severe Food Insecurity</option>
                             </select>
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                         <h6 className="text-[10px] font-black text-red-600 uppercase mb-4 tracking-widest flex items-center">
                            <i className="fa fa-shield-alt mr-2"></i> Safety & Protection Risks
                         </h6>
                         <div className="grid grid-cols-2 gap-4 mb-4">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-red-600" />
                                <span className="text-[11px] font-bold text-slate-600">History of Abuse/Violence</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-red-600" />
                                <span className="text-[11px] font-bold text-slate-600">Bullying / Cyberbullying</span>
                             </label>
                         </div>
                         <textarea className="w-full h-20 p-3 bg-white border border-red-200 rounded-xl text-xs font-bold text-red-900 outline-none focus:ring-1 focus:ring-red-400 shadow-sm" placeholder="Describe any identified safety concerns or protection needs..."></textarea>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={handleSave} className="bg-purple-600 text-white px-10 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition transform active:scale-95">
                Save & Update Record
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdolescentHealth;
