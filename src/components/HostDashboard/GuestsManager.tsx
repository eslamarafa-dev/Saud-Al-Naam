/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Search, Filter, Phone, Mail, Plus, MapPin, 
  Trash2, Star, CheckCircle, Smartphone, AlertCircle, Copy, Send
} from 'lucide-react';
import { Booking, PropertyUnit } from '../../types';

interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  preferredUnitId?: string;
}

interface GuestsManagerProps {
  bookings: Booking[];
  units: PropertyUnit[];
  onTriggerAction: (title: string, desc: string) => void;
  theme?: string;
}

export default function GuestsManager({ bookings, units, onTriggerAction, theme }: GuestsManagerProps) {
  const isLight = theme === 'light';
  // Aggregate guests from live bookings to display dynamic records
  const initialGuests: GuestProfile[] = [];
  const phoneSet = new Set<string>();

  // Extract from existing bookings
  bookings.forEach(b => {
    if (!b.guestPhone) return;
    if (!phoneSet.has(b.guestPhone)) {
      phoneSet.add(b.guestPhone);
      initialGuests.push({
        id: `guest-${b.id}`,
        name: b.guestName,
        phone: b.guestPhone,
        email: b.guestEmail || '',
        tags: b.payoutAmount > 3000 ? ['عميل VIP 👑', 'ملتزم بالدفع 💸'] : ['عميل مميز ⭐️'],
        notes: b.notes || 'لا يوجد ملاحظات خاصة للضيف لحد الآن.',
        createdAt: b.createdAt || '2026-06-15',
        preferredUnitId: b.unitId
      });
    }
  });

  // Fallback defaults if bookings are low
  if (initialGuests.length === 0) {
    initialGuests.push(
      {
        id: 'guest-init-1',
        name: 'عبدالمحسن بن عبدالعزيز السديري',
        phone: '966503482103',
        email: 'a.sudairy@seder.com.sa',
        tags: ['عميل VIP 👑', 'ملتزم بالدفع 💸'],
        notes: 'يفضل المغادرة المتأخرة، عميل دائم لوحدات العليا التنفيذية وتهمّه سرعة الواي فاي جودتها.',
        createdAt: '2026-05-10',
        preferredUnitId: 'unit-2'
      },
      {
        id: 'guest-init-2',
        name: 'سارة بنت تميم الحربي',
        phone: '966540209931',
        email: 'sara.harbi@gmail.com',
        tags: ['شراشف إضافية 🛏️', 'محب للطبيعة 🌿'],
        notes: 'دائماً تطلب سلة فواكه ترحيبية عند الدخول. تفضل شاليه اللافندر الفاخر.',
        createdAt: '2026-06-01',
        preferredUnitId: 'unit-1'
      }
    );
  }

  const [localGuests, setLocalGuests] = useState<GuestProfile[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [newGuestModal, setNewGuestModal] = useState(false);
  
  // New input states
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestNotes, setNewGuestNotes] = useState('');
  const [newGuestTag, setNewGuestTag] = useState('عميل مميز ⭐️');
  const [newGuestPrefUnit, setNewGuestPrefUnit] = useState('');

  // Contact Drawer state for WhatsApp typing simulator
  const [contactingGuest, setContactingGuest] = useState<GuestProfile | null>(null);
  const [customWsMsg, setCustomWsMsg] = useState('');

  const availableTags = [
    'عميل VIP 👑', 
    'ملتزم بالدفع 💸', 
    'عميل مميز ⭐️', 
    'محب للطبيعة 🌿', 
    'شراشف إضافية 🛏️', 
    'مغادر متأخر 🕒'
  ];

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestPhone) return;

    const newlyCreated: GuestProfile = {
      id: `guest-custom-${Date.now()}`,
      name: newGuestName,
      phone: newGuestPhone,
      email: newGuestEmail,
      tags: [newGuestTag],
      notes: newGuestNotes || 'منشأ يدوياً في الملفات',
      createdAt: new Date().toISOString().split('T')[0],
      preferredUnitId: newGuestPrefUnit || undefined
    };

    setLocalGuests([newlyCreated, ...localGuests]);
    setNewGuestModal(false);
    onTriggerAction('إضافة ضيف جديد', `تم تسجيل العميل ${newGuestName} في قاعدة البيانات بنجاح`);

    // Reset Form
    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestEmail('');
    setNewGuestNotes('');
  };

  const handleDeleteGuest = (id: string, name: string) => {
    setLocalGuests(localGuests.filter(g => g.id !== id));
    onTriggerAction('حذف حساب ضيف', `تم سحب ملف العميل ${name} من قاعدة البيانات بنجاح`);
  };

  const handleOpenContactSimulator = (guest: GuestProfile) => {
    setContactingGuest(guest);
    setCustomWsMsg(`مرحباً أستاذ ${guest.name}، يسعدنا تواصلك مع إدارة سعود النعام للخدمات العقارية. نود إرسال الدليل الرقمي الخاص بزياراتك القادمة...`);
  };

  const handleSendSimulatedMsg = () => {
    if (!contactingGuest) return;
    onTriggerAction(
      'إجراء تواصل ذكي', 
      `تم إرسال رسالة واتساب للضيف ${contactingGuest.name} عبر الرقم ${contactingGuest.phone}`
    );
    setContactingGuest(null);
  };

  // Compute stay metrics
  const getGuestStats = (phone: string) => {
    const guestBookings = bookings.filter(b => b.guestPhone === phone);
    const totalBookedCount = guestBookings.length || 1; // minimum 1 for existing profiles
    const totalSpent = guestBookings.reduce((sum, b) => sum + b.payoutAmount, 0) || 1200; // minimum fallback estimate
    return {
      count: totalBookedCount,
      spent: totalSpent
    };
  };

  // Filter Guests
  const filteredGuests = localGuests.filter(g => {
    const matchesSearch = 
      g.name.includes(searchQuery) || 
      g.phone.includes(searchQuery) || 
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = 
      selectedTagFilter === 'all' || 
      g.tags.includes(selectedTagFilter);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Upper header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border border-slate-800'}`}>
        <div className="flex flex-col text-right">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-end ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>إدارة وتصنيف بيانات النزلاء والضيوف</span>
            <Users className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            مستودع بيانات النزلاء لتبويب تفضيلات الإقامة، التقييمات التراكمية، ومتابعة التواصل الذكي.
          </p>
        </div>
        <button
          onClick={() => setNewGuestModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>تسجيل نزيل جديد</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/20 border border-slate-850'}`}>
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <input
            type="text"
            placeholder="ابحث بالاسم، رقم الجوال أو البريد الإلكتروني للنزيل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl outline-none text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500' : 'bg-[#050C16] text-white border-slate-800 focus:border-emerald-500/80'}`}
          />
          <Search className={`absolute right-3.5 top-3.5 h-4 w-4 ${isLight ? 'text-slate-450' : 'text-slate-400'}`} />
        </div>

        {/* Tag select filter */}
        <div className="md:col-span-4 relative">
          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs rounded-xl outline-none cursor-pointer border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500' : 'bg-[#050C16] text-slate-300 border-slate-800 focus:border-emerald-500'}`}
          >
            <option value="all">كل الأوسمة والتصنيفات</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Counters summary */}
        <div className={`md:col-span-2 text-center sm:text-left text-[11px] font-bold border-r pr-4 ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
          أظهرت النتائج: <span className="text-emerald-500">{filteredGuests.length}</span> نزلاء
        </div>
      </div>

      {/* Guests Cards bento list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => {
          const stats = getGuestStats(guest.phone);
          const prefUnit = units.find(u => u.id === guest.preferredUnitId);

          return (
            <div 
              key={guest.id}
              className={`border rounded-2.5xl p-6 transition-all flex flex-col justify-between ${isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' : 'bg-slate-900/40 border border-slate-800 hover:border-slate-700'}`}
            >
              <div>
                
                {/* Guest General Card Header */}
                <div className="flex justify-between items-start gap-2 mb-4">
                  
                  {/* Avatar design */}
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-xs font-mono border ${isLight ? 'bg-slate-100 border-slate-200 text-emerald-600' : 'bg-slate-950 border-slate-800 text-emerald-400'}`}>
                    {guest.name.charAt(0)}
                  </div>

                  {/* Name details */}
                  <div className="flex flex-col text-right flex-1">
                    <h4 className={`font-extrabold text-xs max-w-[170px] truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{guest.name}</h4>
                    <span className={`text-[10px] mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{guest.phone}</span>
                  </div>

                  {/* Star and vip icon */}
                  <span className="text-amber-400 text-xs">⭐</span>

                </div>

                {/* Tags section */}
                <div className="flex flex-wrap gap-1.5 mb-4 justify-start">
                  {guest.tags.map((tag, i) => (
                    <span key={i} className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Guest Stats summary */}
                <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl text-right text-[10px] mb-4 border ${isLight ? 'bg-slate-50 border-slate-100 text-slate-800' : 'bg-slate-950/60 border-slate-850/60'}`}>
                  <div>
                    <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} font-bold block mb-0.5`}>عدد الليالي المحجوزة</span>
                    <strong className={`${isLight ? 'text-slate-800' : 'text-white'} font-mono`}>{stats.count * 2} ليالي</strong>
                  </div>
                  <div>
                    <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} font-bold block mb-0.5`}>إجمالي المدفوعات</span>
                    <strong className={`${isLight ? 'text-emerald-600' : 'text-emerald-400'} font-mono`}>{stats.spent.toLocaleString()} ر.س</strong>
                  </div>
                </div>

                {/* Preferred Unit info */}
                {prefUnit && (
                  <div className={`text-[10px] mb-4 flex items-center gap-1 p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/20 border-slate-900 text-slate-400'}`}>
                    <MapPin className="h-3.5 w-3.5 text-cyan-450 ml-1 shrink-0" />
                    <span className="truncate">الوحدة المفضلة: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{prefUnit.name.split(' - ')[0]}</strong></span>
                  </div>
                )}

                {/* Notes and description */}
                <div className={`p-3 rounded-lg text-right mb-5 border ${isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-950/30 border-slate-900/65'}`}>
                  <span className="text-[9px] text-[#00e676] font-bold block mb-1 font-sans">توجيهات وملاحظات الخدمة:</span>
                  <p className={`text-[10px] leading-normal line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {guest.notes}
                  </p>
                </div>

              </div>

              {/* Action buttons footer */}
              <div className={`flex gap-2 border-t pt-4 mt-auto ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <button
                  onClick={() => handleOpenContactSimulator(guest)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${isLight ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-[#0c3115]/40 hover:bg-[#0c3115]/80 border-emerald-900/60 text-emerald-400'}`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>تواصل بالواتس</span>
                </button>
                <button
                  onClick={() => handleDeleteGuest(guest.id, guest.name)}
                  className={`px-2.5 py-1.5 bg-transparent rounded-lg text-xs flex items-center justify-center cursor-pointer transition-all border border-transparent ${isLight ? 'hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-200' : 'hover:bg-red-950/50 text-slate-500 hover:text-red-400 hover:border-red-900'}`}
                  title="مسح حساب النزيل"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Manual Guest creator modal overlay */}
      {newGuestModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right animate-fade-in" style={{ direction: 'rtl' }}>
          <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050C16] border-slate-800'} border rounded-2.5xl p-6 max-w-lg w-full space-y-4`}>
            
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button onClick={() => setNewGuestModal(false)} className={`hover:text-red-500 font-extrabold cursor-pointer ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>✕</button>
              <h3 className={`text-md font-extrabold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Users className="h-5 w-5 text-emerald-400" />
                <span>تسجيل وتأصيل بيانات النزيل يدوياً</span>
              </h3>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>اسم النزيل بالكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صالح الرشيد"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>رقم الجوال *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 966503004000"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none text-right font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    placeholder="guest@mail.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none text-right font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>التصنيف والوسم الأساسي</label>
                  <select
                    value={newGuestTag}
                    onChange={(e) => setNewGuestTag(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none cursor-pointer border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-slate-300 focus:border-emerald-500'}`}
                  >
                    {availableTags.map(tag => (
                      <option key={tag} value={tag} className={isLight ? 'text-slate-900' : 'text-slate-300'}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>الوحدة المفضلة لهذا النزيل</label>
                <select
                  value={newGuestPrefUnit}
                  onChange={(e) => setNewGuestPrefUnit(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl outline-none cursor-pointer text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-slate-300 focus:border-emerald-500'}`}
                >
                  <option value="" className={isLight ? 'text-slate-900' : 'text-slate-300'}>لم يتم التحديد</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id} className={isLight ? 'text-slate-900' : 'text-slate-300'}>{u.name.split(' - ')[0]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>تعليمات الخدمة أو تفضيلات الإقامة</label>
                <textarea
                  placeholder="اكتب أي تعليمات خاصة، مثل طلب قهوة سوداء، مغادرة متأخرة، أو شراشف إضافية..."
                  value={newGuestNotes}
                  onChange={(e) => setNewGuestNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-xl outline-none text-right resize-none border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                />
              </div>

              <div className={`flex gap-2.5 pt-4 border-t justify-end ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                <button
                  type="button"
                  onClick={() => setNewGuestModal(false)}
                  className={`px-4 py-2 rounded-xl cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-850 text-slate-300'}`}
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl cursor-pointer"
                >
                  حفظ العميل
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Chat simulator drawer */}
      {contactingGuest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right animate-fade-in" style={{ direction: 'rtl' }}>
          <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050C16] border-slate-800'} border rounded-2.5xl p-6 max-w-md w-full space-y-4`}>
            
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button onClick={() => setContactingGuest(null)} className={`hover:text-red-500 font-extrabold cursor-pointer ${isLight ? 'text-slate-400' : 'text-slate-455'}`}>✕</button>
              <h3 className={`text-sm font-extrabold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Smartphone className="h-4.5 w-4.5 text-emerald-400" />
                <span>محاكي إرسال واتساب المباشر للضيف</span>
              </h3>
            </div>

            <div className={`p-3.5 rounded-xl text-xs border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-850/60'}`}>
              <div className="mb-2">
                <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block font-bold mb-0.5`}>اسم النزيل المرسل له:</span>
                <strong className={isLight ? 'text-slate-900' : 'text-white'}>{contactingGuest.name}</strong>
              </div>
              <div>
                <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block font-bold mb-0.5`}>رقم جوال الواتساب:</span>
                <strong className={`${isLight ? 'text-emerald-600 font-extrabold' : 'text-emerald-400'} font-mono`}>+{contactingGuest.phone}</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>محتوى رسالة الواتس الآلية (يمكنك تعديلها):</label>
              <textarea
                value={customWsMsg}
                onChange={(e) => setCustomWsMsg(e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 rounded-xl outline-none text-right resize-none text-[11px] border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
              />
            </div>

            <p className={`text-[10px] p-2.5 rounded-lg flex items-center gap-1.5 leading-normal ${isLight ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-yellow-500 bg-yellow-950/30 border border-yellow-900/40'}`}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>يحاكي تسيير إشعار مباشر لبرامج المحادثات وربط السيرفر مع WhatsApp Cloud Business API المعتمدة.</span>
            </p>

            <div className="flex gap-2.5 pt-3 justify-end">
              <button
                type="button"
                onClick={() => setContactingGuest(null)}
                className={`px-4 py-1.5 rounded-xl text-xs cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-750' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                تجاهل
              </button>
              <button
                type="button"
                onClick={handleSendSimulatedMsg}
                className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>إبرام الإرسال المباشر</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
