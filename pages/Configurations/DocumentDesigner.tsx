
import React, { useState, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface DocStyle {
    backgroundColor: string;
    pattern: 'none' | 'dots' | 'grid' | 'lines';
    accentColor: string;
    fontFamily: 'serif' | 'sans' | 'mono';
}

interface Template {
    id: string;
    title: string;
    category: 'Clinical' | 'Financial' | 'Consent' | 'HR' | 'Report';
    content: string;
    status: 'Live' | 'Draft';
    lastUpdated: string;
    style: DocStyle;
}

const PLACEHOLDERS = {
    "Patient": ["Patient_Full_Name", "Patient_OP_Number", "Patient_Age", "Patient_Gender", "Patient_ID_No", "Patient_Phone", "Patient_Residence"],
    "Clinical": ["Visit_Date", "Attending_Doctor", "Primary_Diagnosis", "Chief_Complaint", "Examination_Notes", "Management_Plan", "Incision_Details", "Surgical_Findings"],
    "Consent": ["Consent_Statement", "Procedure_Name", "Risk_Factors", "Witness_Name", "Signature_Patient", "Signature_Witness", "Signature_Doctor"],
    "Financial": ["Invoice_Number", "Bill_Date", "Payer_Scheme", "Total_Billed", "Amount_Paid", "Balance_Due", "Receipt_Number"],
    "Report Components": ["Chart_Revenue_Trend", "Table_Patient_List", "Summary_Stats_Grid", "Department_Efficiency_Index", "Financial_KPI_Box"],
    "Design Elements": ["Shape_Line_Bold", "Shape_Line_Thin", "Shape_Box_Container", "Page_Break", "Watermark_Confidential", "Watermark_Draft"],
    "System": ["Hospital_Logo", "Hospital_Name", "Hospital_Address", "Branch_Name", "Current_User", "Current_Time", "System_Barcode", "Digital_Signature_Placeholder"],
};

const DEFAULT_STYLE: DocStyle = {
    backgroundColor: '#ffffff',
    pattern: 'none',
    accentColor: '#2563eb',
    fontFamily: 'serif'
};

const INITIAL_TEMPLATES: Template[] = [
    { id: '1', title: 'Consultation Report', category: 'Clinical', status: 'Live', lastUpdated: '24 Oct 2023', style: DEFAULT_STYLE, content: "[Hospital_Logo]\n\n# CLINICAL ENCOUNTER REPORT\n\n**PATIENT NAME:** [Patient_Full_Name]\n**OP NUMBER:** [Patient_OP_Number]\n**DATE:** [Visit_Date]\n\n[Shape_Line_Bold]\n\n## CHIEF COMPLAINT\n[Chief_Complaint]\n\n## CLINICAL FINDINGS\n[Examination_Notes]\n\n## ASSESSMENT & PLAN\n**Diagnosis:** [Primary_Diagnosis]\n**Plan:** [Management_Plan]\n\n[Shape_Line_Thin]\n**Signed:** [Attending_Doctor]\n[Digital_Signature_Placeholder]" },
    { id: '2', title: 'Monthly Revenue Summary', category: 'Report', status: 'Live', lastUpdated: '25 Oct 2023', style: { ...DEFAULT_STYLE, backgroundColor: '#f8fafc', pattern: 'grid', accentColor: '#059669' }, content: "[Hospital_Logo]\n# EXECUTIVE FINANCIAL REPORT\n### Period: [Current_Time]\n\n[Summary_Stats_Grid]\n\n[Shape_Line_Bold]\n\n## Revenue Trends\n[Chart_Revenue_Trend]\n\n[Shape_Line_Thin]\n\n## Outstanding Balances\n[Financial_KPI_Box]\n\n[Watermark_Confidential]" },
    { id: '3', title: 'Surgical Consent Form', category: 'Consent', status: 'Live', lastUpdated: '22 Oct 2023', style: DEFAULT_STYLE, content: "[Hospital_Logo]\n# SURGICAL CONSENT FORM\n\nI, **[Patient_Full_Name]**, holder of ID **[Patient_ID_No]**, hereby authorize **[Attending_Doctor]** to perform the following procedure: **[Procedure_Name]**.\n\n### ACKNOWLEDGEMENTS\n1. I have been informed of the nature and purpose of the procedure.\n2. Potential risks including **[Risk_Factors]** have been discussed.\n\n[Shape_Box_Container]\n**Patient Signature:** [Signature_Patient]\n**Date:** [Current_Time]\n[/Shape_Box_Container]" },
];

const DocumentDesigner: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
    const [activeTemplateId, setActiveTemplateId] = useState<string | null>(templates[0].id);
    const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'style'>('editor');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeTemplate = useMemo(() => 
        templates.find(t => t.id === activeTemplateId), 
    [templates, activeTemplateId]);

    const handleUpdateContent = (content: string) => {
        if (!activeTemplateId) return;
        setTemplates(prev => prev.map(t => t.id === activeTemplateId ? { ...t, content, lastUpdated: 'Just now' } : t));
    };

    const handleUpdateStyle = (newStyle: Partial<DocStyle>) => {
        if (!activeTemplateId) return;
        setTemplates(prev => prev.map(t => t.id === activeTemplateId ? { ...t, style: { ...t.style, ...newStyle } } : t));
    };

    const insertPlaceholder = (tag: string) => {
        if (!textareaRef.current || !activeTemplate) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = activeTemplate.content;
        const before = text.substring(0, start);
        const after = text.substring(end);
        handleUpdateContent(`${before}[${tag}]${after}`);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(start + tag.length + 2, start + tag.length + 2);
            }
        }, 0);
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt) return;
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Create a professional document template for a hospital system. The document type is: ${aiPrompt}. 
                Include appropriate placeholders using square brackets like [Patient_Full_Name], [Visit_Date], or [Chart_Revenue_Trend].
                Use Markdown for structure. Incorporate [Shape_Line_Bold] for headers.`,
                config: { systemInstruction: "You are a Medical Systems Analyst. Output ONLY the template text with placeholders." }
            });
            if (response.text) handleUpdateContent(response.text);
        } catch (e) {
            alert("AI service unavailable.");
        } finally {
            setIsAiLoading(false);
            setAiPrompt('');
        }
    };

    const getPatternStyle = (pattern: string) => {
        switch(pattern) {
            case 'dots': return 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]';
            case 'grid': return 'bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]';
            case 'lines': return 'bg-[linear-gradient(#f8fafc_1px,transparent_1px)] [background-size:100%_24px]';
            default: return '';
        }
    };

    const renderPreview = (content: string, style: DocStyle) => {
        let preview = content;
        
        // Custom Renderers for special shapes and components
        preview = preview.replace(/\[Shape_Line_Bold\]/g, `<div style="height: 3px; background-color: ${style.accentColor}; margin: 1.5rem 0; border-radius: 99px;"></div>`);
        preview = preview.replace(/\[Shape_Line_Thin\]/g, `<div style="height: 1px; background-color: #e2e8f0; margin: 1rem 0;"></div>`);
        preview = preview.replace(/\[Shape_Box_Container\]/g, `<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0; background: #fdfdfd;">`);
        preview = preview.replace(/\[\/Shape_Box_Container\]/g, `</div>`);
        
        // Mock Report Components
        preview = preview.replace(/\[Chart_Revenue_Trend\]/g, `<div class="bg-gray-50 border border-gray-100 rounded-xl p-4 my-4 flex items-end justify-between h-32 space-x-1">${[40,70,50,90,60,80,95].map(h => `<div style="height:${h}%; width:12%; background:${style.accentColor}; border-radius:4px 4px 0 0;"></div>`).join('')}</div>`);
        preview = preview.replace(/\[Summary_Stats_Grid\]/g, `<div class="grid grid-cols-3 gap-4 my-6">${[1,2,3].map(i => `<div class="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm"><p class="text-[10px] text-gray-400 uppercase font-black">Metric ${i}</p><p class="text-lg font-black" style="color: ${style.accentColor}">84.2%</p></div>`).join('')}</div>`);
        preview = preview.replace(/\[Digital_Signature_Placeholder\]/g, `<div class="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-300 font-mono text-[9px] uppercase tracking-widest">Digital Signature Required</div>`);
        
        // Watermarks
        preview = preview.replace(/\[Watermark_Confidential\]/g, `<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-red-500/10 text-9xl font-black pointer-events-none select-none uppercase">CONFIDENTIAL</div>`);

        // Standard Placeholders
        Object.values(PLACEHOLDERS).flat().forEach(p => {
            const regex = new RegExp('\\\\[' + p + '\\\\]', 'g');
            preview = preview.replace(regex, `<span class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold text-[10px] italic">{${p.replace(/_/g, ' ')}}</span>`);
        });
        
        return (
            <div 
                className={`prose prose-sm max-w-none leading-relaxed text-gray-800 ${style.fontFamily === 'serif' ? 'font-serif' : style.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`}
                dangerouslySetInnerHTML={{ __html: preview.replace(/\n/g, '<br/>') }} 
            />
        );
    };

    return (
        <div className="animate-bottom space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* Header Area */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#1e293b] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                        <i className="fa fa-pencil-ruler"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Form & Report Architect</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Document Designer Engine</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                        <button 
                            onClick={() => setViewMode('editor')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'editor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <i className="fa fa-edit mr-2"></i> Design
                        </button>
                        <button 
                            onClick={() => setViewMode('style')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'style' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <i className="fa fa-palette mr-2"></i> Style
                        </button>
                        <button 
                            onClick={() => setViewMode('preview')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <i className="fa fa-eye mr-2"></i> Preview
                        </button>
                    </div>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow hover:bg-green-700 transition">
                        <i className="fa fa-save mr-2"></i> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Left Panel: Library */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Template Library</h6>
                        <button className="text-blue-600 text-[10px] font-black uppercase hover:underline" onClick={() => { setActiveTemplateId(null); setViewMode('editor'); }}>+ New</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50/30 scrollbar-hide">
                        {templates.map(t => (
                            <div 
                                key={t.id}
                                onClick={() => setActiveTemplateId(t.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all ${activeTemplateId === t.id ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-100' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase border ${t.status === 'Live' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{t.category}</span>
                                </div>
                                <h6 className="text-xs font-black text-gray-800 uppercase leading-snug">{t.title}</h6>
                                <p className="text-[9px] text-gray-400 mt-2 font-mono">ID: {t.id} • {t.lastUpdated}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Panel: Workspace */}
                <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    {activeTemplate || activeTemplateId === null ? (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                                <div className="flex-1 max-w-md">
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent text-sm font-black text-gray-800 uppercase tracking-tighter outline-none"
                                        value={activeTemplate?.title || ''}
                                        placeholder="UNTITLED TEMPLATE"
                                        onChange={(e) => {
                                            if (!activeTemplateId) return;
                                            setTemplates(prev => prev.map(t => t.id === activeTemplateId ? { ...t, title: e.target.value } : t));
                                        }}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text" 
                                        placeholder="AI: Describe the template..." 
                                        className="p-1.5 border border-gray-200 rounded-lg text-[10px] w-40 outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={aiPrompt}
                                        onChange={e => setAiPrompt(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleAiGenerate}
                                        disabled={isAiLoading || !aiPrompt}
                                        className="bg-[#1e293b] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black transition disabled:opacity-50 shadow"
                                        title="Generate with AI"
                                    >
                                        {isAiLoading ? <i className="fa fa-spinner fa-spin text-[10px]"></i> : <i className="fa fa-magic text-[10px]"></i>}
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'editor' ? (
                                <textarea 
                                    ref={textareaRef}
                                    className="flex-1 p-8 font-mono text-xs leading-relaxed outline-none resize-none bg-white text-gray-700 scrollbar-hide"
                                    value={activeTemplate?.content || ''}
                                    onChange={(e) => handleUpdateContent(e.target.value)}
                                    placeholder="Begin designing your form or report. Use [Tags] for dynamic data or Design Elements for layout..."
                                ></textarea>
                            ) : viewMode === 'style' ? (
                                <div className="flex-1 p-8 bg-gray-50 space-y-8 overflow-y-auto">
                                    <div>
                                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Document Background</h6>
                                        <div className="grid grid-cols-4 gap-4">
                                            {['#ffffff', '#fdfbf7', '#f8fafc', '#f0fdf4'].map(c => (
                                                <button 
                                                    key={c}
                                                    onClick={() => handleUpdateStyle({ backgroundColor: c })}
                                                    className={`aspect-video rounded-xl border-2 shadow-sm transition-all ${activeTemplate?.style.backgroundColor === c ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-white hover:border-gray-200'}`}
                                                    style={{ backgroundColor: c }}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Paper Texture & Patterns</h6>
                                        <div className="grid grid-cols-4 gap-4">
                                            {['none', 'dots', 'grid', 'lines'].map(p => (
                                                <button 
                                                    key={p}
                                                    onClick={() => handleUpdateStyle({ pattern: p as any })}
                                                    className={`aspect-video rounded-xl border-2 transition-all overflow-hidden ${activeTemplate?.style.pattern === p ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <div className={`w-full h-full bg-white ${getPatternStyle(p)} flex items-center justify-center text-[10px] font-black uppercase text-gray-400`}>
                                                        {p}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Brand Accent Color</h6>
                                            <input 
                                                type="color" 
                                                value={activeTemplate?.style.accentColor} 
                                                onChange={e => handleUpdateStyle({ accentColor: e.target.value })}
                                                className="w-full h-12 rounded-xl cursor-pointer border border-gray-200 overflow-hidden" 
                                            />
                                        </div>
                                        <div>
                                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Typography</h6>
                                            <select 
                                                value={activeTemplate?.style.fontFamily}
                                                onChange={e => handleUpdateStyle({ fontFamily: e.target.value as any })}
                                                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none"
                                            >
                                                <option value="serif">Standard Serif (Official)</option>
                                                <option value="sans">Clean Sans (Modern)</option>
                                                <option value="mono">Technical Mono (Laboratory)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 bg-slate-200 p-8 overflow-y-auto flex justify-center custom-scrollbar">
                                    <div 
                                        className={`bg-white shadow-2xl w-full max-w-[21cm] min-h-[29.7cm] p-16 overflow-hidden border border-gray-300 relative ${activeTemplate ? getPatternStyle(activeTemplate.style.pattern) : ''}`}
                                        style={{ backgroundColor: activeTemplate?.style.backgroundColor }}
                                    >
                                        {activeTemplate ? renderPreview(activeTemplate.content, activeTemplate.style) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <i className="fa fa-file-invoice text-6xl mb-4 opacity-10"></i>
                            <p className="text-sm font-bold uppercase tracking-widest">Select a template to customize</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: Data Tags & Tools */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Component Explorer</h6>
                        <i className="fa fa-info-circle text-gray-300" title="Click a component to insert into the editor"></i>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="space-y-6">
                            {Object.entries(PLACEHOLDERS).map(([group, tags]) => (
                                <div key={group}>
                                    <h6 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-3 border-b border-indigo-50 pb-1">{group}</h6>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(tag => (
                                            <button 
                                                key={tag}
                                                onClick={() => insertPlaceholder(tag)}
                                                className="px-2 py-1 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-sm"
                                            >
                                                {tag.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <p className="text-[9px] text-amber-800 leading-relaxed font-bold">
                                <i className="fa fa-lightbulb mr-1"></i>
                                TIP: Use the <strong>Style</strong> tab to change document colors, paper textures, and patterns for official reports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDesigner;
