import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from './ui/Card';
import { Zap, Users, CreditCard, ArrowUpRight } from 'lucide-react';
import { generateMockAnalytics } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const stats = await generateMockAnalytics();
      setData(stats);
      setLoading(false);
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <div className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-500/10 px-2 py-1 rounded">
          <ArrowUpRight size={14} />
          {change}
        </div>
      </div>
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
        <div className="text-sm text-slate-400">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Generations" value="12,543" change="+12.5%" icon={Zap} color="bg-brand-500" />
        <StatCard title="Active Users" value="1,234" change="+8.2%" icon={Users} color="bg-accent-500" />
        <StatCard title="Revenue" value="$45,230" change="+23.1%" icon={CreditCard} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Usage Activity" subtitle="Generations over the last 7 days">
          <div className="h-[300px] w-full">
            {loading ? (
               <div className="h-full flex items-center justify-center text-slate-500">Loading Analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                    itemStyle={{ color: '#93c5fd' }}
                  />
                  <Area type="monotone" dataKey="generations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGenerations)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="User Growth" subtitle="New registrations this week">
          <div className="h-[300px] w-full">
             {loading ? (
               <div className="h-full flex items-center justify-center text-slate-500">Loading Analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                  />
                  <Bar dataKey="users" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
