import React, { useState, useEffect } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowLeft, ArrowRight, 
  CheckCircle2, AlertTriangle, Key, Clock, Copy, RefreshCw, X, ShieldCheck, HeartHandshake, UserCheck, Star
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';

interface AuthPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, token: string) => void;
  initialTab?: 'login' | 'register' | 'forgot' | 'reset' | 'verify';
  prefilledEmail?: string;
}

export default function AuthPortal({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  initialTab = 'login',
  prefilledEmail = '' 
}: AuthPortalProps) {
  
  const [currentTab, setCurrentTab] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verify'>(initialTab);
  
  // Input fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(prefilledEmail);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('property_manager');
  const [showPassword, setShowPassword] = useState(false);
  
  // Verification/Reset states
  const [otpCode, setOtpCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyTargetEmail, setVerifyTargetEmail] = useState('');
  
  // Feedback / Logic status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tempOtpToShow, setTempOtpToShow] = useState<string | null>(null); // For demo convenience
  
  // Terms checkboxes
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [alertsAgreed, setAlertsAgreed] = useState(true);

  // Decrypted JWT Inspection panel toggle
  const [showJwtInspector, setShowJwtInspector] = useState(false);
  const [inspectToken, setInspectToken] = useState<string | null>(null);

  // Sync state if initial changes
  useEffect(() => {
    setCurrentTab(initialTab);
    if (prefilledEmail) {
      setEmail(prefilledEmail);
      setResetEmail(prefilledEmail);
    }
    setErrorMessage('');
    setSuccessMessage('');
    setTempOtpToShow(null);
  }, [initialTab, prefilledEmail, isOpen]);

  if (!isOpen) return null;

  // 1. REGISTER handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setTempOtpToShow(null);

    if (!termsAgreed) {
      setErrorMessage('يجب الموافقة على الشروط والأحكام و سياسة الخصوصية للاستمرار.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('يجب أن تكون كلمة المرور مكونة من ٨ رموز أو أحرف على الأقل لتأمين أملاكك.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role: selectedRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت عملية إنشاء الحساب');
      }

      setInspectToken(data.token);
      setVerifyTargetEmail(email);
      setTempOtpToShow(data.otpCode);
      
      setSuccessMessage('تم إنشاء حسابك العقاري بنجاح! كود التحقق الثنائي مُرسل للتو.');
      
      // Auto transition to Verification screen
      setTimeout(() => {
        setCurrentTab('verify');
        setErrorMessage('');
        setSuccessMessage('');
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIN handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setTempOtpToShow(null);

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: email,
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت محاولة تسجيل الدخول');
      }

      setInspectToken(data.token);
      
      // Save elements locally
      localStorage.setItem('saas_current_user', JSON.stringify(data.user));
      localStorage.setItem('saas_jwt_token', data.token);

      setSuccessMessage(`أهلاً بك مجدداً أستاذ ${data.user.fullName}! جاري تهيئة البوابة...`);

      // Add a simulated short loader delay for standard luxury feel
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. FORGOT PASSWORD handler
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setTempOtpToShow(null);

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال كود الاسترجاع');
      }

      setTempOtpToShow(data.otpCode);
      setSuccessMessage('تم التحقق وإرسال كود استعادة كلمة المرور بنجاح.');
      
      setTimeout(() => {
        setCurrentTab('reset');
        setErrorMessage('');
        setSuccessMessage('');
      }, 2200);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. RESET PASSWORD CONFIRM handler
  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('يجب أن تكون كلمة المرور الجديدة ٨ رموز أو أحرف على الأقل.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          code: otpCode,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تغيير كلمة المرور');
      }

      setSuccessMessage('تم اعتماد كلمة مرورك الجديدة بنجاح! جاري تحويلك لشاشة تسجيل الدخول...');
      
      setTimeout(() => {
        setEmail(resetEmail);
        setCurrentTab('login');
        setOtpCode('');
        setNewPassword('');
        setErrorMessage('');
        setSuccessMessage('');
        setTempOtpToShow(null);
      }, 2500);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. EMAIL VERIFY OTP handler
  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    setLoading(true);
    try {
      const targetEmail = verifyTargetEmail || email;
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          code: otpCode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'رمز التحقق غير مطابق للرمز المرسل');
      }

      setSuccessMessage('تم التحقق وتوثيق بريدك الإلكتروني بنجاح وصلاحية مطلقة!');
      
      // Auto Login with verified states if login-ready token exists
      setTimeout(() => {
        // Find user by email in local storage or force login
        setCurrentTab('login');
        setEmail(targetEmail);
        setPassword('');
        setOtpCode('');
        setErrorMessage('');
        setSuccessMessage('');
        setTempOtpToShow(null);
      }, 2200);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper decoded token visualizer
  const renderJwtInspector = () => {
    if (!inspectToken) return null;
    
    try {
      const parts = inspectToken.split('.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      return (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right font-mono text-[10px] space-y-3 overflow-hidden leading-relaxed">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-yellow-500 font-bold">فاحص جلسات النظام والـ JWT 🔑</span>
            <span className="text-[9px] text-slate-500">JWT Token standard format</span>
          </div>

          <div>
            <span className="text-red-400 font-bold block mb-1">// Header (مروَّسة التشفير)</span>
            <pre className="text-slate-300 bg-slate-900/40 p-2 rounded-lg text-left overflow-x-auto" style={{ direction: 'ltr' }}>
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>

          <div>
            <span className="text-blue-400 font-bold block mb-1">// Payload (بيانات الجلسة والصلاحية)</span>
            <pre className="text-slate-300 bg-slate-900/40 p-2 rounded-lg text-left overflow-x-auto mb-1" style={{ direction: 'ltr' }}>
              {JSON.stringify(payload, null, 2)}
            </pre>
            <div className="text-[9px] text-slate-500 pr-1 leading-tight">
              * الصلاحية مستخرجة ديناميكياً من التوقيع الرقمي للـ JWT للحد من الانتحال.
            </div>
          </div>

          <div>
            <span className="text-emerald-400 font-bold block mb-1">// Active Signature (الختم والتوقيع المقيد)</span>
            <pre className="text-emerald-450 bg-slate-900/80 p-2 rounded-lg text-left overflow-x-auto select-all leading-none" style={{ direction: 'ltr' }}>
              {signature}
            </pre>
          </div>
        </div>
      );
    } catch (e) {
      return <p className="text-xs text-red-400 font-semibold font-mono">خطأ في طباعة وفحص توقيع JWT المعطل.</p>;
    }
  };

  const roleCardInfo = {
    super_admin: { label: 'مدير عام مكلَّف', bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60', desc: 'صلاحيات كاملة مطلقة لكافة المنظومة، المحافظ، والسجلات والحسابات وتعديل المطورين.' },
    property_manager: { label: 'مدير أملاك', bg: 'bg-blue-950/40 text-blue-405 border-blue-900/60', desc: 'إدارة الوحدات، العقود، المهام، ترحيل الواتساب والمدفوعات والمستأجرين.' },
    accountant: { label: 'محاسب مالي معتمد', bg: 'bg-purple-950/40 text-purple-400 border-purple-900/60', desc: 'صلاحيات قيد الحركة المالية، معالجة الفواتير، الاستحقاق المصرفي وميزان المراجعة.' },
    tenant: { label: 'مستأجر عقاري', bg: 'bg-amber-950/40 text-amber-450 border-amber-900/60', desc: 'بوابة النزيل التفاعلية: دفع الاستحقاق، استلام الدخول ورقم الباب، وطلب الصيانة.' },
    owner: { label: 'مالك ومستثمر عقاري', bg: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/60', desc: 'لوحة تفاعلية لقراءة العائد الاستثماري لمشروعات النعام، الإشغال والموجودات.' },
    maintenance_staff: { label: 'مزود صيانة وتفتيش', bg: 'bg-red-950/40 text-red-400 border-red-900/60', desc: 'إدارة أوامر العمل وشهادات الإنجاز الفني وتحديث الوحدات الشاغرة.' }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!loading) onClose();
        }}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative bg-[#020712] border border-slate-800/80 text-[#EFF6FF] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800 shadow-2xl shadow-blue-950/30 z-10 text-right font-sans"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Close Switch */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-6 left-6 p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-10 relative">
          
          {/* Logo Heading */}
          <div className="flex items-center gap-3.5 mb-10 justify-start flex-row-reverse text-right">
            <div className="h-10 w-10 shrink-0 bg-white rounded-2xl flex items-center justify-center p-1.5 border border-slate-800">
              <Star className="h-full w-full text-[#1E40AF]" fill="#1E40AF" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white tracking-widest">سعود النعام لإدارة وضيافة المرافق</span>
              <span className="text-[10px] text-yellow-500 font-bold tracking-wider">البوابة الموحدة للملاك، المستأجرين، والأطقم الفنية</span>
            </div>
          </div>

          {/* Quick instructions / Demo Credentials */}
          <div className="mb-6 p-3 bg-blue-950/20 border border-blue-900/30 rounded-2xl text-[11px] text-blue-300 leading-relaxed text-right">
            💡 <strong>لتجربة الأدوار المختلفة مباشرة دون إنشاء حساب:</strong> البريد الإلكتروني هو (اسم الدور)<code className="mx-1 text-white text-xs">@naam.com</code> وكلمة المرور المشتركة هي <code className="text-white text-xs">Password123</code>. مثال: <code className="text-white">admin@naam.com</code> للوصول لـ Super Admin، أو <code className="text-white">accountant@naam.com</code> لـ Accountant.
          </div>

          {/* Dynamic Code OTP Helper */}
          {tempOtpToShow && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-[11px] text-yellow-400 text-right space-y-2"
            >
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="font-extrabold text-xs">إشعار محاكاة خدمة الرسائل الفورية (الأتمتة) 📱</span>
                <span className="font-mono bg-yellow-500 text-slate-950 px-1.5 py-0.5 rounded font-black text-[9px] animate-pulse">رسالة جديدة</span>
              </div>
              <p className="leading-relaxed">
                عزيزنا المشرف، تم إرسال كود التحقق الثنائي التالي لتسجيل وتوثيق حساب {fullName || email || 'النزيل'} بنجاح:
              </p>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(tempOtpToShow);
                    setOtpCode(tempOtpToShow);
                  }}
                  className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-extrabold text-[10px] rounded-lg cursor-pointer transition-all"
                >
                  نسخ وتعبئة تلقائية 📋
                </button>
                <span className="font-sans text-lg font-black tracking-[0.3em] text-white select-all">{tempOtpToShow}</span>
              </div>
            </motion.div>
          )}

          {/* Error Prompt */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl text-xs text-red-400 mb-6 font-semibold flex items-center gap-3 justify-end"
            >
              <span className="text-right">{errorMessage}</span>
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            </motion.div>
          )}

          {/* Success Prompt */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-950/45 border border-emerald-900/50 rounded-2xl text-xs text-emerald-300 mb-6 font-semibold flex items-center gap-3 justify-end animate-pulse"
            >
              <span className="text-right">{successMessage}</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            </motion.div>
          )}

          {/* -------------------- Sub Forms -------------------- */}
          <AnimatePresence mode="wait">

            {/* A: LOGIN TAB */}
            {currentTab === 'login' && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">تسجيل دخول آمن للمنصة 💻</h3>
                  <p className="text-xs text-slate-400">سجل الدخول لرقم جوالك أو بريدك الإلكتروني المعتمر بصورة فورية لمتابعة أملاكك.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email/Phone */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">البريد الإلكتروني أو رقم الهاتف <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left"
                        placeholder="manager@naam.com"
                        style={{ direction: 'ltr' }}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5 px-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setCurrentTab('forgot');
                          setErrorMessage('');
                          setSuccessMessage('');
                          setTempOtpToShow(null);
                        }}
                        className="text-[10.5px] text-yellow-500 hover:text-yellow-405 font-bold underline transition-all cursor-pointer"
                      >
                        نسيت كلمة المرور؟
                      </button>
                      <label className="text-xs text-slate-300 font-bold">كلمة المرور المشفرة <span className="text-red-400">*</span></label>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left font-mono"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white transition-all cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-l from-[#1E40AF] to-[#0A1931] hover:from-[#2563EB] hover:to-[#1E40AF] text-white font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>جاري التحقق والمصادقة الأمنية...</span>
                      </>
                    ) : (
                      <>
                        <span>تسجيل الدخول الآمن</span>
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Foot switch */}
                <div className="pt-6 border-t border-slate-900/80 text-center text-xs">
                  <p className="text-slate-400 font-semibold">
                    ليس لديك حساب عقاري مسجل؟{' '}
                    <button
                      onClick={() => {
                        setCurrentTab('register');
                        setErrorMessage('');
                        setSuccessMessage('');
                        setTempOtpToShow(null);
                      }}
                      className="text-yellow-500 hover:text-yellow-400 font-extrabold underline focus:outline-none cursor-pointer"
                    >
                      أنشئ حساباً جديداً مجاناً
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* B: REGISTER TAB */}
            {currentTab === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">إنشاء حساب عقاري موحد 🏢</h3>
                  <p className="text-xs text-slate-400">انضم مجاناً واحصل على الصلاحيات الكاملة لأتمتة وخدمات الفحص والدخول الذاتي.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">الاسم الكريم (الكامل) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={loading}
                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-right font-semibold"
                        placeholder="ثامر محمد العاصم"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <User className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Dual Grid (Email & Phone) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">البريد الإلكتروني <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left"
                          placeholder="thamer@example.com"
                          style={{ direction: 'ltr' }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                          <Mail className="h-4.5 w-4.5" />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">رقم الواتساب <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input 
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading}
                          className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left font-mono"
                          placeholder="+966 50 000 0000"
                          style={{ direction: 'ltr' }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                          <Phone className="h-4.5 w-4.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pass */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">كلمة المرور الجديدة <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left font-mono"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white transition-all cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Role dropdown Selection */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">دورك الوظيفي وصلاحياتك المباشرة <span className="text-red-400">*</span></label>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all cursor-pointer font-semibold mb-2 text-right"
                    >
                      <option value="super_admin">مدير عام المجموعة (Super Admin)</option>
                      <option value="property_manager">مدير أملاك عقارية (Property Manager)</option>
                      <option value="accountant">محاسب مالي واستحقاق (Accountant)</option>
                      <option value="owner">مستثمر ومالك عقاري (Owner)</option>
                      <option value="tenant">مستأجر عقاري نشط (Tenant)</option>
                      <option value="maintenance_staff">طاقم صيانة وتفتيش (Maintenance Staff)</option>
                    </select>

                    {/* Description of current selected role for clarity of RBAC */}
                    <div className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-all ${roleCardInfo[selectedRole].bg}`}>
                      <strong>المستوى الأمني لـ [{roleCardInfo[selectedRole].label}]:</strong> {roleCardInfo[selectedRole].desc}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-2 text-right">
                    <label className="flex items-start gap-3 text-xs text-slate-400 select-none cursor-pointer justify-end">
                      <span className="leading-tight">أوافق على <span className="text-yellow-500 underline">اتفاقية الاستخدام الفنية</span> و<span className="text-yellow-500 underline">سياسة سرية المعلومات</span> الخاصة بشركة سعود النعام.</span>
                      <input 
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        disabled={loading}
                        className="mt-0.5 rounded border-slate-800 bg-[#020712] text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-l from-yellow-500 to-yellow-600 hover:from-yellow-450 hover:to-yellow-500 text-slate-950 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-yellow-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>جاري تسجيل الحساب الجديد والمزامنة...</span>
                      </>
                    ) : (
                      <>
                        <span>أكمل التسجيل وتفعيل الحساب</span>
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch */}
                <div className="pt-6 border-t border-slate-900/80 text-center text-xs">
                  <p className="text-slate-400 font-semibold">
                    لديك حساب مسجل مسجل مسبقاً؟{' '}
                    <button
                      onClick={() => {
                        setCurrentTab('login');
                        setErrorMessage('');
                        setSuccessMessage('');
                        setTempOtpToShow(null);
                      }}
                      className="text-yellow-500 hover:text-yellow-400 font-extrabold underline focus:outline-none cursor-pointer"
                    >
                      سجل الدخول هنا
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* C: FORGOT PASSWORD TAB */}
            {currentTab === 'forgot' && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">استعادة كلمة المرور المفقودة 🔑</h3>
                  <p className="text-xs text-slate-400">أدخل بريدك الإلكتروني وسيقوم الهاتف الذكي بإرسال كود فوري لإعادة تعيين الحساب.</p>
                </div>

                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">البريد الإلكتروني المرتبط <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left"
                        placeholder="example@naam.com"
                        style={{ direction: 'ltr' }}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-l from-yellow-500 to-yellow-650 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>جاري إصدار كود التحقق والتحقق من حسابك...</span>
                      </>
                    ) : (
                      <>
                        <span>أرسل كود استرداد كلمة المرور</span>
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-900/80 text-center text-xs">
                  <button
                    onClick={() => {
                      setCurrentTab('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                      setTempOtpToShow(null);
                    }}
                    className="text-slate-400 hover:text-white font-extrabold flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>العودة لشاشة الدخول الرئيسية</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* D: RESET PASSWORD CONFIRMATION */}
            {currentTab === 'reset' && (
              <motion.div
                key="reset-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">تعيين كلمة المرور الجديدة 🔒</h3>
                  <p className="text-xs text-slate-400">أدخل كود استعادة الحساب المكون من ٦ أرقام المولد بنظام الوثائق لتحديث كلمة مرورك.</p>
                </div>

                <form onSubmit={handleResetConfirm} className="space-y-4">
                  {/* Code */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">رمز الاستعادة الثنائي (OTP) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        disabled={loading}
                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-sm font-black text-white tracking-[0.2em] outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-center font-mono"
                        placeholder="XXXXXX"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Key className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* New Pass */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">كلمة المرور الجديدة المتينة <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-left font-mono"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white transition-all cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#1E40AF] hover:bg-blue-700 text-white font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>جاري تحديث سجلات الحساب...</span>
                      </>
                    ) : (
                      <>
                        <span>إعادة تعيين واعتماد كلمة المرور</span>
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-900/80 text-center text-xs">
                  <button
                    onClick={() => {
                      setCurrentTab('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                      setTempOtpToShow(null);
                    }}
                    className="text-slate-400 hover:text-white font-extrabold flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>العودة لشاشة الدخول</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* E: EMAIL VERIFY TAB */}
            {currentTab === 'verify' && (
              <motion.div
                key="verify-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-2 justify-end">
                    <span className="font-extrabold text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20 animate-pulse">مطلوب التوثيق الثنائي</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">توثيق صندوق البريد الإلكتروني 📧</h3>
                  </div>
                  <p className="text-xs text-slate-400">لقد أرسلنا كود تفعيل فوري مكون من ٦ رمز لبريدك الإلكتروني المعتمد لتأمين هويتك.</p>
                </div>

                <form onSubmit={handleEmailVerify} className="space-y-4 font-sans">
                  {/* Code */}
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-2.5 pr-1">رمز التحقق الثنائي (OTP) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        disabled={loading}
                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 focus:border-blue-500 text-lg font-black text-white tracking-[0.3em] outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 text-center font-mono"
                        placeholder="XXXXXX"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <Shield className="h-4.5 w-4.5 animate-pulse text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-l from-[#10B981] to-emerald-750 hover:from-[#34D399] hover:to-[#10B981] text-white font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>جاري التحقق وتوثيق الصندوق...</span>
                      </>
                    ) : (
                      <>
                        <span>تحقق وتأكيد البريد والتوثيق</span>
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-900/80 text-center text-xs flex justify-between items-center flex-row-reverse px-2">
                  <button
                    onClick={() => {
                      setCurrentTab('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                      setTempOtpToShow(null);
                    }}
                    className="text-slate-450 hover:text-white font-extrabold flex items-center gap-1.5 cursor-pointer text-[11px]"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>تخطي والعودة للدخول</span>
                  </button>
                  
                  <span className="text-[10.5px] text-slate-500">
                    لم تستلم الكود؟ <strong className="text-yellow-500 hover:text-yellow-400 cursor-pointer underline">أعد الإرسال مجدداً</strong> (بعد ٤٩ ثانية)
                  </span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Real JWT live inspection trigger */}
          {inspectToken && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-right">
              <button
                type="button"
                onClick={() => setShowJwtInspector(!showJwtInspector)}
                className="text-xs text-blue-400 hover:text-blue-300 font-extrabold flex items-center gap-2 cursor-pointer pb-2"
              >
                <span>{showJwtInspector ? 'إخفاء لوحة فحص الـ JWT' : 'أظهر فاحص ومفتش ومحلل الـ JWT (للتحقق الأمني)'}</span>
                <Key className="h-3.5 w-3.5" />
              </button>
              
              <AnimatePresence>
                {showJwtInspector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderJwtInspector()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
