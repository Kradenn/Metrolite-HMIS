
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="animate-bottom max-w-4xl mx-auto py-10 px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
           <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Terms of Service</h1>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Date: Jan 2023</span>
        </div>
        
        <div className="p-10 prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">1. Acceptance of Terms</h3>
              <p>
                 By accessing or using the UltraHub HMIS, you agree to comply with these Terms of Service. These terms apply to all staff, consultants, and patients accessing the portal.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">2. User Responsibilities</h3>
              <p>
                 Users are responsible for maintaining the confidentiality of their login credentials. Any unauthorized access due to negligence is the responsibility of the account holder.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">3. Clinical Documentation</h3>
              <p>
                 Staff must ensure that all clinical entries are accurate, timely, and follow professional medical ethics. Fraudulent entries in billing or medical records are grounds for immediate termination and legal action.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">4. System Availability</h3>
              <p>
                 While we strive for 99.9% uptime, UltraHub does not guarantee uninterrupted access during scheduled maintenance or force majeure events.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">5. Intellectual Property</h3>
              <p>
                 The UltraHub HMIS architecture, code, and design are the exclusive property of UltraHub Healthcare Services. Reverse engineering or unauthorized distribution is strictly prohibited.
              </p>
           </section>

           <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                 Standard compliance version 3.1.0
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
