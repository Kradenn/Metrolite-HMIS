import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: 'Billing' | 'Clinical' | 'IT' | 'HR';
}

const HelpDesk: React.FC = () => {
    const { notify } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const faqs: FAQ[] = [
        { id: 1, category: 'Billing', question: 'How do I generate a Pro-Forma invoice?', answer: 'Navigate to Billing > ProForma Invoices and click "New Quotation". You can then select a patient and add items to generate the estimate.' },
        { id: 2, category: 'Clinical', question: 'How can I unlock a finalized lab request?', answer: 'Finalized requests are locked for security. Administrators can unlock them via Settings > ICD Management or the Laboratory Actions menu with proper justification.' },
        { id: 3, category: 'IT', question: 'The DICOM viewer is not loading images.', answer: 'Check your network connection to the PACS server. Ensure the AE Title and Port are correctly configured in the DICOM Settings module.' },
        { id: 4, category: 'HR', question: 'When are payslips generated?', answer: 'Payslips are usually generated on the 25th of every month after the CMO and HR Manager approve the payroll batch.' },
    ];

    const filteredFaqs = faqs.filter(f => 
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            notify('success', 'Support Ticket Created', 'Your request has been logged. Support team will contact you shortly.', true);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="animate-bottom space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-blue-400">
                        <i className="fa fa-headset"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Support Hub & Help Desk</h2>
                        <p className="text-xs text-gray-500 font-medium">Get instant answers or speak to our technical team</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Emergency Support</p>
                        <p className="text-sm font-black text-blue-600">EXT: 911 / 0700 999 888</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: FAQs */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Instant Answers (Knowledge Base)</h5>
                            <div className="relative w-48">
                                <i className="fa fa-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search help..." 
                                    className="w-full pl-7 pr-3 py-1 bg-white border border-gray-200 rounded text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {filteredFaqs.map((faq) => (
                                <div key={faq.id} className="group">
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex justify-between items-center"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 uppercase">{faq.category}</span>
                                            <span className="text-xs font-bold text-gray-700">{faq.question}</span>
                                        </div>
                                        <i className={`fa fa-chevron-down text-[10px] text-gray-300 transition-transform ${openFaq === faq.id ? 'rotate-180 text-blue-500' : ''}`}></i>
                                    </button>
                                    {openFaq === faq.id && (
                                        <div className="p-4 pt-0 bg-blue-50/20 animate-in slide-in-from-top-2 duration-200">
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium pl-14 pr-8">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Browse Full Documentation</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg"><i className="fa fa-book"></i></div>
                            <div>
                                <h6 className="text-xs font-black text-gray-800 uppercase tracking-tighter leading-none mb-1">User Manuals</h6>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Download PDF Guides</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg"><i className="fa fa-play-circle"></i></div>
                            <div>
                                <h6 className="text-xs font-black text-gray-800 uppercase tracking-tighter leading-none mb-1">Video Tutorials</h6>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Watch System Walkthroughs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Submit Ticket */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#1e293b] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black uppercase tracking-tight mb-2">Need a Developer?</h4>
                            <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">If you've encountered a system bug or need a feature request approved, please submit a formal ticket.</p>
                            
                            <form onSubmit={handleTicketSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Issue Priority</label>
                                    <select className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 text-white">
                                        <option>Low - Question/General</option>
                                        <option>Medium - Minor Bug</option>
                                        <option>High - Module Malfunction</option>
                                        <option>Critical - System Down</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Description</label>
                                    <textarea 
                                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none placeholder:text-slate-600" 
                                        placeholder="Detail the problem, include error codes if any..."
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i> Processing...</> : 'Send Support Ticket'}
                                </button>
                            </form>
                        </div>
                        <i className="fa fa-life-ring absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Technical Contacts</h5>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"><i className="fa fa-envelope"></i></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-800">support@ultrahub.com</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">General Inquiries</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"><i className="fa fa-phone-alt"></i></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-800">+254 711 000 999</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">24/7 IT Hotline</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpDesk;
