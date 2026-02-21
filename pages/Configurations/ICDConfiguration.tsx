import React, { useState, useMemo, FormEvent } from 'react';

// Interfaces for ICD-11 data structure
interface ICDCode {
  id: string;
  title: string;
  enabled: boolean;
}

interface ICDBlock {
  id: string;
  title: string;
  codes: ICDCode[];
}

interface ICDChapter {
  id: number;
  codeRange: string;
  title: string;
  blocks: ICDBlock[];
}

// Mock ICD-11 Data (a small subset for demonstration)
const icd11Data: ICDChapter[] = [
  {
    id: 1,
    codeRange: '1A00-1H0Z',
    title: 'Certain infectious or parasitic diseases',
    blocks: [
      { id: '1A00-1A0Z', title: 'Gastroenteritis or colitis of infectious origin', codes: [
        { id: '1A01', title: 'Cholera', enabled: true },
        { id: '1A02', title: 'Intestinal infection due to other Vibrio', enabled: true },
        { id: '1A03', title: 'Typhoid fever', enabled: false },
      ]},
      { id: '1B90-1B9Z', title: 'Sepsis', codes: [
        { id: '1B90', title: 'Sepsis without septic shock', enabled: true },
        { id: '1B91', title: 'Sepsis with septic shock', enabled: true },
      ]},
    ],
  },
  {
    id: 2,
    codeRange: '2A00–2F9Z',
    title: 'Neoplasms',
    blocks: [
      { id: '2A00-2A0Z', title: 'Neoplasms of oral cavity or pharynx', codes: [
        { id: '2A00', title: 'Malignant neoplasms of lip', enabled: true },
      ]},
      { id: '2B50-2B5Z', title: 'Malignant neoplasms of breast', codes: [
        { id: '2B50', title: 'Carcinoma in situ of breast', enabled: true },
        { id: '2B51', title: 'Invasive carcinoma of breast', enabled: true },
      ]},
    ],
  },
  {
    id: 6,
    codeRange: '8A00–8E7Z',
    title: 'Diseases of the nervous system',
    blocks: [
      { id: '8A20-8A2Z', title: 'Epilepsy or seizures', codes: [
        { id: '8A20', title: 'Single seizure', enabled: true },
        { id: '8A21', title: 'Epilepsy', enabled: true },
      ]},
      { id: '8B20-8B2Z', title: 'Headache disorders', codes: [
        { id: '8B20', title: 'Migraine', enabled: true },
        { id: '8B21', title: 'Tension-type headache', enabled: true },
      ]},
    ],
  },
];

type ModalMode = 'addChapter' | 'editChapter' | 'addBlock' | 'editBlock' | 'addCode' | 'editCode';

interface ModalState {
  isOpen: boolean;
  mode: ModalMode | null;
  data?: any;
  context?: { chapterId?: number; blockId?: string };
}

const Modal: React.FC<{ state: ModalState; onClose: () => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void; }> = ({ state, onClose, onSubmit }) => {
  if (!state.isOpen) return null;

  const getTitleAndFields = () => {
    switch (state.mode) {
      case 'addChapter': return { title: 'Add New Chapter', fields: [{ name: 'title', label: 'Title' }, { name: 'codeRange', label: 'Code Range' }] };
      case 'editChapter': return { title: `Edit Chapter: ${state.data?.title}`, fields: [{ name: 'title', label: 'Title' }, { name: 'codeRange', label: 'Code Range' }] };
      case 'addBlock': return { title: 'Add New Block', fields: [{ name: 'title', label: 'Title' }, { name: 'id', label: 'Block Code Range' }] };
      case 'editBlock': return { title: `Edit Block: ${state.data?.title}`, fields: [{ name: 'title', label: 'Title' }, { name: 'id', label: 'Block Code Range' }] };
      case 'addCode': return { title: 'Add New Code', fields: [{ name: 'id', label: 'Code' }, { name: 'title', label: 'Title/Description' }] };
      case 'editCode': return { title: `Edit Code: ${state.data?.id}`, fields: [{ name: 'id', label: 'Code' }, { name: 'title', label: 'Title/Description' }] };
      default: return { title: '', fields: [] };
    }
  };

  const { title, fields } = getTitleAndFields();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700">{title}</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{field.label}</label>
                <input
                  name={field.name}
                  defaultValue={state.data?.[field.name] || ''}
                  className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ICDConfiguration: React.FC = () => {
  const [data, setData] = useState<ICDChapter[]>(icd11Data);
  const [selectedChapterId, setSelectedChapterId] = useState<number>(data[0]?.id || 0);
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: null });

  const selectedChapter = useMemo(() => {
    return data.find(c => c.id === selectedChapterId);
  }, [selectedChapterId, data]);

  const filteredChapters = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedFilter = searchTerm.toLowerCase();
    return data.filter(chapter =>
      chapter.title.toLowerCase().includes(lowercasedFilter) ||
      chapter.codeRange.toLowerCase().includes(lowercasedFilter) ||
      chapter.blocks.some(block => 
        block.title.toLowerCase().includes(lowercasedFilter) ||
        block.codes.some(code => code.title.toLowerCase().includes(lowercasedFilter) || code.id.toLowerCase().includes(lowercasedFilter))
      )
    );
  }, [searchTerm, data]);
  
  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => 
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    );
  };

  const toggleCodeEnabled = (blockId: string, codeId: string) => {
    setData(prevData => {
      return prevData.map(chapter => {
        if (chapter.id === selectedChapterId) {
          return {
            ...chapter,
            blocks: chapter.blocks.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  codes: block.codes.map(code => {
                    if (code.id === codeId) {
                      return { ...code, enabled: !code.enabled };
                    }
                    return code;
                  })
                };
              }
              return block;
            })
          };
        }
        return chapter;
      });
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    switch (modalState.mode) {
      case 'addChapter':
        setData(prev => [...prev, { id: Date.now(), title: payload.title as string, codeRange: payload.codeRange as string, blocks: [] }]);
        break;
      case 'editChapter':
        setData(prev => prev.map(chap => chap.id === modalState.data.id ? { ...chap, title: payload.title as string, codeRange: payload.codeRange as string } : chap));
        break;
      case 'addBlock':
        setData(prev => prev.map(chap => chap.id === modalState.context?.chapterId ? { ...chap, blocks: [...chap.blocks, { id: payload.id as string, title: payload.title as string, codes: [] }] } : chap));
        break;
      case 'editBlock':
        setData(prev => prev.map(chap => chap.id === modalState.context?.chapterId ? { ...chap, blocks: chap.blocks.map(b => b.id === modalState.data.id ? { ...b, id: payload.id as string, title: payload.title as string } : b) } : chap));
        break;
      case 'addCode':
        setData(prev => prev.map(chap => chap.id === modalState.context?.chapterId ? { ...chap, blocks: chap.blocks.map(b => b.id === modalState.context?.blockId ? { ...b, codes: [...b.codes, { id: payload.id as string, title: payload.title as string, enabled: true }] } : b) } : chap));
        break;
      case 'editCode':
        setData(prev => prev.map(chap => chap.id === modalState.context?.chapterId ? { ...chap, blocks: chap.blocks.map(b => b.id === modalState.context?.blockId ? { ...b, codes: b.codes.map(c => c.id === modalState.data.id ? { ...c, id: payload.id as string, title: payload.title as string } : c) } : b) } : chap));
        break;
    }
    setModalState({ isOpen: false, mode: null });
  };

  const handleDelete = (type: 'chapter' | 'block' | 'code', ids: { chapterId: number; blockId?: string; codeId?: string }) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;

    switch (type) {
      case 'chapter':
        setData(prev => prev.filter(c => c.id !== ids.chapterId));
        if(selectedChapterId === ids.chapterId) setSelectedChapterId(data[0]?.id || 0);
        break;
      case 'block':
        setData(prev => prev.map(c => c.id === ids.chapterId ? { ...c, blocks: c.blocks.filter(b => b.id !== ids.blockId) } : c));
        break;
      case 'code':
        setData(prev => prev.map(c => c.id === ids.chapterId ? { ...c, blocks: c.blocks.map(b => b.id === ids.blockId ? { ...b, codes: b.codes.filter(code => code.id !== ids.codeId) } : b) } : c));
        break;
    }
  };

  return (
    <div className="animate-bottom">
      <Modal state={modalState} onClose={() => setModalState({ isOpen: false, mode: null })} onSubmit={handleFormSubmit} />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)]">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h6 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">ICD Configuration Manager</h6>
          <div className="flex items-center space-x-2">
             <div className="relative">
                <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                   type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                   placeholder="Search code or description..."
                   className="w-64 pl-8 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
             </div>
             <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Save Configuration</button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-3 border-r border-gray-100 flex flex-col">
             <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h6 className="text-[11px] font-bold text-gray-500 uppercase px-2">ICD Chapters</h6>
                <button onClick={() => setModalState({ isOpen: true, mode: 'addChapter' })} className="bg-blue-50 text-blue-600 text-xs w-6 h-6 rounded hover:bg-blue-100"><i className="fa fa-plus"></i></button>
             </div>
             <div className="overflow-y-auto flex-1">
                {filteredChapters.map(chapter => (
                  <div key={chapter.id} onClick={() => setSelectedChapterId(chapter.id)}
                    className={`p-4 group relative cursor-pointer transition-colors border-b border-gray-100 ${selectedChapterId === chapter.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                     <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setModalState({ isOpen: true, mode: 'editChapter', data: chapter }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-blue-100 hover:text-blue-600"><i className="fa fa-pencil-alt"></i></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete('chapter', { chapterId: chapter.id }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-red-100 hover:text-red-600"><i className="fa fa-trash-alt"></i></button>
                     </div>
                     <p className="text-[10px] font-black text-blue-600 uppercase">Chapter {chapter.id} ({chapter.codeRange})</p>
                     <h5 className="text-xs font-bold text-gray-800 pr-12">{chapter.title}</h5>
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-9 overflow-y-auto p-6">
             {selectedChapter ? (
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedChapter.title}</h3>
                         <p className="text-sm text-gray-400 font-mono">Code Range: {selectedChapter.codeRange}</p>
                      </div>
                      <button onClick={() => setModalState({ isOpen: true, mode: 'addBlock', context: { chapterId: selectedChapter.id } })} className="bg-blue-50 text-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase rounded border border-blue-100 hover:bg-blue-100">Add Block</button>
                   </div>
                   <div className="space-y-2">
                      {selectedChapter.blocks.map(block => (
                        <div key={block.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                           <div onClick={() => toggleBlock(block.id)} className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-gray-700">{block.title}</p>
                                 <p className="text-[10px] text-gray-400 font-mono">{block.id}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); setModalState({ isOpen: true, mode: 'editBlock', data: block, context: { chapterId: selectedChapter.id } }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-blue-100 hover:text-blue-600"><i className="fa fa-pencil-alt"></i></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('block', { chapterId: selectedChapter.id, blockId: block.id }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-red-100 hover:text-red-600"><i className="fa fa-trash-alt"></i></button>
                                 </div>
                                 <i className={`fa fa-chevron-down text-xs text-gray-400 transition-transform ${expandedBlocks.includes(block.id) ? 'rotate-180' : ''}`}></i>
                              </div>
                           </div>
                           {expandedBlocks.includes(block.id) && (
                              <div className="p-2">
                                {block.codes.map(code => (
                                  <div key={code.id} className="p-3 flex justify-between items-center group hover:bg-blue-50/50 rounded">
                                    <div className="flex-1">
                                      <p className="font-mono text-xs font-bold text-blue-700">{code.id}</p>
                                      <p className="text-xs text-gray-600">{code.title}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={code.enabled} 
                                          onChange={() => toggleCodeEnabled(block.id, code.id)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                      </label>
                                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); setModalState({ isOpen: true, mode: 'editCode', data: code, context: { chapterId: selectedChapter.id, blockId: block.id } }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-blue-100 hover:text-blue-600"><i className="fa fa-pencil-alt"></i></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('code', { chapterId: selectedChapter.id, blockId: block.id, codeId: code.id }); }} className="w-6 h-6 text-xs bg-white/50 text-gray-400 rounded hover:bg-red-100 hover:text-red-600"><i className="fa fa-trash-alt"></i></button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="p-3 text-center">
                                   <button onClick={() => setModalState({ isOpen: true, mode: 'addCode', context: { chapterId: selectedChapter.id, blockId: block.id } })} className="text-blue-600 text-[10px] font-bold uppercase hover:underline">Add Code</button>
                                </div>
                              </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <i className="fa fa-book-medical text-5xl mb-4 opacity-30"></i>
                   <p className="font-bold uppercase tracking-widest text-xs">Select a chapter to view codes</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICDConfiguration;
