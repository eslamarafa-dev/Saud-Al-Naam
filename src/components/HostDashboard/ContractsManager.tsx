/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Plus, Trash2, CheckCircle2, 
  Calendar, ShieldAlert, DollarSign, ExternalLink, Link,
  AlertTriangle, Printer, Download, RefreshCw, SlidersHorizontal, 
  Archive, User, Building, Check, X, ChevronDown, ChevronUp, 
  FileCheck, QrCode, ClipboardList, Clock, ArrowUpRight, ShieldCheck, UserCheck, HelpCircle
} from 'lucide-react';
import { Contract, Tenant, PropertyUnit, PropertyPortfolio } from '../../types';

interface ContractsManagerProps {
  contracts: Contract[];
  tenants: Tenant[];
  units: PropertyUnit[];
  properties: PropertyPortfolio[];
  onAddContract: (contract: Contract) => void;
  onDeleteContract: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
  currentUser?: { id: string; fullName: string; email: string; role: string } | null;
}

export default function ContractsManager({
  contracts,
  tenants,
  units,
  properties = [],
  onAddContract,
  onDeleteContract,
  theme,
  onTriggerAction,
  currentUser
}: ContractsManagerProps) {
  // State variables for search, tabs, filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'terminated' | 'pending' | 'expiring_soon' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form toggles
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [renewalTarget, setRenewalTarget] = useState<Contract | null>(null);
  const [pdfPreviewTarget, setPdfPreviewTarget] = useState<Contract | null>(null);

  // Expiration calculation helper (Current date is June 22, 2026)
  const TODAY_STR = "2026-06-22";
  const today = new Date(TODAY_STR);

  // Create contract form states
  const [newCon, setNewCon] = useState({
    tenantId: '',
    unitId: '',
    propertyId: '',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    rentalAmount: 45000,
    securityDeposit: 3000,
    billingCycle: 'quarterly' as 'monthly' | 'quarterly' | 'yearly',
    ejariStatus: 'registered' as 'registered' | 'pending' | 'none',
    ejariNumber: '',
    notes: ''
  });

  // Renewal form states
  const [renewalData, setRenewalData] = useState({
    newEndDate: '',
    newRentalAmount: 0,
    notes: '',
    adjustType: 'none' as 'none' | 'increase_5' | 'increase_10' | 'custom'
  });

  // RBAC Access validation
  const isAuthorized = (): boolean => {
    const role = currentUser?.role;
    return role === 'super_admin' || role === 'property_manager';
  };

  const checkPermissions = (onSuccess: () => void) => {
    if (!isAuthorized()) {
      onTriggerAction(
        'حظر الإجراء الصلاحي 🔒', 
        'لا تمتلك الصلاحيات الإدارية المطلوبة لإجراء تغييرات في العقود الإيجارية الرسمية.'
      );
    } else {
      onSuccess();
    }
  };

  // Days remaining calculator
  const getDaysRemaining = (endStr: string) => {
    try {
      const endDate = new Date(endStr);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 365;
    }
  };

  // Check if contract is expiring within 60 days
  const isExpiringSoon = (endStr: string, status: string) => {
    if (status !== 'active') return false;
    const days = getDaysRemaining(endStr);
    return days > 0 && days <= 60;
  };

  // Filter calculations
  const filtered = contracts.filter(c => {
    // Search query matching
    const matchesSearch = 
      c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.unitName && c.unitName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.propertyName && c.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ejariNumber && c.ejariNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter matching
    if (statusFilter === 'all') {
      return matchesSearch && !c.isArchived;
    }
    if (statusFilter === 'archived') {
      return matchesSearch && c.isArchived;
    }
    if (statusFilter === 'expiring_soon') {
      return matchesSearch && isExpiringSoon(c.endDate, c.status) && !c.isArchived;
    }
    const matchesStatus = c.status === statusFilter;
    return matchesSearch && matchesStatus && !c.isArchived;
  });

  // KPI Aggregates
  const activeContractsNum = contracts.filter(c => c.status === 'active' && !c.isArchived).length;
  const expiringContractsNum = contracts.filter(c => isExpiringSoon(c.endDate, c.status) && !c.isArchived).length;
  const archivedContractsNum = contracts.filter(c => c.isArchived).length;
  const totalLeaseValue = contracts
    .filter(c => c.status === 'active' && !c.isArchived)
    .reduce((acc, curr) => acc + Number(curr.rentalAmount), 0);

  // Form selection change: Filter units when Property changes (Cascading Dropdowns)
  const handlePropertyChange = (propId: string) => {
    const selectedProp = properties.find(p => p.id === propId);
    let potentialUnitId = '';
    
    // Find units that belong to the chosen property (or same city)
    if (selectedProp) {
      const cityUnits = units.filter(u => u.city === selectedProp.city);
      if (cityUnits.length > 0) {
        potentialUnitId = cityUnits[0].id;
      } else {
        potentialUnitId = units[0]?.id || '';
      }
    } else {
      potentialUnitId = units[0]?.id || '';
    }

    setNewCon(prev => ({
      ...prev,
      propertyId: propId,
      unitId: potentialUnitId
    }));
  };

  // Creating a new contract submit handler
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!newCon.tenantId || !newCon.unitId) {
      onTriggerAction('تنبيه التحقق ⚠️', 'الرجاء تحديد المستأجر والوحدة السكنية والتوثيقات لرفع العقد المعول.');
      return;
    }

    const start = new Date(newCon.startDate);
    const end = new Date(newCon.endDate);
    if (end <= start) {
      onTriggerAction('خطأ بالتاريخ 📅', 'تاريخ نهاية الإخلاء لا بد أن يكون يوماً لاحقاً لبداية العقد.');
      return;
    }

    const selectedTenant = tenants.find(t => t.id === newCon.tenantId);
    const selectedUnit = units.find(u => u.id === newCon.unitId);
    const selectedProp = properties.find(p => p.id === newCon.propertyId) || properties[0];

    const addedContract: Contract = {
      id: 'con-' + Date.now(),
      contractNumber: 'EJARI-' + Math.floor(Math.random() * 90000 + 10000),
      tenantId: newCon.tenantId,
      tenantName: selectedTenant ? selectedTenant.name : 'مستأجر غير مدرج',
      unitId: newCon.unitId,
      unitName: selectedUnit ? selectedUnit.name : 'وحدة عقارية عامة',
      propertyId: newCon.propertyId || selectedProp?.id || '',
      propertyName: selectedProp ? selectedProp.name : 'محفظة عقارية غير محددة',
      startDate: newCon.startDate,
      endDate: newCon.endDate,
      rentalAmount: Number(newCon.rentalAmount),
      securityDeposit: Number(newCon.securityDeposit),
      billingCycle: newCon.billingCycle,
      status: 'active',
      ejariStatus: newCon.ejariStatus,
      ejariNumber: newCon.ejariNumber || 'E-' + Math.floor(Math.random() * 9000000 + 1000000),
      notes: newCon.notes || 'تم الإنشاء والمصادقة ميكانيكياً.',
      renewalCount: 0,
      renewalHistory: []
    };

    onAddContract(addedContract);
    setIsAddOpen(false);
    onTriggerAction('إدراج وتوثيق عقد جديد 📄', `تم إقرار العقد ذي الرقم ${addedContract.contractNumber} للمستأجر ${addedContract.tenantName} مع شبكة إيجار وحفظ التوثيقات.`);
  };

  // Setup Renewal modal
  const openRenewalModal = (contract: Contract) => {
    checkPermissions(() => {
      // Predict next end date (approx 1 year later)
      let nextEnd = '2027-12-31';
      try {
        const currEnd = new Date(contract.endDate);
        currEnd.setFullYear(currEnd.getFullYear() + 1);
        nextEnd = currEnd.toISOString().split('T')[0];
      } catch {}

      setRenewalTarget(contract);
      setRenewalData({
        newEndDate: nextEnd,
        newRentalAmount: contract.rentalAmount,
        notes: 'تجديد سنوي تلقائي بموجب الاتفاق المسبق مضافاً إليه الرسوم الضريبية.',
        adjustType: 'none'
      });
    });
  };

  // Process Renewal submission
  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewalTarget) return;

    const updatedContract: Contract = {
      ...renewalTarget,
      endDate: renewalData.newEndDate,
      rentalAmount: Number(renewalData.newRentalAmount),
      renewalCount: (renewalTarget.renewalCount || 0) + 1,
      renewalHistory: [
        ...(renewalTarget.renewalHistory || []),
        {
          date: new Date().toISOString().split('T')[0],
          amount: Number(renewalData.newRentalAmount),
          prevEndDate: renewalTarget.endDate,
          newEndDate: renewalData.newEndDate
        }
      ],
      notes: (renewalTarget.notes || '') + `\n[تم التجديد دورة جديدة بقيمة ${renewalData.newRentalAmount} ر.س لتاريخ ${renewalData.newEndDate}]`
    };

    onAddContract(updatedContract);
    setRenewalTarget(null);
    onTriggerAction('تجديد عقد الإيجار 🔄', `تم تجديد وتطويل العقد ${updatedContract.contractNumber} بنجاح إلى تاريخ ${updatedContract.endDate}`);
  };

  // Adjust rental pricing dynamically in modal
  const handlePriceAdjustType = (type: 'none' | 'increase_5' | 'increase_10' | 'custom') => {
    if (!renewalTarget) return;
    let amt = renewalTarget.rentalAmount;
    if (type === 'increase_5') {
      amt = Math.round(renewalTarget.rentalAmount * 1.05);
    } else if (type === 'increase_10') {
      amt = Math.round(renewalTarget.rentalAmount * 1.10);
    }
    setRenewalData(prev => ({
      ...prev,
      adjustType: type,
      newRentalAmount: amt
    }));
  };

  // Archive contract
  const handleArchiveContract = (contract: Contract) => {
    checkPermissions(() => {
      const archived: Contract = {
        ...contract,
        isArchived: true,
        status: contract.status === 'active' ? 'terminated' : contract.status
      };
      onAddContract(archived);
      onTriggerAction('أرشفة العقد 🗄️', `تم نقل تذكرة العقد رقم ${contract.contractNumber} إلى قسم مستندات الأرشيف المغلقة.`);
    });
  };

  // Delete contract completely
  const handleTerminateContract = (id: string) => {
    checkPermissions(() => {
      if (confirm('هل أنت متأكد من حذف العقد من الجداول نهائياً؟ لا يمكن استرجاع الوثيقة.')) {
        onDeleteContract(id);
        onTriggerAction('إتلاف عقد إيجاري 🗑️', 'تم مسح وإلغاء وثيقة العقد الإيجاري من قواعد النظام تماماً.');
      }
    });
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch(cycle) {
      case 'monthly': return 'فوترة شهرية دائرية';
      case 'quarterly': return 'دفع ربع سنوي (كل ٣ أشهر)';
      case 'yearly': return 'دفع سنوي كامل مقدم';
      default: return cycle;
    }
  };

  const getStatusBadgeStyle = (status: string, isArchived?: boolean) => {
    if (isArchived) {
      return 'bg-slate-900/40 text-slate-400 border border-slate-850';
    }
    switch(status) {
      case 'active': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30';
      case 'expired': return 'bg-rose-950/40 text-rose-400 border border-rose-900/30';
      case 'terminated': return 'bg-amber-950/40 text-amber-500 border border-amber-900/30';
      default: return 'bg-blue-950/40 text-blue-400 border border-blue-900/30';
    }
  };

  const getStatusLabelText = (status: string, isArchived?: boolean) => {
    if (isArchived) return 'مؤرشف ومغلف 🗄️';
    switch(status) {
      case 'active': return 'عقد نشط ساري 🟢';
      case 'expired': return 'منتهي الدورة الإيجارية 🔴';
      case 'terminated': return 'عقد مفسوخ/مصفى ⚠️';
      default: return 'قيد المصادقة المباشرة 🟡';
    }
  };

  const getEjariBadgeColorByStatus = (status: string) => {
    switch(status) {
      case 'registered': return 'bg-teal-950/40 text-teal-400 border border-teal-900/30';
      case 'pending': return 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/30';
      default: return 'bg-slate-950/40 text-slate-400 border border-slate-900/30';
    }
  };

  // Generate dynamic elapsed ratio bar
  const getElapsedRatioAndDays = (startStr: string, endStr: string) => {
    try {
      const sDate = new Date(startStr);
      const eDate = new Date(endStr);
      const totalTime = eDate.getTime() - sDate.getTime();
      const passedTime = today.getTime() - sDate.getTime();
      
      if (passedTime <= 0) return { pct: 0, daysLeft: Math.ceil(totalTime / (1000 * 3600 * 24)) };
      
      const pct = Math.min(100, Math.round((passedTime / totalTime) * 100));
      const daysLeft = Math.ceil((eDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      return { pct, daysLeft };
    } catch {
      return { pct: 50, daysLeft: 180 };
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Dynamic RBAC Banner Notice */}
      {!isAuthorized() && (
        <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-2xl flex items-center justify-between flex-row-reverse text-right gap-4">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="p-2.5 bg-amber-950/40 rounded-xl border border-amber-800 text-amber-500">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-500">وضع عرض المستثمر المحدود (Investor/Staff Overview Mode) 🔒</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">أنت مسجل بحساب لا يملك صلاحية صياغة، تعديل أو حذف عقود الإيجار. تستطيع طباعة ومعاينة تراخيص إيجار السكنية فقط.</p>
            </div>
          </div>
          <span className="font-mono text-[9px] text-amber-500 bg-amber-950/80 px-2 py-1 rounded border border-amber-800/30">READ_ONLY</span>
        </div>
      )}

      {/* Page Title & Module Actions */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 flex-row-reverse`}>
            <span>إبرام وتنظيم عقود المستأجرين</span>
            <FileText className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-1">
            موثق من الهيئة العامة للعقار السعودي. مراجعة صكوك وتوثيقات منصة إيجار الوطنية، دورات الفوترة، ومزامنة تواريخ نهاية الإيجار.
          </p>
        </div>

        <button
          onClick={() => {
            if (tenants.length === 0 || units.length === 0) {
              onTriggerAction('لا يوجد مرافق عقارية ⚠️', 'الرجاء إضافة مستأجر ووحدة سكنية مسؤولة أولاً لإمكانية صياغة العقد الموحد.');
              return;
            }
            // Prefill selects inside our state
            setNewCon(prev => ({
              ...prev,
              tenantId: tenants[0]?.id || '',
              unitId: units[0]?.id || '',
              propertyId: properties[0]?.id || ''
            }));
            setIsAddOpen(true);
          }}
          className="w-full lg:w-auto bg-gradient-to-l from-blue-600 to-blue-800 hover:from-blue-750 hover:to-[#153185] text-white px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer text-center"
        >
          <Plus className="h-4 w-4" />
          <span>إبرام عقد إيجار موحد جديد</span>
        </button>
      </div>

      {/* Aggregate Widget Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-blue-900/10 rounded-2xl border border-blue-900/30 text-blue-500">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">العقود الجارية النشطة</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeContractsNum}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">عقود سكنية وتجارية</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-red-950/20 rounded-2xl border border-red-900 text-rose-500">
              <ShieldAlert className="h-4.5 w-4.5 animate-bounce" />
            </div>
            <span className="text-[10px] text-rose-450 font-black tracking-widest uppercase">مهددة بالانتهاء</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono text-rose-500`}>{expiringContractsNum}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">خلال أقل من ٦٠ يوماً</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-yellow-900/10 rounded-2xl border border-yellow-950 text-yellow-500">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] text-amber-500 font-black tracking-widest uppercase">إيراد مستحقات جارية</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono text-yellow-500`}>{totalLeaseValue.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">ر.س مستهدفة سنوياً</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
              <Archive className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">سجلات عقود قديمة مؤرشفة</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{archivedContractsNum}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">مسودات ومغلفات تالفة</span>
          </div>
        </div>

      </div>

      {/* Control Filters Area */}
      <div className={`p-4 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-202'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث برقم العقد، اسم المستأجر، أو الهوية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 rounded-xl text-xs font-semibold ${
              isDark 
                ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-350'
            } border focus:outline-none transition-all`}
          />
        </div>

        {/* Horizontal Status Filters list */}
        <div className="flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : isDark ? 'bg-slate-900/40 text-slate-450 hover:bg-slate-900 hover:text-white' : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
            }`}
          >
            الكل ({contracts.filter(c => !c.isArchived).length})
          </button>

          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              statusFilter === 'expiring_soon' 
                ? 'bg-amber-600 text-white animate-pulse' 
                : isDark ? 'bg-amber-950/20 text-amber-500 border border-amber-900/30 font-bold hover:bg-amber-950/40' : 'bg-amber-50 text-amber-900 border border-amber-200 font-bold hover:bg-amber-100'
            }`}
          >
            تنبيهات الانتهاء ⚠️ ({expiringContractsNum})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === 'active' 
                ? 'bg-emerald-600 text-white' 
                : isDark ? 'bg-slate-900/40 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            عقود جارية
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === 'pending' 
                ? 'bg-cyan-600 text-white' 
                : isDark ? 'bg-slate-900/40 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            مسودة / غير نشط
          </button>

          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              statusFilter === 'archived' 
                ? 'bg-slate-750 text-white border border-slate-600' 
                : isDark ? 'bg-slate-900/40 text-slate-500 hover:text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Archive className="h-3.5 w-3.5" />
            <span>الأرشيف ({archivedContractsNum})</span>
          </button>
        </div>

      </div>

      {/* Main List output */}
      {filtered.length === 0 ? (
        <div className={`p-16 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <ClipboardList className="h-14 w-14 text-slate-500 mx-auto mb-4" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا توجد عقود تطابق خيارات الفرز والبحث الحالية</h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold">حاول تنظيف وتغيير نطاق البحث أو تصفية تصنيفات الانتهاء النشطة لبيان المستحقات.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filtered.map((con) => {
            const daysLeftData = getElapsedRatioAndDays(con.startDate, con.endDate);
            const isSoon = isExpiringSoon(con.endDate, con.status);
            
            // Find linked national profile details
            const linkedTenant = tenants.find(t => t.id === con.tenantId);
            
            return (
              <motion.div
                layout
                key={con.id}
                className={`rounded-[32px] p-6 border transition-all ${
                  isSoon 
                    ? 'border-rose-900/40 bg-gradient-to-b from-[#0e0303] to-[#040101] shadow-lg shadow-rose-950/5' 
                    : isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-205 hover:border-slate-300'
                } space-y-5`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  
                  {/* Action or status labels */}
                  <div className="flex flex-col items-start gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${getStatusBadgeStyle(con.status, con.isArchived)}`}>
                      {getStatusLabelText(con.status, con.isArchived)}
                    </span>
                    {isSoon && (
                      <span className="bg-rose-550/20 text-rose-500 px-2 py-0.5 rounded-full text-[9px] font-black mt-1 flex items-center gap-1 border border-rose-900/30 animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        <span>ينتهي قريباً (بقيت {daysLeftData.daysLeft} يوم) ⏰</span>
                      </span>
                    )}
                  </div>

                  {/* Contract ID / Ejari state */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${getEjariBadgeColorByStatus(con.ejariStatus)}`}>
                        {con.ejariStatus === 'registered' ? 'موثق شبكة إيجار 🇸🇦' : con.ejariStatus === 'pending' ? 'بانتظار طرف ثانٍ' : 'مباشر ورقي'}
                      </span>
                      <h3 className={`font-black text-xs font-mono ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{con.contractNumber}</h3>
                    </div>
                    {con.propertyName && (
                      <p className="text-[10px] text-blue-400 font-extrabold mt-1.5 flex items-center justify-end gap-1 pointer-events-none">
                        <span>{con.propertyName}</span>
                        <Building className="h-3.5 w-3.5" />
                      </p>
                    )}
                  </div>

                </div>

                {/* Main Metadata and Tenant Bio Body */}
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-[#020617]/50' : 'bg-slate-50'} grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold`}>
                  
                  {/* Left Column: Tenant Biodata */}
                  <div className="space-y-2 border-l border-slate-800/10 md:pl-2">
                    <div className="flex items-center gap-2 flex-row-reverse text-right">
                      <div className="p-1.5 bg-blue-900/10 rounded-lg text-blue-500">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-550 block font-bold">المستأجر الطرف الثاني</span>
                        <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{con.tenantName}</span>
                      </div>
                    </div>

                    {linkedTenant && (
                      <div className="text-[10px] text-slate-400 space-y-1 mt-2 text-right">
                        <div>رقم الهوية الوطنية/الإقامة: <span className="font-mono text-slate-300 font-bold">{linkedTenant.nationalId}</span></div>
                        <div>الجنسية: <span className="text-slate-300 font-bold">{linkedTenant.nationality}</span></div>
                        <div>رقم الجوال الفوري: <span className="font-mono text-slate-300 font-bold">{linkedTenant.phone}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Lease Details & Linked Property/Unit */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-550 block font-bold">الوحدة الإيجارية التابعة</span>
                      <span className={`text-slate-300 font-extrabold block text-[11.5px] line-clamp-1`}>{con.unitName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div>تاريخ البداية:<span className="font-mono text-slate-300 block font-bold mt-0.5">{con.startDate}</span></div>
                      <div>نهاية الإخلاء:<span className="font-mono text-slate-300 block font-bold mt-0.5">{con.endDate}</span></div>
                    </div>
                  </div>

                </div>

                {/* Lease progression bar & tracker */}
                {con.status === 'active' && !con.isArchived && (
                  <div className="space-y-1.5 pb-1 text-right">
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold flex-row-reverse">
                      <span>المدة المتبقية: {daysLeftData.daysLeft > 0 ? `${daysLeftData.daysLeft} يوم` : 'منقضٍ'}</span>
                      <span>نسبة الانقضاء الزمني من العقد: %{daysLeftData.pct}</span>
                    </div>
                    {/* Visual Progress gauge */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isSoon ? 'bg-gradient-to-l from-rose-500 to-red-600' : 'bg-gradient-to-l from-blue-500 to-indigo-600'
                        }`} 
                        style={{ width: `${daysLeftData.pct}%` }} 
                      />
                    </div>
                  </div>
                )}

                {/* Financial Lease specs */}
                <div className="grid grid-cols-2 gap-4 text-center font-mono">
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#020617]/40' : 'bg-slate-50'}`}>
                    <span className="text-[9px] text-slate-500 block font-sans font-bold">الإيجار السنوي الإجمالي</span>
                    <span className={`text-sm font-black text-rose-455 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {(con.rentalAmount).toLocaleString()} <span className="text-[10px] font-sans">ر.س</span>
                    </span>
                  </div>
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#020617]/40' : 'bg-slate-50'}`}>
                    <span className="text-[9px] text-slate-500 block font-sans font-bold">مبلغ التأمين المودع</span>
                    <span className="text-sm font-black text-emerald-500">
                      {(con.securityDeposit).toLocaleString()} <span className="text-[10px] font-sans">ر.س</span>
                    </span>
                  </div>
                </div>

                {/* Renewal Records & Audit Log timeline (if renewed previously) */}
                {con.renewalCount ? (
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-indigo-950/10 border-indigo-950/40 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-950'} text-xs text-right mt-2 space-y-1.5`}>
                    <div className="font-extrabold flex items-center gap-1 flex-row-reverse">
                      <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                      <span>سجل التمديد والتجديد ({con.renewalCount} دورات مكررة)</span>
                    </div>
                    {con.renewalHistory && con.renewalHistory.map((hist, index) => (
                      <div key={index} className="text-[10px] text-slate-400 font-mono pr-4 list-decimal block">
                        • تم التجديد في {hist.date} بقيمة {hist.amount.toLocaleString()} ر.س (نهاية جديدة: {hist.newEndDate})
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Action Controls Footer */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/20 text-xs">
                  
                  {/* Notes / Ejari links */}
                  <div className="text-slate-450 text-[10px] font-semibold text-right max-w-xs line-clamp-1">
                    <span>دورة التحصيل: {getBillingCycleLabel(con.billingCycle)}</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    
                    {/* View/Print Official Document PDF */}
                    <button
                      onClick={() => setPdfPreviewTarget(con)}
                      className={`px-3 py-2 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 ${
                        isDark 
                          ? 'border-slate-850 hover:bg-slate-900 text-slate-350 hover:text-white' 
                          : 'border-slate-200 hover:bg-slate-100 text-slate-650 hover:text-slate-900'
                      } cursor-pointer`}
                      title="تحميل/معاينة العقد إيجار الرسمي المعتمد"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-500" />
                      <span>معاينة العقد (PDF)</span>
                    </button>

                    {/* Quick renewal action trigger */}
                    {con.status === 'active' && !con.isArchived && (
                      <button
                        onClick={() => openRenewalModal(con)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-950 text-white font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow shadow-indigo-500/10"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>تجديد العقد دورة جديدة</span>
                      </button>
                    )}

                    {/* Toggle archive flag */}
                    {!con.isArchived && (
                      <button
                        onClick={() => handleArchiveContract(con)}
                        className={`p-2 rounded-xl border ${
                          isDark ? 'border-slate-850 hover:bg-slate-900 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                        title="نقل للأرشيف العقاري الحفظي"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}

                    {/* Danger control termination delete */}
                    <button
                      onClick={() => handleTerminateContract(con.id)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                      title="إتلاف وتدمير وثائق العقد تماماً"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW LEASE CONTRACT MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl rounded-[32px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right overflow-y-auto max-h-[90vh]`}
            >
              
              <div className="flex justify-between items-center mb-6">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  className="p-2 hover:bg-slate-900/10 dark:hover:bg-slate-900 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-black flex items-center gap-2 flex-row-reverse">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <span>🆕 صياغة وإبرام صك عقد إيجار موحد</span>
                </h2>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                
                {/* 1. Cascading Property & Unit Linkage */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#020617] border-slate-850' : 'bg-slate-50 border-slate-250'} space-y-4`}>
                  <div className="font-bold text-xs text-blue-450 flex items-center justify-end gap-1.5 flex-row-reverse">
                    <Building className="h-4 w-4" />
                    <span>الموقع العقاري والوحدة السكنية والمحفظة</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">خطوة ١: تحديد المحفظة الاستثمارية (العقار الرئيسي)</label>
                      <select
                        value={newCon.propertyId}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                          isDark ? 'bg-[#020617] border-slate-850 text-white focus:border-slate-700' : 'bg-white border-slate-200 text-slate-950'
                        } border`}
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - ({p.city})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">خطوة ٢: تحديد الوحدات العقارية التابعة المتاحة</label>
                      <select
                        value={newCon.unitId}
                        onChange={(e) => setNewCon({ ...newCon, unitId: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                          isDark ? 'bg-[#020512] border-slate-850 text-white focus:border-slate-700' : 'bg-white border-slate-205 text-slate-950'
                        } border`}
                      >
                        {/* High Fidelity filter: candidate units filter dynamically */}
                        {units
                          .filter(u => {
                            const activeProp = properties.find(p => p.id === newCon.propertyId);
                            // Highlight or match units which belong to same city 
                            if (!activeProp) return true;
                            return u.city === activeProp.city;
                          })
                          .map(u => (
                            <option key={u.id} value={u.id}>{u.name} (حالة الوحدة: {u.status})</option>
                          ))
                        }
                        {/* Fallback to all if city check fails */}
                        {units
                          .filter(u => {
                            const activeProp = properties.find(p => p.id === newCon.propertyId);
                            if (!activeProp) return true;
                            return u.city !== activeProp.city;
                          })
                          .map(u => (
                            <option key={u.id} value={u.id}>طوارئ: {u.name} ({u.city})</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Tenant Linking */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#020617] border-slate-850' : 'bg-slate-50 border-slate-250'} space-y-3`}>
                  <div className="font-bold text-xs text-blue-450 flex items-center justify-end gap-1.5 flex-row-reverse">
                    <UserCheck className="h-4 w-4" />
                    <span>ربط وتوثيق المستأجر الطرف الثاني (Tenant Linking)</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">اختر مستأجر مسجل وموثق الهوية</label>
                    <select
                      value={newCon.tenantId}
                      onChange={(e) => setNewCon({ ...newCon, tenantId: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                        isDark ? 'bg-[#020512] border-slate-800 text-white focus:border-slate-700' : 'bg-white border-slate-200 text-slate-950'
                      } border`}
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.name} (رقم مسوغ: {t.nationalId})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Dates Range picker */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ بدء سريان العقد (ميلادي)</label>
                    <input
                      type="date"
                      required
                      value={newCon.startDate}
                      onChange={(e) => setNewCon({ ...newCon, startDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ نهاية عقد الإخلاء (ميلادي)</label>
                    <input
                      type="date"
                      required
                      value={newCon.endDate}
                      onChange={(e) => setNewCon({ ...newCon, endDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                {/* 4. Pricing details and cycles */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">الإيجار الإجمالي (ر.س/سنوي)</label>
                    <input
                      type="number"
                      min="1000"
                      required
                      value={newCon.rentalAmount}
                      onChange={(e) => setNewCon({ ...newCon, rentalAmount: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-black font-mono ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">مبلغ التأمين الطبيعي (ر.س)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newCon.securityDeposit}
                      onChange={(e) => setNewCon({ ...newCon, securityDeposit: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-black font-mono ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">أدوار دورة دفعات الفاقد</label>
                    <select
                      value={newCon.billingCycle}
                      onChange={(e) => setNewCon({ ...newCon, billingCycle: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020512] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="monthly">شهري مكرر</option>
                      <option value="quarterly">ربع سنوي (٤ دفعات)</option>
                      <option value="yearly">دفعة سنوية كلياً</option>
                    </select>
                  </div>
                </div>

                {/* platform ejari and validation numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">نوع التوثيق الإقراري</label>
                    <select
                      value={newCon.ejariStatus}
                      onChange={(e) => setNewCon({ ...newCon, ejariStatus: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#020512] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                      } border`}
                    >
                      <option value="registered">موحد في بوابة إيجار 🇸🇦</option>
                      <option value="pending">قيد الطلب والمطابقة الإدارية</option>
                      <option value="none">مباشر للمجموعة مسوغ خارجي</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">رقم رخص العقد منصة إيجار (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثل: E-9281203..."
                      value={newCon.ejariNumber}
                      onChange={(e) => setNewCon({ ...newCon, ejariNumber: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-mono ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Additional custom lease provisions */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">البنود والشروط الجنائية والإلزامية المضافة للعقد</label>
                  <textarea
                    rows={2}
                    placeholder="مثل: يلتزم المستأجر بتقديم الممسوح الفوري لأي شقة مع مراعاة الحفاظ على أقفال الأبواب الذكية..."
                    value={newCon.notes}
                    onChange={(e) => setNewCon({ ...newCon, notes: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-extrabold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                {/* Submit row */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/10">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors ${
                      isDark ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    التراجع والإلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-l from-blue-600 to-blue-800 text-white cursor-pointer transition-colors"
                  >
                    اعتماد الصياغة ورفع الصك
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK RENEWAL MODAL */}
      <AnimatePresence>
        {renewalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-[32px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right`}
            >
              
              <div className="flex justify-between items-center mb-6">
                <button 
                  type="button" 
                  onClick={() => setRenewalTarget(null)} 
                  className="p-2 hover:bg-slate-900/10 dark:hover:bg-slate-900 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-black flex items-center gap-2 flex-row-reverse">
                  <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin" />
                  <span>تجديد وتمديد عقد الإيجار</span>
                </h2>
              </div>

              <div className="mb-4 bg-indigo-950/20 text-indigo-400 p-4 border border-indigo-900/30 rounded-2xl text-xs font-extrabold text-right">
                <div>عقد رقم: <span className="font-mono text-white pr-1">{renewalTarget.contractNumber}</span></div>
                <div className="mt-1">المستأجر الطرف الثاني: <span className="text-white pr-1">{renewalTarget.tenantName}</span></div>
                <div>تاريخ الانتهاء الحالي: <span className="font-mono text-white pr-1">{renewalTarget.endDate}</span></div>
              </div>

              <form onSubmit={handleRenewalSubmit} className="space-y-4">
                
                {/* Proposed next date */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ انتهاء الإخلاء الجديد المقترح</label>
                  <input
                    type="date"
                    required
                    value={renewalData.newEndDate}
                    onChange={(e) => setRenewalData({ ...renewalData, newEndDate: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                {/* Auto adjust pricing */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">تحيين الإيجار دورة التجديد (معيار سعود للتقلبات)</label>
                  
                  {/* Quick toggle chips */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handlePriceAdjustType('none')}
                      className={`py-2 rounded-lg text-xs font-black transition-colors ${
                        renewalData.adjustType === 'none' 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ثبات السعر (0%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePriceAdjustType('increase_5')}
                      className={`py-2 rounded-lg text-xs font-black transition-colors ${
                        renewalData.adjustType === 'increase_5' 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-750'
                      }`}
                    >
                      زيادة تضخم (5%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePriceAdjustType('increase_10')}
                      className={`py-2 rounded-lg text-xs font-black transition-colors ${
                        renewalData.adjustType === 'increase_10' 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      زيادة قصوى (10%)
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="100"
                      value={renewalData.newRentalAmount}
                      onChange={(e) => setRenewalData({ 
                        ...renewalData, 
                        newRentalAmount: Number(e.target.value),
                        adjustType: 'custom'
                      })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-black font-mono leading-none ${
                        isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                    <span className="absolute left-4 top-3 text-[10px] text-slate-400 font-bold">ريال سعودي/سنوي</span>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">مذكرة توثيق وحيثيات التجديد</label>
                  <textarea
                    rows={2}
                    value={renewalData.notes}
                    onChange={(e) => setRenewalData({ ...renewalData, notes: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs ${
                      isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                {/* Submissions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/20">
                  <button
                    type="button"
                    onClick={() => setRenewalTarget(null)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold ${
                      isDark ? 'bg-slate-900 text-white' : 'bg-slate-150 text-slate-700'
                    }`}
                  >
                    رجوع للتفاصيل
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-650 hover:bg-indigo-700 text-white"
                  >
                    تأكيد تجديد العقد وقيد التمديد
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MINISTRY OF HOUSING compliant (EJARI) PDF MOCKUP PREVIEW MODAL */}
      <AnimatePresence>
        {pdfPreviewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className={`w-full max-w-4xl rounded-[40px] ${
                isDark ? 'bg-[#030712] text-slate-100 border border-slate-850' : 'bg-slate-50 text-slate-900 border border-slate-300'
              } shadow-2xl overflow-hidden`}
            >
              
              {/* Modal control bar top */}
              <div className="flex justify-between items-center px-6 py-4 bg-blue-900/20 border-b border-slate-800/25 flex-row-reverse text-right">
                <div className="flex items-center gap-3.5 flex-row-reverse">
                  <FileCheck className="h-5 w-5 text-blue-500 animate-pulse" />
                  <span className="font-black text-sm text-white">معاينة وطباعة ترخيص صك منصة إيجار الوطنية 🇸🇦</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfPreviewTarget(null)}
                  className="p-2 bg-slate-950/50 hover:bg-slate-950 border border-slate-850 rounded-full text-white cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* PDF interactive blueprint viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-3">
                
                {/* Right Control actions Panel */}
                <div className={`p-6 lg:col-span-1 border-l ${isDark ? 'border-slate-850 bg-[#060b13]' : 'border-slate-200 bg-white'} space-y-6 text-right`}>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black text-slate-400">خيارات استخراج العقد</h5>
                    <p className="text-[10px] text-slate-500">العقد مسجل في النظام الوطني الموحد وصالح للمراجعة والدعم الحكومي في حساب المواطن والضمان.</p>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onTriggerAction('جاري تجهيز الطباعة 🖨️', 'تم إرسال مستند العقد الموحد بنجاح لطابعة المكتب الذكية عبر السحاب.');
                        window.print();
                      }}
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10"
                    >
                      <Printer className="h-4.5 w-4.5" />
                      <span>اتصال وطباعة فورية 🖨️</span>
                    </button>

                    <button
                      onClick={() => {
                        onTriggerAction('تحميل صك إيجار 📥', 'تم توليد وتنزيل مجلد العقد بصيغة PDF عالية جودة في ملفاتك الشخصية.');
                      }}
                      className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="h-4.5 w-4.5" />
                      <span>تنزيل صك الإيجار المعتمد (PDF)</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800/10 pt-4 space-y-3">
                    <div className="text-[10px] text-slate-400 font-extrabold flex items-center justify-end gap-1.5 flex-row-reverse">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>حالة التحقق والترميز الرقمي (E-Verification)</span>
                    </div>
                    {/* Fake Barcode / scan simulation */}
                    <div className="flex border border-slate-800 p-3 rounded-2xl bg-[#030712] justify-center items-center gap-3">
                      <QrCode className="h-14 w-14 text-white hover:scale-105 transition-transform" />
                      <div className="text-right text-[9px] text-slate-500 font-bold space-y-0.5 pointer-events-none">
                        <div>معرف التوثيق بوابة إيجار:</div>
                        <div className="font-mono text-zinc-350 select-all">{pdfPreviewTarget.ejariNumber || 'E-92183201'}</div>
                        <div>سعود النعام للخدمات الرقمية</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-950/20 p-4 border border-blue-900/30 rounded-2xl text-[10px] text-zinc-450 text-right">
                    <strong>ملاحظة قانونية:</strong> يخضع هذا العقد التنظيمي لمظلة قوانين وزارة الإسكان وشبكة وزارة العدل بالمملكة العربية السعودية، ومحكوم بضوابط السند لأمر المنقذي للتنفيذي.
                  </div>
                </div>

                {/* Left Ministry Paper Simulation */}
                <div className="p-8 lg:col-span-2 overflow-y-auto max-h-[65vh] bg-neutral-900 border-t lg:border-t-0 p-8 flex justify-center">
                  
                  {/* Visual Paper sheet mockup */}
                  <div className="w-[595px] min-h-[842px] bg-white text-slate-900 shadow-2xl border-4 border-emerald-600 rounded-[8px] p-6 text-right relative font-sans flex flex-col justify-between">
                    
                    {/* Top Green Islamic Header Banner */}
                    <div>
                      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 text-[10px] font-black pointer-events-none">
                        {/* Right Kingdom Seal */}
                        <div className="text-right">
                          <h6 className="text-xs font-black text-emerald-600">المملكة العربية السعودية</h6>
                          <div className="text-[9px] text-slate-500 mt-1">وزارة البلديات والبلدية والإسكان</div>
                          <div className="text-[9px] text-slate-500">شبكة إيجار الوطنية لعقود الإيجار الموحدة</div>
                        </div>

                        {/* Mid Title logo simulated */}
                        <div className="text-center self-center space-y-0.5">
                          <img 
                            referrerPolicy="no-referrer"
                            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200" 
                            alt="إيجار" 
                            className="h-8 w-24 object-cover mx-auto rounded-lg"
                          />
                          <span className="text-[12px] font-extrabold text-[#0D5C3A] block">وثيقة عقد إيجار سكني موجه</span>
                        </div>

                        {/* Left Code details */}
                        <div className="text-left font-mono">
                          <div>تاريخ الطباعة: {TODAY_STR}</div>
                          <div>رقم العقد: {pdfPreviewTarget.contractNumber}</div>
                          <div className="text-emerald-500">رمز إيجار: {pdfPreviewTarget.ejariNumber || 'مباشر'}</div>
                        </div>
                      </div>

                      {/* Paper Sections */}
                      <div className="space-y-4 py-6 text-xs">
                        
                        {/* 1. Parties list */}
                        <div className="space-y-2 text-right">
                          <h4 className="bg-slate-100 p-1 px-3 text-[#0D5C3A] font-black rounded text-[10.5px]">١. البيانات الأساسية لأطراف العقد الإيجاري</h4>
                          <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
                            <div>
                              <strong>الطرف الأول (المؤجر):</strong>
                              <div>سعود النعام للضيافة العقارية (مستودع الفندقة الموحد)</div>
                              <div>الهوية التجارية: 10109982412</div>
                            </div>
                            <div>
                              <strong>الطرف الثاني (المستأجر الكفيل):</strong>
                              <div>الأستاذ/ {pdfPreviewTarget.tenantName}</div>
                              {tenants.find(t => t.id === pdfPreviewTarget.tenantId) && (
                                <>
                                  <div>الهوية الوطنية/الإقامة: {tenants.find(t => t.id === pdfPreviewTarget.tenantId)?.nationalId}</div>
                                  <div>الجنسية: {tenants.find(t => t.id === pdfPreviewTarget.tenantId)?.nationality}</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Property & Unit Data */}
                        <div className="space-y-2 text-right">
                          <h4 className="bg-slate-100 p-1 px-3 text-[#0D5C3A] font-black rounded text-[10.5px]">٢. وصف وإفراز مكان العين المؤجرة</h4>
                          <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
                            <div>
                              <strong>الموقع المجمع:</strong>
                              <div>{pdfPreviewTarget.propertyName || 'محفظة سعود الاستثمارية'}</div>
                              <div>بلدية السكن: جدة / الرياض / عسير</div>
                            </div>
                            <div>
                              <strong>مواصفات وتجهيز الوحدة:</strong>
                              <div>{pdfPreviewTarget.unitName}</div>
                              <div>أثاث ذكي، مكيفات فندقية، سمارت لوك إنترنت مدمج.</div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Value & cycles */}
                        <div className="space-y-2 text-right">
                          <h4 className="bg-slate-100 p-1 px-3 text-[#0D5C3A] font-black rounded text-[10.5px]">٣. الشروط المالية ومواعيد استحقاق دفعات الفوترة</h4>
                          <table className="w-full text-center text-[10px] border border-slate-200 border-collapse">
                            <thead>
                              <tr className="bg-slate-50 font-black border-b border-slate-200 text-slate-700">
                                <th className="p-1 border-r border-slate-200">الإيجار الإجمالي المقابل</th>
                                <th className="p-1 border-r border-slate-200">الرهن والتأمين المودع</th>
                                <th className="p-1 border-r border-slate-200">أدوار الفوترة ودورية الأجر</th>
                                <th className="p-1">طبيعة العقد السنوي</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-200 text-right font-mono font-bold">
                                <td className="p-2 border-r border-slate-200 text-center">{pdfPreviewTarget.rentalAmount.toLocaleString()} ريال</td>
                                <td className="p-2 border-r border-slate-200 text-center">{pdfPreviewTarget.securityDeposit.toLocaleString()} ريال</td>
                                <td className="p-2 border-r border-slate-200 text-center font-sans font-bold">{getBillingCycleLabel(pdfPreviewTarget.billingCycle)}</td>
                                <td className="p-2 text-center font-sans font-bold">سنة هجرية / ميلادية ممتدة</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* 4. Dates period */}
                        <div className="space-y-2 text-right">
                          <h4 className="bg-slate-100 p-1 px-3 text-[#0D5C3A] font-black rounded text-[10.5px]">٤. فترة ونهاية العقد القانونية</h4>
                          <p className="text-[10px] text-slate-700 leading-relaxed">
                            يلتزم الطرفان بسريان العقد ابتداءً من تاريخ <strong className="font-mono text-slate-900">{pdfPreviewTarget.startDate}</strong> وحتى تاريخ <strong className="font-mono text-slate-900">{pdfPreviewTarget.endDate}</strong>، ويجدد تلقائياً ما لم يشعر الطرف الآخر برغبته في عدم التجديد بحد أدنى شهر قبل التاريخ المذكور.
                          </p>
                        </div>

                        {/* 5. Custom Notes */}
                        <div className="space-y-2 text-right">
                          <h4 className="bg-slate-100 p-1 px-3 text-[#0D5C3A] font-black rounded text-[10.5px]">٥. البنود المضافة من قبل الأطراف</h4>
                          <p className="p-2 bg-slate-50 text-[9.5px] border border-slate-200 text-slate-650 leading-relaxed font-black rounded italic">
                            {pdfPreviewTarget.notes || 'لا توجد شروط جنائية إضافية معلنة بموجب هذا الصك.'}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Bottom stamp signatures row */}
                    <div>
                      <div className="border-t-2 border-dashed border-slate-350 pt-3 grid grid-cols-3 gap-4 text-center text-[10px]">
                        <div>
                          <strong className="text-slate-500 block">توقيع الطرف الأول (المؤجر)</strong>
                          <div className="mt-2 text-blue-800 font-extrabold font-mono italic select-none">سعود النعام للضيافة ✍️</div>
                          <span className="text-[8px] text-slate-400">مختوم إلكترونياً</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 block">توثيق شبكة الإسكان الموحد</strong>
                          {/* Fake stamp symbol */}
                          <div className="mx-auto w-12 h-12 rounded-full border-4 border-double border-emerald-600 flex justify-center items-center text-emerald-600 text-[8px] font-black rotate-12 mt-1">
                            مُعتمد
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-500 block">توقيع الطرف الثاني (المستأجر)</strong>
                          <div className="mt-2 text-indigo-805 font-mono italic select-none">مصادق عليه بموجب النفاذ الموحد (أبشر) ✅</div>
                          <span className="text-[8px] text-slate-400">الجنسية: سعودي / مقيم</span>
                        </div>
                      </div>

                      {/* Footer legal credits */}
                      <div className="text-center text-[8px] text-slate-400 border-t border-slate-200 mt-4 pt-2 select-none">
                        تنويه: وثيقة عقد إيجار هذه تولد آلياً من منصة سعود النعام الرقمية بناءً على البيانات المصادق عليها، وتعامل كوثيقة رسمية منتهية السند للتنفيذ.
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
