/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Wifi, Lock, MapPin, Phone, HelpCircle, Copy, CheckCircle, 
  Clock, Flame, LogOut, ArrowRight, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { Booking, PropertyUnit } from '../../types';
import { BrandLogoSvg } from '../SaaSWeb/LandingPage';

interface DigitalGuideProps {
  booking: Booking | null;
  units: PropertyUnit[];
  onBackToPlatform?: () => void;
}

export default function DigitalGuide({
  booking,
  units,
  onBackToPlatform
}: DigitalGuideProps) {
  
  const [copiedWifiName, setCopiedWifiName] = useState(false);
  const [copiedWifiPass, setCopiedWifiPass] = useState(false);
  const [copiedLockCode, setCopiedLockCode] = useState(false);

  // If no booking provided (e.g. they just click preview from homepage), load up the Lavender chalet booking as a beautiful preview
  const activeBooking = booking || {
    id: 'b-mock-preview',
    unitId: 'unit-1',
    unitName: 'شاليه اللافندر الفاخر مع مسبح خاص بمؤثرات مائية - حي الرمال، الرياض',
    guestName: 'أحمد بن عبد الرحمن الشمري',
    guestPhone: '966504938123',
    checkInDate: '2026-06-22',
    checkOutDate: '2026-06-24',
    createdAt: '2026-06-18',
    source: 'gathern' as any,
    payoutAmount: 2500,
    guestCount: 4,
    status: 'upcoming' as any,
    paidStatus: 'fully_paid' as any,
    smartLockCodeSent: true
  };

  const activeUnit = units.find(u => u.id === activeBooking.unitId) || units[0];

  const handleCopy = (text: string, type: 'wifiName' | 'wifiPass' | 'lockCode') => {
    navigator.clipboard.writeText(text);
    if (type === 'wifiName') {
      setCopiedWifiName(true);
      setTimeout(() => setCopiedWifiName(false), 2000);
    } else if (type === 'wifiPass') {
      setCopiedWifiPass(true);
      setTimeout(() => setCopiedWifiPass(false), 2000);
    } else if (type === 'lockCode') {
      setCopiedLockCode(true);
      setTimeout(() => setCopiedLockCode(false), 2000);
    }
  };

  return (
    <div className="bg-[#030812] text-slate-100 min-h-screen pb-20 font-sans text-right" style={{ direction: 'rtl' }}>
      
      {/* Top Banner indicating preview modes */}
      {onBackToPlatform && (
        <div className="bg-gradient-to-l from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 py-3 px-4 flex items-center justify-between">
          <button
            onClick={onBackToPlatform}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة لإدارة المضيفين</span>
          </button>
          <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
            أنت في وضع معاينة الدليل الرقمي للنزيل
          </span>
        </div>
      )}

      {/* Styled Branded header */}
      <div className="relative bg-gradient-to-b from-brand-navy/60 to-transparent pt-12 pb-24 px-4 text-center overflow-hidden">
        {/* Abstract background light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-slate-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-md mx-auto space-y-4 relative z-10">
          <div className="bg-[#051122] tracking-tight p-1.5 rounded-2xl inline-flex items-center justify-center border border-slate-800/80 shadow-2xl h-24 w-24 mx-auto transform hover:scale-105 transition-all duration-300">
            <BrandLogoSvg className="h-20 w-20" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">أهلاً بك يا {activeBooking.guestName}</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">مرحباً بك في إقامتك الفاخرة المعتمدة لدى سعود النعام</p>
          </div>
        </div>
      </div>

      {/* Main card panels container */}
      <div className="max-w-md mx-auto px-4 -mt-16 space-y-6 relative z-10">
        
        {/* Unit header preview summary */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-cyan-400"></div>
          
          <h2 className="text-sm sm:text-base font-extrabold text-white leading-normal">
            {activeBooking.unitName}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
            <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span>{activeUnit?.addressText || 'الموقع الجغرافي مؤمن بالكامل'}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-850 text-right">
            <div>
              <span className="text-[10px] text-slate-450 block font-bold">تسجيل الدخول (Check-In)</span>
              <span className="text-xs text-white block font-bold font-mono mt-0.5">{activeBooking.checkInDate}</span>
              <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">بدءاً من الساعة 02:00 ظهراً</span>
            </div>
            <div className="border-r border-slate-800 pr-4">
              <span className="text-[10px] text-slate-450 block font-bold">تسجيل الخروج (Check-Out)</span>
              <span className="text-xs text-white block font-bold font-mono mt-0.5">{activeBooking.checkOutDate}</span>
              <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">قبل الساعة 12:00 ظهراً</span>
            </div>
          </div>
        </div>

        {/* Smart Lock Door Code block - Crucial */}
        <div className="bg-gradient-to-r from-slate-900 to-[#162719] border border-emerald-900/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 left-4 h-10 w-10 bg-[#092211] border border-emerald-900/50 rounded-xl flex items-center justify-center">
            <Lock className="h-5 w-5 text-emerald-400" />
          </div>
          
          <div className="flex items-center gap-1 bg-[#0d2d17] border border-emerald-900/40 rounded px-2 py-0.5 self-start inline-flex text-[9px] text-[#22c55e] font-extrabold uppercase">
            <span>✓ دخول ذاتي آمن نشط</span>
          </div>
          
          <h3 className="text-sm font-bold text-white mt-4">شفرة قفل الباب الذكي الرقمية الخاصة بك</h3>
          <p className="text-slate-400 text-[10.5px] mt-1 pr-0.5 leading-relaxed">
            استخدم هذه الشفرة المؤقتة الخاصة بمدراء الأمان بمجرد ملامسة لوحة الأرقام. نشطة طيلة فترة حجزك.
          </p>

          {/* Large clear screen showing the passcode */}
          <div className="bg-[#030812]/80 border border-emerald-900/20 rounded-2xl p-4 mt-4 flex items-center justify-between gap-4">
            <button
              onClick={() => handleCopy(activeUnit?.smartLockCode || '1234', 'lockCode')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                copiedLockCode 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-350'
              }`}
            >
              {copiedLockCode ? 'تم النسخ!' : 'نسخ شفرة القفل'}
            </button>
            <div className="flex flex-col text-right">
              <span className="text-2.5xl font-extrabold text-white tracking-widest font-mono">
                {activeUnit?.smartLockCode || activeBooking.id.slice(-4)}
              </span>
              <span className="text-[8.5px] text-slate-500 font-mono">ثم انقر على رمز المربع (#) لتفعيل الفتح</span>
            </div>
          </div>
        </div>

        {/* Wi-Fi Details Card with instant copy */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 left-4 h-10 w-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
            <Wifi className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>

          <h3 className="text-sm font-bold text-white mb-2">تفاصيل الاتصال بالإنترنت اللاسلكي Wifi</h3>
          <p className="text-slate-400 text-[10.5px] leading-relaxed mb-4 pr-0.5">
             توفر الوحدة اتصال فايبر بصري سريع جداً مجاني بدون قيود استخدام للنزلاء الحاضرين.
          </p>

          <div className="space-y-2">
            
            {/* WiFi Name row */}
            <div className="bg-[#030712] p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(activeUnit?.wifiName || 'Lavender_Resort_5G', 'wifiName')}
                className="text-[9px] text-cyan-400 hover:text-white"
              >
                {copiedWifiName ? '✓ تم النسخ' : 'نسخ اسم الشبكة'}
              </button>
              <div className="flex flex-col text-right font-mono">
                <span className="text-[9px] text-slate-500">اسم شبكة الـ Wifi</span>
                <span className="text-[10.5px] text-slate-200 font-bold">{activeUnit?.wifiName || 'Lavender_Resort_5G'}</span>
              </div>
            </div>

            {/* WiFi Password row */}
            <div className="bg-[#030712] p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(activeUnit?.wifiPass || 'Riyadh2026_Welcome', 'wifiPass')}
                className="text-[9px] text-cyan-400 hover:text-white"
              >
                {copiedWifiPass ? '✓ تم النسخ' : 'نسخ كلمة السر'}
              </button>
              <div className="flex flex-col text-right font-mono">
                <span className="text-[9px] text-slate-500">الرقم السري للشبكة WiFi Password</span>
                <span className="text-[10.5px] text-slate-200 font-bold">{activeUnit?.wifiPass || 'Riyadh2026_Welcome'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Location Directions Map card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 text-right">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5 justify-end">
              <span>الموقع الجغرافي والاتجاهات</span>
              <MapPin className="h-4.5 w-4.5 text-red-500" />
            </h3>
            <p className="text-[10.5px] text-slate-400 leading-relaxed pr-0.5">
               اضغط على الزر بالأسفل لفتح خرائط غوغل وتفصيل أقصر طريق للوصول لبوابة الشاليه / الشقة.
            </p>
          </div>
          
          <div className="bg-[#050C16] border-t border-slate-850 p-4 flex flex-col justify-end">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs text-right">
              <a 
                href={activeUnit?.locationLink || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 bg-gradient-to-l from-slate-200 to-slate-300 hover:from-white text-slate-950 rounded-xl text-[10.5px] font-extrabold"
              >
                افتح الخريطة Google Maps
              </a>
              <div className="flex flex-col">
                <span className="text-[10.5px] text-slate-200 font-bold">العنوان الدقيق للوحدة</span>
                <span className="text-[9.5px] text-slate-450 truncate max-w-[180px] mt-0.5">
                  {activeUnit?.addressText || 'حي الرمال، الرياض'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cohesive House Rules */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-right">
          <h3 className="text-sm font-bold text-white mb-4">تعليمات إقامتك الهانئة وقوانين الوحدة</h3>
          <ul className="space-y-3.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5 justify-end">
              <span className="leading-tight">يرجى من فضلكم إغلاق الباب الذكي بإحكام عند الخروج لإقلاع الأمان الخاص بك.</span>
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            </li>
            <li className="flex items-start gap-2.5 justify-end">
              <span className="leading-tight">المغافرة المعتمدة قبل الساعة 12:00 ظهراً لتجهيز الوحدة للنظافة وصالح الضيف التالي.</span>
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            </li>
            <li className="flex items-start gap-2.5 justify-end">
              <span className="leading-tight">يرجى التفضل بإطفاء التكييفات والإضاءة عند الخروج للحفاظ على البيئة والطاقة.</span>
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            </li>
            <li className="flex items-start gap-2.5 justify-end">
              <span className="leading-tight">التدخين داخل غرف النوم أو المجالس المغلقة غير مسموح حفاظاً على نضارة الغرف والأنسجة.</span>
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            </li>
          </ul>
        </div>

        {/* Immediate help triggers */}
        <div className="bg-[#061122]/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-center space-y-4">
          <HelpCircle className="h-9 w-9 text-[#f59e0b] mx-auto animate-bounce" />
          <div>
            <h4 className="text-sm font-bold text-white">هل تواجه أي صعوبة أو تحتاج لمساعدة فورية؟</h4>
            <p className="text-[10.5px] text-slate-450 mt-1">
               فريق الضيافة والدعم متواجدون على مدار الساعة لخدمتكم وتدبر أي طوارئ تخص الإقامة.
            </p>
          </div>
          <div className="pt-2 flex gap-4">
            <a 
              href={`https://wa.me/${activeUnit?.wifiPass ? '966500000000' : '966504938123'}?text=مرحباً، أنا النزيل ${activeBooking.guestName} بالوحدة ${activeBooking.unitName.split(' - ')[0]} أحتاج لمشورة طارئة بالوحدة.`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 bg-[#0d3119] border border-[#1d6b38] hover:bg-[#154625] text-emerald-400 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>واتساب المضيف المباشر</span>
              <Phone className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
