
// ... imports remain the same ...
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { usePatient } from '../context/PatientContext';
import { useModules, GlobalModuleState } from '../context/ModuleContext';

interface TodoItem {
  id: number;
  text: string;
  isEditing: boolean;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const { activePatient } = usePatient();
  const { modules } = useModules();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const schema = (window as any).schema || 'default';
    const userId = (window as any).SystemUserID || '0';
    const storageKey = `todos-${schema}-${userId}`;
    
    const storedTodos = localStorage.getItem(storageKey);
    if (storedTodos) {
      try {
        const parsed = JSON.parse(storedTodos);
        if (Array.isArray(parsed)) {
            const mappedTodos = parsed.map((item: any, index: number) => {
                // Support legacy string arrays and new object arrays
                const text = typeof item === 'string' ? item : item.text;
                const completed = typeof item === 'object' ? !!item.completed : false;
                return {
                    id: Date.now() + index,
                    text: text,
                    isEditing: false,
                    completed: completed
                };
            });
            setTodos(mappedTodos);
        }
      } catch (e) {
        console.error("Failed to load legacy todos", e);
      }
    } else {
        setTodos([
            { id: 1, text: 'Review ward occupancy', isEditing: false, completed: false },
            { id: 2, text: 'Approve pending LPOs', isEditing: false, completed: false }
        ]);
    }
  }, []);

  useEffect(() => {
    const schema = (window as any).schema || 'default';
    const userId = (window as any).SystemUserID || '0';
    const storageKey = `todos-${schema}-${userId}`;
    // Persist as objects to keep status
    const storageList = todos.filter(t => t.text.trim() !== '').map(t => ({ text: t.text, completed: t.completed }));
    localStorage.setItem(storageKey, JSON.stringify(storageList));
  }, [todos]);

  const allShortcuts = [
    { title: 'OPD Management', icon: 'fa-users-viewfinder', path: '/clinical/opd-management', color: 'text-indigo-600', moduleKey: 'clinical', subModuleKey: 'queue' },
    { title: 'IPD Management', icon: 'fa-bed', path: '/clinical/ipd-management', color: 'text-blue-700', moduleKey: 'clinical', subModuleKey: 'admissions' },
    { title: 'Triage', icon: 'fa-heartbeat', path: '/clinical/triage', color: 'text-emerald-600', moduleKey: 'clinical', subModuleKey: 'triage' },
    { title: 'Consultation', icon: 'fa-user-md', path: '/clinical/consultation', color: 'text-indigo-600', moduleKey: 'clinical', subModuleKey: 'consultation' },
    { title: 'Patient Queue', icon: 'fa-list-ol', path: '/clinical/queue', color: 'text-orange-500', moduleKey: 'clinical', subModuleKey: 'queue' },
    { title: 'Radiology', icon: 'fa-x-ray', path: '/radiology', color: 'text-teal-600', moduleKey: 'diagnostics', subModuleKey: 'radiology' },
    { title: 'Laboratory', icon: 'fa-vials', path: '/lab', color: 'text-purple-600', moduleKey: 'diagnostics', subModuleKey: 'lab' },
    { title: 'Theatre', icon: 'fa-procedures', path: '/theatre', color: 'text-teal-600', moduleKey: 'diagnostics', subModuleKey: 'theatre' },
    { title: 'Pharmacy', icon: 'fa-pills', path: '/pharmacy/main', color: 'text-rose-600', moduleKey: 'pharmacy', subModuleKey: 'main' },
    { title: 'RMNCH Clinic', icon: 'fa-baby-carriage', path: '/mch/antenatal', color: 'text-mch', subModuleKey: 'antenatal' },
    { title: 'Appointments', icon: 'fa-calendar-check', path: '/clinical/appointments', color: 'text-cyan-600', moduleKey: 'clinical', subModuleKey: 'appointments' },
    { title: 'Patient Bills', icon: 'fa-file-invoice-dollar', path: '/billing/bills', color: 'text-amber-600', moduleKey: 'billing', subModuleKey: 'patient_bills' },
    { title: 'POS Sales', icon: 'fa-cash-register', path: '/pharmacy/pos', color: 'text-green-600', moduleKey: 'pharmacy', subModuleKey: 'pos' },
    { title: 'Inventory', icon: 'fa-boxes', path: '/inventory/main', color: 'text-slate-600', moduleKey: 'inventory', subModuleKey: 'inventory' },
    { title: 'System Reports', icon: 'fa-chart-bar', path: '/reports/accounts', color: 'text-violet-600' },
  ];

  const visibleShortcuts = useMemo(() => {
      return allShortcuts.filter(s => {
          if (!s.moduleKey) return true;
          const mod = (modules as any)[s.moduleKey];
          if (!mod) return true;
          if (!mod.enabled) return false;
          if (s.subModuleKey && mod.submodules[s.subModuleKey] === false) return false;
          return true;
      });
  }, [modules, allShortcuts]);

  const handleTodoClick = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, isEditing: true } : t));
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        setTodos(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleTodoBlur = (id: number, text: string) => {
    if (!text.trim()) {
      // Don't auto delete on blur if empty, just revert or keep empty but require explicit delete via button
      // But keeping existing logic for empty text:
      setTodos(todos.filter(t => t.id !== id));
    } else {
      setTodos(todos.map(t => t.id === id ? { ...t, text, isEditing: false } : t));
    }
  };

  const addNewTodo = () => {
    const newId = Date.now();
    setTodos([...todos, { id: newId, text: '', isEditing: true, completed: false }]);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
      if (filter === 'pending') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });
  }, [todos, filter]);

  return (
    <div className="animate-bottom space-y-4">
      {/* Shortcut Buttons Grid - High Density */}
      <div className="flex flex-wrap gap-2 mb-4" id="prof-shortcuts">
        {visibleShortcuts.map((s, i) => (
          <Link
            key={i}
            to={s.path}
            className="flex flex-col items-center justify-center w-[115px] h-[115px] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative"
          >
            <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity ${s.color.replace('text', 'bg')}`}></div>
            <div className={`w-10 h-10 ${s.color.replace('text', 'bg')}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fa ${s.icon} text-xl ${s.color}`}></i>
            </div>
            <span className="text-[9px] font-black text-gray-700 uppercase text-center px-1 tracking-tighter leading-tight group-hover:text-gray-900">
              {s.title}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <div className="bg-white border border-gray-200 shadow-sm h-[40vh] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <i className="fa fa-calendar-alt text-blue-500 mr-2 text-xs"></i>
                <h5 className="text-xs font-black text-gray-700 uppercase tracking-tighter">Clinical Schedule</h5>
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date().toDateString()}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col items-center justify-center text-gray-300 text-center">
              <i className="fa fa-calendar-times text-4xl mb-2 opacity-10"></i>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Active Bookings</p>
              <Link to="/clinical/appointments" className="mt-4 text-blue-600 text-[9px] font-black uppercase tracking-widest hover:underline">Manage Roster</Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 shadow-sm h-[40vh] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <i className="fa fa-list-check text-violet-500 mr-2 text-xs"></i>
                <h5 className="text-xs font-black text-gray-700 uppercase tracking-tighter">Critical Tasks</h5>
              </div>
              <div className="flex gap-1 bg-white border border-gray-200 rounded p-0.5">
                  <button onClick={() => setFilter('all')} className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded transition-colors ${filter === 'all' ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-600'}`}>All</button>
                  <button onClick={() => setFilter('pending')} className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded transition-colors ${filter === 'pending' ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-600'}`}>Pending</button>
                  <button onClick={() => setFilter('completed')} className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded transition-colors ${filter === 'completed' ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-600'}`}>Done</button>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              <ol id="toDoList" className="space-y-1">
                {filteredTodos.map(todo => (
                  <li key={todo.id} className="border-b border-gray-50 pb-2 group flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                        <button 
                            onClick={() => toggleTodoCompletion(todo.id)}
                            className={`mt-1 text-[8px] transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-blue-400'}`}
                        >
                            <i className={`fa ${todo.completed ? 'fa-check-square' : 'fa-square'}`}></i>
                        </button>
                        <div className="flex-1">
                            {todo.isEditing ? (
                            <input
                                autoFocus
                                type="text"
                                defaultValue={todo.text}
                                onBlur={(e) => handleTodoBlur(todo.id, e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                className="w-full text-xs p-1 bg-gray-50 border border-blue-300 text-gray-900 font-normal outline-none rounded"
                            />
                            ) : (
                            <span 
                                onClick={() => handleTodoClick(todo.id)}
                                className={`text-[11px] cursor-pointer block hover:text-blue-600 transition-colors py-0.5 font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}
                            >
                                {todo.text}
                            </span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTodo(todo.id); }}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                        title="Delete Task"
                    >
                        <i className="fa fa-trash text-xs"></i>
                    </button>
                  </li>
                ))}
                {filteredTodos.length === 0 && (
                    <li className="text-center py-4 text-[10px] text-gray-400 italic">No {filter === 'all' ? '' : filter} tasks found.</li>
                )}
                <li className="pt-2">
                  <span 
                    onClick={addNewTodo}
                    className="text-[9px] font-black text-gray-400 italic cursor-pointer hover:text-blue-500 uppercase tracking-widest flex items-center"
                  >
                    <i className="fa fa-plus-square mr-1.5"></i> Add Entry...
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 shadow-sm h-[40vh] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center">
              <i className="fa fa-bullhorn text-orange-500 mr-2 text-xs"></i>
              <h5 className="text-xs font-black text-gray-700 uppercase tracking-tighter">Announcements</h5>
            </div>
            <div className="p-4 flex-1 flex flex-col items-center justify-center">
              <div className="bg-orange-50 border border-orange-100 text-orange-700 p-4 rounded-none text-[9px] font-bold uppercase tracking-widest italic border-dashed text-center">
                <i className="fa fa-info-circle text-xl mb-2 opacity-20 block"></i>
                No new broadcasts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
