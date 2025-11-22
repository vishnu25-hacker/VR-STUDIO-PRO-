
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Image as ImageIcon, Download, Settings2, Loader2, Maximize } from 'lucide-react';
import { generateImage, checkApiKey } from '../services/geminiService';

const CATEGORIES = [
  'Logo', 'Poster', 'Web UI', 'Sticker', 'Wallpaper', 
  'Portrait', 'Landscape', 'Icon', 'Infographic', 'Texture'
];

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const hasKey = checkApiKey();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Append category to prompt for better context
      const fullPrompt = category ? `${category} style: ${prompt}` : prompt;
      const result = await generateImage(fullPrompt, aspectRatio, quality);
      setGeneratedImage(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Image Studio</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Configuration" subtitle="Customize your generation">
             <div className="space-y-5">
                {/* Quality Selector */}
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model Quality</label>
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setQuality('standard')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${quality === 'standard' ? 'bg-brand-600/20 border-brand-500 text-brand-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                      >
                        Standard
                        <span className="block text-[10px] font-normal opacity-70">Fast • Flash</span>
                      </button>
                      <button 
                        onClick={() => setQuality('hd')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${quality === 'hd' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                      >
                        HD Professional
                        <span className="block text-[10px] font-normal opacity-70">2K • Pro Model</span>
                      </button>
                   </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aspect Ratio</label>
                   <div className="grid grid-cols-5 gap-2">
                      {ASPECT_RATIOS.map(ratio => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`py-2 rounded text-xs font-medium border transition-colors ${aspectRatio === ratio ? 'bg-slate-100 text-slate-900 border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Style Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${category === cat ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-brand-500 focus:outline-none resize-none text-sm"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !hasKey || !prompt}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <ImageIcon size={18}/>}
                  Generate Image
                </button>
             </div>
          </Card>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col relative">
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              {generatedImage ? (
                <div className="relative group">
                  <img src={generatedImage} alt="Generated" className="max-w-full max-h-[600px] rounded shadow-2xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={generatedImage} download="generated-ai-image.png" className="p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors">
                      <Download size={24} />
                    </a>
                    <button className="p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors">
                      <Maximize size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-600">
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin mb-4 text-brand-500" size={48} />
                      <p>Generating visual masterpiece...</p>
                    </div>
                  ) : (
                    <>
                       <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                       <p>Enter a prompt to start generating</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
