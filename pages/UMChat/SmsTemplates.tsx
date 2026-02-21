import React, { useState } from 'react';

interface Template {
  id: number;
  title: string;
  body: string;
  reminderType: string;
  trigger: string;
  active: boolean;
}

const SmsTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
     { id: 1, title: 'Appointment Reminder', body: 'Dear [Name], reminder for your appointment on [Date] at [Time].', reminderType: 'Appointments', trigger: '1 Day Before', active: true },
     { id: 2, title: 'Bill Notification', body: 'Dear [Name], your bill of [Amount] is due. Please pay via Paybill 123456.', reminderType: 'Billing', trigger: 'Manual', active: true },
  ]);

  const [form, setForm] = useState<Partial<Template>>({
     title: '', body: '', reminderType: 'Appointments', trigger: 'Manual', active: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const tags = ['[Name]', '[Date]', '[Time]', '[Amount]', '[Doctor]', '[Location]'];

  const insertTag = (tag: string) => {
     setForm(prev => ({ ...prev, body: (prev.body || '') + tag + ' ' }));
  };

  const handleSave = (e: React.FormEvent) => {
     e.preventDefault();
     if (isEditing && form.id) {
        setTemplates(prev => prev.map(t => t.id === form.id ? { ...t, ...form } as Template : t));
        alert("Template updated.");
     } else {
        const newTemplate: Template = {
           id: Date.now(),
           title: form.title || 'Untitled',
           body: form.body || '',
           reminderType: form.reminderType || 'General',
           trigger: form.trigger || 'Manual',
           active: form.active || true
        };
        setTemplates([...templates, newTemplate]);
        alert("Template created.");
     }
     resetForm();
  };

  const handleEdit = (t: Template) => {
     setForm(t);
     setIsEditing(true);
  };

  const handleDelete = (id: number) => {
     if(confirm('Delete this template?')) {
        setTemplates(prev => prev.filter(t => t.id !== id));
     }
  };

  const resetForm = () => {
     setForm({ title: '', body: '', reminderType: 'Appointments', trigger: 'Manual', active: true });
     setIsEditing(false);
  };

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">
            {isEditing ? 'Edit Template' : 'New Sms Template'}
          </h5>
          {isEditing && (
             <button onClick={resetForm} className="text-xs text-blue-600 font-bold hover:underline">Cancel Edit</button>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" 
                  required 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Message Body</label>
                <textarea 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 h-28 shadow-inner resize-none leading-relaxed" 
                  required
                  value={form.body}
                  onChange={e => setForm({...form, body: e.target.value})}
                ></textarea>
                <div className="mt-2 flex flex-wrap gap-1">
                   {tags.map(tag => (
                      <button 
                         key={tag} 
                         type="button"
                         onClick={() => insertTag(tag)}
                         className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded border border-blue-100 hover:bg-blue-100"
                      >
                         {tag}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Reminder Category</label>
                <select 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none"
                  value={form.reminderType}
                  onChange={e => setForm({...form, reminderType: e.target.value})}
                >
                  <option value="Appointments">Appointments</option>
                  <option value="Billing">Billing Arrears</option>
                  <option value="Follow-up">Check-up Follow-up</option>
                  <option value="General">General Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Automation Trigger</label>
                <select 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none"
                  value={form.trigger}
                  onChange={e => setForm({...form, trigger: e.target.value})}
                >
                  <option value="Manual">Manual Send Only</option>
                  <option value="1 Day Before">1 Day Before Event</option>
                  <option value="On Creation">Immediately On Creation</option>
                  <option value="Weekly">Weekly Recurring</option>
                </select>
              </div>
            </div>

            {/* Col 3 */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Live Preview</label>
                 <div className="p-3 bg-white border border-gray-200 rounded-lg relative">
                    {/* Chat Bubble Tail */}
                    <div className="absolute top-4 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                       {form.body ? form.body.replace(/\[Name\]/g, 'Jane Doe').replace(/\[Date\]/g, 'Tomorrow').replace(/\[Time\]/g, '10:00 AM') : <span className="text-gray-300 italic">Message preview will appear here...</span>}
                    </p>
                 </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2 items-center">
                <label className="flex items-center space-x-2 cursor-pointer mr-4">
                   <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500" 
                      checked={form.active}
                      onChange={e => setForm({...form, active: e.target.checked})}
                   />
                   <span className="text-[10px] font-black text-gray-500 uppercase">Active</span>
                </label>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition flex items-center">
                  <i className={`fa ${isEditing ? 'fa-save' : 'fa-plus'} mr-2`}></i> {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50 font-bold text-gray-700 text-xs uppercase tracking-tighter">
          Existing Templates
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Content Preview</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Trigger</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
               {templates.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                     <td className="px-6 py-3 font-bold text-gray-800">{t.title}</td>
                     <td className="px-6 py-3 truncate max-w-xs italic text-gray-500">{t.body}</td>
                     <td className="px-6 py-3">{t.reminderType}</td>
                     <td className="px-6 py-3">{t.trigger}</td>
                     <td className="px-6 py-3 text-center">
                        {t.active ? <i className="fa fa-check-circle text-green-500"></i> : <i className="fa fa-times-circle text-gray-300"></i>}
                     </td>
                     <td className="px-6 py-3 text-right space-x-2">
                        <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800"><i className="fa fa-edit"></i></button>
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><i className="fa fa-trash-alt"></i></button>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmsTemplates;
