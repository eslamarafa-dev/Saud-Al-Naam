/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, Search, Plus, Trash2, CheckCircle, 
  Clock, AlertTriangle, User, Hammer, Sparkles, DollarSign
} from 'lucide-react';
import { TaskDetail, PropertyUnit } from '../../types';

interface MaintenanceManagerProps {
  tasks: TaskDetail[];
  units: PropertyUnit[];
  onAddTask: (task: TaskDetail) => void;
  onUpdateStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTask: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function MaintenanceManager({
  tasks,
  units,
  onAddTask,
  onUpdateStatus,
  onDeleteTask,
  theme,
  onTriggerAction
}: MaintenanceManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [newTicket, setNewTicket] = useState({
    unitId: '',
    title: '',
    type: 'maintenance' as 'cleaning' | 'maintenance' | 'inspection' | 'repair',
    assignTo: 'المهندس جاسم المصلح',
    deadline: '',
    cost: 250,
    notes: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.unitId || !newTicket.title || !newTicket.deadline) {
      onTriggerAction('تنبيه التحقق', 'الرجاء التأكد من ملء جميع الحقول: تحديد العقار، موضوع بطاقة الصيانة والموعد المحدد.');
      return;
    }

    const matchedUnit = units.find(u => u.id === newTicket.unitId);
    const added: TaskDetail = {
      id: 'task-' + Date.now(),
      unitId: newTicket.unitId,
      unitName: matchedUnit ? matchedUnit.name : 'وحدة عقارية مفردة',
      title: newTicket.title,
      type: newTicket.type,
      assignTo: newTicket.assignTo,
      deadline: newTicket.deadline,
      status: 'pending',
      cost: Number(newTicket.cost),
      notes: newTicket.notes || undefined
    };

    onAddTask(added);
    setIsAddOpen(false);
    onTriggerAction('إنشاء تذكرة صيانة', `تم تسجيل تذكرة "${newTicket.title}" بنجاح وإسنادها للفني المختص`);
    setNewTicket({
      unitId: '',
      title: '',
      type: 'maintenance',
      assignTo: 'المهندس جاسم المصلح',
      deadline: '',
      cost: 250,
      notes: ''
    });
  };

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.assignTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTypeText = (type: string) => {
    switch(type) {
      case 'cleaning': return 'تجهيز وتعقيم 🧼';
      case 'maintenance': return 'صيانة وقائية 🛠️';
      case 'inspection': return 'فحص جودة واستلام 🔍';
      case 'repair': return 'إصلاح أعطال طارئة 🚨';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-950/40 text-[#00E676] border border-emerald-900/60';
      case 'in_progress': return 'bg-amber-955/20 text-amber-400 border border-amber-900/50';
      default: return 'bg-slate-900 text-slate-400 border border-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'مكتملة ومغلقة ✓';
      case 'in_progress': return 'قيد التنفيذ والمطابقة';
      default: return 'قيد الانتظار لم يبدأ';
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            🛠️ خدمات الصيانة والتشغيل الميداني (Maintenance & Operations)
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            متابعة بلاغات النزلاء، تجهيز الغرف للتعقيم، وتفويض المقاولين والفنيين مع إدارة فواتير الصنع القطعية.
          </p>
        </div>

        <button
          onClick={() => {
            if (units.length === 0) {
              onTriggerAction('تنبيه النظام', 'الرجاء التأكد من وجود وحدات مسجلة أولاً لإرسال بطاقة صيانة لها.');
              return;
            }
            setNewTicket(prev => ({ ...prev, unitId: units[0].id }));
            setIsAddOpen(true);
          }}
          className="bg-[#1E40AF] hover:bg-[#153185] text-white px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>فتح تذكرة صيانة/تعقيم جديدة</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث باسم الفني، الوحدة، البلاغ..."
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
          <span className="text-[10px] text-slate-400 font-bold">تصفية حسب الإنجاز:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-[#020617] border-slate-800 text-slate-205' : 'bg-slate-50 border-slate-200 text-slate-700'
            } border focus:outline-none`}
          >
            <option value="all">كل بطاقات الصيانة الميدانية 🛠️</option>
            <option value="pending">بانتظار الموافقة والاعتماد</option>
            <option value="in_progress">قيد الإصلاح الفعلي</option>
            <option value="completed">تم الإصلاح والتأكيد</option>
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
              <h2 className="text-lg font-black mb-4">⚒️ فتح بطاقة صيانة / تجهيز جديدة</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">الوحدة الخاضعة للتأهيل</label>
                  <select
                    value={newTicket.unitId}
                    onChange={(e) => setNewTicket({ ...newTicket, unitId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border`}
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">موضوع التذكرة / وصف المشكلة والتعقيم</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فحص عطل التكييف المركزي وإعادة شحن الفريون"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">الفئة التشغيلية</label>
                    <select
                      value={newTicket.type}
                      onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="cleaning">تجهيز وتعقيم 🧼</option>
                      <option value="maintenance">صيانة وقائية 🛠️</option>
                      <option value="inspection">فحص جودة واستلام 🔍</option>
                      <option value="repair">إصلاح أعطال طارئة 🚨</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ إنهاء المهمة (الموعد)</label>
                    <input
                      type="date"
                      required
                      value={newTicket.deadline}
                      onChange={(e) => setNewTicket({ ...newTicket, deadline: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">الفني المسؤول أو المقاول</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: المهندس جاسم المصلح"
                      value={newTicket.assignTo}
                      onChange={(e) => setNewTicket({ ...newTicket, assignTo: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">القيمة المقدرة للخدمة (ريال)</label>
                    <input
                      type="number"
                      min="0"
                      value={newTicket.cost}
                      onChange={(e) => setNewTicket({ ...newTicket, cost: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">تفاصيل مادة الصنع أو قطع الغيار المستعملة</label>
                  <textarea
                    rows={2}
                    placeholder="توفير فلاتر أصلية مع ضمان الصيانة الميدانية لمدة ٣٠ يوماً..."
                    value={newTicket.notes}
                    onChange={(e) => setNewTicket({ ...newTicket, notes: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
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
                    فتح تذكرة الصيانة
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main tickets list */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-bounce" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا يوجد بطاقات صيانة مسجلة</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">بإمكانك إشراك مقاولين وفرز فواتير قطع الغيار بفتح تذكرة جديدة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => (
            <motion.div
              layout
              key={t.id}
              className={`rounded-3xl p-5 border text-right space-y-4 ${
                isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200'
              } transition-all`}
            >
              
              {/* Header card info */}
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${getStatusBadge(t.status)}`}>
                  {getStatusText(t.status)}
                </span>
                
                <div className="flex flex-col text-right">
                  <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
                    {t.title}
                  </h3>
                  <span className="text-[10px] text-[#C5A880] font-bold mt-1.5">{getTypeText(t.type)}</span>
                </div>
              </div>

              {/* Task specs */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">العقار الخاضع للإصلاح:</span>
                  <span className={isDark ? 'text-slate-350' : 'text-slate-700'}>{t.unitName}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/25 p-2 rounded-xl text-[11px]">
                  <span className="text-slate-500 font-bold">الفني المسؤول: <span className={isDark ? 'text-slate-300' : 'text-slate-805'}>{t.assignTo}</span></span>
                  <span>المستهدف: {t.deadline}</span>
                </div>
              </div>

              {/* Cost specifications */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/10">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[10px] text-slate-500">ماتريال وصنع:</span>
                  <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.cost} <span className="text-[10px] font-sans text-slate-500">ريال</span></span>
                </div>

                <div className="flex items-center gap-2">
                  
                  {t.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(t.id, 'in_progress')}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg transition-all"
                    >
                      مباشرة الإصلاح ⚒️
                    </button>
                  )}

                  {t.status === 'in_progress' && (
                    <button
                      onClick={() => onUpdateStatus(t.id, 'completed')}
                      className="px-3 py-1.5 bg-[#00E676] text-slate-955 font-black text-[10px] rounded-lg transition-all"
                    >
                      تأكيد انتهاء الإنجاز ✓
                    </button>
                  )}

                  {t.status === 'completed' && (
                    <span className="text-emerald-500 text-[10.5px] font-black bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-900/10">
                      مغلقة ومنتهية ✓
                    </span>
                  )}

                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className="p-1 px-2.5 bg-red-950/20 text-red-500 rounded-lg text-[10px] font-black"
                  >
                    حذف الكرت
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
