/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Search, Trash2, Send, MessageSquare, 
  Settings, Key, ShieldCheck, Mail, Sparkles, CheckCircle2
} from 'lucide-react';
import { Booking, PropertyUnit } from '../../types';

interface NotificationsManagerProps {
  bookings: Booking[];
  units: PropertyUnit[];
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function NotificationsManager({
  bookings,
  units,
  theme,
  onTriggerAction
}: NotificationsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [channels, setChannels] = useState<'all' | 'whatsapp' | 'sms' | 'system'>('all');
  const [quickType, setQuickType] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [quickRecipient, setQuickRecipient] = useState('');
  const [quickMessage, setQuickMessage] = useState('');

  // Static list of notification templates
  const [templates, setTemplates] = useState([
    { id: 't-1', title: 'سند استلام الدخول والترحيب 🔑', channel: 'whatsapp', content: 'أهلاً بك {GUEST_NAME}، حجزك لـ {UNIT_NAME} مغطى بالكامل وسعداء باستقبالك.' },
    { id: 't-2', title: 'تنبيه دفع الإيجار الموحد 💸', channel: 'sms', content: 'عزيزنا المستأجر، نود تذكيرك بالتحضير لسداد دفعتك الإيجارية القادمة لتجنب أي إشكال.' },
    { id: 't-3', title: 'بوابات الأمان الذمية والواي فاي 📶', channel: 'whatsapp', content: 'مرحباً، إحداثيات الموقع لـ {UNIT_NAME}: {WIFI_PASS} وشبكتك مفعلة.' }
  ]);

  // Logs of triggered alerts
  const [logs, setLogs] = useState([
    { id: 'l-1', type: 'whatsapp', recipient: 'أحمد بن عبد الرحمن الشمري', title: 'رسالة ترحيبية وتثبيت كود الباب', date: '2026-06-20', status: 'delivered' },
    { id: 'l-2', type: 'system', recipient: 'النظام العام', title: 'انخفاض بطارية القفل شقة العليا', date: '2026-06-19', status: 'alert' },
    { id: 'l-3', type: 'sms', recipient: 'د. خالد سليم السبيعي', title: 'تصدير الفاتورة الضريبية ZATCA', date: '2026-06-18', status: 'sent' }
  ]);

  const handleSendMockNotif = (rec: string, title: string, type: string) => {
    const id = 'l-' + Date.now();
    const addedLog = {
      id,
      type: type as any,
      recipient: rec,
      title,
      date: new Date().toISOString().split('T')[0],
      status: 'delivered'
    };
    setLogs([addedLog, ...logs]);
    onTriggerAction('إرسال تنبيه فوري', `تم تسييل وإرسال تنبيه "${title}" فوراً للمستلم ${rec}`);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Module Header */}
      <div>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
          🔔 إرسال الإشعارات والتنبيهات المبرمجة (Notifications Hub)
        </h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          مكينة حملات التوجية التلفونية، رسائل تذكير المستأجرين، ومطابقة بوابات الأمان والواي فاي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Templates Panel */}
        <div className={`p-6 rounded-[32px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center gap-1.5 justify-end">
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>قوالب الرسائل المعتمدة 📜</h3>
            <MessageSquare className="h-4 w-4 text-[#C5A880]" />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {templates.map(tpl => (
              <div 
                key={tpl.id} 
                className={`p-3.5 rounded-2xl border ${
                  isDark ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black ${
                    tpl.channel === 'whatsapp' ? 'bg-emerald-900/20 text-[#00E676]' : 'bg-blue-900/20 text-blue-400'
                  }`}>
                    {tpl.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                  </span>
                  <span className={`font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{tpl.title}</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-semibold text-[10.5px]">{tpl.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live trigger logs list (Middle & Right columns) */}
        <div className={`lg:col-span-2 p-6 rounded-[32px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex justify-between items-center sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1 px-3.5 bg-cyan-900/20 text-cyan-400 rounded-full text-[10px] font-bold">
                قنوات الاتصال الموحدة
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 justify-end">
              <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>سجل الإرسال الصادر والاتصال 📡</h3>
              <Bell className="h-4 w-4 text-[#1E40AF]" />
            </div>
          </div>

          {/* Table list of sent notifications */}
          <div className="space-y-3 pt-2 text-xs">
            {logs.map(log => (
              <div 
                key={log.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-[#020617] border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                } transition-all`}
              >
                {/* Status Indicator */}
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${
                  log.status === 'delivered' ? 'bg-emerald-500/10 text-[#00E676]' : log.status === 'sent' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-rose-500 font-extrabold animate-pulse'
                }`}>
                  {log.status === 'delivered' ? 'مستلمة ✓' : log.status === 'sent' ? 'مرسلة' : 'تحذير أمني ⚠️'}
                </span>

                <div className="text-right flex-1 space-y-0.5">
                  <span className={`font-bold block text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {log.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block">المستقبل: {log.recipient} | {log.date}</span>
                </div>

                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-slate-950/40 text-slate-400' : 'bg-white text-slate-700'} border border-slate-800/10`}>
                  {log.type === 'whatsapp' ? '📲 WhatsApp' : log.type === 'sms' ? '💬 SMS' : '⚙️ النظام'}
                </div>
              </div>
            ))}
          </div>

          {/* Quick trigger box */}
          <div className={`p-4 rounded-2xl border mt-4 ${isDark ? 'bg-slate-950/30 border-slate-850' : 'bg-slate-50 border-slate-100'}`}>
            <h4 className="text-xs font-bold text-slate-400 mb-2">إرسال إشعار فوري سريع (Quick SMS/WhatsApp dispatch):</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={quickType}
                onChange={(e) => setQuickType(e.target.value as 'whatsapp' | 'sms')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                } border focus:outline-none`}
              >
                <option value="whatsapp">جوال الواتساب</option>
                <option value="sms">رسائل SMS القصيرة</option>
              </select>
              <input 
                type="text" 
                value={quickRecipient}
                onChange={(e) => setQuickRecipient(e.target.value)}
                placeholder="اسم المستلم أو رقم الجوال..." 
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                } border focus:outline-none`}
              />
              <input 
                type="text" 
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="اكتب التنبيه السريع..." 
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                } border focus:outline-none`}
              />
              <button
                onClick={() => {
                  const r = quickRecipient.trim() || 'عبد الرحمن الشمري';
                  const m = quickMessage.trim() || 'أهلاً بك، رمز الدخول مفعل';
                  handleSendMockNotif(r, m, quickType);
                  setQuickMessage('');
                  setQuickRecipient('');
                }}
                className="bg-[#1E40AF] hover:bg-[#153185] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                إرسال التنبيه
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
