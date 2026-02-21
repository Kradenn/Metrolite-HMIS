
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="animate-bottom max-w-4xl mx-auto py-10 px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
           <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Privacy Policy</h1>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated: Oct 2023</span>
        </div>
        
        <div className="p-10 prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">1. Introduction</h3>
              <p>
                 At UltraHub Healthcare, your privacy is paramount. This policy outlines how we collect, store, and process patient and staff data within the UltraHub Hospital Management Information System (HMIS).
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">2. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Medical Records:</strong> Diagnoses, prescriptions, lab results, and imaging data.</li>
                 <li><strong>Demographics:</strong> Names, identification numbers, addresses, and next-of-kin details.</li>
                 <li><strong>Financial Data:</strong> Billing history, insurance coverage, and transaction logs.</li>
                 <li><strong>Biometric Data:</strong> Where applicable for Smart Africa insurance verification.</li>
              </ul>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">3. Use of Information</h3>
              <p>
                 Information collected is used strictly for providing medical care, processing billing claims, statutory reporting to government bodies (like KRA eTIMS), and improving hospital services.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">4. Data Security</h3>
              <p>
                 UltraHub HMIS uses industry-standard AES-256 encryption for data at rest and TLS for data in transit. Access is strictly governed by the Role-Based Access Control (RBAC) system configured by administrators.
              </p>
           </section>

           <section className="mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 tracking-tight">5. Third-Party Sharing</h3>
              <p>
                 We only share data with authorized entities such as insurance providers, regulatory health bodies, and the Kenya Revenue Authority as required by law.
              </p>
           </section>

           <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                 For further inquiries, contact our Data Protection Officer at privacy@ultrahub.com
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
