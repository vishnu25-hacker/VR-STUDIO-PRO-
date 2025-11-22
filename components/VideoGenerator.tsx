import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Video, Film, Upload, Play, Loader2, AlertCircle, Download, Clock } from 'lucide-react';
import { generateVideo, checkApiKey } from '../services/geminiService';

export const VideoGenerator: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [duration, setDuration] = useState('5'); // Default 5s as per Veo preview
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const hasKey = checkApiKey();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const getBase64Data = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    if (mode === 'image' && !selectedImage) return;

    setIsGenerating(true);
    setVideoUrl(null);
    setError('');

    try {
      const imageBytes = selectedImage ? getBase64Data(selectedImage) : undefined;
      const durSec = parseInt(duration);
      const url = await generateVideo(prompt, mode === 'image' ? imageBytes : undefined, durSec);
      
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Video generation failed. Please try again.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred. Videos take time to generate, check your quota.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `generated-video-${Date.now()}.mp4`;
        a.target = '_blank'; // Required for some signed URLs
        a.click();
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Video Studio <span className="text-xs font-normal text-brand-400 border border-brand-500/30 rounded px-2 py-0.5 ml-2">Powered by Veo</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Configuration">
             {!hasKey && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex gap-2 items-center">
                  <AlertCircle size={16} />
                  <span>API Key missing.</span>
                </div>
              )}

            <div className="space-y-4">
               <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setMode('text')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'text' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Text to Video
                  </button>
                  <button 
                    onClick={() => setMode('image')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'image' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Image to Video
                  </button>
               </div>

               {mode === 'image' && (
                 <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-900 transition-colors relative overflow-hidden">
                    {selectedImage ? (
                      <img src={selectedImage} alt="Reference" className="w-full h-40 object-contain z-10" />
                    ) : (
                      <>
                        <Upload className="text-slate-500 mb-2" size={24} />
                        <p className="text-sm text-slate-400">Upload Reference Image</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                    />
                 </div>
               )}

               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Duration</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                     <Clock size={16} className="text-slate-500"/>
                     <select 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-transparent w-full text-slate-200 text-sm focus:outline-none"
                     >
                        <option value="5">5 Seconds (Preview)</option>
                        <option value="10">10 Seconds</option>
                        <option value="30">30 Seconds</option>
                        <option value="60">1 Minute</option>
                     </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Note: Generated length depends on AI model capabilities.</p>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Prompt</label>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder={mode === 'text' ? "A cinematic drone shot of a futuristic city..." : "Animate this character walking..."}
                   className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-brand-500 focus:outline-none resize-none"
                 />
               </div>

               <button
                 onClick={handleGenerate}
                 disabled={isGenerating || !hasKey || !prompt}
                 className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isGenerating ? (
                   <>
                    <Loader2 className="animate-spin" size={18} /> Generating...
                   </>
                 ) : (
                   <>
                    <Film size={18} /> Generate Video
                   </>
                 )}
               </button>
               
               {isGenerating && (
                 <p className="text-xs text-slate-500 text-center animate-pulse">
                   Video generation can take 1-2 minutes. Please wait.
                 </p>
               )}
            </div>
          </Card>
        </div>

        {/* Player */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <div className="flex-1 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
              {videoUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                   <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="max-w-full max-h-[80%] rounded shadow-2xl mb-4"
                  />
                  <button 
                    onClick={handleDownload}
                    className="absolute top-4 right-4 bg-slate-900/80 hover:bg-brand-600 backdrop-blur text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                     <Download size={16} /> Download Video
                  </button>
                </div>
              ) : (
                <div className="text-center p-8">
                   {isGenerating ? (
                     <div className="flex flex-col items-center">
                       <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                       <h3 className="text-xl font-bold text-slate-200">Creating Magic</h3>
                       <p className="text-slate-500 mt-2">Veo is rendering your video frame by frame...</p>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center text-slate-600">
                       <Video size={48} className="mb-4 opacity-50" />
                       <p className="text-lg font-medium">No Video Generated</p>
                       <p className="text-sm">Configure the settings and click Generate.</p>
                     </div>
                   )}
                </div>
              )}
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                  <AlertCircle size={16}/> {error}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};