
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    category: string;
    status: 'Live' | 'Draft' | 'Archived';
    views: number;
}

const BlogManager: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([
        { id: 1, title: 'Understanding Hypertension: A Modern Guide', author: 'Dr. James Wilson', date: '2023-10-20', category: 'Health Tips', status: 'Live', views: 1240 },
        { id: 2, title: 'Maternity Care: What to Expect at Metrolite', author: 'Nurse Sarah', date: '2023-10-22', category: 'Maternity', status: 'Live', views: 850 },
        { id: 3, title: 'New Pediatric Wing Announcement', author: 'Admin', date: '2023-10-24', category: 'News', status: 'Draft', views: 0 },
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiDraft, setAiDraft] = useState('');
    const [blogPrompt, setBlogPrompt] = useState('');
    
    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newCat, setNewCat] = useState('Health Tips');

    const generateAiDraft = async () => {
        if (!blogPrompt) return;
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Write a short medical blog draft about: ${blogPrompt}`,
                config: { systemInstruction: "You are a Medical Content Writer." }
            });
            setAiDraft(response.text || '');
        } catch (e) {
            setAiDraft("Service unavailable.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        const post: BlogPost = {
            id: Date.now(),
            title: newTitle,
            category: newCat,
            author: 'Current User',
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            views: 0
        };
        setPosts([post, ...posts]);
        setIsCreating(false);
        setNewTitle('');
    };

    return (
        <div className="animate-bottom space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-pen-nib"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Article Manager</h2>
                        <p className="text-xs text-gray-500 font-medium">Public health education and news editor.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition"
                >
                    <i className="fa fa-plus mr-2"></i> Create Article
                </button>
            </div>

            {isCreating ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Compose New Article</h3>
                        <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Article Title</label>
                                <input 
                                    type="text" required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                                    value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Category</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newCat} onChange={e => setNewCat(e.target.value)}>
                                    <option>Health Tips</option><option>Maternity</option><option>Hospital News</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">AI Writing Assistant</label>
                                <textarea 
                                    className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs h-24"
                                    placeholder="Enter keywords for AI to expand..."
                                    value={blogPrompt} onChange={e => setBlogPrompt(e.target.value)}
                                ></textarea>
                                <button type="button" onClick={generateAiDraft} className="text-[10px] font-black text-indigo-600 uppercase mt-2">Generate AI Text</button>
                             </div>
                        </div>
                        <div className="md:col-span-2 pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase">Discard</button>
                            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-xs font-black uppercase shadow-lg">Save Draft</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                            <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tight">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                                {posts.map(post => (
                                    <tr key={post.id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-6 py-4 font-black text-gray-800 uppercase truncate max-w-xs">{post.title}</td>
                                        <td className="px-6 py-4 uppercase">{post.category}</td>
                                        <td className="px-6 py-4">{post.author}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${post.status === 'Live' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>{post.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-pencil-alt"></i></button>
                                            <button className="text-gray-400 hover:text-red-600" onClick={() => setPosts(posts.filter(p => p.id !== post.id))}><i className="fa fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManager;
