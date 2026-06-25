/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, Search, Plus, Trash2, Printer, 
  CheckCircle, ShieldAlert, DollarSign, QrCode, FileText, Sparkles,
  Calendar, RotateCw, FileClock, Clock, AlertCircle, ArrowUpRight, 
  Settings, Receipt, Share2, Download, CheckSquare, 
  Landmark, Building, User, Users, ClipboardCheck, Percent, HelpCircle, AlertTriangle, FileUp
} from 'lucide-react';
import { Invoice, Contract, PaymentRecord, Tenant, PropertyUnit } from '../../types';

interface InvoicesManagerProps {
  invoices: Invoice[];
  contracts: Contract[];
  payments: PaymentRecord[];
  tenants: Tenant[];
  units: PropertyUnit[];
  onAddInvoice: (inv: Invoice) => void;
  onPayInvoice: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
  onAddPayment: (pay: PaymentRecord) => void;
  onDeletePayment: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
}

export default function InvoicesManager({
  invoices,
  contracts,
  payments = [],
  tenants = [],
  units = [],
  onAddInvoice,
  onPayInvoice,
  onDeleteInvoice,
  onAddPayment,
  onDeletePayment,
  theme,
  onTriggerAction
}: InvoicesManagerProps) {
  // Current active sub-sections inside the Rent Collection module
  // 1. invoices: Standard Simple / Tax invoices list
  // 2. recurring: Recurring billing plans and auto scheduler
  // 3. payments: Payment tracking ledger matched receipts
  // 4. late-tracking: Overdue invoices with customizable late fees / warnings
  // 5. export-center: Full analytical reporting hub for CSV & PDF exports
  const [activeTab, setActiveTab] = useState<'invoices' | 'recurring' | 'payments' | 'late-tracking' | 'export-center'>('invoices');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  
  // Selected overlays targets
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);

  // Open creation modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  // Form states for creating simple invoices
  const [newInv, setNewInv] = useState({
    contractId: '',
    amount: 15000,
    type: 'rent' as 'rent' | 'utility_water' | 'utility_electricity' | 'maintenance_fee',
    dueDate: ''
  });

  // Form states for recording/linking a payment manually
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    method: 'mada' as 'mada' | 'apple_pay' | 'stc_pay' | 'credit_card' | 'bank_transfer',
    referenceNumber: '',
    bankName: 'مصرف الراجحي'
  });

  // Late fee tracking settings state
  const [lateFeeConfig, setLateFeeConfig] = useState<{ [invoiceId: string]: { rentSurcharge: number; daysFine: number } }>({});

  // Dynamic system calendar date
  const SYSTEM_TODAY = '2026-06-22';
  const today = new Date(SYSTEM_TODAY);

  // 15% Standard Saudi VAT calculations
  const calculateVat = (amount: number) => {
    return Math.round(amount * 0.15);
  };

  // Quick generate simple mock data invoices
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInv.contractId || !newInv.dueDate || !newInv.amount) {
      onTriggerAction('تنبيه التحقق ⚠️', 'الرجاء التأكد من ملء جميع الحقول: تحديد عقد الإيجار المستهدف، وتاريخ الاستحقاق.');
      return;
    }

    const selectedCon = contracts.find(c => c.id === newInv.contractId);
    const amountVal = Number(newInv.amount);
    const vatVal = calculateVat(amountVal);
    const totalVal = amountVal + vatVal;

    const added: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: 'INV-2026-N' + Math.floor(Math.random() * 9000 + 1000),
      contractId: newInv.contractId,
      tenantName: selectedCon ? selectedCon.tenantName : 'مستأجر مجهول الهوية',
      unitName: selectedCon ? selectedCon.unitName : 'وحدة عقارية عامة',
      issueDate: SYSTEM_TODAY,
      dueDate: newInv.dueDate,
      amount: amountVal,
      vatAmount: vatVal,
      totalAmount: totalVal,
      type: newInv.type,
      status: 'unpaid',
      zatcaQrCode: 'ZATCA_E_INVOICE_STAMP_HASH_' + Math.random().toString(36).substring(4).toUpperCase() + '_VERIFIED'
    };

    onAddInvoice(added);
    setIsAddOpen(false);
    onTriggerAction('إصدار فاتورة ضريبية 🧾', `تم إصدار السند المالي الموحد رقم ${added.invoiceNumber} شامل ضريبة القيمة المضافة 15%.`);
    setNewInv({
      contractId: '',
      amount: 15000,
      type: 'rent',
      dueDate: ''
    });
  };

  // Recording manual invoice payment action
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.invoiceId || !paymentForm.referenceNumber) {
      onTriggerAction('تنبيه التحقق ⚠️', 'الرجاء اختيار الفاتورة المستهدفة وإثبات رقم الحوالة mada للتسوية.');
      return;
    }

    const matchedInv = invoices.find(i => i.id === paymentForm.invoiceId);
    if (!matchedInv) return;

    // Build modern payment record
    const addedPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      paymentNumber: 'PAY-TXN-' + Math.floor(Math.random() * 90000 + 10000),
      invoiceId: paymentForm.invoiceId,
      invoiceNumber: matchedInv.invoiceNumber,
      amount: matchedInv.totalAmount,
      paymentDate: SYSTEM_TODAY,
      method: paymentForm.method,
      referenceNumber: paymentForm.referenceNumber,
      bankName: paymentForm.bankName,
      status: 'cleared'
    };

    onAddPayment(addedPayment);
    setIsPayOpen(false);
    onTriggerAction('استلام وتسوية السداد 💳', `تمت تصفية كامل قيمة الفاتورة ومطابقتها بالتسوية البنكية ${addedPayment.paymentNumber}.`);
    
    // Clear state
    setPaymentForm({
      invoiceId: '',
      method: 'mada',
      referenceNumber: '',
      bankName: 'مصرف الراجحي'
    });
  };

  // Automated Next-Month Billing preview list generator
  const triggerAutoBillingEngine = () => {
    // Collect active lease contracts with "monthly" or "quarterly" cycles
    const activeContracts = contracts.filter(c => c.status === 'active' && !c.isArchived);
    if (activeContracts.length === 0) {
      onTriggerAction('محرك الفوترة التلقائي 🔄', 'لا توجد عقود نشطة وموثقة حالياً لتسجيل مطابقة الفوترة السنوية.');
      return;
    }

    let generatedNum = 0;
    activeContracts.forEach(c => {
      // Create next billing due Date (e.g. 1 month from today)
      const nextDue = '2026-07-22';
      // Basic installment calculation depending on contract cycle
      const billAmount = c.billingCycle === 'monthly' ? Math.round(c.rentalAmount / 12) : 
                         c.billingCycle === 'quarterly' ? Math.round(c.rentalAmount / 4) : c.rentalAmount;

      const vatAmt = calculateVat(billAmount);
      const totalAmt = billAmount + vatAmt;

      const autoCreatedBill: Invoice = {
        id: 'auto-inv-' + Math.random().toString(36).substring(4),
        invoiceNumber: 'INV-AUTO-7-' + Math.floor(Math.random() * 90000 + 10000),
        contractId: c.id,
        tenantName: c.tenantName,
        unitName: c.unitName || 'تذكرة إيجارية عامة',
        issueDate: SYSTEM_TODAY,
        dueDate: nextDue,
        amount: billAmount,
        vatAmount: vatAmt,
        totalAmount: totalAmt,
        type: 'rent',
        status: 'unpaid',
        zatcaQrCode: 'ZATCA_AUTO_GENERATE_SCHEDULER_VERIFIED'
      };

      onAddInvoice(autoCreatedBill);
      generatedNum++;
    });

    onTriggerAction(
      'تشغيل محرك الفوترة التأسيسي ⚙️',
      `تم مراجعة صكوك الإيجار وإصدار ${generatedNum} فواتير دفعات دورية لشهر يوليو ومزامنتها مع المحفظة المالية.`
    );
  };

  // Days overdue helper (June 22, 2026)
  const getDaysOverdue = (dueDateStr: string) => {
    try {
      const dueDate = new Date(dueDateStr);
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  // Fine surcharge applier
  const applyOverdueFine = (invoiceId: string, customFineAmt: number) => {
    const originalInvoice = invoices.find(i => i.id === invoiceId);
    if (!originalInvoice) return;

    const baseFine = Number(customFineAmt);
    const updatedInvoice: Invoice = {
      ...originalInvoice,
      amount: originalInvoice.amount + baseFine,
      vatAmount: calculateVat(originalInvoice.amount + baseFine),
      totalAmount: (originalInvoice.amount + baseFine) + calculateVat(originalInvoice.amount + baseFine),
      status: 'overdue'
    };

    onAddInvoice(updatedInvoice); 
    onTriggerAction('تطبيق غرامة تأخير ⚠️', `تم تطبيق رسوم تأخير بقيمة ${baseFine} ر.س للفاتورة رقم ${originalInvoice.invoiceNumber} وإيرادها لقيمة التحصيل.`);
  };

  // Filtering invoices depending on the tabs and searches
  const getFilteredInvoices = () => {
    return invoices.filter(i => {
      const matchesSearch = 
        i.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.unitName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || i.type === typeFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'paid') matchesStatus = i.status === 'paid';
      if (statusFilter === 'unpaid') matchesStatus = i.status === 'unpaid';
      if (statusFilter === 'overdue') {
        const delays = getDaysOverdue(i.dueDate);
        matchesStatus = i.status !== 'paid' && delays > 0;
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  // Filtering payments history
  const getFilteredPayments = () => {
    return payments.filter(p => {
      return (
        p.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Arabic localization maps
  const getTypeText = (type: string) => {
    switch(type) {
      case 'rent': return 'إيجار سكني دوري 🏢';
      case 'utility_water': return 'فاتورة الشركة الوطنية للمياه 💧';
      case 'utility_electricity': return 'فاتورة الشركة السعودية للكهرباء ⚡';
      case 'maintenance_fee': return 'صيانة الخدمات المشتركة 🛠️';
      default: return 'رسوم عقارية عامة';
    }
  };

  const getStatusLabelText = (status: string, dueDate: string) => {
    if (status === 'paid') return 'مدفوعة ومستوطنة ✓';
    const delays = getDaysOverdue(dueDate);
    if (delays > 0) return `متأخرة عن الدورة (${delays} يوم) ⚠️`;
    return 'قيد الاستحقاق الدوري';
  };

  const getStatusBadgeStyle = (status: string, dueDate: string) => {
    if (status === 'paid') return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30';
    const delays = getDaysOverdue(dueDate);
    if (delays > 0) return 'bg-rose-950/30 text-rose-455 border border-rose-900/40 font-black animate-pulse';
    return 'bg-[#1E40AF]/10 text-blue-400 border border-blue-900/30';
  };

  // Aggregates computed on demand
  const totalInvoicedSum = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalReceivedSum = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const totalPendingInvoices = invoices.filter(i => i.status !== 'paid').length;
  const overdueInvs = invoices.filter(i => i.status !== 'paid' && getDaysOverdue(i.dueDate) > 0);
  const totalOverdueSum = overdueInvs.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Export functions (PDF report printing style simulation)
  const downloadPDFSummary = () => {
    window.print();
    onTriggerAction('تقرير كشف التحصيل PDF 📄', 'تم فتح واجهة الطباعة ومعالجة تصدير كشف الحساب والتحصيلات الضريبية.');
  };

  // Export CSV excel formatted file download simulation
  const downloadExcelCSV = () => {
    try {
      // Build simple CSV file string
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "رقم الفاتورة,المستأجر المكلف,الوحدة,قيمة السند,الضريبة,الإجمالي,نوع السند,حالة السداد,تاريخ الاستحقاق\n";
      
      invoices.forEach(inv => {
        csvContent += `"${inv.invoiceNumber}","${inv.tenantName}","${inv.unitName}",${inv.amount},${inv.vatAmount},${inv.totalAmount},"${inv.type}","${inv.status}","${inv.dueDate}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Rent_Collection_Ledger_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onTriggerAction('تصدير Excel ناجح 📊', 'تم توليد وتنزيل الجدول الضريبي الشامل بصيغة CSV المتوافقة مع Microsoft Excel.');
    } catch {
      onTriggerAction('تصدير Excel ⚠️', 'عفواً، فشل توليد كشف البيانات الضريبية، الرجاء مراجعة الصلاحيات الأمنية للمتصفح.');
    }
  };

  // Dispatch warnings to late tenants (simulated via WhatsApp/App notification actions)
  const dispatchLateWarning = (inv: Invoice, level: 'friendly' | 'final' | 'eviction') => {
    let title = '';
    let body = '';
    if (level === 'friendly') {
      title = 'تذكير ودي بالسداد 📢';
      body = `عزيزنا المستأجر ${inv.tenantName}، نود تذكيركم بلطف بقرب سداد الفاتورة لالتزام العقد ونهاية الدورة العقارية.`;
    } else if (level === 'final') {
      title = 'إنذار سداد ثانٍ حازم ⚠️';
      body = `مستند سداد متأخر: يرجى تسوية الفاتورة رقم ${inv.invoiceNumber} بقيمة ${inv.totalAmount} ر.س لتلافي تطبيق رسوم تأخير وغرامات لوائح إيجار.`;
    } else {
      title = 'إشطار إلغاء وإخلاء رسمي 🔒';
      body = `بموجب عقد الإيجار ذي الرقم الموحد، نبلغكم ببدء إجراءات الفصل القضائي لعدم سداد الإيجار المتأخر بقيمة ${inv.totalAmount} ر.س.`;
    }
    onTriggerAction(title, body);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* Module Title & Core Actions */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 flex-row-reverse`}>
            <span>محفظة تحصيل الإيجارات والدفعات</span>
            <Receipt className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-1">
            مواد الفوترة المتطورة: كشوف فواتير الأقساط، تتبع متأخرات الدفع، الربط الوطني mada، وتوليد إيصالات السداد والوصولات وصكوك الفواتير وتصديرها.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => {
              if (contracts.length === 0) {
                onTriggerAction('تنبيه النظام ⚠️', 'الرجاء صياغة عقد معتمد ذي صفة لتمكين الفوترة الموحدة.');
                return;
              }
              setNewInv(prev => ({ ...prev, contractId: contracts[0].id }));
              setIsAddOpen(true);
            }}
            className="bg-[#1E40AF] hover:bg-[#153185] text-white px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>إبرام فاتورة ضريبية</span>
          </button>

          <button
            onClick={() => {
              const unpaidInvs = invoices.filter(i => i.status !== 'paid');
              if (unpaidInvs.length === 0) {
                onTriggerAction('لا توجد مستحقات معلقة ⚠️', 'جميع الفواتير الضريبية تم سدادها بالكامل ولا تحتاج تسوية مالية حالية.');
                return;
              }
              setPaymentForm(prev => ({ ...prev, invoiceId: unpaidInvs[0].id }));
              setIsPayOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" />
            <span>تسجيل استلام دفعة</span>
          </button>

        </div>
      </div>

      {/* Aggregate KPI Grid widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} text-right space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-blue-900/10 rounded-xl border border-blue-900/30 text-blue-500">
              <FileText className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">الفوترة الإجمالية الجارية</span>
          </div>
          <div>
            <span className={`text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalInvoicedSum.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">ر.س ريع الفواتير</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} text-right space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-emerald-900/10 rounded-xl border border-emerald-900/30 text-emerald-500">
              <CheckCircle className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-[#00E676] font-black tracking-widest uppercase">المحصل الفعلي (مستوطنة)</span>
          </div>
          <div>
            <span className="text-xl font-black font-mono text-emerald-400">
              {totalReceivedSum.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">ر.س مستقرة بالبنوك</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} text-right space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-amber-950/20 rounded-xl border border-amber-900 text-amber-500 animate-pulse">
              <Clock className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-amber-500 font-black tracking-widest uppercase">الفواتير المستحقة والمعلقة</span>
          </div>
          <div>
            <span className="text-xl font-black font-mono text-amber-400">
              {totalPendingInvoices}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">أدوات تحصيل جارية</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-800' : 'bg-white border-slate-200'} text-right space-y-2`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="p-2 bg-rose-950/40 rounded-xl border border-rose-900 text-rose-500">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <span className="text-[9px] text-rose-500 font-black tracking-widest uppercase">المتأخرات وغرامات المطالبة</span>
          </div>
          <div>
            <span className="text-xl font-black font-mono text-rose-500">
              {totalOverdueSum.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-1">ر.س متأخرات حتمية</span>
          </div>
        </div>

      </div>

      {/* Primary Sub-Navigation Tabs inside module */}
      <div className={`p-2 rounded-2xl border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} flex flex-wrap gap-1 items-center justify-start`}>
        
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'invoices' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>🧾 كشف الفواتير والتحصيلات</span>
        </button>

        <button
          onClick={() => setActiveTab('recurring')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'recurring' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>🔄 الفوترة الدورية المبرمجة</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'payments' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          <span>💳 وصولات ودفاتر السداد ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('late-tracking')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'late-tracking' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          <span>⏰ تتبع المتأخرات الإيجارية وغراماتها</span>
        </button>

        <button
          onClick={() => setActiveTab('export-center')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'export-center' 
              ? 'bg-blue-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>📊 تصدير البيانات والتقارير المالية</span>
        </button>

      </div>

      {/* TAB SUB-SECTIONS CONTENT */}

      {/* 1. TAB: MAIN INVOICES LIST */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          
          {/* Internal filters toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="البحث بالاسم، برقم الفاتورة ضريبياً..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-10 pl-4 py-3 rounded-xl text-xs font-bold ${
                  isDark 
                    ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-350'
                } border focus:outline-none transition-all`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end w-full md:w-auto text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-3 py-2.5 rounded-xl font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                } border focus:outline-none`}
              >
                <option value="all">كل حالات السداد 🔖</option>
                <option value="paid">مدفوعة ومستوطنة فعلياً ✓</option>
                <option value="unpaid">فواتير معلقة (غير مدفوعة)</option>
                <option value="overdue">فواتير متأخرة السداد تجاوزت التاريخ ⚠️</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-xl font-bold ${
                  isDark ? 'bg-[#020617] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                } border focus:outline-none`}
              >
                <option value="all">كل الفئات (إيجارات وصيانة ومرافق)</option>
                <option value="rent">دفعات الإيجار الأساسية</option>
                <option value="utility_water">مستهلكات المياه الوطنية 💧</option>
                <option value="utility_electricity">عدادات الكهرباء السعودية ⚡</option>
                <option value="maintenance_fee">رسوم صيانة ونظافة المرافق 🛠️</option>
              </select>
            </div>

          </div>

          {/* Grid output */}
          {getFilteredInvoices().length === 0 ? (
            <div className={`p-16 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
              <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="font-extrabold text-xs text-slate-300">لم يتم العثور على أي فواتير مطابقة</h3>
              <p className="text-[11px] text-slate-400 mt-1">حاول تفريغ عوامل التصفية السباكية أو محرك البحث.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredInvoices().map(inv => (
                <div
                  key={inv.id}
                  className={`rounded-2xl p-5 border text-right space-y-4 transition-all ${
                    isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${getStatusBadgeStyle(inv.status, inv.dueDate)}`}>
                      {getStatusLabelText(inv.status, inv.dueDate)}
                    </span>
                    <div className="text-right">
                      <span className={`font-black tracking-tight text-xs font-mono block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[9px] text-yellow-500 font-bold block mt-0.5">{getTypeText(inv.type)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div>المستأجر المكلف: <span className="font-black text-slate-300 block">{inv.tenantName}</span></div>
                    <div>مكان الإقامة: <span className="text-slate-300 block font-semibold text-[11px] truncate leading-tight">{inv.unitName}</span></div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] p-2 bg-slate-950/25 border border-slate-900 rounded-lg">
                      <span>إقرار: {inv.issueDate}</span>
                      <span className="text-rose-400 font-bold">استحقاق: {inv.dueDate}</span>
                    </div>
                  </div>

                  {/* Pricing table summary */}
                  <div className={`p-3 rounded-xl grid grid-cols-3 gap-2 text-center text-xs font-mono ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}>
                    <div>
                      <span className="text-[9px] font-sans block text-slate-500 mb-0.5">القيمة</span>
                      <span className="font-bold block text-slate-300">{inv.amount}</span>
                    </div>
                    <div className="border-r border-slate-850">
                      <span className="text-[9px] font-sans block text-slate-500 mb-0.5">ضريبة 15%</span>
                      <span className="font-bold block text-slate-300">{inv.vatAmount}</span>
                    </div>
                    <div className="border-r border-[#00e676]/20 bg-[#00E676]/5 rounded-lg p-0.5">
                      <span className="text-[8.5px] font-sans block text-emerald-400 mb-0.5">الإجمالي</span>
                      <span className="font-extrabold block text-emerald-400 text-xs">{inv.totalAmount}</span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/10 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className={`p-2 rounded-xl border ${isDark ? 'border-slate-850 text-slate-300 hover:text-white' : 'border-slate-200 text-slate-700'}`}
                        title="معاينة وطباعة الفاتورة"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        title="حذف الفاتورة"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => onPayInvoice(inv.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 font-sans font-black text-[9.5px] px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer text-slate-950"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>تحصيل واستلام كاش</span>
                      </button>
                    ) : (
                      <span className="text-emerald-500 text-[10px] font-black bg-emerald-900/10 border border-emerald-990 px-2 py-1 rounded-lg">
                        مستوطنة بالكامل ✓
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 2. TAB: RECURRING BILLING AND AUTO SCHEDULER */}
      {activeTab === 'recurring' && (
        <div className="space-y-6">
          
          <div className={`p-6 rounded-[24px] border ${isDark ? 'bg-gradient-to-l from-indigo-950/20 to-transparent border-indigo-900/30' : 'bg-indigo-50/50 border-indigo-100'} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
            <div className="text-right">
              <h3 className="font-black text-sm text-indigo-400">محرك الفوترة الدورية الآلي (SaaS Recurring Billing Engine)</h3>
              <p className="text-[11px] text-slate-450 mt-1">
                يفحص النظام دورات العقود الإيجارية المبرمة وينشئ آلياً المطالبات المالية المستحقة في اليوم الأول لكل شهر مع إضافة نسب ضريبة المضافة الرسمية 15% وإرسال تنبيه آمن للمستأجر.
              </p>
            </div>
            <button
              onClick={triggerAutoBillingEngine}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10 shrink-0"
            >
              🚀 تشغيل مولد فواتير الشهر القادم آلياً
            </button>
          </div>

          {/* Active Schedules Table */}
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} overflow-x-auto overflow-y-hidden`}>
            <h4 className="font-black text-xs text-slate-400 mb-4 block">مسارات وجدولة الفوترة النشطة بموجب عقود المستأجرين</h4>
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/10 font-bold">
                  <th className="pb-3 text-right">صك عقد إيجار</th>
                  <th className="pb-3 text-right">المستأجر الطرف الآخر</th>
                  <th className="pb-3 text-center">الفوترة ونطاق التحصيل</th>
                  <th className="pb-3 text-left">التكلفة وال installment ر.س</th>
                  <th className="pb-3 text-left">الدورة القادمة المستهدفة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 font-medium">
                {contracts.filter(c => c.status === 'active' && !c.isArchived).map(c => {
                  const monthlyInstallment = c.billingCycle === 'monthly' ? Math.round(c.rentalAmount / 12) : 
                                             c.billingCycle === 'quarterly' ? Math.round(c.rentalAmount / 4) : c.rentalAmount;
                  return (
                    <tr key={c.id} className={`border-b border-dashed ${isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900/10' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      <td className={`py-3.5 text-right font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{c.contractNumber}</td>
                      <td className="py-3.5 text-right font-black">{c.tenantName}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[9.5px] ${isDark ? 'bg-blue-950/40 text-blue-400 border-blue-900/30' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {c.billingCycle === 'monthly' ? 'أقساط شهرية مكررة' : 
                           c.billingCycle === 'quarterly' ? 'تحصيل ربع سنوي' : 'دورة سنوية مقدمة'}
                        </span>
                      </td>
                      <td className={`py-3.5 text-left font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{(monthlyInstallment).toLocaleString()} ر.س</td>
                      <td className="py-3.5 text-left font-sans text-slate-400 p-1">أول شهر يوليو ٢٠٢٦</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. TAB: PAYMENTS TRACKING LEDGER AND RECEIPTS SECTION */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="البحث برقم مرجع mada، أو رقم الحوالة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-10 pl-4 py-3 rounded-xl text-xs font-bold ${
                  isDark 
                    ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                } border focus:outline-none`}
              />
            </div>
          </div>

          {/* Grid output */}
          {getFilteredPayments().length === 0 ? (
            <div className={`p-16 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
              <Landmark className="h-12 w-12 text-slate-550 mx-auto mb-4" />
              <h3 className="font-extrabold text-xs text-slate-100">لم يتم رصد أي تسويات بنكية جارية</h3>
              <p className="text-[11px] text-slate-400 mt-1">اضغط على زر "تسجيل استلام دفعة" بالطوق العلوي لإرسال تسوية سند مالي جديد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPayments().map(pay => (
                <div
                  key={pay.id}
                  className={`rounded-2xl p-5 border text-right space-y-4 transition-all ${
                    isDark ? 'bg-[#050C16] border-slate-850 hover:border-slate-800' : 'bg-white border-slate-202'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/30 text-[9px] font-black">
                      ثابت معتمد بالدفعية ✓
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-slate-300 block">{pay.paymentNumber}</span>
                      <span className="text-[9.5px] text-indigo-400 font-bold mt-0.5 block">عبر: {pay.method === 'mada' ? 'بوابة مدى الوطنية (Mada)' : 
                                                                                            pay.method === 'apple_pay' ? 'الشبكة الفورية Apple Pay ' : 
                                                                                            pay.method === 'stc_pay' ? 'محفظة stc pay' : 'تحويل آيبان بنكي مباشر 🏦'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div>الفاتورة الضريبية المقيدة: <span className="font-mono text-slate-300 font-bold block">{pay.invoiceNumber}</span></div>
                    <div>تاريخ التسوية الفورية: <span className="font-mono text-slate-300 font-bold block">{pay.paymentDate}</span></div>
                    <div>الرقم المرجعي للحوالة: <span className="font-mono text-emerald-450 font-bold block">{pay.referenceNumber}</span></div>
                    {pay.bankName && <div>البنك المستقبل: <span className="font-sans text-slate-350 block">{pay.bankName}</span></div>}
                  </div>

                  {/* Payment Amount Display */}
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs">
                    <span className="text-slate-500 font-bold block mb-0.5">مجموع المحصل المستوطن بالريال</span>
                    <span className="font-mono text-base font-extrabold text-emerald-400">{(pay.amount).toLocaleString()} ر.س</span>
                  </div>

                  {/* Actions Receipt */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/10 text-xs">
                    <button
                      onClick={() => setSelectedPaymentForReceipt(pay)}
                      className="text-blue-450 font-black hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Receipt className="h-4 w-4 text-blue-500" />
                      <span>توليد ومعاينة سند الاستلام الفوري (سند قبض)</span>
                    </button>

                    <button
                      onClick={() => onDeletePayment(pay.id)}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      title="سحب سند الدفع"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 4. TAB: LATE PAYMENTS TRACKING & FINES CALCULATOR */}
      {activeTab === 'late-tracking' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: List of overdue invoices */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs text-rose-500 block mb-2">الفواتير المستحقة والمتأخرة عن دورة السداد (Unpaid or Overdue Invoices)</h4>
              
              {invoices.filter(i => i.status !== 'paid').length === 0 ? (
                <div className={`p-12 rounded-[24px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <span className="font-black text-xs text-slate-300 block">لا توجد فواتير أو متأخرات معلقة حالياً!</span>
                  <p className="text-[11px] text-slate-400 mt-1">نهنئك، جميع الملتزمين مسددين عقود الضيافة والفوائد بالكامل.</p>
                </div>
              ) : (
                invoices.filter(i => i.status !== 'paid').map(inv => {
                  const delays = getDaysOverdue(inv.dueDate);
                  return (
                    <div
                      key={inv.id}
                      className={`p-5 rounded-2xl border ${
                        delays > 0 ? 'border-rose-950 bg-gradient-to-l from-[#0e0303] to-transparent' : isDark ? 'bg-[#050C16] border-slate-855' : 'bg-white border-slate-200'
                      } flex flex-col md:flex-row md:items-center justify-between gap-4 text-right`}
                    >
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 flex-row-reverse justify-end">
                          <span className={`font-mono font-black text-rose-400 blockUnderline`}>{inv.invoiceNumber}</span>
                          <span className="text-[9px] text-[#C5A880] font-bold">({getTypeText(inv.type)})</span>
                        </div>
                        <div>المقيم الحامل: <span className="text-white font-extrabold">{inv.tenantName}</span></div>
                        <div className="text-[10px] text-slate-400">تاريخ الاستحقاق: <span className="font-mono text-rose-450 font-bold">{inv.dueDate}</span></div>
                        
                        {delays > 0 && (
                          <div className="text-rose-500 font-black text-[10.5px] mt-1 flex items-center gap-1 flex-row-reverse justify-end">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>تجاوز الاستحقاق بـ {delays} يوماً متواصلة</span>
                          </div>
                        )}
                      </div>

                      {/* Overdue Total Amount and Fine Application action */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-left">
                        <div className="text-right sm:text-left pr-4">
                          <span className="text-[10px] text-slate-500 block font-bold">قيمة المطالبة شاملة VAT</span>
                          <span className="font-mono text-base font-black text-slate-250">{(inv.totalAmount).toLocaleString()} ر.س</span>
                        </div>

                        {/* Reminders & Fines options container */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => applyOverdueFine(inv.id, 500)}
                            className="bg-rose-950/40 text-rose-400 hover:bg-rose-950 border border-rose-900/40 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all"
                            title="إضافة غرامة تأخير بقيمة 500 ريال سعودي"
                          >
                            + إضافة غرامة (500 ر.س)
                          </button>

                          <button
                            onClick={() => dispatchLateWarning(inv, 'friendly')}
                            className="bg-slate-900 hover:bg-slate-850 text-slate-350 px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            تنبيه ودي
                          </button>

                          <button
                            onClick={() => dispatchLateWarning(inv, 'final')}
                            className="bg-amber-950/20 hover:bg-amber-950/40 text-amber-500 px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            إنذار نهائي ⚠️
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}

            </div>

            {/* Right Column: Regulations & Penalties Guide */}
            <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4 text-slate-300 text-xs`}>
              <h3 className="font-black text-[#1E40AF] text-sm flex items-center gap-1.5 flex-row-reverse">
                <ShieldAlert className="h-5 w-5" />
                <span>دليل لوائح إيجار والغرامات للمتأخرات</span>
              </h3>
              <p className="leading-relaxed text-slate-400">
                بموجب قرار مجلس الوزراء والشبكة الوطنية لخدمات الإيجار في المملكة العربية السعودية:
              </p>
              <ul className="space-y-2 pr-4 lists font-medium text-slate-400">
                <li className="list-disc leading-relaxed">يعتبر صك عقد الإيجار الموحد سنداً تنفيذياً قابلاً للاستيفاء المباشر عبر محاكم التنفيذ السعودية.</li>
                <li className="list-disc leading-relaxed">يمهل المقيم المتأخر عن دفع الإيجار مدة ١٥ يوماً من تاريخ التنبيه الرسمي قبل إثبات الفصل بمحكمة الإخلاء والقرارات.</li>
                <li className="list-disc leading-relaxed">يجوز إدراج تصفية مضافة أو غرامات تشغيلية صكوك الصيانة إذا ما تم تعهد ذلك مسبقاً بموجب الملحق التعاقدي.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-900/30 text-orange-400 mt-4 leading-normal font-semibold">
                ملاحظة: تأكد دائماً من صياغة إشعار المطالبة والود بالمنصات الموثقة للتحوز على الحقوق الكاملة.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. TAB: EXPORT CENTER (EXCEL & PDF REPORTS) */}
      {activeTab === 'export-center' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Export Sheet Card */}
            <div className={`p-6 rounded-[24px] border ${isDark ? 'bg-[#050C16] text-white border-slate-850' : 'bg-white border-slate-200'} text-right space-y-4`}>
              <div className="p-3 bg-blue-900/10 rounded-2xl border border-blue-900/30 text-blue-500 w-12 h-12 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-200">تصدير الجدول المالي الشامل (Excel / CSV)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  توليد ملف بيانات فوري متوافق مع جداول مايكروسوفت إكسل يتضمن كامل البيانات الحالية: رقم الفاتورة، تاريخ الإصدار، تفاصيل القيمة الضريبية المستحقة للزكاة ومقدار المحصل ومطابقات مدى.
                </p>
              </div>
              <button
                onClick={downloadExcelCSV}
                className="w-full bg-[#1e40af] text-white font-black text-xs py-3 rounded-2xl cursor-pointer hover:bg-blue-750 transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>تحميل الجدول لبرنامج الإكسل (SaaSDoc-Excel)</span>
              </button>
            </div>

            {/* Print Tax Report PDF Card */}
            <div className={`p-6 rounded-[24px] border ${isDark ? 'bg-[#050C16] text-white border-slate-800' : 'bg-white border-slate-200'} text-right space-y-4`}>
              <div className="p-3 bg-red-950/30 rounded-2xl border border-red-900 w-12 h-12 flex items-center justify-center text-rose-500">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>طباعة كشف ميزانية التحصيلات والضرائب (PDF Book)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  إنشاء مستند ملخص مالي كامل مهيأ للطباعة يحوي التقارير التحليلية، وحجم المحصل، ونسب الفائت والضرائب الضريبية المترتبة، وصالح للإدراج في موازنات المحاسب المعتمد.
                </p>
              </div>
              <button
                onClick={downloadPDFSummary}
                className="w-full bg-[#1E40AF] text-white font-black text-xs py-3 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>تحميل وطباعة كشف الحساب الفوري (PDF)</span>
              </button>
            </div>

          </div>

          {/* Aggregated Analytical Table Summary preview */}
          <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} space-y-4`}>
            <h4 className="font-black text-xs text-slate-400 blockUnderline">معاينة جداول الميزانية والتراكم المترتب لموسم ٢٠٢٦</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">صافي ريع القيمة الخاضعة للضريبة</span>
                <span className="font-mono text-base font-extrabold text-white">{(totalInvoicedSum - calculateVat(totalInvoicedSum)).toLocaleString()} ر.س</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">مجموع مبالغ ضريبة القيمة المضافة ZATCA (15%)</span>
                <span className="font-mono text-base font-extrabold text-yellow-500">{calculateVat(totalInvoicedSum).toLocaleString()} ر.س</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">المحفظة السائلة الكلية (سداد وحوالات)</span>
                <span className="font-mono text-base font-extrabold text-emerald-400">{totalReceivedSum.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CREATE NEW TAX INVOICE OVERLAY DIALOG */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-[28px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right`}
            >
              
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400"
                >
                  ✖
                </button>
                <h3 className="font-black text-sm text-slate-200 flex items-center gap-1.5 flex-row-reverse">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>🆕 إصدار فاتورة ضريبية موحدة جديدة</span>
                </h3>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-450 block mb-1.5">عقد الإيجار المرتبط بالفاتورة</label>
                  <select
                    value={newInv.contractId}
                    onChange={(e) => setNewInv({ ...newInv, contractId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                      isDark ? 'bg-[#02050f] border-slate-850 text-white focus:border-slate-705' : 'bg-white border-slate-200 text-slate-950'
                    } border`}
                  >
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>العقد: {c.contractNumber} - المستأجر: {c.tenantName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 block mb-1.5">طبيعة وقيد الفاتورة</label>
                    <select
                      value={newInv.type}
                      onChange={(e) => setNewInv({ ...newInv, type: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                        isDark ? 'bg-[#02050f] border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-955'
                      } border`}
                    >
                      <option value="rent">قسط إيجار دوري</option>
                      <option value="utility_water">مستهلكات فاتورة مياه</option>
                      <option value="utility_electricity">مستهلكات فاتورة كهرباء</option>
                      <option value="maintenance_fee">رسوم خدمات صيانة النظافة</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 block mb-1.5">تاريخ الاستحقاق (سداد قبل)</label>
                    <input
                      type="date"
                      required
                      value={newInv.dueDate}
                      onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#02050f] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-450 block mb-1.5 font-sans">القيمة الأساسية للخضوع للضريبة (قبل 15% VAT)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-black font-mono ${
                      isDark ? 'bg-[#02050f] border-slate-800 text-white focus:border-slate-701' : 'bg-slate-50 border-slate-250 text-slate-950'
                    } border focus:outline-none`}
                  />
                  <div className="text-[9.5px] text-slate-500 font-semibold block mt-1 leading-normal text-right">
                    * يقوم النظام تلقائياً بحساب ضريبة القيمة المضافة بقيمة {calculateVat(Number(newInv.amount || 0))} ر.س وتشفير الرمز الزكوي ZATCA.
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/10">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 bg-slate-900 hover:bg-slate-850"
                  >
                    تراجع
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    توثيق وإصدار المستند
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECORD/LINK PAYMENT TRANSACTION MANUAL OVERLAY DIALOG */}
      <AnimatePresence>
        {isPayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-[28px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right`}
            >
              
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setIsPayOpen(false)} className="p-1.5 hover:bg-slate-900 rounded-xl text-slate-400">✖</button>
                <h3 className="font-black text-xs text-slate-200 flex items-center gap-1.5 flex-row-reverse">
                  <Landmark className="h-5 w-5 text-emerald-505" />
                  <span>💳 ربط وتسجيل حوالة سداد يدوي (تحصيل)</span>
                </h3>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-450 block mb-1.5">اختر الفاتورة المستهدفة للمطابقة والتحصيل</label>
                  <select
                    value={paymentForm.invoiceId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-black ${
                      isDark ? 'bg-[#02050f] border-slate-850 text-white focus:border-slate-705' : 'bg-white border-slate-205 text-slate-950'
                    } border`}
                  >
                    {invoices.filter(i => i.status !== 'paid').map(i => (
                      <option key={i.id} value={i.id}>
                        مكلف: {i.tenantName} - فاتورة: {i.invoiceNumber} (إجمالي: {i.totalAmount} ر.س)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-455 block mb-1.5">قناة وبوابة المقاصة البنكية</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#02050f] border-slate-850 text-white' : 'bg-white border-slate-220 text-slate-950'
                      } border`}
                    >
                      <option value="mada">مدى (mada) 🇸🇦</option>
                      <option value="apple_pay">Apple Pay </option>
                      <option value="stc_pay">stc pay 📱</option>
                      <option value="bank_transfer font-sans">تحويل عبر الآيبان (IBAN)</option>
                      <option value="credit_card">بطاقات ائتمانية (Visa/MC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-455 block mb-1.5">البنك الشريك المستلم</label>
                    <input
                      type="text"
                      required
                      value={paymentForm.bankName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold ${
                        isDark ? 'bg-[#02050f] border-slate-800 text-white' : 'bg-slate-50 border-slate-180 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-455 block mb-1.5 font-mono">رقم المرجع المصرفي أو رقم حوالة Mada (Reference No)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: TXN98327492A"
                    value={paymentForm.referenceNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold font-mono ${
                      isDark ? 'bg-[#02050f] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    } border focus:outline-none`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/10">
                  <button
                    type="button"
                    onClick={() => setIsPayOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 bg-slate-900 hover:bg-slate-850"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    إتمام التسوية المالية ومطابقتها
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* printable official simplifed ZATCA TAX INVOICE */}
      <AnimatePresence>
        {selectedInvoiceForPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl p-6 sm:p-10 bg-white text-slate-900 shadow-2xl relative text-right flex flex-col font-sans"
            >
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-8 border-b border-dashed border-slate-200">
                <div className="flex flex-col text-right">
                  <h1 className="text-xl font-black text-blue-800 font-sans">النعام للخدمات والضيافة العقارية Premium</h1>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">سجل مالي مركزي: CR-101002441-S</span>
                  <span className="text-[10px] text-slate-500 font-bold">الرقم الضريبي VAT: 31089241500003</span>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">المحفظة: صكوك الرياض - حي الملقا طريق الملك فهد</span>
                </div>

                <div className="text-left flex flex-col items-start">
                  <span className="bg-blue-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-black">
                    Simplified Tax Invoice | فاتورة ضريبية مبسطة
                  </span>
                  <span className="font-mono text-xs font-black text-slate-900 mt-2 block">No: {selectedInvoiceForPrint.invoiceNumber}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">تاريخ التحرير: {selectedInvoiceForPrint.issueDate}</span>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 py-6 text-xs text-right border-b border-slate-100">
                <div>
                  <span className="text-slate-450 font-bold block mb-1 text-[10px]">العميل / الطرف المستأجر المكلف</span>
                  <span className="text-sm font-black text-slate-900 block">{selectedInvoiceForPrint.tenantName}</span>
                  <span className="text-[9px] block text-slate-400 mt-1 font-mono">ID: MOCK-NATIONAL-ID-{selectedInvoiceForPrint.contractId.substring(0,8)}</span>
                </div>
                <div>
                  <span className="text-slate-450 font-bold block mb-1 text-[10px]">موقع الإقامة (الوحدة السكنية والمرافق)</span>
                  <span className="text-xs text-slate-800 font-bold leading-relaxed">{selectedInvoiceForPrint.unitName}</span>
                </div>
              </div>

              {/* Item details */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs font-bold my-4">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px]">
                      <th className="p-3">شرح البند التعاقدي والمطالبات</th>
                      <th className="p-3 text-center">الكمية</th>
                      <th className="p-3 text-left">مبلغ التكلفة قبل VAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 leading-normal">
                        <span className="font-black text-slate-900 block">{getTypeText(selectedInvoiceForPrint.type)}</span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-normal">مطالبات الإشغال المتوافقة مع عقود منصة إيجار الوطنية</span>
                      </td>
                      <td className="p-3 text-center font-mono font-medium">١ دفعة مبرمة</td>
                      <td className="p-3 text-left font-mono">{(selectedInvoiceForPrint.amount).toLocaleString()} ر.س</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* QR and summary */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-6 pt-4 border-t border-dashed border-slate-100">
                
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shrink-0 w-44">
                  <div className="h-28 w-28 bg-white border border-slate-200 flex items-center justify-center rounded-xl p-1 relative">
                    <QrCode className="h-full w-full text-slate-900" />
                  </div>
                  <span className="text-[8px] text-slate-400 font-black mt-2 text-center block">هيئة الزكاة والضريبة والجمارك 🇸🇦</span>
                </div>

                <div className="flex-1 space-y-2 text-xs font-bold text-left font-mono">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>المبلغ غير شامل القيمة المضافة:</span>
                    <span>{(selectedInvoiceForPrint.amount).toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>ضريبة القيمة المضافة VAT (15%):</span>
                    <span>{(selectedInvoiceForPrint.vatAmount).toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 text-sm font-black text-slate-900">
                    <span className="font-sans">التحصيل شامل الضريبة (SAR):</span>
                    <span className="text-blue-800">{(selectedInvoiceForPrint.totalAmount).toLocaleString()} ريال سعودي</span>
                  </div>
                </div>

              </div>

              {/* dialog controls */}
              <div className="flex justify-center gap-3 pt-8 mt-6 border-t border-dashed border-slate-200 text-xs">
                <button
                  onClick={() => {
                    window.print();
                    onTriggerAction('طباعة فاتورة', `برمجة طباعة الفاتورة الضريبية رقم ${selectedInvoiceForPrint.invoiceNumber}`);
                  }}
                  className="bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>طباعة المستند الضريبي (CTRL+P)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer"
                >
                  الخروج والمعاينة
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GENERATE OFFICIAL PAYMENT RECEIPT OVERLAY DIALOG */}
      <AnimatePresence>
        {selectedPaymentForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl p-6 sm:p-10 bg-white text-slate-900 shadow-2xl relative text-right flex flex-col font-sans border-t-8 border-emerald-500"
            >
              
              <div className="flex justify-between items-start pb-6 border-b border-dashed border-slate-200">
                <div className="text-right">
                  <h2 className="text-xl font-black text-emerald-600">سند قبض مالي معتمد (Official Payment Receipt)</h2>
                  <span className="text-[10px] text-slate-550 block font-bold mt-1">النعام لإدارة وضيافة المرافق العقارية الموحدة</span>
                  <span className="text-[9px] text-slate-400 block font-mono">رقم السند: {selectedPaymentForReceipt.paymentNumber}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-500">
                  <Receipt className="h-8 w-8" />
                </div>
              </div>

              <div className="py-6 space-y-4 text-xs font-bold leading-relaxed text-slate-800 text-right">
                
                <p>
                  يقر مستودع المحاسبة العقارية لشركة النعام باستلام ومكاملة معالجة الدفعة المالية المذكورة محدداتها أدناه:
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[10px]">استلمنا من المستأجر:</span>
                      <span className="text-slate-900 text-sm font-black">مستأجر موثق بالآيبان</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">بتاريخ تسوية السداد:</span>
                      <span className="font-mono text-slate-900 block">{selectedPaymentForReceipt.paymentDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[10px]">طريقة ووسيلة التحصيل:</span>
                      <span className="text-emerald-600 block">
                        {selectedPaymentForReceipt.method === 'mada' ? 'بوابة mada السعودية' : 
                         selectedPaymentForReceipt.method === 'apple_pay' ? 'التحصيل عبر Apple Pay' : 
                         selectedPaymentForReceipt.method === 'bank_transfer' ? 'تحويل المصرفية الوطنية' : 'الرصيد المشترك للبطاقات ائتمان'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">الرقم المرجعي ومطابقة الحوالة:</span>
                      <span className="font-mono text-slate-900 block">{selectedPaymentForReceipt.referenceNumber}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">لإبراء حساب ذمة الفاتورة الضريبة الموحدة:</span>
                    <span className="font-mono text-[#1E40AF] block font-black">{selectedPaymentForReceipt.invoiceNumber}</span>
                  </div>
                </div>

                <div className="text-center p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono">
                  <span className="text-xs font-sans text-slate-600 block font-bold mb-1">صافي المبلغ المقبوض والمستلم بالتسوية والآيبان</span>
                  <span className="text-2xl font-black">{(selectedPaymentForReceipt.amount).toLocaleString()} ريال سعودي</span>
                </div>

              </div>

              <div className="flex justify-center gap-3 pt-8 border-t border-dashed border-slate-200 text-xs">
                <button
                  onClick={() => {
                    window.print();
                    onTriggerAction('طباعة سند قبض', 'جاري تحضير ملف الطباعة لسند القبض المعتمد.');
                  }}
                  className="bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#153185] transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>طباعة وتحويل لـ (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentForReceipt(null)}
                  className="bg-slate-100 text-slate-705 px-5 py-2.5 rounded-xl font-sans font-bold cursor-pointer"
                >
                  إغلاق السند
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
