/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, Plus, Filter, Search, Tag, Calendar, Building2, 
  Trash2, FileText, CheckCircle, Clock, AlertTriangle, ArrowUpRight, Inbox
} from 'lucide-react';
import { PropertyUnit } from '../../types';

export interface ExpenseItem {
  id: string;
  unitId: string;
  unitName: string;
  amount: number;
  category: 'cleaning' | 'maintenance' | 'commission' | 'bills' | 'amenities' | 'marketing';
  merchant: string;
  date: string;
  status: 'paid' | 'pending';
  receiptName?: string;
  notes: string;
}

interface ExpensesManagerProps {
  units: PropertyUnit[];
  onTriggerAction: (title: string, desc: string) => void;
  theme?: string;
}

export default function ExpensesManager({ units, onTriggerAction, theme }: ExpensesManagerProps) {
  const isLight = theme === 'light';
  // Mock expense entries pre-loaded
  const initialExpenses: ExpenseItem[] = [
    {
      id: 'exp-1',
      unitId: 'unit-3',
      unitName: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
      amount: 180,
      category: 'cleaning',
      merchant: 'شركة تنظيفات العاصمة المحدودة',
      date: '2026-06-20',
      status: 'paid',
      receiptName: 'invoice_clean_998.pdf',
      notes: 'تصدير تنظيف شامل للفيلا وتغيير البياضات وتطهير السجاد.'
    },
    {
      id: 'exp-2',
      unitId: 'unit-6',
      unitName: 'شاليه جبال السودة الفاخر وسط الضباب والغابات - أبها',
      amount: 350,
      category: 'maintenance',
      merchant: 'مؤسسة جاسم المصلح للتقنية',
      date: '2026-06-21',
      status: 'pending',
      receiptName: 'router_battery_33.pdf',
      notes: 'فحص عطل بالإنترنت واستبدال بطاريات الباب الذكي بالوحدة.'
    },
    {
      id: 'exp-3',
      unitId: 'unit-1',
      unitName: 'شاليه اللافندر الفاخر مع مسبح خاص بمؤثرات مائية - الرياض',
      amount: 120,
      category: 'maintenance',
      merchant: 'مؤسسة المسبح الملوكي للصيانة',
      date: '2026-06-19',
      status: 'paid',
      receiptName: 'pool_chlorine_241.png',
      notes: 'توريد كلور وفحص كيميائي للكلور وتنظيف فلتر المسبح.'
    },
    {
      id: 'exp-4',
      unitId: 'all',
      unitName: 'كافة عقارات سعود النعام',
      amount: 1450,
      category: 'marketing',
      merchant: 'حملة سناب شات وجوجل مبرمجة',
      date: '2026-06-15',
      status: 'paid',
      receiptName: 'ad_campaign_saud_9.pdf',
      notes: 'إعلانات وحملات ترويجية ممولة للبلدة القديمة ومرتفعات الرياض.'
    },
    {
      id: 'exp-5',
      unitId: 'unit-2',
      unitName: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
      amount: 410,
      category: 'bills',
      merchant: 'الشركة السعودية للكهرباء',
      date: '2026-06-10',
      status: 'paid',
      receiptName: 'sec_bill_june_22.pdf',
      notes: 'فاتورة استهلاك الكهرباء لشقة العليا - شهر مايو.'
    }
  ];

  const [localExpenses, setLocalExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [expenseModal, setExpenseModal] = useState(false);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUnitIdFilter, setSelectedUnitIdFilter] = useState<string>('all');

  // Input States
  const [formAmount, setFormAmount] = useState<number>(150);
  const [formCategory, setFormCategory] = useState<'cleaning' | 'maintenance' | 'commission' | 'bills' | 'amenities' | 'marketing'>('cleaning');
  const [formUnitId, setFormUnitId] = useState<string>('');
  const [formMerchant, setFormMerchant] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<'paid' | 'pending'>('paid');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formReceipt, setFormReceipt] = useState<string>('');

  const categoryLabelMap = {
    cleaning: 'تنظيف وتطهير 🧹',
    maintenance: 'صيانة وأعطال 🛠️',
    commission: 'عمولات منصات (%) 📊',
    bills: 'فواتير وخدمات ⚡',
    amenities: 'أقمشة وضيافة ☕',
    marketing: 'تسويق وإعلان 📣'
  };

  const categoryColorMap = {
    cleaning: 'text-blue-400 bg-blue-950/40 border-blue-900',
    maintenance: 'text-amber-400 bg-amber-950/40 border-amber-900',
    commission: 'text-purple-400 bg-purple-950/40 border-purple-900',
    bills: 'text-yellow-400 bg-yellow-950/40 border-yellow-900',
    amenities: 'text-emerald-400 bg-emerald-950/40 border-emerald-900',
    marketing: 'text-cyan-400 bg-cyan-950/40 border-cyan-900'
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formMerchant) return;

    const unitObj = units.find(u => u.id === formUnitId);
    const unitName = unitObj ? unitObj.name : 'كافة العقارات';

    const nextExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      unitId: formUnitId || 'all',
      unitName,
      amount: Number(formAmount),
      category: formCategory,
      merchant: formMerchant,
      date: formDate,
      status: formStatus,
      notes: formNotes,
      receiptName: formReceipt || undefined
    };

    setLocalExpenses([nextExpense, ...localExpenses]);
    setExpenseModal(false);
    onTriggerAction('تسجيل مصروفات', `تم رصد وقيد فاتورة بمبلغ ${formAmount} ر.س ومستند لـ ${formMerchant}`);

    // Clean inputs
    setFormAmount(150);
    setFormMerchant('');
    setFormNotes('');
    setFormReceipt('');
  };

  const handleDeleteExpense = (id: string, merchant: string, amount: number) => {
    setLocalExpenses(localExpenses.filter(e => e.id !== id));
    onTriggerAction('حذف قيد مصروفات', `تم شطب قيد مصروفات فواتير بقيمة ${amount} ر.س للمورد ${merchant}`);
  };

  // Drag and drop mock handler for receipts
  const handleMockFileUpload = () => {
    const fileOptions = ['invoice_rent_882.pdf', 'reparation_receipt_11.png', 'water_bill_saudi.pdf'];
    const randomFile = fileOptions[Math.floor(Math.random() * fileOptions.length)];
    setFormReceipt(randomFile);
    onTriggerAction('إرفاق مستند كإيصال', `تم ربط الملف ${randomFile} بالقيد الضريبي المالي للحساب`);
  };

  // Calculation summaries
  const totalPaidSum = localExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPendingSum = localExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const grandTotal = totalPaidSum + totalPendingSum;

  const categoryBreakdown = () => {
    const counts = { cleaning: 0, maintenance: 0, commission: 0, bills: 0, amenities: 0, marketing: 0 };
    localExpenses.forEach(e => {
      counts[e.category] += e.amount;
    });
    return counts;
  };
  const breakdown = categoryBreakdown();

  // Filter expenses
  const filteredExpenses = localExpenses.filter(exp => {
    const matchesSearch = 
      exp.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.notes.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.unitName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'all' || 
      exp.category === selectedCategory;

    const matchesUnit = 
      selectedUnitIdFilter === 'all' || 
      exp.unitId === selectedUnitIdFilter;

    return matchesSearch && matchesCategory && matchesUnit;
  });

  return (
    <div className="space-y-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="flex flex-col text-right">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-end ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>إدارة وضبط المصروفات التشغيلية</span>
            <DollarSign className="h-5 w-5 text-amber-500" />
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            سجّل مصروفات الصيانة، فواتير الخدمات والضيافة، عمولات المنصات iCal لتقييم العائد الصافي للمنشأة بدقة.
          </p>
        </div>
        <button
          onClick={() => setExpenseModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>تقييد فاتورة جديدة</span>
        </button>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* KPI 1 */}
        <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/30 border-slate-800/80'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>إجمالي التكاليف المسجلة</span>
          <div className={`text-2xl font-extrabold font-mono flex items-baseline gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {grandTotal.toLocaleString()} <span className={`text-xs font-bold ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>ر.س</span>
          </div>
          <p className={`text-[9px] mt-1.5 font-bold ${isLight ? 'text-slate-450' : 'text-slate-400'}`}>حسابات الفترة لجميع المنشآت النشطة</p>
        </div>

        {/* KPI 2 */}
        <div className={`p-5 rounded-2xl border ${isLight ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-[#0f1d18]/40 border-[#1b3d2b]/60'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>المصروفات المدفوعة فعلياً</span>
          <div className={`text-2xl font-extrabold font-mono flex items-baseline gap-1 ${isLight ? 'text-emerald-900' : 'text-emerald-450'}`}>
            {totalPaidSum.toLocaleString()} <span className={`text-xs font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-500'}`}>ر.س</span>
          </div>
          <p className={`text-[9px] mt-1.5 font-bold flex items-center gap-1 ${isLight ? 'text-emerald-800' : 'text-emerald-400/80'}`}>
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span> تم سداد المستحقات بالكامل
          </p>
        </div>

        {/* KPI 3 */}
        <div className={`p-5 rounded-2xl border ${isLight ? 'bg-amber-50/60 border-amber-200/80' : 'bg-[#1f170f]/40 border-[#3d2412]/60'}`}>
          <span className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-amber-800' : 'text-amber-500'}`}>المصروفات المستحقة والمعلقة</span>
          <div className={`text-2xl font-extrabold font-mono flex items-baseline gap-1 ${isLight ? 'text-amber-900' : 'text-[#f59e0b]'}`}>
            {totalPendingSum.toLocaleString()} <span className={`text-xs font-bold ${isLight ? 'text-amber-700' : 'text-amber-500'}`}>ر.س</span>
          </div>
          <p className={`text-[9px] mt-1.5 font-bold flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-500/80'} animate-pulse`}>
            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span> فواتير جاري العمل على سدادها
          </p>
        </div>

      </div>

      {/* category progress bars */}
      <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/30 border-slate-800'}`}>
        <h3 className={`text-xs font-bold mb-5 text-right ${isLight ? 'text-slate-800' : 'text-white'}`}>تحليل هيكل المصروفات بالنسبة المئوية</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-right">
          {Object.entries(categoryLabelMap).map(([catKey, label]) => {
            const amt = breakdown[catKey as keyof typeof breakdown] || 0;
            const pct = grandTotal > 0 ? Math.round((amt / grandTotal) * 100) : 0;

            let barColor = 'bg-blue-500';
            if (catKey === 'maintenance') barColor = 'bg-amber-500';
            if (catKey === 'commission') barColor = 'bg-purple-500';
            if (catKey === 'bills') barColor = 'bg-yellow-500';
            if (catKey === 'amenities') barColor = 'bg-emerald-500';
            if (catKey === 'marketing') barColor = 'bg-cyan-500';

            return (
              <div key={catKey} className={`space-y-1 p-3 rounded-xl border ${isLight ? 'bg-slate-50/50 border-slate-150' : 'bg-slate-950/40 border-slate-900'}`}>
                <span className={`text-[10px] font-bold block truncate ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>{label.split(' ')[0]} {label.split(' ')[1]}</span>
                <div className={`text-xs font-mono font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {amt.toLocaleString()} <span className="text-[9px] text-slate-500">ر.س</span>
                </div>
                
                {/* Visual Bar */}
                <div className="space-y-1 pt-1">
                  <div className={`w-full rounded-full h-1 ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                    <div className={`${barColor} h-1 rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-[9px] text-slate-550 block font-mono">نسبة: {pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/20 border-slate-850'}`}>
        
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            placeholder="ابحث باسم المورد، كالمغاسل أو الصيانة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl outline-none text-right border focus:border-amber-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#050C16] text-white border-slate-800'}`}
          />
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>

        {/* Category List */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none focus:border-amber-500 cursor-pointer text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#050C16] text-slate-300 border-slate-800'}`}
          >
            <option value="all">كل الفئات والتصنيفات</option>
            {Object.entries(categoryLabelMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Unit Select List */}
        <div className="md:col-span-3">
          <select
            value={selectedUnitIdFilter}
            onChange={(e) => setSelectedUnitIdFilter(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none focus:border-amber-500 cursor-pointer text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#050C16] text-slate-300 border-slate-800'}`}
          >
            <option value="all">كل الوحدات السكنية</option>
            <option value="all-saud">كافة عقارات سعود النعام</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.name.split(' - ')[0]}</option>
            ))}
          </select>
        </div>

        {/* Results Counter */}
        <div className={`md:col-span-2 text-center text-xs border-r pr-3 font-semibold ${isLight ? 'text-slate-500 border-slate-150' : 'text-slate-400 border-slate-800'}`}>
           عثرنا على: <span className="text-amber-500 font-bold font-mono">{filteredExpenses.length}</span> فواتير
        </div>

      </div>

      {/* Expenses ledger table grid */}
      <div className={`overflow-x-auto border rounded-2xl p-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#050C16] border-slate-850'}`}>
        {filteredExpenses.length === 0 ? (
          <div className="py-12 flex flex-col justify-center items-center gap-3">
            <Inbox className="h-10 w-10 text-slate-400" />
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>لا يوجد بنود مصروفات تطابق اختيارات التصفية الحالية.</span>
          </div>
        ) : (
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b text-slate-450 font-bold ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <th className="pb-3 pr-2">الفاتورة / المورد</th>
                <th className="pb-3 pr-2">الوحدة المقيدة لها</th>
                <th className="pb-3 pr-2">تصنيف البند</th>
                <th className="pb-3 pr-2">التاريخ</th>
                <th className="pb-3 pr-2">المبلغ</th>
                <th className="pb-3 pr-2">السداد</th>
                <th className="pb-3 pr-2 text-center">الإيصال</th>
                <th className="pb-3 pr-2 text-left pl-2">الخيارات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const categoryLabel = categoryLabelMap[expense.category] || expense.category;
                const categoryColor = categoryColorMap[expense.category] || '';

                const isPaid = expense.status === 'paid';

                return (
                  <tr key={expense.id} className={`border-b transition-all font-medium ${isLight ? 'border-slate-100 hover:bg-slate-50 text-slate-700' : 'border-slate-900 hover:bg-slate-900/30 text-slate-300'}`}>
                    
                    {/* Merchant & Merchant Desc */}
                    <td className="py-4 pr-2 max-w-[200px]">
                      <div className="flex flex-col text-right">
                        <span className={`font-extrabold text-[12px] ${isLight ? 'text-slate-900' : 'text-white'}`}>{expense.merchant}</span>
                        <span className={`text-[10px] truncate leading-normal ${isLight ? 'text-slate-450' : 'text-slate-500'}`} title={expense.notes}>
                          {expense.notes}
                        </span>
                      </div>
                    </td>

                    {/* Unit Name */}
                    <td className="py-4 pr-2">
                      <span className={`text-[11px] font-sans font-semibold ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>
                        {expense.unitName.split(' - ')[0]}
                      </span>
                    </td>

                    {/* Category pill */}
                    <td className="py-4 pr-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryColor}`}>
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 pr-2 font-mono text-[10px]">
                      {expense.date}
                    </td>

                    {/* Amount */}
                    <td className={`py-4 pr-2 font-mono font-extrabold text-[12px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {expense.amount.toLocaleString()} <span className={`text-[10px] font-sans font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ر.س</span>
                    </td>

                    {/* Payment status */}
                    <td className="py-4 pr-2">
                      <span className={`text-[9.5px] font-bold inline-flex items-center gap-1.5 ${
                        isPaid ? 'text-[#00e676]' : 'text-amber-500'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isPaid ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}></span>
                        {isPaid ? 'مدفوعة ✓' : 'مستحقة'}
                      </span>
                    </td>

                    {/* Receipt document upload download */}
                    <td className="py-4 text-center">
                      {expense.receiptName ? (
                        <button 
                          onClick={() => onTriggerAction('تنزيل مستند الإيصال', `جاري جلب وعرض الملف: ${expense.receiptName}`)}
                          className={`px-2 py-1 rounded-md text-[10px] flex items-center justify-center gap-1 mx-auto cursor-pointer transition-all border ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-cyan-700 border-slate-200' : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-cyan-400'}`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="max-w-[100px] truncate">{expense.receiptName}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-650">—</span>
                      )}
                    </td>

                    {/* Trash clear invoice options */}
                    <td className="py-4 pr-2 text-left pl-2">
                      <button
                        onClick={() => handleDeleteExpense(expense.id, expense.merchant, expense.amount)}
                        className={`p-1 px-1.5 rounded-md cursor-pointer transition-all border border-transparent ${isLight ? 'text-slate-400 hover:bg-red-50 hover:text-red-500' : 'hover:bg-red-950/40 text-slate-500 hover:text-red-400 hover:border-red-900'}`}
                        title="شطب الفاتورة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Expense Modal Creator */}
      {expenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right animate-fade-in" style={{ direction: 'rtl' }}>
          <div className={`rounded-2.5xl p-6 max-w-lg w-full space-y-4 border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050C16] border-slate-800'}`}>
            
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button onClick={() => setExpenseModal(false)} className={`font-bold cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-slate-455 hover:text-white'}`}>✕</button>
              <h3 className={`text-sm font-extrabold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <DollarSign className="h-5 w-5 text-amber-500" />
                <span>تقييد وتثبيت مستند مالي تشغيلي جديد</span>
              </h3>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>قيمة الفاتورة المالية (ر.س) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 font-mono text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#020712] border-slate-800 text-white'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>جهة الصرف / المورد أو المستلم *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الشركة السعودية للكهرباء"
                    value={formMerchant}
                    onChange={(e) => setFormMerchant(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#020712] border-slate-800 text-white'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>نوع فئة التكلفة المصروفة</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 cursor-pointer border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#020712] border-slate-800 text-slate-300'}`}
                  >
                    {Object.entries(categoryLabelMap).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>الوحدة المقيدة لها التكلفة</label>
                  <select
                    value={formUnitId}
                    onChange={(e) => setFormUnitId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 cursor-pointer text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white' : 'bg-[#020712] border-slate-800 text-slate-300'}`}
                  >
                    <option value="">كافة عقارات سعود النعام (مشترك)</option>
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name.split(' - ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>تاريخ وقوع التكلفة والصرف</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 font-mono text-right border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#020712] border-slate-800 text-white'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>الحالة الضريبية والسداد</label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormStatus('paid')}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                        formStatus === 'paid'
                          ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold shadow-sm' : 'bg-emerald-950 border-emerald-500 text-[#00e676]'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-450 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      مدفوعة ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus('pending')}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                        formStatus === 'pending'
                          ? isLight ? 'bg-amber-50 border-amber-300 text-amber-800 font-extrabold shadow-sm' : 'bg-amber-950 border-amber-500 text-amber-400 shadow-lg'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-450 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      مستحقة / أجلة
                    </button>
                  </div>
                </div>
              </div>

              {/* simulated files drag receipt box */}
              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>المستندات الداعمة / إرفاق الإيصال</label>
                <div 
                  onClick={handleMockFileUpload}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/50 hover:border-amber-500' : 'border-slate-800 hover:border-amber-500/50 bg-[#020712]'}`}
                >
                  <div className="text-[11px] text-amber-500 font-extrabold">+ انقر هنا لإرفاق الفاتورة أو الإيصال المقيد</div>
                  <p className={`text-[10px] leading-normal ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>نسق الصور والملفات المسموح رفعها: PDF, JPEG, PNG حتى 5 ميغابايت</p>
                  
                  {formReceipt && (
                    <div className={`py-1.5 px-3 rounded text-[10px] font-mono border inline-block ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 text-cyan-400 border-slate-850'}`}>
                      📎 المستند المربوط حالياً: {formReceipt}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>توضيح بخصوص طبيعة المصروف (الملاحظات)</label>
                <textarea
                  placeholder="ملاحظات تفصيلية حول الفاتورة (مثال: صيانة غسالة ملابس بالوحدة، تغيير لوحة الإنارة الرئيسية، الخ...)"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-xl outline-none focus:border-amber-500 text-right resize-none text-[11px] border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white' : 'bg-[#020712] border-slate-800 text-white'}`}
                />
              </div>

              <div className={`flex gap-2.5 pt-4 border-t justify-end ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                <button
                  type="button"
                  onClick={() => setExpenseModal(false)}
                  className={`px-4 py-2 border rounded-xl cursor-pointer text-xs transition-all ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent' : 'bg-slate-900 border-transparent text-slate-300 hover:text-white'}`}
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 font-extrabold text-[#030712] rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                  حفظ الفاتورة بالدفاتر
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
