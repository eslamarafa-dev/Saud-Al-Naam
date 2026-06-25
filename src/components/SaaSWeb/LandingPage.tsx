/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Sliders, CheckCircle, TrendingUp, Users, 
  MessageSquare, Lock, Shield, ArrowLeft, Star, HelpCircle, 
  ChevronDown, Phone, Mail, Globe, Sparkles, MapPin, DollarSign,
  Calendar, FileText, ArrowRight, Share2, Sparkle, AppWindow,
  Activity, Bell, Send, CheckCircle2, Check, Eye, EyeOff, X, User
} from 'lucide-react';
import { SaasLead } from '../../types';
import { SaudAlNaamLogo } from '../SaudAlNaamLogo';

// High-fidelity replica of the premium "سعود النعام للخدمات العقارية" Logo Seal from the screenshot
export function BrandLogoSvg({ 
  className = "h-11 w-auto",
  imgClassName = "",
  imgStyle = {},
  darkBg = true,
  style = {}
}: { 
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  darkBg?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <SaudAlNaamLogo 
      className={className} 
      showText={false} 
      darkBg={darkBg} 
      imgClassName={imgClassName}
      imgStyle={imgStyle}
      style={style}
    />
  );
}

interface LandingPageProps {
  onStartTrial: (plan: 'starter' | 'pro' | 'enterprise') => void;
  onNavigateToDashboard: () => void;
  onNavigateToDemoGuide: () => void;
  onLoginSuccess?: (user: { fullName: string; email: string; phone: string }) => void;
}

export default function LandingPage({ onStartTrial, onNavigateToDashboard, onNavigateToDemoGuide, onLoginSuccess }: LandingPageProps) {
  // Calculator States
  const [city, setCity] = useState<'Riyadh' | 'Jeddah' | 'AlUla' | 'Khobar' | 'Abha'>('Riyadh');
  const [unitType, setUnitType] = useState<'chalet' | 'apartment' | 'villa'>('chalet');
  const [unitsCount, setUnitsCount] = useState<number>(3);
  const [avgNightPrice, setAvgNightPrice] = useState<number>(1000);
  const [occupancyRate, setOccupancyRate] = useState<number>(65);

  // Active showcase tab
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'calendar' | 'whatsapp' | 'pricing'>('calendar');
  
  // Interactive mini-simulator states inside showcase
  const [whatsappStep, setWhatsappStep] = useState<number>(0);
  const [pricingMultiplier, setPricingMultiplier] = useState<'normal' | 'weekend' | 'season'>('normal');

  // Leads state
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    city: 'Riyadh',
    unitsCount: 5,
    selectedPlan: 'pro' as 'starter' | 'pro' | 'enterprise'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Authentication Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccMsg, setAuthSuccMsg] = useState('');
  const [authError, setAuthError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [notifsAccepted, setNotifsAccepted] = useState(true);

  // Auth interaction wrappers
  const handleDashboardAccess = () => {
    const savedUser = localStorage.getItem('saas_current_user');
    if (savedUser) {
      onNavigateToDashboard();
    } else {
      setAuthTab('signup');
      setAuthError('');
      setAuthSuccMsg('');
      setShowAuthModal(true);
    }
  };

  const handleLoginClick = () => {
    const savedUser = localStorage.getItem('saas_current_user');
    if (savedUser) {
      onNavigateToDashboard();
    } else {
      setAuthTab('login');
      setAuthError('');
      setAuthSuccMsg('');
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccMsg('');

    // Pre-validations
    if (!authPhone) {
      setAuthError('الرجاء إدخال رقم الجوال للربط والتنبيهات المباشرة.');
      return;
    }
    if (!authEmail) {
      setAuthError('الرجاء إدخال بريد إلكتروني صحيح لتأمين اتصالات الدفع.');
      return;
    }
    if (!authName) {
      setAuthError('الرجاء إدخال الاسم الكريم للتخصيص.');
      return;
    }

    if (authTab === 'signup') {
      if (!termsAccepted) {
        setAuthError('يجب الموافقة على الشروط والأحكام و سياسة الخصوصية للاستمرار.');
        return;
      }
      if (authPassword && authPassword.length < 8) {
        setAuthError('يجب أن تكون كلمة المرور ٨ أحرف على الأقل لحماية بيانات العقارات الخاصة بك.');
        return;
      }
    }

    setAuthLoading(true);

    const apiEndpoint = authTab === 'signup' ? '/api/auth/register' : '/api/auth/login';
    const payload = authTab === 'signup' 
      ? {
          fullName: authName,
          email: authEmail,
          phone: authPhone,
          password: authPassword || 'saud-default-pass',
          role: 'property_manager'
        }
      : {
          emailOrPhone: authEmail || authPhone,
          password: authPassword || 'saud-default-pass'
        };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error || 'فشلت معالجة الطلب الفني من الخادم');
        });
      }
      return res.json();
    })
    .then(data => {
      setAuthLoading(false);
      setAuthSuccMsg(data.message || 'تمت العملية وتصديق جلسة التحقق بنجاح 🛡️');
      
      const userData = data.user;
      const jwtToken = data.token;

      // Persist values
      localStorage.setItem('saas_current_user', JSON.stringify(userData));
      localStorage.setItem('saas_jwt_token', jwtToken);

      setTimeout(() => {
        setShowAuthModal(false);
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        } else {
          onNavigateToDashboard();
        }
        // Reset fields
        setAuthName('');
        setAuthEmail('');
        setAuthPhone('');
        setAuthPassword('');
      }, 1500);
    })
    .catch(err => {
      setAuthLoading(false);
      setAuthError(err.message || 'خطأ في الربط مع بوابة سعود النعام العقارية');
    });
  };

  // FAQ Expand
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Active Property Filter
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'riyadh' | 'alula' | 'khobar' | 'abha'>('all');

  // Calculations for ROI Calculator
  const premiumSystemOccupancyGain = 12; // Platform automates calendar and channels to increase occupancy by ~12%
  const manualTimeSavedHoursPerUnit = 18; // 18 hours per unit monthly saved
  const originalMonthlyRevenue = (avgNightPrice * (occupancyRate / 100) * 30 * unitsCount);
  const platformMonthlyRevenue = (avgNightPrice * ((occupancyRate + premiumSystemOccupancyGain) / 100) * 30 * unitsCount);
  const revenueGain = Math.round(platformMonthlyRevenue - originalMonthlyRevenue);
  const totalMonthlyCalculated = Math.round(platformMonthlyRevenue);
  const cleaningsAutomatedCount = unitsCount * 8; // Avg bookings per unit/month

  const citiesDetails = {
    Riyadh: { name: 'الرياض', mult: 1.2, desc: 'حراك سياحي واقتصادي ضخم، مواسم وفعاليات طوال العام' },
    Jeddah: { name: 'جدة (بوابة البحر)', mult: 1.15, desc: 'طلب سياحي عالٍ، شاليهات بحرية وأجنحة لليخوت' },
    AlUla: { name: 'العلا (الآثار والأصالة)', mult: 1.5, desc: 'إقبال دولي وعربي فائق الرفاهية بأسعار تشغيلية ممتازة' },
    Khobar: { name: 'المنطقة الشرقية', mult: 1.1, desc: 'شاليهات بحرية فاخرة وسياحة العائلات الدورية' },
    Abha: { name: 'أبها البهية', mult: 1.0, desc: 'موسم صيفي ضبابي استثنائي وطلب مرتفع بالمرتفعات' }
  };

  const propertiesMock = [
    {
      id: 'p1',
      title: 'شقة توليب النرجس الذكية',
      location: 'الرياض - حي النرجس',
      cityKey: 'riyadh',
      channels: ['Airbnb', 'Gathern', 'Booking'],
      occupancy: 88,
      basePrice: 550,
      image: '🏢',
      lock: 'TTLock المتصل',
      features: ['دخول ذاتي كود متجدد', 'تنظيف مبرمج تلقائي']
    },
    {
      id: 'p2',
      title: 'فيلا واحة العلا التاريخية',
      location: 'العلا - مدائن صالح',
      cityKey: 'alula',
      channels: ['Airbnb', 'Gathern'],
      occupancy: 94,
      basePrice: 2200,
      image: '🏝️',
      lock: 'Tuya الذكي Pro',
      features: ['توليد كود تلقائي بالواتساب', 'ضيافة فاخرة بخصومات']
    },
    {
      id: 'p3',
      title: 'شاليه اللاجون والريفيرا',
      location: 'الخبر - خليج نصف القمر',
      cityKey: 'khobar',
      channels: ['Gathern', 'Booking'],
      occupancy: 82,
      basePrice: 1600,
      image: '🏊',
      lock: 'Yale Smart Access',
      features: ['ربط فوري قفل بوابات', 'حساب مواسم الأعياد']
    },
    {
      id: 'p4',
      title: 'رويال بنتهاوس الجبلي',
      location: 'أبها - السودة المطل',
      cityKey: 'abha',
      channels: ['Airbnb', 'Booking', 'Gathern'],
      occupancy: 79,
      basePrice: 1200,
      image: '⛰️',
      lock: 'Gateway TTLock',
      features: ['رسائل ترحيب بلغات متعددة', 'أتمتة الفواتير الضريبية']
    },
  ];

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.fullName || !leadForm.phone) return;
    
    const savedLeads = JSON.parse(localStorage.getItem('saas_leads') || '[]');
    const newLead: SaasLead = {
      id: 'lead-' + Date.now(),
      fullName: leadForm.fullName,
      phone: leadForm.phone,
      companyName: leadForm.companyName || 'فردي / مستثمر حر',
      city: leadForm.city,
      unitsCount: Number(leadForm.unitsCount),
      selectedPlan: leadForm.selectedPlan,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('saas_leads', JSON.stringify([...savedLeads, newLead]));
    
    setFormSubmitted(true);
    setTimeout(() => {
      onStartTrial(leadForm.selectedPlan);
    }, 2800);
  };

  const faqs = [
    {
      q: 'كيف تقوم منصة سعود النعام بمزامنة الحجوزات مع منصة جاذر إن (Gathern) وبوكينج؟',
      a: 'توفر المنصة ربطاً فورياً فائق الحكمة عبر تقنيات ربط القنوات (Channel Manager) وربط الـ iCal المباشر ومزامنة حالة الأقفال الذكية. عندما يحدث حجز في جاذر إن أو Airbnb، يتم قفل التقويم للوحدة فوراً بجميع المنصات لمنع الحجز المزدوج.'
    },
    {
      q: 'هل يحصل الضيف على رسالة الكود وتفاصيل الدخول تلقائياً دون تدخلي؟',
      a: 'نعم تماماً! بمجرد تأكيد الحجز، يقوم عميل الواتساب الآلي المدمج بإرسال رسالة ترحيبية فورية مع رابط دليل الضيف التفاعلي. وقبل موعد تسجيل الدخول بوقت كافٍ المطور يرسل كود القفل الذكي الذي تم برمجته وتوليده آلياً للرمز السري المخصص له بمرونة شديدة.'
    },
    {
      q: 'هل تدعم المنصة إدارة أطقم التنظيف والمغسلة وتوزيع المهام؟',
      a: 'بالتأكيد، توفر المنصة بوابات مستقلة ومبسطة موجهة لفرق الضيافة والمنظفين. يتم تزويد طاقم النظافة بقائمة المهام تلقائياً مع مغادرة الضيف، مع ميزة رفع صور قبل وبعد التجهيز لضمان جودة منشآتك وعقاراتك والتقييم الـ 5 نجوم.'
    },
    {
      q: 'كم رسوم التشغيل وهل هناك حاجة لأجهزة أقفال معينة؟',
      a: 'المنصة تدعم وتتكامل مع 92% من الأقفال الذكية المتواجدة بالسوق السعودي (Tuya, TTLock, Yale, August). ندعم الاشتراكات المرنة بحسب عدد وحداتك التشغيلية دون مغالاة بالتكاليف وبعوائد فورية.'
    }
  ];

  return (
    <div className="bg-[#FAFBFD] text-[#0A1931] min-h-screen selection:bg-[#1E40AF] selection:text-white relative overflow-x-hidden" id="saas-homepage">
      
      {/* Saudi Real Estate Compliance Indicator Ribbon */}
      <div className="bg-gradient-to-r from-[#0A1931] via-[#0F2347] to-[#132B50] text-[#E2E8F0] text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-[#FFFFFF]/10 relative z-10">
        <span>🇸🇦 منصة مرخصة بالكامل ومتوافقة مع الهيئة العامة للعقار ولائحة الإيجار السياحي بالمملكة</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      </div>

      {/* Landing Page Content Box with Light Blueprint Grid Background */}
      <div className="bg-light-grid min-h-screen relative">
        
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#FAFBFD]/90 backdrop-blur-md border-b border-slate-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo on Right side (RTL context) */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleDashboardAccess}>
              <div 
                className="flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
                style={{
                  width: '98px',
                  height: '61px',
                  backgroundColor: '#ffffff',
                  fontSize: '5px',
                  borderStyle: 'inset',
                  borderRadius: '200px',
                  borderWidth: '6.6px',
                  borderColor: '#cbd5e1',
                }}
              >
                <BrandLogoSvg 
                  className="w-full h-full" 
                  imgClassName="rounded-[14px]"
                  imgStyle={{ borderRadius: '14px' }}
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-extrabold text-lg sm:text-xl text-[#0A1931] tracking-tight font-sans">
                  سعود النعام
                </span>
                <span className="text-[11px] text-slate-500 font-bold tracking-wider font-sans">
                  للخدمات العقارية
                </span>
              </div>
            </div>

            {/* Navigation links center */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="#platform-features" className="hover:text-[#1E40AF] transition-colors">المميزات</a>
              <a href="#dashboard-showcase" className="hover:text-[#1E40AF] transition-colors">عينة من النظام</a>
              <a href="#property-showcase" className="hover:text-[#1E40AF] transition-colors">عرض العقارات</a>
              <a href="#roi-calculator" className="hover:text-[#1E40AF] transition-colors">حاسبة الاستثمار</a>
              <a href="#pricing-module" className="hover:text-[#1E40AF] transition-colors">الباقات</a>
              <a href="#faq" className="hover:text-[#1E40AF] transition-colors">الأسئلة الشائعة</a>
            </nav>

            {/* Left side actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={handleLoginClick}
                className="text-xs sm:text-sm font-extrabold text-slate-705 hover:text-[#1E40AF] transition-all cursor-pointer"
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={handleDashboardAccess}
                className="bg-[#1E40AF] hover:bg-[#153185] text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-[#1E40AF]/20 cursor-pointer"
              >
                لوحة التحكم المجانية
              </button>
            </div>

          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-12 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
          
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-105 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 w-[200px] h-[200px] bg-[#C5A880]/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto flex flex-col items-center relative">
            
            {/* Top Pill badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#EEF4FC] border border-[#D0E1F9] rounded-full px-4 py-1.5 mb-8 text-xs font-bold text-[#1E40AF]"
            >
              <span className="h-2 w-2 rounded-full bg-[#1E40AF] animate-pulse"></span>
              <span>شريكك العقاري المتكامل والتقويم الموحد الأكثر نمواً في ٢٠٢٦</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A1931] leading-[1.15] mb-6 font-sans"
            >
              إدارة عقاراتك،
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#1D4ED8] to-[#1E40AF]">من مكان واحد</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#4B5563] text-sm sm:text-lg max-w-3xl leading-relaxed mb-10 font-semibold"
            >
              منصة احترافية متكاملة لإدارة العقارات والمستأجرين والعقود والتحصيل والصيانة. اربط حجوزاتك ووحداتك الفاخرة، تتبع نموك المالي، وأتمت تواصل ضيوفك لتعظيم أرباحك وتوفير وقتك.
            </motion.p>

            {/* Hero Action Group */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={handleDashboardAccess}
                className="bg-[#0A1931] hover:bg-[#061122] text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-lg shadow-[#0A1931]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer"
              >
                <span>ابدأ تجربة النظام مجاناً</span>
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <a 
                href="#lead-capture-form"
                className="bg-[#FCFDFF] border border-slate-200 text-[#0A1931] hover:bg-slate-50 font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto text-center"
              >
                <span>احجز موعد عرض توضيحي</span>
              </a>
            </motion.div>

            {/* Live indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-slate-550 text-xs font-bold border-t border-slate-100 pt-6 w-full max-w-2xl"
            >
              <span className="flex items-center gap-1.5 text-slate-650">✓ الربط المباشر مع جاذر إن، بوكينج و Airbnb</span>
              <span className="flex items-center gap-1.5 text-slate-650">✓ قفل ذكي متصل برقم الجوال</span>
              <span className="flex items-center gap-1.5 text-slate-650">✓ معتمد ومرخص من الهيئة العامة للعقار</span>
            </motion.div>

          </div>
        </section>

        {/* Statistics Bar (Horizontal Ribbon style) */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20 relative">
          <div className="bg-gradient-to-br from-[#0A1931] to-[#0D2140] rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-950/15 border border-[#1e3458]/40 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center text-right">
            
            <div className="flex flex-col items-center justify-center border-l border-slate-700/50 last:border-l-0">
              <span className="text-[10px] sm:text-xs text-[#C5A880] font-black tracking-widest block mb-1">زيادة الإشغال الصافية</span>
              <span className="text-2xl sm:text-4xl font-black text-white font-mono flex items-center gap-1">
                %12<span className="text-emerald-400 text-lg sm:text-2xl font-bold">+</span>
              </span>
              <span className="text-[9px] sm:text-xs text-slate-400 mt-0.5 font-semibold">بفضل المزامنة الذكية وعقود المواسم</span>
            </div>

            <div className="flex flex-col items-center justify-center border-lh md:border-l border-slate-700/50 last:border-0 md:last:border-l-0">
              <span className="text-[10px] sm:text-xs text-[#C5A880] font-black tracking-widest block mb-1">حجوزات تمت أتمتتها</span>
              <span className="text-2xl sm:text-4xl font-black text-white font-mono flex items-center gap-1">
                18K<span className="text-emerald-400 text-lg sm:text-2xl font-bold">+</span>
              </span>
              <span className="text-[9px] sm:text-xs text-slate-400 mt-0.5 font-semibold">حجز تم التحجيم والتحصيل التلقائي له</span>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-slate-700/50 last:border-l-0">
              <span className="text-[10px] sm:text-xs text-[#C5A880] font-black tracking-widest block mb-1">مزامنة الأقفال الذكية</span>
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                %99.9
              </span>
              <span className="text-[9px] sm:text-xs text-slate-400 mt-0.5 font-semibold">نسبة موثوقية توليد أكواد الإيجار</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] sm:text-xs text-[#C5A880] font-black tracking-widest block mb-1">قيمة أملاك مدارة</span>
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                35M<span className="text-xs sm:text-sm font-bold text-slate-350 mr-0.5">ر.س</span>
              </span>
              <span className="text-[9px] sm:text-xs text-slate-400 mt-0.5 font-semibold">أصول وعقارات سكنية وتجارية وسياحية</span>
            </div>

          </div>
        </section>

        {/* Dashboard Showcase Section (Interactive Live Preview Workspace) */}
        <section id="dashboard-showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] border border-[#CBDDF2] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3">
              <AppWindow className="h-4 w-4" />
              <span>لوحة تحكم تشغيلية مباشرة</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931]">
              العينة التفاعلية للنظام العقاري الذكي
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base font-semibold leading-relaxed">
              انقر فوق علامات التبويب أدناه لاستكشاف المزايا والتحكم في لوحة التحكم بشكل تفاعلي ومباشر.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-[40px] shadow-2xl p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-stretch">
            
            {/* Visual Radiant Backdrops */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-[48px] blur-2xl opacity-40 pointer-events-none" />

            {/* Left Column (Interactive Options Side) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6 border-l border-slate-100/80 pl-0 lg:pl-6 order-last lg:order-first">
              
              <div className="space-y-3.5">
                <p className="text-[11px] font-extrabold text-slate-400 tracking-wider">حدد الأداة لاستعراض عملها الفوري:</p>
                
                {/* Tab 1: Central reservation Calendar */}
                <button
                  type="button"
                  onClick={() => setActiveShowcaseTab('calendar')}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-4 cursor-pointer ${
                    activeShowcaseTab === 'calendar'
                      ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-lg shadow-blue-950/10'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${activeShowcaseTab === 'calendar' ? 'bg-[#1E40AF]' : 'bg-slate-200/60'}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm mb-0.5">📅 التقويم الموحد والقنوات</h3>
                    <p className={`text-xs ${activeShowcaseTab === 'calendar' ? 'text-slate-300' : 'text-slate-500'} font-semibold leading-normal`}>
                      منع الحجوزات المزدوجة بالربط الفوري وتنسيق الإيجار بلحظة واحدة.
                    </p>
                  </div>
                </button>

                {/* Tab 2: WhatsApp Automation bot */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveShowcaseTab('whatsapp');
                    setWhatsappStep(0);
                  }}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-4 cursor-pointer ${
                    activeShowcaseTab === 'whatsapp'
                      ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-lg shadow-blue-950/10'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${activeShowcaseTab === 'whatsapp' ? 'bg-[#1E40AF]' : 'bg-slate-200/60'}`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm mb-0.5">💬 الواتساب والنزيل الآلي</h3>
                    <p className={`text-xs ${activeShowcaseTab === 'whatsapp' ? 'text-slate-300' : 'text-slate-500'} font-semibold leading-normal`}>
                      أرسل الكود، استبيان التقييم، ودليل الشارح تلقائياً فور المغادرة والدخول.
                    </p>
                  </div>
                </button>

                {/* Tab 3: Seasons and intelligent rates */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveShowcaseTab('pricing');
                    setPricingMultiplier('normal');
                  }}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-4 cursor-pointer ${
                    activeShowcaseTab === 'pricing'
                      ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-lg shadow-blue-950/10'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${activeShowcaseTab === 'pricing' ? 'bg-[#1E40AF]' : 'bg-slate-200/60'}`}>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm mb-0.5">📊 التسعير الذكي والمواسم</h3>
                    <p className={`text-xs ${activeShowcaseTab === 'pricing' ? 'text-slate-300' : 'text-slate-500'} font-semibold leading-normal`}>
                      عدّل أسعار شاليهاتك وعقودك حسب أيام الأسبوع ومواسم الفعاليات تلقائياً.
                    </p>
                  </div>
                </button>

              </div>

              {/* Bottom Interactive call */}
              <div className="bg-[#EFF4FC] border border-[#CBDDF2] p-5 rounded-2xl">
                <span className="text-[9px] bg-[#1E40AF] text-white px-2.5 py-0.5 rounded-full font-bold">معلومة سريعة</span>
                <p className="text-[11px] text-slate-650 font-bold mt-2 leading-relaxed">
                  هذه المحاكاة تعكس تماماً دقة وسرعة الاستجابة لخوارزميات سعود النعام، لضمان أعلى جودة بأقل تدخل بشري ممكن.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#1E40AF] font-sans">
                  <span>نسبة الخطأ التقاني: ٪٠.٠٠</span>
                  <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                </div>
              </div>

            </div>

            {/* Right Column (Live rendered viewport reflecting tab state) */}
            <div className="lg:col-span-8 bg-[#0F2347] border border-slate-700/60 rounded-[30px] p-4 sm:p-6 text-slate-200 relative overflow-hidden flex flex-col justify-between order-first lg:order-last min-h-[380px] sm:min-h-[460px]">
              
              {/* Outer grid decor */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.015]" />
              
              <div className="relative z-10 w-full">
                
                {/* Simulated URL bar */}
                <div className="bg-[#051122]/80 px-4 py-2.5 rounded-2xl flex items-center justify-between border border-slate-850 text-xs text-slate-400 font-mono mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block"></span>
                  </div>
                  <span className="text-[10px] text-slate-350 font-sans font-bold">saud-alnaam.services/host/dashboard</span>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                </div>

                <AnimatePresence mode="wait">
                  {activeShowcaseTab === 'calendar' && (
                    <motion.div
                      key="calendar-tab"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C5A880]">مخطط التوافر الموحد (الربط النشط)</span>
                        <div className="flex gap-1.5">
                          <span className="bg-[#EEF4FC] text-[#1E45B8] text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider">AIRBNB</span>
                          <span className="bg-[#EFFFFA] text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider">GATHERN</span>
                          <span className="bg-[#FFFEEF] text-amber-600 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider font-sans">BOOKING</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-[#051122] border border-slate-800 p-4 rounded-xl">
                          <h4 className="text-xs font-bold text-slate-300">شاليه النخيل الفاخر</h4>
                          <div className="mt-3 bg-indigo-900/40 text-xs p-2.5 rounded-lg border border-indigo-700/30 text-indigo-200">
                            <span className="font-bold block text-[10px] text-[#C5A880]">محجوز بالكامل بالواتساب</span>
                            أبو فهد - عطلة الأسبوع
                          </div>
                        </div>
                        <div className="bg-[#051122] border border-slate-800 p-4 rounded-xl">
                          <h4 className="text-xs font-bold text-slate-300">شقة حي الملقا المخدومة</h4>
                          <div className="mt-3 bg-teal-950/40 text-xs p-2.5 rounded-lg border border-teal-800/30 text-emerald-300">
                            <span className="font-bold block text-[10px] text-emerald-400">مزامنة جاذر إن</span>
                            د. تميم بن فيصل - مستأجر
                          </div>
                        </div>
                        <div className="bg-[#051122] border border-slate-800 p-4 rounded-xl">
                          <h4 className="text-xs font-bold text-slate-300">فيلا العلا التراثية</h4>
                          <div className="mt-3 bg-amber-950/40 text-xs p-2.5 rounded-lg border border-amber-800/30 text-amber-300">
                            <span className="font-bold block text-[10px] text-amber-400 font-sans">Booking.com</span>
                            وفد سياحي فرنسي
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#051122] border border-slate-800 p-4 rounded-xl mt-4">
                        <h4 className="text-xs font-black text-slate-300 mb-2">مزامنة التقويم اللحظي لمنع الحجز التعارضي:</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-slate-850 px-3 py-1.5 rounded-lg text-slate-400 text-[11px] font-semibold">🔄 تم تحديث التوافر قبل: 1.2 ثانية بجميع القنوات</div>
                          <div className="bg-slate-850 px-3 py-1.5 rounded-lg text-slate-400 text-[11px] font-semibold">🔑 تم ربط 3 أجهزة قفل ذكي TTLock بالكامل</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeShowcaseTab === 'whatsapp' && (
                    <motion.div
                      key="whatsapp-tab"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <span className="text-xs font-bold text-[#C5A880]">شات الواتساب الآلي (محاكاة تفاعلية للنزيل)</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">👤 مستخدم من: 055428XXXX • تجربة تفاعلية</span>
                      </div>

                      {/* Interactive Chat steps */}
                      <div className="bg-[#051122] border border-slate-800 rounded-2xl p-4 min-h-[160px] flex flex-col justify-between">
                        
                        <div className="space-y-3 font-semibold text-xs text-right">
                          {whatsappStep >= 0 && (
                            <div className="bg-[#128C7E]/20 text-[#25D366] p-3 rounded-2xl rounded-tr-none max-w-[85%] mr-0 ml-auto border border-[#128C7E]/40">
                              <span className="block text-[10px] text-[#C0C0C0] font-black">أتمتة سعود النعام (09:12 م - تلقائي)</span>
                              مرحباً أستاذ خالد! 🇸🇦 تم تأكيد حجزك في شقق النعام الفاخرة رقم 3. نتشرف بك، وسيتم تزويدك بالدليل والأكواد قريباً.
                            </div>
                          )}

                          {whatsappStep >= 1 && (
                            <div className="bg-slate-800/80 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] ml-0 mr-auto border border-slate-700/60">
                              <span className="block text-[10px] text-slate-400 font-bold">النزيل خالد (09:13 م)</span>
                              شكراً لكم على الاستقبال والترتيب! هل كود الدخول متوفر الآن؟
                            </div>
                          )}

                          {whatsappStep >= 2 && (
                            <div className="bg-[#128C7E]/20 text-[#25D366] p-3 rounded-2xl rounded-tr-none max-w-[85%] mr-0 ml-auto border border-[#128C7E]/40">
                              <span className="block text-[10px] text-[#C0C0C0] font-black">أتمتة سعود النعام (09:13 م - تلقائي)</span>
                              نعم! كود القفل الذكي الخاص بك هو: <strong className="text-white bg-[#0A1931] px-2 py-0.5 rounded font-mono">* 2819 #</strong> 🔑 يتفعل تلقائياً بتاريخ دخولك 15 أكتوبر الساعة 3م.
                            </div>
                          )}
                        </div>

                        {/* Interactive trigger controls */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end gap-3">
                          {whatsappStep === 0 && (
                            <button
                              type="button"
                              onClick={() => setWhatsappStep(1)}
                              className="px-4 py-2 bg-[#1E40AF] hover:bg-[#153185] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>اضغط لرؤية رد النزيل</span>
                              <Send className="h-3 w-3" />
                            </button>
                          )}
                          {whatsappStep === 1 && (
                            <button
                              type="button"
                              onClick={() => setWhatsappStep(2)}
                              className="px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 animate-pulse"
                            >
                              <span>اضغط لتوليد وإرسال كود القفل الذكي</span>
                              <Lock className="h-3 w-3" />
                            </button>
                          )}
                          {whatsappStep >= 2 && (
                            <button
                              type="button"
                              onClick={() => setWhatsappStep(0)}
                              className="px-4 py-2 bg-slate-850 hover:bg-slate-750 text-slate-350 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              إعادة بدء المحاكاة
                            </button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {activeShowcaseTab === 'pricing' && (
                    <motion.div
                      key="pricing-tab"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C5A880]">محرك التسعير التلقائي الذكي للمواسم</span>
                        <span className="text-[10px] text-slate-400">تفاعل لاختبار الأسعار تلقائياً</span>
                      </div>

                      <div className="bg-[#051122] border border-slate-800 rounded-2xl p-5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-4">
                          <span>الموسم المحدد حالياً:</span>
                          <span className="text-white text-sm bg-blue-900/60 px-3 py-1 rounded-xl">
                            {pricingMultiplier === 'normal' ? 'الأيام الاعتيادية (سعر أساسي)' : pricingMultiplier === 'weekend' ? 'عطلة أسبوعية (أيام الخميس والجمعة)' : 'موسم الرياض / العيد / اليوم الوطني'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <button
                            type="button"
                            onClick={() => setPricingMultiplier('normal')}
                            className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              pricingMultiplier === 'normal' ? 'bg-[#1E40AF] text-white' : 'bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            موسم عادي (1x)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPricingMultiplier('weekend')}
                            className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              pricingMultiplier === 'weekend' ? 'bg-[#1E40AF] text-white' : 'bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            عطلة نهاية الأسبوع (1.25x)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPricingMultiplier('season')}
                            className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              pricingMultiplier === 'season' ? 'bg-[#1E40AF] text-white' : 'bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            الفعاليات الكبرى (1.6x)
                          </button>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-800/80 pt-4 text-xs">
                          <div>
                            <span className="text-slate-500 block mb-0.5">شاليه الرمال الفاخر:</span>
                            <span className="text-xl font-bold text-white font-mono">
                              {pricingMultiplier === 'normal' ? '1,000' : pricingMultiplier === 'weekend' ? '1,250' : '1,600'} ر.س <span className="text-xs text-slate-400">/ليلة</span>
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="text-slate-500 block mb-0.5 font-sans">توفير العوائد الشهري الإضافي:</span>
                            <span className="text-emerald-400 font-bold block font-mono">
                              +{pricingMultiplier === 'normal' ? '3,400' : pricingMultiplier === 'weekend' ? '4,850' : '7,200'} ر.س / شهرياً
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Bottom Quick Specs (RTL layout) */}
              <div className="border-t border-slate-800/70 pt-4 mt-6 flex justify-between items-center text-[10px] text-[#C5A880] font-mono leading-none">
                <span>⚡ SECURE LINK VERIFIED</span>
                <span>SYSTEM DELIVERED VIA CLOUD RUN</span>
                <span>COMPLIANT WIT GATHERN / ZATCA API</span>
              </div>

            </div>

          </div>
        </section>

        {/* Features Bento Grid Section */}
        <section id="platform-features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3">
              <Sparkle className="h-4 w-4 text-[#C5A880]" />
              <span>المميزات والحلول الحصريانية</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931]">
              بنية ووظائف مهندسة للسوق السعودي
            </h2>
            <p className="mt-4 text-[#4B5563] text-sm sm:text-base font-semibold leading-relaxed">
              لقد درسنا بدقة واعية لائحة الهيئة العامة للعقار لنوفر لعملائنا الحل التكاملي الوحيد الذى يربط القنوات والأقفال والفواتير بجدار حماية وعوائد مضمونة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Calendars */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 mr-0">
                  <Calendar className="h-6 w-6 text-[#1E40AF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">التقويم الذكي الموحد</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  اجمع حجوزات شاليهاتك، شققك ووحداتك السكنية في نظام واحد مركزي ومريح لتجنب تكرار الحجوزات نهائياً.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>تصفح لوحة التقويم</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Card 2: Pricing engine */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Sliders className="h-6 w-6 text-[#1E40AF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">محرك أسعار المواسم</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  تحكّم في أسعار الخميس والجمعة ومواسم الأعياد ورمضان واليوم الوطني تلقائياً دون الحاجة لتحديث يدوي مكرر.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>استكشف الذكاء المالي</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Card 3: Integrations */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Building2 className="h-6 w-6 text-[#1E40AF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">ربط القنوات الشامل</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  اربط حساباتك بضغطة زر مع Airbnb، وبوكينج، ومنصة جاذر إن (Gathern) المحلية والشهيرة لمزامنة فلبينية آمنة.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>شاهد الأرقام المربوطة</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Card 4: ZATCA Invoicing */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-[#1E40AF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">فواتير معتمدة (ZATCA)</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  أنتج فواتير إلكترونية متطابقة تماماً مع ضوابط هيئة الزكاة والضريبة والجمارك لتوثيق التحصيل والمالية.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>تنزيل عينة فاتورة</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Card 5: Smart locks locks */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-[#1E40AF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">أتمتتة الأقفال والرموز</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  تكامل وثيق مع TTLock و Tuya لتوليد رمز مخصص للنزيل يخدم طول فترة حجزه ويغلق فور انتهائها.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>الأجهزة المتوافقة</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

            {/* Card 6: Operations Management */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-blue-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-right group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <span className="text-xl">🧹</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0A1931] mb-3">بوابة النظافة والوفود</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  وزّع مهام التنظيف والغسيل على العمال مخرجاً إشغالياً منسقاً مع تتبع فوري للصور ومراجعة جولات النطاق.
                </p>
              </div>
              <div className="text-xs text-[#1E40AF] font-bold mt-4 flex items-center gap-1.5 cursor-pointer hover:underline pt-2">
                <span>تتبع أطقم الضيافة</span>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </div>

          </div>
        </section>

        {/* Property Showcase (Filterable Real-Time Slider) */}
        <section id="property-showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 rounded-[40px] my-12 border border-slate-150/60 scroll-mt-6 relative">
          
          <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
            <div className="text-right max-w-2xl">
              <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3.5 py-1 px-4 py-1.5 rounded-full inline-block mb-3">🏢 عقارات حية لعملائنا المتميزين</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1931]">
                شاهد الأداء النشط والمقاسات بالوحدات
              </h2>
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-semibold mt-2">
                اختر المدينة لمشاهدة استعراض حي للعقارات التي تتم إدارتها تلقائياً بالمنصة لتقليل التكاليف وزيادة الإشغال.
              </p>
            </div>

            {/* City interactive filters */}
            <div className="flex flex-wrap gap-2 text-xs font-bold font-sans">
              <button
                type="button"
                onClick={() => setPropertyFilter('all')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  propertyFilter === 'all' 
                    ? 'bg-[#0A1931] text-white border-[#0A1931]' 
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setPropertyFilter('riyadh')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  propertyFilter === 'riyadh' 
                    ? 'bg-[#0A1931] text-white border-[#0A1931]' 
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
              >
                الرياض
              </button>
              <button
                type="button"
                onClick={() => setPropertyFilter('alula')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  propertyFilter === 'alula' 
                    ? 'bg-[#0A1931] text-white border-[#0A1931]' 
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
              >
                العلا
              </button>
              <button
                type="button"
                onClick={() => setPropertyFilter('khobar')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  propertyFilter === 'khobar' 
                    ? 'bg-[#0A1931] text-white border-[#0A1931]' 
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
              >
                الخبر
              </button>
              <button
                type="button"
                onClick={() => setPropertyFilter('abha')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  propertyFilter === 'abha' 
                    ? 'bg-[#0A1931] text-white border-[#0A1931]' 
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
              >
                أبها
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {propertiesMock
                .filter(p => propertyFilter === 'all' || p.cityKey === propertyFilter)
                .map((prop) => (
                  <motion.div
                    layout
                    key={prop.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-[#EFF2F6] rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between text-right relative overflow-hidden group"
                  >
                    
                    {/* Floating Occupancy Pulse */}
                    <div className="absolute top-4 left-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block"></span>
                      <span>إشغال {prop.occupancy}%</span>
                    </div>

                    <div>
                      {/* Large emoji icon / placeholder image */}
                      <div className="w-14 h-14 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-2xl mb-4">
                        {prop.image}
                      </div>

                      <h3 className="text-[#0A1931] font-extrabold text-base mb-1">{prop.title}</h3>
                      <p className="text-xs text-slate-500 font-bold mb-3 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#1E40AF]" />
                        <span>{prop.location}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {prop.channels.map((ch, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
                            {ch}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-2 text-[11px] text-slate-600 font-semibold mb-4">
                        <div className="flex justify-between">
                          <span className="text-[#1E40AF] font-mono">{prop.lock}</span>
                          <span className="text-slate-400">القفل والربط:</span>
                        </div>
                        {prop.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>{feat}</span>
                            <span className="text-emerald-500">✓</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">سعر متاح حالياً</span>
                        <span className="text-sm font-extrabold text-[#0A1931] font-mono">{prop.basePrice} ر.س / ليلة</span>
                      </div>
                      <button 
                        onClick={handleDashboardAccess}
                        className="p-2 bg-[#0A1931]/5 text-[#0A1931] group-hover:bg-[#1E40AF] group-hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </div>

                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

        </section>

        {/* Benefits Section ("Value Proposition comparing Conventional vs Smart Saudi Platform") */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3.5 py-1 rounded-full uppercase tracking-widest inline-block mb-3 text-right">موازنة حكيمة وجادة</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931]">
              الإدارة كما يجب أن تكون في ٢٠٢٦
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base font-semibold leading-relaxed">
              كيف يضيف الربط بالأقفال الذكية وقناة الواتساب السريعة مع سعود النعام فارقاً كبيراً في حياتك الاستثمارية اليومية؟
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Box left: Traditional tiring management */}
            <div className="bg-white border border-rose-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between text-right relative">
              <div className="absolute top-4 left-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full px-4 rounded-full">
                ⚠️ الطريقة التقليدية المرهقة
              </div>

              <div className="space-y-6 pt-6 mb-6">
                <h3 className="text-xl font-bold text-slate-800">تواصل بشري مشتت وخسائر مكررة</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed text-right">
                      <strong>تحرير كود الدخول يدوياً:</strong> يحتاج الحارس للذهاب لإدخال الرمز، أو يظل العميل منتظراً كود البوابات طويلاً بالواتساب ليحصل على توجيه.
                    </p>
                    <span className="text-xl text-rose-500 shrink-0">❌</span>
                  </div>

                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed text-right">
                      <strong>خطر الحجز المزدوج الفادح:</strong> تحجز العائلات نفس الوحدة من Gathern وبوكينج للتوقيت ذاته لعدم تطابق الأنظمة الفوري، ما يضعك في حرج قانوني مكرر.
                    </p>
                    <span className="text-xl text-rose-500 shrink-0">❌</span>
                  </div>

                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed text-right">
                      <strong>فواتير ورقية ضائعة:</strong> تصدير فواتير بصفة يدوية لا تتوافق مع متطلبات الزكاة المحدثة ويخلق ثغرات وعجز لميزانياتك وأرباح الملاك.
                    </p>
                    <span className="text-xl text-rose-500 shrink-0">❌</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-2xl text-xs text-rose-700 font-semibold">
                ⚠️ تهدر الإدارة التقليدية ما يقارب 18 ساعة أسبوعياً من المراجعة اليدوية المتواصلة.
              </div>
            </div>

            {/* Box right: Saud Al Naam Intelligent System */}
            <div className="bg-gradient-to-br from-[#0A1931] to-[#0A1D36] border border-blue-950 p-8 rounded-[32px] shadow-xl text-slate-200 flex flex-col justify-between text-right relative">
              <div className="absolute top-4 left-4 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
                ✨ نظام سعود النعام الذكي
              </div>

              <div className="space-y-6 pt-6 mb-6">
                <h3 className="text-xl font-bold text-white">أتمتة لحظية بالواتساب وحياكة رقمية فاخرة</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-350 font-semibold leading-relaxed text-right">
                      <strong>توليد ذاتي وفوري لكود القفل:</strong> بمجرد دفع الصافية، يولد النظام كوداً شخصياً صالحاً فقط لمدة حجزه للمحافظة على أمان وتأمين أصولك بدقة.
                    </p>
                    <span className="text-xl text-emerald-400 shrink-0">✓</span>
                  </div>

                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-350 font-semibold leading-relaxed text-right">
                      <strong>مزامنة لحظية للقنوات وال calendars:</strong> قفل التوافر تلقائياً في بوكينج و Airbnb بمتوسط ربط يقل عن 1.5 ثانية فقط، مما يبخر نسب التعارض نهائياً.
                    </p>
                    <span className="text-xl text-emerald-400 shrink-0">✓</span>
                  </div>

                  <div className="flex gap-3.5 justify-end">
                    <p className="text-xs sm:text-sm text-slate-350 font-semibold leading-relaxed text-right">
                      <strong>الفوترة الإلكترونية (ZATCA):</strong> نظام مالي ذكي جاهز لإصدار لوائح الضريبة ورفعها مباشرة ببروتوكولات التوثيق الرسمية المعتمدة لراحتك.
                    </p>
                    <span className="text-xl text-emerald-400 shrink-0">✓</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/30 rounded-2xl text-[11px] text-[#C5A880] border border-[#213e68]/70 font-semibold">
                🔥 تضمن المنصة استرداداً زمنياً تاماً لأعمالك التشغيلية لتركز فقط في زيادة الأصول والعلاقات.
              </div>
            </div>

          </div>
        </section>

        {/* ROI / Return On Investment Calculator (Themealigned to light blueprint) */}
        <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3.5 py-1.5 rounded-full inline-block mb-3">💰 أداة التقييم الاقتصادي</span>
            <h2 className="text-3xl font-extrabold text-[#0A1931]">
              احسب عوائدك الاستثمارية الإضافية
            </h2>
            <p className="mt-3 text-slate-500 text-sm sm:text-base font-semibold">
              اكتشف كيف تساهم الأتمتة والربط الفوري في رفع عوائد شاليهاتك وشققك المخدومة بالمملكة.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#EFF3F9] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.02)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Box (Input Sliders in RTL Context) */}
            <div className="lg:col-span-7 flex flex-col gap-6 order-last lg:order-first">
              
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-550 mb-3 text-right">موقع العقار الرئيسي:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['Riyadh', 'Jeddah', 'AlUla', 'Khobar', 'Abha'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCity(key)}
                      className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        city === key 
                          ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-sm' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-705 hover:bg-slate-100'
                      }`}
                    >
                      {citiesDetails[key].name}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#2A5BB1] font-bold mt-2.5 text-right">📍 {citiesDetails[city].desc}</p>
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-xs font-bold text-slate-550 mb-3 text-right">تصنيف الضيافة:</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['chalet', 'apartment', 'villa'] as const).map((typeVal) => (
                    <button
                      key={typeVal}
                      onClick={() => {
                        setUnitType(typeVal);
                        if (typeVal === 'apartment' && avgNightPrice > 800) setAvgNightPrice(450);
                        if (typeVal === 'villa' && avgNightPrice < 1000) setAvgNightPrice(1800);
                        if (typeVal === 'chalet' && avgNightPrice < 600) setAvgNightPrice(1100);
                      }}
                      className={`px-4 py-3.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        unitType === typeVal 
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-sm' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-705 hover:bg-slate-100'
                      }`}
                    >
                      {typeVal === 'chalet' ? 'شاليه / استراحة' : typeVal === 'apartment' ? 'شقة فاخرة مخدومة' : 'فيلا خاصة مفروشة'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units count slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#0A1931] font-mono">{unitsCount} وحدات</span>
                  <span className="text-slate-500">إجمالي عدد وحداتك التشغيلية</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={unitsCount} 
                  onChange={(e) => setUnitsCount(Number(e.target.value))}
                  className="w-full accent-[#0A1931] cursor-pointer bg-slate-200 h-2.5 rounded-lg"
                />
              </div>

              {/* Average night price */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#1E40AF] font-mono">{avgNightPrice.toLocaleString()} - {Math.round(avgNightPrice * citiesDetails[city].mult).toLocaleString()} ر.س</span>
                  <span className="text-slate-500">متوسط سعر تأجير الليلة الواحدة (بعد معامل المدينة)</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="6000" 
                  step="50"
                  value={avgNightPrice} 
                  onChange={(e) => setAvgNightPrice(Number(e.target.value))}
                  className="w-full accent-[#1E40AF] cursor-pointer bg-slate-200 h-2.5 rounded-lg"
                />
              </div>

              {/* Current Occupancy */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-amber-600 font-mono">{occupancyRate}% شهرياً</span>
                  <span className="text-slate-500">نسبة الإشغال الحالية قبل الأتمتة</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  value={occupancyRate} 
                  onChange={(e) => setOccupancyRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer bg-slate-200 h-2.5 rounded-lg"
                />
              </div>

            </div>

            {/* Left/Right display card showing calculations (RTL Layout) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#FAFBFD] to-[#EFF4FC] border border-[#D5E1F4] p-6 sm:p-8 rounded-[28px] flex flex-col justify-between order-first lg:order-last">
              <div>
                <span className="text-[10px] bg-[#EEF4FC] border border-slate-200 text-[#1E40AF] px-3 py-1 rounded-full font-bold">النتائج التقديرية</span>
                <h3 className="text-xl font-extrabold text-[#0A1931] mt-3">النمو المالي الرقمي</h3>
                
                <div className="mt-6 space-y-5">
                  
                  <div className="border-b border-[#D5E1F4]/60 pb-3">
                    <span className="text-xs text-slate-500 block mb-1">المدخول الشهري المتوقع بعد استخدام المنصة</span>
                    <span className="text-3xl font-black text-[#0A1931] font-mono">
                      {totalMonthlyCalculated.toLocaleString()} <span className="text-sm font-bold text-slate-500">ر.س</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-600 font-sans">
                      +{revenueGain.toLocaleString()} ر.س / شهرياً
                    </span>
                    <span className="text-slate-500">الزيادة التشغيلية الصافية</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#0A1931] font-mono">{cleaningsAutomatedCount} مهمة</span>
                    <span className="text-slate-500">مهام وصيانات مؤتمتة شهرياً</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#0A1931] font-mono">~{unitsCount * manualTimeSavedHoursPerUnit} ساعة</span>
                    <span className="text-slate-500">وقت تشغيلي وفّرته الأتمتة</span>
                  </div>

                </div>
              </div>

              <div className="mt-8">
                <div className="p-3 bg-white/80 border border-[#CBDDF2] rounded-xl mb-4 text-[11px] text-slate-600 font-medium leading-relaxed">
                  💡 ترتفع نسبة الإشغال بنسبة تقريبية تعادل <strong className="text-[#1E40AF]">%12+</strong> بسبب السرعة المطلقة في تحديث التوافر بالمنصات وإرسال وثائق الدخول للضيف.
                </div>
                <button 
                  onClick={handleDashboardAccess}
                  className="w-full py-3 bg-[#0A1931] hover:bg-[#061122] text-[#FAFBFD] font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>أكد تفعيل حسابك المالي</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Testimonials (SaaS Validation and Trust) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">⭐ آراء شركاء النجاح</span>
            <h2 className="text-3xl font-extrabold text-[#0A1931]">
              ماذا يقول الملاك والشركاء عن منصتنا؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold mt-2">
              نوفر أعمالاً تدعم الملاك الفرديين ومحافظ الشركات العقارية الكبرى لزيادة النمو.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Review 1 */}
            <div className="bg-white border border-[#EFF2F6] p-8 rounded-3xl shadow-sm text-right flex flex-col justify-between">
              <div>
                <div className="flex justify-end gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mb-6">
                  "لقد واجهنا مشاكل جمة في شققنا بالرياض بسبب الحجوزات المكررة بين جاذر إن وبوكينج، وتلقي الضيوف لأكواد خاطئة من الأقفال. مع سعود النعام، سارت الأتمتة على الواتساب بسلاسة مطلقة، ولا نتدخل في الدخول أو الخروج أبداً."
                </p>
              </div>
              <div className="flex items-center gap-3.5 justify-end border-t border-slate-100 pt-4">
                <div className="text-right">
                  <h4 className="font-extrabold text-sm text-[#0A1931]">م. عبد العزيز بن سعد</h4>
                  <span className="text-[10px] text-slate-400 font-bold">مالك ومستثمر عقاري - الرياض</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#0A1931]">
                  ع س
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-[#EFF2F6] p-8 rounded-3xl shadow-sm text-right flex flex-col justify-between">
              <div>
                <div className="flex justify-end gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mb-6">
                  "أكثر ما فاجأني هو كيفية إدارة مهام النظافة والتحصيل بدقة واحترافية. بفضل دليل الضيف المتاح تلقائياً، تراجعت أسئلة النزلاء بنسبة 85% وحققنا أعلى رتبة تقييم في تطبيق Airbnb هذا الموسم في العلا."
                </p>
              </div>
              <div className="flex items-center gap-3.5 justify-end border-t border-slate-100 pt-4">
                <div className="text-right">
                  <h4 className="font-extrabold text-sm text-[#0A1931]">أ. نورة الغامدي</h4>
                  <span className="text-[10px] text-slate-400 font-bold">مديرة محفظة ريفييرا لشاليهات وتطوير العلا</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#0A1931]">
                  ن غ
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-[#EFF2F6] p-8 rounded-3xl shadow-sm text-right flex flex-col justify-between">
              <div>
                <div className="flex justify-end gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mb-6">
                  "الفواتير المعتمدة وتقارير الأداء المالي ركيزة لا غنى عنها في حساباتنا السنوية. منصة سعود النعام للخدمات العقارية وإدارة الأملاك تتجاوز مجرد فكرة برمجية، إنها العقل التشغيلي المدبر لأملاكنا المرموقة."
                </p>
              </div>
              <div className="flex items-center gap-3.5 justify-end border-t border-slate-100 pt-4">
                <div className="text-right">
                  <h4 className="font-extrabold text-sm text-[#0A1931]">أ. تميم الخالدي</h4>
                  <span className="text-[10px] text-slate-400 font-bold">الرئيس التنفيذي للتطوير - فندق واحة الخبر</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#0A1931]">
                  ت خ
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Pricing & Subscription Packages */}
        <section id="pricing-module" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider block mb-2">اشتراكات ميسرة وتلقائية</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1931]">
              باقات تشغيلية مرنة تلائم نموك العقاري
            </h2>
            <p className="mt-3 text-slate-500 text-sm font-semibold">
              بدون عقود طويلة الأجل. خض التجربة الكاملة لمدة ١٤ يوماً مجاناً مع كامل مميزات الربط بدون بطاقة ائتمان.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Bronze Pack */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-slate-300 flex flex-col justify-between text-right relative shadow-[0_4px_24px_rgba(0,0,0,0.01)] transition-all">
              <div>
                <span className="text-xs font-bold text-[#C5A880] block mb-2">الباقة الفردية (برونزية)</span>
                <h3 className="text-xl font-bold text-[#0A1931]">مضيف ناشئ</h3>
                <p className="text-xs text-slate-500 mt-2 mb-6">مثالية للملاك الجدد الذين يديرون حتى ٣ وحدات سكنية أو ترفيهية</p>
                
                <div className="border-b border-slate-100 pb-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#0A1931] font-mono">49</span>
                  <span className="text-xs text-slate-600 font-bold"> ر.س / شهرياً للوحدة</span>
                </div>

                <ul className="space-y-4 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>ربط حتى ٣ وحدات</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>مزامنة تقويم iCal الأساسية</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>دليل الضيوف التفاعلي الرقمي</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>رسائل ترحيبية أساسية</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => {
                    setLeadForm(p => ({ ...p, selectedPlan: 'starter' }));
                    document.getElementById('lead-capture-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#EEF4FC] hover:bg-[#D9E6F7] text-[#1E40AF] font-bold rounded-xl text-xs transition-all cursor-pointer text-center block"
                >
                  جرب مجاناً لـ ١٤ يوماً
                </button>
              </div>
            </div>

            {/* Silver Pack (Most Popular) */}
            <div className="bg-[#FFFFFF] border-2 border-[#1E40AF] p-8 rounded-[32px] flex flex-col justify-between text-right relative shadow-[0_12px_40px_rgba(30,64,175,0.08)] transition-all">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1E40AF] text-[#FAFBFD] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                الأكثر اشتراكاً ورواجاً
              </div>

              <div>
                <span className="text-xs font-bold text-[#1E40AF] block mb-2">الباقة الاحترافية (فضية)</span>
                <h3 className="text-xl font-bold text-[#0A1931]">إشغال ذكي</h3>
                <p className="text-xs text-[#1E40AF] font-bold mt-2 mb-6">الحل الأكمل للمستثمرين وأصحاب الوحدات المتعددة والشاليهات الفاخرة</p>
                
                <div className="border-b border-slate-100 pb-6 mb-6">
                  <span className="text-4xl font-extrabold text-[#0A1931] font-mono">99</span>
                  <span className="text-xs text-slate-600 font-bold"> ر.س / شهرياً للوحدة</span>
                </div>

                <ul className="space-y-4 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>وحدات غير محدودة للتحصيل</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>مزامنة فورية (Channel Manager)</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>تكامل وتحكم فوري بالأقفال الذكية (TTLock / Tuya)</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>رسائل الكود والدليل بالواتساب تلقائياً للنزيل</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>بوابة فرق الصيانة وموظفي النظافة</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => {
                    setLeadForm(p => ({ ...p, selectedPlan: 'pro' }));
                    document.getElementById('lead-capture-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 bg-[#0A1931] hover:bg-[#061122] text-[#FAFBFD] font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md text-center block"
                >
                  ابدأ تجربة مجانية شاملة
                </button>
              </div>
            </div>

            {/* Gold Pack */}
            <div className="bg-[#FFFFFF] border border-[#EFF2F6] p-8 rounded-[32px] hover:border-slate-300 flex flex-col justify-between text-right relative shadow-[0_4px_24px_rgba(0,0,0,0.01)] transition-all">
              <div>
                <span className="text-xs font-bold text-slate-550 block mb-2">مجمعات وفنادق (ذهبية)</span>
                <h3 className="text-xl font-bold text-[#0A1931]">إمبراطورية العقار</h3>
                <p className="text-xs text-slate-500 mt-2 mb-6">لشركات التطوير العقاري الكبرى وإدارة المجمعات والمنتجعات</p>
                
                <div className="border-b border-slate-100 pb-6 mb-6">
                  <span className="text-2xl font-extrabold text-[#0A1931] font-sans font-extrabold">باقة مخصصة</span>
                  <span className="text-xs text-slate-500 block mt-1">بحسب المتطلبات وبوابات API مخصصة</span>
                </div>

                <ul className="space-y-4 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>لوحات تحكم موحدة للمجمعات المغلقة</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>ربط أنظمة الـ PMS وسيرفرات الفندق للفوترة</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>لوحات تحليلية مخصصة للمستثمرين الشركاء</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                  <li className="flex items-center gap-2.5 justify-end">
                    <span>مدير حساب مخصص طيلة اليوم</span>
                    <CheckCircle className="h-4 w-4 text-[#1E40AF] shrink-0" />
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => {
                    setLeadForm(p => ({ ...p, selectedPlan: 'enterprise' }));
                    document.getElementById('lead-capture-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#EEF4FC] hover:bg-[#D9E6F7] text-[#1E40AF] font-bold rounded-xl text-xs transition-all cursor-pointer text-center block"
                >
                  تحدث معنا الآن
                </button>
              </div>
            </div>

          </div>

        </section>

        {/* Lead Capture form / CTA Section (Embedded sleekly with visual indicators) */}
        <section id="lead-capture-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAFBFD] to-[#EFF4FC] border-y border-[#EFF2F6] scroll-mt-6">
          <div className="max-w-4xl mx-auto bg-white border border-[#D5E1F4] rounded-[32px] p-6 sm:p-12 relative overflow-hidden shadow-2xl shadow-[#0A1931]/5">
            
            {/* Visual glow backdrop inside layout */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-100/30 rounded-full blur-[80px] pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931]">
                ابدأ تجربتك المجانية لمدة ١٤ يوماً
              </h2>
              <p className="mt-3 text-[#4B5563] text-sm font-semibold">
                املاً بياناتك للتجهيز وسيتم توجيهك فوراً للوحة التحكم للعمل بالتوافق مع رؤيتك.
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-4 relative z-10">
                <div className="h-16 w-16 bg-[#EEF4FC] border border-[#CBDDF2] rounded-full flex items-center justify-center text-[#1E40AF] text-3xl animate-bounce font-sans">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0A1931]">تهانينا! تم إنشاء حسابك التجريبي بنجاح</h3>
                <p className="text-sm text-slate-500 max-w-md font-semibold leading-relaxed">
                  جاري تحضير وتعبئة شققك التجريبية وتأمين الربط مع القنوات والواتساب... سيتم تحويلك تلقائياً الآن.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#1E40AF] font-mono">
                  <span className="animate-ping h-2.5 w-2.5 rounded-full bg-[#1E40AF]"></span>
                  <span>INITIALIZING SECURE PORTAL...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-6 text-right relative z-10 font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">الاسم الكريم (الكامل) *</label>
                    <input 
                      type="text" 
                      required
                      value={leadForm.fullName}
                      onChange={(e) => setLeadForm(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="سعود النعام"
                      className="w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-xs text-[#0A1931] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] transition-all text-right font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">رقم الجوال (للربط بالواتساب) *</label>
                    <input 
                      type="tel" 
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="050XXXXXXXX"
                      className="w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-xs text-[#0A1931] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] transition-all font-mono"
                      style={{ direction: 'ltr', textAlign: 'right' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">اسم شركتك أو الوحدات</label>
                    <input 
                      type="text" 
                      value={leadForm.companyName}
                      onChange={(e) => setLeadForm(p => ({ ...p, companyName: e.target.value }))}
                      placeholder="شاليهات اللافندر"
                      className="w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-xs text-[#0A1931] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] transition-all text-right font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">المنطقة الرئيسية</label>
                    <select 
                      value={leadForm.city}
                      onChange={(e) => setLeadForm(p => ({ ...p, city: e.target.value }))}
                      className="w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-xs text-[#0A1931] focus:outline-none focus:border-[#1E40AF] transition-all font-bold"
                    >
                      <option value="Riyadh">الرياض</option>
                      <option value="Jeddah">جدة</option>
                      <option value="AlUla">العلا</option>
                      <option value="Khobar">الخبر / الشرقية</option>
                      <option value="Abha">أبها / عسير</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">عدد الوحدات المتاحة</label>
                    <input 
                      type="number" 
                      min="1"
                      max="1000"
                      required
                      value={leadForm.unitsCount}
                      onChange={(e) => setLeadForm(p => ({ ...p, unitsCount: Number(e.target.value) }))}
                      className="w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl px-4 py-3.5 text-xs text-[#0A1931] focus:outline-none focus:border-[#1E40AF] transition-all text-right font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">الباقة التي تفضل البدء بها</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['starter', 'pro', 'enterprise'] as const).map((planKey) => (
                      <button
                        key={planKey}
                        type="button"
                        onClick={() => setLeadForm(p => ({ ...p, selectedPlan: planKey }))}
                        className={`py-3 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                          leadForm.selectedPlan === planKey 
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md' 
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-705 hover:bg-slate-100'
                        }`}
                      >
                        {planKey === 'starter' ? 'برونزية (١-٣ وحدات)' : planKey === 'pro' ? 'فضية احترافية شاملة' : 'ذهبية مجمعات مخصصة'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-[#0A1931] hover:bg-[#061122] text-white font-extrabold py-4 rounded-xl shadow-xl hover:shadow-[#0A1931]/20 text-xs sm:text-sm flex justify-center items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>أكد حسابي وابدأ التشغيل</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 font-semibold">
                    ✓ مجاناً دون التزام مالي. لا تطلب بطاقة ائتمانية للتفعيل.
                  </p>
                </div>

              </form>
            )}

          </div>
        </section>

        {/* FAQs Section */}
        <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right scroll-mt-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#1E40AF] bg-[#EEF2F6] px-3.5 py-1.5 rounded-full inline-block mb-3">
              <HelpCircle className="h-4 w-4 text-[#C5A880] inline-block ml-1" />
              <span>إجابات سريعة لمخاوفك</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931]">
              الأسئلة الأكثر شيوعاً
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#EFF3F9] rounded-2xl overflow-hidden shadow-sm transition-all text-right"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full py-5 px-6 flex justify-between items-center text-[#0A1931] font-extrabold text-sm sm:text-base text-right transition-colors hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                  <span>{faq.q}</span>
                </button>
                
                {expandedFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-semibold"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-slate-200/80 text-right">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
            
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#051122] p-1 rounded-xl h-14 w-14 flex items-center justify-center border border-slate-800/40 transform hover:scale-105 transition-all">
                  <BrandLogoSvg className="h-12 w-12" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0A1931] text-sm">سعود النعام للخدمات العقارية وإدارة الأملاك</h4>
                  <p className="text-[10px] text-slate-450 font-bold">بترخيص رسمي معتمد وموثق من الهيئة العامة للعقار</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                المنصة والمحرك التقني والتشغيلي الموثوق لأتمتة شاليهاتك، شققك الفاخرة، وفللك المفروشة بالمملكة مع الربط بالواتساب وخوارزمية التسعير الذكي للمواسم.
              </p>
              <div className="flex flex-wrap gap-4 text-slate-600 text-xs font-bold pt-1">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-[#1E40AF]" /> 920033481</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-[#1E40AF]" /> info@sn-realestate.sa</span>
              </div>
            </div>

            <div className="md:col-span-3 text-xs text-slate-700 space-y-3">
              <h5 className="font-extrabold text-[#0A1931] text-sm mb-1">حلول المزامنة والأتمتة</h5>
              <div className="flex flex-col gap-2 font-semibold">
                <a href="#platform-features" className="hover:text-[#1E40AF] transition-colors">مزامنة جاذر إن وبوكينج</a>
                <a href="#platform-features" className="hover:text-[#1E40AF] transition-colors">عقود وفواتير وتدشينات ZATCA</a>
                <a href="#roi-calculator" className="hover:text-[#1E40AF] transition-colors">التحكم بالأقفال الذكية التلقائية</a>
                <a href="#pricing-module" className="hover:text-[#1E40AF] transition-colors">باقاتنا وخطط السداد</a>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#EFF5FD] border border-[#CBDDF2] p-6 rounded-2xl flex flex-col gap-3">
              <h5 className="font-bold text-[#0A1931] text-xs">الشريك التقني العقاري المعتمد بالمملكة</h5>
              <p className="text-[11px] text-slate-650 font-semibold leading-relaxed">
                ندمج أعمالك مع كافة ترخيصات فال واللوائح التشغيلية السياحية، لزيادة نسب إشغالك وتقليل العبء البشري.
              </p>
              <button 
                onClick={handleDashboardAccess}
                className="w-full py-2.5 bg-[#0A1931] hover:bg-[#061122] text-white font-extrabold rounded-lg text-xs transition-all shadow-sm cursor-pointer"
              >
                الدخول الفوري المجاني
              </button>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[10px] font-bold gap-4 pb-4">
            <p>© 2026 شركة سعود النعام للخدمات العقارية وإدارة الأملاك. جميع الحقوق محفوظة برخصة الهيئة العامة للعقار.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-600 cursor-pointer">شروط الاستخدام</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">سياسة الخصوصية وأمان الأجهزة</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">اتفاقية الربط وشركات الاتصالات</span>
            </div>
          </div>
        </footer>

        {/* Advanced Stateful Authentication / Login Modal Overlay */}
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Dark Backing Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!authLoading) setShowAuthModal(false);
                }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Login Modal Box (Obsidian Dark Luxury Design) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative bg-[#020813] border border-slate-800/85 text-[#EFF6FF] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-950/20 z-10 text-right"
              >
                {/* Header glow */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-950/30 via-transparent to-transparent pointer-events-none" />

                {/* Close Button Button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  disabled={authLoading}
                  className="absolute top-5 left-5 p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-8 sm:p-10 relative">
                  {/* Brand Branding Anchor */}
                  <div className="flex items-center gap-3.5 mb-8 justify-start flex-row-reverse text-right">
                    <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center p-1 border border-slate-850">
                      <BrandLogoSvg className="h-full w-full" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-white tracking-widest font-sans">سعود النعام للخدمات العقارية</span>
                      <span className="text-[10px] text-yellow-500 font-bold tracking-wider">بوابتك لإدارة ذكية ومتكاملة</span>
                    </div>
                  </div>

                  {/* Title & Toggle Switch Tab */}
                  <div className="mb-8">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                      {authTab === 'signup' ? 'أنشئ حسابك المجاني' : 'تسجيل الدخول للمنصة'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {authTab === 'signup' 
                        ? 'بريدك ورقم جوالك وكلمة سر - وسنكمل بقية بياناتك من الإعدادات لاحقاً.'
                        : 'أدخل الاسم الكريم والبريد ورقم الهاتف للوصول الفوري الآمن لأملاكك.'}
                    </p>
                  </div>

                  {/* Errors & Alerts */}
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 mb-6 font-semibold flex items-center gap-2 justify-end"
                    >
                      <span>{authError}</span>
                      <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping shrink-0" />
                    </motion.div>
                  )}

                  {authSuccMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-400 mb-6 font-semibold flex items-center gap-2 justify-end"
                    >
                      <span>{authSuccMsg}</span>
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0" />
                    </motion.div>
                  )}

                  {/* Full Fields Forms Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2 pr-1">الاسم الكريم (الكامل) <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input 
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          disabled={authLoading}
                          className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs focus:ring-1 focus:ring-blue-500 text-white outline-none transition-all placeholder:text-slate-605 disabled:opacity-50 text-right font-semibold"
                          placeholder="مثال: سعود بن محمد النعام"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2 pr-1">البريد الإلكتروني <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input 
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          disabled={authLoading}
                          className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs focus:ring-1 focus:ring-blue-500 text-white outline-none transition-all placeholder:text-slate-605 disabled:opacity-50 text-left font-semibold"
                          placeholder="example@gmail.com"
                          style={{ direction: 'ltr' }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp/Phone Input */}
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2 pr-1">رقم الواتساب (للربط والتنبيهات) <span className="text-red-400">*</span></label>
                      <div className="relative font-mono">
                        <input 
                          type="tel"
                          required
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          disabled={authLoading}
                          className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs focus:ring-1 focus:ring-blue-500 text-white outline-none transition-all placeholder:text-slate-605 disabled:opacity-50 text-left font-semibold"
                          placeholder="+966 5X XXX XXXX"
                          style={{ direction: 'ltr' }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                          <Phone className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Standard Password only inside SignUp Mode */}
                    {authTab === 'signup' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-slate-500 font-bold">8 أحرف على الأقل - يفضل أرقام ورموز</span>
                          <label className="text-xs text-slate-300 font-bold pr-1">كلمة المرور <span className="text-red-400">*</span></label>
                        </div>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            disabled={authLoading}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs focus:ring-1 focus:ring-blue-500 text-white outline-none transition-all placeholder:text-slate-605 disabled:opacity-50 text-left font-mono"
                            placeholder="••••••••"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-white transition-all cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Checkboxes in registration mode */}
                    {authTab === 'signup' && (
                      <div className="space-y-2.5 pt-2 text-right">
                        <label className="flex items-start gap-2.5 text-[10.5px] text-slate-450 select-none cursor-pointer justify-end">
                          <span className="leading-tight">أوافق على <span className="text-slate-200 underline">الشروط والأحكام</span> و<span className="text-slate-200 underline">سياسة الخصوصية</span></span>
                          <input 
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            disabled={authLoading}
                            className="mt-0.5 rounded border-slate-800 bg-slate-950 focus:ring-0 text-blue-600 cursor-pointer"
                          />
                        </label>
                        <label className="flex items-start gap-2.5 text-[10.5px] text-slate-450 select-none cursor-pointer justify-end">
                          <span className="leading-tight text-right">أوافق على استلام معلومات وتنبيهات أتمتة الدخول من نظام سعود النعام على حساب الواتساب الخاص بي.</span>
                          <input 
                            type="checkbox"
                            checked={notifsAccepted}
                            onChange={(e) => setNotifsAccepted(e.target.checked)}
                            disabled={authLoading}
                            className="mt-0.5 rounded border-slate-800 bg-slate-950 focus:ring-0 text-blue-600 cursor-pointer"
                          />
                        </label>
                      </div>
                    )}

                    {/* Standard CTA Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 mt-4 bg-gradient-to-l from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#031B4E] font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-yellow-550/15 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#031B4E] border-t-transparent" />
                          <span>جاري التحقق والمزامنة الفورية...</span>
                        </>
                      ) : (
                        <>
                          <span>{authTab === 'signup' ? 'أنشئ حسابك مجاناً' : 'دخول مجاني فوري'}</span>
                          <ArrowLeft className="h-4 w-4 animate-pulse" />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Toggle Option Toggle Option */}
                  <div className="mt-8 pt-6 border-t border-slate-900/80 flex justify-center text-xs">
                    {authTab === 'signup' ? (
                      <p className="text-slate-400 font-semibold">
                        لديك حساب بالفعل؟{' '}
                        <button
                          onClick={() => {
                            setAuthTab('login');
                            setAuthError('');
                            setAuthSuccMsg('');
                          }}
                          disabled={authLoading}
                          className="text-yellow-500 hover:text-yellow-400 underline font-extrabold focus:outline-none cursor-pointer"
                        >
                          سجل الدخول هنا
                        </button>
                      </p>
                    ) : (
                      <p className="text-slate-400 font-semibold">
                        جديد على المنصة؟{' '}
                        <button
                          onClick={() => {
                            setAuthTab('signup');
                            setAuthError('');
                            setAuthSuccMsg('');
                          }}
                          disabled={authLoading}
                          className="text-yellow-500 hover:text-yellow-400 underline font-extrabold focus:outline-none cursor-pointer"
                        >
                          أنشئ حسابك المجاني مجاناً
                        </button>
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
