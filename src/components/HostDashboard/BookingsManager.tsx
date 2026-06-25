/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, Plus, Search, Filter, ArrowLeft, Send, Mail, Phone, 
  MapPin, Clock, DollarSign, Users, Award, Eye, Trash, RefreshCw
} from 'lucide-react';
import { Booking, PropertyUnit } from '../../types';

interface BookingsManagerProps {
  bookings: Booking[];
  units: PropertyUnit[];
  onAddBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onTriggerAction: (actionName: string, detail: string) => void;
  onOpenGuestGuide: (booking: Booking) => void;
  theme?: string;
}

export default function BookingsManager({
  bookings,
  units,
  onAddBooking,
  onCancelBooking,
  onTriggerAction,
  onOpenGuestGuide,
  theme
}: BookingsManagerProps) {
  const isLight = theme === 'light';
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // New Booking Form states
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [source, setSource] = useState<'direct' | 'airbnb' | 'booking' | 'gathern'>('direct');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paidStatus, setPaidStatus] = useState<'fully_paid' | 'partial' | 'unpaid'>('fully_paid');
  const [notes, setNotes] = useState('');

  // Auto price computation when unit and dates changes
  const handleUnitOrDatesChange = (unitId: string, checkin: string, checkout: string) => {
    if (!unitId || !checkin || !checkout) return;
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      setTotalPrice(unit.pricePerNight * diffDays);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !guestName || !guestPhone || !checkInDate || !checkOutDate) return;

    const matchedUnit = units.find(u => u.id === selectedUnitId);
    const unitNameLabel = matchedUnit ? matchedUnit.name : 'وحدة سكنية مخصصة';

    const newBooking: Booking = {
      id: 'b-' + Date.now().toString().slice(-4),
      unitId: selectedUnitId,
      unitName: unitNameLabel,
      guestName,
      guestPhone,
      guestEmail: guestEmail || undefined,
      checkInDate,
      checkOutDate,
      createdAt: new Date().toISOString().split('T')[0],
      source,
      payoutAmount: totalPrice || 1000,
      guestCount,
      status: 'upcoming',
      paidStatus,
      smartLockCodeSent: false,
      notes: notes || undefined
    };

    onAddBooking(newBooking);
    setShowAddModal(false);
    onTriggerAction('تسجيل حجز يدوي مباشر', `الضيف: ${newBooking.guestName} للوحدة ${newBooking.unitName}`);

    // Reset fields
    setSelectedUnitId('');
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setCheckInDate('');
    setCheckOutDate('');
    setGuestCount(2);
    setSource('direct');
    setTotalPrice(0);
    setNotes('');
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter(b => {
    const matchesKeyword = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           b.guestPhone.includes(searchQuery);
    const matchesSource = sourceFilter === 'all' || b.source === sourceFilter;
    return matchesKeyword && matchesSource;
  });

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Header with quick creation action */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 ${isLight ? 'border-slate-150' : 'border-slate-800'}`}>
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>إشغال التقويم وحركة الحجوزات</h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             تزامن الحجوزات مع جاذر إن، Airbnb، بوكينج، وطلبات الحجز الهاتفي اليدوي المباشر بمرونة.
          </p>
        </div>
        <button
          onClick={() => {
            if (units.length === 0) {
              onTriggerAction('تنبيه النظام', 'يرجى إضافة وحدة سكنية أولاً في إدارة الوحدات لتتمكن من حجزها.');
              return;
            }
            setShowAddModal(true);
          }}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${isLight ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md' : 'bg-gradient-to-l from-slate-200 to-slate-300 text-slate-950 hover:shadow-slate-300/5'}`}
        >
          <Plus className="h-4 w-4" />
          <span>إضافة حجز مباشر</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="ابحث باسم الضيف، رقم الجوال، اسم الوحدة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl px-4 py-2.5 pl-10 text-xs placeholder-slate-450 focus:outline-none focus:border-cyan-400 transition-all text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#050C16] border-slate-850 text-white'}`}
          />
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        {/* Source Channels selector */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold shrink-0 ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>قنوات الحجز:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={`text-xs border rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#050C16] border-slate-850 text-white'}`}
          >
            <option value="all">كل المنصات</option>
            <option value="gathern">جاذر إن (Gathern)</option>
            <option value="airbnb">إير بي إن بي (Airbnb)</option>
            <option value="booking">بوكينج دوت كوم (Booking)</option>
            <option value="direct">حجز مباشر هاتفياً</option>
          </select>
        </div>

      </div>

      {/* Bookings registry log */}
      {filteredBookings.length === 0 ? (
        <div className={`border rounded-2xl p-12 text-center ${isLight ? 'bg-slate-50 border-slate-200 text-slate-650' : 'bg-slate-900/10 border-slate-850 text-slate-400'}`}>
          <Calendar className="h-12 w-12 text-zinc-500 mx-auto mb-4 animate-bounce" />
          <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>لم يتم العثور على أي حجز مسجل حالياً</h4>
          <p className="text-xs text-slate-500 mt-1">تأكد من دقة فلترة البحث أو اضغط على الزر بالأعلى لتسجيل حجز جديد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCompleted = booking.status === 'completed';
            const isActive = booking.status === 'active';
            const isCancelled = booking.status === 'cancelled';
            const isUpcoming = booking.status === 'upcoming';

            return (
              <div 
                key={booking.id}
                className={`p-5 rounded-2.5xl border transition-all ${
                  isCancelled 
                    ? (isLight ? 'bg-slate-100/50 border-slate-200 opacity-60' : 'bg-slate-950/20 border-slate-900 opacity-60') 
                    : (isLight ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' : 'bg-[#061122]/90 border-slate-800 hover:border-slate-705')
                }`}
              >
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-right">
                  
                  {/* Guest Bio Segment */}
                  <div className="flex gap-4 items-start justify-end flex-wrap sm:flex-nowrap">
                    
                    {/* Source flag */}
                    <div className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-50 border-slate-150' : 'bg-[#091427] border-slate-850'}`}>
                      {booking.source === 'airbnb' ? (
                        <span className="text-red-500 text-xs font-mono font-bold">Airbnb</span>
                      ) : booking.source === 'gathern' ? (
                        <span className="text-yellow-600 text-xs font-mono font-bold">Gathern</span>
                      ) : booking.source === 'booking' ? (
                        <span className="text-blue-500 text-xs font-mono font-bold">Booking</span>
                      ) : (
                        <span className={`text-xs font-mono font-extrabold ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>مباشر</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{booking.guestName}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-emerald-950 border border-emerald-900 text-emerald-400' :
                          isUpcoming ? 'bg-cyan-950 border border-cyan-900 text-cyan-400' :
                          isCompleted ? 'bg-slate-900 border border-slate-800 text-slate-400' :
                          'bg-red-950 border border-red-900 text-red-400'
                        }`}>
                          {isActive ? 'إقامة حالية' : isUpcoming ? 'قادم قريباً' : isCompleted ? 'تمت المغادرة' : 'ملغي'}
                        </span>
                      </div>
                      
                      <p className={`text-xs font-bold mt-1.5 leading-normal ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        الوحدة المحجوزة: {booking.unitName}
                      </p>

                      {/* Micro info bits */}
                      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>
                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {booking.guestPhone}</span>
                        {booking.guestEmail && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> {booking.guestEmail}</span>}
                        <span className={`flex items-center gap-1 ${isLight ? 'text-slate-450' : 'text-slate-350'}`}>
                           حُجز في: {booking.createdAt}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Financial & Stay Dates and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto justify-end">
                    
                    {/* Stay details and payouts */}
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div className={`border-r pr-3.5 ${isLight ? 'border-slate-150' : 'border-slate-800'}`}>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>تواريخ الإقامة</span>
                        <span className={`text-xs block font-bold font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>دخول: {booking.checkInDate}</span>
                        <span className={`text-xs block font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>خروج: {booking.checkOutDate}</span>
                      </div>
                      <div className={`border-r pr-3.5 ${isLight ? 'border-slate-150' : 'border-slate-800'}`}>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>إجمالي التعرفة المدفوعة</span>
                        <span className={`text-sm font-extrabold block font-mono ${isLight ? 'text-emerald-700' : 'text-[#10b981]'}`}>
                          {booking.payoutAmount} ر.س
                        </span>
                        <span className="text-[9px] text-[#f59e0b] block font-semibold">
                          {booking.paidStatus === 'fully_paid' ? 'تم الدفع بالكامل ✓' : booking.paidStatus === 'partial' ? 'عربون جزئي' : 'غير مسدد'}
                        </span>
                      </div>
                    </div>

                    {/* Operational triggers */}
                    <div className={`flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 ${isLight ? 'border-slate-150' : 'border-slate-850'}`}>
                      
                      {/* Dynamic guest guide button */}
                      <button
                        onClick={() => onOpenGuestGuide(booking)}
                        className={`py-1.5 px-3 border text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-cyan-700 hover:border-cyan-500' : 'bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:bg-slate-800 text-cyan-400'}`}
                        title="معاينة الدليل التفاعلي للضيف قبل المغادرة"
                      >
                        <Eye className="h-4 w-4" />
                        <span>منظور الضيف</span>
                      </button>

                      {/* Cancel option */}
                      {!isCancelled && !isCompleted && (
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من إلغاء حجز الضيف: ${booking.guestName}؟`)) {
                              onCancelBooking(booking.id);
                            }
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${isLight ? 'text-slate-400 hover:text-red-500 hover:bg-slate-100' : 'text-zinc-500 hover:text-red-400 hover:bg-red-950/20'}`}
                          title="إلغاء الحجز"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}

                    </div>

                  </div>

                </div>

                {/* Booking Notes box if available */}
                {booking.notes && (
                  <div className={`mt-4 p-3 border rounded-xl text-right text-[11px] leading-relaxed font-sans ${isLight ? 'bg-slate-50 border-slate-150 text-slate-600' : 'bg-[#030712]/50 border-slate-850 text-slate-400'}`}>
                     💬 <strong>ملاحظات المضيف:</strong> {booking.notes}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Manual Booking Add Popup Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2.5xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative text-right ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#050F1E] border-slate-800'}`}>
            
            <div className={`flex justify-between items-center border-b pb-4 ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`font-extrabold text-sm ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                ✕ إغلاق
              </button>
              <h3 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>تسجيل حجز مباشر جديد</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Unit selector to reserve */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>اختر العقار / الوحدة المطلوب حجزها</label>
                <select
                  required
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    handleUnitOrDatesChange(e.target.value, checkInDate, checkOutDate);
                  }}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-400 border cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                >
                  <option value="" className={isLight ? 'text-slate-900' : 'text-slate-300'}>-- اختر الوحدة --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id} className={isLight ? 'text-slate-900' : 'text-slate-300'}>
                      {unit.name} ({unit.pricePerNight} ر.س / ليلة)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>اسم النزيل / الضيف الكلي</label>
                  <input 
                    type="text" 
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="أحمد الشمري"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-cyan-400 border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>رقم جوال الضيف (مثال: 96650XXXXXXX)</label>
                  <input 
                    type="tel" 
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="966501234567"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-mono text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>تاريخ تسجيل الدخول (Check-in)</label>
                  <input 
                    type="date" 
                    required
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      handleUnitOrDatesChange(selectedUnitId, e.target.value, checkOutDate);
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-400 font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>تاريخ تسجيل الخروج (Check-out)</label>
                  <input 
                    type="date" 
                    required
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      handleUnitOrDatesChange(selectedUnitId, checkInDate, e.target.value);
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-400 font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>طريقة الحجز والمنشأ</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className={`w-full rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:border-cyan-400 border cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  >
                    <option value="direct">حجز مباشر هاتفياً</option>
                    <option value="gathern">جاذر إن (Gathern)</option>
                    <option value="airbnb">إير بي إن بي (Airbnb)</option>
                    <option value="booking">بوكينج دوت كوم</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>إجمالي القيمة المقدرة (ر.س)</label>
                  <input 
                    type="number" 
                    required
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-400 font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>حالة الدفع والتسديد</label>
                  <select
                    value={paidStatus}
                    onChange={(e) => setPaidStatus(e.target.value as any)}
                    className={`w-full rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:border-cyan-400 border cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  >
                    <option value="fully_paid">تم الدفع بالكامل</option>
                    <option value="partial">عربون جزئي</option>
                    <option value="unpaid">لم يسدد بعد</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>ملاحظات تشغيلية (اختياري)</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يرجى تسليمه دليل الدخول مبكراً وشراء فواكه ترحيبة للترحيب به.."
                  className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-400 border resize-none ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                />
              </div>

              <div className={`pt-4 border-t flex justify-end gap-3 ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-5 py-2.5 font-bold rounded-xl text-xs cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-900 text-slate-300'}`}
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 font-extrabold rounded-xl text-xs cursor-pointer ${isLight ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-to-l from-slate-200 to-slate-300 text-slate-950 shadow-md'}`}
                >
                  تأكيد الحجز وتصديقه
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
