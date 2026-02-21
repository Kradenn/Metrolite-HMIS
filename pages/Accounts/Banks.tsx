
import React, { useState, useMemo } from 'react';

// --- Types ---
interface BankAccount {
  id: number;
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  swiftCode: string;
  balance: number;
  status: 'Active' | 'Inactive';
  glAccount: string;
  relationshipOfficer?: string;
  contactNumber?: string;
}

// --- Mock Data ---
const MOCK_BANKS: BankAccount[] = [
  { 
    id: 1, 
    bankName: 'KCB Bank', 
    branchName: 'Moi Avenue', 
    accountName: 'Main Operations', 
    accountNumber: '1102938475', 
    currency: 'KES', 
    swiftCode: 'KCBLKENX', 
    balance: 4500000.00, 
    status: 'Active',
    glAccount: '1001-01 - Cash at Bank (KCB)',
    relationshipOfficer: 'Michael Otieno',
    contactNumber: '0722000000'
  },
  { 
    id: 2, 
    bankName: 'Equity Bank', 
    branchName: 'Corporate Branch', 
    accountName: 'Collections Account', 
    accountNumber: '0810293847291', 
    currency: 'KES', 
    swiftCode: 'EQBLKENX', 
    balance: 1250000.50, 
    status: 'Active',
    glAccount: '1001-02 - Cash at Bank (Equity)',
    relationshipOfficer: 'Sarah Wanjiku',
    contactNumber: '0733000000'
  },
  { 
    id: 3, 
    bankName: 'Standard Chartered', 
    branchName: 'Westlands', 
    accountName: 'USD Reserve', 
    accountNumber: '87293019283', 
    currency: 'USD', 
    swiftCode: 'SCBLKENX', 
    balance: 15000.00, 
    status: 'Active',
    glAccount: '1001-03 - USD Account',
  }
];

const Banks: React.FC = () => {
  const [banks, setBanks] = useState<BankAccount[]>(MOCK_BANKS);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<BankAccount>>({});

  // Derived State
  const totalLiquidity = useMemo(() => 
    banks.filter(b => b.currency === 'KES').reduce((acc, curr) => acc + curr.balance, 0), 
  [banks]);

  const filteredBanks = useMemo(() => {
    return banks.filter(b => 
      b.bankName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.accountNumber.includes(searchTerm)
    );
  }, [banks, searchTerm]);

  const selectedBank = useMemo(() => 
    banks.find(b => b.id === selectedBankId) || null, 
  [banks, selectedBankId]);

  // Handlers
  const handleSelectBank = (bank: BankAccount) => {
    setSelectedBankId(bank.id);
    setFormData(bank);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setSelectedBankId(null);
    setFormData({
      currency: 'KES',
      status: 'Active',
      balance: 0
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBankId) {
      // Update
      setBanks(prev => prev.map(b => b.id === selectedBankId ? { ...b, ...formData } as BankAccount : b));
    } else {
      // Create
      const newBank: BankAccount = {
        ...formData,
        id: Date.now(),
        balance: formData.balance || 0,
        status: formData.status || 'Active'
      } as BankAccount;
      setBanks([...banks, newBank]);
      setSelectedBankId(newBank.id);
    }
    // Optional: Show toast
  };

  const getBankIcon = (name: string) => {
    // Simple icon mapper based on string
    if (name.toLowerCase().includes('equity')) return 'text-red-700 bg-red-100';
    if (name.toLowerCase().includes('kcb')) return 'text-green-700 bg-green-100';
    if (name.toLowerCase().includes('standard')) return 'text-blue-700 bg-blue-100';
    return 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="animate-bottom space-y-6">
      
      {/* 1. Liquidity Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Liquidity (KES)</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{totalLiquidity.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
           </div>
           <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl shadow-sm">
              <i className="fa fa-university"></i>
           </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Accounts</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{banks.filter(b => b.status === 'Active').length}</h3>
           </div>
           <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-sm">
              <i className="fa fa-wallet"></i>
           </div>
        </div>
        <div className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition" onClick={handleAddNew}>
            <div className="flex items-center space-x-3">
               <i className="fa fa-plus-circle text-2xl"></i>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Register Bank</h3>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Add New Account</p>
               </div>
            </div>
        </div>
      </div>

      {/* 2. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
         
         {/* Left: Bank List */}
         <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
               <div className="flex justify-between items-center">
                  <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Bank Accounts</h5>
                  <span className="bg-gray-200 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-full">{filteredBanks.length}</span>
               </div>
               <div className="relative">
                  <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input 
                     type="text" 
                     placeholder="Search banks..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
               {filteredBanks.map(bank => (
                  <div 
                     key={bank.id}
                     onClick={() => handleSelectBank(bank)}
                     className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                        selectedBankId === bank.id 
                        ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${getBankIcon(bank.bankName)}`}>
                              {bank.bankName.charAt(0)}
                           </div>
                           <div>
                              <h6 className="text-xs font-black text-gray-800">{bank.bankName}</h6>
                              <p className="text-[10px] text-gray-500 font-medium">{bank.accountName}</p>
                           </div>
                        </div>
                        {bank.status === 'Active' ? (
                           <i className="fa fa-check-circle text-green-500 text-xs"></i>
                        ) : (
                           <i className="fa fa-ban text-red-400 text-xs"></i>
                        )}
                     </div>
                     <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                        <div>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Account No</p>
                           <p className="text-xs font-mono text-gray-600">****{bank.accountNumber.slice(-4)}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Balance</p>
                           <p className={`text-sm font-black ${selectedBankId === bank.id ? 'text-blue-600' : 'text-gray-800'}`}>
                              {bank.currency} {bank.balance.toLocaleString()}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Detail Form */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            {isEditing ? (
               <>
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                     <h5 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">
                        {selectedBankId ? `Edit: ${selectedBank?.bankName}` : 'New Bank Configuration'}
                     </h5>
                     <div className="flex space-x-2">
                        {selectedBankId && (
                           <button className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-100 transition shadow-sm">
                              <i className="fa fa-history mr-1"></i> Statement
                           </button>
                        )}
                     </div>
                  </div>
                  <div className="p-8 flex-1 overflow-y-auto">
                     <form id="bankForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Section 1 */}
                        <div className="md:col-span-2">
                           <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-4">Bank Details</h6>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bank Name <span className="text-red-500">*</span></label>
                              <input 
                                 type="text" required
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                 value={formData.bankName || ''}
                                 onChange={e => setFormData({...formData, bankName: e.target.value})}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch Name</label>
                              <input 
                                 type="text" 
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                 value={formData.branchName || ''}
                                 onChange={e => setFormData({...formData, branchName: e.target.value})}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SWIFT / Sort Code</label>
                              <input 
                                 type="text" 
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                 value={formData.swiftCode || ''}
                                 onChange={e => setFormData({...formData, swiftCode: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Account Name <span className="text-red-500">*</span></label>
                              <input 
                                 type="text" required
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                 value={formData.accountName || ''}
                                 onChange={e => setFormData({...formData, accountName: e.target.value})}
                              />
                           </div>
                           <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Account Number <span className="text-red-500">*</span></label>
                                 <input 
                                    type="text" required
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.accountNumber || ''}
                                    onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Currency</label>
                                 <select 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none"
                                    value={formData.currency || 'KES'}
                                    onChange={e => setFormData({...formData, currency: e.target.value})}
                                 >
                                    <option value="KES">KES</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                 </select>
                              </div>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Linked GL Account</label>
                              <select 
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium outline-none"
                                 value={formData.glAccount || ''}
                                 onChange={e => setFormData({...formData, glAccount: e.target.value})}
                              >
                                 <option value="">Select Ledger Account...</option>
                                 <option value="1001-01 - Cash at Bank (KCB)">1001-01 - Cash at Bank (KCB)</option>
                                 <option value="1001-02 - Cash at Bank (Equity)">1001-02 - Cash at Bank (Equity)</option>
                                 <option value="1001-03 - USD Account">1001-03 - USD Account</option>
                              </select>
                           </div>
                        </div>

                        {/* Section 2 */}
                        <div className="md:col-span-2 mt-2">
                           <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-4">Contact & Status</h6>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Relationship Officer</label>
                              <input 
                                 type="text" 
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-800 outline-none"
                                 value={formData.relationshipOfficer || ''}
                                 onChange={e => setFormData({...formData, relationshipOfficer: e.target.value})}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
                              <input 
                                 type="tel" 
                                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-800 outline-none"
                                 value={formData.contactNumber || ''}
                                 onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           {!selectedBankId && (
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Opening Balance</label>
                                  <input 
                                     type="number" 
                                     className="w-full p-2.5 bg-green-50 border border-green-100 rounded text-sm font-black text-green-700 outline-none"
                                     value={formData.balance}
                                     onChange={e => setFormData({...formData, balance: Number(e.target.value)})}
                                  />
                               </div>
                           )}
                           <div className="flex flex-col space-y-2 pt-2">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase">Account Status</label>
                              <div className="flex space-x-4">
                                 <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                       type="radio" name="status" value="Active" 
                                       checked={formData.status === 'Active'} 
                                       onChange={() => setFormData({...formData, status: 'Active'})}
                                       className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-bold text-gray-700">Active</span>
                                 </label>
                                 <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                       type="radio" name="status" value="Inactive" 
                                       checked={formData.status === 'Inactive'} 
                                       onChange={() => setFormData({...formData, status: 'Inactive'})}
                                       className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-bold text-gray-700">Inactive</span>
                                 </label>
                              </div>
                           </div>
                        </div>

                     </form>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                     <button 
                        onClick={() => { setIsEditing(false); setSelectedBankId(null); }}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 uppercase hover:bg-white transition"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-8 py-2 rounded-lg text-xs font-black uppercase shadow-lg hover:bg-blue-700 transition"
                     >
                        Save Details
                     </button>
                  </div>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <i className="fa fa-university text-6xl mb-4 opacity-20"></i>
                  <p className="text-sm font-bold uppercase tracking-widest">Select a bank account to view details</p>
                  <button onClick={handleAddNew} className="mt-4 text-blue-600 text-xs font-bold hover:underline">Or Register New Bank</button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Banks;
