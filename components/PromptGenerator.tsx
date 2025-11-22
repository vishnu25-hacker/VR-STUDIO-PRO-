
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Sparkles, Copy, RefreshCw, History, ChevronRight, Sliders } from 'lucide-react';
import { optimizePrompt } from '../services/geminiService';
import { GeneratedPrompt } from '../types';

const TEMPLATES = [
  { id: '1', name: 'SEO Article Writer', category: 'Marketing', desc: 'Generate high-ranking blog posts' },
  { id: '2', name: 'Python Debugger', category: 'Coding', desc: 'Find and fix bugs in code' },
  { id: '3', name: 'Email Professional', category: 'Business', desc: 'Polite but firm email templates' },
  { id: '4', name: 'React Component', category: 'Coding', desc: 'Create modern UI components' },
  { id: '5', name: 'Social Media Caption', category: 'Marketing', desc: 'Viral hooks for Instagram/LinkedIn' },
  { id: '6', name: 'Legal Contract Review', category: 'Legal', desc: 'Analyze contracts for risks' },
  { id: '7', name: 'Lesson Plan Creator', category: 'Education', desc: 'Structure simple lesson plans' },
  { id: '8', name: 'Story Plot Generator', category: 'Creative', desc: 'Create engaging story arcs' },
  { id: '9', name: 'SQL Query Builder', category: 'Coding', desc: 'Complex joins and aggregations' },
  { id: '10', name: 'Product Description', category: 'E-commerce', desc: 'Convert features to benefits' },
];

const EXTENDED_CATEGORIES = [
  'Business', 'Coding', 'Creative', 'Marketing', 'Academic',
  'Social Media', 'E-commerce', 'SEO', 'Email', 'Legal', 
  'HR', 'Real Estate', 'Health', 'Finance', 'Travel'
];

export const PromptGenerator: React.FC = () => {
  const [rawInput, setRawInput] = useState('');
  const [tone, setTone] = useState('Professional');
  const [category, setCategory] = useState('Business');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [activeView, setActiveView] = useState<'generator' | 'history'>('generator');
  const [showConfig, setShowConfig] = useState(false);

  const handleGenerate = async () => {
    if (!rawInput.trim()) return;
    setIsGenerating(true);
    try {
      const optimized = await optimizePrompt(rawInput, tone, category);
      setResult(optimized);
      
      // Add to history
      const newHistoryItem: GeneratedPrompt = {
        id: Date.now().toString(),
        title: rawInput.substring(0, 30) + '...',
        content: optimized,
        category,
        createdAt: new Date().toLocaleTimeString()
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (e) {
      setResult("Error generating prompt. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplate = (template: any) => {
    setCategory(template.category);
    setRawInput(`I need a ${template.name} that...`);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Templates Sidebar */}
      <div className="w-64 flex-shrink-0 hidden xl:flex flex-col gap-4">
        <Card title="Templates" className="h-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2">
            {TEMPLATES.map(t => (
              <button 
                key={t.id} 
                onClick={() => loadTemplate(t)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-200 text-sm">{t.name}</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-brand-400" />
                </div>
                <p className="text-xs text-slate-500 truncate">{t.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Generator Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col gap-6 h-full">
          <Card className="flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
               <h3 className="text-lg font-semibold">Prompt Builder</h3>
               <button 
                 onClick={() => setShowConfig(!showConfig)}
                 className={`p-2 rounded transition-colors ${showConfig ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'}`}
               >
                 <Sliders size={18} />
               </button>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col">
               {showConfig && (
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 animate-in fade-in slide-in-from-top-2 mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
                      {EXTENDED_CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                            category === c 
                              ? 'bg-brand-600 border-brand-500 text-white' 
                              : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tone</label>
                    <select 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Persuasive</option>
                      <option>Technical</option>
                      <option>Empathetic</option>
                      <option>Humorous</option>
                      <option>Authoritative</option>
                    </select>
                 </div>
               )}

               <div className="flex-1 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-400">Raw Idea</label>
                    <span className="text-xs text-brand-400">{category} / {tone}</span>
                  </div>
                  <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Describe what you want the prompt to achieve..."
                    className="w-full flex-1 min-h-[150px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-brand-500 focus:outline-none resize-none"
                  />
               </div>

               <button
                onClick={handleGenerate}
                disabled={isGenerating || !rawInput.trim()}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Optimize Prompt
              </button>
            </div>
          </Card>
        </div>

        {/* Output & History */}
        <div className="h-full flex flex-col gap-6">
          <Card title="Result" className="h-full flex flex-col"
            action={result && <button onClick={() => handleCopy(result)}><Copy size={16} className="text-slate-400 hover:text-white" /></button>}
          >
             <div className="flex-1 bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-y-auto text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
               {result || <span className="text-slate-600 italic">Optimized prompt will appear here...</span>}
             </div>
          </Card>
          
          <Card title="History" className="h-1/2 flex flex-col">
             <div className="flex-1 overflow-y-auto pr-2 space-y-3">
               {history.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No history yet</p>}
               {history.map(h => (
                 <div key={h.id} className="p-3 bg-slate-900 rounded border border-slate-800 group hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-brand-400 uppercase">{h.category}</span>
                      <span className="text-xs text-slate-500">{h.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">{h.content}</p>
                    <button 
                      onClick={() => { setResult(h.content); handleCopy(h.content); }}
                      className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                    >
                      <Copy size={10} /> Load & Copy
                    </button>
                 </div>
               ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
