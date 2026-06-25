/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, Eye, Send, FileText, Variable, Sliders, 
  Smartphone, CheckCircle, HelpCircle, Save, Award, RefreshCw, Sparkles
} from 'lucide-react';
import { Booking, PropertyUnit, WhatsAppTemplate } from '../../types';
import { DEFAULT_TEMPLATES } from '../../data/mockData';

interface WhatsAppAutomatorProps {
  bookings: Booking[];
  units: PropertyUnit[];
  onTriggerAction: (actionName: string, detail: string) => void;
  theme?: string;
}

export default function WhatsAppAutomator({
  bookings,
  units,
  onTriggerAction,
  theme
}: WhatsAppAutomatorProps) {
  const isLight = theme === 'light';
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  
  // Custom editing states
  const [editingContent, setEditingContent] = useState<string>(DEFAULT_TEMPLATES[0].content);
  const [editingTitle, setEditingTitle] = useState<string>(DEFAULT_TEMPLATES[0].title);
  
  // Dispatch simulation feedback state
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Sync edits when selected template changes
  useEffect(() => {
    const curTpl = templates.find(t => t.id === selectedTemplateId);
    if (curTpl) {
      setEditingContent(curTpl.content);
      setEditingTitle(curTpl.title);
    }
  }, [selectedTemplateId, templates]);

  const activeBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];
  const activeUnit = activeBooking ? units.find(u => u.id === activeBooking.unitId) : units[0];

  // Substitute variables in real-time for phone mockup
  const getSubstitutedText = () => {
    if (!editingContent) return '';
    if (!activeBooking) return editingContent;

    const guestName = activeBooking.guestName;
    const unitName = activeBooking.unitName.split(' - ')[0];
    const checkInDate = activeBooking.checkInDate;
    const checkOutDate = activeBooking.checkOutDate;
    const lockCode = activeUnit ? activeUnit.smartLockCode : '1234';
    const wifiName = activeUnit ? activeUnit.wifiName : 'Resort_WIFI_5G';
    const wifiPass = activeUnit ? activeUnit.wifiPass : 'PassRiyadh2026';
    const locationLink = activeUnit ? activeUnit.locationLink : 'https://maps.google.com';
    const guestGuideUrl = `${window.location.origin}/guest-guide/${activeBooking.id}`;

    return editingContent
      .replace(/{GUEST_NAME}/g, guestName)
      .replace(/{UNIT_NAME}/g, unitName)
      .replace(/{CHECK_IN_DATE}/g, checkInDate)
      .replace(/{CHECK_OUT_DATE}/g, checkOutDate)
      .replace(/{SMART_LOCK_CODE}/g, lockCode)
      .replace(/{WIFI_NAME}/g, wifiName)
      .replace(/{WIFI_PASS}/g, wifiPass)
      .replace(/{LOCATION_LINK}/g, locationLink)
      .replace(/{GUEST_PORTAL_URL}/g, guestGuideUrl);
  };

  const handleSaveTemplate = () => {
    setTemplates(prev => prev.map(t => {
      if (t.id === selectedTemplateId) {
        return { ...t, content: editingContent, title: editingTitle };
      }
      return t;
    }));
    onTriggerAction('تعديل قالب الواتساب', `تم حفظ وتعديل قالب "${editingTitle}" بنجاح لجميع الحسابات النشطة.`);
  };

  const handleDispatchSimulation = () => {
    if (!activeBooking) return;
    setIsDispatching(true);
    setDispatchSuccess(false);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      onTriggerAction(
        'إرسال رسالة واتساب آلية محاكاة هاتف النزيل', 
        `النزيل: ${activeBooking.guestName} | الجوال: ${activeBooking.guestPhone}`
      );
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Page headers */}
      <div className={`border-b pb-5 transition-all ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <h2 className={`text-xl sm:text-2xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>أتمتة الواتساب ومراكز التواصل للضيوف</h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
           قم بصياغة وتفصيل رسائل الترحيب التلقائية، أكواد الأقفال، وموقع الواي فاي، ومراجعتها في هاتف الضيف الذكي الفوري.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Template Controls and editor Panel (RHS in RTL) */}
        <div className={`lg:col-span-7 border p-6 rounded-2.5xl space-y-6 transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#061122]/90 border-slate-800'}`}>
          
          <div className={`flex justify-between items-center p-4 rounded-xl border transition-all ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-[#050C16] border-slate-850'}`}>
            <span className="text-xs text-emerald-600 font-bold animate-pulse">● مدمج ومفعل تلقائياً</span>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>إعدادات القالب الذكي</h3>
          </div>

          {/* Quick selectors for templates */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>اختر القالب لتعديله أو معاينته</label>
            <div className="grid grid-cols-2 gap-2.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`px-3 py-2.5 text-xs font-bold rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    selectedTemplateId === tpl.id 
                      ? isLight ? 'bg-slate-900 text-white border-slate-900 font-extrabold shadow-sm' : 'bg-slate-200 text-slate-950 border-white font-extrabold' 
                      : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-[#030712] border-slate-850 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <FileText className="h-4 w-4 opacity-70" />
                  <span>{tpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector for variables simulation */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>اختر الضيف والوحدة لمحاكاة المتغيرات</label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none cursor-pointer text-right transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-amber-500' : 'bg-[#030712] border-slate-850 text-white focus:border-cyan-400'}`}
            >
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  النزيل: {b.guestName} | الوحدة: {b.unitName.split(' - ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Text Editor layout */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono">⚠️ لا تحذف الكلمات المحصورة بين قوسين {"{ }"}</span>
              <label className={`block text-xs font-bold ${isLight ? 'text-slate-750' : 'text-slate-350'}`}>نص الرسالة والصياغة العربية</label>
            </div>
            
            <textarea
              rows={8}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className={`w-full border rounded-2xl p-4 text-xs placeholder-slate-450 font-sans focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-amber-500' : 'bg-[#030712] border-slate-850 text-slate-100 focus:border-cyan-400'}`}
              style={{ lineHeight: '1.7' }}
            />

            {/* Quick Helper variable insert buttons */}
            <div className={`flex flex-wrap items-center gap-1.5 p-3 border rounded-xl transition-all ${isLight ? 'bg-slate-50 border-slate-200/60' : 'bg-[#030712]/50 border-slate-850'}`}>
              <span className={`text-[9px] font-bold block shrink-0 ml-2 ${isLight ? 'text-amber-600' : 'text-[#f59e0b]'}`}>المتغيرات السريعة:</span>
              <button onClick={() => setEditingContent(p => p + ' {GUEST_NAME}')} className={`px-2 py-1 text-[9px] border hover:opacity-85 rounded-md font-mono transition-all cursor-pointer ${isLight ? 'bg-white border-slate-250 text-slate-750 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'bg-slate-900 border-slate-850 text-zinc-300'}`}>{"{النزيل}"}</button>
              <button onClick={() => setEditingContent(p => p + ' {UNIT_NAME}')} className={`px-2 py-1 text-[9px] border hover:opacity-85 rounded-md font-mono transition-all cursor-pointer ${isLight ? 'bg-white border-slate-250 text-slate-755 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'bg-slate-900 border-slate-850 text-zinc-300'}`}>{"{العقار}"}</button>
              <button onClick={() => setEditingContent(p => p + ' {SMART_LOCK_CODE}')} className={`px-2 py-1 text-[9px] border hover:opacity-85 rounded-md font-mono transition-all cursor-pointer ${isLight ? 'bg-white border-slate-250 text-slate-755 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'bg-slate-900 border-slate-850 text-zinc-300'}`}>{"{القفل الذكي}"}</button>
              <button onClick={() => setEditingContent(p => p + ' {WIFI_NAME}')} className={`px-2 py-1 text-[9px] border hover:opacity-85 rounded-md font-mono transition-all cursor-pointer ${isLight ? 'bg-white border-slate-250 text-slate-755 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'bg-slate-900 border-slate-850 text-zinc-300'}`}>{"{الواي_فاي}"}</button>
              <button onClick={() => setEditingContent(p => p + ' {GUEST_PORTAL_URL}')} className={`px-2 py-1 text-[9px] border hover:opacity-85 rounded-md font-mono transition-all cursor-pointer ${isLight ? 'bg-white border-slate-250 text-slate-755 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 'bg-slate-900 border-slate-850 text-zinc-300'}`}>{"{رابط الدخول}"}</button>
            </div>
          </div>

          {/* Actions to Save and Test */}
          <div className={`pt-4 border-t flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap ${isLight ? 'border-slate-200' : 'border-slate-850'}`}>
            
            {/* Save Button */}
            <button
              onClick={handleSaveTemplate}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${isLight ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm' : 'bg-slate-900 hover:bg-slate-850 text-white border-slate-800'}`}
            >
              <Save className={`h-4 w-4 ${isLight ? 'text-amber-500' : 'text-cyan-400'}`} />
              <span>حفظ القالب</span>
            </button>

            {/* Simulated Trigger Dispatch Button */}
            <button
              onClick={handleDispatchSimulation}
              disabled={isDispatching || !activeBooking}
              className={`px-6 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                isDispatching 
                  ? 'bg-slate-950 text-slate-500 cursor-wait'
                  : dispatchSuccess
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    : isLight ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-0' : 'bg-gradient-to-l from-slate-200 to-slate-300 hover:from-white text-slate-950'
              }`}
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span>
                {isDispatching ? 'جاري محاكاة الإرسال للهاتف...' : dispatchSuccess ? 'تم تسليمه للهاتف بنجاح! ✓✓' : 'إرسال اختبار محاكاة واتساب'}
              </span>
            </button>

          </div>

        </div>

        {/* Guest SmartPhone Layout simulator mockup (LHS in RTL) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="relative mx-auto w-full max-w-[340px] rounded-[36px] bg-slate-950 p-4 border-[6px] border-slate-800 shadow-2xl">
            
            {/* Dynamic camera notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
              <span className="w-6 h-1 rounded-full bg-slate-900 mr-1.5 opacity-55"></span>
            </div>

            {/* Smart mobile screens inside */}
            <div className="rounded-[28px] overflow-hidden bg-[#0a1710] border border-slate-900 h-[480px] flex flex-col justify-between font-sans opacity-95 relative">
              
              {/* WhatsApp mobile header */}
              <div className="bg-[#0b141a] text-white pt-8 pb-3 px-4 flex items-center justify-between border-b border-[#1b252b]">
                <span className="text-[10px] font-mono font-bold text-slate-400">9:41 AM</span>
                
                {/* Contact name and verification badge */}
                <div className="flex flex-col text-right pr-6">
                  <span className="font-extrabold text-[11px] text-white flex items-center gap-1">
                    سعود النعام للخدمات العقارية
                    <span className="h-2.5 w-2.5 bg-[#00e676] rounded-full flex items-center justify-center text-[7px] text-black font-extrabold" title="حساب أعمال موثق">✓</span>
                  </span>
                  <span className="text-[8px] text-[#00e676]">الحساب الرسمي للمضيف</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <span className="text-[10px] text-white font-extrabold font-mono">SN</span>
                </div>
              </div>

              {/* Chat Stream message body with variables substituted in */}
              <div className="flex-1 p-3.5 space-y-4 overflow-y-auto text-right" style={{ WebkitOverflowScrolling: 'touch' }}>
                
                {/* Center date label */}
                <div className="text-center">
                  <span className="bg-[#121c21] text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded shadow">اليوم</span>
                </div>

                {/* Received message bubble styled as dynamic WhatsApp template */}
                {activeBooking ? (
                  <div className="bg-[#005c4b] text-white p-3 rounded-2xl max-w-[90%] mr-auto rounded-tl-none relative shadow-md">
                    <p className="text-[10.5px] leading-relaxed whitespace-pre-line text-right">
                      {getSubstitutedText()}
                    </p>
                    <div className="flex justify-end items-center gap-1.5 mt-2 text-[8px] text-[#8696a0]">
                      <span>9:41 AM</span>
                      <span className="text-cyan-400 font-bold">✓✓</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-500 py-10 font-bold">
                    يرجى تسجيل حجز نشط لمحاكات التدفقات
                  </div>
                )}

              </div>

              {/* Fake chat keyboards interface */}
              <div className="bg-[#1f2c34] p-2.5 border-t border-[#121b22] flex items-center justify-between gap-3">
                <div className="flex-1 bg-[#2a3942] rounded-xl px-3 py-1.5 border border-slate-850 text-right text-[10px] text-slate-400 cursor-not-allowed">
                  اكتب رسالة...
                </div>
                <div className="h-8 w-8 rounded-full bg-[#00a884] flex items-center justify-center text-white font-extrabold text-xs">
                  🎤
                </div>
              </div>

            </div >

          </div>

          <p className={`text-[10.5px] font-medium text-center mt-3 max-w-sm leading-normal ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
             * هذا المنظور يوضح بدقة محاكاة رسائل الواتساب الفورية التي يستلمها النزيل على هاتفه الذكي الشخصي بشكل فوري.
          </p>

        </div>

      </div>

    </div>
  );
}
