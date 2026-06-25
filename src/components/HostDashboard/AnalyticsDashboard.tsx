/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, TrendingUp, DollarSign, Users, Award, 
  Percent, ArrowUpRight, ShieldCheck, PieChart, Activity
} from 'lucide-react';
import { PropertyUnit, Booking, TaskDetail } from '../../types';

interface AnalyticsDashboardProps {
  units: PropertyUnit[];
  bookings: Booking[];
  tasks: TaskDetail[];
  theme: 'dark' | 'light';
}

export default function AnalyticsDashboard({
  units,
  bookings,
  tasks,
  theme
}: AnalyticsDashboardProps) {
  
  // Calculate analytics metrics
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'upcoming');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.payoutAmount, 0);

  const totalExpenses = tasks.reduce((sum, t) => sum + t.cost, 0);
  const netEarnings = totalRevenue - totalExpenses;

  const totalUnits = units.length;
  const occupancyRate = totalUnits ? Math.round((units.filter(u => u.status === 'occupied').length / totalUnits) * 100) : 75;

  // Monthly stats (Mocking curves for Riyadh, Jeddah, AlUla)
  const cityRevenue = {
    Riyadh: bookings.filter(b => b.unitName.includes('الرياض')).reduce((sum, b) => sum + b.payoutAmount, 0) || 12000,
    Jeddah: bookings.filter(b => b.unitName.includes('جدة')).reduce((sum, b) => sum + b.payoutAmount, 0) || 5800,
    AlUla: bookings.filter(b => b.unitName.includes('العلا')).reduce((sum, b) => sum + b.payoutAmount, 0) || 9200,
    Other: 4500
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Module Header */}
      <div>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
          📊 التحليلات المتقدمة والأداء المالي (Business Intelligence)
        </h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          مستويات العوائد، إجمالي غلات المحفظة العقارية، مراجعة نسب الإشغال، ورسوم صيانة وتجهيز الوحدات.
        </p>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex justify-between items-center">
            <span className="p-2.5 rounded-2xl bg-[#1e40af]/10 text-[#1e40af]">
              <DollarSign className="h-5 w-5" />
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              +14.8% هذا الشهر
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">إجمالي الإيرادات (SAR)</span>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'} block mt-1`}>
              {totalRevenue.toLocaleString()} <span className="text-xs font-sans text-slate-500">ريال</span>
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex justify-between items-center">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center">
              تصنيفات الرعاية الميدانية
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">تكاليف ونفقات التشغيل</span>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'} block mt-1`}>
              {totalExpenses.toLocaleString()} <span className="text-xs font-sans text-slate-500">ريال</span>
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex justify-between items-center">
            <span className="p-2.5 rounded-2xl bg-[#00E676]/10 text-[#00e676]">
              <Award className="h-5 w-5" />
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center bg-[#00e676]/10 px-2 py-0.5 rounded-full">
              صافي الفائض
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">العائد الفائض الصافي</span>
            <span className={`text-2xl font-black font-mono text-[#00E676] block mt-1`}>
              {netEarnings.toLocaleString()} <span className="text-xs font-sans">ريال</span>
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex justify-between items-center">
            <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Percent className="h-5 w-5" />
            </span>
            <span className="text-[10px] text-cyan-400 font-bold flex items-center bg-cyan-900/15 px-2 py-0.5 rounded-full">
               إجمالي التشغيل
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">متوسط معدلات الإشغال</span>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'} block mt-1`}>
              %{occupancyRate} <span className="text-xs font-sans text-slate-400">نشط حالياً</span>
            </span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Bento Block Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Month by month Revenue trends (Custom beautiful SVG graph) */}
        <div className={`lg:col-span-2 p-6 rounded-[32px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#1E40AF]" />
              <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>منحنى الإيرادات لعام ٢٠٢٦ م</h3>
            </div>
            <span className="font-sans text-[10px] text-slate-440 font-bold">بملايين الريالات (SAR)</span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-60 w-full relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grids */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Area path gradient */}
              <path
                d="M 10,170 Q 100,80 180,110 T 320,50 T 490,30 L 490,180 L 10,180 Z"
                fill="url(#revGrad)"
                opacity="0.15"
              />

              {/* Line graph line path */}
              <path
                d="M 10,170 Q 100,80 180,110 T 320,50 T 490,30"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Pulse dots */}
              <circle cx="180" cy="110" r="6" fill="#1E40AF" />
              <circle cx="320" cy="50" r="6" fill="#00E676" />
              <circle cx="490" cy="30" r="6" fill="#FF5252" />

              {/* Gradients definitions */}
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" />
                  <stop offset="100%" stopColor="#040B16" />
                </linearGradient>
              </defs>
            </svg>

            {/* Labels beneath chart */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 font-bold px-1">
              <span>يناير</span>
              <span>مارس</span>
              <span>مايو (إيجار)</span>
              <span>يوليو (الموسم)</span>
              <span>سبتمبر</span>
              <span>ديسمبر</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Revenue distribution by cities (Pie chart styled representation) */}
        <div className={`p-6 rounded-[32px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-5 text-right`}>
          <div className="flex items-center gap-2 justify-end">
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>توزيع الإيراد بالمناطق 🇸🇦</h3>
            <PieChart className="h-4 w-4 text-[#C5A880]" />
          </div>

          <div className="space-y-4 pt-2 text-xs">
            
            {/* Region 1: Riyadh */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="font-mono text-[#00E676]">{(cityRevenue.Riyadh).toLocaleString()} ريال</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>الرياض العاصمة (%54)</span>
              </div>
              <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1E40AF] h-full rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>

            {/* Region 2: AlUla */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="font-mono text-[#00E676]">{(cityRevenue.AlUla).toLocaleString()} ريال</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>العلا السياحية (%28)</span>
              </div>
              <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            {/* Region 3: Jeddah */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="font-mono text-[#00E676]">{(cityRevenue.Jeddah).toLocaleString()} ريال</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>مارينا جدة البحري (%18)</span>
              </div>
              <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
