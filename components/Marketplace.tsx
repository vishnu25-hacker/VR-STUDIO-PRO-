import React, { useState } from 'react';
import { MarketplaceApp } from '../types';
import { Star, Download, Heart, X, ShieldCheck, History, MessageSquare } from 'lucide-react';

const MOCK_APPS: MarketplaceApp[] = [
  { 
    id: 1, title: 'SEO Blog Writer', category: 'Marketing', rating: 4.9, downloads: '2.1k', author: 'AI Studio', price: 'Free',
    description: 'Generates SEO-optimized blog posts with proper keyword density and structure.',
    reviews: [{ user: 'John D.', rating: 5, comment: 'Amazing tool!' }, { user: 'Sarah', rating: 4, comment: 'Good but needs more tones.' }],
    versionHistory: [{ version: '1.0.2', date: '2023-10-01', notes: 'Fixed bugs' }]
  },
  { 
    id: 2, title: 'Python Debugger Pro', category: 'Coding', rating: 4.8, downloads: '1.5k', author: 'DevTools', price: '$5',
    description: 'Instantly finds syntax errors and logic bugs in Python scripts.',
    reviews: [], versionHistory: []
  },
  { 
    id: 3, title: 'Email Polisher', category: 'Business', rating: 4.7, downloads: '5.3k', author: 'ProWrite', price: 'Free',
    description: 'Turns rough notes into professional business emails.',
    reviews: [], versionHistory: []
  },
  { 
    id: 4, title: 'InstaCaption Gen', category: 'Social', rating: 4.6, downloads: '8.2k', author: 'ViralLabs', price: '$2',
    description: 'Viral captions for social media posts.',
    reviews: [], versionHistory: []
  },
  { 
    id: 5, title: 'Legal Contract Draft', category: 'Legal', rating: 4.9, downloads: '900', author: 'LawAI', price: '$15',
    description: 'Drafts NDA and Service Agreements in seconds.',
    reviews: [], versionHistory: []
  },
  { 
    id: 6, title: 'Recipe Imagineer', category: 'Lifestyle', rating: 4.5, downloads: '3.4k', author: 'FoodieTech', price: 'Free',
    description: 'Creates recipes from ingredients in your fridge.',
    reviews: [], versionHistory: []
  },
];

export const Marketplace: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);

  return (
    <div className="relative h-full">
      <div className="space-y-6 pb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">Marketplace</h2>
          <div className="flex gap-2">
            <select className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option>All Categories</option>
              <option>Business</option>
              <option>Coding</option>
              <option>Creative</option>
            </select>
            <select className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option>Popular</option>
              <option>Newest</option>
              <option>Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_APPS.map((app) => (
            <div 
              key={app.id} 
              onClick={() => setSelectedApp(app)}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/20 cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-brand-900/40 group-hover:to-slate-900 transition-colors p-6 flex items-center justify-center">
                 <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                   {app.title[0]}
                 </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-400">{app.category}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.price === 'Free' ? 'bg-green-500/10 text-green-500' : 'bg-brand-500/10 text-brand-500'}`}>
                    {app.price}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">{app.title}</h3>
                <p className="text-sm text-slate-500 mb-4">by {app.author}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>{app.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={14} />
                    <span>{app.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Details Drawer - Z-index increased to 60 to cover header */}
      {selectedApp && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl transform transition-transform z-[60] flex flex-col">
           <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
              <h3 className="text-xl font-bold">App Details</h3>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-brand-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {selectedApp.title[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedApp.title}</h2>
                  <p className="text-slate-400 text-sm">by {selectedApp.author}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                     <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> {selectedApp.rating}</span>
                     <span className="text-slate-500">|</span>
                     <span className="text-slate-400">{selectedApp.downloads} Downloads</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-colors">
                  {selectedApp.price === 'Free' ? 'Install App' : `Buy for ${selectedApp.price}`}
                </button>
                <button className="p-3 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-red-400 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase mb-3">About this App</h4>
                <p className="text-slate-400 leading-relaxed">
                  {selectedApp.description}
                  <br/><br/>
                  Build professional applications faster with our specialized AI integration. This tool helps you automate workflows and improve productivity.
                </p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <ShieldCheck className="text-green-500 mb-2" size={24} />
                    <p className="text-xs text-slate-500 uppercase">Security</p>
                    <p className="font-medium text-sm">Verified Safe</p>
                 </div>
                 <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <History className="text-brand-500 mb-2" size={24} />
                    <p className="text-xs text-slate-500 uppercase">Last Update</p>
                    <p className="font-medium text-sm">2 days ago</p>
                 </div>
              </div>

              {/* Reviews Mockup */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                  <MessageSquare size={16}/> Reviews
                </h4>
                <div className="space-y-3">
                  {selectedApp.reviews.length > 0 ? selectedApp.reviews.map((r, i) => (
                    <div key={i} className="p-3 bg-slate-900 rounded border border-slate-800">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{r.user}</span>
                        <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/></div>
                      </div>
                      <p className="text-xs text-slate-400">{r.comment}</p>
                    </div>
                  )) : (
                    <div className="p-3 bg-slate-900 rounded border border-slate-800">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">Alex T.</span>
                        <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                      </div>
                      <p className="text-xs text-slate-400">Incredible app! Saved me hours of work.</p>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};