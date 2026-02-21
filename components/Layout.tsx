import React, { useState, useEffect, useMemo } from 'react';
import Sidebar, { normalMenuItems } from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';
import { useModules } from '../context/ModuleContext';
import { useUser } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router';
import NotificationToast from './NotificationToast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { modules } = useModules();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isPortal = location.pathname.startsWith('/portal');
  const isExecutive = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/reports');
  const isCme = location.pathname.startsWith('/cme');
  const showContextBar = !isPortal && !isExecutive;

  const [currentBranch, setCurrentBranch] = useState('Main Branch');
  const [currentRoom, setCurrentRoom] = useState('Records / Registration');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        // Optional: Auto-open on desktop if preferred, or keep current state
      }
    };

    // Initial check
    if (window.innerWidth < 768) {
       setSidebarOpen(false);
    }

    // Close on navigation (mobile ux)
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const branches = ['Main Branch', 'City Center Branch', 'Westlands Clinic', 'Eastleigh Branch'];
  const rooms = [
    'Records / Registration', 
    'Triage Room 1', 
    'Consultation Room 1', 
    'Consultation Room 2', 
    'Pharmacy', 
    'Laboratory', 
    'Radiology', 
    'Billing Desk',
    'Emergency Room'
  ];

  const sortedModules = useMemo(() => {
    const baseItems = normalMenuItems.map(item => {
      if (!item.moduleKey) return item;
      const modState = (modules as any)[item.moduleKey];
      if (!modState || !modState.enabled) return null;
      
      if (!item.submenu) return item;

      return {
        ...item,
        submenu: item.submenu.filter(sub => {
          if (!sub.subModuleKey) return true;
          return modState.submodules[sub.subModuleKey] !== false;
        })
      };
    }).filter(Boolean) as typeof normalMenuItems;

    return [...baseItems].sort((a, b) => a.title.localeCompare(b.title));
  }, [modules]);

  const activeParentItem = useMemo(() => {
    return sortedModules.find(item => 
      item.path === location.pathname || 
      (item.submenu && item.submenu.some(sub => sub.path === location.pathname))
    );
  }, [sortedModules, location.pathname]);

  const currentModule = activeParentItem?.title || 'Home';
  const activeChildItem = activeParentItem?.submenu?.find(sub => sub.path === location.pathname);
  const currentViewTitle = activeChildItem?.title || (currentModule === 'Home' ? 'Dashboard' : 'Overview');
  
  const sortedSubMenu = useMemo(() => {
    const sub = activeParentItem?.submenu || [];
    return [...sub].sort((a, b) => a.title.localeCompare(b.title));
  }, [activeParentItem]);

  const handleModuleClick = (modTitle: string) => {
    setShowModuleMenu(false);
    const targetModule = sortedModules.find(m => m.title === modTitle);
    if (targetModule) {
      if (targetModule.submenu && targetModule.submenu.length > 0) {
        const firstView = [...targetModule.submenu].sort((a, b) => a.title.localeCompare(b.title))[0];
        navigate(firstView.path || '/');
      } else if (targetModule.path) {
        navigate(targetModule.path);
      }
    } else {
      navigate('/');
    }
  };

  const formattedDateTime = currentTime.toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className={`flex h-screen overflow-hidden ${user.theme === 'dark' ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden relative">
        <NotificationToast />

        <div className="flex-none z-40 flex flex-col shadow-md relative">
          <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} className="shadow-none relative z-50 shrink-0" />
          
          {showContextBar && (
            <div className="bg-white dark:bg-slate-900 border-t-2 border-green-500 border-b border-gray-200 dark:border-slate-800 px-2 md:px-4 py-1 flex flex-wrap items-center justify-between text-xs w-full animate-in fade-in slide-in-from-top-1 duration-200 relative z-30 transition-colors min-h-[40px] gap-y-1">
              <div className="flex items-center flex-wrap gap-2 md:gap-4">
                
                <div className="relative">
                  <button 
                    onClick={() => setShowModuleMenu(!showModuleMenu)}
                    className="flex items-center space-x-1 md:space-x-2 font-black text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest focus:outline-none py-1"
                  >
                    <span className="text-gray-400 dark:text-slate-500 font-bold text-[9px] hidden sm:inline">Module:</span>
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] md:text-xs">{currentModule}</span>
                    <i className={`fa fa-caret-down text-gray-400 transition-transform text-[9px] ${showModuleMenu ? 'rotate-180' : ''}`}></i>
                  </button>

                  {showModuleMenu && (
                    <React.Fragment>
                      <div className="fixed inset-0 z-40" onClick={() => setShowModuleMenu(false)}></div>
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl z-50 py-1 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase border-b border-gray-100 dark:border-slate-700 tracking-wider">Switch Module</div>
                        {sortedModules.map(m => (
                          <button 
                            key={m.title}
                            onClick={() => handleModuleClick(m.title)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider transition-colors flex justify-between items-center ${m.title === currentModule ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-slate-300'}`}
                          >
                            <span>{m.title}</span>
                            {m.title === currentModule && <i className="fa fa-check text-xs"></i>}
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                </div>
                
                <div className="h-4 border-r border-gray-300 dark:border-slate-700 hidden sm:block"></div>

                {sortedSubMenu.length > 0 && (
                  <React.Fragment>
                    <div className="relative">
                      <button 
                        onClick={() => setShowViewMenu(!showViewMenu)}
                        className="flex items-center space-x-1 md:space-x-2 font-black text-gray-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors uppercase tracking-widest focus:outline-none py-1"
                      >
                        <span className="text-gray-400 dark:text-slate-500 font-bold text-[9px] hidden sm:inline">View:</span>
                        <span className="text-green-600 dark:text-green-400 text-[10px] md:text-xs max-w-[120px] truncate">{currentViewTitle}</span>
                        <i className={`fa fa-caret-down text-gray-400 transition-transform text-[9px] ${showViewMenu ? 'rotate-180' : ''}`}></i>
                      </button>

                      {showViewMenu && (
                        <React.Fragment>
                          <div className="fixed inset-0 z-40" onClick={() => setShowViewMenu(false)}></div>
                          <div className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl z-50 py-1 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase border-b border-gray-100 dark:border-slate-700 tracking-wider">Navigate {currentModule}</div>
                            {sortedSubMenu.map(item => (
                              <button 
                                key={item.title}
                                onClick={() => { navigate(item.path || '#'); setShowViewMenu(false); }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider transition-colors flex justify-between items-center ${location.pathname === item.path ? 'text-green-600 bg-green-50 dark:bg-green-900/30' : 'text-gray-700 dark:text-slate-300'}`}
                              >
                                <span className="truncate">{item.title}</span>
                                {location.pathname === item.path && <i className="fa fa-check text-xs shrink-0 ml-2"></i>}
                              </button>
                            ))}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                    <div className="h-4 border-r border-gray-300 dark:border-slate-700 hidden sm:block"></div>
                  </React.Fragment>
                )}
                
                {!isCme && (
                  <React.Fragment>
                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-600 dark:text-slate-400 group cursor-pointer" onClick={() => setShowBranchModal(true)}>
                      <span className="font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tight text-[9px] hidden sm:inline">Br:</span>
                      <span className="font-black text-[10px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[80px]">{currentBranch}</span>
                    </div>
                    
                    <div className="h-4 border-r border-gray-300 dark:border-slate-700 hidden sm:block"></div>
                    
                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-600 dark:text-slate-400 group cursor-pointer" onClick={() => setShowRoomModal(true)}>
                      <span className="font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tight text-[9px] hidden sm:inline">Rm:</span>
                      <span className="font-black text-[10px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[100px]">{currentRoom}</span>
                    </div>
                  </React.Fragment>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                {isCme ? (
                  <div className="flex items-center space-x-2 bg-gray-900 text-white px-2 md:px-3 py-1 border border-gray-700 animate-in zoom-in-95 duration-300">
                    <i className="fa fa-clock text-teal-400 text-[9px] animate-pulse"></i>
                    <span className="text-[10px] font-black font-mono tracking-tighter uppercase hidden md:inline">
                      {formattedDateTime}
                    </span>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate('/clinical/queue')}
                    className="px-2 md:px-3 py-1 text-[9px] font-black text-white bg-blue-600 shadow-sm hover:bg-blue-700 transition-colors uppercase tracking-widest flex items-center"
                  >
                    <i className="fa fa-list-ol mr-1.5"></i> <span className="hidden sm:inline">Queue</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50 dark:bg-slate-950 transition-colors">
          <div className="flex-1 overflow-y-auto overflow-x-hidden w-full relative custom-scrollbar pb-4">
            <main className="p-3 md:p-6 w-full max-w-[1920px] mx-auto">
              <div className={`transition-all duration-300 ease-in-out w-full ${sidebarOpen ? "md:max-w-[99%] md:mx-auto" : ""}`}>
                {children}
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>

      {showBranchModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 shadow-2xl w-full max-sm overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-blue-600">
            <div className="p-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h5 className="text-[10px] font-black text-gray-800 dark:text-slate-100 uppercase tracking-[0.2em]">Deployment Node</h5>
              <button onClick={() => setShowBranchModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"><i className="fa fa-times"></i></button>
            </div>
            <div className="p-1 max-h-[300px] overflow-y-auto">
              {branches.map(branch => (
                <button 
                  key={branch}
                  onClick={() => { setCurrentBranch(branch); setShowBranchModal(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-tight border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center ${currentBranch === branch ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}
                >
                  {branch}
                  {currentBranch === branch && <i className="fa fa-check text-blue-600 dark:text-blue-400"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 shadow-2xl w-full max-sm overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-green-600">
            <div className="p-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h5 className="text-[10px] font-black text-gray-800 dark:text-slate-100 uppercase tracking-[0.2em]">Functional Room</h5>
              <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"><i className="fa fa-times"></i></button>
            </div>
            <div className="p-1 max-h-[400px] overflow-y-auto">
              {rooms.map(room => (
                <button 
                  key={room}
                  onClick={() => { setCurrentRoom(room); setShowRoomModal(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-tight border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center ${currentRoom === room ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}
                >
                  {room}
                  {currentRoom === room && <i className="fa fa-check text-blue-600 dark:text-blue-400"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;