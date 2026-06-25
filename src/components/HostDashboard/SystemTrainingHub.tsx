import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Map, HelpCircle, UserCheck, ShieldAlert, 
  ArrowLeft, ArrowRight, CheckCircle2, TrendingUp, Clock, Zap, 
  ChevronRight, ArrowDown, Laptop, Shield, MessageSquare, 
  Key, User, Calendar, DollarSign, BarChart3, Settings, HelpCircle as HelpIcon,
  ChevronDown, Smile, AlertCircle, Copy, Check
} from 'lucide-react';

interface NodeDetail {
  id: string;
  title: string;
  description: string;
  role: string;
  benefits: string[];
  steps: string[];
  targetTab: string;
}

export default function SystemTrainingHub({ theme, setActiveSubTab }: { theme?: string, setActiveSubTab?: (tab: any) => void }) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'map' | 'benefits' | 'roles' | 'features'>('map');
  const [selectedNode, setSelectedNode] = useState<string>('properties');
  const [activeRolePath, setActiveRolePath] = useState<'owner' | 'manager' | 'cleaner' | 'accountant' | 'tenant'>('manager');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  // Simulation Tool State
  const [simStep, setSimStep] = useState<number>(0);
  const [simGuestName, setSimGuestName] = useState('فيصل بن عبدالله');
  const [simLog, setSimLog] = useState<string[]>([]);
  const [lockStatus, setLockStatus] = useState<'locked' | 'unlocked'>('locked');

  const nodes: Record<string, NodeDetail> = {
    properties: {
      id: 'properties',
      title: '1. بناء وتجهيز المحفظة العقارية',
      description: 'تبدأ رحلتك من هنا بتعريف العقارات، المباني، والوحدات السكنية مع تحديد تفاصيلها كالدخول الذاتي والأسعار.',
      role: 'مالك العقار / مدير العقار',
      benefits: ['تنظيم الأصول بترميز جغرافي دقيق', 'تسهيل المتابعة الشاملة للغرف المتاحة'],
      steps: [
        'انتقل إلى قسم "العقارات" لإضافة اسم المجمع',
        'حدد عدد المباني والغرف والوحدات السكنية بدقة',
        'ثبّت إعدادات الدخول الذكي وتفاصيل شبكة الـ WiFi المخصصة'
      ],
      targetTab: 'properties'
    },
    bookings: {
      id: 'bookings',
      title: '2. تسجيل وتنسيق الحجوزات اليومية',
      description: 'إدخال ومتابعة بيانات الحجوزات من منصات Airbnb، جاذر إن، أو الحجوزات المباشرة وضمان عدم تداخل التواريخ.',
      role: 'المضيف / مدير العقار',
      benefits: ['منع الحجوزات المزدوجة نهائياً', 'تحديث فوري لجدول الإشغال والتقويم الرقمي'],
      steps: [
        'انتقل إلى قسم "الحجوزات" أو "التقويم"',
        'أدخل بيانات النزيل، قيمة الحجز، وتواريخ الدخول والخروج',
        'تأكد من مطابقة حالة الوحدة (محجوزة) باللون البرتقالي الجذاب'
      ],
      targetTab: 'bookings'
    },
    copilot: {
      id: 'copilot',
      title: '3. ذكاء المضيف ومراسلة الضيف الآلية',
      description: 'استخدام المساعد العقاري الذكي المدعوم بـ Gemini AI لصياغة رسائل الدخول الذاتي المخصصة والرد على التقييمات بدقة.',
      role: 'المضيف (Host)',
      benefits: ['توفير 80% من وقت المراسلة اليدوية', 'صياغة ترحيبية راقية تضمن تقييم 5 نجوم'],
      steps: [
        'افتح قسم "المساعد الذكي (AI Copilot)"',
        'اختر "توليد رسالة الترحيب" وأدخل اسم الضيف وكود الباب',
        'انسخ الرسالة الجاهزة التي تحتوي على الموقع، كود القفل، وبيانات الـ WiFi وأرسلها بنقرة واحدة!'
      ],
      targetTab: 'copilot'
    },
    cleaners: {
      id: 'cleaners',
      title: '4. تجهيز الوحدة وصيانة الجودة',
      description: 'توجيه طاقم الضيافة فور خروج النزيل عبر محاكي تنظيف متنقل لتبخير الشقة وتأكيد جاهزيتها الفندقية قبل دخول الضيف الجديد.',
      role: 'طاقم النظافة والصيانة',
      benefits: ['ضمان تطهير وتعقيم الغرف بـ 5 خطوات محددة', 'تسجيل التكاليف التشغيلية لكل دورة نظافة تلقائياً'],
      steps: [
        'قم بإسناد مهمة تنظيف من قسم "إداريات النظافة"',
        'يقوم العامل عبر هاتفه بإتمام قائمة الفحص (تبخير بالعود، تغيير الشراشف، تعقيم الحمام)',
        'يتم التقاط صورة إثبات التعقيم ورفعها ليتحول لون الشقة إلى (جاهزة) فليمتلك المضيف ثقة كاملة!'
      ],
      targetTab: 'operations'
    },
    accounting: {
      id: 'accounting',
      title: '5. الفوترة الفورية والتحصيل المالي',
      description: 'إنشاء الفواتير تلقائياً للنزلاء وتسجيل السندات المالية والمصروفات والعمولات لضمان دقة الأرقام.',
      role: 'المحاسب (Accountant)',
      benefits: ['مطابقة كاملة للإيرادات مع التكاليف والمصروفات التشغيلية', 'كشف فوري للأرباح الصافية لكل وحدة على حدة'],
      steps: [
        'يصدر النظام فاتورة حجز للنزيل بشكل تلقائي',
        'يتم تأكيد استلام الدفعة في "السندات المالية"',
        'تسجيل فواتير الكهرباء أو صيانة السباكة كـ "مصاريف" لخصمها من الإيراد الإجمالي'
      ],
      targetTab: 'invoices'
    },
    analytics: {
      id: 'analytics',
      title: '6. لوحة التقارير والتحليل الإستراتيجي',
      description: 'مراقبة أداء محفظتك العقارية عبر رسوم بيانية تفاعلية تحلل معدل الإشغال، الإيرادات الصافية، والوحدات الأكثر طلباً.',
      role: 'مالك العقار / المستثمر',
      benefits: ['اتخاذ قرارات تسعير ذكية بناءً على إحصائيات حقيقية', 'تسهيل حساب وتوزيع أرباح الشركاء بنسب واضحة'],
      steps: [
        'انتقل لـ "التحليلات والمؤشرات" أو "التقارير"',
        'راقب منحنى الأرباح الشهرية ومقارنتها بالربع السنوي السابق',
        'قم بتصدير التقرير المالي الشامل بكبسة زر للملاك والشركاء'
      ],
      targetTab: 'analytics'
    }
  };

  const handleSimNext = () => {
    let nextStep = simStep + 1;
    let log = [...simLog];
    
    if (nextStep === 1) {
      log.push(`🔹 خطوة 1: تم استيراد حجز للنزيل "${simGuestName}" في شقة "الملقا الفاخرة - 302"`);
      log.push(`🚪 تم ربط القفل الذكي للباب وتوليد كود الدخول المؤقت [ 8530# ]`);
    } else if (nextStep === 2) {
      log.push(`🤖 خطوة 2: قام Gemini AI بصياغة رسالة الترحيب الراقية وتضمين إحداثيات الموقع وتفاصيل الواي فاي.`);
      log.push(`✉️ تم محاكاة إرسال الرسالة الترحيبية للنزيل عبر الواتساب بنجاح!`);
    } else if (nextStep === 3) {
      log.push(`🧹 خطوة 3: تم إرسال إشعار فوري لمشرف النظافة "أبو محمد" لتجهيز الشقة.`);
      log.push(`✨ قام طاقم النظافة بإتمام الـ 5 خطوات الفندقية وتبخير الصالة بكسرة عود فاخرة.`);
    } else if (nextStep === 4) {
      log.push(`🔑 خطوة 4: النزيل يقف عند الباب الآن.. يدخل الكود الذكي [ 8530# ]`);
      setLockStatus('unlocked');
      log.push(`🔓 تم فتح الباب بنجاح! تم تسجيل حركة الدخول في سجل الأمان التابع للمضيف.`);
    } else if (nextStep === 5) {
      log.push(`💰 خطوة 5: تم ترحيل مبلغ الحجز (450 ر.س) إلى قائمة السندات المالية الصافية.`);
      log.push(`📈 ارتفع معدل إشغال المحفظة العقارية اليوم بمعدل +4.5% بنجاح!`);
    }

    setSimStep(nextStep);
    setSimLog(log);
  };

  const handleSimReset = () => {
    setSimStep(0);
    setSimLog([]);
    setLockStatus('locked');
  };

  return (
    <div className="space-y-6 text-right font-sans" style={{ direction: 'rtl' }} id="training-hub-root">
      
      {/* Upper header */}
      <div className={`p-6 rounded-3xl border ${
        isLight 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 text-slate-900' 
          : 'bg-gradient-to-l from-[#0d1527] to-[#050b18] border-slate-800 text-white'
      } relative overflow-hidden shadow-xl`}>
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400" />
              <span>أكاديمية التدريب والخرائط التفاعلية للتعلم</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">بوابة المعرفة: كيف يعمل النظام وما هي الفائدة؟</h1>
            <p className={`text-xs max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              أهلاً بك في دليلك التعليمي الموحد والمبسط. صممنا هذه اللوحة لتمكين الملاك، المضيفين، وطواقم النظافة من فهم حركة التشغيل المتكاملة للنظام وضمان تحقيق الفائدة القصوى من الأتمتة والذكاء الاصطناعي.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'map' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <Map className="h-4 w-4 text-amber-400" />
              <span>الخريطة التفاعلية</span>
            </button>

            <button 
              onClick={() => setActiveTab('benefits')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'benefits' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>أثر وعوائد النظام (ROI)</span>
            </button>

            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'roles' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <UserCheck className="h-4 w-4 text-cyan-400" />
              <span>دليل الموظفين والأدوار</span>
            </button>

            <button 
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'features' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>فهرس الميزات وتجربتها</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Interactive Map (Left 7-columns) */}
            <div className={`lg:col-span-7 p-6 rounded-3xl border flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-950 border-slate-800'
            }`}>
              <div>
                <h3 className={`text-sm font-extrabold mb-1 flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Map className="h-4 w-4 text-blue-500" />
                  <span>دورة حياة الضيافة المؤتمتة (خريطة التدفق)</span>
                </h3>
                <p className={`text-[11px] mb-6 ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>
                  انقر فوق أي مرحلة أدناه لمشاهدة تفاصيل تشغيلها، من يديرها، والفوائد الناتجة عن تفعيلها في ثوانٍ.
                </p>
              </div>

              {/* Vertical / Horizontal flow nodes styled beautifully */}
              <div className="space-y-3 relative z-10 my-4">
                {/* Connecting lines background */}
                <div className={`absolute top-4 bottom-4 right-6 w-0.5 bg-dashed border-r -z-10 ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}></div>

                {Object.values(nodes).map((node, index) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <div 
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 relative ${
                        isSelected 
                          ? isLight 
                            ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/10' 
                            : 'bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20'
                          : isLight 
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300' 
                            : 'bg-slate-900/60 border-slate-900/80 hover:border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {/* Node index indicators */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected 
                            ? 'bg-blue-600 text-white animate-pulse' 
                            : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-right">
                          <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{node.title.substring(3)}</h4>
                          <span className="text-[9.5px] text-slate-500 font-medium block mt-0.5">الدور المسؤول: <b className={isLight ? 'text-slate-700' : 'text-slate-450'}>{node.role}</b></span>
                        </div>
                      </div>

                      {/* Right-pointing indicator for active */}
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className={`px-2 py-0.5 text-[8.5px] rounded font-bold ${isLight ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>نشط الآن</span>
                        )}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-90 text-blue-500' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`border-t pt-4 mt-4 flex justify-between items-center text-[10.5px] ${isLight ? 'border-slate-100' : 'border-slate-900/80'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>نظام ذكي متكامل يبدأ من التأسيس إلى التقارير والتحليلات.</span>
                <span className="font-mono text-emerald-500 font-bold">✓ أتمتة كاملة بنسبة 100%</span>
              </div>
            </div>

            {/* Selected Node Details Box (Right 5-columns) */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-950 border-slate-800'
            }`}>
              {selectedNode && nodes[selectedNode] ? (
                <div className="space-y-5">
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                    <span className="text-[10px] font-extrabold uppercase text-amber-500">تفاصيل المرحلة</span>
                    <span className="text-[10px] font-bold text-slate-500">مرحلة {selectedNode === 'properties' ? '1' : selectedNode === 'bookings' ? '2' : selectedNode === 'copilot' ? '3' : selectedNode === 'cleaners' ? '4' : selectedNode === 'accounting' ? '5' : '6'} من 6</span>
                  </div>

                  <div>
                    <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{nodes[selectedNode].title}</h3>
                    <p className={`text-xs leading-relaxed mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {nodes[selectedNode].description}
                    </p>
                  </div>

                  {/* Who manages? */}
                  <div className={`p-3.5 rounded-xl space-y-1 ${isLight ? 'bg-blue-50 border border-blue-100' : 'bg-blue-500/5 border border-blue-500/10'}`}>
                    <span className={`text-[9px] font-bold block ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>المستخدم المسؤول عن التشغيل:</span>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      <User className="h-3.5 w-3.5 text-blue-500" />
                      <span>{nodes[selectedNode].role}</span>
                    </span>
                  </div>

                  {/* Direct business benefits */}
                  <div className="space-y-2">
                    <h4 className={`text-[10.5px] font-extrabold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>💡 الاستفادة المباشرة من هذه الخطوة:</h4>
                    <div className="space-y-1.5">
                      {nodes[selectedNode].benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                           <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={`text-[11px] leading-snug ${isLight ? 'text-slate-650' : 'text-slate-300'}`}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guided interactive Checklist */}
                  <div className={`space-y-2 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                    <h4 className={`text-[10.5px] font-extrabold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>📝 خطوات العمل بالفصيل:</h4>
                    <ul className={`space-y-2 text-[11px] leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-400'}`}>
                      {nodes[selectedNode].steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-mono shrink-0 font-bold ${
                            isLight ? 'bg-slate-100 border border-slate-200 text-slate-600' : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}>{i+1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link button */}
                  {setActiveSubTab && (
                    <button
                      onClick={() => {
                        setActiveSubTab(nodes[selectedNode].targetTab as any);
                        // Trigger simulation window trace
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full mt-4 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isLight 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10' 
                          : 'bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 hover:border-slate-700 shadow-lg'
                      }`}
                    >
                      <span>انتقل مباشرةً لتجربة الميزة وتجربتها</span>
                      <ArrowLeft className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                    </button>
                  )}

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <Map className="h-10 w-10 text-slate-700 mb-2" />
                  <p className="text-xs font-bold text-slate-400">يرجى تحديد مرحلة من اليسار لعرض المخطط</p>
                </div>
              )}
            </div>

          </div>

          {/* SIMULATION ADVENTURE: Interactive Sandbox (العرض الحي لمحاكاة النظام) */}
          <div className={`p-6 rounded-3xl border overflow-hidden relative ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-5 ${
              isLight ? 'border-slate-100' : 'border-slate-900/60'
            }`}>
              <div>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">محاكاة تفاعلية ثلاثية الأبعاد للعمليات</span>
                <h3 className={`text-sm font-extrabold mt-1 flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span>محاكي الجريان الذكي للعمليات العقارية</span>
                </h3>
              </div>
              <button 
                onClick={handleSimReset}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                إعادة ضبط المحاكاة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Controls (Left 5 cols) */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10.5px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>اسم ضيف المحاكاة المقترح:</label>
                  <input 
                    type="text" 
                    value={simGuestName}
                    onChange={(e) => setSimGuestName(e.target.value)}
                    disabled={simStep > 0}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50 text-right transition-colors ${
                      isLight 
                        ? 'bg-slate-50 border border-slate-200 text-slate-850 focus:bg-white' 
                        : 'bg-slate-900 border border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className={`text-xs font-extrabold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>مراحل التدفق التجريبي:</h4>
                  <div className="space-y-1">
                    {[
                      'تسجيل الحجز والقفل الذاتي',
                      'توليد مراسلة الترحيب بالذكاء الاصطناعي',
                      'تجهيز الشقة وبث كسرة العود',
                      'تسجيل وصول النزيل وفتح الباب',
                      'ترحيل الفاتورة للأرباح والمصروفات'
                    ].map((stepLabel, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          simStep > idx 
                            ? 'bg-emerald-600 text-white' 
                            : simStep === idx 
                              ? 'bg-blue-600 text-white animate-pulse' 
                              : isLight 
                                ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          {simStep > idx ? '✓' : idx + 1}
                        </div>
                        <span className={
                          simStep > idx 
                            ? 'text-slate-400 line-through' 
                            : simStep === idx 
                              ? isLight ? 'text-slate-900 font-bold' : 'text-slate-200 font-bold' 
                              : isLight ? 'text-slate-500' : 'text-slate-650'
                        }>
                          {stepLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {simStep < 5 ? (
                  <button
                    onClick={handleSimNext}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30"
                  >
                    <span>تنفيذ الخطوة التالية من التدفق</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <div className={`p-3 rounded-xl text-center border ${
                    isLight 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                      : 'bg-emerald-950/30 border-emerald-900/40'
                  }`}>
                    <p className={`text-xs font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>🎉 رائع! تم إتمام دورة حجر الضيف كاملة بنجاح!</p>
                    <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>لقد شهدت الآن كيف يقوم النظام بالربط التلقائي وتأمين الراحة الفندقية الفائقة للنزلاء.</p>
                  </div>
                )}
              </div>

              {/* Visual screen layout output (Right 7 cols) */}
              <div className={`md:col-span-7 rounded-2.5xl p-5 min-h-[280px] flex flex-col justify-between border transition-all ${
                isLight 
                  ? 'bg-slate-50/70 border-slate-200/80 shadow-xs' 
                  : 'bg-slate-950/80 border-slate-900/80'
              }`}>
                <div className={`border-b pb-2 flex justify-between items-center ${isLight ? 'border-slate-200/50' : 'border-slate-900/60'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-450 animate-pulse"></div>
                    <span className={`text-[10px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>سجل حركة البيانات الحية</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    lockStatus === 'unlocked' 
                      ? isLight 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : isLight 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/50' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    🚪 قفل شقة 302: {lockStatus === 'unlocked' ? 'مفتوح (Unlocked)' : 'مغلق (Locked)'}
                  </span>
                </div>

                <div className="flex-1 py-4 overflow-y-auto max-h-[180px] space-y-2">
                  {simLog.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <HelpIcon className={`h-8 w-8 ${isLight ? 'text-slate-300' : 'text-slate-800'}`} />
                      <p className="text-[10px] font-bold text-slate-500 mt-1">اضغط على زر (تنفيذ الخطوة التالية) لمشاهدة حركة البيانات</p>
                    </div>
                  ) : (
                    simLog.map((logLine, lIdx) => (
                      <div key={lIdx} className={`text-[11px] font-mono leading-relaxed p-2 rounded-lg text-right border ${
                        isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/40 border-slate-900/60 text-slate-300'
                      }`}>
                        {logLine}
                      </div>
                    ))
                  )}
                </div>

                <div className={`border-t pt-2 flex justify-between items-center text-[9.5px] ${isLight ? 'border-slate-200/50 text-slate-500' : 'border-slate-900/60 text-slate-500'}`}>
                  <span>معالج التشغيل: Gemini-3.5-Flash</span>
                  <span>الزمن التقريبي: 1.2 ثانية للأتمتة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Header Card comparison of Before and After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Traditional way */}
            <div className={`p-6 rounded-3xl border relative ${
              isLight ? 'bg-red-50/20 border-red-100 text-slate-900' : 'bg-rose-950/5 border-rose-950/25 text-white'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">✖</div>
                <h3 className="text-base font-extrabold text-rose-550 dark:text-rose-450">الوضع التقليدي البطيء والمرهق</h3>
              </div>
              <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>
                الطريقة التقليدية القائمة على المجموعات اليدوية، والاتصال العشوائي بطاقم النظافة، وكتابة الرسائل لكل ضيف يدوياً:
              </p>

              <div className="space-y-3">
                {[
                  'تأخر تسليم كود الباب للنزيل مما يسبب تذمراً وتقييماً سيئاً.',
                  'عدم وضوح ما إذا كان طاقم النظافة قد غير الشراشف أم لا.',
                  'ضياع فواتير المصاريف والعمولات يدوياً في سجلات الواتساب.',
                  'الحيرة في تسعير الوحدات بالاعتماد على التخمين والحدس دون وجود إحصائيات.'
                ].map((txt, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
                    <span className="text-rose-500 shrink-0 font-bold">•</span>
                    <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart automation system */}
            <div className={`p-6 rounded-3xl border relative ${
              isLight ? 'bg-emerald-50/20 border-emerald-100 text-slate-900' : 'bg-emerald-950/5 border-emerald-950/25 text-white'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">✓</div>
                <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">الضيافة الفاخرة المؤتمتة معنا</h3>
              </div>
              <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>
                تحويل التشغيل اليومي لشققك وشاليهاتك إلى فندق ذكي مؤتمت يعمل بالكامل في الخلفية لضمان نموك المالي:
              </p>

              <div className="space-y-3">
                {[
                  'دخول ذاتي ذكي بالكامل فوري دون الحاجة لتواجدك عند العقار.',
                  'ذكاء اصطناعي من Gemini AI لصياغة وترتيب مراسلاتك في ثانية.',
                  'محاكي خاص بعمال النظافة يضمن 5 خطوات تعقيم مع إثبات فوتوغرافي فوري.',
                  'تحليلات فخمة لصافي التدفقات النقدية ومعدل الإشغال الشهري واليومي.'
                ].map((txt, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
                    <span className="text-emerald-500 shrink-0 font-bold">•</span>
                    <span className={isLight ? 'text-slate-750' : 'text-slate-200'}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Strategic metrics display (الاستفادة المالية والتشغيلية بالأرقام) */}
          <div className={`p-6 rounded-3xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <h3 className={`text-sm font-extrabold mb-6 flex items-center gap-1.5 ${isLight ? 'text-slate-850' : 'text-slate-200'}`}>
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>مؤشرات الأداء المستهدفة (Business ROI Metrics)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'توفير الوقت والجهد الإداري', val: '75%', desc: 'بفضل أتمتة الرسائل الترحيبية وتجهيز كود القفل الذكي بدلاً من التنسيق اليدوي.', icon: Clock, color: 'text-amber-500' },
                { label: 'تقليص أخطاء الحجوزات', val: '99%', desc: 'تحديث فوري على جدول التقويم والإشغال يضمن عدم تداخل المواعيد.', icon: Shield, color: 'text-blue-500' },
                { label: 'ارتفاع رضا النزلاء', val: '+4.8', desc: 'الحصول على تقييمات كاملة 5 نجوم على منصات جاذر إن وإير بي إن بي لسرعة الدخول والتعقيم الموثق.', icon: Smile, color: 'text-emerald-500' },
                { label: 'زيادة العوائد الصافية (صافي الربح)', val: '22%', desc: 'التسعير الذكي المبني على رصد الإشغال وتقليل تكاليف النظافة والصيانة المهدرة.', icon: DollarSign, color: 'text-indigo-500' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className={`p-5 rounded-2xl space-y-3 border ${
                    isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/30 border-slate-900'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{m.label}</span>
                      <Icon className={`h-5 w-5 ${m.color}`} />
                    </div>
                    <div className={`text-2xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.val}</div>
                    <p className={`text-[10px] leading-normal ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Path selection tab links */}
          <div className={`lg:col-span-4 rounded-2xl p-5 space-y-3 border ${
            isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-950 border-slate-800'
          }`}>
            <h3 className={`text-xs font-extrabold mb-4 uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>اختر مسارك التعليمي المخصص</h3>

            {[
              { id: 'manager', label: 'مدير العقار / المضيف (Host)', role: 'المشرف العام على حركة الحجز والنظافة' },
              { id: 'owner', label: 'مالك العقار / الشريك (Owner)', role: 'متابع الأرباح والتقارير الشاملة للأصول' },
              { id: 'cleaner', label: 'طاقم الضيافة والتعقيم (Staff)', role: 'منفذ معايير جودة الشقة على الهاتف' },
              { id: 'accountant', label: 'المحاسب المالي (Accountant)', role: 'مراقب الفواتير، السندات، والمصروفات' },
              { id: 'tenant', label: 'المستأجر / النزيل (Tenant)', role: 'دليل النزلاء الذاتي ومراجعات الدخول' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveRolePath(p.id as any)}
                className={`w-full p-3.5 rounded-xl text-right border transition-all cursor-pointer block ${
                  activeRolePath === p.id 
                    ? isLight
                      ? 'bg-blue-50/70 border-blue-500 text-blue-900 font-extrabold shadow-xs'
                      : 'bg-blue-600/10 border-blue-500 text-white shadow-sm' 
                    : isLight
                      ? 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900/40 border-slate-900/80 hover:border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[9.5px] text-slate-500 mt-0.5">{p.role}</div>
              </button>
            ))}
          </div>

          {/* Guided Checklist and description for target role path */}
          <div className={`lg:col-span-8 rounded-2xl p-6 space-y-6 border ${
            isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-950 border-slate-800'
          }`}>
            
            {activeRolePath === 'manager' && (
              <div className="space-y-5">
                <div className={`border-b pb-3 flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>دليل مدير العقار / المضيف (Host / Manager Guide)</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded font-bold">المحرك الرئيسي</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  بصفتك مدير العقار، تقع على عاتقك مسؤولية المتابعة الفورية لسهولة دخول النزلاء وجاهزية الغرف. إليك خطتك اليومية الموصى بها:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'تسجيل وتحديث محفظة الغرف', desc: 'تأكد من إضافة وتجهيز كود القفل الذكي وبيانات الـ WiFi والمدينة بشكل صحيح.' },
                    { title: 'التحقق الصباحي من التقويم السكني', desc: 'افتح تقويم الإشغال التفاعلي لمراقبة الغرف التي ستخلو اليوم والتي ستستقبل نزلاء جدد.' },
                    { title: 'الاستعانة بـ Gemini AI لتجهيز الرسائل', desc: 'بكبسة زر واحدة، توليد إشعار الدخول الذكي وتوجيهه بنسخة منظمة للغاية.' },
                    { title: 'متابعة جودة طاقم النظافة', desc: 'راقب لوحة عمال التعقيم وتحقق من التقاط الصور لتثق بنظافة شقتك قبل وصول النزيل.' }
                  ].map((item, index) => (
                    <div key={index} className={`flex gap-3 p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-900/80'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">{index+1}</span>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{item.title}</h4>
                        <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRolePath === 'owner' && (
              <div className="space-y-5">
                <div className={`border-b pb-3 flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>دليل المالك / الشريك الاستثماري (Owner / Shareholder Guide)</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded font-bold">متابع الأرباح والاستثمار</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  بصفتك المالك أو المستثمر، يتكامل دورك في تتبع العوائد ومقارنة أداء المحفظة الاستثمارية. إليك كيفية تصفح دليلك الخاص:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'مراقبة العوائد الصافية الفورية', desc: 'لوحة الأرقام تعاملك مع العائد الصافي بعد طرح التكاليف والعمولات لضمان دقة معلوماتك المالية.' },
                    { title: 'التحليلات ومخططات الإشغال', desc: 'تتبع المخططات البيانية لمعرفة أي الشقق أكثر إشغالاً وأيام نهاية الأسبوع الأكثر ربحية.' },
                    { title: 'كشف الأداء المالي والتقارير الموثقة', desc: 'تنزيل ومشاركة التقارير بنسخ جاهزة للاستعراض للشركاء والممولين في أي وقت.' }
                  ].map((item, index) => (
                    <div key={index} className={`flex gap-3 p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-900/80'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-550 dark:text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">{index+1}</span>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{item.title}</h4>
                        <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-555' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRolePath === 'cleaner' && (
              <div className="space-y-5">
                <div className={`border-b pb-3 flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>دليل طاقم النظافة والتعقيم (Staff Guide)</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded font-bold">جودة الخدمة على الأرض</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  أنتم العمود الفقري لسمعة شققنا الفاخرة! صممنا لكم واجهة استخدام مبسطة وسريعة على الهواتف لإتمام النظافة الفندقية:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'استلام المهام اليومية الفورية', desc: 'تلقي إشعار المهمة وموعد الدخول المستهدف على لوحتك.' },
                    { title: 'تطبيق الـ 5 خطوات الفندقية', desc: 'اتباع خطوات التطهير، وتغيير البياضات، تبخير الغرف بالعود، وملء ركن القهوة.' },
                    { title: 'التقاط صورة لإثبات التعقيم والجاهزية', desc: 'تصوير الشقة ليعلم المضيف على الفور بأن الوحدة معقمة وجاهزة لاستقبال النزيل دون الحاجة للاتصال به.' }
                  ].map((item, index) => (
                    <div key={index} className={`flex gap-3 p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-900/80'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">{index+1}</span>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{item.title}</h4>
                        <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-555' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRolePath === 'accountant' && (
              <div className="space-y-5">
                <div className={`border-b pb-3 flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>دليل المحاسب المالي (Accountant Guide)</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded font-bold">مراقب الخزينة والدفاتر</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  لم ننسَ دقة الدفاتر المالية وسهولة إدخال الفواتير! إليك دليلك لتتبع التدفقات النقدية:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'الفواتير التلقائية وسندات القبض', desc: 'متابعة الفواتير المصدرة لكل حجز وتأكيد التحصيل بالربط المباشر بجدول الدفعات.' },
                    { title: 'إدخال ومطابقة المصاريف', desc: 'تسجيل فواتير المياه، الصيانة، الكهرباء، والمنظفات كـ "مصروفات" لضمان حساب صافي الأرباح.' },
                    { title: 'كشف الأرباح والخسائر التفاعلي', desc: 'عرض الميزان المالي الشامل وتصفية الأرقام حسب المجمع العقاري أو فترات زمنية دقيقة.' }
                  ].map((item, index) => (
                    <div key={index} className={`flex gap-3 p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-900/80'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">{index+1}</span>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{item.title}</h4>
                        <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-555' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRolePath === 'tenant' && (
              <div className="space-y-5">
                <div className={`border-b pb-3 flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>دليل النزيل والمستأجر الذاتي (Tenant / Guest Guide)</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded font-bold">نزيل فئة 5 نجوم</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  يستمتع الضيف أو النزيل بتجربة فندقية فخمة من لحظة الحجز وحتى المغادرة، وبخطوات واضحة بالكامل:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'استلام دليل الدخول الذاتي الفوري', desc: 'يتلقى الضيف رسالة ترحيبية تحتوي على إحداثيات موثقة وموقع دقيق وكود الدخول الذكي.' },
                    { title: 'تأمين الاتصال السريع بالإنترنت وميزات الشقة', desc: 'الوصول لبيانات شبكة الواي فاي ورقم الدعم لتسهيل راحته القصوى.' },
                    { title: 'مغادرة سهلة وتأكيد المغادرة بضغطة زر', desc: 'يضغط النزيل على رابط المغادرة لإعلام المضيف فوراً بإمكانية توجيه طاقم التعقيم.' }
                  ].map((item, index) => (
                    <div key={index} className={`flex gap-3 p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-900/80'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">{index+1}</span>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{item.title}</h4>
                        <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-555' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[
              { 
                id: 'copilot', 
                title: 'المساعد العقاري الذكي (AI Copilot)', 
                desc: 'صياغة متقدمة لرسائل الترحيب وحجوزات الدخول الذاتي والرد على المراجعات بنقرة واحدة بمحرك Gemini 3.5 Flash.', 
                icon: Sparkles, 
                color: 'from-amber-600/20 to-amber-900/10 text-amber-400 border-amber-500/20',
                lightColor: 'bg-amber-50/50 border-amber-200/80 text-amber-800',
                tab: 'copilot',
                preview: 'صيغ ردود مراجعات احترافية بدقة سعودية هادئة وجذابة.'
              },
              { 
                id: 'whatsapp', 
                title: 'مركز اتصالات ومراسلات واتساب الموحد', 
                desc: 'تنسيق مباشر وإرسال رسائل الترحيب والدخول الذاتي بدون تكبد مشقة الحفظ اليدوي للأرقام.', 
                icon: MessageSquare, 
                color: 'from-emerald-600/20 to-emerald-900/10 text-emerald-400 border-emerald-500/20',
                lightColor: 'bg-emerald-50/50 border-emerald-200/80 text-emerald-800',
                tab: 'whatsapp',
                preview: 'أرسل تفاصيل حجز النزيل على الواتساب على الفور.'
              },
              { 
                id: 'units', 
                title: 'إدارة وتصنيف الوحدات والشاليهات', 
                desc: 'قاعدة بيانات متكاملة لرصد حالة الوحدات (جاهزة، محجوزة، قيد الصيانة، تحتاج نظافة) بشكل فوري بالكامل.', 
                icon: Laptop, 
                color: 'from-blue-600/20 to-blue-900/10 text-blue-400 border-blue-500/20',
                lightColor: 'bg-blue-50/50 border-blue-200/80 text-blue-800',
                tab: 'units',
                preview: 'راقب حالة وحدتك على الخارطة وقم بفرز الغرف.'
              },
              { 
                id: 'operations', 
                title: 'إداريات النظافة ومحاكي الجودة', 
                desc: 'توزيع المهام التشغيلية وقائمة الفحص الفندقية للغرف لرفع نسبة رضا النزلاء.', 
                icon: Clock, 
                color: 'from-teal-600/20 to-teal-900/10 text-teal-400 border-teal-500/20',
                lightColor: 'bg-teal-50/50 border-teal-200/80 text-teal-800',
                tab: 'operations',
                preview: 'محاكي تفاعلي لإتمام مهام عمال التعقيم والتبخير.'
              },
              { 
                id: 'analytics', 
                title: 'لوحة التحليلات الذكية ومؤشرات الإشغال', 
                desc: 'إحصائيات تفاعلية تقيس التدفقات المالية وصافي الإيرادات ومعدلات الإشغال السنوية.', 
                icon: BarChart3, 
                color: 'from-indigo-600/20 to-indigo-900/10 text-indigo-400 border-indigo-500/20',
                lightColor: 'bg-indigo-50/50 border-indigo-200/80 text-indigo-800',
                tab: 'analytics',
                preview: 'رسوم ومؤشرات بيانية متطورة تحلل مبيعاتك وأرباحك.'
              },
              { 
                id: 'session-inspector', 
                title: 'مفتش الجلسة وحركات الأمان السحابية', 
                desc: 'سجلات تتبع كاملة لحركات الدخول الذاتي، حركات الموظفين، وضمان الشفافية المطلقة في إدارة الأمان.', 
                icon: Shield, 
                color: 'from-purple-600/20 to-purple-900/10 text-purple-400 border-purple-500/20',
                lightColor: 'bg-purple-50/50 border-purple-200/80 text-purple-800',
                tab: 'session-inspector',
                preview: 'حفظ وتدقيق كافة التغييرات التشغيلية الجارية.'
              }
            ].map((f) => {
              const Icon = f.icon;
              const isExpanded = expandedFeature === f.id;

              return (
                <div 
                  key={f.id}
                  className={`p-5 rounded-2.5xl border transition-all flex flex-col justify-between space-y-4 ${
                    isLight ? f.lightColor : `bg-gradient-to-br ${f.color}`
                  } ${
                    isExpanded ? 'ring-2 ring-blue-500/20 border-blue-500/30' : isLight ? 'hover:border-slate-350 shadow-xs' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl border ${
                        isLight ? 'bg-white border-slate-200/80' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        isLight ? 'bg-white/80 border border-slate-200 text-slate-500' : 'bg-slate-900/50 border border-slate-800 text-slate-400'
                      }`}>ميزة نشطة</span>
                    </div>

                    <h3 className={`text-xs font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f.title}</h3>
                    <p className={`text-[10.5px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{f.desc}</p>
                  </div>

                  <div className={`space-y-3 pt-3 border-t ${isLight ? 'border-slate-200/60' : 'border-slate-900/60'}`}>
                    <p className="text-[10px] text-slate-500 italic">💡 {f.preview}</p>
                    
                    {setActiveSubTab && (
                      <button
                        onClick={() => {
                          setActiveSubTab(f.tab as any);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full py-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          isLight 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs' 
                            : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white'
                        }`}
                      >
                        <span>جرب الميزة الآن</span>
                        <ChevronRight className="h-3 w-3 rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Training Complete Badge */}
          <div className={`p-6 rounded-3xl border text-center space-y-3 relative overflow-hidden ${
            isLight ? 'bg-blue-50/40 border-blue-100 shadow-xs' : 'border-blue-500/20 bg-blue-500/5'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <Sparkles className="h-8 w-8 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
            <h3 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>هل أكملت التعرف على دورة تشغيل النظام بالكامل؟</h3>
            <p className={`text-xs max-w-lg mx-auto leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-450'}`}>
              ممتاز! أنت الآن جاهز ومؤهل بالكامل للتحكم بوحداتك الفاخرة باحترافية منقطعة النظير. يمكنك البدء في استخدام لوحة المتابعة لإضافة العقارات واستخدام المساعد الذكي لمراسلة ضيوفك.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
