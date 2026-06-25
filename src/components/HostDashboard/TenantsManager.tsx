/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Plus, Trash2, Shield, 
  Phone, Mail, Landmark, DollarSign, Edit
} from 'lucide-react';
import { Tenant } from '../../types';

interface TenantsManagerProps {
  tenants: Tenant[];
  onAddTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function TenantsManager({
  tenants,
  onAddTenant,
  onDeleteTenant,
  theme,
  onTriggerAction
}: TenantsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'former' | 'prospective'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [newTen, setNewTen] = useState({
    name: '',
    phone: '',
    email: '',
    nationalId: '',
    nationality: 'سعودي',
    companyName: '',
    status: 'active' as 'active' | 'former' | 'prospective',
    familyMembersCount: 2,
    totalPaidAmount: 0,
    dueAmount: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTen.name || !newTen.phone || !newTen.nationalId) {
      onTriggerAction('تنبيه التحقق', 'الرجاء التأكد من ملء الحقول الإلزامية: اسم المستأجر ورقم الجوال والهوية لتوثيقه.');
      return;
    }

    if (newTen.nationalId.length !== 10) {
      onTriggerAction('تنبيه التحقق', 'رقم الهوية الوطنية أو الإقامة في المملكة يجب أن يتكون من ١٠ أرقام صحيحة وفق المحددات الرسمية.');
      return;
    }

    const added: Tenant = {
      id: 'ten-' + Date.now(),
      name: newTen.name,
      phone: newTen.phone,
      email: newTen.email || 'guest@saudreal.net',
      nationalId: newTen.nationalId,
      nationality: newTen.nationality,
      companyName: newTen.companyName || undefined,
      status: newTen.status,
      familyMembersCount: Number(newTen.familyMembersCount),
      totalPaidAmount: Number(newTen.totalPaidAmount),
      dueAmount: Number(newTen.dueAmount)
    };

    onAddTenant(added);
    setIsAddOpen(false);
    onTriggerAction('تسجيل مستأجر ذكي', `تم فهرسة العميل الضيف "${newTen.name}" وربط هويته بملف الأملاك الموحد`);
    setNewTen({
      name: '',
      phone: '',
      email: '',
      nationalId: '',
      nationality: 'سعودي',
      companyName: '',
      status: 'active',
      familyMembersCount: 2,
      totalPaidAmount: 0,
      dueAmount: 0
    });
  };

  const filtered = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.nationalId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-950/30 text-[#00E676] border border-emerald-900/40 text-[9px] px-2.5 py-1 rounded-full font-black';
      case 'former': return 'bg-slate-900 text-slate-400 border border-slate-800 text-[9px] px-2.5 py-1 rounded-full font-bold';
      default: return 'bg-sky-950/35 text-sky-400 border border-sky-900/60 text-[9px] px-2.5 py-1 rounded-full font-black';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'مستأجر نشط ومقيم';
      case 'former': return 'مستأجر سابق (مخلى)';
      default: return 'مستأجر مرشح (طلب تعاقد)';
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            👥 إدارة ملفات المستأجرين والنزلاء (Tenants & Guests)
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            تسجيل هويات المقيمين (الهوية الوطنية / الإقامة)، تدقيق سداد المتأخرات، ومطابقة الضيوف بالدوائر الحكومية.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#1E40AF] hover:bg-[#153185] text-white px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>تسجيل وتدقيق مستأجر جديد</span>
        </button>
      </div>

      {/* Filter and control panel */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالاسم، برقم الهوية، بالجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-xs font-bold ${
              isDark 
                ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-405 focus:border-slate-350'
            } border focus:outline-none transition-all`}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-[10px] text-slate-400 font-bold">الحالة الأمنية/التعاقدية:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-[#020617] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            } border focus:outline-none`}
          >
            <option value="all">كل المستأجرين والنزلاء 📦</option>
            <option value="active">مستأجرين نشطين بالدوائر</option>
            <option value="former">سابقين (تخلية كاملة)</option>
            <option value="prospective">طلبات تعاقد معتمدة</option>
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
              <h2 className="text-lg font-black mb-4">👥 تسجيل وتوثيق مستأجر جديد</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">الاسم ثلاثي (كما هو ببطاقة الهوية)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الرحمن بن فهد السديري"
                    value={newTen.name}
                    onChange={(e) => setNewTen({ ...newTen, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">رقم الجوال النشط (مع كود الدولة)</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 966504812345"
                      value={newTen.phone}
                      onChange={(e) => setNewTen({ ...newTen, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">البريد الإلكتروني للإشعارات</label>
                    <input
                      type="email"
                      placeholder="example@domain.sa"
                      value={newTen.email}
                      onChange={(e) => setNewTen({ ...newTen, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">الهوية الوطنية / رقم الإقامة (١٠ خانات)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="مثال: 1092837482"
                      value={newTen.nationalId}
                      onChange={(e) => setNewTen({ ...newTen, nationalId: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-mono font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">الجنسية</label>
                    <input
                      type="text"
                      required
                      placeholder="سعودي، بحريني، بريطاني..."
                      value={newTen.nationality}
                      onChange={(e) => setNewTen({ ...newTen, nationality: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">جهة العمل الشريكة (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: سابك / أرامكو السعودية"
                      value={newTen.companyName}
                      onChange={(e) => setNewTen({ ...newTen, companyName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">عدد أفراد الأسرة المستضيفة</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="4"
                      required
                      value={newTen.familyMembersCount}
                      onChange={(e) => setNewTen({ ...newTen, familyMembersCount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">مبالغ السداد المدفوعة (ريال)</label>
                    <input
                      type="number"
                      min="0"
                      value={newTen.totalPaidAmount}
                      onChange={(e) => setNewTen({ ...newTen, totalPaidAmount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">المستحقات المتأخرة المطلوبة (ريال)</label>
                    <input
                      type="number"
                      min="0"
                      value={newTen.dueAmount}
                      onChange={(e) => setNewTen({ ...newTen, dueAmount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">حالة ملف المستأجر</label>
                  <select
                    value={newTen.status}
                    onChange={(e) => setNewTen({ ...newTen, status: e.target.value as any })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border`}
                  >
                    <option value="active">مستأجر نشط ومقيم</option>
                    <option value="former">مستأجر سابق (مخلى وتصفية)</option>
                    <option value="prospective">مرشح (بانتظار الموافقة المالية)</option>
                  </select>
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
                    تدقيق وتسجيل الملف
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tenants responsive output list sheets */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا يوجد عملاء أو مستأجرين مطابقين</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">بإمكانك توثيق الكفلاء ومجموعات العمل وعوائلهم بالضغط على إضافة بالأعلى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => {
            return (
              <motion.div
                key={t.id}
                layout
                className={`rounded-3xl p-5 border text-right space-y-4 ${
                  isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200'
                } transition-all`}
              >
                
                {/* Upper Details Row */}
                <div className="flex justify-between items-start gap-1">
                  <span className={getStatusBadge(t.status)}>
                    {getStatusText(t.status)}
                  </span>
                  
                  <div className="flex flex-col text-right">
                    <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h3>
                    {t.companyName && (
                      <span className="text-[10px] text-[#C5A880] block font-semibold mt-0.5">المنشأة: {t.companyName}</span>
                    )}
                  </div>
                </div>

                {/* Grid contact and national ID cards options */}
                <div className={`p-3.5 rounded-2xl ${isDark ? 'bg-[#020617]' : 'bg-slate-50'} space-y-2.5 text-xs font-mono`}>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-sans font-bold">الهوية والوطنية:</span>
                    <span className="font-sans font-black text-slate-300">
                      🏢 {t.nationality} | <span className="font-mono">{t.nationalId}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-sans font-bold">جوال الاتصال:</span>
                    <span className="text-slate-300 font-bold select-all flex items-center gap-1">
                      <span>{t.phone}</span>
                      <Phone className="h-3 w-3 text-emerald-400" />
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-sans font-bold">عدد المرافقين بالأسرة:</span>
                    <span className="font-sans text-slate-300 font-bold">{t.familyMembersCount} أفراد</span>
                  </div>

                </div>

                {/* Finance indicators */}
                <div className="pt-2 border-t border-slate-800/10 flex items-center justify-between text-xs">
                  
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">الدفعات المستوفاة</span>
                      <span className={`font-black font-mono text-[#00E676]`}>
                        {(t.totalPaidAmount).toLocaleString()} <span className="text-[8.5px] font-sans">ريال</span>
                      </span>
                    </div>

                    <div className="border-r border-slate-800/20 pr-4">
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">المستحقات المتأخرة</span>
                      <span className={`font-black font-mono ${t.dueAmount > 0 ? 'text-red-400 text-sm font-black' : 'text-slate-400'}`}>
                        {(t.dueAmount).toLocaleString()} <span className="text-[8.5px] font-sans">ريال</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTenant(t.id)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                    title="حذف البطاقة"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
