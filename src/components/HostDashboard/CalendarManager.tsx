/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, ChevronRight, ChevronLeft, PlusCircle, AlertCircle, Info, 
  User, Check, ShieldAlert, Wifi, Key, X, Ban, Sparkles, Send
} from 'lucide-react';
import { PropertyUnit, Booking } from '../../types';

interface CalendarManagerProps {
  units: PropertyUnit[];
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onTriggerAction: (title: string, desc: string) => void;
  theme?: string;
}

export default function CalendarManager({ units, bookings, onAddBooking, onTriggerAction, theme }: CalendarManagerProps) {
  const isLight = theme === 'light';
  // Current month reference
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed (June = 5)

  const monthNamesArabic = [
    'يناير (1)', 'فبراير (2)', 'مارس (3)', 'أبريل (4)', 'مايو (5)', 'يونيو (6)',
    'يوليو (7)', 'أغسطس (8)', 'سبتمبر (9)', 'أكتوبر (10)', 'نوفمبر (11)', 'ديسمبر (12)'
  ];

  // Generate days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Quick state to handle newly created quick booking from calendar clicking
  const [quickBookingModal, setQuickBookingModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // New quick form states
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [stayNights, setStayNights] = useState(2);
  const [sourceChannel, setSourceChannel] = useState<'direct' | 'airbnb' | 'booking' | 'gathern'>('direct');
  const [nightPrice, setNightPrice] = useState(850);

  // Booking details popover state
  const [focusedBooking, setFocusedBooking] = useState<Booking | null>(null);

  // Switch months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Convert dates string to compare with current calendar cell year/month/day
  const isDateOverlap = (dateStr: string, cellYear: number, cellMonth: number, cellDay: number) => {
    const date = new Date(dateStr);
    return (
      date.getFullYear() === cellYear &&
      date.getMonth() === cellMonth &&
      date.getDate() === cellDay
    );
  };

  // Check if a day has a booking for a specific unit
  const getCellBooking = (unitId: string, day: number) => {
    // Current date for comparison
    const cellDate = new Date(currentYear, currentMonth, day);

    return bookings.find(b => {
      if (b.unitId !== unitId || b.status === 'cancelled') return false;
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);

      // Normalize times for date-only comparison
      checkIn.setHours(0,0,0,0);
      checkOut.setHours(0,0,0,0);
      cellDate.setHours(0,0,0,0);

      return cellDate >= checkIn && cellDate < checkOut;
    });
  };

  // Check if a specific cell represents the CHECK_IN date
  const isCheckInCell = (booking: Booking, day: number) => {
    const cellDate = new Date(currentYear, currentMonth, day);
    const checkIn = new Date(booking.checkInDate);
    checkIn.setHours(0,0,0,0);
    cellDate.setHours(0,0,0,0);
    return cellDate.getTime() === checkIn.getTime();
  };

  const handleCreateQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !selectedUnitId || !selectedDay) return;

    // Calculate check-in is selectedDay, checkout is selectedDay + stayNights
    const checkInDateObj = new Date(currentYear, currentMonth, selectedDay);
    const checkOutDateObj = new Date(currentYear, currentMonth, selectedDay + Number(stayNights));

    const checkInStr = checkInDateObj.toISOString().split('T')[0];
    const checkOutStr = checkOutDateObj.toISOString().split('T')[0];

    const selectedUnitObj = units.find(u => u.id === selectedUnitId);

    const newBooking: Booking = {
      id: `b-quick-${Date.now()}`,
      unitId: selectedUnitId,
      unitName: selectedUnitObj?.name || 'وحدة مخصصة',
      guestName,
      guestPhone,
      checkInDate: checkInStr,
      checkOutDate: checkOutStr,
      createdAt: new Date().toISOString().split('T')[0],
      source: sourceChannel,
      payoutAmount: nightPrice * stayNights,
      guestCount: 2,
      status: 'upcoming',
      paidStatus: 'fully_paid',
      smartLockCodeSent: false,
      notes: 'حجز فوري لخدمة الغرف منبثق من جدول التقويم السنوي.'
    };

    onAddBooking(newBooking);
    setQuickBookingModal(false);
    onTriggerAction(
      'جدولة حجز فوري بالتقويم',
      `تم تسجيل حجز الضيف ${guestName} بنجاح للفترة من ${checkInStr} لـ ${checkOutStr}`
    );

    // Reset fields
    setGuestName('');
    setGuestPhone('');
  };

  const handleOpenQuickBooking = (unitId: string, day: number) => {
    // Prevent booking on past days or days already reserved
    const existing = getCellBooking(unitId, day);
    if (existing) {
      setFocusedBooking(existing);
      return;
    }

    const linkedUnit = units.find(u => u.id === unitId);
    setSelectedUnitId(unitId);
    setSelectedDay(day);
    setNightPrice(linkedUnit ? linkedUnit.pricePerNight : 800);
    setQuickBookingModal(true);
  };

  return (
    <div className="space-y-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Header and Month Controls */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border border-slate-800'}`}>
        <div className="flex flex-col text-right">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-end ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>مخطط تقويم الحجوزات الزمني</span>
            <Calendar className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             استعرض الإشغال العام بمخطط Gantt التفاعلي. انقر على المربعات الفارغة لحظر التواريخ أو تسيير حجز فوري.
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className={`flex items-center gap-3 p-2 rounded-xl border self-end md:self-auto ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
          <button 
            onClick={handlePrevMonth}
            className={`p-1 px-2 rounded-md transition-all cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-slate-900 text-slate-300 hover:text-white'}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className={`text-xs font-extrabold min-w-[120px] text-center font-sans tracking-wide ${isLight ? 'text-emerald-700' : 'text-[#00e676]'}`}>
            {monthNamesArabic[currentMonth]} {currentYear}
          </span>
          <button 
            onClick={handleNextMonth}
            className={`p-1 px-2 rounded-md transition-all cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-slate-900 text-slate-300 hover:text-white'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Booking Legend Channels */}
      <div className={`flex flex-wrap gap-4 pb-2 text-[10px] font-bold justify-start p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/20 border-slate-900 text-slate-450'}`}>
        <span className={`ml-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ترميز قنوات بيع التأجير:</span>
        <span className="flex items-center gap-1.5 text-orange-500">
          <span className="h-3 w-3 rounded-md bg-amber-500/30 border border-amber-500"></span> منصة جاذر إن
        </span>
        <span className="flex items-center gap-1.5 text-red-500">
          <span className="h-3 w-3 rounded-md bg-red-500/30 border border-red-500"></span> إير بي إن بي Airbnb
        </span>
        <span className="flex items-center gap-1.5 text-blue-500">
          <span className="h-3 w-3 rounded-md bg-blue-500/30 border border-blue-500"></span> بوكينج Booking
        </span>
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="h-3 w-3 rounded-md bg-emerald-500/30 border border-emerald-500"></span> حجز مباشر / هاتف
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="h-3 w-3 rounded-md bg-slate-800 border border-slate-700"></span> مغلق / صيانة
        </span>
      </div>

      {/* Big Hospitality Timeline Scrollable Container */}
      <div className={`w-full overflow-x-auto p-4 border rounded-2xl ${isLight ? 'bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' : 'bg-[#050C16] border-slate-850'}`}>
        <div className="min-w-[950px] space-y-2">
          
          {/* Calendar timeline Header days */}
          <div className={`grid grid-cols-12 gap-1 items-center pb-2 border-b text-bold text-xs sticky top-0 ${isLight ? 'border-slate-100 bg-white text-slate-500' : 'border-slate-800 bg-[#050C16] text-slate-400'}`}>
            
            {/* Properties index indicator */}
            <div className="col-span-3 text-right pr-2">وحدة الإيواء / الغرفة</div>

            {/* Calendar days sequence column representation */}
            <div className="col-span-9 grid" style={{ gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))` }}>
              {daysArray.map((day) => {
                const specDate = new Date(currentYear, currentMonth, day);
                const isWeekend = specDate.getDay() === 5 || specDate.getDay() === 6; // Friday/Saturday in Gulf

                return (
                  <div 
                    key={day} 
                    className={`text-center font-mono text-[10px] py-1 font-bold ${
                      isWeekend ? (isLight ? 'bg-slate-50 text-emerald-700 border border-slate-100/80' : 'bg-slate-900/60 text-emerald-450 border border-slate-850') : (isLight ? 'text-slate-600' : 'text-slate-400')
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Property Unit Rows and Gantt bookings bands */}
          {units.map((unit) => (
            <div key={unit.id} className={`grid grid-cols-12 gap-1 items-stretch py-2 transition-all border-b ${isLight ? 'border-slate-100 hover:bg-slate-50/50' : 'border-slate-900/60 hover:bg-slate-900/10'}`}>
              
              {/* Unit Label sidebar */}
              <div className="col-span-3 flex flex-col justify-center text-right pr-2">
                <span className={`font-extrabold text-[11px] truncate max-w-[200px] ${isLight ? 'text-slate-800' : 'text-white'}`} title={unit.name}>
                  {unit.name.split(' - ')[0]}
                </span>
                <span className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>
                   السعر القياسي: <strong className={`font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{unit.pricePerNight} ر.س</strong>
                </span>
              </div>

              {/* Days squares and reservation bars */}
              <div className="col-span-9 grid" style={{ gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))` }}>
                {daysArray.map((day) => {
                  const bookingObj = getCellBooking(unit.id, day);
                  
                  // Render based on block status or channel
                  let cellBgColor = isLight ? 'bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300' : 'bg-[#030712] hover:bg-slate-850 hover:border-slate-700';
                  let cellBorder = isLight ? 'border border-slate-100/70' : 'border border-slate-900/50';
                  let barContent = null;

                  if (bookingObj) {
                    const isCheckIn = isCheckInCell(bookingObj, day);
                    const source = bookingObj.source;

                    if (source === 'airbnb') {
                      cellBgColor = isLight ? 'bg-red-50 text-red-800' : 'bg-red-500/20 text-red-300';
                      cellBorder = isLight ? 'border-y border-red-200' : 'border-y border-red-500/50';
                    } else if (source === 'gathern') {
                      cellBgColor = isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-500/20 text-amber-300';
                      cellBorder = isLight ? 'border-y border-amber-200' : 'border-y border-amber-500/50';
                    } else if (source === 'booking') {
                      cellBgColor = isLight ? 'bg-blue-50 text-blue-800' : 'bg-blue-500/20 text-blue-300';
                      cellBorder = isLight ? 'border-y border-blue-200' : 'border-y border-blue-500/50';
                    } else {
                      cellBgColor = isLight ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300';
                      cellBorder = isLight ? 'border-y border-emerald-200' : 'border-y border-emerald-500/50';
                    }

                    // On Check-In date render start indicator arrow or text
                    if (isCheckIn) {
                      barContent = (
                        <div className="text-[8px] font-extrabold truncate w-full px-1 text-right whitespace-nowrap overflow-hidden select-none" title={`${bookingObj.guestName} (${bookingObj.payoutAmount} ر.س)`}>
                          {bookingObj.guestName.split(' ')[0]} 🚪
                        </div>
                      );
                    }
                  }

                  return (
                    <div
                      key={day}
                      onClick={() => handleOpenQuickBooking(unit.id, day)}
                      className={`h-9 flex items-center justify-center cursor-pointer transition-all ${cellBgColor} ${cellBorder}`}
                    >
                      {barContent}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Information box */}
      <div className={`p-4 rounded-2xl flex items-start gap-3 justify-end text-xs leading-normal border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
        <div className="text-right">
          <span className={`font-extrabold block ${isLight ? 'text-slate-900' : 'text-white'}`}>مزامنة القنوات الفورية (iCal):</span>
          <p className={`mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            نقوم بمسح ومراقبة روابط المزامنة iCal من المنصات الخارجية كل ٩٠ ثانية. يتم تفعيل الأكواد الذكية وإرسالها بمجرّد مطابقة وحجز المواعيد على التقويم تلقائياً.
          </p>
        </div>
        <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
      </div>

      {/* Modal Quick Booking Form */}
      {quickBookingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right animate-fade-in" style={{ direction: 'rtl' }}>
          <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050C16] border-slate-800'} border rounded-2.5xl p-6 max-w-md w-full space-y-4`}>
            
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button onClick={() => setQuickBookingModal(false)} className={`hover:text-red-500 font-bold cursor-pointer ${isLight ? 'text-slate-400' : 'text-slate-450'}`}>✕</button>
              <h3 className={`text-sm font-extrabold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                <span>تسجيل وتثبيت حجز يدوي فوري</span>
              </h3>
            </div>

            <form onSubmit={handleCreateQuickBooking} className="space-y-4 text-xs">
              
              <div className={`p-3 rounded-xl text-[11px] leading-relaxed border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-850/60'}`}>
                <div>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>الوحدة المختارة: </span> 
                  <strong className={`${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {units.find(u => u.id === selectedUnitId)?.name.split(' - ')[0]}
                  </strong>
                </div>
                <div>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>يبدأ الحجز من يوم: </span>
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>
                    {selectedDay} {monthNamesArabic[currentMonth]} {currentYear}
                  </strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>اسم ضيف الحجز المباشر *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: صالح الخالدي"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl outline-none text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>رقم جوال الضيف *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 966504008122"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl outline-none text-right font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>عدد ليالي الإقامة</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={stayNights}
                    onChange={(e) => setStayNights(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl outline-none text-right font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>سعر المبيت في الليلة (ر.س)</label>
                  <input
                    type="number"
                    value={nightPrice}
                    onChange={(e) => setNightPrice(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl outline-none text-right font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-white focus:border-emerald-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>قناة الوصول والتسويق</label>
                <select
                  value={sourceChannel}
                  onChange={(e) => setSourceChannel(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl outline-none cursor-pointer border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500' : 'bg-[#020712] border-slate-800 text-slate-300 focus:border-emerald-500'}`}
                >
                  <option value="direct">حجز مباشر (مكالمة / مكتب)</option>
                  <option value="gathern">جاذر إن Gathern</option>
                  <option value="airbnb">إير بي إن بي Airbnb</option>
                  <option value="booking">بوكينج كوم Booking</option>
                </select>
              </div>

              <div className={`p-3 rounded-lg flex justify-between text-[11px] border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border border-slate-900'}`}>
                <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>إجمالي مدفوعات العميل المتوقعة:</span>
                <strong className={`${isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'} font-mono`}>{(nightPrice * stayNights).toLocaleString()} ر.س</strong>
              </div>

              <div className={`flex gap-2.5 pt-4 border-t justify-end ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                <button
                  type="button"
                  onClick={() => setQuickBookingModal(false)}
                  className={`px-4 py-2 rounded-xl cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 font-extrabold text-slate-950 rounded-xl cursor-pointer"
                >
                  تأصيل الحجز الآن
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Booking visual details popover */}
      {focusedBooking && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right animate-fade-in" style={{ direction: 'rtl' }}>
          <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050C16] border-slate-800'} border rounded-2.5xl p-6 max-w-sm w-full space-y-4`}>
            
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button onClick={() => setFocusedBooking(null)} className={`hover:text-red-500 font-bold cursor-pointer ${isLight ? 'text-slate-400' : 'text-slate-455'}`}>✕</button>
              <h3 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>تفاصيل الإقامة المحجوزة بالتقويم</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold border ${isLight ? 'bg-slate-100 border-slate-200 text-amber-650' : 'bg-slate-950 border-slate-800 text-amber-400'}`}>
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block text-[10px]`}>النزيل المستضيف:</span>
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>{focusedBooking.guestName}</strong>
                </div>
              </div>

              <div>
                <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block text-[10px] mb-0.5`}>الوحدة السكنية:</span>
                <p className={`leading-normal ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{focusedBooking.unitName}</p>
              </div>

              <div className={`grid grid-cols-2 gap-4 p-3 rounded-xl border font-mono ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-850/60'}`}>
                <div>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block text-[9px] font-sans`}>تاريخ الدخول:</span>
                  <strong className={isLight ? 'text-emerald-700' : 'text-[#00e676]'}>{focusedBooking.checkInDate}</strong>
                </div>
                <div>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-450'} block text-[9px] font-sans`}>تاريخ المغادرة:</span>
                  <strong className="text-red-500 font-bold">{focusedBooking.checkOutDate}</strong>
                </div>
              </div>

              <div className={`flex justify-between items-center p-2.5 rounded-lg border text-[11px] ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>إيرادات الحجز:</span>
                <strong className={`${isLight ? 'text-emerald-700' : 'text-emerald-400'} font-mono`}>{focusedBooking.payoutAmount.toLocaleString()} ر.س</strong>
              </div>

              {focusedBooking.notes && (
                <div className={`p-2.5 rounded-lg text-[10px] leading-relaxed border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/30 border-slate-900/65 text-slate-400'}`}>
                  <span className="text-[9px] text-amber-500 font-bold block mb-0.5 font-sans">ملحوظة الضيافة:</span>
                  "{focusedBooking.notes}"
                </div>
              )}

            </div>

            <div className={`pt-3 border-t justify-end flex ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button
                onClick={() => setFocusedBooking(null)}
                className={`px-5 py-1.5 font-extrabold rounded-xl text-xs cursor-pointer transition-all ${isLight ? 'bg-slate-900 hover:bg-slate-850 text-white' : 'bg-slate-200 hover:bg-white text-slate-950'}`}
              >
                حسناً، إغلاق المعاينة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
