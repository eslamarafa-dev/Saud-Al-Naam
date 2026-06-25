/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, TrendingUp, DollarSign, Users, Calendar, 
  Clock, CheckCircle, Wifi, Lock, ShieldAlert, ArrowLeft, 
  Copy, Send, Eye, RefreshCw, Key, AlertTriangle, Battery, Compass, Sparkles
} from 'lucide-react';
import { PropertyUnit, Booking, TaskDetail } from '../../types';

interface DashboardOverviewProps {
  theme?: 'light' | 'dark';
  units: PropertyUnit[];
  bookings: Booking[];
  tasks: TaskDetail[];
  onTriggerAction: (actionName: string, detail: string) => void;
  onNavigateToUnit: (unitId: string) => void;
  onSendWhatsApp: (booking: Booking, templateType: 'welcome' | 'lock_code' | 'guide_and_wifi') => void;
  onOpenGuestGuide: (booking: Booking) => void;
}

export default function DashboardOverview({
  theme = 'dark',
  units,
  bookings,
  tasks,
  onTriggerAction,
  onNavigateToUnit,
  onSendWhatsApp,
  onOpenGuestGuide
}: DashboardOverviewProps) {
  
  const isLight = theme === 'light';

  // Quick status counters
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const maintenanceUnits = units.filter(u => u.status === 'maintenance').length;
  const availableUnits = units.filter(u => u.status === 'available').length;
  const cleaningUnits = units.filter(u => u.status === 'cleaning').length;

  const totalRevenueThisMonth = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.payoutAmount, 0);

  const totalExpensesThisMonth = tasks
    .reduce((sum, t) => sum + t.cost, 0);

  const netProfit = totalRevenueThisMonth - totalExpensesThisMonth;

  // Active IoT Lock State modifications
  const [lockingInAction, setLockingInAction] = useState<string | null>(null);
  const [localUnits, setLocalUnits] = useState<PropertyUnit[]>(units);

  // Homeowner Onboarding Wizard States
  const [ibanInput, setIbanInput] = useState('');
  const [savedIban, setSavedIban] = useState(() => localStorage.getItem('saud_host_iban') || '');
  const [ibanModalOpen, setIbanModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [wizardDismissed, setWizardDismissed] = useState(() => localStorage.getItem('saud_wizard_dismissed') === 'true');

  const step1Done = units.length > 0;
  const step2Done = !!savedIban;
  const step3Done = step2Done; // Modeef model: publishes automatically when bank details are set
  const step4Done = linkCopied;

  const totalPossibleSteps = 4;
  const numStepsDone = (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0) + (step4Done ? 1 : 0);

  const handleSaveIban = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ibanInput.trim().toUpperCase().startsWith('SA') || ibanInput.length < 15) {
      onTriggerAction('تنبيه التحقق', 'الرجاء إدخال رقم آيبان سعودي صحيح يبدأ بـ SA ويتكون من ٢٤ خانة.');
      return;
    }
    setSavedIban(ibanInput.trim());
    localStorage.setItem('saud_host_iban', ibanInput.trim());
    setIbanModalOpen(false);
    onTriggerAction('تحديث الملف المالي', 'تم تثبيت وتدقيق رقم الآيبان البنكي بنجاح لاستقبال مبالغ الحجوزات');
  };

  const handleCopyPortalShareUrl = () => {
    const demoUrl = `${window.location.origin}/guide-preview`;
    navigator.clipboard.writeText(demoUrl);
    setLinkCopied(true);
    onTriggerAction('نسخ رابط منصة الحجز والربط', 'تم نسخ رابط الحجوزات والموقع العام للذاكرة لمشاركته النزلاء');
  };

  const handleDismissWizard = () => {
    setWizardDismissed(true);
    localStorage.setItem('saud_wizard_dismissed', 'true');
    onTriggerAction('إخفاء مرشد التدشين المالي', 'تم إغلاق تفاصيل المساعدة الذاتية للوحة التحكم');
  };

  const handleToggleLock = (unitId: string, currentStatus: string) => {
    setLockingInAction(unitId);
    setTimeout(() => {
      setLocalUnits(prev => prev.map(u => {
        if (u.id === unitId) {
          const nextStatus = currentStatus === 'locked' ? 'unlocked' : 'locked';
          onTriggerAction(
            nextStatus === 'locked' ? 'إغلاق القفل الذكي عن بعد' : 'فتح القفل الذكي عن بعد',
            `تم بنجاح تغيير حالة القفل للوحدة: ${u.name}`
          );
          return { ...u, smartLockStatus: nextStatus as any };
        }
        return u;
      }));
      setLockingInAction(null);
    }, 1500);
  };

  // Quick dispatch state
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  const triggerCopyGuideUrl = (booking: Booking) => {
    const customUrl = `${window.location.origin}/guest-guide/${booking.id}`;
    navigator.clipboard.writeText(customUrl);
    setCopiedBookingId(booking.id);
    onTriggerAction('نسخ رابط بوابة الضيف الرقمية', `للضيف: ${booking.guestName}`);
    setTimeout(() => setCopiedBookingId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Upper Status Greetings Ticker */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
        isLight 
          ? 'bg-white border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' 
          : 'bg-slate-900/50 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-col text-right">
            <h2 className={`text-xl sm:text-2xl font-black ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              لوحة الإدارة والمحيط العقاري الذكي
            </h2>
            <p className={`text-xs mt-1.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              أهلاً بك مجدداً في بوابتك العقارية الفخمة. إليك حالة الإشغال والعمليات الجارية في محفظتك اليوم.
            </p>
          </div>
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border self-stretch sm:self-auto justify-center ${
            isLight 
              ? 'bg-slate-50/80 border-slate-200 text-slate-700' 
              : 'bg-slate-950 border-slate-850 text-slate-300'
          }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold font-sans">بوابة المزامنة الفورية: متصلة ✓</span>
            <button 
              onClick={() => onTriggerAction('مزامنة التقاويم', 'تمت مزامنة قنوات Airbnb وبوكينج المباشرة بنجاح')}
              className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${isLight ? 'bg-slate-200/80 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
            >
              تحديث المزامنة
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] text-slate-900' 
            : 'bg-slate-900/40 border-slate-800 text-white'
        }`}>
          <div className={`absolute left-6 top-6 h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${
            isLight ? 'bg-emerald-50 border-emerald-100/80' : 'bg-slate-950 border-slate-800'
          }`}>
            <DollarSign className={`h-5 w-5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
          </div>
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            إجمالي المدخول التشغيلي (الشهر)
          </span>
          <div className="text-3xl font-black font-mono mt-4">
            {totalRevenueThisMonth.toLocaleString()} <span className="text-xs font-bold text-slate-500">ر.س</span>
          </div>
          <div className={`text-[10px] font-extrabold mt-3.5 flex items-center gap-1 ${
            isLight ? 'text-emerald-700' : 'text-emerald-400'
          }`}>
            <span>+14.5% عائد إضافي مقارنة بالشهر السابق</span>
          </div>
        </div>

        {/* Metric 2 - Occupancy Rate */}
        <div className={`border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] text-slate-900' 
            : 'bg-slate-900/40 border-slate-800 text-white'
        }`}>
          <div className={`absolute left-6 top-6 h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${
            isLight ? 'bg-cyan-50 border-cyan-100/80' : 'bg-slate-950 border-slate-800'
          }`}>
            <Building2 className={`h-5 w-5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
          </div>
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            نسبة إشغال الوحدات النشطة
          </span>
          <div className="text-3xl font-black font-mono mt-4">
            {Math.round((occupiedUnits / totalUnits) * 100)} <span className="text-xs font-bold text-slate-500">%</span>
          </div>
          <div className={`text-[10px] mt-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
             إشغال: <strong className={isLight ? 'text-cyan-700 font-extrabold' : 'text-cyan-400 font-bold'}>{occupiedUnits} من أصل {totalUnits}</strong> وحدات تشغيلية جاهزة
          </div>
        </div>

        {/* Metric 3 - Net Profit */}
        <div className={`border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] text-slate-900' 
            : 'bg-slate-900/40 border-slate-800 text-white'
        }`}>
          <div className={`absolute left-6 top-6 h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${
            isLight ? 'bg-amber-50 border-amber-100/80' : 'bg-slate-950 border-slate-800'
          }`}>
            <Key className={`h-5 w-5 ${isLight ? 'text-amber-700' : 'text-yellow-500'}`} />
          </div>
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            صافي الأرباح المحصلة
          </span>
          <div className="text-3xl font-black font-mono mt-4">
            {netProfit.toLocaleString()} <span className="text-xs font-bold text-slate-500">ر.س</span>
          </div>
          <div className={`text-[10px] mt-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>
             إجمالي المصروفات التشغيلية: {totalExpensesThisMonth.toLocaleString()} ر.س
          </div>
        </div>

        {/* Metric 4 - Active Tasks */}
        <div className={`border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] text-slate-900' 
            : 'bg-slate-900/40 border-slate-800 text-white'
        }`}>
          <div className={`absolute left-6 top-6 h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${
            isLight ? 'bg-purple-50 border-purple-100/80' : 'bg-slate-950 border-slate-800'
          }`}>
            <Clock className={`h-5 w-5 ${isLight ? 'text-purple-700' : 'text-purple-400'}`} />
          </div>
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            مهام الضيافة والتنظيف النشطة
          </span>
          <div className="text-3xl font-black font-mono mt-4">
            {tasks.filter(t => t.status !== 'completed').length} <span className="text-xs font-bold text-slate-500">مهام</span>
          </div>
          <div className={`text-[10px] font-extrabold mt-4 ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
             تأهب تنظيمي مستديم ومبرمج
          </div>
        </div>

      </div>

      {/* Onboarding Checklist - Styled as Premium modern SaaS Checklist */}
      {!wizardDismissed && numStepsDone < totalPossibleSteps && (
        <div className={`p-6 sm:p-8 rounded-2.5xl border relative overflow-hidden space-y-6 transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)]' 
            : 'bg-[#050C16] border-slate-800'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <button 
              onClick={handleDismissWizard}
              className={`p-1 transition-all cursor-pointer font-extrabold text-sm ${
                isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-500 hover:text-white'
              }`}
              title="إخفاء هذه البطاقة مؤقتاً"
            >
              ✕
            </button>
            <div className="flex flex-col text-right">
              <h3 className={`text-base font-black flex items-center gap-2 justify-end ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>ابدأ تهيئة ونشر عقارك في ٤ خطوات بسيطة</span>
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              </h3>
              <p className={`text-xs mt-1.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                أنجزت <strong className="text-emerald-500 font-mono text-sm">{numStepsDone}</strong> من أصل <strong className={isLight ? 'text-slate-900 font-mono text-sm' : 'text-white font-mono text-sm'}>٤ خطوات</strong> – تختفي هذه البطاقة تلقائياً بعد إتمام المتطلبات المباشرة.
              </p>
            </div>
          </div>

          {/* Progress bar line */}
          <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${(numStepsDone / totalPossibleSteps) * 100}%` }}
            ></div>
          </div>

          {/* Steps list grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Step 1: Add first property */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
              step1Done 
                ? isLight 
                  ? 'bg-emerald-50/20 border-emerald-100 bg-opacity-40' 
                  : 'bg-slate-950/40 border-emerald-950/60 opacity-80' 
                : isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span 
                    className={`text-[11px] font-black ${
                      step1Done ? 'text-emerald-600' : isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >أضف عقارك الأول</span>
                  <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step1Done 
                      ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-[#00e676]' 
                      : 'bg-slate-200/50 text-slate-500'
                  }`}>✓</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  اسم العقار، المدينة، نوع الملكية – يستغرق ٣٠ ثانية فقط.
                </p>
              </div>
              
              {!step1Done ? (
                <button 
                  onClick={() => onNavigateToUnit('new')}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all"
                >
                  أضف الآن 🡠
                </button>
              ) : (
                <div 
                  className="text-[10px] text-emerald-600 font-extrabold text-left"
                >مكتمل ✓</div>
              )}
            </div>

            {/* Step 2: Add Bank IBAN */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
              step2Done 
                ? isLight 
                  ? 'bg-emerald-50/20 border-emerald-100 bg-opacity-40' 
                  : 'bg-slate-950/40 border-emerald-950/60 opacity-80' 
                : isLight 
                  ? 'bg-slate-50 border-amber-200/70 text-slate-900 hover:border-amber-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-[#382415] shadow-lg'
            }`}>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span 
                    className={`text-[11px] font-black ${
                      step2Done ? 'text-emerald-600' : isLight ? 'text-amber-600' : 'text-amber-500'
                    }`}
                  >أضف الآيبان (مطلوب للنشر) ⚠</span>
                  <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step2Done 
                      ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-[#00e676]' 
                      : 'bg-amber-50 text-amber-600 font-extrabold'
                  }`}>{step2Done ? '✓' : '!'}</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                   رقم الآيبان البنكي لاستقبال مبالغ الحجوزات والسكن المباشر.
                </p>
              </div>
              
              {!step2Done ? (
                <button 
                  onClick={() => setIbanModalOpen(true)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  تثبيت رقم الحساب 🡠
                </button>
              ) : (
                <div 
                  className="flex flex-col text-right"
                >
                  <span className="text-[10px] text-slate-500 font-mono truncate">{savedIban}</span>
                  <button onClick={() => setIbanModalOpen(true)} className="text-[10px] text-amber-600 hover:text-amber-700 hover:underline text-right mt-1.5 font-bold">تعديل الآيبان</button>
                </div>
              )}
            </div>

            {/* Step 3: Publish properties on website */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
              step3Done 
                ? isLight 
                  ? 'bg-emerald-50/20 border-emerald-100 bg-opacity-40' 
                  : 'bg-slate-950/40 border-emerald-950/60 opacity-80' 
                : isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-950 opacity-50' 
                  : 'bg-slate-900 border-slate-800 opacity-60'
            }`}>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span 
                    className={`text-[11px] font-black ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                  >انشر عقاراتك للعموم</span>
                  <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step3Done 
                      ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-[#00e676]' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>✓</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                   فعّل «إظهار الوحدة بالموقع» ليتمكن العملاء من الحجز.
                </p>
              </div>
              
              {!step3Done ? (
                <span 
                  className={`text-[9.5px] font-semibold italic text-right ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >يطلب إكمال الآيبان أولاً</span>
              ) : (
                <div 
                  className="text-[10px] text-emerald-600 font-extrabold text-left"
                >نشط وتلقائي ✓</div>
              )}
            </div>

            {/* Step 4: Share Booking website portal link */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
              step4Done 
                ? isLight 
                  ? 'bg-emerald-50/20 border-emerald-100 bg-opacity-40' 
                  : 'bg-slate-950/40 border-emerald-950/60 opacity-80' 
                : isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span 
                    className={`text-[11px] font-black ${isLight ? 'text-slate-800' : 'text-slate-400'}`}
                  >شارك رابط منصة الحجز</span>
                  <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step4Done 
                      ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-[#00e676]' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>✓</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  انسخ الرابط ووضعه برأس السوشيال ميديا وواتساب للأعمال والوثائق.
                </p>
              </div>
              
              <button 
                onClick={handleCopyPortalShareUrl}
                className={`w-full py-2 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {step4Done ? 'نسخ مجدداً 🡠' : 'شاركه الآن 🡠'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* IBAN Input Setup popup modal */}
      {ibanModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2.5xl p-6 max-w-md w-full space-y-5 text-right transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-[#050C16] border-slate-800'
          }`}>
            <h4 className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-[#00e676]'}`}>
              البند المالي: ضبط رقم الحساب والآيبان البنكي البائع
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              سيتم عرض بيانات رقم الآيبان للضيوف عند تأكيدهم خيار الدفع كـ «تحويل بنكي مباشر» لتأكيد فوري دون مغادرة الموقع.
            </p>
            
            <form onSubmit={handleSaveIban} className="space-y-4">
              <div className="space-y-2">
                <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>رقم الآيبان (IBAN) السعودي *</label>
                <input
                  type="text"
                  required
                  placeholder="SA03 8000 0000 0000 0000 0000"
                  value={ibanInput}
                  onChange={(e) => setIbanInput(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-amber-500 font-mono text-left ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900' 
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <span className="text-[10px] text-slate-500 font-medium block">يجب أن يحتوي على ٢٤ خانة ويبدأ بالحرفين SA للتحقق.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIbanModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs text-[#030712] font-black"
                >
                  تأكيد وحفظ الآيبان بالدفاتر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (LHS inside RTL): Check-ins / Check-outs today and IoT actions */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Today CheckIn & CheckOut actions */}
          <div className={`border p-6 rounded-2xl transition-all duration-300 ${
            isLight 
              ? 'bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <span className={`text-xs ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                إجراءات المضيف السريعة
              </span>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                حركة النزلاء اليومية والاتصالات النشطة
              </h3>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => {
                const associatedUnit = units.find(u => u.id === booking.unitId);
                const isUpcoming = booking.status === 'upcoming';
                const isActive = booking.status === 'active';
                const isCompleted = booking.status === 'completed';

                return (
                  <div 
                    key={booking.id}
                    className={`border p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all text-right ${
                      isLight 
                        ? 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.01)]' 
                        : 'bg-[#050C16] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    
                    {/* Guest info & reservation platform */}
                    <div className="flex gap-4 justify-end items-start leading-normal">
                      <div className={`p-2.5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        {booking.source === 'airbnb' ? (
                          <span className="text-red-500 text-xs font-mono font-black">Abnb</span>
                        ) : booking.source === 'gathern' ? (
                          <span className="text-amber-600 text-xs font-mono font-black">Gthrn</span>
                        ) : booking.source === 'booking' ? (
                          <span className="text-blue-500 text-xs font-mono font-black">Bkg.c</span>
                        ) : (
                          <span className={`text-xs font-mono font-black ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Mubashr</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-sm flex items-center gap-2 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {booking.guestName}
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            isActive 
                              ? isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                              : isUpcoming 
                                ? isLight ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' : 'bg-cyan-950 text-cyan-400 border border-cyan-900' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {isActive ? 'نزيل حالي' : isUpcoming ? 'قادم قريباً' : 'مغادر'}
                          </span>
                        </span>
                        <span className={`text-[11px] mt-1.5 font-sans leading-none ${
                          isLight ? 'text-slate-500 font-medium' : 'text-slate-400'
                        }`}>
                          {booking.unitName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                          الفترة: {booking.checkInDate} إلى {booking.checkOutDate} | {booking.guestPhone}
                        </span>
                      </div>
                    </div>

                    {/* Operational Action triggers */}
                    <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-end">
                      
                      {/* Trigger dynamic guest guide portal view */}
                      <button
                        onClick={() => onOpenGuestGuide(booking)}
                        className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isLight 
                            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs' 
                            : 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800'
                        }`}
                        title="معاينة الدليل الرقمي للنزيل"
                      >
                        <Eye className="h-4 w-4 text-cyan-502 animate-none" />
                        <span>دليل النزيل</span>
                      </button>

                      {/* Copy portal URL code for guests */}
                      <button
                        onClick={() => triggerCopyGuideUrl(booking)}
                        className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          copiedBookingId === booking.id
                            ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                        title="نسخ رابط الدليل الخاص به لرسائل التواصل"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copiedBookingId === booking.id ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                      </button>

                      {/* Send welcoming checkin template direct via whatsapp dispatch simulation */}
                      <button
                        onClick={() => onSendWhatsApp(booking, 'welcome')}
                        className={`p-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isLight 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                            : 'bg-[#0e3a1f] border border-[#1b6238] hover:bg-[#16562f] text-emerald-400'
                        }`}
                        title="أرسل الكود والترحيب الفوري بالواتس"
                      >
                        <Send className="h-4 w-4" />
                        <span>ترحيب واتساب</span>
                      </button>

                      {/* Dispatch Smart lock code via SMS with key symbol */}
                      <button
                        onClick={() => onSendWhatsApp(booking, 'lock_code')}
                        className={`p-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isLight 
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold shadow-sm' 
                            : 'bg-[#3a270e] border border-[#62451b] hover:bg-[#523816] text-[#f59e0b]'
                        }`}
                        title="أرسل شفرة الباب الذكي للضيف"
                      >
                        <Lock className="h-4 w-4" />
                        <span>كود البوابة</span>
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Interactive Financial Flow Chart */}
          <div className={`border p-6 rounded-2xl transition-all duration-300 ${
            isLight 
              ? 'bg-white border-slate-200 shadow-[0_4px_16_rgba(0,0,0,0.02)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                  isLight ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-amber-950 border-amber-900/40 text-amber-400'
                }`}>مزامنة محاسبية</span>
                <span className={`text-xs ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                  تحليل إيجار الوحدات مقابل تكاليف الصيانة
                </span>
              </div>
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                مقارنة الإيرادات بالمصروفات التشغيلية
              </h3>
            </div>

            {/* Localized Premium SVG Chart representing financial flows over Months */}
            <div className={`w-full h-64 relative border rounded-xl p-4 flex flex-col justify-between transition-colors ${
              isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#050C16] border-slate-800'
            }`}>
              
              {/* Overlay values */}
              <div className="absolute top-4 right-4 flex gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-cyan-600">
                  <span className="h-2 w-2 rounded-full bg-cyan-500"></span> الإيرادات المؤتمتة
                </span>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span className={`h-2 w-2 rounded-full ${isLight ? 'bg-slate-500' : 'bg-zinc-500'}`}></span> تكاليف التشغيل
                </span>
              </div>

              {/* Graphical representation in clean SVG */}
              <svg className="w-full h-44 mt-6 overflow-visible" viewBox="0 0 600 200">
                {/* Grid guidelines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke={isLight ? "#E2E8F0" : "#111827"} strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke={isLight ? "#E2E8F0" : "#111827"} strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke={isLight ? "#E2E8F0" : "#111827"} strokeDasharray="4 4" />
                <line x1="0" y1="190" x2="600" y2="190" stroke={isLight ? "#CBD5E1" : "#1e293b"} />

                {/* Line Graph elements: revenue */}
                <path 
                  d="M50,170 L150,140 L250,150 L350,105 L450,85 L550,50" 
                  fill="none" 
                  stroke={isLight ? "#0284c7" : "#22d3ee"} 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />
                
                {/* Bar charts: Expenses */}
                <rect x="38" y="160" width="24" height="30" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />
                <rect x="138" y="150" width="24" height="40" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />
                <rect x="238" y="145" width="24" height="45" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />
                <rect x="338" y="130" width="24" height="60" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />
                <rect x="438" y="140" width="24" height="50" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />
                <rect x="538" y="155" width="24" height="35" fill={isLight ? "#94a3b8" : "#334155"} rx="4" opacity="0.7" />

                {/* Data Points Glow */}
                <circle cx="550" cy="50" r="6" fill={isLight ? "#0284c7" : "#22d3ee"} className="animate-ping" />
                <circle cx="550" cy="50" r="4" fill="#ffffff" stroke={isLight ? "#0284c7" : "#22d3ee"} strokeWidth="1.5" />
                <text x="550" y="32" fill={isLight ? "#0f172a" : "#22d3ee"} fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="mono">
                  {totalRevenueThisMonth} ر.س
                </text>

                {/* Month labels */}
                <g fill={isLight ? "#475569" : "#94a3b8"} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  <text x="50" y="204" textAnchor="middle">يناير</text>
                  <text x="150" y="204" textAnchor="middle">فبراير</text>
                  <text x="250" y="204" textAnchor="middle">مارس</text>
                  <text x="350" y="204" textAnchor="middle">أبريل</text>
                  <text x="450" y="204" textAnchor="middle">مايو</text>
                  <text x="550" y="204" textAnchor="middle">يونيو</text>
                </g>
              </svg>
            </div>
          </div>

        </div>

        {/* Right Column: IoT Device Center & Quick Stats Summary */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* IoT Device Control Panel */}
          <div className={`border p-6 rounded-2xl text-right transition-all duration-300 ${
            isLight 
              ? 'bg-white border-slate-200 shadow-[0_4px_16_rgba(0,0,0,0.02)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <h3 className={`text-base font-black flex items-center gap-2 justify-end ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>لوحة التحكم بالأجهزة والأقفال الذكية</span>
              <Battery className={`h-5 w-5 ${isLight ? 'text-[#0284c7]' : 'text-cyan-400'}`} />
            </h3>
            <p className={`text-[11.5px] mt-1.5 mb-6 ${
              isLight ? 'text-slate-500 font-medium' : 'text-slate-400'
            }`}>
              قفل ومزامنة الأكواد آلياً لضيوف جاذر إن وبوكينج
            </p>

            <div className="space-y-4">
              {localUnits.map((unit) => {
                const isLocked = unit.smartLockStatus === 'locked';
                const isOffline = unit.smartLockStatus === 'offline';

                const statusColor = 
                  isLocked ? isLight ? 'text-emerald-600 font-extrabold' : 'text-emerald-400' :
                  isOffline ? 'text-red-500 font-bold' :
                  'text-amber-600 animate-pulse font-bold';

                const connectionStatus = 
                  isOffline ? 'أوفلاين - تفحص الشبكة' : 'متصل بالشبكة آمن';

                return (
                  <div 
                    key={unit.id}
                    className={`p-4 border rounded-xl transition-all ${
                      isLight 
                        ? 'bg-slate-50/50 border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.01)]' 
                        : 'bg-[#050C16] border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      
                      {/* Battery and network info */}
                      <div className="flex flex-col items-start text-left leading-normal">
                        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded ${
                          isOffline 
                            ? 'bg-red-100 text-red-700' 
                            : isLight 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {connectionStatus}
                        </span>
                        <div className="flex items-center gap-1 mt-1.5 text-[10.5px] text-slate-500 font-mono">
                          <Battery className="h-3.5 w-3.5 text-emerald-500" />
                          <span>%88 بطارية</span>
                        </div>
                      </div>

                      {/* Unit name and type */}
                      <div className="flex flex-col text-right">
                        <span className={`font-black text-xs max-w-[160px] truncate ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {unit.name.split(' - ')[0]}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                          رصيد الكود المطبّق: {unit.smartLockCode}
                        </span>
                      </div>

                    </div>

                    {/* Quick Trigger control button */}
                    <div className={`flex items-center justify-between mt-4 pt-3 text-xs border-t ${
                      isLight ? 'border-slate-200/80' : 'border-slate-900'
                    }`}>
                      
                      {/* Locked badge indicators */}
                      <span className={`font-black text-[11px] ${statusColor}`}>
                        {isLocked ? '🔒 مغلق ومؤمن' : isOffline ? '⚠ غير متصل' : '🔓 مفتوح الآن'}
                      </span>

                      {/* Press togglers */}
                      <button
                        onClick={() => handleToggleLock(unit.id, unit.smartLockStatus)}
                        disabled={lockingInAction === unit.id || isOffline}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
                          lockingInAction === unit.id 
                            ? 'bg-slate-200 text-slate-500 animate-pulse'
                            : isOffline
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : isLocked
                                ? isLight
                                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-emerald-950 border border-emerald-900/60 hover:bg-emerald-900 text-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {lockingInAction === unit.id 
                          ? 'جاري البرمجة...' 
                          : isLocked ? 'فتح القفل عن بعد' : 'قفل البوابة الذكية'}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core cleaning task alert notifications */}
          <div className={`border p-6 rounded-2xl text-right transition-all duration-300 ${
            isLight 
              ? 'bg-white border-slate-200 shadow-[0_4px_16_rgba(0,0,0,0.02)]' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              حالة جاهزية الوحدات والتنظيف
            </h3>
            <p className={`text-[11.5px] mt-1.5 mb-6 ${
              isLight ? 'text-slate-500 font-medium' : 'text-slate-400'
            }`}>
               تأكد من تسليم الوحدات في الأوقات الفندقية المعتمدة
            </p>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => {
                const isCompleted = task.status === 'completed';
                const isProgress = task.status === 'in_progress';

                return (
                  <div 
                    key={task.id}
                    className={`p-4 border rounded-xl text-right transition-all ${
                      isLight 
                        ? 'bg-slate-50/50 border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.01)]' 
                        : 'bg-[#050C16] border-slate-850'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[11px] mb-2 leading-none">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isCompleted 
                          ? isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-emerald-950 text-emerald-400' 
                          : isProgress 
                            ? isLight ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-yellow-950 text-yellow-400' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {isCompleted ? 'مكتملة ✓' : isProgress ? 'قيد التنفيذ' : 'انتظار'}
                      </span>
                      <span className={`font-black truncate max-w-[150px] ${
                        isLight ? 'text-slate-900' : 'text-slate-200'
                      }`}>
                        {task.unitName.split(' - ')[0]}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {task.title}
                    </p>
                    <div className="text-[10px] text-slate-400 flex justify-between font-medium">
                      <span>التكلفة: {task.cost} ر.س</span>
                      <span>مسند لـ: {task.assignTo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
