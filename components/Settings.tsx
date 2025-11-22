import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { User, Key, Bell, Save, CheckCircle, Loader2, Upload, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Developer',
    email: 'alex@example.com',
    avatar: '',
    bio: 'Full-stack AI enthusiast building the future.',
    role: 'Pro User'
  });
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) setApiKey(savedKey);
    
    const savedProfile = localStorage.getItem('USER_PROFILE');
    if (savedProfile) {
        try {
            setProfile(JSON.parse(savedProfile));
        } catch (e) {
            console.error("Failed to load profile", e);
        }
    }
  }, []);

  const handleSave = async (silent = false) => {
    setIsSaving(true);
    if (!silent) setSaveMessage('');
    
    // Simulate API save delay (minimal)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    localStorage.setItem('USER_PROFILE', JSON.stringify(profile));
    
    setIsSaving(false);
    if (!silent) {
      setSaveMessage('Settings saved');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Auto-save handler for onBlur
  const handleAutoSave = () => {
    handleSave(true);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleProfileChange('avatar', result);
        // Auto-save image immediately
        setTimeout(() => handleSave(true), 100);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <div className="flex items-center gap-3">
            {isSaving && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="animate-spin" size={12}/> Saving...</span>}
            {saveMessage && (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                <CheckCircle size={16} /> {saveMessage}
            </div>
            )}
        </div>
      </div>

      {/* Profile Section */}
      <Card title="Public Profile" subtitle="Manage your public appearance">
        <div className="flex flex-col md:flex-row gap-8">
           <div className="flex flex-col items-center gap-4">
             <div 
               onClick={handleAvatarClick}
               className="w-32 h-32 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden relative group cursor-pointer transition-all hover:border-brand-500"
             >
               {profile.avatar ? (
                 <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <User size={48} className="text-slate-500" />
               )}
               <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                 <span className="text-xs font-medium text-white flex flex-col items-center gap-2">
                    <Upload size={20} />
                    Upload Photo
                 </span>
               </div>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
               />
             </div>
             <button 
                onClick={() => { handleProfileChange('avatar', ''); handleAutoSave(); }} 
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
             >
                Remove Picture
             </button>
           </div>
           
           <div className="flex-1 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
                 <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    onBlur={handleAutoSave}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                 <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    onBlur={handleAutoSave}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
                 />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
               <textarea 
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  onBlur={handleAutoSave}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none h-24 resize-none transition-colors"
               />
             </div>
           </div>
        </div>
      </Card>

      {/* API Configuration */}
      <Card title="API Configuration" subtitle="Manage your AI keys">
        <div className="space-y-4">
          <div className="p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg flex items-start gap-3">
            <Key className="text-brand-400 mt-1" size={20} />
            <div>
              <h4 className="text-sm font-bold text-brand-400">Gemini API Key Required</h4>
              <p className="text-xs text-slate-400 mt-1">To use App Builder, Video, and Search, you need a valid Google Gemini API Key.</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Google Gemini API Key</label>
            <div className="flex gap-2 relative">
              <input 
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onBlur={handleAutoSave}
                placeholder="AIzaSy..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-sm text-slate-100 focus:border-brand-500 focus:outline-none pr-10"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-40 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button 
                onClick={() => handleSave()}
                disabled={isSaving}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Stored locally in your browser.</p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications" subtitle="Manage alerts and emails">
        <div className="space-y-4">
          {[
            { id: 'email', label: 'Email Notifications', desc: 'Receive weekly summaries and updates' },
            { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts for app generations' },
            { id: 'marketing', label: 'Product Updates', desc: 'News about features and tutorials' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded hover:bg-slate-900 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded text-slate-400">
                  <Bell size={16} />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-200">{item.label}</p>
                   <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                     setNotifications(prev => {
                        const newState = { ...prev, [item.id]: !prev[item.id as keyof typeof notifications] };
                        // Auto save notifications would typically go here
                        return newState;
                     });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-brand-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.id as keyof typeof notifications] ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};