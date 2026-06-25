/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Calendar, MessageSquare, Wrench, Layout, 
  MapPin, Bell, LogIn, Sparkles, LogOut, CheckCircle2, ChevronDown, Menu, X,
  Users, DollarSign, Briefcase, TrendingUp, Shield, ShieldCheck, HelpCircle, FileText, Settings,
  BookOpen, Map
} from 'lucide-react';

import { 
  PropertyUnit, Booking, TaskDetail,
  PropertyPortfolio, Building, Contract, Tenant, Invoice, PaymentRecord,
  AuthUser, UserRole, AuditLog
} from './types';
import { 
  INITIAL_UNITS, INITIAL_BOOKINGS, INITIAL_TASKS,
  INITIAL_PROPERTIES, INITIAL_BUILDINGS, INITIAL_TENANTS, INITIAL_CONTRACTS, INITIAL_INVOICES, INITIAL_PAYMENTS 
} from './data/mockData';

// Subcomponents
import LandingPage, { BrandLogoSvg } from './components/SaaSWeb/LandingPage';
import AuthPortal from './components/Auth/AuthPortal';
import DashboardOverview from './components/HostDashboard/DashboardOverview';
import UnitsManager from './components/HostDashboard/UnitsManager';
import BookingsManager from './components/HostDashboard/BookingsManager';
import WhatsAppAutomator from './components/HostDashboard/WhatsAppAutomator';
import OperationsManager from './components/HostDashboard/OperationsManager';
import DigitalGuide from './components/GuestPortal/DigitalGuide';

// Modeef Parity Components
import GuestsManager from './components/HostDashboard/GuestsManager';
import CalendarManager from './components/HostDashboard/CalendarManager';
import ExpensesManager from './components/HostDashboard/ExpensesManager';
import TransactionsLedger from './components/HostDashboard/TransactionsLedger';
import ReportsAnalytics from './components/HostDashboard/ReportsAnalytics';

// Premium SaaS real-estate specific managers
import PropertiesManager from './components/HostDashboard/PropertiesManager';
import BuildingsManager from './components/HostDashboard/BuildingsManager';
import ContractsManager from './components/HostDashboard/ContractsManager';
import TenantsManager from './components/HostDashboard/TenantsManager';
import InvoicesManager from './components/HostDashboard/InvoicesManager';
import PaymentsManager from './components/HostDashboard/PaymentsManager';
import MaintenanceManager from './components/HostDashboard/MaintenanceManager';
import AnalyticsDashboard from './components/HostDashboard/AnalyticsDashboard';
import NotificationsManager from './components/HostDashboard/NotificationsManager';
import AuditLogsManager from './components/HostDashboard/AuditLogsManager';
import SessionInspector from './components/HostDashboard/SessionInspector';
import SuperAdminPanel from './components/HostDashboard/SuperAdminPanel';
import AICopilot from './components/HostDashboard/AICopilot';
import SystemTrainingHub from './components/HostDashboard/SystemTrainingHub';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'guest-guide'>('landing');
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'units' | 'bookings' | 'whatsapp' | 'operations' | 'guests' | 'calendar' | 'expenses' | 'transactions' | 'reports' |
    'properties' | 'buildings' | 'contracts' | 'tenants' | 'invoices' | 'payments' | 'maintenance' | 'analytics' | 'notifications' | 'settings' | 'audit-logs' | 'session-inspector' | 'super-admin' | 'copilot' | 'training'
  >('overview');
  
  // Theme selection: dark | light (RTL premium)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('saas_theme') as 'dark' | 'light') || 'dark';
  });
  
  // Local Databases synced with LocalStorage
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  
  const [properties, setProperties] = useState<PropertyPortfolio[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  
  // Selected booking for Guest Portal preview
  const [selectedBookingForGuide, setSelectedBookingForGuide] = useState<Booking | null>(null);

  // Live action notification alerts for host (simulated telemetry logs)
  const [actionNotif, setActionNotif] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [numUnreadNotifs, setNumUnreadNotifs] = useState(2);

  // Helper function to check role based access control (RBAC)
  const isTabAllowedForRole = (tab: string, role: string): boolean => {
    if (tab === 'training') return true;
    if (role === 'super_admin') return true;
    if (role === 'property_manager') return tab !== 'audit-logs';
    if (role === 'accountant') {
      return ['overview', 'invoices', 'payments', 'expenses', 'transactions', 'reports', 'analytics', 'session-inspector', 'settings', 'notifications'].includes(tab);
    }
    if (role === 'tenant') {
      return ['overview', 'contracts', 'invoices', 'maintenance', 'session-inspector', 'notifications'].includes(tab);
    }
    if (role === 'owner') {
      return ['overview', 'properties', 'buildings', 'units', 'reports', 'analytics', 'session-inspector', 'notifications', 'copilot'].includes(tab);
    }
    if (role === 'maintenance_staff') {
      return ['overview', 'maintenance', 'session-inspector', 'notifications'].includes(tab);
    }
    return false;
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated user session state variables
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('saas_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    return localStorage.getItem('saas_jwt_token');
  });

  const [globalAuthOpen, setGlobalAuthOpen] = useState(false);
  const [globalAuthInitialTab, setGlobalAuthInitialTab] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verify'>('login');

  // Initialize and sync LocalStorage & API
  useEffect(() => {
    fetch('/api/db')
      .then(res => {
        if (!res.ok) throw new Error("API response not ok");
        return res.json();
      })
      .then(data => {
        if (data.units) setUnits(data.units);
        if (data.bookings) setBookings(data.bookings);
        if (data.tasks) setTasks(data.tasks);
        if (data.properties) setProperties(data.properties);
        if (data.buildings) setBuildings(data.buildings);
        if (data.contracts) setContracts(data.contracts);
        if (data.tenants) setTenants(data.tenants);
        if (data.invoices) setInvoices(data.invoices);
        if (data.payments) setPayments(data.payments);
      })
      .catch(err => {
        console.warn("Express backend offline or static mode, fallback to localStorage", err);
        const storedUnits = localStorage.getItem('s_units');
        const storedBookings = localStorage.getItem('s_bookings');
        const storedTasks = localStorage.getItem('s_tasks');
        const storedProperties = localStorage.getItem('s_properties');
        const storedBuildings = localStorage.getItem('s_buildings');
        const storedContracts = localStorage.getItem('s_contracts');
        const storedTenants = localStorage.getItem('s_tenants');
        const storedInvoices = localStorage.getItem('s_invoices');
        const storedPayments = localStorage.getItem('s_payments');

        if (storedUnits) setUnits(JSON.parse(storedUnits));
        else {
          setUnits(INITIAL_UNITS);
          localStorage.setItem('s_units', JSON.stringify(INITIAL_UNITS));
        }

        if (storedBookings) setBookings(JSON.parse(storedBookings));
        else {
          setBookings(INITIAL_BOOKINGS);
          localStorage.setItem('s_bookings', JSON.stringify(INITIAL_BOOKINGS));
        }

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        else {
          setTasks(INITIAL_TASKS);
          localStorage.setItem('s_tasks', JSON.stringify(INITIAL_TASKS));
        }

        if (storedProperties) setProperties(JSON.parse(storedProperties));
        else {
          setProperties(INITIAL_PROPERTIES);
          localStorage.setItem('s_properties', JSON.stringify(INITIAL_PROPERTIES));
        }

        if (storedBuildings) setBuildings(JSON.parse(storedBuildings));
        else {
          setBuildings(INITIAL_BUILDINGS);
          localStorage.setItem('s_buildings', JSON.stringify(INITIAL_BUILDINGS));
        }

        if (storedContracts) setContracts(JSON.parse(storedContracts));
        else {
          setContracts(INITIAL_CONTRACTS);
          localStorage.setItem('s_contracts', JSON.stringify(INITIAL_CONTRACTS));
        }

        if (storedTenants) setTenants(JSON.parse(storedTenants));
        else {
          setTenants(INITIAL_TENANTS);
          localStorage.setItem('s_tenants', JSON.stringify(INITIAL_TENANTS));
        }

        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
        else {
          setInvoices(INITIAL_INVOICES);
          localStorage.setItem('s_invoices', JSON.stringify(INITIAL_INVOICES));
        }

        if (storedPayments) setPayments(JSON.parse(storedPayments));
        else {
          setPayments(INITIAL_PAYMENTS);
          localStorage.setItem('s_payments', JSON.stringify(INITIAL_PAYMENTS));
        }
      });
  }, []);

  // Sync and audit RBAC security breach attempts
  useEffect(() => {
    localStorage.setItem('saas_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Sync and audit RBAC security breach attempts
  useEffect(() => {
    if (!currentUser) return;
    const activeRole = currentUser.role;
    const isAllowed = isTabAllowedForRole(activeSubTab, activeRole);
    
    if (!isAllowed) {
      fetch('/api/auth/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.fullName,
          userEmail: currentUser.email,
          role: currentUser.role,
          action: 'TAB_ACCESS_BLOCKED',
          details: `محاولة دخول للتبويب [${activeSubTab}] تم اعتراضها بواسطة جدار الحماية (Security Middleware).`,
          status: 'WARNING'
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(() => {
        handleTriggerActionNotif('حماية النظام الأمنية 🛡️', 'تم تسجيل محاولة الدخول غير المصرح بها في سجل العمليات العام للتدقـيق');
      })
      .catch(err => console.error("Could not record secure event", err));
    }
  }, [activeSubTab, currentUser]);

  // Sync state modifications to LocalStorage helper for clients
  const syncUnits = (newUnits: PropertyUnit[]) => {
    setUnits(newUnits);
    localStorage.setItem('s_units', JSON.stringify(newUnits));
  };

  const syncBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('s_bookings', JSON.stringify(newBookings));
  };

  const syncTasks = (newTasks: TaskDetail[]) => {
    setTasks(newTasks);
    localStorage.setItem('s_tasks', JSON.stringify(newTasks));
  };

  const syncProperties = (newProps: PropertyPortfolio[]) => {
    setProperties(newProps);
    localStorage.setItem('s_properties', JSON.stringify(newProps));
  };

  const syncBuildings = (newBlds: Building[]) => {
    setBuildings(newBlds);
    localStorage.setItem('s_buildings', JSON.stringify(newBlds));
  };

  const syncContracts = (newCons: Contract[]) => {
    setContracts(newCons);
    localStorage.setItem('s_contracts', JSON.stringify(newCons));
  };

  const syncTenants = (newTens: Tenant[]) => {
    setTenants(newTens);
    localStorage.setItem('s_tenants', JSON.stringify(newTens));
  };

  const syncInvoices = (newInvs: Invoice[]) => {
    setInvoices(newInvs);
    localStorage.setItem('s_invoices', JSON.stringify(newInvs));
  };

  const syncPayments = (newPays: PaymentRecord[]) => {
    setPayments(newPays);
    localStorage.setItem('s_payments', JSON.stringify(newPays));
  };

  // Telemetry event logging helper
  const handleTriggerActionNotif = (title: string, desc: string) => {
    const id = Date.now().toString();
    setActionNotif({ id, title, desc });
    setNumUnreadNotifs(prev => prev + 1);
    
    // Clear notification after 4 seconds
    setTimeout(() => {
      setActionNotif(current => current?.id === id ? null : current);
    }, 4500);
  };

  // CRUD handlers
  const handleAddUnit = (unit: PropertyUnit) => {
    fetch('/api/units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unit)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setUnits(prev => [saved, ...prev]);
    })
    .catch(() => {
      const nextList = [unit, ...units];
      syncUnits(nextList);
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    fetch(`/api/units/${unitId}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setUnits(prev => prev.filter(u => u.id !== unitId));
    })
    .catch(() => {
      const nextList = units.filter(u => u.id !== unitId);
      syncUnits(nextList);
    });

    // Also drop bookings and tasks associated with this unit to keep consistency
    const nextBookings = bookings.filter(b => b.unitId !== unitId);
    const nextTasks = tasks.filter(t => t.unitId !== unitId);
    setBookings(nextBookings);
    setTasks(nextTasks);
    handleTriggerActionNotif('حذف الوحدة التشغيلية', `تم إلغاء تسجيل الوحدة ومحو جميع ملفاتها المرتبطة`);
  };

  const handleAddBooking = (booking: Booking) => {
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setBookings(prev => [saved, ...prev]);
    })
    .catch(() => {
      const nextList = [booking, ...bookings];
      syncBookings(nextList);
    });

    // Adjust Unit status to occupied if needed
    const updatedUnits = units.map(u => {
      if (u.id === booking.unitId && booking.status === 'active') {
        return { ...u, status: 'occupied' as const };
      }
      return u;
    });
    setUnits(updatedUnits);
  };

  const handleCancelBooking = (bookingId: string) => {
    const bObj = bookings.find(b => b.id === bookingId);
    if (!bObj) return;
    const changed = { ...bObj, status: 'cancelled' as const };

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changed)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setBookings(prev => prev.map(b => b.id === bookingId ? saved : b));
    })
    .catch(() => {
      const nextList = bookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled' as const };
        }
        return b;
      });
      syncBookings(nextList);
    });
    handleTriggerActionNotif('إلغاء حجز الضيف', `تم إلغاء شفرات الدخول وتعطيل الدليل التفاعلي بنجاح`);
  };

  const handleAddTask = (task: TaskDetail) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setTasks(prev => [saved, ...prev]);
    })
    .catch(() => {
      const nextList = [task, ...tasks];
      syncTasks(nextList);
    });
  };

  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    const taskObj = tasks.find(t => t.id === taskId);
    if (!taskObj) return;
    const changed = { ...taskObj, status };

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changed)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setTasks(prev => prev.map(t => t.id === taskId ? saved : t));
    })
    .catch(() => {
      const nextList = tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status };
        }
        return t;
      });
      syncTasks(nextList);
    });
    
    // Check if task completed, maybe release the unit state back to available!
    if (status === 'completed') {
      const updatedUnits = units.map(u => {
        if (u.id === taskObj.unitId && u.status === 'cleaning') {
          return { ...u, status: 'available' as const };
        }
        return u;
      });
      setUnits(updatedUnits);
    }

    handleTriggerActionNotif(
      'تحديث حالة مهمة الضيافة', 
      `المهمة أصبحت حالياً: ${status === 'completed' ? 'تكتمل بامتياز ✓' : status === 'in_progress' ? 'قيد العمل عليها' : 'بالانتظار'}`
    );
  };

  const handleDeleteTask = (taskId: string) => {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setTasks(prev => prev.filter(t => t.id !== taskId));
    })
    .catch(() => {
      const nextList = tasks.filter(t => t.id !== taskId);
      syncTasks(nextList);
    });
  };

  // Property Portfolio CRUD
  const handleAddProperty = (prop: PropertyPortfolio) => {
    fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prop)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setProperties(prev => {
        const index = prev.findIndex(p => p.id === saved.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    })
    .catch(() => {
      setProperties(prev => {
        const index = prev.findIndex(p => p.id === prop.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = prop;
          return next;
        }
        const next = [prop, ...prev];
        syncProperties(next);
        return next;
      });
    });
  };

  const handleDeleteProperty = (id: string) => {
    fetch(`/api/properties/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setProperties(prev => prev.filter(p => p.id !== id));
    })
    .catch(() => {
      const next = properties.filter(p => p.id !== id);
      syncProperties(next);
    });
    handleTriggerActionNotif('حذف محفظة عقارية', 'تم إلغاء فهرسة الحقل العقاري بنجاح');
  };

  // Buildings Database CRUD
  const handleAddBuilding = (bld: Building) => {
    fetch('/api/buildings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bld)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setBuildings(prev => [saved, ...prev]);
    })
    .catch(() => {
      const next = [bld, ...buildings];
      syncBuildings(next);
    });
  };

  const handleDeleteBuilding = (id: string) => {
    fetch(`/api/buildings/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setBuildings(prev => prev.filter(b => b.id !== id));
    })
    .catch(() => {
      const next = buildings.filter(b => b.id !== id);
      syncBuildings(next);
    });
    handleTriggerActionNotif('حذف مبنى سكني', 'تم حذف السجل للمبنى من قاعدة الأملاك المتاحة');
  };

  // Contracts CRUD
  const handleAddContract = (con: Contract) => {
    fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(con)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setContracts(prev => {
        const index = prev.findIndex(c => c.id === saved.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    })
    .catch(() => {
      setContracts(prev => {
        const index = prev.findIndex(c => c.id === con.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = con;
          return next;
        }
        const next = [con, ...prev];
        syncContracts(next);
        return next;
      });
    });
  };

  const handleDeleteContract = (id: string) => {
    fetch(`/api/contracts/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setContracts(prev => prev.filter(c => c.id !== id));
    })
    .catch(() => {
      const next = contracts.filter(c => c.id !== id);
      syncContracts(next);
    });
    handleTriggerActionNotif('إلغاء وتصفية عقد', 'تم أرشفة عقد الإيجار بنجاح');
  };

  // Tenants CRUD
  const handleAddTenant = (t: Tenant) => {
    fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setTenants(prev => [saved, ...prev]);
    })
    .catch(() => {
      const next = [t, ...tenants];
      syncTenants(next);
    });
  };

  const handleDeleteTenant = (id: string) => {
    fetch(`/api/tenants/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setTenants(prev => prev.filter(t => t.id !== id));
    })
    .catch(() => {
      const next = tenants.filter(t => t.id !== id);
      syncTenants(next);
    });
    handleTriggerActionNotif('حذف ملف مستأجر', 'تم شطب العميل من قواعد البيانات المباشرة للشركة');
  };

  // Invoices CRUD
  const handleAddInvoice = (inv: Invoice) => {
    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inv)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setInvoices(prev => [saved, ...prev]);
    })
    .catch(() => {
      const next = [inv, ...invoices];
      syncInvoices(next);
    });
  };

  const handleDeleteInvoice = (id: string) => {
    fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setInvoices(prev => prev.filter(i => i.id !== id));
    })
    .catch(() => {
      const next = invoices.filter(i => i.id !== id);
      syncInvoices(next);
    });
    handleTriggerActionNotif('شطب فاتورة ضريبية', 'تم إلغاء السند المالي');
  };

  const handlePayInvoice = (id: string) => {
    fetch(`/api/invoices/${id}/pay`, { method: 'POST' })
    .then(res => {
      if (!res.ok) throw new Error();
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' as const } : i));
    })
    .catch(() => {
      const next = invoices.map(i => {
        if (i.id === id) {
          return { ...i, status: 'paid' as const };
        }
        return i;
      });
      syncInvoices(next);
    });
    handleTriggerActionNotif('تأكيد تحصيل السند', 'تم قيد الإيراد في الدفاتر ومزامنة البومة الوطنية');
  };

  // Payments CRUD
  const handleAddPayment = (pay: PaymentRecord) => {
    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pay)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(saved => {
      setPayments(prev => [saved, ...prev]);
      setInvoices(prev => prev.map(i => i.id === pay.invoiceId ? { ...i, status: 'paid' as const } : i));
    })
    .catch(() => {
      const next = [pay, ...payments];
      syncPayments(next);

      const updatedInvs = invoices.map(i => {
        if (i.id === pay.invoiceId) {
          return { ...i, status: 'paid' as const };
        }
        return i;
      });
      syncInvoices(updatedInvs);
    });
  };

  const handleDeletePayment = (id: string) => {
    fetch(`/api/payments/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setPayments(prev => prev.filter(p => p.id !== id));
    })
    .catch(() => {
      const next = payments.filter(p => p.id !== id);
      syncPayments(next);
    });
    handleTriggerActionNotif('سحب سند دفع', 'تم إبطال المقاصة المصرفية بنجاح واستعادة الفاتورة للقيد المستحق');
  };

  // Direct mock whatsapp dispatch button from quick dashboard action
  const handleSendWhatsAppNotification = (booking: Booking, templateType: 'welcome' | 'lock_code' | 'guide_and_wifi') => {
    const label = 
      templateType === 'welcome' ? 'تأكيد الحجز الترحيبي ورابط الدليل الرقمي' :
      templateType === 'lock_code' ? 'شفرة الباب الذكي (دخول ذاتي)' :
      'دليل الوصول وإحداثيات الموقع وتفاصيل الواي فاي Wifi';
    
    handleTriggerActionNotif(
      `إرسال واتساب أوتوماتيكي ${booking.guestName}`,
      `نوع الرسالة الفورية: [${label}] تم الإرسال للرقم ${booking.guestPhone} بنجاح ✓✓`
    );
  };

  const handleLaunchGuestPortal = (booking: Booking) => {
    setSelectedBookingForGuide(booking);
    setCurrentView('guest-guide');
  };

  const handleStartTrialSaaS = (selectedPlan: 'starter' | 'pro' | 'enterprise') => {
    // Populate form data, then route user inside
    setCurrentView('dashboard');
    setActiveSubTab('overview');
    handleTriggerActionNotif(
      'تفعيل الترخيص التجريبي الفاخر',
      `تم تسجيل حسابك على الباقة الفضية الشاملة لمدة 14 يوماً مع تفعيل أتمتة الدخول`
    );
  };

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen relative font-sans hover:scroll-smooth" style={{ direction: 'rtl' }}>
      
      {/* Current SaaS View router Layout */}
      {currentView === 'landing' && (
        <LandingPage 
          onStartTrial={handleStartTrialSaaS}
          onNavigateToDashboard={() => {
            setCurrentView('dashboard');
            setActiveSubTab('overview');
          }}
          onNavigateToDemoGuide={() => {
            setSelectedBookingForGuide(null);
            setCurrentView('guest-guide');
          }}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView('dashboard');
            setActiveSubTab('overview');
            handleTriggerActionNotif(
              'تسجيل الدخول الناجح',
              `مرحباً بك أستاذ ${user.fullName}، يسعدنا انضمامك لعائلة سعود النعام للخدمات العقارية`
            );
          }}
        />
      )}

      {currentView === 'guest-guide' && (
        <DigitalGuide 
          booking={selectedBookingForGuide}
          units={units}
          onBackToPlatform={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'dashboard' && (
        <div className={`min-h-screen flex flex-col md:flex-row transition-all duration-300 ${
          theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#040B16] text-[#f3f4f6]'
        }`}>
          
          {/* Main Sidebar (RHS in RTL layout) */}
          <style>{`
            .light-mode-sidebar button:not(.bg-blue-600):not([class*="bg-gradient"]):not([class*="bg-amber"]):not(.border-amber-500) {
              color: #334155 !important;
            }
            .light-mode-sidebar button:not(.bg-blue-600):not([class*="bg-gradient"]):not([class*="bg-amber"]):not(.border-amber-500) span {
              color: inherit !important;
            }
            .light-mode-sidebar button:hover:not(.bg-blue-600):not([class*="bg-gradient"]):not([class*="bg-amber"]) {
              color: #0f172a !important;
              background-color: #f1f5f9 !important;
            }
            .light-mode-sidebar button:hover:not(.bg-blue-600):not([class*="bg-gradient"]):not([class*="bg-amber"]) span {
              color: inherit !important;
            }
          `}</style>
          <aside className={`w-full md:w-64 border-l flex flex-col justify-between shrink-0 transition-all duration-300 ${
            theme === 'light' ? 'bg-white border-slate-200/80 light-mode-sidebar shadow-sm' : 'bg-[#050C16] border-slate-800/85'
          }`}>
            
            {/* Upper brand */}
            <div>
              <div className={`p-4 border-b flex items-center gap-3 justify-end ${
                theme === 'light' ? 'border-slate-200' : 'border-slate-850'
              }`}>
                <div 
                  onClick={() => setCurrentView('landing')}
                  className={`border p-1 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#051122] border-slate-800/80'
                  }`}
                  style={{ width: '150px', height: '110px' }}
                >
                  <BrandLogoSvg 
                    className="h-14 w-14" 
                    style={{ height: '57px', width: '77.4px' }}
                    imgStyle={{ width: '300px', height: '1500px' }}
                  />
                </div>
                <div className="flex flex-col text-right">
                  <h1 className={`font-extrabold text-sm font-sans ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>سعود النعام</h1>
                  <span className="text-[9px] text-[#00e676] font-bold tracking-wide">لوحة المضيفين الاحترافية</span>
                </div>
              </div>

              {/* Sub tab linkages list */}
              <nav className="p-3 space-y-4 text-right font-medium overflow-y-auto max-h-[calc(100vh-140px)]">
                
                {/* Category 1: Overview & Entry */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-2 uppercase">لوحة التحكم والنزلاء</span>
                  
                  <button
                    onClick={() => { setActiveSubTab('overview'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'overview' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Layout className="h-4 w-4 shrink-0" />
                    <span>الرئيسية / الإشغال 🏢</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('guests'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'guests' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    <span>النزلاء والضيوف 👤</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('calendar'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'calendar' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>التقويم الزمني 📅</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('bookings'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'bookings' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>المخطط والحجوزات ({bookings.length})</span>
                  </button>
                </div>

                {/* Category 2: Properties & Buildings */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase">المحفظة العقارية</span>

                  <button
                    onClick={() => { setActiveSubTab('properties'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'properties' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Home className="h-4 w-4 shrink-0" />
                    <span>المحافظ والملكيات ({properties.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('buildings'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'buildings' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span>سجلات المباني السكنية ({buildings.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('units'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'units' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span>لوحة الوحدات والغرف ({units.length})</span>
                  </button>
                </div>

                {/* Category 3: Lease & Tenants CRM */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase">إيجار والنزلاء</span>

                  <button
                    onClick={() => { setActiveSubTab('contracts'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'contracts' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span>إرسال وتصديق العقود ({contracts.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('tenants'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'tenants' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    <span>المستأجرين المعتمدين ({tenants.length})</span>
                  </button>
                </div>

                {/* Category 4: Accounting, Billing & Invoicing */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase">قيد المحاسبة والفوترة</span>

                  <button
                    onClick={() => { setActiveSubTab('invoices'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'invoices' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span>ZATCA الفواتير الضريبية</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('payments'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'payments' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span>تسويات مدى والسندات ({payments.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('expenses'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'expenses' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span>مصاريف ورسوم الصيانة</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('transactions'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'transactions' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>قيود المعاملات السند</span>
                  </button>
                </div>

                {/* Category 5: Operations & Machinery */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase">الصيانة والتشغيل</span>

                  <button
                    onClick={() => { setActiveSubTab('maintenance'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'maintenance' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Wrench className="h-4 w-4 shrink-0" />
                    <span>تذاكر الصيانة والتعقيم</span>
                  </button>
                </div>

                {/* Category 6: Analysis & Marketing Automation */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase font-sans">الأداء والتسويق الآلي</span>

                  <button
                    onClick={() => { setActiveSubTab('reports'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'reports' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    <span>التقارير والمكاسب العامة</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('analytics'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'analytics' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    <span>التحليلات ومخططات الإيراد</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('whatsapp'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer relative ${
                      activeSubTab === 'whatsapp' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span>أتمتة وحملات الواتساب</span>
                    <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('copilot'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer relative ${
                      activeSubTab === 'copilot' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
                      <span>المساعد الذكي (AI Copilot)</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500/30 text-blue-300 border border-blue-500/40">متقدم</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('training'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer relative ${
                      activeSubTab === 'training' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 shrink-0 text-cyan-400" />
                      <span>دليل التعلم وخريطة النظام</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">جديد 🌟</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('notifications'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer relative ${
                      activeSubTab === 'notifications' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Bell className="h-4 w-4 shrink-0" />
                    <span>مركز التنبيهات والرسائل</span>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('settings'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'settings' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span>إعدادات وثوابت المنصة</span>
                  </button>

                  {/* Super Admin Panel Gated Access Link */}
                  {currentUser?.role === 'super_admin' && (
                    <button
                      onClick={() => { setActiveSubTab('super-admin'); setMobileMenuOpen(false); }}
                      className={`w-full mt-2 px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 transition-all border font-black cursor-pointer ${
                        activeSubTab === 'super-admin' 
                          ? 'bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' 
                          : 'text-amber-400 hover:text-white border-amber-950/20 bg-amber-950/5 hover:bg-amber-950/20'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>👑 لوحة تحكم السيرفر والـ SaaS</span>
                    </button>
                  )}
                </div>

                {/* Category 7: Security & JWT Verification */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold pr-2.5 tracking-widest block mb-1.5 uppercase font-sans">الأمن والتحقق الفني</span>

                  <button
                    onClick={() => { setActiveSubTab('session-inspector'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'session-inspector' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Shield className="h-4 w-4 shrink-0" />
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <span>مراقب ومحلل ومفتش الـ JWT</span>
                      {currentUser && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveSubTab('audit-logs'); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      activeSubTab === 'audit-logs' 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg' 
                        : !isTabAllowedForRole('audit-logs', currentUser?.role || 'super_admin')
                          ? 'text-red-400 hover:bg-red-950/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <span>سجل العمليات والتدقيق النعام (Audit)</span>
                      {!isTabAllowedForRole('audit-logs', currentUser?.role || 'super_admin') && (
                        <span className="text-[10px]">🔒</span>
                      )}
                    </div>
                  </button>
                </div>

              </nav>

            </div>

            {/* Downward links and logout togglers */}
            <div className={`p-4 border-t space-y-2 ${theme === 'light' ? 'border-slate-200' : 'border-slate-850'}`}>
              <button 
                onClick={() => {
                  setSelectedBookingForGuide(null);
                  setCurrentView('guest-guide');
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'text-slate-650 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200'
                    : 'text-slate-400 hover:text-[#00e676] hover:bg-[#0c3115]/20 border border-transparent hover:border-emerald-900'
                }`}
              >
                <span>دليل وصول النزلاء</span>
                <span className="h-1.5 w-1.5 bg-[#00e676] rounded-full"></span>
              </button>
              
              <button 
                onClick={() => {
                  localStorage.removeItem('saas_current_user');
                  localStorage.removeItem('saas_jwt_token');
                  setCurrentUser(null);
                  setJwtToken(null);
                  setCurrentView('landing');
                  handleTriggerActionNotif('تم خروج الجلسة 🔒', 'تم حرق ترخيص جلسة الـ JWT الحالية وتأمين الخروج الآمن');
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'text-slate-650 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200'
                    : 'text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40'
                }`}
              >
                <LogOut className={`h-4 w-4 ${theme === 'light' ? 'text-slate-550' : 'text-slate-500'}`} />
                <span>تسجيل الخروج من المنصة</span>
              </button>
            </div>

          </aside>

          {/* Core host backoffice viewport */}
          <main className={`flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden transition-all duration-300 ${
            theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#040B16] text-[#f3f4f6]'
          }`}>
            
            {/* Header notification details bar */}
            <div className={`flex justify-between items-center pb-5 border-b mb-8 text-right ${
              theme === 'light' ? 'border-slate-200 text-slate-950' : 'border-slate-800/80'
            }`}>
              
              {/* Account details */}
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full font-extrabold flex items-center justify-center text-[10px] uppercase ${
                  theme === 'light' ? 'bg-slate-200 border border-slate-300 text-slate-700' : 'bg-gradient-to-br from-[#031B4E] to-blue-950 border border-[#031B4E] text-yellow-505'
                }`}>
                  {currentUser ? currentUser.fullName.trim().split(' ').map(n => n[0]).join('').substring(0, 2) : 'PM'}
                </div>
                <div className="flex flex-col text-right">
                  <span className={`text-xs font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    {currentUser ? currentUser.fullName : 'إدارة عقارات النعام'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {currentUser ? currentUser.email : 'ID: SAUD-REAL-984'}
                  </span>
                </div>
              </div>

              {/* Ticker notifications & theme toggle */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const next = theme === 'dark' ? 'light' : 'dark';
                    setTheme(next);
                    handleTriggerActionNotif('تغيير مظهر المنصة', `تم تفعيل ${next === 'light' ? 'المظهر النهاري المضيء' : 'المظهر الليلي الداكن'} بنجاح`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' 
                      : 'bg-[#0f1b2d] border-slate-800 text-slate-300 hover:text-white hover:bg-[#15243a]'
                  }`}
                >
                  {theme === 'light' ? '🌙 المظهر الداكن' : '☀️ المظهر المضيء'}
                </button>
                <span className={`h-4 w-px ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}></span>
                <div 
                  className={`relative cursor-pointer transition-colors ${theme === 'light' ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white'}`} 
                  onClick={() => {
                    setActiveSubTab('notifications');
                    setNumUnreadNotifs(0);
                  }}
                >
                  <Bell className="h-4 w-4" />
                  {numUnreadNotifs > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white font-extrabold text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-mono">
                      {numUnreadNotifs}
                    </span>
                  )}
                </div>
                <span className={`h-4 w-px hidden sm:inline-block ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}></span>
                <span className={`text-xs font-bold hidden sm:inline-block ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                   السعر التشغيلي الفضي النشط
                </span>
              </div>

            </div>

            {/* Active Sub Tab routers */}
            {activeSubTab === 'overview' && (
              <DashboardOverview 
                theme={theme}
                units={units}
                bookings={bookings}
                tasks={tasks}
                onTriggerAction={handleTriggerActionNotif}
                onNavigateToUnit={(uid) => {
                  setActiveSubTab('units');
                }}
                onSendWhatsApp={handleSendWhatsAppNotification}
                onOpenGuestGuide={handleLaunchGuestPortal}
              />
            )}

            {activeSubTab === 'guests' && (
              <GuestsManager 
                bookings={bookings}
                units={units}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'calendar' && (
              <CalendarManager 
                units={units}
                bookings={bookings}
                onAddBooking={handleAddBooking}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'units' && (
              <UnitsManager 
                units={units}
                onAddUnit={handleAddUnit}
                onDeleteUnit={handleDeleteUnit}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'bookings' && (
              <BookingsManager 
                bookings={bookings}
                units={units}
                onAddBooking={handleAddBooking}
                onCancelBooking={handleCancelBooking}
                onTriggerAction={handleTriggerActionNotif}
                onOpenGuestGuide={handleLaunchGuestPortal}
                theme={theme}
              />
            )}

            {activeSubTab === 'expenses' && (
              <ExpensesManager 
                units={units}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'operations' && (
              <OperationsManager 
                tasks={tasks}
                units={units}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'transactions' && (
              <TransactionsLedger 
                bookings={bookings}
                units={units}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'reports' && (
              <ReportsAnalytics 
                units={units}
                bookings={bookings}
                tasks={tasks}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'whatsapp' && (
              <WhatsAppAutomator 
                bookings={bookings}
                units={units}
                onTriggerAction={handleTriggerActionNotif}
                theme={theme}
              />
            )}

            {activeSubTab === 'properties' && (
              <PropertiesManager 
                properties={properties}
                onAddProperty={handleAddProperty}
                onDeleteProperty={handleDeleteProperty}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
                currentUser={currentUser}
              />
            )}

            {activeSubTab === 'buildings' && (
              <BuildingsManager 
                buildings={buildings}
                properties={properties}
                onAddBuilding={handleAddBuilding}
                onDeleteBuilding={handleDeleteBuilding}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'contracts' && (
              <ContractsManager 
                contracts={contracts}
                tenants={tenants}
                units={units}
                properties={properties}
                onAddContract={handleAddContract}
                onDeleteContract={handleDeleteContract}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
                currentUser={currentUser}
              />
            )}

            {activeSubTab === 'tenants' && (
              <TenantsManager 
                tenants={tenants}
                onAddTenant={handleAddTenant}
                onDeleteTenant={handleDeleteTenant}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'invoices' && (
              <InvoicesManager 
                invoices={invoices}
                contracts={contracts}
                payments={payments}
                tenants={tenants}
                units={units}
                onAddInvoice={handleAddInvoice}
                onPayInvoice={handlePayInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                onAddPayment={handleAddPayment}
                onDeletePayment={handleDeletePayment}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'payments' && (
              <PaymentsManager 
                payments={payments}
                invoices={invoices}
                onAddPayment={handleAddPayment}
                onDeletePayment={handleDeletePayment}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'maintenance' && (
              <MaintenanceManager 
                tasks={tasks}
                units={units}
                onAddTask={handleAddTask}
                onUpdateStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'analytics' && (
              <AnalyticsDashboard 
                units={units}
                bookings={bookings}
                tasks={tasks}
                theme={theme}
              />
            )}

            {activeSubTab === 'notifications' && (
              <NotificationsManager 
                bookings={bookings}
                units={units}
                theme={theme}
                onTriggerAction={handleTriggerActionNotif}
              />
            )}

            {activeSubTab === 'copilot' && (
              <AICopilot theme={theme} />
            )}

            {activeSubTab === 'training' && (
              <SystemTrainingHub theme={theme} setActiveSubTab={setActiveSubTab} />
            )}

            {/* Gated Access Router Interceptor */}
            {!isTabAllowedForRole(activeSubTab, currentUser?.role || 'super_admin') ? (
              <div className={`p-8 sm:p-12 rounded-3xl border text-right space-y-8 relative overflow-hidden ${theme === 'light' ? 'bg-white border-red-100 shadow-md' : 'bg-slate-950/45 border-red-950/40'}`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-row-reverse text-right">
                    <div className={`p-3 rounded-2xl border shrink-0 ${theme === 'light' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-red-950/40 border-red-900/50 text-red-500'}`}>
                      <Shield className="h-7 w-7 animate-pulse" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>اعتراض محاولة الدخول بواسطة جدار الحماية (Middleware Shield Alert) 🛡️</h3>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>توقيع الـ JWT وامتيازات الحساب النشط لا تلبي شروط المرور المقيدة لهذا التبويب.</p>
                    </div>
                  </div>
                  <span className={`font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${theme === 'light' ? 'bg-red-50 text-red-650 border-red-100' : 'bg-red-950/50 text-red-500 border-red-900/40'}`}>STATUS_403_FORBIDDEN</span>
                </div>

                <div className={`p-5 rounded-2xl border space-y-4 text-xs ${theme === 'light' ? 'bg-slate-50/80 border-slate-200/60' : 'bg-[#030712] border-slate-900'}`}>
                  <h4 className={`font-extrabold text-xs ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>تفاصيل ملف التحقق الفني الفوري (Security Intercept Audit Log)</h4>
                  
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pr-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-350'}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>البريد الإلكتروني الحالي:</span>
                        <strong className={`font-mono text-xs ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{currentUser?.email}</strong>
                      </div>
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>الرتبة المعينة (Role Privilege):</span>
                        <strong className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} font-extrabold`}>
                          {currentUser?.role === 'super_admin' && 'مدير عام المجموعة'}
                          {currentUser?.role === 'property_manager' && 'مدير الأملاك والمنشآت'}
                          {currentUser?.role === 'accountant' && 'المحاسب المالي المعتمد'}
                          {currentUser?.role === 'tenant' && 'المستأجر السكني'}
                          {currentUser?.role === 'owner' && 'المالك والمستثمر العقاري'}
                          {currentUser?.role === 'maintenance_staff' && 'طاقم صيانة وتفتيش'}
                          {!currentUser && 'زائر مجهول (Guest)'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>المورد المستهدف (Resource):</span>
                        <strong className={`font-mono font-extrabold ${theme === 'light' ? 'text-amber-700' : 'text-yellow-500'}`}>/{activeSubTab}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>توقيع الـ JWT الحامل:</span>
                        <strong className={`font-mono text-[11px] truncate max-w-[160px] block ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`} style={{ direction: 'ltr' }}>
                          {jwtToken ? jwtToken.substring(0, 32) + '...' : 'INVALID_OR_MISSING_TOKEN'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>معرف العملية والمطابقة:</span>
                        <strong className={`font-mono text-xs ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>INT-ALNAAM-{Math.floor(Math.random() * 899999 + 100000)}</strong>
                      </div>
                      <div className="flex justify-between items-center flex-row-reverse text-right">
                        <span>الـ IP المعتمد جغرافياً:</span>
                        <strong className={`font-mono text-xs ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>185.112.55.24 (Riyadh, SA)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-start pt-2">
                  <button
                    onClick={() => {
                      setGlobalAuthInitialTab('login');
                      setGlobalAuthOpen(true);
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-l from-red-600 to-red-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    🔑 ترقية أو تبديل الحساب (Super Admin)
                  </button>
                  <button
                    onClick={() => setActiveSubTab('overview')}
                    className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    العودة لساحة الإشغال الآمنة
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeSubTab === 'audit-logs' && (
                  <AuditLogsManager 
                    theme={theme}
                    onTriggerAction={handleTriggerActionNotif}
                  />
                )}

                {activeSubTab === 'session-inspector' && (
                  <SessionInspector 
                    currentUser={currentUser}
                    jwtToken={jwtToken}
                    theme={theme}
                    onSessionConfig={(usr, tok) => {
                      setCurrentUser(usr);
                      setJwtToken(tok);
                    }}
                    onTriggerAction={handleTriggerActionNotif}
                  />
                )}

                {activeSubTab === 'super-admin' && (
                  <SuperAdminPanel 
                    theme={theme}
                    onTriggerAction={handleTriggerActionNotif}
                  />
                )}

                {activeSubTab === 'settings' && (
                  <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#060D19] border-slate-800'} text-right`}>
                    <h3 className="text-lg font-extrabold text-blue-500 mb-2">إعدادات وثوابت المنصة ⚙️</h3>
                    <p className={`text-xs mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>تهيئة الربط مع شبكة إيجار الوطنية، بوابة ZATCA للفوترة الإلكترونية، وإجراءات التحصيل.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#081222] border-slate-850'}`}>
                        <span className={`text-xs font-bold block mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>بيانات الترخيص Ejari Premium API</span>
                        <input type="text" readOnly value="JWT_TOKEN_EJARI_LIVE_9824" className={`w-full text-xs font-mono p-2 rounded-lg border text-left mt-2 ${theme === 'light' ? 'bg-white border-slate-200 text-emerald-700' : 'bg-slate-900/50 border-slate-800 text-emerald-400'}`} />
                      </div>
                      <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#081222] border-slate-850'}`}>
                        <span className={`text-xs font-bold block mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>شهادة ZATCA Cryptographic Stamp</span>
                        <input type="text" readOnly value="CERT_STAGE_PRODUCTION_SaudiVat" className={`w-full text-xs font-mono p-2 rounded-lg border text-left mt-2 ${theme === 'light' ? 'bg-white border-slate-200 text-amber-700' : 'bg-slate-900/50 border-slate-850 text-yellow-400'}`} />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center text-xs text-slate-500 font-medium">
                      <span>إصدار النظام: v4.11.2 Premium</span>
                      <span>معرف الربط: SAUD-REAL-984</span>
                    </div>
                  </div>
                )}
              </>
            )}

          </main>

        </div>
      )}

      {/* Persistent floating active Telemetry action notification toast */}
      {actionNotif && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#091629] border border-cyan-800/40 rounded-2xl p-4 shadow-2xl max-w-sm w-full text-right flex gap-3.5 items-start justify-end animate-slice-in">
          <div className="flex flex-col flex-1 text-right">
            <span className="font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-l from-white to-cyan-400">
              {actionNotif.title}
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
              {actionNotif.desc}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-cyan-950/50 border border-cyan-800 flex items-center justify-center shrink-0 text-cyan-400 font-extrabold text-xs">
            ✓
          </div>
        </div>
      )}

      {/* Global Saudi PropTech high-fidelity JWT & Cookie Secure Auth portal */}
      <AuthPortal 
        isOpen={globalAuthOpen}
        onClose={() => setGlobalAuthOpen(false)}
        initialTab={globalAuthInitialTab}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user);
          setJwtToken(token);
          setGlobalAuthOpen(false);
          handleTriggerActionNotif('تم الدخول بنجاح 🔑', `أهلاً بك مجدداً يا أستاذ ${user.fullName}. تم تفعيل رتبتك الأمنية بنجاح.`);
          // Automatically navigate to overview
          setActiveSubTab('overview');
        }}
        prefilledEmail={currentUser?.email || ''}
      />

    </div>
  );
}
