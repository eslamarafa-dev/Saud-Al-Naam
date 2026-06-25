/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Search, Plus, Trash2, Landmark, 
  CreditCard, ShieldCheck, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import { PaymentRecord, Invoice } from '../../types';

interface PaymentsManagerProps {
  payments: PaymentRecord[];
  invoices: Invoice[];
  onAddPayment: (pay: PaymentRecord) => void;
  onDeletePayment: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function PaymentsManager({
  payments,
  invoices,
  onAddPayment,
  onDeletePayment,
  theme,
  onTriggerAction
}: PaymentsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [newPay, setNewPay] = useState({
    invoiceId: '',
    method: 'mada' as 'mada' | 'apple_pay' | 'stc_pay' | 'credit_card' | 'bank_transfer',
    referenceNumber: '',
    bankName: 'مصرف الراجحي'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPay.invoiceId || !newPay.referenceNumber) {
      onTriggerAction('تنبيه التحقق', 'الرجاء اختيار الفاتورة وتثبيت المرجع المالي لإدراج سجل الدفعة.');
      return;
    }

    const matchedInv = invoices.find(i => i.id === newPay.invoiceId);
    
    const added: PaymentRecord = {
      id: 'pay-' + Date.now(),
      paymentNumber: 'PAY-REF-N' + Math.floor(Math.random() * 90000 + 10000),
      invoiceId: newPay.invoiceId,
      invoiceNumber: matchedInv ? matchedInv.invoiceNumber : 'INV-GENERAL',
      amount: matchedInv ? matchedInv.totalAmount : 500,
      paymentDate: new Date().toISOString().split('T')[0],
      method: newPay.method,
      referenceNumber: newPay.referenceNumber,
      bankName: newPay.bankName || undefined,
      status: 'cleared'
    };

    onAddPayment(added);
    setIsAddOpen(false);
    onTriggerAction('إدراج دفعة سداد', `تم تصفية الفاتورة ${added.invoiceNumber} وربط الدفعة ${added.paymentNumber} بالآيبان بنجاح`);
    setNewPay({
      invoiceId: '',
      method: 'mada',
      referenceNumber: '',
      bankName: 'مصرف الراجحي'
    });
  };

  const filtered = payments.filter(p => {
    const matchesSearch = p.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const getMethodText = (method: string) => {
    switch(method) {
      case 'mada': return 'مدى (mada) 🟢';
      case 'apple_pay': return 'Apple Pay ';
      case 'stc_pay': return 'stc pay 📱';
      case 'credit_card': return 'بطاقة ائتمانية 💳';
      case 'bank_transfer': return 'تحويل بنكي 🏦';
      default: return method;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            💳 كشف وسجلات دفعات السداد (Payments Tracker)
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            تسوية الدفعات، فحص مراجع السداد، وعرض تحويلات البوابات البنكية (الراجحي، الأهلي، الرياض) والمطابقات المتزامنة.
          </p>
        </div>

        <button
          onClick={() => {
            const unpaid = invoices.filter(i => i.status !== 'paid');
            if (unpaid.length === 0) {
              onTriggerAction('تنبيه النظام', 'كل الفواتير مدفوعة حالياً! لا توجد مستحقات معلقة لتسير دفعة سداد لها.');
              return;
            }
            setNewPay(prev => ({ ...prev, invoiceId: unpaid[0].id }));
            setIsAddOpen(true);
          }}
          className="bg-[#1E40AF] hover:bg-[#153185] text-white px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>ربط وتسجيل تسوية سداد</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث برقم الدفعة، رقم مرجع حوالة مادا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-xs font-bold ${
              isDark 
                ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-350'
            } border focus:outline-none transition-all`}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-[10px] text-slate-400 font-bold">بوابة السداد:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-[#020617] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-705'
            } border focus:outline-none`}
          >
            <option value="all">كل بوابات mada والمطابقة 💳</option>
            <option value="mada">مدى (mada)</option>
            <option value="apple_pay">Apple Pay</option>
            <option value="stc_pay">stc pay</option>
            <option value="credit_card">الائتمان الفيزا</option>
            <option value="bank_transfer">التحويلات المصرفية المباشرة</option>
          </select>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-[32px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right`}
            >
              <h2 className="text-lg font-black mb-4">🆕 تسجيل سند استلام (سداد فاتورة)</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">الفاتورة المستحقة سلفاً</label>
                  <select
                    value={newPay.invoiceId}
                    onChange={(e) => setNewPay({ ...newPay, invoiceId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border`}
                  >
                    {invoices.filter(i => i.status !== 'paid').map(i => (
                      <option key={i.id} value={i.id}>
                        رقم: {i.invoiceNumber} - النزيل: {i.tenantName} (مستحق: {i.totalAmount} ريال)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">بوابة/طريقة الدفع</label>
                    <select
                      value={newPay.method}
                      onChange={(e) => setNewPay({ ...newPay, method: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="mada">شبكة مدى (mada)</option>
                      <option value="apple_pay font-sans">Apple Pay </option>
                      <option value="stc_pay">stc pay الهاتف المحمول</option>
                      <option value="credit_card">بطاقات الائتمان (فيزا/ماستر)</option>
                      <option value="bank_transfer">تحويل مصرفي مباشر</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">البنك المستلم (للتحويل/mada)</label>
                    <input
                      type="text"
                      placeholder="مثال: مصرف الراجحي"
                      value={newPay.bankName}
                      onChange={(e) => setNewPay({ ...newPay, bankName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">رقم المرجع المصرفي / تذكرة الحوالة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: SEC-MADA-TXN-984210"
                    value={newPay.referenceNumber}
                    onChange={(e) => setNewPay({ ...newPay, referenceNumber: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-mono font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/20">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-880 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    إلغاء التراجع
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1E40AF] hover:bg-[#153185] text-white"
                  >
                    تدقيق وإرسال سند الاستلام
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Table listings */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا يوجد قيود دفع سارية</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">بإمكانك المراجعة والمقاصة بمطابقة تحويلات البنك الأهلي أو الراجحي فوراً.</p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-3xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[10px] text-slate-400 font-black ${isDark ? 'border-slate-850 bg-[#020617]/50' : 'border-slate-200 bg-slate-50/70'}`}>
                <th className="p-4">رقم سند السداد</th>
                <th className="p-4 bg-transparent">رقم الفاتورة المقفلة</th>
                <th className="p-4">قنوات الدخول الجبرية</th>
                <th className="p-4">البنك المستفيد</th>
                <th className="p-4">رقم المرجع المالي السند</th>
                <th className="p-4 text-center">تاريخ المقاصة</th>
                <th className="p-4 text-left">مجموع التحصيل</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 font-bold">
              {filtered.map((p) => {
                return (
                  <tr key={p.id} className={`${isDark ? 'hover:bg-slate-850/20' : 'hover:bg-slate-50'} transition-all`}>
                    <td className="p-4 text-[#00E676] font-mono">{p.paymentNumber}</td>
                    <td className="p-4 font-mono font-semibold">{p.invoiceNumber}</td>
                    <td className="p-4 text-slate-400">{getMethodText(p.method)}</td>
                    <td className="p-4 text-slate-350">{p.bankName || 'مصرف الراجحي'}</td>
                    <td className="p-4 font-mono font-extrabold select-all text-slate-500 text-[11px]">{p.referenceNumber}</td>
                    <td className="p-4 text-center font-mono text-slate-400">{p.paymentDate}</td>
                    <td className="p-4 text-left font-mono text-[#00E676] font-black">{(p.amount).toLocaleString()} ريال</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onDeletePayment(p.id)}
                        className="p-1 px-2.5 bg-red-950/20 text-red-500 rounded-lg text-[10px] font-black hover:bg-red-500/10"
                      >
                        إلغاء سند
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
