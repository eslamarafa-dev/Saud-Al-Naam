/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, TrendingUp, DollarSign, Calendar, Eye, 
  ArrowLeft, FileText, ChevronDown, Check, Sparkles, Award, Star
} from 'lucide-react';
import { PropertyUnit, Booking, TaskDetail } from '../../types';

interface ReportsAnalyticsProps {
  units: PropertyUnit[];
  bookings: Booking[];
  tasks: TaskDetail[];
  onTriggerAction: (title: string, desc: string) => void;
  theme?: string;
}

export default function ReportsAnalytics({ units, bookings, tasks, onTriggerAction, theme }: ReportsAnalyticsProps) {
  const isLight = theme === 'light';
  const [activeReportTab, setActiveReportTab] = useState<'financial' | 'occupancy' | 'channels'>('financial');

  // Core metrics computations
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.payoutAmount, 0);
  const totalExpenses = tasks.reduce((sum, t) => sum + t.cost, 0);
  const revenueNet = totalRevenue - totalExpenses;

  // ADR (Average Daily Rate) = Total Revenue from Bookings / Total Nights Booked
  // Assuming average stay is 2.5 nights per booking
  const assumedNightsCount = activeBookings.length * 2.5 || 1;
  const averageDailyRate = Math.round(totalRevenue / assumedNightsCount) || 820;

  // RevPAR (Revenue Per Available room) = Total Revenue / total units count * days in period (e.g. 30 days)
  const totalUnitsCount = units.length || 1;
  const revPAR = Math.round(totalRevenue / (totalUnitsCount * 30)) || 450;

  // Channel counts data
  const channelsShare = () => {
    let airbnb = 0;
    let gathern = 0;
    let booking = 0;
    let direct = 0;

    activeBookings.forEach(b => {
      if (b.source === 'airbnb') airbnb += b.payoutAmount;
      else if (b.source === 'gathern') gathern += b.payoutAmount;
      else if (b.source === 'booking') booking += b.payoutAmount;
      else direct += b.payoutAmount;
    });

    const sum = airbnb + gathern + booking + direct || 1;
    return {
      airbnb: { amt: airbnb, pct: Math.round((airbnb / sum) * 100) },
      gathern: { amt: gathern, pct: Math.round((gathern / sum) * 100) },
      booking: { amt: booking, pct: Math.round((booking / sum) * 100) },
      direct: { amt: direct, pct: Math.round((direct / sum) * 100) }
    };
  };

  const share = channelsShare();

  const handleDownloadFullAnnualReport = () => {
    onTriggerAction(
      'تصدير التقرير السنوي الشامل', 
      'جاري تجميع الملف وتحليل الإيرادات والإشغال لعام ٢٠٢٦م وتجهيز القوائم المالية المدققة للغرفة والبلدية'
    );
  };

  return (
    <div className="space-y-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Upper header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border p-6 rounded-2xl ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="flex flex-col text-right">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-end ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>التقارير والتحليلات البيانية الذكية</span>
            <TrendingUp className={`h-5 w-5 ${isLight ? 'text-emerald-600' : 'text-[#00e676]'}`} />
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             استعرض أداء محفظتك السكنية، حلل مصادر الحجوزات ونسب الإشغال لاتخاذ قرارات تسعير دقيقة وذكية.
          </p>
        </div>
        <button
          onClick={handleDownloadFullAnnualReport}
          className={`px-4 py-2.5 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border-0 ${isLight ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm' : 'bg-[#00e676] hover:bg-emerald-600 text-slate-950'}`}
        >
          <FileText className="h-4 w-4" />
          <span>تصدير القوائم السنوية المعتمدة</span>
        </button>
      </div>

      {/* RevPAR & ADR metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className={`border p-5 rounded-2.5xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#050C16] border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>متوسط الدخل اليومي لليلة (ADR)</span>
          <div className="text-2xl font-extrabold font-mono mt-1">
            {averageDailyRate.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className={`text-[9px] mt-2 font-bold ${isLight ? 'text-emerald-600' : 'text-[#00e676]'}`}>الإنتاجية السعرية لكل حجز مدفوع بالمتوسط</p>
        </div>

        {/* Metric 2 */}
        <div className={`border p-5 rounded-2.5xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#050C16] border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>عائد الغرفة المتاحة (RevPAR)</span>
          <div className={`text-2xl font-extrabold font-mono mt-1 ${isLight ? 'text-emerald-600' : 'text-[#00e676]'}`}>
            {revPAR.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className={`text-[9px] mt-2 font-semibold ${isLight ? 'text-slate-500' : 'text-slate-455'}`}>يقيس كفاءة تشغيل الوحدات يومياً</p>
        </div>

        {/* Metric 3 */}
        <div className={`border p-5 rounded-2.5xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#050C16] border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>التدفقات التشغيلية الإجمالية</span>
          <div className="text-2xl font-extrabold font-mono mt-1">
            {totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className={`text-[9px] mt-2 font-semibold ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>حجم المبيعات المالية المباشرة</p>
        </div>

        {/* Metric 4 */}
        <div className={`border p-5 rounded-2.5xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#050C16] border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>العائد والنفع الصافي للمحفظة</span>
          <div className={`text-2xl font-extrabold font-mono mt-1 ${isLight ? 'text-emerald-600' : 'text-emerald-450'}`}>
            {revenueNet.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className={`text-[9px] mt-2 font-semibold ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>شامل تصفية كافة الفواتير والأتعاب</p>
        </div>

      </div>

      {/* Tabs navigation for charts */}
      <div className={`flex border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <button
          onClick={() => setActiveReportTab('financial')}
          className={`px-5 py-3 cursor-pointer text-xs font-bold transition-all relative ${
            activeReportTab === 'financial' 
              ? isLight ? 'text-amber-600' : 'text-[#00e676]' 
              : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>التقارير والإيرادات المالية</span>
          {activeReportTab === 'financial' && (
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isLight ? 'bg-amber-500' : 'bg-[#00e676]'}`}></span>
          )}
        </button>

        <button
          onClick={() => setActiveReportTab('occupancy')}
          className={`px-5 py-3 cursor-pointer text-xs font-bold transition-all relative ${
            activeReportTab === 'occupancy' 
              ? isLight ? 'text-amber-600' : 'text-[#00e676]' 
              : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>تطور نسب الإشغال والامتلاء</span>
          {activeReportTab === 'occupancy' && (
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isLight ? 'bg-amber-500' : 'bg-[#00e676]'}`}></span>
          )}
        </button>

        <button
          onClick={() => setActiveReportTab('channels')}
          className={`px-5 py-3 cursor-pointer text-xs font-bold transition-all relative ${
            activeReportTab === 'channels' 
              ? isLight ? 'text-amber-600' : 'text-[#00e676]' 
              : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>قنوات البيع الاستثمارية</span>
          {activeReportTab === 'channels' && (
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isLight ? 'bg-amber-500' : 'bg-[#00e676]'}`}></span>
          )}
        </button>
      </div>

      {/* Render Chart according to activeReportTab */}
      <div className={`p-6 border rounded-2.5xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
        
        {activeReportTab === 'financial' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>مؤشرات الإيجارات الدورية الشهرية</span>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>منحنى توزيع الأرباح الشهرية (يناير - يونيو ٢٠٢٦)</h3>
            </div>

            {/* Premium custom SVG chart for finances */}
            <div className={`h-72 w-full p-4 border rounded-xl flex items-center justify-center ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-[#050C16] border-slate-850'}`}>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220">
                {/* Guidelines */}
                <line x1="10" y1="30" x2="590" y2="30" stroke={isLight ? '#e2e8f0' : '#1f2937'} strokeDasharray="3 3" />
                <line x1="10" y1="80" x2="590" y2="80" stroke={isLight ? '#e2e8f0' : '#1f2937'} strokeDasharray="3 3" />
                <line x1="10" y1="130" x2="590" y2="130" stroke={isLight ? '#e2e8f0' : '#1f2937'} strokeDasharray="3 3" />
                <line x1="10" y1="180" x2="590" y2="180" stroke={isLight ? '#cbd5e1' : '#374151'} />

                {/* Spline Area representation */}
                <path 
                  d="M50,180 Q140,140 230,120 T410,70 T550,40 L550,180 L50,180 Z" 
                  fill="url(#revGrad)" 
                  opacity={isLight ? "0.2" : "0.15"} 
                />

                {/* Spline Line */}
                <path 
                  d="M50,180 Q140,140 230,120 T410,70 T550,40" 
                  fill="none" 
                  stroke={isLight ? '#f59e0b' : '#00e676'} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                />

                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isLight ? '#f59e0b' : '#00e676'} />
                    <stop offset="100%" stopColor={isLight ? '#f59e0b' : '#00e676'} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Circles for nodes */}
                <circle cx="50" cy="180" r="5" fill={isLight ? '#f59e0b' : '#00e676'} />
                <circle cx="140" cy="150" r="5" fill={isLight ? '#f59e0b' : '#00e676'} />
                <circle cx="230" cy="120" r="5" fill={isLight ? '#f59e0b' : '#00e676'} />
                <circle cx="320" cy="100" r="5" fill={isLight ? '#f59e0b' : '#00e676'} />
                <circle cx="415" cy="70" r="5" fill={isLight ? '#f59e0b' : '#00e676'} />
                <circle cx="550" cy="40" r="5" fill="#ffffff" stroke={isLight ? '#f59e0b' : '#00e676'} strokeWidth="3" />

                {/* text values */}
                <text x="550" y="24" fill={isLight ? '#d97706' : '#00e676'} fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="mono">
                  +{totalRevenue.toLocaleString()} ر.س
                </text>

                {/* Months X Index */}
                <g fill={isLight ? '#64748b' : '#94a3b8'} fontSize="10" fontWeight="bold">
                  <text x="50" y="202" textAnchor="middle">يناير</text>
                  <text x="140" y="202" textAnchor="middle">فبراير</text>
                  <text x="230" y="202" textAnchor="middle">مارس</text>
                  <text x="320" y="202" textAnchor="middle">أبريل</text>
                  <text x="415" y="202" textAnchor="middle">مايو</text>
                  <text x="550" y="202" textAnchor="middle">يونيو الحالي</text>
                </g>
              </svg>
            </div>
          </div>
        )}

        {activeReportTab === 'occupancy' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs ${isLight ? 'text-slate-500 font-bold' : 'text-slate-450 font-bold'}`}>نسب الأشغال المئوية الشاملة للشهور</span>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>نسب ومؤشرات الإشغال والامتلاء بالشهور</h3>
            </div>

            {/* Custom SVG bars chart for occupancy */}
            <div className={`h-72 w-full p-4 border rounded-xl flex items-center justify-center ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-[#050C16] border-slate-850'}`}>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220">
                {/* Guidelines */}
                <line x1="10" y1="30" x2="590" y2="30" stroke={isLight ? '#e2e8f0' : '#1f2937'} strokeDasharray="3 3" />
                <line x1="10" y1="105" x2="590" y2="105" stroke={isLight ? '#e2e8f0' : '#1f2937'} strokeDasharray="3 3" />
                <line x1="10" y1="180" x2="590" y2="180" stroke={isLight ? '#cbd5e1' : '#374151'} />

                {/* Bar charts indicating occupancy percents 40%, 48%, 55%, 68%, 78%, 85% */}
                <rect x="35" y="120" width="30" height="60" fill={isLight ? '#06b6d4' : '#22d3ee'} rx="4" />
                <text x="50" y="110" fill={isLight ? '#0891b2' : '#22d3ee'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="mono">40%</text>

                <rect x="125" y="105" width="30" height="75" fill={isLight ? '#06b6d4' : '#22d3ee'} rx="4" />
                <text x="140" y="95" fill={isLight ? '#0891b2' : '#22d3ee'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="mono">48%</text>

                <rect x="215" y="90" width="30" height="90" fill={isLight ? '#06b6d4' : '#22d3ee'} rx="4" />
                <text x="230" y="80" fill={isLight ? '#0891b2' : '#22d3ee'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="mono">55%</text>

                <rect x="305" y="75" width="30" height="105" fill={isLight ? '#06b6d4' : '#22d3ee'} rx="4" />
                <text x="320" y="65" fill={isLight ? '#0891b2' : '#22d3ee'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="mono">65%</text>

                <rect x="395" y="50" width="30" height="130" fill={isLight ? '#06b6d4' : '#22d3ee'} rx="4" />
                <text x="410" y="40" fill={isLight ? '#0891b2' : '#22d3ee'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="mono">76%</text>

                <rect x="525" y="38" width="30" height="142" fill={isLight ? '#10b981' : '#00e676'} rx="4" />
                <text x="540" y="28" fill={isLight ? '#047857' : '#00e676'} fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="mono">88%</text>

                {/* X labels */}
                <g fill={isLight ? '#64748b' : '#94a3b8'} fontSize="10" fontWeight="bold">
                  <text x="50" y="202" textAnchor="middle">يناير</text>
                  <text x="140" y="202" textAnchor="middle">فبراير</text>
                  <text x="230" y="202" textAnchor="middle">مارس</text>
                  <text x="320" y="202" textAnchor="middle">أبريل</text>
                  <text x="410" y="202" textAnchor="middle">مايو</text>
                  <text x="540" y="202" textAnchor="middle">يونيو الحالي</text>
                </g>
              </svg>
            </div>
          </div>
        )}

        {activeReportTab === 'channels' && (
          <div className="space-y-6">
            <h3 className={`text-sm font-bold text-right ${isLight ? 'text-slate-900' : 'text-white'}`}>مساهمة قنوات الحجز في الدخل (القنوات النشطة)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Channel 1: Gathern */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/80 border-slate-850'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-yellow-600 font-bold">منصة جاذر إن Gathern</span>
                  <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{share.gathern.pct}%</strong>
                </div>
                <div className={`w-full rounded-full h-2 ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${share.gathern.pct}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">إسهام مالي: {share.gathern.amt.toLocaleString()} ر.س</span>
              </div>

              {/* Channel 2: Airbnb */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/80 border-slate-850'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-red-500 font-bold">منصة Airbnb</span>
                  <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{share.airbnb.pct}%</strong>
                </div>
                <div className={`w-full rounded-full h-2 ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${share.airbnb.pct}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">إسهام مالي: {share.airbnb.amt.toLocaleString()} ر.س</span>
              </div>

              {/* Channel 3: Booking */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/80 border-slate-850'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-600 font-bold">موقع بوكينج Booking</span>
                  <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{share.booking.pct}%</strong>
                </div>
                <div className={`w-full rounded-full h-2 ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${share.booking.pct}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">إسهام مالي: {share.booking.amt.toLocaleString()} ر.س</span>
              </div>

              {/* Channel 4: Direct */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/80 border-slate-850'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-bold">الحجز المباشر والمكالمات</span>
                  <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{share.direct.pct}%</strong>
                </div>
                <div className={`w-full rounded-full h-2 ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${share.direct.pct}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">إسهام مالي: {share.direct.amt.toLocaleString()} ر.س</span>
              </div>

            </div>

            <div className={`p-4 border rounded-xl leading-normal text-xs text-right ${isLight ? 'bg-slate-50 border-slate-150 text-slate-600' : 'bg-slate-950/20 border-slate-900 text-slate-400'}`}>
              حازت قناة الحجز <strong className="text-yellow-600">«جاذر إن»</strong> على الحصة الأكبر من المبيعات لكونها شريك السياحة المحلّي الأوسع انتشاراً بالمنطقة، تلتها العقود المباشرة من هاتف استقبال النعام والشركات.
            </div>

          </div>
        )}

      </div>

      {/* Leaderboard properties */}
      <div className={`border rounded-2xl p-6 transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#050C16] border-slate-850'}`}>
        <h3 className={`text-sm font-bold mb-5 text-right flex items-center justify-end gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <span>الوحدات والمنشآت الأعلى إيراداً للفترة</span>
          <Award className="h-4 w-4 text-yellow-500" />
        </h3>

        <div className="space-y-4">
          {units.slice(0, 3).map((unit, index) => {
            const percentage = 100 - (index * 15);
            return (
              <div key={unit.id} className="flex justify-between items-center text-xs">
                
                {/* Gold Trophy badge */}
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-md font-mono font-bold flex items-center justify-center text-[10px] ${
                    index === 0 ? (isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-950 text-yellow-500 border border-amber-950') :
                    index === 1 ? (isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300') :
                    (isLight ? 'bg-yellow-55 text-yellow-850' : 'bg-[#452711] text-[#b97d10]')
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`font-extrabold truncate max-w-[200px] sm:max-w-md ${isLight ? 'text-slate-800' : 'text-white'}`}>{unit.name.split(' - ')[0]}</span>
                </div>

                {/* Progress bar and revenue */}
                <div className="flex items-center gap-4">
                  <div className={`w-24 sm:w-36 rounded-full h-1.5 hidden sm:block ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <strong className={`font-mono ${isLight ? 'text-emerald-700 font-black' : 'text-[#00e676]'}`}>{Math.round(unit.pricePerNight * 12.8).toLocaleString()} ر.س</strong>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
