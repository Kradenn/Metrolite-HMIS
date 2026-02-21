import React, { useState, useMemo } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
}

// --- 1. General Observation Chart ---
export const GeneralObservationChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        capturedOn: new Date().toISOString().slice(0, 16),
        fio2: '', temp: '', painRest: '', fluidIntake: '', height: '',
        hr: '', spo2: '', bpSys: '', bpDia: '', painMove: '', fluidOutput: '',
        nurse: '', rr: '', o2Mode: 'Nasal Prongs', sedation: '0', glucose: '', weight: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">General Observation Chart - {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Captured On</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.capturedOn} onChange={e => setForm({...form, capturedOn: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">FiO2</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.fio2} onChange={e => setForm({...form, fio2: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Temperature</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Pain At Rest (0-10)</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.painRest} onChange={e => setForm({...form, painRest: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Total Fluid Intake</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.fluidIntake} onChange={e => setForm({...form, fluidIntake: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Height (m)</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Heart Rate</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.hr} onChange={e => setForm({...form, hr: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">SpO2 %</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.spo2} onChange={e => setForm({...form, spo2: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Blood Pressure</label>
                            <div className="flex items-center gap-1">
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs text-center" placeholder="Sys" value={form.bpSys} onChange={e => setForm({...form, bpSys: e.target.value})} />
                                <span>/</span>
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs text-center" placeholder="Dia" value={form.bpDia} onChange={e => setForm({...form, bpDia: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Pain With Movement (0-10)</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.painMove} onChange={e => setForm({...form, painMove: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Total Fluid Output</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.fluidOutput} onChange={e => setForm({...form, fluidOutput: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Nurse</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.nurse} onChange={e => setForm({...form, nurse: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Respiration Rate Per Min</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.rr} onChange={e => setForm({...form, rr: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Oxygen Delivery Mode</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.o2Mode} onChange={e => setForm({...form, o2Mode: e.target.value})}>
                                <option>Nasal Prongs</option>
                                <option>Simple Mask</option>
                                <option>Non-Rebreather</option>
                                <option>Venturi Mask</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Sedation Score</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.sedation} onChange={e => setForm({...form, sedation: e.target.value})}>
                                <option value="0">0 - Alert</option>
                                <option value="1">1 - Occasionally Drowsy</option>
                                <option value="2">2 - Frequently Drowsy</option>
                                <option value="3">3 - Somnolent</option>
                                <option value="S">S - Normal Sleep</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Blood Glucose Level</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.glucose} onChange={e => setForm({...form, glucose: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Weight (kg)</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                <i className="fa fa-plus mr-2"></i> Add Entry
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <div className="bg-slate-50 p-3 flex justify-between items-center rounded-t-xl border border-slate-200 border-b-0">
                            <h4 className="text-xs font-bold text-slate-600 uppercase">View: General Observation</h4>
                            <div className="flex gap-2">
                                <button className="bg-sky-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Generate Chart</button>
                                <input type="text" placeholder="Search..." className="p-1 border border-slate-200 rounded text-[10px]" />
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-b-xl bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Captured On</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Respiration Rate</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">FiO2</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">SpO2</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Heart Rate</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Blood Pressure</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Temperature</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Pain Rest</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Pain Movement</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Sedation Score</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Fluid Intake</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={11} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. Neurological Observation Chart ---
export const NeurologicalObservationChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        capturedOn: new Date().toISOString().slice(0, 16),
        ra: 'Normal', la: 'Normal', rl: 'Normal', ll: 'Normal',
        leftEyeReact: 'Reactive', rightEyeReact: 'Reactive',
        leftEyeSize: '', rightEyeSize: '',
        eyesOpen: 'Spontaneous', verbal: 'Oriented', motor: 'Obeys Commands',
        pupilSize: '', nurse: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Neurological Observation Chart - {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Captured On</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.capturedOn} onChange={e => setForm({...form, capturedOn: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Limb Strength Right Arm</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.ra} onChange={e => setForm({...form, ra: e.target.value})}>
                                <option>Normal</option><option>Weak</option><option>Paralyzed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Left Eye Reaction</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.leftEyeReact} onChange={e => setForm({...form, leftEyeReact: e.target.value})}>
                                <option>Reactive</option><option>Sluggish</option><option>Fixed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Eye Pupil Size</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.pupilSize} onChange={e => setForm({...form, pupilSize: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Eyes Open</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.eyesOpen} onChange={e => setForm({...form, eyesOpen: e.target.value})}>
                                <option>Spontaneous</option><option>To Speech</option><option>To Pain</option><option>None</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Limb Strength Left Arm</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.la} onChange={e => setForm({...form, la: e.target.value})}>
                                <option>Normal</option><option>Weak</option><option>Paralyzed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Right Eye Reaction</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.rightEyeReact} onChange={e => setForm({...form, rightEyeReact: e.target.value})}>
                                <option>Reactive</option><option>Sluggish</option><option>Fixed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Nurse</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.nurse} onChange={e => setForm({...form, nurse: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Verbal Response</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.verbal} onChange={e => setForm({...form, verbal: e.target.value})}>
                                <option>Oriented</option><option>Confused</option><option>Inappropriate</option><option>Incomprehensible</option><option>None</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Limb Strength Right Leg</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.rl} onChange={e => setForm({...form, rl: e.target.value})}>
                                <option>Normal</option><option>Weak</option><option>Paralyzed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Left Eye Size</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.leftEyeSize} onChange={e => setForm({...form, leftEyeSize: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                <i className="fa fa-plus mr-2"></i> Add Entry
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Best Motor Response</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.motor} onChange={e => setForm({...form, motor: e.target.value})}>
                                <option>Obeys Commands</option><option>Localizes Pain</option><option>Withdraws</option><option>Flexion</option><option>Extension</option><option>None</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Limb Strength Left Leg</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.ll} onChange={e => setForm({...form, ll: e.target.value})}>
                                <option>Normal</option><option>Weak</option><option>Paralyzed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Right Eye Size</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.rightEyeSize} onChange={e => setForm({...form, rightEyeSize: e.target.value})} />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <div className="bg-slate-50 p-3 flex justify-between items-center rounded-t-xl border border-slate-200 border-b-0">
                            <h4 className="text-xs font-bold text-slate-600 uppercase">View: Neurological Observation</h4>
                            <div className="flex gap-2">
                                <button className="bg-sky-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Generate Chart</button>
                                <input type="text" placeholder="Search..." className="p-1 border border-slate-200 rounded text-[10px]" />
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-b-xl bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Captured On</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Eye Opening</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Verbal Response</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Best Motor Response</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Right Arm Strength</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Left Arm Strength</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Right Leg Strength</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Left Leg Strength</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. Admission Nursing Cardex ---
export const AdmissionCardex: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        timestamp: new Date().toISOString().slice(0, 16),
        pastSurgical: '', socialEconomic: '', physicalExam: '',
        diagnosis: '', allergies: '', obstetric: '', doneBy: '',
        currentDisease: '', familyHistory: '', development: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Admission Nursing Cardex: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Timestamp</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.timestamp} onChange={e => setForm({...form, timestamp: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Past Medical Surgical History</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.pastSurgical} onChange={e => setForm({...form, pastSurgical: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Social & Economic History</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.socialEconomic} onChange={e => setForm({...form, socialEconomic: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Physical Examination</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.physicalExam} onChange={e => setForm({...form, physicalExam: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Diagnosis</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Food & Drug Allergies</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Past & Present Obstetric History</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.obstetric} onChange={e => setForm({...form, obstetric: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Done by</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.doneBy} onChange={e => setForm({...form, doneBy: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">History of Current Disease</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.currentDisease} onChange={e => setForm({...form, currentDisease: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Family Medical History</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.familyHistory} onChange={e => setForm({...form, familyHistory: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Development History</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.development} onChange={e => setForm({...form, development: e.target.value})} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Comprehensive First Assessment ---
export const ComprehensiveFirstAssessment: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        timestamp: new Date().toISOString().slice(0, 16),
        notes: '', doneBy: '', part: 'General'
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Comprehensive First Assessment: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Timestamp</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.timestamp} onChange={e => setForm({...form, timestamp: e.target.value})} />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Notes</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-10" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Part</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.part} onChange={e => setForm({...form, part: e.target.value})}>
                                <option>General</option><option>Respiratory</option><option>Cardiovascular</option><option>Neurological</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Done by</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.doneBy} onChange={e => setForm({...form, doneBy: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                <i className="fa fa-plus mr-2"></i> Add Entry
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-slate-600 uppercase">View: Comprehensive First Assessment Charts</h4>
                            <button className="bg-sky-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Generate Report</button>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">No</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Timestamp</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Part</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Note</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Done by</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. Fluid Intake Output Chart ---
export const FluidIOChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [ioTab, setIoTab] = useState<'input' | 'output'>('input');
    const [ioForm, setIoForm] = useState({ type: '', volume: '', route: 'Oral' });
    const [ioHistory, setIoHistory] = useState<any[]>([
        { time: '08:00', category: 'Input', type: 'Normal Saline', volume: 500, route: 'IV' },
        { time: '09:30', category: 'Output', type: 'Urine', volume: 350, route: 'Catheter' },
        { time: '10:00', category: 'Input', type: 'Tea', volume: 200, route: 'Oral' },
    ]);

    const ioStats = useMemo(() => {
        const input = ioHistory.filter(i => i.category === 'Input').reduce((acc, curr) => acc + curr.volume, 0);
        const output = ioHistory.filter(i => i.category === 'Output').reduce((acc, curr) => acc + curr.volume, 0);
        return { input, output, balance: input - output };
    }, [ioHistory]);

    const handleIoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ioForm.volume || !ioForm.type) return;
        
        const newEntry = {
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            category: ioTab === 'input' ? 'Input' : 'Output',
            type: ioForm.type,
            volume: parseInt(ioForm.volume),
            route: ioTab === 'input' ? ioForm.route : '-'
        };
        
        setIoHistory([newEntry, ...ioHistory]);
        setIoForm({ ...ioForm, volume: '' });
    };

    if (!isOpen) return null;

    const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all shadow-inner";
    const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                         <i className="fa fa-tint text-9xl transform -rotate-12"></i>
                     </div>
                     <div className="relative z-10">
                         <h3 className="text-xl font-black uppercase tracking-tight">Fluid Balance Monitor</h3>
                         <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-1">Intake & Output Tracking • {patientName}</p>
                     </div>
                     <button onClick={onClose} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50">
                    {/* Input Form */}
                    <div className="space-y-6">
                        <div className="flex bg-slate-200 p-1 rounded-xl border border-slate-300">
                            <button 
                                onClick={() => setIoTab('input')} 
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${ioTab === 'input' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                + Input
                            </button>
                            <button 
                                onClick={() => setIoTab('output')} 
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${ioTab === 'output' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                - Output
                            </button>
                        </div>
                        
                        <form onSubmit={handleIoSubmit} className="space-y-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
                            <div>
                                <label className={labelClass}>Fluid Type</label>
                                {ioTab === 'input' ? (
                                    <input list="inputTypes" className={inputClass} value={ioForm.type} onChange={e => setIoForm({...ioForm, type: e.target.value})} placeholder="e.g. Normal Saline, Tea..." />
                                ) : (
                                    <select className={inputClass} value={ioForm.type} onChange={e => setIoForm({...ioForm, type: e.target.value})}>
                                        <option value="">Select Type...</option>
                                        <option value="Urine">Urine</option>
                                        <option value="Vomit">Vomit</option>
                                        <option value="Drain">Surgical Drain</option>
                                        <option value="Stool">Liquid Stool</option>
                                        <option value="Nasogastric">NG Aspirate</option>
                                    </select>
                                )}
                                <datalist id="inputTypes">
                                    <option value="Water" /><option value="Tea" /><option value="Soup" />
                                    <option value="Normal Saline" /><option value="Ringer's Lactate" /><option value="Dextrose 5%" />
                                    <option value="Antibiotic Infusion" /><option value="Blood Product" />
                                </datalist>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Volume (ml)</label>
                                    <input type="number" className={inputClass} value={ioForm.volume} onChange={e => setIoForm({...ioForm, volume: e.target.value})} placeholder="0" />
                                </div>
                                {ioTab === 'input' && (
                                    <div>
                                        <label className={labelClass}>Route</label>
                                        <select className={inputClass} value={ioForm.route} onChange={e => setIoForm({...ioForm, route: e.target.value})}>
                                            <option>Oral</option><option>IV</option><option>NG Tube</option><option>PEG</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className={`w-full py-3 mt-4 text-white font-black text-[10px] uppercase tracking-widest shadow-lg transition-transform active:scale-95 rounded-xl ${ioTab === 'input' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
                                Record {ioTab === 'input' ? 'Intake' : 'Output'}
                            </button>
                        </form>
                    </div>

                    {/* Balance Sheet */}
                    <div className="space-y-6 flex flex-col h-full">
                        <div className="grid grid-cols-3 gap-4 mb-2">
                            <div className="bg-sky-50 border border-sky-100 p-3 text-center rounded-xl">
                                <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Total In</p>
                                <p className="text-lg font-black text-sky-700">{ioStats.input} <span className="text-[10px]">ml</span></p>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 p-3 text-center rounded-xl">
                                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Total Out</p>
                                <p className="text-lg font-black text-orange-700">{ioStats.output} <span className="text-[10px]">ml</span></p>
                            </div>
                            <div className={`border p-3 text-center rounded-xl ${ioStats.balance >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${ioStats.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Net Balance</p>
                                <p className={`text-lg font-black ${ioStats.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{ioStats.balance > 0 ? '+' : ''}{ioStats.balance}</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-white border border-slate-200 overflow-hidden flex flex-col shadow-inner rounded-2xl">
                            <div className="p-3 border-b border-slate-100 bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-widest">Recent Entries (24h)</div>
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
                                {ioHistory.map((entry, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-1.5 h-8 rounded-full ${entry.category === 'Input' ? 'bg-sky-500' : 'bg-orange-500'}`}></span>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-700 uppercase">{entry.type}</p>
                                                <p className="text-[9px] text-slate-400 font-mono">{entry.time} &bull; {entry.route}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-black ${entry.category === 'Input' ? 'text-sky-600' : 'text-orange-600'}`}>
                                            {entry.volume} ml
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. Inpatient Feeding Chart ---
export const InpatientFeedingChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({ notes: '', prescribingOfficer: '', designatedNurse: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Inpatient Feeding Chart: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Notes</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Prescribing Officer</label>
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.prescribingOfficer} onChange={e => setForm({...form, prescribingOfficer: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Designated Nurse</label>
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.designatedNurse} onChange={e => setForm({...form, designatedNurse: e.target.value})} />
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                    <i className="fa fa-plus mr-2"></i> Add Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 7. Blood Transfusion Observation Chart ---
export const TransfusionChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        startedBy: '', amount: '', intervention: '', type: 'Whole Blood',
        timeStarted: new Date().toISOString().slice(0, 16), nurse: '',
        donorNo: '', rate: '', symptoms: '', checkedBy: '',
        timeEnded: new Date().toISOString().slice(0, 16)
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Blood Transfusion Observation Chart: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Date of Transfusion</label>
                            <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Transfusion Started by</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.startedBy} onChange={e => setForm({...form, startedBy: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Amount Transfused</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Intervention</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-10" value={form.intervention} onChange={e => setForm({...form, intervention: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Type of Blood Transfused</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option>Whole Blood</option><option>Packed Cells</option><option>Platelets</option><option>FFP</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Time Transfusion Started</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.timeStarted} onChange={e => setForm({...form, timeStarted: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Nurse/Doctor/Anaesthetist</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.nurse} onChange={e => setForm({...form, nurse: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                <i className="fa fa-plus mr-2"></i> Add Entry
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Blood Unit Donor Number</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.donorNo} onChange={e => setForm({...form, donorNo: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Rate of Transfusion</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})} />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Symptoms Observed</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-10" value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Counter Checked by</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.checkedBy} onChange={e => setForm({...form, checkedBy: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Time Transfusion Ended</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.timeEnded} onChange={e => setForm({...form, timeEnded: e.target.value})} />
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-slate-600 uppercase">View: Blood Transfusion Observation Charts</h4>
                            <div className="flex gap-2">
                                <button className="bg-teal-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Chart Items</button>
                                <button className="bg-sky-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Generate Report</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">No</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Time Started</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Time Ended</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Amount Transfused</th>
                                        <th className="px-4 py-2 font-bold text-slate-500 uppercase">Nurse</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 8. Blood Sugar Monitoring Chart ---
export const BloodSugarChart: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({ timestamp: new Date().toISOString().slice(0, 16), remarks: '', doneBy: '', sampleType: 'Capillary', sugarLevel: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Blood Sugar Monitoring Chart: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Timestamp</label>
                            <input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.timestamp} onChange={e => setForm({...form, timestamp: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Remarks</label>
                            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-10" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Done by</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.doneBy} onChange={e => setForm({...form, doneBy: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Blood Sample Type</label>
                            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.sampleType} onChange={e => setForm({...form, sampleType: e.target.value})}>
                                <option>Capillary</option><option>Venous</option><option>Arterial</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Sugar Level (mmol/L)</label>
                            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.sugarLevel} onChange={e => setForm({...form, sugarLevel: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-teal-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">
                                <i className="fa fa-plus mr-2"></i> Add Entry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 9. Nutrition Assessment Chart ---
export const NutritionAssessment: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10), muac: '', physicalExam: '', surgical: '', cho: '', otherInterventions: '',
        diagnosis: '', zscore: '', foodHistory: '', pes: '', prot: '', route: 'Oral',
        biochemical: '', bmi: '', medication: '', prescription: '', fats: '', nutritionist: '',
        height: '', bmiAge: '', kcals: '', weight: '', others: '', otherNutrition: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-7xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Nutrition Assessment Chart: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Date</label><input type="date" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">MUAC</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.muac} onChange={e => setForm({...form, muac: e.target.value})} /></div>
                        <div className="space-y-1 md:col-span-2"><label className="text-[9px] font-bold text-slate-500 uppercase">Physical Exam, Findings & Clinical Assessment</label><textarea className="w-full p-1.5 border border-slate-200 rounded text-xs h-10" value={form.physicalExam} onChange={e => setForm({...form, physicalExam: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Surgical Procedures</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.surgical} onChange={e => setForm({...form, surgical: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">CHO</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.cho} onChange={e => setForm({...form, cho: e.target.value})} /></div>
                        
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Principal Diagnosis</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">ZScore</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.zscore} onChange={e => setForm({...form, zscore: e.target.value})} /></div>
                        <div className="space-y-1 md:col-span-2"><label className="text-[9px] font-bold text-slate-500 uppercase">Food & Nutrition History</label><textarea className="w-full p-1.5 border border-slate-200 rounded text-xs h-10" value={form.foodHistory} onChange={e => setForm({...form, foodHistory: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">PES Statement</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.pes} onChange={e => setForm({...form, pes: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">PROT</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.prot} onChange={e => setForm({...form, prot: e.target.value})} /></div>

                        <div className="space-y-1 md:col-span-2"><label className="text-[9px] font-bold text-slate-500 uppercase">Biochemical Data, Medical Tests & Procedures</label><textarea className="w-full p-1.5 border border-slate-200 rounded text-xs h-10" value={form.biochemical} onChange={e => setForm({...form, biochemical: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">BMI</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.bmi} onChange={e => setForm({...form, bmi: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Medication</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.medication} onChange={e => setForm({...form, medication: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Nutrition Prescription</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.prescription} onChange={e => setForm({...form, prescription: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Fats</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.fats} onChange={e => setForm({...form, fats: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Height</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.height} onChange={e => setForm({...form, height: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">BMI/Age</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.bmiAge} onChange={e => setForm({...form, bmiAge: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Others</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.others} onChange={e => setForm({...form, others: e.target.value})} /></div>
                        <div className="space-y-1 md:col-span-2"><label className="text-[9px] font-bold text-slate-500 uppercase">Other Nutrition Interventions</label><textarea className="w-full p-1.5 border border-slate-200 rounded text-xs h-10" value={form.otherNutrition} onChange={e => setForm({...form, otherNutrition: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Kcals</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.kcals} onChange={e => setForm({...form, kcals: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Weight</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Other Interventions</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.otherInterventions} onChange={e => setForm({...form, otherInterventions: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Route of Administration</label><select className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.route} onChange={e => setForm({...form, route: e.target.value})}><option>Oral</option><option>IV</option><option>NG</option></select></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Nutritionist</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.nutritionist} onChange={e => setForm({...form, nutritionist: e.target.value})} /></div>
                        <div className="flex items-end col-span-2">
                            <button className="w-full bg-teal-600 text-white p-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition"><i className="fa fa-plus mr-2"></i> Add Entry</button>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-slate-600 uppercase">View: Nutrition Assessment Charts</h4>
                            <div className="flex gap-2">
                                <button className="bg-teal-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Nutrition Care Processes</button>
                                <button className="bg-sky-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase">Generate Report</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr><th className="px-4 py-2 font-bold text-slate-500 uppercase">No</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Date</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Principal Diagnosis</th></tr>
                                </thead>
                                <tbody><tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 10. Theatre Pre-Operative Checklist ---
export const PreOpChecklist: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({
        timestamp: new Date().toISOString().slice(0, 16), bp: '', urethral: '', theatreFee: '', electrolytes: '', xray: '',
        diagnosis: '', pulse: '', shaving: '', receipt: '', creatinine: '', preparedBy: '',
        operation: '', resp: '', starvedSince: '', consent: '', bloodSugar: '', handedOverBy: '',
        preMed: '', temp: '', gown: '', hb: '', bloodGXM: '', receivedInTheatreBy: '',
        allergies: '', timeTaken: '', ringsRemoved: '', urinalysis: '', unitsOfBlood: '',
        ivLine: '', enema: '', urea: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-7xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Theatre Pre-Operative Checklist: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Timestamp</label><input type="datetime-local" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.timestamp} onChange={e => setForm({...form, timestamp: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Bp</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.bp} onChange={e => setForm({...form, bp: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Urethral Catheterization</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.urethral} onChange={e => setForm({...form, urethral: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Theatre Fee</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.theatreFee} onChange={e => setForm({...form, theatreFee: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Electrolytes</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.electrolytes} onChange={e => setForm({...form, electrolytes: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">XRay/Ultrasound</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.xray} onChange={e => setForm({...form, xray: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Diagnosis</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Pulse</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.pulse} onChange={e => setForm({...form, pulse: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Shaving</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.shaving} onChange={e => setForm({...form, shaving: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Receipt</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.receipt} onChange={e => setForm({...form, receipt: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Creatinine</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.creatinine} onChange={e => setForm({...form, creatinine: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Patient Prepared by</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.preparedBy} onChange={e => setForm({...form, preparedBy: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Operation</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.operation} onChange={e => setForm({...form, operation: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Respiration</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.resp} onChange={e => setForm({...form, resp: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Starved Since (Time)</label><input type="datetime-local" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.starvedSince} onChange={e => setForm({...form, starvedSince: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Informed Consent</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.consent} onChange={e => setForm({...form, consent: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Blood Sugar</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.bloodSugar} onChange={e => setForm({...form, bloodSugar: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Patient Handed Over by</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.handedOverBy} onChange={e => setForm({...form, handedOverBy: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Pre Medication</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.preMed} onChange={e => setForm({...form, preMed: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Temperature</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Theatre Gown</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.gown} onChange={e => setForm({...form, gown: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Hb</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.hb} onChange={e => setForm({...form, hb: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">BloodGXM</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.bloodGXM} onChange={e => setForm({...form, bloodGXM: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Patient Received in Theatre by</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.receivedInTheatreBy} onChange={e => setForm({...form, receivedInTheatreBy: e.target.value})} /></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Known Allergies</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Time Taken</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.timeTaken} onChange={e => setForm({...form, timeTaken: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Dentures Rings Removed</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.ringsRemoved} onChange={e => setForm({...form, ringsRemoved: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Urinalysis</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.urinalysis} onChange={e => setForm({...form, urinalysis: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">UnitsOfBlood</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.unitsOfBlood} onChange={e => setForm({...form, unitsOfBlood: e.target.value})} /></div>
                        <div className="flex items-end"><button className="w-full bg-teal-600 text-white p-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition"><i className="fa fa-plus mr-2"></i> Add Entry</button></div>

                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">IV Line Fixed Running</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.ivLine} onChange={e => setForm({...form, ivLine: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Enema</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.enema} onChange={e => setForm({...form, enema: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Urea</label><input type="text" className="w-full p-1.5 border border-slate-200 rounded text-xs" value={form.urea} onChange={e => setForm({...form, urea: e.target.value})} /></div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-600 uppercase mb-4">View: Theatre PreOperative Checklists</h4>
                        <div className="overflow-x-auto border border-slate-200 rounded bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr><th className="px-4 py-2 font-bold text-slate-500 uppercase">No</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Timestamp</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Diagnosis</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Operation</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Prepared by</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Handed Over by</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Received by</th></tr>
                                </thead>
                                <tbody><tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 11. Continuation Notes ---
export const ContinuationNotes: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({ dateTime: new Date().toISOString().slice(0, 16), clinicalNote: '', doctorsOrder: '', examination: '', doctor: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Continuation Notes: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Date Time</label><input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50" value={form.dateTime} readOnly /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Clinical Note</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-32" value={form.clinicalNote} onChange={e => setForm({...form, clinicalNote: e.target.value})} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Doctor</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} /></div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Doctor's Order</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.doctorsOrder} onChange={e => setForm({...form, doctorsOrder: e.target.value})} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Examination</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.examination} onChange={e => setForm({...form, examination: e.target.value})} /></div>
                            <div className="flex justify-end gap-2">
                                <button className="bg-teal-600 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">Save</button>
                                <button className="bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">View Report</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-600 uppercase mb-4">Notes View</h4>
                        <div className="overflow-x-auto border border-slate-200 rounded bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr><th className="px-4 py-2 font-bold text-slate-500 uppercase">DateTime</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Clinical Notes</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Examination</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Order</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Doctor</th></tr>
                                </thead>
                                <tbody><tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic font-medium">No data available in table</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 12. Bed Transfer ---
export const BedTransfer: React.FC<ModalProps> = ({ isOpen, onClose, patientName }) => {
    const [form, setForm] = useState({ fromWard: 'female ward', fromBed: '1', fromRate: '1500', toWard: '', toBed: '', toRate: '', reason: '', dateTime: new Date().toISOString().slice(0, 16) });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-[#f3f0ff] border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Bed Transfer: {patientName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-4 border border-slate-200 rounded-xl space-y-4 relative">
                            <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">From</span>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Ward</label><input type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-emerald-700 font-bold" value={form.fromWard} readOnly /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Bed Number</label><input type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-emerald-700 font-bold" value={form.fromBed} readOnly /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Rate</label><input type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-emerald-700 font-bold text-right" value={form.fromRate} readOnly /></div>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-xl space-y-4 relative">
                            <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">To</span>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Ward</label><select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.toWard} onChange={e => setForm({...form, toWard: e.target.value})}><option value="">Select Ward...</option><option>Male Ward</option><option>ICU</option></select></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Bed Number</label><select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.toBed} onChange={e => setForm({...form, toBed: e.target.value})}><option value="">Select Bed...</option><option>10</option><option>11</option></select></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Rate</label><input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.toRate} onChange={e => setForm({...form, toRate: e.target.value})} /></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Reasons for transfer</label><textarea className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} /></div>
                        <div className="space-y-4">
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">DateTime of Transfer</label><input type="datetime-local" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} /></div>
                            <button className="w-full bg-teal-600 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition">Make Transfer</button>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-600 uppercase mb-4">Previously Occupied Beds</h4>
                        <div className="overflow-x-auto border border-slate-200 rounded bg-white">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr><th className="px-4 py-2 font-bold text-slate-500 uppercase">Ward</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Bed No</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Date Time In</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Date Time Out</th><th className="px-4 py-2 font-bold text-slate-500 uppercase">Duration</th></tr>
                                </thead>
                                <tbody><tr className="text-emerald-700 font-bold"><td className="px-4 py-2">female ward</td><td className="px-4 py-2">1</td><td className="px-4 py-2">Feb 2, 2026 3:23 pm</td><td className="px-4 py-2">On This Bed</td><td className="px-4 py-2">18 day(s), 1 hr(s)</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
