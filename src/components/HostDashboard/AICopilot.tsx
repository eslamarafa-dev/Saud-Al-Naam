import React, { useState } from 'react';
import { Sparkles, Copy, Check, RotateCcw, MessageSquare, Key, Home, FileText, Send, CheckCircle } from 'lucide-react';

export default function AICopilot({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'reviews' | 'welcome' | 'optimizer'>('reviews');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState('');

  // Reviews Tab States
  const [reviewText, setReviewText] = useState('');
  const [guestName, setGuestName] = useState('أحمد العتيبي');
  const [unitName, setUnitName] = useState('جناح النخيل السكني الفاخر');
  const [tone, setTone] = useState<'default' | 'apology' | 'saudi'>('default');

  // Welcome Tab States
  const [welcomeGuest, setWelcomeGuest] = useState('خالد الشمري');
  const [welcomeUnit, setWelcomeUnit] = useState('شقة رويال الراقية - الملقا');
  const [lockCode, setLockCode] = useState('4892');

  // Optimizer Tab States
  const [rawDesc, setRawDesc] = useState('شقة غرفتين وصالة نظيفة وقريبة من البوليفارد بدخول ذاتي');

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResult('');
    setReviewText('');
    setRawDesc('');
  };

  const callCopilotAPI = async (action: string, prompt: string, context?: any) => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, prompt, context }),
      });
      const data = await response.json();
      if (data.error) {
        setResult(`عذراً، حدث خطأ أثناء تشغيل الخادم الذكي: ${data.error}`);
      } else {
        setResult(data.result);
      }
    } catch (e) {
      setResult('عذراً، تعذر الاتصال بذكاء اصطناعي حالياً. يرجى التأكد من تشغيل الخادم.');
    } finally {
      setLoading(false);
    }
  };

  const generateReviewReply = () => {
    let prompt = `اسم الضيف: ${guestName}. اسم الوحدة: ${unitName}. نبرة الرد: ${tone === 'apology' ? 'اعتذارية صريحة ولطيفة ومصممة للمشاكل' : tone === 'saudi' ? 'ترحيب سعودي كرم وضيافة عالي' : 'مهذبة واحترافية'}.\nالمراجعة: ${reviewText || 'شقة ممتازة ونظيفة وباردة والموقع رائع جداً، أنصح بالتعامل معه.'}`;
    callCopilotAPI('review-reply', prompt, { guestName, unitName });
  };

  const generateWelcomeMessage = () => {
    let prompt = `اسم الضيف: ${welcomeGuest}. اسم الوحدة: ${welcomeUnit}. كود القفل الذكي: ${lockCode}. اكتب رسالة ترحيبية بالدخول الذاتي للشقة.`;
    callCopilotAPI('welcome-msg', prompt, { guestName: welcomeGuest, unitName: welcomeUnit, lockCode });
  };

  const generateOptimization = () => {
    let prompt = `قم بتحسين وتجميل وصف هذا العقار لجعله جذاباً للغاية في منصات Airbnb و Gathern:\n${rawDesc}`;
    callCopilotAPI('optimize-desc', prompt);
  };

  return (
    <div className="space-y-6" id="ai-copilot-container">
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span>المساعد العقاري الذكي (AI Copilot)</span>
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            بوابة الذكاء الاصطناعي المتقدمة لتسهيل صياغة الردود، رسائل الدخول الذاتي، وتحسين محتوى الإعلانات للتفوق على المنافسين.
          </p>
        </div>
        
        <div className={`flex rounded-xl p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <button
            onClick={() => { setActiveTab('reviews'); handleClear(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reviews' 
                ? 'bg-blue-600 text-white shadow-md' 
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            الرد على مراجعات الضيوف
          </button>
          <button
            onClick={() => { setActiveTab('welcome'); handleClear(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'welcome' 
                ? 'bg-blue-600 text-white shadow-md' 
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            صياغة رسائل الترحيب
          </button>
          <button
            onClick={() => { setActiveTab('optimizer'); handleClear(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'optimizer' 
                ? 'bg-blue-600 text-white shadow-md' 
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            مُحسن أوصاف العقارات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 space-y-4 shadow-xl ${isLight ? 'bg-white border-slate-200 shadow-slate-100/50' : 'bg-slate-950 border-slate-800'}`}>
          {activeTab === 'reviews' && (
            <>
              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>اسم الضيف الكريم</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>اسم الوحدة السكنية</label>
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>نبرة الرد</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTone('default')}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tone === 'default' 
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600' 
                        : isLight ? 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    احترافي هادئ
                  </button>
                  <button
                    onClick={() => setTone('apology')}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tone === 'apology' 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600' 
                        : isLight ? 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    اعتذاري للمشاكل
                  </button>
                  <button
                    onClick={() => setTone('saudi')}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tone === 'saudi' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                        : isLight ? 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    ترحيب سعودي حار
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>مراجعة الضيف المستلمة</label>
                <textarea
                  placeholder="انسخ مراجعة الضيف الحقيقية هنا (مثال: الشقة جميلة ونظيفة لكن واجهت تأخر بالدخول)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 resize-none ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600'}`}
                />
              </div>

              <button
                onClick={generateReviewReply}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'جاري صياغة الرد الذكي...' : 'صياغة الرد بالذكاء الاصطناعي'}</span>
              </button>
            </>
          )}

          {activeTab === 'welcome' && (
            <>
              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>اسم الضيف المرتقب</label>
                <input
                  type="text"
                  value={welcomeGuest}
                  onChange={(e) => setWelcomeGuest(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>اسم الوحدة السكنية والمدينة</label>
                <input
                  type="text"
                  value={welcomeUnit}
                  onChange={(e) => setWelcomeUnit(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>كود القفل الذكي للباب</label>
                <input
                  type="text"
                  value={lockCode}
                  onChange={(e) => setLockCode(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                />
              </div>

              <button
                onClick={generateWelcomeMessage}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'جاري صياغة التعليمات...' : 'توليد رسالة الترحيب والدخول'}</span>
              </button>
            </>
          )}

          {activeTab === 'optimizer' && (
            <>
              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>الوصف الحالي أو الميزات باختصار</label>
                <textarea
                  placeholder="اكتب ميزات شقتك باختصار وسيقوم الذكاء الاصطناعي بتحويلها لوصف احترافي كامل ملائم لمنصات جاذر إن وإير بي إن بي..."
                  value={rawDesc}
                  onChange={(e) => setRawDesc(e.target.value)}
                  rows={6}
                  className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 resize-none ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600'}`}
                />
              </div>

              <button
                onClick={generateOptimization}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'جاري تحسين الوصف...' : 'تحسين وتحرير الوصف لجذب النزلاء'}</span>
              </button>
            </>
          )}
        </div>

        {/* Right Column: AI Output */}
        <div className={`lg:col-span-7 flex flex-col border rounded-2xl overflow-hidden shadow-xl min-h-[400px] ${isLight ? 'bg-white border-slate-200 shadow-slate-100/50' : 'bg-slate-950 border-slate-800'}`}>
          <div className={`border-b px-5 py-4 flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className={`text-xs font-extrabold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>النتيجة المولدة بالذكاء الاصطناعي</span>
            </div>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-250 text-slate-700 border border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
                </button>
                <button
                  onClick={handleClear}
                  className={`p-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-250 text-slate-700 border border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                  title="مسح"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 relative overflow-y-auto">
            {loading ? (
              <div className={`absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 ${isLight ? 'bg-white/90' : 'bg-slate-950/80'}`}>
                <div className="relative w-12 h-12">
                  <div className={`absolute inset-0 rounded-full border-4 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>جاري معالجة طلبك بواسطة Gemini AI...</p>
                  <p className="text-[10px] text-slate-500 mt-1">يتم صياغة الرد بالأسلوب الضيافي الفاخر الملائم للسوق السعودي</p>
                </div>
              </div>
            ) : null}

            {result ? (
              <div className={`text-xs leading-relaxed whitespace-pre-line p-4 rounded-xl border font-sans ${isLight ? 'bg-slate-50/80 border-slate-150 text-slate-800' : 'bg-slate-900/30 text-slate-200 border-slate-900/60'}`}>
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
                <Sparkles className={`h-8 w-8 ${isLight ? 'text-slate-300' : 'text-slate-700'}`} />
                <div>
                  <p className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>لا توجد مخرجات حالياً</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto">
                    املأ البيانات في الطرف الأيمن، واضغط على زر التوليد لصياغة نصوص فائقة الاحترافية في ثوانٍ معدودة.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`border-t p-4 text-center ${isLight ? 'bg-slate-50 border-slate-150' : 'bg-slate-900/20 border-slate-900/50'}`}>
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              <span>هذا النظام مزود بتقنيات نموذج <b>Gemini 3.5 Flash</b> لضمان فخامة وسرعة الأداء ومنافسة الأنظمة العالمية.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
