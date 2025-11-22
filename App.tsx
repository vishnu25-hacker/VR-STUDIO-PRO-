
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AppBuilder } from './components/AppBuilder';
import { PromptGenerator } from './components/PromptGenerator';
import { Marketplace } from './components/Marketplace';
import { Settings } from './components/Settings';
import { VideoGenerator } from './components/VideoGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { View, SearchResult } from './types';
import { Bell, Search, User, X, ExternalLink, Loader2, Globe } from 'lucide-react';
import { performGlobalSearch } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults(null);
    
    // Perform actual AI search
    const results = await performGlobalSearch(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.APP_BUILDER: return <AppBuilder />;
      case View.PROMPT_GENERATOR: return <PromptGenerator />;
      case View.MARKETPLACE: return <Marketplace />;
      case View.SETTINGS: return <Settings />;
      case View.VIDEO_GENERATOR: return <VideoGenerator />;
      case View.IMAGE_GENERATOR: return <ImageGenerator />;
      default: return <div className="text-slate-400 p-10 text-center">View under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 z-20 relative">
          
          {/* Search Bar */}
          <div className="flex items-center gap-4 w-1/3 relative">
            <form onSubmit={handleSearch} className="relative w-full max-w-md z-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, internet, or commands..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-10 pr-10 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              {searchQuery && (
                 <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                   <X size={14} />
                 </button>
              )}
            </form>

            {/* Search Results Dropdown */}
            {(isSearching || searchResults) && (
               <div className="absolute top-full left-0 w-[600px] mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                 {isSearching ? (
                   <div className="p-8 flex flex-col items-center text-slate-400">
                     <Loader2 className="animate-spin mb-2" size={24} />
                     <p className="text-sm">Searching Google & App...</p>
                   </div>
                 ) : (
                   <div className="p-2">
                      <div className="flex justify-between items-center px-3 py-2 border-b border-slate-800 mb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase">Search Results</span>
                         <span className="text-xs bg-brand-900 text-brand-300 px-2 py-0.5 rounded flex items-center gap-1"><Globe size={10}/> Google Grounding</span>
                      </div>
                      {searchResults?.map((res, idx) => (
                        <div key={idx} className="p-3 hover:bg-slate-800 rounded-lg transition-colors">
                          <div className="flex items-start gap-3">
                             <div className="p-2 bg-slate-800 rounded-lg">
                                {res.type === 'WEB' ? <Globe size={18} className="text-blue-400"/> : <Search size={18} className="text-purple-400"/>}
                             </div>
                             <div className="flex-1">
                               <h4 className="text-sm font-bold text-slate-200 mb-1">{res.title}</h4>
                               <p className="text-xs text-slate-400 leading-relaxed mb-2">{res.content}</p>
                               {res.url && (
                                 <a href={res.url} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                                   Visit Source <ExternalLink size={10} />
                                 </a>
                               )}
                             </div>
                          </div>
                        </div>
                      ))}
                      {searchResults?.length === 0 && (
                        <div className="p-4 text-center text-slate-500 text-sm">No results found.</div>
                      )}
                   </div>
                 )}
               </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative transition-colors ${showNotifications ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                   <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <h4 className="font-bold text-sm">Notifications</h4>
                      <button className="text-xs text-brand-400 hover:text-brand-300">Mark all read</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                      {[1,2,3].map(i => (
                        <div key={i} className="p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                           <div className="flex gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-brand-500 shrink-0"></div>
                              <div>
                                <p className="text-sm text-slate-200 mb-1">New App Template Available</p>
                                <p className="text-xs text-slate-500">Check out the new Marketing Bot template in the builder.</p>
                                <p className="text-[10px] text-slate-600 mt-2">2 hours ago</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800 cursor-pointer" onClick={() => setCurrentView(View.SETTINGS)}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">Alex Developer</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center border border-slate-700 shadow-lg hover:ring-2 ring-brand-500 transition-all">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8 scroll-smooth relative z-10" onClick={() => {
          if (isSearching || searchResults) clearSearch();
        }}>
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px]"></div>
            <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]"></div>
        </div>
      </main>
    </div>
  );
};

export default App;
