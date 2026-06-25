import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, RefreshCw, Filter, Search, ShieldAlert,
  Clock, Server, Terminal, User, FileSpreadsheet, Trash2, CheckCircle, AlertTriangle
} from 'lucide-react';
import { AuditLog, UserRole } from '../../types';

interface AuditLogsManagerProps {
  onTriggerAction: (title: string, desc: string) => void;
  theme?: 'light' | 'dark';
}

export default function AuditLogsManager({ onTriggerAction, theme = 'dark' }: AuditLogsManagerProps) {
  const isLight = theme === 'light';
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to load audit logs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleManualReset = async () => {
    onTriggerAction('تحديث فوري للسجلات', 'يتم سحب وتدقيق كافة التوقيعات الرقمية للعمليات من الخادم العقاري الموحد');
    fetchAuditLogs();
  };

  // Roles label dictionary in Arabic
  const roleLabels: Record<string, string> = {
    super_admin: 'مدير عام المجموعة',
    property_manager: 'مدير الأملاك العقارية',
    accountant: 'محاسب مالي معتمد',
    tenant: 'مستأجر عقاري',
    owner: 'مستثمر ومالك عقاري',
    maintenance_staff: 'طاقم صيانة وتفتيش',
    system: 'النظام الذكي'
  };

  const statusColors = isLight ? {
    SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-200'
  } : {
    SUCCESS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    WARNING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const statusIcons = {
    SUCCESS: <CheckCircle className="h-3.5 w-3.5" />,
    WARNING: <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />,
    FAILED: <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
  };

  // Perform search & filters on client-side
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || log.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'all' || log.status === selectedStatusFilter;
    const matchesAction = selectedActionFilter === 'all' || log.action === selectedActionFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesAction;
  });

  // Extract all unique actions in the database for dropdown
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div className="space-y-6 text-right">
      
      {/* Upper header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
        <div className="flex items-center gap-3 justify-end flex-row-reverse">
          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-red-950/40 border-red-900/40 text-red-400'}`}>
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <h2 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>سجل العمليات والتدقيق الأمني العام (Audit Logs) 🔒</h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              مراقبة متكاملة لامتيازات الدخول، وإجراءات الموظفين والملاك، اعتراضات جدار الحماية Middleware في الخادم بالوقت الحقيقي.
            </p>
          </div>
        </div>

        <button
          onClick={handleManualReset}
          disabled={loading}
          className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-white'}`}
        >
          {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          <span>تحديث السجل الفوري</span>
        </button>
      </div>

      {/* Metrics overview widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-2xl flex flex-col justify-between border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800/80'}`}>
          <span className="text-[10px] text-slate-500 font-extrabold pb-1">إجمالي العمليات المسجلة</span>
          <div className="flex justify-between items-baseline">
            <span className={`font-mono text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{logs.length}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isLight ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-green-950/30 text-green-400 border border-green-900/20'}`}>تأمين تام ✓</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl flex flex-col justify-between border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800/80'}`}>
          <span className="text-[10px] text-slate-500 font-extrabold pb-1">اعتراضات محاولات الدخول الـ Middleware</span>
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-2xl font-black text-amber-650">
              {logs.filter(l => l.action === 'TAB_ACCESS_BLOCKED').length}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isLight ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-yellow-950/30 text-yellow-400 border border-yellow-900/20'}`}>اعتراض آمن</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl flex flex-col justify-between border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800/80'}`}>
          <span className="text-[10px] text-slate-500 font-extrabold pb-1">محاولات تسجيل دخول غير معتمدة</span>
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-2xl font-black text-rose-600">
              {logs.filter(l => l.action === 'LOGIN_FAILED').length}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isLight ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-red-950/30 text-red-400 border border-red-900/20'}`}>محجوب 🛡️</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl flex flex-col justify-between border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800/80'}`}>
          <span className="text-[10px] text-slate-500 font-extrabold pb-1">متوسط العمليات لكل مستخدم</span>
          <div className="flex justify-between items-baseline">
            <span className={`font-mono text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {(logs.length / (logs.length > 0 ? Array.from(new Set(logs.map(l => l.userId))).length : 1)).toFixed(1)}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">سجل التدقيق</span>
          </div>
        </div>

      </div>

      {/* Filter Options */}
      <div className={`p-4 border rounded-2xl space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/30 border-slate-800/50'}`}>
        <div className="flex justify-between items-center text-xs pr-1">
          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>أدوات تحجيم وفرز السجلات (Security Filter Rail)</span>
          <Filter className="h-4 w-4 text-slate-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-3 pr-10 py-2.5 rounded-xl text-xs outline-none border focus:border-red-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-650'}`}
              placeholder="ابحث بالاسم، الحركية، التفاصيل..."
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer text-right outline-none border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
          >
            <option value="all">كل الأدوار الوظيفية</option>
            <option value="super_admin">مدير عام المجموعة</option>
            <option value="property_manager">مدير أملاك</option>
            <option value="accountant">محاسب</option>
            <option value="tenant">مستأجر</option>
            <option value="owner">مستثمر</option>
            <option value="maintenance_staff">طاقم صيانة</option>
          </select>

          {/* Action Filter */}
          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer text-right outline-none border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
          >
            <option value="all">كل تصنيفات العمليات</option>
            {uniqueActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer text-right outline-none border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
          >
            <option value="all">كل درجات التنبيه</option>
            <option value="SUCCESS">ناجحة (SUCCESS)</option>
            <option value="WARNING">مشبوهة/اعتراض (WARNING)</option>
            <option value="FAILED">فاشلة (FAILED)</option>
          </select>

        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-2xl border overflow-hidden ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/40 border-slate-800/80'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b font-sans ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>
                <th className="py-3 px-4 text-right font-extrabold">توقيت العملية ⏱️</th>
                <th className="py-3 px-4 text-right font-extrabold">المستخدم والبريد</th>
                <th className="py-3 px-4 text-right font-extrabold">الدور الوظيفي</th>
                <th className="py-3 px-4 text-center font-extrabold">الحدث (Action)</th>
                <th className="py-3 px-4 text-right font-extrabold">الوصف والأثر الرياضي</th>
                <th className="py-3 px-4 text-center font-extrabold">تنبيه الأمن</th>
                <th className="py-3 px-4 text-right font-extrabold font-mono">الـ IP المعتمد</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-850'}`}>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-semibold leading-relaxed">
                    لا يوجد أي سجلات تطابق عوامل البحث والفلترة المحددة في النظام.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50/50 text-slate-800' : 'hover:bg-slate-900/35 text-slate-300'}`}>
                    
                    {/* Timestamp */}
                    <td className={`py-3.5 px-4 font-mono text-[10.5px] whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(log.timestamp).toLocaleDateString('ar-SA')} - {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex flex-col">
                        <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{log.userName}</span>
                        <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{log.userEmail}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 pr-3.5">
                      <span className={`text-[9.5px] font-bold tracking-tight px-2 py-0.5 rounded border whitespace-nowrap ${isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        {roleLabels[log.role] || log.role}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded border inline-block font-black ${isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-900 text-yellow-500 border-slate-800'}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-3 max-w-[260px] md:max-w-xs text-right leading-relaxed pr-3">
                      {log.details}
                    </td>

                    {/* Severity status */}
                    <td className="py-3.5 px-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 border rounded-full text-[9px] font-bold ${statusColors[log.status]}`}>
                        {statusIcons[log.status]}
                        <span>{log.status}</span>
                      </div>
                    </td>

                    {/* IP and browser info */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-left">
                      <div className="flex flex-col">
                        <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{log.ipAddress}</span>
                        <span className="text-[9px] text-[8px] text-slate-400 truncate max-w-[100px]" title={log.userAgent}>
                          {log.userAgent}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
