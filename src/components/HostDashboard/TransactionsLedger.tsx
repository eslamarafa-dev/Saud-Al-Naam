/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Filter, Search, Download, Calendar, ArrowUpRight, 
  ArrowDownRight, CheckCircle, Clock, FileSpreadsheet, FileText, Inbox, ChevronRight
} from 'lucide-react';
import { Booking, PropertyUnit } from '../../types';

interface LedgerItem {
  id: string;
  propertyId: string;
  propertyName: string;
  partyName: string; // Guest name or Vendor merchant
  type: 'incoming' | 'outgoing'; // Incoming = Booking, Outgoing = Expense/Repair Task
  category: string;
  amount: number;
  date: string;
  referenceNo: string;
  paymentMethod: string;
  status: 'cleared' | 'pending' | 'hold';
}

interface TransactionsLedgerProps {
  bookings: Booking[];
  units: PropertyUnit[];
  onTriggerAction: (title: string, desc: string) => void;
  theme?: string;
}

export default function TransactionsLedger({ bookings, units, onTriggerAction, theme }: TransactionsLedgerProps) {
  const isLight = theme === 'light';
  const [ledgerData, setLedgerData] = useState<LedgerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [selectedUnitId, setSelectedUnitId] = useState('all');

  // Load and consolidate bookings (incoming) and tasks (outgoing) into a Chronological Ledger Ledger
  useEffect(() => {
    const list: LedgerItem[] = [];

    // 1. Process Bookings as incoming deposits
    bookings.forEach((b, idx) => {
      list.push({
        id: `tx-in-${b.id}`,
        propertyId: b.unitId,
        propertyName: b.unitName,
        partyName: b.guestName,
        type: 'incoming',
        category: b.source === 'airbnb' ? 'إيجار Airbnb' : b.source === 'gathern' ? 'إيجار جاذر إن' : b.source === 'booking' ? 'إيجار بوكينج' : 'إيجار مباشر',
        amount: b.payoutAmount,
        date: b.checkInDate,
        referenceNo: `REF-${b.id.toUpperCase()}-${b.createdAt.replace(/-/g, '')}`,
        paymentMethod: b.source === 'direct' ? 'تحويل بنكي' : 'مدفوعات المنصة الرقمية ID',
        status: b.status === 'completed' ? 'cleared' : b.status === 'cancelled' ? 'hold' : 'cleared'
      });
    });

    // 2. Prepopulating some historical Outgoing expense debits (utility bills, maintenance wages, tax files)
    const mockExpenses = [
      { id: 'tx-out-1', propertyId: 'unit-3', propertyName: 'فيلا النخيل الذكية - الرياض', partyName: 'فني حمامات السباحة (إقبال)', type: 'outgoing' as const, category: 'تنظيف المسبح والكلور', amount: 120, date: '2026-06-21', referenceNo: 'VND-POOL-99827', paymentMethod: 'مدى Mada', status: 'cleared' as const },
      { id: 'tx-out-2', propertyId: 'unit-6', propertyName: 'شاليه جبال السودة الفاخر - أبها', partyName: 'مؤسسة جاسم المصلح للتقنية', type: 'outgoing' as const, category: 'صيانة القفل الذكي الباب', amount: 350, date: '2026-06-18', referenceNo: 'VND-LOCK-48221', paymentMethod: 'تحويل بنكي', status: 'cleared' as const },
      { id: 'tx-out-3', propertyId: 'unit-2', propertyName: 'شقة العليا التنفيذية الهادئة - الرياض', partyName: 'الشركة السعودية للكهرباء', type: 'outgoing' as const, category: 'استهلاك الكهرباء والماء', amount: 410, date: '2026-06-10', referenceNo: 'SEC-BILL-88771', paymentMethod: 'سداد Sadad', status: 'cleared' as const },
      { id: 'tx-out-4', propertyId: 'unit-1', propertyName: 'شاليه اللافندر الفاخر - الرياض', partyName: 'أبو محمد (مشرف التجهيز)', type: 'outgoing' as const, category: 'أقمشة وشراشف جديدة للوحدة', amount: 180, date: '2026-06-19', referenceNo: 'VND-CLEAN-28103', paymentMethod: 'نقد الكاش', status: 'pending' as const }
    ];

    mockExpenses.forEach(exp => {
      // Find matching unit name from parent unit list
      const correspondingUnit = units.find(u => u.id === exp.propertyId);
      list.push({
        ...exp,
        propertyName: correspondingUnit ? correspondingUnit.name : exp.propertyName
      });
    });

    // Sort chronologically (newest transactions first)
    list.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLedgerData(list);
  }, [bookings, units]);

  // Handle statement exports
  const handleExportCSV = () => {
    onTriggerAction('تصدير كشف حساب Excel', 'تم توليد وتنزيل ملف Excel مالي مفصل للربع الأول لعام ٢٠٢٦ م');
  };

  const handleExportPDF = () => {
    onTriggerAction('تصدير كشف حساب PDF', 'تم إعداد كشف حساب مصدق ومختوم من شركة سعود النعام للخدمات العقارية بصيغة PDF مالي قياسي للنزلاء والمستثمرين');
  };

  // Calculations
  const totalInflow = ledgerData.filter(x => x.type === 'incoming' && x.status === 'cleared').reduce((sum, x) => sum + x.amount, 0);
  const totalOutflow = ledgerData.filter(x => x.type === 'outgoing' && x.status === 'cleared').reduce((sum, x) => sum + x.amount, 0);
  const runningLedgerNetProfit = totalInflow - totalOutflow;

  // Filter logic
  const filteredLedger = ledgerData.filter(item => {
    const matchesSearch = 
      item.partyName.includes(searchQuery) || 
      item.category.includes(searchQuery) || 
      item.referenceNo.includes(searchQuery) ||
      item.propertyName.includes(searchQuery);

    const matchesType = 
      typeFilter === 'all' || 
      item.type === typeFilter;

    const matchesUnit = 
      selectedUnitId === 'all' || 
      item.propertyId === selectedUnitId;

    return matchesSearch && matchesType && matchesUnit;
  });

  return (
    <div className="space-y-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Top Banner section */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border p-6 rounded-2xl ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="flex flex-col text-right">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-end ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>دفتر القيود والمعاملات السند العام</span>
            <Briefcase className={`h-5 w-5 ${isLight ? 'text-amber-500' : 'text-cyan-400'}`} />
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             استعرض واضبط الكاش المالي للمنشأة بالتدفق الزمني المباشر. سجّل المعاملات بحدّ السند المحكم.
          </p>
        </div>
        
        {/* Export statement options */}
        <div className="flex gap-2.5 self-end md:self-auto">
          <button
            onClick={handleExportCSV}
            className={`p-2 border rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold ${isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'}`}
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>تصدير Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className={`p-2 border rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold ${isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'}`}
          >
            <FileText className="h-4 w-4 text-red-500" />
            <span>تصدير كشف PDF</span>
          </button>
        </div>
      </div>

      {/* running Balance statement summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className={`p-5 rounded-2xl border text-right transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-gradient-to-br from-[#0c1e3a]/40 to-[#040b16] border-cyan-900/40 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>صافي الرصيد التشغيلي (الكاش)</span>
          <div className="text-2xl font-extrabold font-mono flex items-baseline gap-1 mt-1">
            {runningLedgerNetProfit.toLocaleString()} <span className="text-xs text-slate-400 font-bold">ر.س</span>
          </div>
          <p className={`text-[9px] mt-2 font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>يمثل الإيرادات الصافية بعد خصم المصاريف المسجلة</p>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-2xl border text-right transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900/25 border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>إجمالي المقبوضات (Inflow)</span>
          <div className={`text-2xl font-extrabold font-mono flex items-baseline gap-1 mt-1 ${isLight ? 'text-emerald-600' : 'text-emerald-450'}`}>
            {totalInflow.toLocaleString()} <span className="text-xs text-slate-400 font-bold">ر.س</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 font-semibold">شامل حجوزات جاذر إن وإير بي إن بي والحجز المباشر</p>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-2xl border text-right transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900/25 border-slate-850 text-white'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-rose-600' : 'text-red-400'}`}>إجمالي المدفوعات (Outflow)</span>
          <div className={`text-2xl font-extrabold font-mono flex items-baseline gap-1 mt-1 ${isLight ? 'text-rose-600' : 'text-red-450'}`}>
            {totalOutflow.toLocaleString()} <span className="text-xs text-slate-400 font-bold">ر.س</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 font-semibold">شامل فواتير الصيانة، الكهرباء، المعاملات والأجور</p>
        </div>

      </div>

      {/* Toolbars logic */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center border p-4 rounded-xl transition-all ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/20 border-slate-850'}`}>
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <input
            type="text"
            placeholder="ابحث بالمرجع المالي، جهة الصرف، أو الضيف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-10 py-2.5 text-xs border rounded-xl outline-none text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-amber-500' : 'bg-[#050C16] text-white border-slate-800 focus:border-cyan-500'}`}
          />
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Type select */}
        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none cursor-pointer text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-amber-500' : 'bg-[#050C16] text-slate-300 border-slate-800 focus:border-cyan-500'}`}
          >
            <option value="all">كل المعاملات (أيداعات / مسحوبات)</option>
            <option value="incoming">الميداعات والمقبوضات (+)</option>
            <option value="outgoing">المصروفات والمدفوعات (-)</option>
          </select>
        </div>

        {/* Property unit select */}
        <div className="md:col-span-4">
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none cursor-pointer text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-amber-500' : 'bg-[#050C16] text-slate-300 border-slate-800 focus:border-cyan-500'}`}
          >
            <option value="all">كل الوحدات السكنية</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.name.split(' - ')[0]}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main ledger Table sheet */}
      <div className={`overflow-x-auto border rounded-2xl p-4 transition-all ${isLight ? 'bg-white border-slate-200' : 'bg-[#050C16] border-slate-850'}`}>
        {filteredLedger.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Inbox className="h-10 w-10 text-slate-700" />
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>لا يوجد معاملات مسجلة في كشف المعاملات الحالي.</span>
          </div>
        ) : (
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b font-bold text-[11px] ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-450'}`}>
                <th className="pb-3 pr-2">رقم المرجع سند</th>
                <th className="pb-3 pr-2">التاريخ</th>
                <th className="pb-3 pr-2">الوحدة المقيدة لها</th>
                <th className="pb-3 pr-2">طبيعة العملية / التفصيل</th>
                <th className="pb-3 pr-2">العميل / المورد المستفيد</th>
                <th className="pb-3 pr-2">الدفع</th>
                <th className="pb-3 pr-2">القيمة المالية</th>
                <th className="pb-3 pr-2 text-left pl-2">حالة التسوية</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedger.map((tx) => {
                const isIncoming = tx.type === 'incoming';
                const isCleared = tx.status === 'cleared';
                const isHold = tx.status === 'hold';

                return (
                  <tr key={tx.id} className={`border-b transition-all font-medium ${isLight ? 'border-slate-100 hover:bg-slate-50 text-slate-700' : 'border-slate-900/60 hover:bg-slate-900/20 text-slate-300'}`}>
                    
                    {/* Reference code */}
                    <td className={`py-4 pr-2 font-mono text-[10px] font-extrabold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tx.referenceNo}
                    </td>

                    {/* Date */}
                    <td className={`py-4 pr-2 font-mono text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-350'}`}>
                      {tx.date}
                    </td>

                    {/* Unit name */}
                    <td className="py-4 pr-2">
                      <span className={`text-[11px] font-sans font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {tx.propertyName.split(' - ')[0]}
                      </span>
                    </td>

                    {/* Category details */}
                    <td className="py-4 pr-2">
                      <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{tx.category}</span>
                    </td>

                    {/* Party Name */}
                    <td className="py-4 pr-2">
                      <span className={`font-extrabold text-[11px] ${isLight ? 'text-slate-850' : 'text-slate-200'}`}>{tx.partyName}</span>
                    </td>

                    {/* Method */}
                    <td className={`py-4 pr-2 text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>
                      {tx.paymentMethod}
                    </td>

                    {/* Financial value */}
                    <td className="py-4 pr-2">
                      <span className={`font-mono text-[12px] font-extrabold ${
                        isIncoming 
                          ? isLight ? 'text-emerald-600' : 'text-[#00e676]' 
                          : isLight ? 'text-rose-600' : 'text-red-400'
                      }`}>
                        {isIncoming ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[9px] font-sans font-normal">ر.س</span>
                      </span>
                    </td>

                    {/* Status reconciliation badge */}
                    <td className="py-4 pr-2 text-left pl-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        isHold ? (isLight ? 'bg-red-50 text-red-700' : 'bg-red-950 text-red-400') :
                        isCleared ? (isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-950 text-[#00e676]') :
                        (isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-950 text-amber-400')
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isHold ? 'bg-red-500' : isCleared ? 'bg-emerald-450' : 'bg-amber-400'
                        }`}></span>
                        {isHold ? 'موقوف / إلغاء' : isCleared ? 'تسوية ناجحة' : 'انتظار الفرز'}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
