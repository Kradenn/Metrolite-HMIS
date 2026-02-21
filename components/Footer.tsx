import React from 'react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 shrink-0">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding & Copyright */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] shadow-sm">
            <i className="fa fa-hospital-alt"></i>
          </div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">UltraHub HMIS</span>
          <span className="text-[10px] text-slate-400 font-bold ml-2 border-l border-gray-200 pl-2">
            © {currentYear} UltraHub Healthcare Services. All Rights Reserved.
          </span>
        </div>
        
        {/* Essential Links & Status */}
        <div className="flex items-center space-x-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">
           <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
           <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
           <Link to="/help-desk" className="hover:text-blue-600 transition-colors">Help Desk</Link>
           
           <div className="h-3 w-px bg-gray-200"></div>
           
           <div className="flex items-center space-x-2 px-2 py-1 bg-green-50 border border-green-100 rounded-lg text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
              <span>System Online</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;