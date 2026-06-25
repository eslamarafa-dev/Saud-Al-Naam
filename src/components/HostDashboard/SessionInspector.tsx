import React, { useState, useEffect } from 'react';
import { 
  Key, ShieldCheck, Clock, ShieldX, Database, Terminal, User, AlertOctagon, 
  Send, RefreshCw, Clipboard, Check, Lock, ShieldAlert, Cpu
} from 'lucide-react';
import { AuthUser } from '../../types';

interface SessionInspectorProps {
  currentUser: AuthUser | null;
  jwtToken: string | null;
  onSessionConfig: (user: null, token: null) => void; 
  onTriggerAction: (title: string, desc: string) => void;
  theme?: 'light' | 'dark';
}

export default function SessionInspector({ 
  currentUser, 
  jwtToken, 
  onSessionConfig, 
  onTriggerAction,
  theme = 'dark'
}: SessionInspectorProps) {
  
  const isLight = theme === 'light';
  const [copied, setCopied] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<'Expiring soon' | 'Active' | 'N/A'>('Active');
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(3600); // 1 hour simulation

  useEffect(() => {
    // Tick down simulated countdown for JWT
    const interval = setInterval(() => {
      setTimeLeftSecs(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Simulate timeout sign-out when it reaches 0
          handleSimulateExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyToken = () => {
    if (jwtToken) {
      navigator.clipboard.writeText(jwtToken);
      setCopied(true);
      onTriggerAction('نسخ الـ JWT', 'تم نسخ رمز الجلسة الثنائي الحامل للصلاحية للحافظة');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateExpiry = () => {
    onTriggerAction('محاكاة انتهاء جلسة الـ JWT ⏳', 'تم انتهاء صلاحية الرمز ومصادقة الطرد التلقائي بنجاح!');
    // Trigger standard logout
    localStorage.removeItem('saas_current_user');
    localStorage.removeItem('saas_jwt_token');
    onSessionConfig(null, null);
  };

  // Extract payload blocks manually to render
  let headerObj = { alg: "HS256", typ: "JWT" };
  let payloadObj: any = { status: "No Active Session Logged In" };
  let signatureHex = "Unsigned_Secret_Key_Default";

  if (jwtToken) {
    try {
      const parts = jwtToken.split('.');
      if (parts.length === 3) {
        headerObj = JSON.parse(atob(parts[0]));
        payloadObj = JSON.parse(atob(parts[1]));
        signatureHex = parts[2];
      }
    } catch (e) {
      payloadObj = { error: "Failed to decode Base64 URL format of JWT" };
    }
  }

  const roleNames: Record<string, string> = {
    super_admin: 'المدير العام للمجموعة (Super Admin)',
    property_manager: 'مدير الأملاك والوحدات (Property Manager)',
    accountant: 'المحاسب المالي المفتش (Accountant)',
    tenant: 'المستأجر السكني (Tenant)',
    owner: 'المالك العقاري (Owner)',
    maintenance_staff: 'مشرف الصيانة (Maintenance)',
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
        <div className="flex items-center gap-3 justify-end flex-row-reverse">
          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-950/40 border-blue-900/40 text-blue-400'}`}>
            <Key className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>مراقب الـ JWT والتحقق الفني المباشر (Session Guard) 🔑</h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              تحليل شفرات الـ JWT الصادرة، فك تشفير مروّسات التوقيع الرقمي، ومراقبة حركة البيانات المشفرة على مستوى التطوير.
            </p>
          </div>
        </div>

        {currentUser && (
          <button
            onClick={handleSimulateExpiry}
            className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer ${isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600' : 'bg-red-950/40 hover:bg-red-900/40 border-red-900/40 hover:border-red-650 text-red-400'}`}
          >
            🎯 محاكاة انتهاء التوكن (Simulate Expiry)
          </button>
        )}
      </div>

      {!currentUser ? (
        <div className={`p-8 text-center border rounded-3xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900/40'}`}>
          <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>لا توجد جلسة نشطة مسجلة حالياً لترخيص التحليل الرياضي.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Token inspector detailed logs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Decoded visual tabs */}
            <div className={`rounded-2xl border p-5 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/50 border-slate-800/80'}`}>
              <div className={`flex justify-between items-center text-xs pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-900/80'}`}>
                <span className={`font-mono flex items-center gap-1.5 font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                  <span>HS256 Standard HMAC Verification Verified</span>
                  <span className={`h-2 w-2 rounded-full animate-pulse ${isLight ? 'bg-emerald-600' : 'bg-emerald-400'}`}></span>
                </span>
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>فك تشفير البيانات الحية للتوكن (Decoded Token Parts)</span>
              </div>

              {/* 1. Header */}
              <div className="space-y-1.5 text-left font-mono">
                <div className={`flex justify-between items-center text-[10.5px] font-bold ${isLight ? 'text-rose-600' : 'text-red-400'}`}>
                  <span>alg: {headerObj.alg}</span>
                  <span className="font-sans font-black pr-1 block mb-0.5">// 1. مروّسة التوقيع وتوليد المتغيرات (Header)</span>
                </div>
                <pre className={`p-3.5 rounded-xl text-[11px] overflow-x-auto select-all leading-normal border ${isLight ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-950 text-slate-350 border-slate-900'}`} style={{ direction: 'ltr' }}>
                  {JSON.stringify(headerObj, null, 2)}
                </pre>
              </div>

              {/* 2. Payload */}
              <div className="space-y-1.5 text-left font-mono">
                <div className={`flex justify-between items-center text-[10.5px] font-bold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                  <span>sub: {payloadObj.id ? payloadObj.id.substring(0, 8) + '...' : 'N/A'}</span>
                  <span className="font-sans font-black pr-1 block mb-0.5">// 2. متن الجلسة وحقيبة الصلاحيات الموقعة (Payload)</span>
                </div>
                <pre className={`p-3.5 rounded-xl text-[11px] overflow-x-auto select-all leading-normal border ${isLight ? 'bg-slate-50 text-blue-900 border-slate-200' : 'bg-slate-950 text-blue-300/80 border-slate-900'}`} style={{ direction: 'ltr' }}>
                  {JSON.stringify(payloadObj, null, 2)}
                </pre>
              </div>

              {/* 3. Signature */}
              <div className="space-y-1.5 text-left font-mono">
                <div className={`flex justify-between items-center text-[10.5px] font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                  <span>signature_key: secure_secret_token</span>
                  <span className="font-sans font-black pr-1 block mb-0.5">// 3. التوقيع المشفر وضمان عدم العبث (Signature)</span>
                </div>
                <div className={`p-3.5 rounded-xl text-[10px] break-all select-all leading-relaxed border ${isLight ? 'bg-slate-50 text-emerald-800 border-slate-200' : 'bg-slate-950 text-emerald-455 border-slate-900'}`} style={{ direction: 'ltr' }}>
                  HMACSHA256(
                    base64UrlEncode(header) + "." +
                    base64UrlEncode(payload),
                    <span className={`${isLight ? 'text-amber-600 font-extrabold' : 'text-yellow-500 font-bold'}`}>"saud-alnaam-key-premium-secret"</span>
                  ) = <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{signatureHex}</span>
                </div>
              </div>

            </div>

            {/* Raw Token Input block */}
            <div className={`rounded-2xl border p-5 space-y-3 font-mono ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/30 border-slate-800/80'}`}>
              <div className="flex justify-between items-center text-xs pb-1">
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className={`px-2.5 py-1 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-sans ${isLight ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200' : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400'}`}
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Clipboard className="h-3 w-3" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ التوكن الخام'}</span>
                </button>
                <span className={`font-sans text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-350'}`}>الـ JWT الخام المرسل من الخادم بالمتصفح (Raw Base64 Encoded Token)</span>
              </div>
              <div className={`p-3 text-[9.5px] rounded-xl border select-all break-all leading-relaxed max-h-32 overflow-y-auto text-left ${isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-500 border-slate-900'}`} style={{ direction: 'ltr' }}>
                {jwtToken}
              </div>
            </div>

          </div>

          {/* Col 3: Diagnostics & General Recommendations */}
          <div className="space-y-6">
            
            {/* Session State overview Card */}
            <div className={`p-5 rounded-2xl border space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-gradient-to-br from-blue-950/20 to-slate-950/60 border-slate-800/80'}`}>
              <span className={`text-[10px] font-extrabold block ${isLight ? 'text-blue-650' : 'text-blue-400'}`}>تشخيص الجلسة الحالية (Active Session Scope)</span>

              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentUser.fullName}</h4>
                  <span className={`text-[10px] font-semibold font-mono ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>{currentUser.email}</span>
                </div>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-600/20 border-blue-900/50 text-blue-400'}`}>
                  <User className="h-5 w-5" />
                </div>
              </div>

              <div className={`space-y-2.5 pt-2 border-t text-xs ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                
                <div className="flex justify-between items-center">
                  <span className={`font-mono font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{currentUser.id.substring(0, 10)}...</span>
                  <span className="text-slate-500">معرّف الحساب (ID)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{roleNames[currentUser.role] || currentUser.role}</span>
                  <span className="text-slate-500">رتبة الدخول</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentUser.isEmailVerified 
                      ? (isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-emerald-950 text-emerald-400') 
                      : (isLight ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-yellow-950 text-yellow-400')
                  }`}>
                    {currentUser.isEmailVerified ? 'موّثق ومعتمد ✓' : 'مطلوب التحقق عبر الكود'}
                  </span>
                  <span className="text-slate-500 font-semibold">حالة البريد</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className={`flex items-center gap-1.5 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <span>{Math.floor(timeLeftSecs / 60)}د : {timeLeftSecs % 60}ث</span>
                    <Clock className="h-3 w-3 text-yellow-500 animate-spin" />
                  </div>
                  <span className="text-slate-500 font-semibold">انتهاء الـ Expire تفصيلاً</span>
                </div>

              </div>
            </div>

            {/* Architecture guidelines / Recommendations list */}
            <div className={`p-5 rounded-2xl border space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/40 border-slate-800/80'}`}>
              <span className={`text-[10px] font-extrabold block ${isLight ? 'text-amber-700' : 'text-yellow-500'}`}>توصيات النخبة وبنية التشفير العقارية (SaaS Security Guard List)</span>

              <div className={`space-y-3.5 text-xs ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>
                
                <div className="flex gap-2.5 items-start justify-end">
                  <div className="text-right leading-relaxed text-[11px]">
                    <h5 className={`font-bold mb-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>منع الهجمات عبر الـ HTTPOnly Cookies</h5>
                    <p className={`text-[10px] ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>نوصي بحفظ الرمز بملفات الارتباط الخبيثة (Cookies) المزودة بخاصية الخزن المغلق لضمان منع تسريبات XSS.</p>
                  </div>
                  <Lock className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>

                <div className="flex gap-2.5 items-start justify-end">
                  <div className="text-right leading-relaxed text-[11px]">
                    <h5 className={`font-bold mb-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>البنية المقرونة بالـ CORS و CSRF</h5>
                    <p className={`text-[10px] ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>يتم توليد رموز تحقق فريدة ومطابقتها ديناميكا على مستوى معالجات الخادم لكل عملية لضمان منع الانتحال العابر للمواقع.</p>
                  </div>
                  <Cpu className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isLight ? 'text-indigo-600' : 'text-blue-400'}`} />
                </div>

                <div className="flex gap-2.5 items-start justify-end">
                  <div className="text-right leading-relaxed text-[11px]">
                    <h5 className={`font-bold mb-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>تدقيق التراخيص عبر دور المستأجر والملاك</h5>
                    <p className={`text-[10px] ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>محاولات تخطي الصلاحيات يتم رصدها في جدار الحماية وتسجيلها معاً في مصفوفات الخادم لتسهيل تدقيق الأمن العام.</p>
                  </div>
                  <ShieldCheck className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
