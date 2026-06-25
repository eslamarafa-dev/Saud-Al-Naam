/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Search, Plus, Trash2, ShieldCheck, 
  Droplet, Zap, Award, Layers, Eye, RefreshCw
} from 'lucide-react';
import { Building as BuildingType, PropertyPortfolio } from '../../types';

interface BuildingsManagerProps {
  buildings: BuildingType[];
  properties: PropertyPortfolio[];
  onAddBuilding: (building: BuildingType) => void;
  onDeleteBuilding: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function BuildingsManager({
  buildings,
  properties,
  onAddBuilding,
  onDeleteBuilding,
  theme,
  onTriggerAction
}: BuildingsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [newBld, setNewBld] = useState({
    propertyId: '',
    name: '',
    address: '',
    floorsCount: 3,
    unitsCount: 12,
    elevatorStatus: 'operational' as 'operational' | 'maintenance',
    waterTankMeter: 85,
    electricityMeterNo: '',
    cleanlinessGrade: 'A' as 'A' | 'B' | 'C'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBld.name || !newBld.propertyId || !newBld.address) {
      onTriggerAction('تنبيه التحقق', 'الرجاء تعبئة حقول اسم المبنى وتحديد عقاره التابع لتوثيقه.');
      return;
    }

    const selectedProp = properties.find(p => p.id === newBld.propertyId);
    const added: BuildingType = {
      id: 'bld-' + Date.now(),
      propertyId: newBld.propertyId,
      propertyName: selectedProp ? selectedProp.name : 'محفظة عامة',
      name: newBld.name,
      address: newBld.address,
      floorsCount: Number(newBld.floorsCount),
      unitsCount: Number(newBld.unitsCount),
      elevatorStatus: newBld.elevatorStatus,
      waterTankMeter: Number(newBld.waterTankMeter),
      electricityMeterNo: newBld.electricityMeterNo || 'METER-' + Math.floor(Math.random() * 900000 + 100000),
      cleanlinessGrade: newBld.cleanlinessGrade
    };

    onAddBuilding(added);
    setIsAddOpen(false);
    onTriggerAction('تسجيل مبنى جديد', `تم ميكنة المبنى "${newBld.name}" وربطه بالمجمع العقاري التابع له`);
    setNewBld({
      propertyId: '',
      name: '',
      address: '',
      floorsCount: 3,
      unitsCount: 12,
      elevatorStatus: 'operational',
      waterTankMeter: 85,
      electricityMeterNo: '',
      cleanlinessGrade: 'A'
    });
  };

  const filtered = buildings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.electricityMeterNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty = propertyFilter === 'all' || b.propertyId === propertyFilter;
    return matchesSearch && matchesProperty;
  });

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      
      {/* Upper Module header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            🏢 إدارة الأبنية والكتل السكنية (Buildings)
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            متابعة الحالة التشغيلية للمصاعد، مؤشرات خزانات المياه، وفواتير عدادات الكهرباء المنفصلة.
          </p>
        </div>

        <button
          onClick={() => {
            if (properties.length === 0) {
              onTriggerAction('تنبيه النظام', 'الرجاء إنشاء محفظة عقارية أولاً لتتمكن من تفريز الأبنية والكتل بداخلها.');
              return;
            }
            setNewBld(prev => ({ ...prev, propertyId: properties[0]?.id || '' }));
            setIsAddOpen(true);
          }}
          className="bg-[#1E40AF] hover:bg-[#153185] text-white px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1E40AF]/20"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة كتل/مبنى جديد</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث برقم عداد الكهرباء، اسم المبنى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-xs font-bold ${
              isDark 
                ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300'
            } border focus:outline-none transition-all`}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">تصفية حسب العقار الرئيسي:</span>
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-[#020617] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            } border focus:outline-none`}
          >
            <option value="all">كل المحافظ والمجمعات 🕋</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
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
              <h2 className="text-lg font-black mb-4">🏢 تسجيل مبنى/كتلة عقارية فرعية</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">العقار (المجمع الرئيسي) التابع</label>
                  <select
                    value={newBld.propertyId}
                    onChange={(e) => setNewBld({ ...newBld, propertyId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border`}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">اسم المبنى / رقم البلوك</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مبنى النرجس - بلوك أ"
                    value={newBld.name}
                    onChange={(e) => setNewBld({ ...newBld, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">العنوان بالتفصيل</label>
                  <input
                    type="text"
                    required
                    placeholder="امتداد حي النرجس، الرياض، مخرج 7"
                    value={newBld.address}
                    onChange={(e) => setNewBld({ ...newBld, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">عدد الطوابق</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="4"
                      required
                      value={newBld.floorsCount}
                      onChange={(e) => setNewBld({ ...newBld, floorsCount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">عدد الوحدات بالكتلة</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="8"
                      required
                      value={newBld.unitsCount}
                      onChange={(e) => setNewBld({ ...newBld, unitsCount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">حالة المصعد الكهربائي</label>
                    <select
                      value={newBld.elevatorStatus}
                      onChange={(e) => setNewBld({ ...newBld, elevatorStatus: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="operational">يعمل بكفاءة 🟢</option>
                      <option value="maintenance">تحت الصيانة الطارئة 🟡</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">خزان المياه الرئيسي (% ممتلئ)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="80"
                      required
                      value={newBld.waterTankMeter}
                      onChange={(e) => setNewBld({ ...newBld, waterTankMeter: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">حساب/رقم عداد الكهرباء</label>
                    <input
                      type="text"
                      placeholder="ELEC-48240-RYD"
                      value={newBld.electricityMeterNo}
                      onChange={(e) => setNewBld({ ...newBld, electricityMeterNo: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">درجة معيار النظافة</label>
                    <select
                      value={newBld.cleanlinessGrade}
                      onChange={(e) => setNewBld({ ...newBld, cleanlinessGrade: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="A">ممتاز (Cleanliness Grade A)</option>
                      <option value="B">جيد جداً (Cleanliness Grade B)</option>
                      <option value="C">تحتاج فحص (Cleanliness Grade C)</option>
                    </select>
                  </div>
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
                    تسجيل معلومات المبنى
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buildings list grid cards */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا يوجد كتل سكنية مسجلة</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">بإمكانك فرز وتوزع مجمعاتك بإضافة أو تنزيل مبنى ذكي.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => {
            return (
              <motion.div
                key={b.id}
                layout
                className={`rounded-3xl p-5 border text-right space-y-4 ${
                  isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200'
                } transition-all relative overflow-hidden`}
              >
                {/* Upper row */}
                <div className="flex justify-between items-start gap-1">
                  <span className={`px-2 py-1 rounded-full text-[8.5px] font-black ${
                    b.elevatorStatus === 'operational' 
                      ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/60' 
                      : 'bg-amber-950/20 text-amber-400 border border-amber-900/60'
                  }`}>
                    مصعد: {b.elevatorStatus === 'operational' ? 'يعمل بكفاءة' : 'تحت الخدمة والمراجعة'}
                  </span>
                  
                  <div className="flex flex-col text-right">
                    <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {b.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{b.propertyName}</span>
                  </div>
                </div>

                {/* Building detail parameters */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[10.5px] text-slate-500 font-bold">{b.address}</p>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className={`p-2 rounded-xl ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}>
                      <span className="text-[8.5px] text-slate-500 block font-semibold">عدد الطوابق</span>
                      <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-900'} font-mono`}>{b.floorsCount}</span>
                    </div>

                    <div className={`p-2 rounded-xl ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}>
                      <span className="text-[8.5px] text-slate-500 block font-semibold">إجمالي الوحدات</span>
                      <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-900'} font-mono`}>{b.unitsCount}</span>
                    </div>

                    <div className={`p-2 rounded-xl ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}>
                      <span className="text-[8.5px] text-slate-500 block font-semibold">توزيع النظافة</span>
                      <span className={`text-xs font-black text-emerald-500 font-sans`}>Grade {b.cleanlinessGrade}</span>
                    </div>
                  </div>
                </div>

                {/* Utilities meters */}
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#020617]/70' : 'bg-slate-50'} space-y-2.5 text-xs`}>
                  
                  {/* Water tank */}
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] text-slate-400 font-bold flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-cyan-400" />
                      <span>مستوى خزان المياه الرئيسي</span>
                    </span>
                    <span className="font-mono text-[10.5px] text-cyan-400 font-black">%{b.waterTankMeter}</span>
                  </div>

                  {/* Water meter bar progress */}
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${b.waterTankMeter}%` }}></div>
                  </div>

                  {/* Electricity Account */}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800/10 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>حساب عداد الكهرباء الرئيسي</span>
                    </span>
                    <span className="font-mono text-slate-300 font-bold select-all">{b.electricityMeterNo}</span>
                  </div>

                </div>

                {/* Lower Action Delete Row */}
                <div className="flex justify-end items-center pt-2 border-t border-slate-800/10">
                  <button
                    onClick={() => onDeleteBuilding(b.id)}
                    className={`p-2 rounded-xl text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 text-[10.5px] font-black`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>إلغاء الكتلة</span>
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
