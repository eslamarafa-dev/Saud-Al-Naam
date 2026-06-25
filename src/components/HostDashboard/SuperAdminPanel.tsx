/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, ShieldCheck, ShieldAlert, Key, Settings, CreditCard, DollarSign, 
  Terminal, BarChart2, Cpu, Activity, Database, RefreshCw, UserCheck, UserX, 
  UserPlus, CheckCircle, AlertTriangle, Play, HelpCircle, HardDrive, Lock, 
  Unlock, Save, Eye, Search, AlertCircle, Plus, Trash2, Edit2, Calendar
} from 'lucide-react';

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  registeredAt: string;
  lastLoginAt?: string;
  status?: 'active' | 'suspended';
}

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  userAgent: string;
}

interface SystemSettings {
  maintenanceMode: boolean;
  vatRate: number;
  tokenEjariLive: string;
  certificationVatCode: string;
  databaseRetentionDays: number;
  debugMode: boolean;
  zatcaStatus: 'active' | 'inactive';
  allowSelfRegistration: boolean;
  backupIntervalHours: number;
}

interface Subscription {
  id: string;
  orgName: string;
  ownerEmail: string;
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'trialing';
  price: number;
  activeUnitsCount: number;
  renewalDate: string;
  registeredAt: string;
}

interface SuperAdminPanelProps {
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function SuperAdminPanel({ theme, onTriggerAction }: SuperAdminPanelProps) {
  // Navigation inside panel
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'billing' | 'subscriptions' | 'settings' | 'audit' | 'analytics'>('analytics');

  // Backend state
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    vatRate: 15,
    tokenEjariLive: 'JWT_TOKEN_EJARI_LIVE_9824',
    certificationVatCode: 'CERT_STAGE_PRODUCTION_SaudiVat',
    databaseRetentionDays: 90,
    debugMode: true,
    zatcaStatus: 'active',
    allowSelfRegistration: true,
    backupIntervalHours: 24
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  // Input templates and UI states
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'property_manager',
    password: 'Password123'
  });

  // Role permissions allocation matrix state
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, string[]>>({
    super_admin: ['view_dashboards', 'edit_units', 'issue_invoices', 'configure_settings', 'view_audit_logs', 'manage_saas_billing'],
    property_manager: ['view_dashboards', 'edit_units', 'issue_invoices', 'view_audit_logs'],
    accountant: ['view_dashboards', 'issue_invoices', 'manage_saas_billing'],
    tenant: ['view_dashboards'],
    owner: ['view_dashboards'],
    maintenance_staff: ['view_dashboards']
  });

  // Subscription control edit modal state
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // Load backend Admin parameters of all entities
  const loadAdminState = async () => {
    setLoading(true);
    try {
      // 1. Load basic DB config
      const res = await fetch('/api/db');
      if (res.ok) {
        const db = await res.json();
        if (db.users) {
          // Add status is not defined
          const formatted = db.users.map((u: any) => ({
            ...u,
            status: u.status || 'active'
          }));
          setUsers(formatted);
        }
        if (db.auditLogs) setAuditLogs(db.auditLogs);
      }

      // 2. Load SaaS administrative variables from Express endpoints
      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSystemSettings(data);
      }

      const subsRes = await fetch('/api/admin/subscriptions');
      if (subsRes.ok) {
        const data = await subsRes.json();
        setSubscriptions(data);
      }

      const permRes = await fetch('/api/admin/permissions');
      if (permRes.ok) {
        const data = await permRes.json();
        setPermissionsMatrix(data);
      }
    } catch (e) {
      console.warn("Failed to retrieve operational super-admin info. Simulating default fallback values", e);
      simulatePremiumSeeds();
    } finally {
      setLoading(false);
    }
  };

  const simulatePremiumSeeds = () => {
    // Standard secure fallback mocks in case backend is offline
    setUsers([
      { id: "usr-admin", fullName: "عبدالرحمن الحربي", email: "admin@naam.com", phone: "+966500000001", role: "super_admin", isEmailVerified: true, registeredAt: "2026-01-01T12:00:00Z", lastLoginAt: "2026-06-22T21:05:00Z", status: 'active' },
      { id: "usr-manager", fullName: "خالد الشمري", email: "manager@naam.com", phone: "+966500000002", role: "property_manager", isEmailVerified: true, registeredAt: "2026-01-05T09:30:00Z", lastLoginAt: "2026-06-22T19:22:00Z", status: 'active' },
      { id: "usr-acc", fullName: "سليمان الحصين", email: "accountant@naam.com", phone: "+966500000003", role: "accountant", isEmailVerified: true, registeredAt: "2026-01-10T14:15:00Z", lastLoginAt: "2026-06-21T11:00:00Z", status: 'active' },
      { id: "usr-tenant", fullName: "فهد العتيبي", email: "tenant@naam.com", phone: "+966500000004", role: "tenant", isEmailVerified: true, registeredAt: "2026-01-15T16:00:00Z", lastLoginAt: "2026-06-20T22:35:00Z", status: 'suspended' },
      { id: "usr-owner", fullName: "رائد الماجد", email: "owner@naam.com", phone: "+966500000005", role: "owner", isEmailVerified: true, registeredAt: "2026-01-20T10:00:00Z", lastLoginAt: "2026-06-22T08:12:00Z", status: 'active' }
    ]);

    setSubscriptions([
      { id: "sub-1", orgName: "مجموعة نما العقارية المحدودة", ownerEmail: "info@nama.sa", plan: "premium", status: "active", price: 499, activeUnitsCount: 142, renewalDate: "2026-07-01", registeredAt: "2025-06-01" },
      { id: "sub-2", orgName: "شركة ثبات للاستثمار والتطوير", ownerEmail: "ceo@thabat.sa", plan: "enterprise", status: "active", price: 1499, activeUnitsCount: 512, renewalDate: "2026-08-15", registeredAt: "2025-08-15" },
      { id: "sub-3", orgName: "عقارات الرياض والبلد", ownerEmail: "riyadh@realestate.sa", plan: "free", status: "trialing", price: 0, activeUnitsCount: 8, renewalDate: "2026-07-10", registeredAt: "2026-06-10" },
      { id: "sub-4", orgName: "شركة نجد للتمليك السكني", ownerEmail: "najd@owners.sa", plan: "premium", status: "suspended", price: 499, activeUnitsCount: 85, renewalDate: "2026-06-05", registeredAt: "2025-12-05" }
    ]);
  };

  useEffect(() => {
    loadAdminState();
  }, []);

  // Update System Settings on backend or offline fallback
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemSettings)
      });
      if (res.ok) {
        onTriggerAction('حفظ إعدادات منصة SaaS ⚙️', 'تم مزامنة الثوابت الفنية ومحددات الحماية بنجاح مع قاعدة البيانات الموحدة للمنصة.');
      } else {
        // Direct storage fallback
        localStorage.setItem('saas_system_settings', JSON.stringify(systemSettings));
        onTriggerAction('مزامنة إعدادات المنصة محلياً 💾', 'تم ترحيل محددات الإعدادات والضريبة 15% وحالة ZATCA محلياً مع المتصفح.');
      }
    } catch {
      localStorage.setItem('saas_system_settings', JSON.stringify(systemSettings));
      onTriggerAction('مزامنة إعدادات المنصة محلياً 💾', 'تم ترحيل محددات الإعدادات والضريبة 15% وحالة ZATCA محلياً مع المتصفح.');
    }
  };

  // User Administration callbacks
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      
      const refreshedUsers = users.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u);
      setUsers(refreshedUsers);
      
      const targetUser = users.find(u => u.id === userId);
      if (nextStatus === 'suspended') {
        onTriggerAction('حظر مستخدم وسحب الصلاحية 🚫', `تم حظر وصول المستخدم ${targetUser?.fullName} من المنصة فوراً وجاري حرق الـ JWT.`);
      } else {
        onTriggerAction('تنشيط متبقي رخص الدخول ✓', `تم استعادة وتنشيط حساب المستخدم ${targetUser?.fullName} وتوفير امتيازات صك الإيجار.`);
      }
    } catch (err) {
      // Local apply
      const refreshedUsers = users.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u);
      setUsers(refreshedUsers);
      const targetUser = users.find(u => u.id === userId);
      onTriggerAction(
        nextStatus === 'suspended' ? 'حظر دخول محلي 🚫' : 'تنشيط مستخدم محلي ✓',
        `تم تعديل رخصة ${targetUser?.fullName} بنجاح في مصفوفة المتصفح.`
      );
    }
  };

  // Change user role on the fly
  const handleChangeUserRole = async (userId: string, nextRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      
      const refreshedUsers = users.map(u => u.id === userId ? { ...u, role: nextRole as any } : u);
      setUsers(refreshedUsers);
      const targetUser = users.find(u => u.id === userId);
      onTriggerAction('تعديل الرتبة والمنصب الهيكلي 🔑', `تم تغيير دور ${targetUser?.fullName} إلى [${getRoleLabelAr(nextRole)}] فوراً.`);
    } catch {
      const refreshedUsers = users.map(u => u.id === userId ? { ...u, role: nextRole as any } : u);
      setUsers(refreshedUsers);
      const targetUser = users.find(u => u.id === userId);
      onTriggerAction('تحديث امتيازات الرتبة محلياً 🔑', `تم تحويل رتبة ${targetUser?.fullName} محلياً.`);
    }
  };

  // Admin Create New User form submission
  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email || !newUserForm.phone) {
      onTriggerAction('تنبيه التدقيق ⚠️', 'يرجى تقديم كافة البيانات؛ الاسم الثلاثي، البريد، وتأمين رقم الهاتف الموحد.');
      return;
    }

    const payload = {
      ...newUserForm,
      id: 'usr-' + Date.now(),
      registeredAt: new Date().toISOString(),
      isEmailVerified: true,
      status: 'active'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          password: payload.password
        })
      });
      
      if (res.ok) {
        setUsers([payload as any, ...users]);
        onTriggerAction('تأسيس حساب مستخدم جديد 👤', `تم خلق رول إداري جديد للمكلف ${payload.fullName} وتعيينه رتبة ${getRoleLabelAr(payload.role)}.`);
        setIsNewUserModalOpen(false);
      } else {
        const errData = await res.json();
        onTriggerAction('تأسيس حساب ⚠️', errData.error || 'فشلت الإضافة لمطابقة حساب قائم بالفعل.');
      }
    } catch {
      // Local fallback
      setUsers([payload as any, ...users]);
      onTriggerAction('تأسيس حساب مستخدم محلي 👤', `تم تسجيل ${payload.fullName} بنجاح في قاعدة بيانات المتصفح الإدارية.`);
      setIsNewUserModalOpen(false);
    }
  };

  // Subscriptions updates callback
  const handleUpdateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const updated = subscriptions.map(s => s.id === editingSub.id ? editingSub : s);
    setSubscriptions(updated);
    onTriggerAction('تعديل مسار الاشتراك المالي 💳', `تم تحديث خطة مستند ${editingSub.orgName} إلى الخطة [${editingSub.plan.toUpperCase()}] وترخيصها.`);
    setEditingSub(null);
  };

  // Direct toggle for Role permissions checkable matrix
  const handleTogglePermission = async (role: string, permKey: string) => {
    const isAssigned = permissionsMatrix[role]?.includes(permKey);
    let nextPerms = [];
    if (isAssigned) {
      nextPerms = permissionsMatrix[role].filter(p => p !== permKey);
    } else {
      nextPerms = [...(permissionsMatrix[role] || []), permKey];
    }

    const updatedMatrix = {
      ...permissionsMatrix,
      [role]: nextPerms
    };

    setPermissionsMatrix(updatedMatrix);

    try {
      await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMatrix)
      });
      onTriggerAction('صيانة مصفوفة الامتيازات (RBAC) 🛡️', `تم تعديل الصلاحية [${permKey}] للرتبة [${getRoleLabelAr(role)}] في جدار الحماية.`);
    } catch {
      onTriggerAction('صيانة مصفوفة الصلاحيات (محلي) 🛡️', `تم توثيق الامتياز الجديد محلياً بالذاكرة الموقتة.`);
    }
  };

  // Arabic labels and decorators helper dictionaries
  const getRoleLabelAr = (roleName: string) => {
    const roles: Record<string, string> = {
      super_admin: 'مدير عام المجموعة ⭐',
      property_manager: 'مدير الأملاك والمنشآت',
      accountant: 'المحاسب المالي المفتش',
      tenant: 'المستأجر السكني',
      owner: 'المالك والمستثمر العقاري',
      maintenance_staff: 'طاقم تفتيش وصيانة'
    };
    return roles[roleName] || roleName;
  };

  const getPlanBadgeStyle = (plan: string) => {
    switch(plan) {
      case 'enterprise': return 'bg-purple-950/40 text-purple-400 border border-purple-900/30 font-black';
      case 'premium': return 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/30';
      default: return 'bg-slate-900 text-slate-400 border border-slate-800';
    }
  };

  const isDark = theme === 'dark';

  // Computed platform statistics
  const totalSubscribersMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0);

  const activeTenantDensityPct = Math.min(100, Math.round((users.filter(u => u.status === 'active').length / (users.length || 1)) * 100));

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Group header section */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-5 border-b border-slate-850/60">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-row-reverse justify-end">
            <span className="bg-red-950/50 text-red-500 text-[9.5px] font-black tracking-widest px-2.5 py-0.5 rounded-full border border-red-900/30 animate-pulse">
              غرفة السيطرة الفنية والـ SaaS
            </span>
            <span className="text-slate-405 text-xs">|</span>
            <span className="text-slate-400 text-xs font-mono">SAUDI-REAL-SaaS-S1</span>
          </div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 flex-row-reverse`}>
            <span>لوحة تحكم المشرف العام والـ Super Admin</span>
            <ShieldCheck className="h-6.5 w-6.5 text-[#00E676]" />
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-bold">
            مراقبة الحسابات، إدارة رخص الاشتراكات وعمليات تسوية الفواتير المالية للملاك والمستأجرين، لوائح الرقابة وحماية النظام ومطابقة ZATCA.
          </p>
        </div>

        {/* Refresh core button */}
        <button
          onClick={loadAdminState}
          className="px-4 py-2.5 bg-[#1E40AF] hover:bg-[#153185] text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start lg:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تزامن وتدقيق الحالة الشاملة</span>
        </button>
      </div>

      {/* Primary KPI Grid dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Subscriptions Monthly recurring revenue */}
        <div className={`p-5 rounded-[24px] border uppercase ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-emerald-950/40 text-emerald-400 rounded-xl border border-emerald-900">
              <DollarSign className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest">مجموع الإيراد الشهري المكرر (MRR)</span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {totalSubscribersMRR.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">ر.س / شهرياً</span>
          </div>
        </div>

        {/* Stat 2: Active User density */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-purple-950/40 text-purple-400 rounded-xl border border-purple-900">
              <Users className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest">إجمالي الحسابات المسجلة بالخدمة</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{users.length}</span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">حساب مستخدم عقاري</span>
          </div>
        </div>

        {/* Stat 3: CPU Metrics */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-cyan-950/40 text-cyan-400 rounded-xl border border-cyan-900">
              <Cpu className="h-4 w-4 animate-pulse" />
            </span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest">جهد الخادم السحابي وصحة السيرفر</span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-cyan-300">14.2%</span>
            <span className="text-[9px] text-[#00E676] font-bold mr-1 font-sans">تأمين مستقر ✓</span>
          </div>
        </div>

        {/* Stat 4: Database connections */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-blue-900/10 text-blue-400 rounded-xl border border-blue-900/30">
              <Database className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest">حجم وقنوات الربط النشطة بالصالة</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>38</span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">اتصال نشط بالـ Pool</span>
          </div>
        </div>

      </div>

      {/* Navigation Subtabs Menu */}
      <div className={`p-2 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} flex flex-wrap gap-1 items-center justify-start`}>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'analytics' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>📊 تحليلات و تلميحات منصة SaaS</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>👤 إدارة وتفعيل المستخدمين ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'roles' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="h-3.5 w-3.5 text-purple-400" />
          <span>🛡️ مصفوفة رخص الصلاحيات (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'subscriptions' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="h-3.5 w-3.5 text-pink-400" />
          <span>💳 إدارات تراخيص اشتراكات SaaS</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'billing' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5 text-[#00e676]" />
          <span>🧾 فواتير تسوية منصات الملاك</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="h-3.5 w-3.5 text-yellow-500" />
          <span>⚙️ إعدادات النواة والفيدرالية</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'audit' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/40' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="h-3.5 w-3.5 text-red-400" />
          <span>🔒 التدقيق المفتش الأمني ({auditLogs.length})</span>
        </button>

      </div>

      {/* CORE ACTIVE TAB SCREENS */}

      {/* Tab: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Internal Analytics Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Simulated MRR Performance */}
            <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} text-right`}>
              <h3 className="text-xs font-extrabold text-[#00E676] mb-1">نمو الإيرادات المتكررة (SaaS Monthly Recurring Revenue)</h3>
              <p className="text-[10px] text-slate-400 mb-4">كشف إحصائي بنسب الصعود والانضمام للملاك الجدد عبر عقود الاشتراك الفئوية.</p>
              
              {/* Dynamic SVG Sparkline Graph */}
              <div className="h-44 flex items-end justify-between font-mono gap-1 pt-6 text-[10px] text-slate-400 relative">
                <div className="absolute right-0 top-0 text-slate-500 text-[9px] font-sans">خط الاتجاه بالريال الربع سنوي</div>
                
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-slate-900 hover:bg-blue-900/30 border border-slate-850 rounded-lg flex items-end justify-center min-h-[40px] relative group" style={{ height: '30%' }}>
                    <div className="absolute -top-6 bg-slate-950 text-white px-2 py-0.5 rounded text-[8.5px] scale-0 group-hover:scale-100 transition-all font-bold">1,200 ر.س</div>
                  </div>
                  <span className="mt-2 text-[9px]">مارس</span>
                </div>

                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-slate-900 hover:bg-blue-900/30 border border-slate-850 rounded-lg flex items-end justify-center min-h-[40px] relative group" style={{ height: '50%' }}>
                    <div className="absolute -top-6 bg-slate-950 text-white px-2 py-0.5 rounded text-[8.5px] scale-0 group-hover:scale-100 transition-all font-bold">1,996-ر.س</div>
                  </div>
                  <span className="mt-2 text-[9px]">أبريل</span>
                </div>

                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-slate-900 hover:bg-blue-900/30 border border-slate-850 rounded-lg flex items-end justify-center min-h-[40px] relative group" style={{ height: '75%' }}>
                    <div className="absolute -top-6 bg-slate-950 text-white px-2 py-0.5 rounded text-[8.5px] scale-0 group-hover:scale-100 transition-all font-bold">2,497 ر.س</div>
                  </div>
                  <span className="mt-2 text-[9px]">مايو</span>
                </div>

                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-[#1E40AF]/30 hover:bg-[#1E40AF]/50 border border-blue-900 rounded-lg flex items-end justify-center min-h-[40px] relative group" style={{ height: '90%' }}>
                    <div className="absolute -top-6 bg-slate-950 text-emerald-400 px-2 py-0.5 rounded text-[8.5px] scale-0 group-hover:scale-100 transition-all font-bold">2,497+ ر.س</div>
                  </div>
                  <span className="mt-2 text-[9px] font-black text-cyan-400">يونيو (اليوم)</span>
                </div>

              </div>
            </div>

            {/* Chart 2: Telemetry Server Health */}
            <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} text-right`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] bg-red-950/40 text-rose-500 border border-red-900 px-2 py-0.5 rounded-xl font-bold">معدل الخطأ: 0.01%</span>
                <h3 className="text-xs font-extrabold text-cyan-400">مراقب الموارد وتحميل الخادم (Real-time Telemetry Status)</h3>
              </div>
              <p className="text-[10px] text-slate-400 mb-4">تحليل استجابات الخادم، وزمن الاستدعاء لطلبات ZATCA الضريبية والـ API بالخادم بالملي ثانية.</p>
              
              <div className="h-44 flex items-end justify-between font-mono gap-1 pt-6 text-[10px] text-slate-400 relative">
                <div className="absolute right-0 top-0 text-slate-500 text-[9px] font-sans">زمن الاستجابة: <span className="text-cyan-400">18ms</span></div>
                
                {/* SVG wave effect simulator */}
                <div className="w-full h-full flex items-end justify-between">
                  <div className="w-full h-1/2 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 80 Q 50 10, 100 70 T 200 40 T 300 80 T 400 30 L 400 100 L 0 100 Z" fill="url(#cyan-gradient)" stroke="#22d3ee" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Micro Telemetry Widget blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
              <div className="flex justify-between items-center flex-row-reverse">
                <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                <span className="text-xs font-bold text-slate-300">توافر Ejari API Live Connection</span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xl font-black text-white">99.98%</span>
                <span className="text-[9.5px] text-emerald-400 font-extrabold">مستقر ومتصل ✓</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
              <div className="flex justify-between items-center flex-row-reverse">
                <ShieldCheck className="h-4 w-4 text-[#00E676]" />
                <span className="text-xs font-bold text-slate-300">شهادات الأمان والتوقيع الرقمي Cryptographic STAMP</span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xl font-black text-white">100% صالحة</span>
                <span className="text-[9.5px] text-yellow-500 font-extrabold">تجديد في سبتمبر 2026</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
              <div className="flex justify-between items-center flex-row-reverse">
                <Activity className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-300">أداء الجلب الفوري والاستهلاك الفئوي للذاكرة</span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xl font-black text-white">2.44 GB / 8 GB</span>
                <span className="text-[9.5px] text-slate-400">تأمين حجز مساحة</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* List tools */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="البحث بالاسم، بريد المستخدم الموثق..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className={`w-full pr-10 pl-4 py-3 rounded-xl text-xs font-bold ${
                  isDark 
                    ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-750' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-450 focus:border-slate-350'
                } border focus:outline-none transition-all`}
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-205 text-slate-800'
                } border focus:outline-none`}
              >
                <option value="all">كل الرتب والوظائف 🛡️</option>
                <option value="super_admin">مدير عام المجموعة</option>
                <option value="property_manager">مدير الأملاك العقارية</option>
                <option value="accountant">محاسب مالي معتمد</option>
                <option value="tenant">مستأجر عقاري</option>
                <option value="owner">مالك ومستثمر عقاري</option>
                <option value="maintenance_staff">طاقم صيانة وتفتيش</option>
              </select>

              <button
                onClick={() => setIsNewUserModalOpen(true)}
                className="bg-[#1E40AF] hover:bg-[#153185] text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>إضافة وتعيين مستخدم إضافي</span>
              </button>
            </div>

          </div>

          {/* Table display */}
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} overflow-x-auto`}>
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/10 font-bold">
                  <th className="pb-3 text-right">الاسم الكامل / الرتبة</th>
                  <th className="pb-3 text-right">البريد الإلكتروني الموثق</th>
                  <th className="pb-3 text-right">رقم الهاتف</th>
                  <th className="pb-3 text-center">حالة الحساب</th>
                  <th className="pb-3 text-left">امتياز الرتبة</th>
                  <th className="pb-3 text-left">التأمين والإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 font-medium text-slate-300">
                {users
                  .filter(u => {
                    const matchesSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
                                          u.email.toLowerCase().includes(userSearch.toLowerCase());
                    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map(u => (
                    <tr key={u.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 text-right">
                        <span className="font-extrabold block text-white">{u.fullName}</span>
                        <span className="text-[10px] text-slate-550 block mt-0.5">{getRoleLabelAr(u.role)}</span>
                      </td>
                      <td className="py-3.5 text-right font-mono text-[11px] text-slate-400">{u.email}</td>
                      <td className="py-3.5 text-right font-mono text-[11px] text-slate-400">{u.phone}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                          u.status === 'suspended' ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-990'
                        }`}>
                          {u.status === 'suspended' ? 'محظور / معلق 🚫' : 'نشط ومعلق بالصلاحية✓'}
                        </span>
                      </td>
                      <td className="py-3.5 text-left font-sans">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold ${
                            isDark ? 'bg-[#020617] text-white border-slate-800' : 'bg-slate-50 text-slate-800 border-slate-200'
                          } border focus:outline-none`}
                        >
                          <option value="super_admin">مدير عام المجموعة</option>
                          <option value="property_manager">مدير الأملاك العقارية</option>
                          <option value="accountant">محاسب مالي معتمد</option>
                          <option value="tenant">مستأجر عقاري</option>
                          <option value="owner">مستثمر ومالك عقاري</option>
                          <option value="maintenance_staff">طاقم صيانة وتفتيش</option>
                        </select>
                      </td>
                      <td className="py-3.5 text-left font-sans">
                        <div className="flex gap-1 items-center justify-end">
                          {u.status === 'suspended' ? (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, 'suspended')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <UserCheck className="h-3 w-3" />
                              <span>فك الحظر وإرجاع الرخص</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, 'active')}
                              className="px-2.5 py-1.5 bg-rose-950 text-rose-400 hover:bg-rose-900 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              disabled={u.id === 'usr-admin'} // prevent self suspension
                            >
                              <UserX className="h-3 w-3" />
                              <span>حظر وسحب الرخص</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab: Role Management & Permission Matrix */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex justify-between items-center flex-row-reverse">
              <Shield className="h-5 w-5 text-purple-400" />
              <h3 className="font-extrabold text-xs text-slate-300">مصفوفة التحكم بصلاحات الرول الهيكيلية (Global Access Permission Matrix)</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تصفية التحكم في السحابة على مستوى مسارات الاستدعاء المالي، تهيئة الرقابة الهيكلية، تصفية الدخول أو اعتراضها لفرض قواعد الحماية. قم بالنقر على المربعات لتحديد مسار التنشيط الفوري للرول.
            </p>

            <div className="overflow-x-auto overflow-y-hidden pt-4">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/20 font-bold text-center">
                    <th className="pb-3 text-right">رول المستخدم الهيكلي</th>
                    <th className="pb-3">عرض لوحات الأداء وميزان الإشغال</th>
                    <th className="pb-3">إقامات وتفريغ تفاصيل الوحدات المادية</th>
                    <th className="pb-3">إبرام وتعديل صكوك الفواتير الضريبية</th>
                    <th className="pb-3">إدارات مسارات السداد والـ SaaS البنكي</th>
                    <th className="pb-3">تسيير مصفوفات الإعدادات والضريبة العالمية</th>
                    <th className="pb-3">تدقيق وقراءة كشوف الـ Dynamic Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10 font-bold text-slate-300 text-center">
                  {Object.keys(permissionsMatrix).map(role => (
                    <tr key={role} className="hover:bg-slate-900/10">
                      <td className="py-4 text-right">
                        <span className="font-black text-white">{getRoleLabelAr(role)}</span>
                        <span className="text-[9.5px] font-mono text-slate-500 block mt-0.5">{role}</span>
                      </td>

                      {/* Permission View Dashboards */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('view_dashboards')}
                          onChange={() => handleTogglePermission(role, 'view_dashboards')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                      {/* Permission Edit Units */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('edit_units')}
                          onChange={() => handleTogglePermission(role, 'edit_units')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                      {/* Permission Issue Invoices */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('issue_invoices')}
                          onChange={() => handleTogglePermission(role, 'issue_invoices')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                      {/* Permission SaaS Billing */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('manage_saas_billing')}
                          onChange={() => handleTogglePermission(role, 'manage_saas_billing')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                      {/* Permission Configure Settings */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('configure_settings')}
                          onChange={() => handleTogglePermission(role, 'configure_settings')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                      {/* Permission View Audit Logs */}
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role]?.includes('view_audit_logs')}
                          onChange={() => handleTogglePermission(role, 'view_audit_logs')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-800 bg-[#020617] cursor-pointer"
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center text-xs">
            <h4 className="font-extrabold text-slate-400">تراخيص اشتراكات الملاك المبرمة بالبوابة</h4>
            <div className={`p-2 rounded-xl bg-[#00E676]/5 text-emerald-400 border border-[#00E676]/20`}>
              مجموع الإيراد الشهري المكرر الكلي: <span className="font-mono font-black">{totalSubscribersMRR} ر.س</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map(sub => (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}
              >
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] ${getPlanBadgeStyle(sub.plan)}`}>
                    الخطة: {sub.plan.toUpperCase()}
                  </span>
                  <div>
                    <span className="font-black text-sm text-white block">{sub.orgName}</span>
                    <span className="text-[10px] text-slate-550 block font-mono mt-0.5">{sub.ownerEmail}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs py-3 border-y border-slate-800/10">
                  <div>
                    <span className="text-slate-500 block mb-0.5">الحالة الأمنية</span>
                    <span className={`font-black ${sub.status === 'active' ? 'text-emerald-450' : 'text-rose-500'}`}>
                      {sub.status === 'active' ? 'فعال ومفعل ✓' : 'معطل لالتزام السداد ⚠️'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">عدد الوحدات الخاضعة للإشغالات</span>
                    <span className="text-white font-mono font-black">{sub.activeUnitsCount} وحدة عقارية</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">تاريخ ميعاد التجديد القادم</span>
                    <span className="text-slate-350 font-mono">{sub.renewalDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">سعر خطة الفوترة الدورية</span>
                    <span className="text-slate-350 font-mono font-black">{sub.price} ر.س / شهرياً</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end items-center">
                  <button
                    onClick={() => setEditingSub(sub)}
                    className="px-3 py-1.5 bg-blue-900/20 text-blue-450 hover:bg-blue-900/40 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    تعديل خطة وإجراء السداد
                  </button>
                  <button
                    onClick={() => {
                      const updated = subscriptions.map(s => s.id === sub.id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' as any } : s);
                      setSubscriptions(updated);
                      onTriggerAction('حظر وتوقيف ترخيص خطة 💳', `تم تعديل حالة رخصة ترخيص منصة ${sub.orgName} بنجاح.`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      sub.status === 'active' ? 'bg-red-950 text-red-400 hover:bg-red-900/40' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900/40'
                    }`}
                  >
                    {sub.status === 'active' ? 'إيقاف وتعطيل الترخيص' : 'تحرير خط السداد وتنشيط'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab: Billing */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex justify-between items-center flex-row-reverse">
              <DollarSign className="h-5 w-5 text-[#00e676]" />
              <h3 className="font-extrabold text-xs text-slate-300">سجل المدفوعات والفواتير المتبادلة للملاك (SaaS Invoicing Hub)</h3>
            </div>
            <p className="text-[11px] text-slate-400">إقرار إيصالات الدفع والودائع وتصديرها لدائرة الحسابات العامة بالشركة لمتابعة رصيد المستوطنات.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/20 font-bold">
                    <th className="pb-3 text-right">رقم الفاتورة الموحد</th>
                    <th className="pb-3 text-right font-bold text-slate-300">شركة الملاك المفوترة</th>
                    <th className="pb-3 text-right">قيمة الاشتراك ر.س</th>
                    <th className="pb-3 text-right">الضريبة المفروضة 15%</th>
                    <th className="pb-3 text-right text-emerald-450">إجمالي السند المالي القائم</th>
                    <th className="pb-3 text-center">بوابة mada للحوالات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10 font-medium text-slate-300">
                  {subscriptions.map((sub, i) => {
                    const vat = Math.round(sub.price * 0.15);
                    const total = sub.price + vat;
                    return (
                      <tr key={sub.id} className="hover:bg-slate-900/10">
                        <td className="py-3.5 text-right font-mono font-bold text-cyan-400">INV-SAAS-2026-{9000 + i}</td>
                        <td className="py-3.5 text-right font-bold text-white">{sub.orgName}</td>
                        <td className="py-3.5 text-right font-mono text-slate-300">{sub.price} ر.س</td>
                        <td className="py-3.5 text-right font-mono text-slate-400">{vat} ر.س</td>
                        <td className="py-3.5 text-right font-mono text-emerald-450 font-black">{total} ر.س</td>
                        <td className="py-3.5 text-center font-sans text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-blue-900/20 text-cyan-400 border border-blue-900/30 font-bold">
                            مدى mada تسوية بنكية
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Tab: System Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          <div className={`p-6 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-6`}>
            <div className="flex items-center gap-2 flex-row-reverse justify-end border-b border-slate-800/10 pb-4">
              <Settings className="h-5 w-5 text-yellow-500" />
              <h3 className="font-extrabold text-sm text-white">تهيئات النظام والنواة السحابية الكبرى (Federal Kernel Setup)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Maintenance Mode switch */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">حالة وضع الصيانة العامة (System Maintenance Mode)</span>
                <p className="text-[10px] text-slate-450 mt-0.5 block">في حال تم تفعيله، سيتم اعتراض جميع واجهات الملا والنزلاء وعرض صفحة "تحت الصيانة الطارئة".</p>
                <div className="flex items-center gap-3 mt-2 flex-row-reverse justify-end">
                  <span className={`text-xs ${systemSettings.maintenanceMode ? 'text-rose-500 font-extrabold' : 'text-emerald-400 font-extrabold'}`}>
                    {systemSettings.maintenanceMode ? 'مفتوح في وضع صيانة طارئة 🔒' : 'النظام قيد العمل المفتوح والآمن ✓'}
                  </span>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                    className="h-5 w-5 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 2: Saudi VAT */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">نسبة ضريبة القيمة المضافة الوطنية VAT 🇸🇦</label>
                <input
                  type="number"
                  value={systemSettings.vatRate}
                  onChange={(e) => setSystemSettings({ ...systemSettings, vatRate: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-lg text-xs font-mono font-bold ${
                    isDark ? 'bg-[#020617] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  } border focus:outline-none`}
                />
                <span className="text-[9px] text-slate-550">النسبة المعتمدة لدى هيئة الزكاة والضريبة والجمارك 15%.</span>
              </div>

              {/* Field 3: Ejari Link key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">رمز استدعاء Ejari Premium LIVE Endpoint</label>
                <input
                  type="text"
                  value={systemSettings.tokenEjariLive}
                  onChange={(e) => setSystemSettings({ ...systemSettings, tokenEjariLive: e.target.value })}
                  className={`w-full p-2.5 rounded-lg text-xs font-mono text-left ${
                    isDark ? 'bg-[#020617] text-white border-slate-850' : 'bg-slate-50 text-slate-900 border-slate-200'
                  } border focus:outline-none focus:border-slate-700`}
                />
              </div>

              {/* Field 4: ZATCA certification key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">شهادة التوقيع والتشفير ZATCA Phase-II Stamp</label>
                <input
                  type="text"
                  value={systemSettings.certificationVatCode}
                  onChange={(e) => setSystemSettings({ ...systemSettings, certificationVatCode: e.target.value })}
                  className={`w-full p-2.5 rounded-lg text-xs font-mono text-left ${
                    isDark ? 'bg-[#020617] text-white border-slate-850' : 'bg-slate-50 text-slate-900 border-slate-200'
                  } border focus:outline-none focus:border-slate-700`}
                />
              </div>

              {/* Field 5: Logging switch */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">وضع المطالبات البرمجية ومعاينة الـ CLI (Developer Debug Mode)</span>
                <p className="text-[10px] text-slate-450 block">حفظ تتبعات قواعد البيانات واعتراضات الـ API بالمفتش.</p>
                <div className="flex items-center gap-3 mt-2 flex-row-reverse justify-end">
                  <span className={`text-xs ${systemSettings.debugMode ? 'text-yellow-500 font-extrabold' : 'text-slate-500'}`}>
                    {systemSettings.debugMode ? 'تنشيط بروتوكول الرصد الكامل (Debug)' : 'تشغيل بروتوكول التحليلات الأساسي'}
                  </span>
                  <input
                    type="checkbox"
                    checked={systemSettings.debugMode}
                    onChange={(e) => setSystemSettings({ ...systemSettings, debugMode: e.target.checked })}
                    className="h-5 w-5 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 6: Log lifecycle retention */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">دورة ومدة الاحتفاظ بسجلات التدقيق الأمني (أيام)</label>
                <input
                  type="number"
                  value={systemSettings.databaseRetentionDays}
                  onChange={(e) => setSystemSettings({ ...systemSettings, databaseRetentionDays: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-lg text-xs font-mono font-bold ${
                    isDark ? 'bg-[#020617] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  } border focus:outline-none`}
                />
                <span className="text-[9px] text-slate-500 font-bold block mt-1">يتم تطهير وحذف التوقيعات القديمة آلياً لتفادي اختناق السيرفر.</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-850 flex justify-end">
              <button
                type="submit"
                className="bg-[#00E676] hover:bg-[#00c853] text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Save className="h-4 w-4" />
                <span>ترحيل وحفظ التغيرات الفيدرالية</span>
              </button>
            </div>

          </div>

        </form>
      )}

      {/* Tab: Audit Log Viewer */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex justify-between items-center flex-row-reverse">
              <Terminal className="h-5 w-5 text-red-500" />
              <h3 className="font-extrabold text-xs text-slate-300">سجل عمليات الخادم ومفتش جدار الحماية (Enterprise Audit-Trail Inspector)</h3>
            </div>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              سلسلة كشوفات التجسس على الاستدعاءات وسحب امتيازات الدخول، وإجراءات الملاك والمشرفين بالمنصة. مع دقة عناوين الـ IP ومتصفح المستفيد.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/25 font-bold">
                    <th className="pb-3 text-right">ميعاد وتسجيل التوقيت</th>
                    <th className="pb-3 text-right">المستخدم القائم بالاستدعاء</th>
                    <th className="pb-3 text-right">مجال الحركة العملية</th>
                    <th className="pb-3 text-right text-left">التفاصيل الفنية</th>
                    <th className="pb-3 text-center">عنوان السيرفر / الـ IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10 font-mono text-slate-400">
                  {auditLogs.slice(0, 15).map(log => (
                    <tr key={log.id} className="hover:bg-slate-900/10">
                      <td className="py-3 text-right text-[10.5px] text-slate-500 font-bold">{new Date(log.timestamp).toLocaleString('ar-SA')}</td>
                      <td className="py-3 text-right font-sans">
                        <span className="font-extrabold text-white block">{log.userName}</span>
                        <span className="text-[9.5px] text-cyan-400 block mt-0.5">{getRoleLabelAr(log.role)}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="bg-red-950/20 text-red-400 px-1.5 py-0.5 rounded border border-red-900/40 text-[9px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-right font-sans text-slate-300 leading-normal max-w-sm truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 text-center text-slate-500">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* MODALS IN CONTAINER */}

      {/* Modal 1: Edit Subscription details */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#060D19] border-slate-800 text-white' : 'bg-white text-slate-900'} text-right max-w-md w-full space-y-4`}>
            <div className="flex justify-between items-center mb-2 flex-row-reverse">
              <h3 className="font-extrabold text-sm text-yellow-500">تعديل رخصة وتفاصيل خطة اشتراك SaaS 🏢</h3>
              <button onClick={() => setEditingSub(null)} className="text-slate-500 hover:text-white font-black">✕</button>
            </div>
            
            <form onSubmit={handleUpdateSubscription} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">مجموع الملاك والمنظمة</label>
                <input type="text" readOnly value={editingSub.orgName} className="w-full p-2 bg-slate-900/50 rounded border border-slate-800 text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">الخطة المخصصة للتحصيل</label>
                  <select
                    value={editingSub.plan}
                    onChange={(e) => setEditingSub({ ...editingSub, plan: e.target.value as any })}
                    className="w-full p-2 bg-slate-900/50 rounded border border-slate-800 text-white"
                  >
                    <option value="free">المسار البسيط (Free)</option>
                    <option value="premium">الخطة المتقدمة للملاك (Premium)</option>
                    <option value="enterprise">خطة الشركات القابضة (Enterprise)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">قيمة الاشتراك الشهري ر.س</label>
                  <input
                    type="number"
                    value={editingSub.price}
                    onChange={(e) => setEditingSub({ ...editingSub, price: Number(e.target.value) })}
                    className="w-full p-2 bg-[#020617] rounded border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">الحد الأقصى للوحدات</label>
                  <input
                    type="number"
                    value={editingSub.activeUnitsCount}
                    onChange={(e) => setEditingSub({ ...editingSub, activeUnitsCount: Number(e.target.value) })}
                    className="w-full p-2 bg-[#020617] rounded border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">توقيت استحقاق الفاتورة</label>
                  <input
                    type="date"
                    value={editingSub.renewalDate}
                    onChange={(e) => setEditingSub({ ...editingSub, renewalDate: e.target.value })}
                    className="w-full p-2 bg-[#020617] rounded border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-lg hover:bg-slate-850"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black"
                >
                  تأكيد وتحديث الترخيص
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create User profile */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#060D19] border-slate-800 text-white' : 'bg-white text-slate-900'} text-right max-w-sm w-full space-y-4`}>
            <div className="flex justify-between items-center mb-2 flex-row-reverse">
              <h3 className="font-extrabold text-sm text-blue-500">إضافة وتعيين رول حساب مستخدم جديد 👤</h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-500 hover:text-white font-black">✕</button>
            </div>
            
            <form onSubmit={handleCreateNewUser} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">الاسم الثلاثي المعتمد بالهوية الوطنية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: صالح بن محمد الودعاني"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full p-2 bg-[#020617] text-white rounded border border-slate-800 font-bold placeholder-slate-650"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full p-2 bg-[#020617] text-white rounded border border-slate-800 text-left placeholder-slate-650 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">رقم الهاتف الموحد</label>
                  <input
                    type="text"
                    required
                    placeholder="+9665..."
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full p-2 bg-[#020617] text-white rounded border border-slate-800 text-left placeholder-slate-650 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">رول ومنصب الحساب</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full p-2 bg-[#020617] text-white rounded border border-slate-800"
                  >
                    <option value="super_admin">مدير عام المجموعة ⭐</option>
                    <option value="property_manager">مدير الأملاك العقارية</option>
                    <option value="accountant">محاسب مالي معتمد</option>
                    <option value="tenant">مستأجر عقاري</option>
                    <option value="owner">المالك والمستثمر العقاري</option>
                    <option value="maintenance_staff">طاقم صيانة وتفتيش</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">كلمة مرور مبدئية</label>
                  <input
                    type="password"
                    required
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full p-2 bg-[#020617] text-white rounded border border-slate-800 text-left font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-lg hover:bg-slate-850"
                >
                  إلغاء ومراجعة
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E40AF] hover:bg-[#153185] text-white rounded-lg font-black"
                >
                  تعيين وتنشيط الحساب
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
