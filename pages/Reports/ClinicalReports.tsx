
import React, { useState } from 'react';

const ClinicalReports: React.FC = () => {
  const [reportType, setReportType] = useState('0');

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Clinical Reports</h5>
        </div>
        
        <div className="p-4 bg-gray-50 border-b border-gray-100">
            <form className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex-1 min-w-[250px]">
                    <select 
                        className="w-full p-2 border border-gray-300 rounded outline-none bg-white"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="0">Analytics</option>
                        <option value="1">OutPatient Register Over Five (All Branches)</option>
                        <option value="5">OutPatient Register Over Five (By Branch)</option>
                        <option value="15">OutPatient Register Under Five (All Branches)</option>
                        <option value="16">OutPatient Register Under Five (By Branch)</option>
                        <option value="3">Inpatient Register (All Branches)</option>
                        <option value="7">Inpatient Register (By Branch)</option>
                        <option value="29">Daily Bed Return (By Branch)</option>
                        <option value="4">Laboratory Register (All Branches)</option>
                        <option value="8">Laboratory Register (By Branch)</option>
                        <option value="26">Laboratory Register (By Test)</option>
                        <option value="2">Radiology Register (All Branches)</option>
                        <option value="6">Radiology Register (By Branch)</option>
                        <option value="9">Prescription Register (All Branches)</option>
                        <option value="10">Prescription Register (By Branch)</option>
                        <option value="11">Patient Register (All Branches)</option>
                        <option value="12">Patient Register (By Branch)</option>
                        <option value="13">Workload (All Branches)</option>
                        <option value="14">Workload (By Branch)</option>
                        <option value="17">Morbidity By Diagnosis (By Branch)</option>
                        <option value="18">Morbidity By Impression (By Branch)</option>
                        <option value="19">Nursing Notes Summary (By Branch)</option>
                        <option value="20">Patient Visits By Doctor (By Branch)</option>
                        <option value="21">Special Clinic Register</option>
                        <option value="22">Patient Visits By Clinic (By Branch)</option>
                        <option value="23">Bed Occupancy (By Branch)</option>
                        <option value="24">Bed Occupancy Rate (By Branch)</option>
                        <option value="27">Outpatient Summary Sheet Under 5 (By Branch)</option>
                        <option value="28">Outpatient Summary Sheet Over 5 (By Branch)</option>
                        <option value="25">Hypertension Register (By Branch)</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label>From:</label>
                    <input type="date" className="p-1.5 border border-gray-300 rounded outline-none bg-white font-medium text-gray-700" />
                </div>
                <div className="flex items-center space-x-2">
                    <label>To:</label>
                    <input type="date" className="p-1.5 border border-gray-300 rounded outline-none bg-white font-medium text-gray-700" />
                </div>
                <button className="bg-blue-600 text-white px-6 py-1.5 rounded shadow hover:bg-blue-700 transition uppercase text-[9px] font-black tracking-widest">View Report</button>
            </form>
        </div>

        <div className="p-6 min-h-[60vh] bg-white flex flex-col items-center justify-center text-gray-300 border-t border-gray-100">
           {reportType === '0' ? (
             <div className="text-center">
               <i className="fa fa-heartbeat text-6xl mb-4 opacity-50 text-blue-300"></i>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Clinical Analytics Dashboard</p>
             </div>
           ) : (
             <div className="text-center">
               <i className="fa fa-file-medical-alt text-6xl mb-4 opacity-50"></i>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Report Preview</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalReports;
