
import React, { useState } from 'react';

interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  isParent: boolean;
  children?: GLAccount[];
}

const GeneralLedgerAccounts: React.FC = () => {
  const [activeAccount, setActiveAccount] = useState<GLAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Hierarchical Data
  const [chartOfAccounts] = useState<GLAccount[]>([
    {
      id: '1000', code: '1000', name: 'Assets', type: 'Asset', balance: 5200000, isParent: true,
      children: [
        { 
           id: '1100', code: '1100', name: 'Current Assets', type: 'Asset', balance: 1200000, isParent: true,
           children: [
              { id: '1110', code: '1110', name: 'Cash on Hand', type: 'Asset', balance: 50000, isParent: false },
              { id: '1120', code: '1120', name: 'Bank Accounts', type: 'Asset', balance: 1150000, isParent: false },
           ]
        },
        {
           id: '1200', code: '1200', name: 'Fixed Assets', type: 'Asset', balance: 4000000, isParent: true,
           children: [
              { id: '1210', code: '1210', name: 'Medical Equipment', type: 'Asset', balance: 3500000, isParent: false },
              { id: '1220', code: '1220', name: 'Furniture & Fittings', type: 'Asset', balance: 500000, isParent: false },
           ]
        }
      ]
    },
    {
      id: '2000', code: '2000', name: 'Liabilities', type: 'Liability', balance: 150000, isParent: true,
      children: [
         { id: '2100', code: '2100', name: 'Accounts Payable', type: 'Liability', balance: 150000, isParent: false }
      ]
    },
    {
      id: '4000', code: '4000', name: 'Revenue', type: 'Revenue', balance: 850000, isParent: true,
      children: [
         { id: '4100', code: '4100', name: 'Consultation Fees', type: 'Revenue', balance: 300000, isParent: false },
         { id: '4200', code: '4200', name: 'Pharmacy Sales', type: 'Revenue', balance: 550000, isParent: false }
      ]
    }
  ]);

  const RenderTree = ({ nodes }: { nodes: GLAccount[] }) => {
     return (
       <ul className="pl-4 space-y-1">
         {nodes.map(node => (
           <li key={node.id}>
             <div 
               onClick={() => setActiveAccount(node)}
               className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${activeAccount?.id === node.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
             >
                {node.isParent ? (
                   <i className="fa fa-folder text-yellow-500"></i>
                ) : (
                   <i className="fa fa-file-alt text-gray-400 text-xs"></i>
                )}
                <div className="flex-1 flex justify-between">
                   <span className="text-xs font-bold">{node.code} - {node.name}</span>
                   <span className="text-[10px] text-gray-500 font-mono">{node.balance.toLocaleString()}</span>
                </div>
             </div>
             {node.children && <RenderTree nodes={node.children} />}
           </li>
         ))}
       </ul>
     )
  };

  return (
    <div className="animate-bottom space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
          <div>
             <h2 className="text-xl font-bold text-gray-800">General Ledger</h2>
             <p className="text-xs text-gray-500">Chart of Accounts & Hierarchy</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-plus mr-2"></i> New Account
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* Left: Tree View */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
               <input 
                  type="text" 
                  placeholder="Search accounts..." 
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
               <RenderTree nodes={chartOfAccounts} />
            </div>
        </div>

        {/* Right: Details Pane */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            {activeAccount ? (
               <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                     <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                           activeAccount.type === 'Asset' ? 'bg-green-100 text-green-700' :
                           activeAccount.type === 'Liability' ? 'bg-red-100 text-red-700' :
                           activeAccount.type === 'Revenue' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>{activeAccount.type}</span>
                        <h3 className="text-2xl font-black text-gray-800 mt-2">{activeAccount.name}</h3>
                        <p className="text-sm font-mono text-gray-500 font-bold">{activeAccount.code}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Balance</p>
                        <h3 className="text-2xl font-black text-blue-600">KES {activeAccount.balance.toLocaleString()}</h3>
                     </div>
                  </div>
                  
                  <div className="p-8 flex-1 overflow-y-auto">
                     <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Account Name</label>
                              <input type="text" defaultValue={activeAccount.name} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Account Code</label>
                              <input type="text" defaultValue={activeAccount.code} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent Account</label>
                              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                                 <option>Assets</option>
                                 <option>Current Assets</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Currency</label>
                              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                                 <option>KES</option>
                                 <option>USD</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tax Code</label>
                              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                                 <option>None</option>
                                 <option>VAT 16%</option>
                              </select>
                           </div>
                           <div className="flex items-center space-x-3 pt-6">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="checkbox" className="rounded text-blue-600" checked={activeAccount.isParent} readOnly />
                                 <span className="text-xs font-bold text-gray-600">Is Parent Account</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                                 <span className="text-xs font-bold text-gray-600">Active</span>
                              </label>
                           </div>
                        </div>
                     </form>

                     <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
                        <button className="px-6 py-2 border border-gray-300 rounded text-xs font-bold uppercase text-red-600 hover:bg-red-50">Delete Account</button>
                        <button className="bg-blue-600 text-white px-8 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700 transition">Save Changes</button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <i className="fa fa-sitemap text-6xl mb-4 opacity-20"></i>
                  <p className="text-sm font-bold uppercase tracking-widest">Select an account from the tree</p>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GeneralLedgerAccounts;
