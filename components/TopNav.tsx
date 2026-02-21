import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useHospital } from '../context/HospitalContext';
import { useUser } from '../context/UserContext';

interface TopNavProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  className?: string;
}

const TopNav: React.FC<TopNavProps> = ({ toggleSidebar, isSidebarOpen, className = '' }) => {
  const { hospitalName } = useHospital();
  const { user, initials, logout, setTheme } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showProfileHub, setShowProfileHub] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const systemRecords = useMemo(() => [
    { category: 'Patient', title: 'JANE DOE', subtitle: 'OP-2023-001', path: '/clinical/chart', icon: 'fa-user' },
    { category: 'Patient', title: 'JOHN SMITH', subtitle: 'OP-2023-042', path: '/clinical/chart', icon: 'fa-user' },
    { category: 'Patient', title: 'MARY ANN', subtitle: 'OP-2023-115', path: '/clinical/chart', icon: 'fa-user' },
    { category: 'Bill', title: '#BILL-12093', subtitle: 'JANE DOE - Pending Clearance', path: '/billing/bills', icon: 'fa-file-invoice-dollar' },
    { category: 'Bill', title: '#BILL-11002', subtitle: 'SARAH CONNOR - Paid', path: '/billing/bills', icon: 'fa-file-invoice-dollar' },
    { category: 'Lab Result', title: 'Malaria Smear', subtitle: 'P-1002 - Ready for Review', path: '/lab', icon: 'fa-vial' },
    { category: 'Lab Result', title: 'Full Haemogram', subtitle: 'OP-2023-001 - Ready', path: '/lab', icon: 'fa-flask' },
    { category: 'Imaging', title: 'X-Ray Chest PA', subtitle: 'OP-2023-042 - Finalized', path: '/radiology', icon: 'fa-x-ray' },
    { category: 'Prescription', title: 'RX-8821', subtitle: 'Amoxicillin 500mg - Active', path: '/pharmacy/main', icon: 'fa-pills' },
  ], []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return systemRecords.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 8); 
  }, [searchQuery, systemRecords]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileHub(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowSearchResults(false);
    setShowProfileHub(false);
    setSearchQuery('');
  }, [location.pathname]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hospitalName,
          text: 'Access the Hospital Management System via this link:',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <header className={`sticky top-0 z-[100] flex items-center justify-between h-14 bg-[#4e0170] text-white px-2 md:px-4 shadow-md transition-colors ${className}`}>
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 transition-colors rounded-lg"
          title="Toggle Sidebar"
        >
          <i className={`fa ${isSidebarOpen ? 'fa-align-right' : 'fa-align-left'} text-lg`}></i>
        </button>
        
        <div className="hidden lg:block shrink-0">
          <span className="text-xs font-black tracking-widest text-blue-300 uppercase">{hospitalName}</span>
        </div>

        {/* Global System Search */}
        <div className="relative w-full max-w-[150px] sm:max-w-xs md:max-w-sm" ref={searchRef}>
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-black/20 border border-white/10 py-1.5 pl-3 md:pl-4 pr-8 md:pr-10 text-xs font-medium placeholder-white/40 focus:bg-white focus:text-gray-900 focus:ring-1 focus:ring-blue-400 transition-all outline-none shadow-inner rounded-md"
              />
              <i className="fa fa-search absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs pointer-events-none group-focus-within:text-gray-600 transition-colors"></i>
           </div>

           {/* Search Results Dropdown */}
           {showSearchResults && searchQuery.trim() && (
             <div className="absolute top-full left-0 w-[280px] md:w-full mt-1 bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-[100] rounded-md">
                <div className="p-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Global System Data</span>
                   <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 uppercase">Results</span>
                </div>
                <div className="max-h-96 overflow-y-auto py-1">
                   {filteredResults.length > 0 ? (
                       filteredResults.map((item, idx) => (
                           <button
                             key={idx}
                             onClick={() => navigate(item.path)}
                             className="w-full text-left p-3 hover:bg-blue-50 flex items-center space-x-4 group transition-colors border-b border-gray-50 last:border-0"
                           >
                              <div className="w-8 h-8 bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors rounded-md shrink-0">
                                 <i className={`fa ${item.icon} text-sm`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                    <p className="text-xs font-black text-gray-800 uppercase tracking-tight truncate">{item.title}</p>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter ml-2 bg-gray-50 px-1 rounded hidden sm:inline-block">{item.category}</span>
                                 </div>
                                 <p className="text-[9px] text-gray-500 font-bold uppercase truncate">{item.subtitle}</p>
                              </div>
                              <i className="fa fa-chevron-right text-gray-200 text-[10px] group-hover:text-blue-400"></i>
                           </button>
                       ))
                   ) : (
                       <div className="p-8 text-center text-gray-400">
                          <i className="fa fa-search-minus text-2xl mb-3 opacity-20"></i>
                          <p className="text-xs font-bold uppercase tracking-widest">No matching records</p>
                       </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <button 
          onClick={() => setShowShareModal(true)}
          className="p-2 hover:bg-white/10 transition-colors text-white/80 hidden sm:block rounded-lg"
          title="Share Application"
        >
          <i className="fa fa-share-nodes text-sm"></i>
        </button>

        <button 
          onClick={toggleFullscreen}
          className="p-2 hover:bg-white/10 transition-colors text-white/80 hidden sm:block rounded-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-sm`}></i>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-colors relative rounded-lg ${showNotifications ? 'bg-white/10' : 'hover:bg-white/10'}`} 
            title="Notifications"
          >
            <i className="fa fa-bell text-white text-sm"></i>
            <span className="absolute top-1 right-1 bg-red-500 text-[9px] font-black w-3.5 h-3.5 flex items-center justify-center border border-[#4e0170] rounded-full">3</span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 top-full mt-1 w-64 bg-white text-gray-800 shadow-2xl border border-gray-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 rounded-lg">
                 <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recent Alerts</h6>
                    <Link to="/um-chat/notifications" onClick={() => setShowNotifications(false)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</Link>
                 </div>
                 <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {[
                        { id: 1, title: 'Low Stock', msg: 'Paracetamol 500mg low', time: '2m', color: 'text-red-500' },
                        { id: 2, title: 'Bill Pending', msg: '#BILL-12093 overdue', time: '1h', color: 'text-orange-500' },
                        { id: 3, title: 'System', msg: 'Update scheduled', time: '4h', color: 'text-blue-500' },
                    ].map(n => (
                      <div key={n.id} className="p-3 hover:bg-blue-50 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-start mb-0.5">
                           <span className={`text-[9px] font-black uppercase ${n.color}`}>{n.title}</span>
                           <span className="text-[8px] text-gray-400 font-bold">{n.time}</span>
                        </div>
                        <p className="text-[10px] font-medium text-gray-600 truncate">{n.msg}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={() => setIsListening(!isListening)}
          className={`p-2 transition-all relative rounded-lg hidden sm:block ${isListening ? 'bg-red-50 text-white animate-pulse' : 'hover:bg-white/10 text-blue-300'}`}
          title={isListening ? "Listening..." : "Voice Assistant"}
        >
          <i className={`fa ${isListening ? 'fa-microphone' : 'fa-microphone-slash'} text-sm`}></i>
        </button>
        
        <Link to="/um-chat" className="p-2 hover:bg-white/10 transition-colors rounded-lg hidden sm:block" title="Hospital Chat">
          <i className="fa fa-commenting text-blue-300 text-sm"></i>
        </Link>

        <div className="h-6 border-l border-white/10 mx-1 hidden sm:block"></div>

        {/* DYNAMIC PROFILE HUB */}
        <div className="relative" ref={profileRef}>
          <button 
             onClick={() => setShowProfileHub(!showProfileHub)}
             className={`flex items-center space-x-2 p-1 transition-all rounded-lg ${showProfileHub ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <div className="w-8 h-8 bg-blue-500 flex items-center justify-center font-black text-xs shadow-xl border border-white/20 relative rounded-md">
               {initials}
               <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#4e0170] rounded-full"></div>
            </div>
            <div className="hidden xl:block text-left pr-2">
              <p className="text-[10px] font-black leading-none uppercase tracking-tight">{user.name}</p>
              <p className="text-[8px] text-white/50 mt-1 uppercase font-black tracking-widest">{user.branch}</p>
            </div>
            <i className={`fa fa-caret-down text-[10px] text-white/30 transition-transform ${showProfileHub ? 'rotate-180' : ''}`}></i>
          </button>

          {/* Profile Hub Dropdown */}
          {showProfileHub && (
             <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-800 shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150 rounded-xl">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                   <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-xl rounded-xl">{initials}</div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-xs font-black text-gray-800 uppercase truncate">{user.name}</h4>
                         <p className="text-[9px] text-gray-500 font-bold uppercase truncate tracking-wider">{user.email}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white border border-gray-200 text-center rounded-lg">
                         <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Node</p>
                         <p className="text-[10px] font-bold text-gray-700 uppercase truncate">{user.branch}</p>
                      </div>
                      <div className="p-2 bg-white border border-gray-200 text-center rounded-lg">
                         <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Access</p>
                         <p className="text-[10px] font-bold text-gray-700 uppercase">SuperUser</p>
                      </div>
                   </div>
                </div>

                <div className="p-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                   <div className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Self-Service</div>
                   <Link to="/portal/home" className="flex items-center p-2.5 hover:bg-indigo-50 transition-colors group rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs rounded-md">
                         <i className="fa fa-user-circle"></i>
                      </div>
                      <div className="ml-3">
                         <p className="text-[11px] font-black text-gray-700 uppercase tracking-tight group-hover:text-indigo-700">My Dashboard</p>
                         <p className="text-[9px] text-gray-400 font-bold uppercase">Payslips & Leave</p>
                      </div>
                   </Link>
                   
                   <div className="h-px bg-gray-50 mx-4 my-1"></div>

                   <div className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">System Architecture</div>
                   <button 
                      onClick={() => { setShowDisplaySettings(true); setShowProfileHub(false); }}
                      className="w-full flex items-center p-2.5 hover:bg-slate-100 transition-colors group text-left rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-all text-xs rounded-md">
                         <i className="fa fa-sliders-h"></i>
                      </div>
                      <div className="ml-3">
                         <p className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Display Settings</p>
                         <p className="text-[9px] text-gray-400 font-bold uppercase">Theme & Access</p>
                      </div>
                   </button>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                   <button 
                      onClick={logout}
                      className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-100 shadow-sm rounded-xl"
                   >
                      <i className="fa fa-power-off mr-2"></i> Terminate Session
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* DISPLAY SETTINGS MODAL */}
      {showDisplaySettings && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 rounded-2xl">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-800 uppercase tracking-widest">Display Configuration</h5>
                   <button onClick={() => setShowDisplaySettings(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><i className="fa fa-times"></i></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Interface Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center justify-center p-4 border-2 transition-all rounded-xl ${user.theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:bg-gray-50 text-gray-500'}`}
                            >
                                <i className="fa fa-sun text-lg mb-2"></i>
                                <span className="text-[10px] font-black uppercase">Standard Light</span>
                            </button>
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center justify-center p-4 border-2 transition-all rounded-xl ${user.theme === 'dark' ? 'border-blue-400 bg-slate-800 text-blue-300' : 'border-gray-100 hover:bg-gray-50 text-gray-500'}`}
                            >
                                <i className="fa fa-moon text-lg mb-2"></i>
                                <span className="text-[10px] font-black uppercase">Dark Graphite</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={() => setShowDisplaySettings(false)} className="w-full bg-blue-600 text-white py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg rounded-xl">Finalize Settings</button>
                </div>
            </div>
        </div>
      )}

      {/* SHARE APP MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 rounded-2xl">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Network Share</h5>
                   <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
                </div>
                <div className="p-6 space-y-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm border border-blue-200 rounded-full">
                        <i className="fa fa-hospital"></i>
                    </div>
                    <h4 className="text-sm font-black text-gray-800 uppercase">{hospitalName}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Proprietary Access Token Required</p>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="relative">
                            <input 
                                type="text" 
                                readOnly 
                                value={window.location.href}
                                className="w-full pl-3 pr-10 py-2 border border-gray-300 text-[10px] font-mono text-gray-600 bg-gray-50 outline-none rounded-lg"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                            >
                                <i className={`fa ${shareCopied ? 'fa-check' : 'fa-copy'}`}></i>
                            </button>
                        </div>
                        <button 
                            onClick={handleShare}
                            className="w-full bg-blue-600 text-white py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 rounded-xl"
                        >
                            <i className="fa fa-share-alt"></i> Broadast Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;