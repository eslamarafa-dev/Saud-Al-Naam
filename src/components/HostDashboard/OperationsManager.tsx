/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Plus, Sliders, CheckCircle, Clock, AlertTriangle, 
  Trash2, User, Hammer, Sparkles, SlidersHorizontal, Users, DollarSign,
  Smartphone, Camera, UploadCloud, Check, Home, Award
} from 'lucide-react';
import { TaskDetail, PropertyUnit } from '../../types';

interface OperationsManagerProps {
  tasks: TaskDetail[];
  units: PropertyUnit[];
  onAddTask: (task: TaskDetail) => void;
  onUpdateTaskStatus: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTask: (taskId: string) => void;
  onTriggerAction: (actionName: string, detail: string) => void;
  theme?: string;
}

export default function OperationsManager({
  tasks,
  units,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onTriggerAction,
  theme
}: OperationsManagerProps) {
  
  const isLight = theme === 'light';
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'host' | 'cleaner'>('host');

  // New task form fields
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<'cleaning' | 'maintenance' | 'inspection' | 'repair'>('cleaning');
  const [assignTo, setAssignTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [cost, setCost] = useState<number>(150);
  const [notes, setNotes] = useState('');

  // Cleaner Simulator States
  const [selectedSimTaskId, setSelectedSimTaskId] = useState<string>('');
  const [checklist, setChecklist] = useState({
    linen: false,
    sanitize: false,
    coffee: false,
    incense: false,
    smartLock: false
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [isSimSubmitted, setIsSimSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !taskTitle || !assignTo || !deadline) return;

    const matchedUnit = units.find(u => u.id === selectedUnitId);
    const unitName = matchedUnit ? matchedUnit.name : 'وحدة سكنية مخصصة';

    const newTask: TaskDetail = {
      id: 'task-' + Date.now(),
      unitId: selectedUnitId,
      unitName,
      title: taskTitle,
      type: taskType,
      assignTo,
      deadline,
      status: 'pending',
      cost: Number(cost),
      notes: notes || undefined
    };

    onAddTask(newTask);
    setShowAddModal(false);
    onTriggerAction('إسناد مهمة تشغيلية لطاقم الضيافة', `المهمة: ${newTask.title} المسندة لـ ${newTask.assignTo}`);

    // Reset Form
    setSelectedUnitId('');
    setTaskTitle('');
    setTaskType('cleaning');
    setAssignTo('');
    setDeadline('');
    setCost(150);
    setNotes('');
  };

  // Filter Tasks logic
  const filteredTasks = tasks.filter(t => {
    return selectedStatusFilter === 'all' || t.status === selectedStatusFilter;
  });

  // Get active cleaning tasks for the simulator
  const activeCleaningTasks = tasks.filter(t => t.type === 'cleaning' && t.status !== 'completed');

  const handleSelectSimTask = (taskId: string) => {
    setSelectedSimTaskId(taskId);
    setChecklist({
      linen: false,
      sanitize: false,
      coffee: false,
      incense: false,
      smartLock: false
    });
    setUploadedPhoto('');
    setIsSimSubmitted(false);
  };

  const handleSimSubmit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    onUpdateTaskStatus(taskId, 'completed');
    setIsSimSubmitted(true);
    onTriggerAction('اكتمال تنظيف وتجهيز الوحدة', `قام طاقم الضيافة بإنهاء وإرسال تقرير النظافة لـ ${task.unitName}. الوحدة الآن جاهزة تماماً للنزيل.`);
  };

  const simPhotos = [
    { id: 'living', name: 'تعقيم الصالة', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80' },
    { id: 'bed', name: 'ترتيب السرير الفاخر', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80' },
    { id: 'bath', name: 'تطهير الحمام وتجهيز الصابون', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }} id="operations-manager-container">
      
      {/* Page header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-3">
            <h2 className={`text-xl sm:text-2xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>إداريات النظافة، الصيانة، وتجهيز الغرف</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">تحديث فوري</span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>
             قم بإسناد المهام، تحديد التكاليف المصاحبة، ومتابعة جودة تعقيم الغرف والتجهيز الفوري للضيوف الجدد.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveView('host')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'host' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>بوابة المضيف</span>
            </button>
            <button
              onClick={() => {
                setActiveView('cleaner');
                if (activeCleaningTasks.length > 0 && !selectedSimTaskId) {
                  setSelectedSimTaskId(activeCleaningTasks[0].id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative ${
                activeView === 'cleaner' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span>محاكي عامل النظافة</span>
              {activeCleaningTasks.length > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeCleaningTasks.length}
                </span>
              )}
            </button>
          </div>

          {activeView === 'host' && (
            <button
              onClick={() => {
                if (units.length === 0) {
                  onTriggerAction('تنبيه النظام', 'يرجى إضافة وحدة سكنية أولاً في إدارة الوحدات لتتمكن من حجزها.');
                  return;
                }
                setShowAddModal(true);
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${isLight ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-gradient-to-l from-slate-200 to-slate-300 text-slate-950'}`}
            >
              <Plus className="h-4 w-4" />
              <span>إسناد مهمة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {activeView === 'host' ? (
        <>
          {/* Grid filters view */}
          <div className={`p-4 rounded-xl flex justify-between items-center border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-800'}`}>
            <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>تحديث مستمر لحركات التشغيل</span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold shrink-0 ${isLight ? 'text-slate-700' : 'text-slate-450'}`}>حالة الإنجاز:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className={`text-xs border rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#050C16] text-white border-slate-850'}`}
              >
                <option value="all">كل المهام</option>
                <option value="pending">بانتظار البدء (Pending)</option>
                <option value="in_progress">قيد العمل (In Progress)</option>
                <option value="completed">مكتملة ومؤكدة (Completed)</option>
              </select>
            </div>
          </div>

          {/* Task detailed lists */}
          {filteredTasks.length === 0 ? (
            <div className={`border rounded-2xl p-12 text-center ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900/10 border-slate-850 text-slate-400'}`}>
              <User className="h-12 w-12 text-zinc-400 mx-auto mb-4 animate-bounce" />
              <h4 className={`text-base font-bold ${isLight ? 'text-slate-850' : 'text-white'}`}>لا توجد مهام تشغيلية جارية حالياً</h4>
              <p className="text-xs text-slate-500 mt-1">اضغط على زر الإسناد بالأعلى لتوزيع جدول العمل على طاقم ضيافتك.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isProgress = task.status === 'in_progress';

                return (
                  <div 
                    key={task.id}
                    className={`border p-5 rounded-2.5xl flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                      isLight 
                        ? `bg-white border-slate-200 hover:border-slate-350 ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : ''}` 
                        : `bg-[#061122]/95 border-slate-800 hover:border-slate-700 ${isCompleted ? 'border-emerald-900/40 bg-slate-950/10' : ''}`
                    }`}
                  >
                    
                    {/* Upper Meta details */}
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        
                        {/* Status toggler links */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as any)}
                            className={`text-[10px] font-bold rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-white border cursor-pointer ${
                              isCompleted 
                                ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950 border-emerald-900 text-emerald-400' 
                                : isProgress 
                                  ? isLight ? 'bg-yellow-55 border-yellow-200 text-yellow-800' : 'bg-yellow-950 border-yellow-905 text-yellow-400' 
                                  : isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-red-950 border-red-900 text-red-400'
                            }`}
                          >
                            <option value="pending">انتظار</option>
                            <option value="in_progress">قيد التنفيذ</option>
                            <option value="completed">مكتمل ✓</option>
                          </select>
                        </div>

                        <div className="flex flex-col text-right">
                          <span className={`text-[10px] font-extrabold uppercase mt-1 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                            {task.type === 'cleaning' ? '🧹 نظافة وتجهيز' : task.type === 'maintenance' ? '🛠️ صيانة دورية' : task.type === 'inspection' ? '🔍 معايير جودة' : '💡 إصلاح عطل'}
                          </span>
                          <h4 className={`font-extrabold text-xs leading-normal mt-0.5 max-w-[280px] line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{task.unitName.split(' - ')[0]}</h4>
                        </div>

                      </div>

                      <p className={`text-xs leading-relaxed font-sans text-right ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                    </div>

                    {/* Foot Details and workers info */}
                    <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                      
                      <span className={`flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        <User className="h-4 w-4 text-slate-500" />
                        <strong>{task.assignTo}</strong>
                      </span>

                      <span className={`font-mono block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                        موعد: {task.deadline}
                      </span>

                    </div>

                    {/* Sub features expense cost */}
                    <div className="flex justify-between items-center text-[10.5px]">
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف وإسقاط هذه المهمة: ${task.title}؟`)) {
                            onDeleteTask(task.id);
                          }
                        }}
                        className={`font-bold transition-all p-1 rounded cursor-pointer ${isLight ? 'text-slate-400 hover:text-red-600 hover:bg-slate-100' : 'text-zinc-500 hover:text-red-400 hover:bg-slate-900'}`}
                      >
                         إسقاط المهمة
                      </button>
                      <span className={`font-extrabold border px-2.5 py-1 rounded-lg ${isLight ? 'text-slate-800 bg-slate-50 border-slate-200' : 'text-slate-200 bg-slate-950 border-slate-850'}`}>
                        التكلفة المصاحبة: <span className={`font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{task.cost}</span> ر.س
                      </span>
                    </div>

                    {/* Task Notes if available */}
                    {task.notes && (
                      <div className={`p-2.5 border rounded-lg text-[10.5px] leading-relaxed text-right ${isLight ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-[#030712]/50 border-slate-900 text-slate-455'}`}>
                         📌 {task.notes}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Cleaner Mobile Simulator View */
        <div className="max-w-md mx-auto bg-slate-950 border-[6px] border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[680px] flex flex-col">
          {/* Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></div>
          </div>

          {/* Smartphone Header screen bar */}
          <div className="bg-slate-900 text-slate-400 px-6 pt-8 pb-3 flex justify-between items-center text-[10px] border-b border-slate-800/50">
            <span className="font-mono">Naam Mobile</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>5G متصل</span>
            </div>
          </div>

          {/* Phone Content area */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/10 p-4 rounded-2xl border border-emerald-500/10 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">طاقم الضيافة والتعقيم</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">تحديث فوري لتعليمات الدخول والجاهزية</p>
              </div>
              <Award className="h-5 w-5 text-emerald-400 animate-bounce" />
            </div>

            {/* Task list inside simulator */}
            {activeCleaningTasks.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-900/30 rounded-2xl border border-slate-900 p-6">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-bold text-white">رائع! لا توجد مهام تنظيف معلقة</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  لقد انتهيت من جميع الشقق الجارية. يمكنك التبديل لبوابة المضيف وإضافة مهمة جديدة للتجربة.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">اختر الشقة الجاري تنظيفها:</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {activeCleaningTasks.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectSimTask(t.id)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                          selectedSimTaskId === t.id 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {t.unitName.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display checklist for chosen task */}
                {selectedSimTaskId && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                    <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400">قائمة معايير الجودة (5 خطوات)</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">جاهزية فورية</span>
                    </div>

                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2.5 text-[10.5px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.linen}
                          onChange={(e) => setChecklist({ ...checklist, linen: e.target.checked })}
                          className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950"
                        />
                        <span className={checklist.linen ? 'line-through text-slate-550' : ''}>تغيير بياضات الأسرة والوسائد والشراشف</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-[10.5px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.sanitize}
                          onChange={(e) => setChecklist({ ...checklist, sanitize: e.target.checked })}
                          className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950"
                        />
                        <span className={checklist.sanitize ? 'line-through text-slate-550' : ''}>تطهير وتعقيم دورات المياه والأسطح الزجاجية</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-[10.5px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.coffee}
                          onChange={(e) => setChecklist({ ...checklist, coffee: e.target.checked })}
                          className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950"
                        />
                        <span className={checklist.coffee ? 'line-through text-slate-550' : ''}>ملء عبوات ركن القهوة وبودات إسبريسو والماء</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-[10.5px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.incense}
                          onChange={(e) => setChecklist({ ...checklist, incense: e.target.checked })}
                          className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950"
                        />
                        <span className={checklist.incense ? 'line-through text-slate-550' : ''}>تبخير الشقة كاملة بكسرة العود الطبيعي الفاخرة</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-[10.5px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.smartLock}
                          onChange={(e) => setChecklist({ ...checklist, smartLock: e.target.checked })}
                          className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950"
                        />
                        <span className={checklist.smartLock ? 'line-through text-slate-550' : ''}>فحص القفل الذكي للتأكد من سهولة دخول النزيل</span>
                      </label>
                    </div>

                    {/* Simulated Photo Audit */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="text-[10px] font-bold text-slate-400 block">إثبات التعقيم بالصور (انقر لاختيار صورة):</label>
                      <div className="grid grid-cols-3 gap-2">
                        {simPhotos.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setUploadedPhoto(p.url)}
                            className={`relative rounded-xl overflow-hidden aspect-video border transition-all cursor-pointer ${
                              uploadedPhoto === p.url ? 'border-emerald-500 ring-2 ring-emerald-600/30' : 'border-slate-800'
                            }`}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[8px] text-white font-extrabold text-center">
                              <span className="w-full truncate">{p.name}</span>
                            </div>
                            {uploadedPhoto === p.url && (
                              <div className="absolute top-1 right-1 bg-emerald-600 rounded-full p-0.5">
                                <Check className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2">
                      {isSimSubmitted ? (
                        <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-center space-y-1">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" />
                          <p className="text-[10px] font-bold text-white">🎉 تم تسليم التقرير بنجاح!</p>
                          <p className="text-[8.5px] text-slate-400">الوحدة جاهزة وحالتها تحولت تلقائياً في النظام</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSimSubmit(selectedSimTaskId)}
                          disabled={!checklist.linen || !checklist.sanitize || !checklist.coffee || !checklist.incense || !checklist.smartLock || !uploadedPhoto}
                          className="w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all text-slate-950 bg-gradient-to-l from-emerald-400 to-teal-400 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg"
                        >
                          <UploadCloud className="h-4 w-4" />
                          <span>إنهاء وتأكيد جاهزية الشقة للضيف</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Smartphone Footer Home line */}
          <div className="p-4 bg-slate-900 border-t border-slate-800/40 flex items-center justify-center">
            <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Adding Task Modal Setup form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2.5xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto shadow-2xl relative text-right ${isLight ? 'bg-white border-slate-200' : 'bg-[#050F1E] border-slate-800'}`}>
            
            <div className={`flex justify-between items-center pb-4 border-b ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`font-extrabold text-sm border-0 bg-transparent cursor-pointer ${isLight ? 'text-slate-550' : 'text-slate-400'}`}
              >
                ✕ إغلاق
              </button>
              <h3 className={`text-base sm:text-lg font-bold font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>إسناد مهمة تشغيلية لطاقم الضيافة</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Unit SELECT */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>اختر الوحدة السكنية / الشاليه المستهدف</label>
                <select
                  required
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                >
                  <option value="">-- اختر الوحدة --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>وصف المهمة بدقة (توجيهات العمل)</label>
                <input 
                  type="text" 
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="مثال: تنظيف وتطهير الوحدة وتغيير الشراشف وتأمين القفل الذكي"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>نوع التصنيف التشغيلي</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  >
                    <option value="cleaning">🧹 نظافة وتجهيز كامل</option>
                    <option value="maintenance">🛠️ تفتيش صيانة وأعطال</option>
                    <option value="inspection">🔍 معاينة جودة ما بعد النظافة</option>
                    <option value="repair">💡 إصلاح عطل ضروري</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>الموظف المسؤول (الاسم أو الفريق)</label>
                  <input 
                    type="text" 
                    required
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    placeholder="أبو محمد (مشرف التجهيز والمغسلة)"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-355'}`}>الموعد النهائي لتسليم الوحدة (Deadline)</label>
                  <input 
                    type="text" 
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="اليوم الساعة 4:00 عصراً"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-355'}`}>التكلفة التشغيلية المصاحبة (ر.س)</label>
                  <input 
                    type="number" 
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-mono text-right ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>ملاحظات توجيهية خاصة لمشرف النظافة</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="تأكد من تبخير الغرف بالعود الطبيعي الفاخر وصيانة قفل الباب قبل الساعة 2 ظهراً.."
                  className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-850 focus:bg-white' : 'bg-[#030712] border-slate-850 text-white'}`}
                />
              </div>

              <div className={`pt-4 border-t flex justify-end gap-3 ${isLight ? 'border-slate-100' : 'border-slate-850'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-5 py-2.5 font-bold rounded-xl text-xs border cursor-pointer transition-all ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent' : 'bg-slate-900 border-0 text-slate-300 hover:text-white'}`}
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 font-extrabold rounded-xl text-xs border-0 cursor-pointer transition-all shadow-sm hover:shadow-md ${isLight ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-gradient-to-l from-slate-200 to-slate-300 text-slate-950'}`}
                >
                  حفظ وإسناد الجدول
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
