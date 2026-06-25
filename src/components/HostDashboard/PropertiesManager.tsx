/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, MapPin, Search, Plus, Trash2, LayoutGrid, List,
  Percent, FileText, Image as ImageIcon, Upload, Download, 
  Eye, AlertTriangle, ShieldCheck, Check, Edit3, X, 
  BarChart2, TrendingUp, ChevronDown, ChevronUp, Briefcase, Calendar, Info
} from 'lucide-react';
import { PropertyPortfolio } from '../../types';

interface PropertiesManagerProps {
  properties: PropertyPortfolio[];
  onAddProperty: (property: PropertyPortfolio) => void;
  onDeleteProperty: (id: string) => void;
  theme: 'dark' | 'light';
  onTriggerAction: (title: string, desc: string) => void;
  currentUser?: { id: string; fullName: string; email: string; role: string } | null;
}

export default function PropertiesManager({
  properties,
  onAddProperty,
  onDeleteProperty,
  theme,
  onTriggerAction,
  currentUser
}: PropertiesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  
  // Custom tabs inside expanded view
  const [activeDetailTab, setActiveDetailTab] = useState<'analytics' | 'images' | 'documents'>('analytics');

  // Form states (Create and Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyPortfolio | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'residential' | 'commercial' | 'resort' | 'mixed_use'>('residential');
  const [formCity, setFormCity] = useState<'Riyadh' | 'Jeddah' | 'AlUla' | 'Khobar' | 'Abha' | 'Diriyah'>('Riyadh');
  const [formAddress, setFormAddress] = useState('');
  const [formTotalBuildings, setFormTotalBuildings] = useState(1);
  const [formTotalUnits, setFormTotalUnits] = useState(4);
  const [formImage, setFormImage] = useState('');
  const [imageSourceType, setImageSourceType] = useState<'upload' | 'url'>('upload');
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  // Drag-and-drop & Documents additions simulations states
  const [dragOverActive, setDragOverActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingDocName, setUploadingDocName] = useState<string>('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<'pdf' | 'docx' | 'xlsx'>('pdf');

  // Permissions warning dialog state
  const [permissionAlertOpen, setPermissionAlertOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Check role eligibility (Only super_admin and property_manager can modify)
  const isAuthorized = (): boolean => {
    const role = currentUser?.role;
    return role === 'super_admin' || role === 'property_manager';
  };

  const handleActionIntercept = (onSuccess: () => void) => {
    if (!isAuthorized()) {
      setPermissionAlertOpen(true);
      onTriggerAction('حظر العملية العقارية 🔒', 'لا تمتلك صلاحيات كافية لتعديل أو حذف أو إدراج محافظ عقارية جديدة.');
    } else {
      onSuccess();
    }
  };

  const openCreateModal = () => {
    handleActionIntercept(() => {
      setEditingProperty(null);
      setFormName('');
      setFormType('residential');
      setFormCity('Riyadh');
      setFormAddress('');
      setFormTotalBuildings(1);
      setFormTotalUnits(4);
      setFormImage('');
      setImageSourceType('upload');
      setIsFormOpen(true);
    });
  };

  const openEditModal = (property: PropertyPortfolio) => {
    handleActionIntercept(() => {
      setEditingProperty(property);
      setFormName(property.name);
      setFormType(property.type);
      setFormCity(property.city);
      setFormAddress(property.address);
      setFormTotalBuildings(property.totalBuildings);
      setFormTotalUnits(property.totalUnits);
      setFormImage(property.image);
      
      // Auto-detect image source type
      if (property.image && property.image.startsWith('data:')) {
        setImageSourceType('upload');
      } else if (property.image && (property.image.startsWith('http') || property.image.startsWith('https'))) {
        setImageSourceType('url');
      } else {
        setImageSourceType('upload');
      }
      
      setIsFormOpen(true);
    });
  };

  const handleImageFileChange = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onTriggerAction('خطأ في نوع الملف ⚠️', 'الرجاء اختيار ملف صورة صالح (PNG, JPG, WebP, إلخ...)');
      return;
    }
    
    // Check size (max 8MB for Base64 representation safely)
    if (file.size > 8 * 1024 * 1024) {
      onTriggerAction('ملف كبير جداً ⚠️', 'الرجاء اختيار صورة بحجم أقل من 8 ميغابايت للأداء الأمثل.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormImage(result);
        onTriggerAction('تم رفع الصورة بنجاح 🎉', 'تم تحميل الصورة من جهازك وإعدادها كغلاف للمحفظة العقارية.');
      }
    };
    reader.onerror = () => {
      onTriggerAction('خطأ في القراءة ❌', 'حدث خطأ أثناء قراءة ملف الصورة من جهازك.');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      onTriggerAction('تنبيه التحقق ⚠️', 'الرجاء تعبئة الحقول الأساسية لتوثيق المحفظة العقارية');
      return;
    }

    const defaultImages = {
      residential: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      resort: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=800',
      mixed_use: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=800'
    };

    const payload: PropertyPortfolio = {
      id: editingProperty ? editingProperty.id : 'prop-' + Date.now(),
      name: formName,
      type: formType,
      city: formCity,
      address: formAddress,
      totalBuildings: Number(formTotalBuildings),
      totalUnits: Number(formTotalUnits),
      occupancyRate: editingProperty ? editingProperty.occupancyRate : Math.floor(65 + Math.random() * 30),
      image: formImage || defaultImages[formType],
      images: editingProperty?.images || [
        defaultImages[formType],
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
      ],
      documents: editingProperty?.documents || [
        { id: 'doc-1', name: 'صك ملكية الأراضي والمساحة المفرز.pdf', size: '2.4 MB', uploadDate: '2026-01-12' },
        { id: 'doc-2', name: 'شهادة ترخيص الدفاع المدني السعودي المعززة.pdf', size: '1.1 MB', uploadDate: '2026-03-05' }
      ],
      annualRevenue: editingProperty?.annualRevenue || Math.floor(250000 + Math.random() * 450000),
      monthlyRevenue: editingProperty?.monthlyRevenue || [
        { month: 'يناير', amount: Math.floor(35000 + Math.random() * 15000) },
        { month: 'فبراير', amount: Math.floor(40000 + Math.random() * 10000) },
        { month: 'مارس', amount: Math.floor(45000 + Math.random() * 12000) },
        { month: 'أبريل', amount: Math.floor(52000 + Math.random() * 8000) },
        { month: 'مايو', amount: Math.floor(58000 + Math.random() * 9000) },
        { month: 'يونيو', amount: Math.floor(6500 + Math.random() * 15000) }
      ]
    };

    onAddProperty(payload);
    setIsFormOpen(false);
    
    if (editingProperty) {
      onTriggerAction('تعديل عقار 📝', `تم تحديث بيانات المحفظة العقارية "${formName}" في السجل العام بنجاح.`);
    } else {
      onTriggerAction('إضافة محفظة 🏠', `تم إدراج المحفظة الاستثمارية الجديدة "${formName}" بنجاح في نظام سعود النعام.`);
    }
  };

  const confirmDeleteProperty = (id: string) => {
    handleActionIntercept(() => {
      setDeleteConfirmId(id);
    });
  };

  const handleDeleteExecute = () => {
    if (deleteConfirmId) {
      onDeleteProperty(deleteConfirmId);
      setDeleteConfirmId(null);
      if (expandedPropertyId === deleteConfirmId) setExpandedPropertyId(null);
      onTriggerAction('إلغاء فهرسة 🗑️', 'تمت إزالة المحفظة العقارية من سجل قاعدة البيانات الوطنية بنجاح.');
    }
  };

  // Simulated image upload drag-and-drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(true);
  };

  const handleDragLeave = () => {
    setDragOverActive(false);
  };

  const handleDrop = (e: React.DragEvent, propId: string) => {
    e.preventDefault();
    setDragOverActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      simulateImageUpload(files[0].name, propId);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, propId: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateImageUpload(files[0].name, propId);
    }
  };

  const simulateImageUpload = (fileName: string, propId: string) => {
    if (!isAuthorized()) {
      onTriggerAction('فشل الرفع 🔒', 'عفواً لا يمكنك الرفع برتبة مالك مسجل');
      return;
    }

    setUploadProgress(0);
    setUploadingDocName(fileName);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Find property and add image
            const updatedProperties = properties.map(p => {
              if (p.id === propId) {
                const existingImages = p.images || [p.image];
                const demoImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800';
                return {
                  ...p,
                  images: [...existingImages, demoImg]
                };
              }
              return p;
            });
            
            const pObj = updatedProperties.find(p => p.id === propId);
            if (pObj) onAddProperty(pObj);

            setUploadProgress(null);
            onTriggerAction('اكتمال معالجة الصور 🖼️', `تم تخزين ومعالجة ملف الصورة [${fileName}] وربطها بالمحفظة.`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Document attachments Simulation
  const handleAddDocument = (e: React.FormEvent, propId: string) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    if (!isAuthorized()) {
      onTriggerAction('حظر العملية 🔒', 'لا توجد صلاحيات للمستثمرين لإضافة مستندات رسمية');
      return;
    }

    const extension = newDocType === 'pdf' ? '.pdf' : newDocType === 'docx' ? '.docx' : '.xlsx';
    const cleanName = newDocName.endsWith(extension) ? newDocName : newDocName + extension;

    const updatedProperties = properties.map(p => {
      if (p.id === propId) {
        const docs = p.documents || [];
        const newDoc = {
          id: 'doc-' + Date.now(),
          name: cleanName,
          size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        return {
          ...p,
          documents: [newDoc, ...docs]
        };
      }
      return p;
    });

    const pObj = updatedProperties.find(p => p.id === propId);
    if (pObj) {
      onAddProperty(pObj);
      onTriggerAction('إدراج مستند رسمي 📄', `تم توثيق ورفع صك [${cleanName}] بنجاح.`);
    }

    setNewDocName('');
  };

  const handleDeleteDoc = (propId: string, docId: string) => {
    if (!isAuthorized()) {
      onTriggerAction('حظر الحذف 🔒', 'صلاحية مالك تمنع إتلاف أو تغيير مستندات الفهرسة');
      return;
    }

    const updatedProperties = properties.map(p => {
      if (p.id === propId) {
        return {
          ...p,
          documents: (p.documents || []).filter(d => d.id !== docId)
        };
      }
      return p;
    });

    const pObj = updatedProperties.find(p => p.id === propId);
    if (pObj) {
      onAddProperty(pObj);
      onTriggerAction('حذف مستند 🗑️', 'تم تدمير وثيقة الأرشيف العقارية وتجنيبها من السجل الرئيسي');
    }
  };

  const handleDeleteImage = (propId: string, imgUrl: string) => {
    if (!isAuthorized()) {
      onTriggerAction('حظر التعديل 🔒', 'لا يمكن للملاك تعديل الوسائط البانورامية للمحافظ');
      return;
    }

    const updatedProperties = properties.map(p => {
      if (p.id === propId) {
        const filteredImgs = (p.images || []).filter(img => img !== imgUrl);
        return {
          ...p,
          images: filteredImgs.length > 0 ? filteredImgs : [p.image]
        };
      }
      return p;
    });

    const pObj = updatedProperties.find(p => p.id === propId);
    if (pObj) {
      onAddProperty(pObj);
      onTriggerAction('إزالة صورة 🖼️', 'تم تنظيف وسائط المحفظة وإزالة الصورة المختارة.');
    }
  };

  const filtered = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || p.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const getTypeText = (type: string) => {
    switch(type) {
      case 'residential': return 'سكني عوائل / أفراد';
      case 'commercial': return 'تجاري / مكاتب وركائز';
      case 'resort': return 'منتجعات ومواسم فاخرة';
      case 'mixed_use': return 'متعدد الاستخدام (هجين)';
      default: return 'عقاري عام';
    }
  };

  const getCityName = (city: string) => {
    switch(city) {
      case 'Riyadh': return 'الرياض';
      case 'Jeddah': return 'جدة';
      case 'AlUla': return 'العلا';
      case 'Khobar': return 'الخبر';
      case 'Abha': return 'أبها';
      case 'Diriyah': return 'الدرعية التاريخية';
      default: return city;
    }
  };

  // High Fidelity aggregate calculation for global top widget summary metrics
  const totalPropertiesCount = properties.length;
  const avgOccupancyAll = Math.round(
    properties.reduce((acc, curr) => acc + (curr.occupancyRate || 85), 0) / (totalPropertiesCount || 1)
  );
  const aggregateAnnualRev = properties.reduce(
    (acc, curr) => acc + (curr.annualRevenue || 380000), 0
  );

  return (
    <div className="space-y-6">
      
      {/* Dynamic Security Badge or warnings */}
      {!isAuthorized() && (
        <div className="bg-yellow-950/30 border border-yellow-900/40 p-4 rounded-3xl flex items-center justify-between flex-row-reverse text-right gap-4">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="p-2 bg-yellow-950/50 rounded-2xl border border-yellow-850 text-yellow-500">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-yellow-500">مستوى وصول القراءة والاطلاع فقط (Read-Only Owner View) 🔒</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">أنت مسجل برول مستثمر/مالك. يمكنك معاينة الأداء والملفات دون إجراء تعديلات لحماية العقود.</p>
            </div>
          </div>
          <span className="font-mono text-[9px] text-yellow-500 bg-yellow-950 px-2 py-1 rounded border border-yellow-900/30">RESTRICTED_RBAC</span>
        </div>
      )}

      {/* Module Cover & Statistics Cards */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="text-right">
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 flex-row-reverse`}>
            <span>إدارة وضيافة المحافظ العقارية</span>
            <Building className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-1">
            مستودع سعود النعام الاستثماري للمجمعات، الأبراج التجارية، شهادات صياغة التراخيص والوثائق والمستندات القانونية.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full lg:w-auto bg-gradient-to-l from-blue-600 to-blue-850 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-550/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>إضافة محفظة عقارية جديدة</span>
        </button>
      </div>

      {/* Real-time high-fidelity summary widgets cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3 shadow-sm`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-blue-900/10 rounded-2xl border border-blue-900/30 text-blue-500">
              <Building className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">مجموع المحافظ النشطة</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalPropertiesCount}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">حقول عقارية مسجلة</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3 shadow-sm`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-emerald-900/10 rounded-2xl border border-emerald-950 text-emerald-500">
              <Percent className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">متوسط نسب الإشغال للأملاك</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono text-emerald-500`}>%{avgOccupancyAll || '87'}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">الإشغال المباشر والموسمي</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-gradient-to-br from-[#050C16] to-[#01050a] border-slate-850' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} text-right space-y-3 shadow-sm`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="p-3 bg-yellow-900/10 rounded-2xl border border-yellow-950 text-yellow-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">الإيراد السنوي التقديري</span>
          </div>
          <div>
            <span className={`text-2xl font-black font-mono text-yellow-500`}>{aggregateAnnualRev.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold mr-1">ريال سعودي</span>
          </div>
        </div>
      </div>

      {/* Filter and control panel */}
      <div className={`p-4 rounded-[24px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن مجمع، عنوان، أو مدينة بالمملكة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 rounded-xl text-xs font-semibold ${
              isDark 
                ? 'bg-[#020617] border-slate-800 text-white placeholder-slate-500 focus:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300'
            } border focus:outline-none transition-all`}
          />
        </div>

        {/* Filter and mode switchers */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className={`px-3 py-3 rounded-xl text-xs font-black ${
              isDark ? 'bg-[#020617] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            } border focus:outline-none`}
          >
            <option value="all">كل المدن عقارياً 🇸🇦</option>
            <option value="Riyadh">العاصمة الرياض</option>
            <option value="Jeddah">مرفأ العروس جدة</option>
            <option value="AlUla">التاريخية العلا</option>
            <option value="Khobar">الخبر الشارقة</option>
            <option value="Abha">عسير أبها مريحة</option>
            <option value="Diriyah">الدرعية التراثية</option>
          </select>

          <div className={`flex rounded-xl border p-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? (isDark ? 'bg-slate-800 text-white font-bold' : 'bg-slate-200 text-slate-900 font-bold') : 'text-slate-400'}`}
              title="عرض مجمعات ثنائية"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? (isDark ? 'bg-slate-800 text-white font-bold' : 'bg-slate-200 text-slate-900 font-bold') : 'text-slate-400'}`}
              title="عرض كشف جدول محاسبي"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid or List list output */}
      {filtered.length === 0 ? (
        <div className={`p-16 rounded-[32px] text-center border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <Building className="h-16 w-16 text-slate-600 mx-auto mb-4 animate-pulse" />
          <h2 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>لا توجد محافظ عقارية تطابق الفرز والبحث</h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold">تأكد من تنظيف كلمات البحث، أو انقر على زر "إضافة محفظة" لإدراج استثمار جديد للمجموعة.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const isExpanded = expandedPropertyId === p.id;
            const annualRev = p.annualRevenue || 320000;
            const docList = p.documents || [
              { id: 'doc-1', name: 'صك الملكية العقارية الرئيسي للمحفظة.pdf', size: '2.4 MB', uploadDate: '2026-03-22' },
              { id: 'doc-2', name: 'ترخيص رخصة بلدي واستعمال المباني.pdf', size: '1.2 MB', uploadDate: '2026-05-15' }
            ];
            const imagesList = p.images || [
              p.image,
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
            ];

            return (
              <motion.div
                key={p.id}
                layout
                className={`rounded-[32px] overflow-hidden border ${
                  isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'
                } transition-all duration-300 shadow-sm relative col-span-1 lg:col-span-2 xl:col-span-1`}
              >
                
                {/* Media panorama block */}
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img
                    referrerPolicy="no-referrer"
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 flex-row-reverse text-right">
                    <MapPin className="h-3.5 w-3.5 text-orange-400" />
                    <span>{getCityName(p.city)}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-blue-600 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black">
                    {getTypeText(p.type)}
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-yellow-500 border border-yellow-500/20 shadow transition-colors cursor-pointer"
                      title="تعديل بيانات المحفظة"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => confirmDeleteProperty(p.id)}
                      className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-red-500 border border-red-500/20 shadow transition-colors cursor-pointer"
                      title="إزالة وإلغاء فهرسة العقار"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Details card body */}
                <div className="p-6 text-right space-y-4">
                  <div>
                    <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'} leading-snug`}>
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center justify-end gap-1 pointer-events-none">
                      <span>{p.address}</span>
                      <MapPin className="h-3 w-3" />
                    </p>
                  </div>

                  {/* Core indicators row */}
                  <div className={`grid grid-cols-2 gap-3 p-3 rounded-2xl text-center ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold mb-0.5">العمائر / الكتل</span>
                      <span className={`text-sm font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.totalBuildings}</span>
                    </div>
                    <div className="border-r border-slate-800/20">
                      <span className="text-[9px] text-slate-400 block font-bold mb-0.5">إجمالي الأجنحة/الوحدات</span>
                      <span className={`text-sm font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.totalUnits}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/10">
                    <div className="flex items-center gap-1 text-right flex-row-reverse">
                      <Percent className="h-4 w-4 text-emerald-500" />
                      <div className="flex flex-col pr-1">
                        <span className="text-[8px] text-slate-400 font-bold">أداء الإشغال المالي</span>
                        <span className="text-xs font-black text-emerald-500 font-mono">%{p.occupancyRate || '85'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-right flex-row-reverse">
                      <TrendingUp className="h-4 w-4 text-yellow-500" />
                      <div className="flex flex-col pr-1">
                        <span className="text-[8px] text-slate-400 font-bold">الميزانية السنوية</span>
                        <span className="text-xs font-black text-yellow-500 font-mono">{annualRev.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Expand button for full documents, uploaders, and analytics charts */}
                  <button
                    onClick={() => {
                      setExpandedPropertyId(isExpanded ? null : p.id);
                      setActiveDetailTab('analytics');
                    }}
                    className={`w-full py-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isExpanded 
                        ? 'bg-blue-600/10 border-blue-600/30 text-blue-500' 
                        : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isExpanded ? 'طي تفاصيل الملف والوسائط والأداء' : 'معاينة الوسائط، الأداء، الأرشيف والمستندات'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Sub-panel Area on Expended Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`border-t ${isDark ? 'border-placeholder/10 bg-[#02050b]/60' : 'border-slate-100 bg-slate-50/50'} overflow-hidden`}
                    >
                      <div className="p-6 space-y-6">
                        
                        {/* Selector Tabs row inside expandable module */}
                        <div className="flex border-b border-slate-800/10 pb-0 justify-between flex-row-reverse">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setActiveDetailTab('analytics')}
                              className={`pb-2 px-3 text-[10px] font-black transition-all border-b-2 relative cursor-pointer ${
                                activeDetailTab === 'analytics'
                                  ? 'border-blue-500 text-blue-500'
                                  : 'border-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-1 flex-row-reverse">
                                <BarChart2 className="h-3.5 w-3.5" />
                                <span>تقرير الإشغال والتحصيل</span>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => setActiveDetailTab('images')}
                              className={`pb-2 px-3 text-[10px] font-black transition-all border-b-2 relative cursor-pointer ${
                                activeDetailTab === 'images'
                                  ? 'border-blue-500 text-blue-500'
                                  : 'border-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-1 flex-row-reverse">
                                <ImageIcon className="h-3.5 w-3.5" />
                                <span>الصور والوسائط ({imagesList.length})</span>
                              </div>
                            </button>

                            <button
                              onClick={() => setActiveDetailTab('documents')}
                              className={`pb-2 px-3 text-[10px] font-black transition-all border-b-2 relative cursor-pointer ${
                                activeDetailTab === 'documents'
                                  ? 'border-blue-500 text-blue-500'
                                  : 'border-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-1 flex-row-reverse">
                                <FileText className="h-3.5 w-3.5" />
                                <span>الأرشيف وصكوك الملكية ({docList.length})</span>
                              </div>
                            </button>
                          </div>

                          <div className="text-[9px] text-slate-500 font-bold self-center mb-2">
                            معرف المحفظة: {p.id}
                          </div>
                        </div>

                        {/* TAB 1: Revenue Tracking & Occupancy Analytics */}
                        {activeDetailTab === 'analytics' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center flex-row-reverse">
                              <h4 className="text-xs font-black text-slate-300">تقرير المداخيل ومعدلات التسكين الشهرية</h4>
                              <span className="text-[10px] text-blue-400 font-black">الربع السنوي الحالي لعام 2026</span>
                            </div>

                            {/* Custom SVG line-chart representing revenue tracking in high-fidelity */}
                            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#030712] border-slate-900' : 'bg-white border-slate-200'} space-y-4`}>
                              <div className="flex items-end justify-between h-32 px-4 pt-4 relative">
                                {/* Grid Helper Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
                                  <div className="border-b border-dashed border-slate-700 w-full" />
                                  <div className="border-b border-dashed border-slate-700 w-full" />
                                  <div className="border-b border-dashed border-slate-700 w-full" />
                                </div>

                                {/* Custom SVG Chart Path with points */}
                                <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 120" preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
                                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.0" />
                                    </linearGradient>
                                  </defs>
                                  {/* Area gradient path */}
                                  <path d="M0,120 L50,85 L140,75 L230,55 L320,45 L415,22 L500,28 L500,120 Z" fill="url(#gradient-area)" />
                                  {/* Path line */}
                                  <path d="M0,120 L50,85 L140,75 L230,55 L320,45 L415,22 L500,28" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                                </svg>

                                {/* Historical monthly milestones */}
                                {(p.monthlyRevenue || [
                                  { month: 'يناير', amount: 38000 },
                                  { month: 'فبراير', amount: 41000 },
                                  { month: 'مارس', amount: 48500 },
                                  { month: 'أبريل', amount: 56000 },
                                  { month: 'مايو', amount: 62000 },
                                  { month: 'يونيو', amount: 69000 }
                                ]).map((point, index) => {
                                  return (
                                    <div key={index} className="flex flex-col items-center z-10 group relative">
                                      {/* Hover tooltip for accurate financial numbers */}
                                      <div className="absolute bottom-12 bg-blue-600 text-white font-extrabold text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                        {(point.amount).toLocaleString()} ريال
                                      </div>
                                      <div className="h-3 w-3 rounded-full bg-blue-500 border-2 border-[#050C16] group-hover:scale-125 transition-transform" />
                                      <span className="text-[9px] text-slate-400 font-bold mt-2">{point.month}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="flex justify-between items-center border-t border-slate-900/60 pt-3 text-[10px] text-slate-400 font-bold flex-row-reverse">
                                <span>المؤشر الكلي للمحفظة: <strong className="text-emerald-400">تصاعدي مستقر (+9.2%)</strong></span>
                                <span>إيرادات آخر 6 أشهر: <strong className="text-white">{(annualRev * 0.6).toLocaleString()} ر.س</strong></span>
                              </div>
                            </div>

                            {/* Dynamic mini KPIs for occupancy analytics */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-right">
                              <div className={`p-3 rounded-xl ${isDark ? 'bg-[#030712] border border-slate-900' : 'bg-white border border-slate-200'}`}>
                                <h5 className="text-[9px] text-slate-500 font-extrabold block mb-1">نسبة الإشغال العام</h5>
                                <div className="flex justify-between items-center items-stretch flex-row-reverse text-right">
                                  <span className="text-emerald-500 font-black text-sm">%{p.occupancyRate || '85'}</span>
                                  <div className="w-16 bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: `${p.occupancyRate || 85}%` }} />
                                  </div>
                                </div>
                              </div>

                              <div className={`p-3 rounded-xl ${isDark ? 'bg-[#030712] border border-slate-900' : 'bg-white border border-slate-200'}`}>
                                <h5 className="text-[9px] text-slate-500 font-extrabold block mb-1">النمو المالي السنوي</h5>
                                <div className="flex justify-between items-center flex-row-reverse text-right">
                                  <span className="text-blue-400 font-black text-xs">مطابق للرؤية 📊</span>
                                </div>
                              </div>

                              <div className={`p-3 rounded-xl ${isDark ? 'bg-[#030712] border border-slate-900' : 'bg-white border border-slate-200'} col-span-2 md:col-span-1`}>
                                <h5 className="text-[9px] text-slate-500 font-extrabold block mb-1">حالة الالتزام المالي بالتحصيل</h5>
                                <div className="flex justify-between items-center flex-row-reverse text-right">
                                  <span className="text-yellow-400 font-black text-[10px]">94% سداد على الوقت</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* TAB 2: Image Gallery & Drag-and-Drop Dropzone */}
                        {activeDetailTab === 'images' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center flex-row-reverse">
                              <h4 className="text-xs font-black text-slate-300">ألبوم الصور الاستفتائي والوسائط البانورامية</h4>
                              <span className="text-[9px] text-slate-500 font-bold">يدعم الرفع الفوري للمضيفين بسحب وإسقاط الملفات</span>
                            </div>

                            {/* Dropzone Container */}
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, p.id)}
                              className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                                dragOverActive 
                                  ? 'border-blue-500 bg-blue-900/10' 
                                  : isDark ? 'border-slate-800 bg-[#030712]/50 hover:bg-[#030712]' : 'border-slate-300 bg-white hover:bg-slate-50'
                              } relative`}
                            >
                              <input
                                type="file"
                                id={`file-input-${p.id}`}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, p.id)}
                              />
                              <label htmlFor={`file-input-${p.id}`} className="cursor-pointer space-y-2 block">
                                <Upload className="h-8 w-8 text-blue-500 mx-auto animate-pulse" />
                                <div className="text-xs font-black text-slate-300">اسحب الصور وأسقطها هنا، أو اضغط للتصفح اليدوي من جهازك</div>
                                <p className="text-[10px] text-slate-500 font-bold">شروط الملفات: صور PNG, JPG, WEBP جودة عالية تصل إلى 5 ميجابايت</p>
                              </label>

                              {/* Loading progress overlay simulation */}
                              {uploadProgress !== null && uploadingDocName && (
                                <div className="absolute inset-0 bg-black/85 backdrop-blur shadow rounded-2xl flex flex-col justify-center items-center p-6 space-y-3">
                                  <div className="flex items-center gap-2 flex-row-reverse text-right">
                                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-550 animate-spin" />
                                    <span className="text-xs font-extrabold text-blue-400">جاري الرفع والضغط السحابي: {uploadingDocName}</span>
                                  </div>
                                  <div className="w-full max-w-xs bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-900">
                                    <div className="bg-blue-500 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                                  </div>
                                  <span className="text-[10px] text-slate-400 pr-1">{uploadProgress}% مكتمل</span>
                                </div>
                              )}
                            </div>

                            {/* Gallery listing of files inside layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {imagesList.map((img, index) => {
                                return (
                                  <div key={index} className="h-24 rounded-xl overflow-hidden relative group border border-slate-800/20 bg-slate-900">
                                    <img
                                      referrerPolicy="no-referrer"
                                      src={img}
                                      alt="معاينة"
                                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    {/* Delete photo overlays */}
                                    <button
                                      onClick={() => handleDeleteImage(p.id, img)}
                                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/75 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                                      title="حذف الصورة"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                    <div className="absolute bottom-1 right-1 bg-black/50 text-white px-1.5 rounded text-[8px] font-mono select-none pr-1">
                                      صورة #{index + 1}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        )}

                        {/* TAB 3: Legal Documents Manager */}
                        {activeDetailTab === 'documents' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center flex-row-reverse">
                              <h4 className="text-xs font-black text-slate-300">ماترك الوثائق والأوراق القانونية</h4>
                              <span className="text-[9px] text-slate-500 font-bold">إيجار، التراخيص البلدية، شهادة الدفاع المدني</span>
                            </div>

                            {/* Form to upload new document mock-ups */}
                            <form onSubmit={(e) => handleAddDocument(e, p.id)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                required
                                placeholder="اسم الوثيقة (مثل: تصريح الدفاع المدني 2026)"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                className={`col-span-1 md:col-span-2 px-3 py-2 border rounded-xl text-xs font-semibold ${
                                  isDark ? 'bg-[#020617] border-slate-850 text-white placeholder-slate-500' : 'bg-white border-slate-250 text-slate-950 placeholder-slate-400'
                                } focus:outline-none`}
                              />
                              <div className="flex gap-2">
                                <select
                                  value={newDocType}
                                  onChange={(e) => setNewDocType(e.target.value as any)}
                                  className={`px-2 py-2 border rounded-xl text-xs font-black ${
                                    isDark ? 'bg-[#020617] border-slate-850 text-white' : 'bg-white border-slate-250 text-slate-950'
                                  }`}
                                >
                                  <option value="pdf">PDF</option>
                                  <option value="docx">Docx</option>
                                  <option value="xlsx">Sheet</option>
                                </select>
                                <button
                                  type="submit"
                                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer w-full"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>تنزيل</span>
                                </button>
                              </div>
                            </form>

                            {/* Current list of document objects */}
                            <div className="space-y-2.5">
                              {docList.map((doc) => {
                                const isPdf = doc.name.toLowerCase().endsWith('.pdf');
                                const isXls = doc.name.toLowerCase().endsWith('.xlsx') || doc.name.toLowerCase().endsWith('.xls');
                                return (
                                  <div
                                    key={doc.id}
                                    className={`p-3 rounded-2xl flex justify-between items-center gap-3 border transition-all ${
                                      isDark ? 'bg-[#030712] border-slate-900/60 hover:bg-[#030712]' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    } flex-row-reverse text-right`}
                                  >
                                    <div className="flex items-center gap-2.5 flex-row-reverse text-right">
                                      <div className={`p-2 rounded-xl shrink-0 ${
                                        isPdf ? 'bg-red-950/20 text-red-500 border border-red-900/10' :
                                        isXls ? 'bg-emerald-950/20 text-emerald-500 border border-emerald-900/10' :
                                        'bg-blue-950/20 text-blue-500 border border-blue-900/10'
                                      }`}>
                                        <FileText className="h-4.5 w-4.5" />
                                      </div>
                                      <div>
                                        <span className={`text-xs font-extrabold block leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{doc.name}</span>
                                        <div className="flex gap-2 text-[9px] text-slate-500 font-bold mt-1 justify-end flex-row-reverse">
                                          <span>الحجم: {doc.size}</span>
                                          <span>•</span>
                                          <span>تاريخ التخزين: {doc.uploadDate}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action items */}
                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => onTriggerAction('تحميل وثيقة 📄', `جاري تحضير ملف [${doc.name}] وتجهيزه للتنزيل الفوري على جهازك.`)}
                                        className={`p-2 rounded-lg border ${isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-250 text-slate-600 hover:bg-slate-50'} shadow transition-all cursor-pointer`}
                                        title="تحميل الملف للجهاز"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDoc(p.id, doc.id)}
                                        className={`p-2 rounded-lg border border-transparent text-red-500 hover:bg-red-950/20 transition-all cursor-pointer`}
                                        title="تدمير المستند العقاري"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List mode Table output representing accounting layout details */
        <div className={`overflow-x-auto rounded-[32px] border ${isDark ? 'bg-[#050C16] border-slate-850' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black text-slate-400 ${isDark ? 'border-slate-850 bg-[#020617]/50' : 'border-slate-200 bg-slate-50'}`}>
                <th className="p-4">المحفظة العقارية والمجمع</th>
                <th className="p-4">التصنيف</th>
                <th className="p-4">المدينة بالتخصيص</th>
                <th className="p-4 text-center">الكتل</th>
                <th className="p-4 text-center">إجمالي الوحدات</th>
                <th className="p-4 text-center">الإشغال المالي</th>
                <th className="p-4 text-center">الميزانية السنوية</th>
                <th className="p-4 text-center">وثائق الأرشيف</th>
                <th className="p-4 text-center">إجراء العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 text-xs font-bold">
              {filtered.map((p) => {
                const docsCount = p.documents?.length || 2;
                return (
                  <tr key={p.id} className={`${isDark ? 'hover:bg-slate-850/40' : 'hover:bg-slate-50'} transition-all`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="h-10 w-16 rounded-xl object-cover bg-slate-800 shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <span className={isDark ? 'text-white' : 'text-slate-900'}>{p.name}</span>
                          <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">{p.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{getTypeText(p.type)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${isDark ? 'bg-[#020617] text-orange-400 border border-orange-950/40' : 'bg-orange-50 text-orange-600'}`}>
                        {getCityName(p.city)}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono">{p.totalBuildings}</td>
                    <td className="p-4 text-center font-mono">{p.totalUnits || 4}</td>
                    <td className="p-4 text-center font-mono text-emerald-500">%{p.occupancyRate || '85'}</td>
                    <td className="p-4 text-center font-mono text-yellow-500">{(p.annualRevenue || 350000).toLocaleString()} ر.س</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>{docsCount} ملفات</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl text-yellow-500 hover:bg-yellow-550/10 cursor-pointer"
                          title="تعديل"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDeleteProperty(p.id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-550/10 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE & EDIT DIALOG MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-xl rounded-[32px] p-6 sm:p-8 ${
                isDark ? 'bg-[#050C16] text-white border border-slate-850' : 'bg-white text-slate-900 border border-slate-200'
              } shadow-2xl relative text-right overflow-y-auto max-h-[90vh]`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 left-6 p-2 rounded-xl hover:bg-slate-805 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-lg font-black mb-1.5 flex items-center gap-2 flex-row-reverse text-right">
                <Building className="h-5.5 w-5.5 text-blue-500" />
                <span>{editingProperty ? '📝 تعديل وحوكمة المحفظة العقارية' : '🏠 إدراج وفهرسة محفظة عقارية جديدة'}</span>
              </h2>
              <p className="text-[11px] text-slate-450 font-semibold mb-6">تعبئة الحقول الآتية ليتم توليد الصكوك الافتراضية تزامناً مع بوابات إيجار ونظام ZATCA للفوترة.</p>
              
              <form onSubmit={handleFormSubmit} className="space-y-4 font-bold text-xs">
                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1.5">اسم المحفظة التابعة للشركة العقارية</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="مثال: ذروة النعام السكنية بحي الملك فهد"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                      isDark ? 'bg-[#020617] border-slate-850 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-blue-500'
                    } border focus:outline-none transition-colors`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 block mb-1.5">المدينة</label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value as any)}
                      className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                        isDark ? 'bg-[#020617] border-slate-850 text-white' : 'bg-slate-100 border-slate-200 text-slate-950'
                      } border focus:outline-none cursor-pointer`}
                    >
                      <option value="Riyadh">العاصمة الرياض</option>
                      <option value="Jeddah">مرفأ العروس جدة</option>
                      <option value="AlUla">التاريخية العلا</option>
                      <option value="Khobar">الخبر الشارقة</option>
                      <option value="Abha">عسير أبها مريحة</option>
                      <option value="Diriyah">الدرعية التراثية</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 block mb-1.5">النوع الاستثماري المقترح</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                        isDark ? 'bg-[#020617] border-slate-850 text-white' : 'bg-slate-100 border-slate-200 text-slate-950'
                      } border focus:outline-none cursor-pointer`}
                    >
                      <option value="residential">سكني عوائل وطبقة أفراد</option>
                      <option value="commercial">تجاري وأجنحة عمل مفتوحة</option>
                      <option value="resort">منتجعات ومظلات موسمية</option>
                      <option value="mixed_use">متعدد الاستخدام متعدد الكتل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 block mb-1.5">العنوان الجغرافي الموجه</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: طريق العليا العام، مخرج 3 من ممر برج المملكة"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                      isDark ? 'bg-[#020617] border-slate-850 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-blue-500'
                    } border focus:outline-none transition-colors`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 block mb-1.5">عدد العمائر والكتل المسلحة</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={formTotalBuildings}
                      onChange={(e) => setFormTotalBuildings(Number(e.target.value))}
                      className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                        isDark ? 'bg-[#020617] border-slate-850 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>

                  <div>
                     <label className="text-xs font-black text-slate-400 block mb-1.5">إجمالي الأجنحة والشقق المستحدثة</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={500}
                      value={formTotalUnits}
                      onChange={(e) => setFormTotalUnits(Number(e.target.value))}
                      className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                        isDark ? 'bg-[#020617] border-slate-850 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                      } border focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-400">صورة غلاف المحفظة العقارية</label>
                    
                    {/* Source Selection Tabs */}
                    <div className="flex bg-slate-950/40 p-1 rounded-xl border border-slate-800/50">
                      <button
                        type="button"
                        onClick={() => setImageSourceType('upload')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          imageSourceType === 'upload'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>رفع من الجهاز</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceType('url')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          imageSourceType === 'url'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        <span>رابط خارجي</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload Container */}
                  {imageSourceType === 'upload' ? (
                    <div>
                      {formImage ? (
                        <div className={`relative rounded-2xl p-3 border ${isDark ? 'bg-[#090d16] border-slate-850' : 'bg-slate-50 border-slate-200'} flex items-center gap-4 group overflow-hidden`}>
                          <img
                            src={formImage}
                            alt="Cover Preview"
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-750/20"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-emerald-400 flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              تم إدراج الغلاف بنجاح
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 truncate">
                              {formImage.startsWith('data:') ? 'صورة مرفوعة محلياً من جهازك' : formImage}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormImage('')}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          >
                            حذف وتغيير الصورة
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                          onDragLeave={() => setIsDraggingImage(false)}
                          onDrop={(e) => { e.preventDefault(); setIsDraggingImage(false); if (e.dataTransfer.files?.[0]) handleImageFileChange(e.dataTransfer.files[0]); }}
                          onClick={() => document.getElementById('property-image-upload-input')?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingImage
                              ? 'border-blue-500 bg-blue-500/5'
                              : isDark
                                ? 'border-slate-800 hover:border-slate-705 bg-[#020617]'
                                : 'border-slate-250 hover:border-slate-350 bg-slate-50'
                          }`}
                        >
                          <Upload className={`h-8 w-8 transition-colors ${isDraggingImage ? 'text-blue-500' : 'text-slate-400'}`} />
                          <div>
                            <p className="text-xs font-black text-slate-300">اسحب وأفلت صورة الغلاف هنا، أو <span className="text-blue-500 hover:underline">تصفح جهازك</span></p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1">يدعم PNG, JPG, WebP (الحد الأقصى 8 ميجابايت)</p>
                          </div>
                          <input
                            id="property-image-upload-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => { if (e.target.files?.[0]) handleImageFileChange(e.target.files[0]); }}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="امرك وانسخ الرابط العقاري لغلاف الصورة (مثال: https://images.unsplash.com/...)"
                          value={formImage.startsWith('data:') ? '' : formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-2xl text-xs font-black ${
                            isDark ? 'bg-[#020617] border-slate-850 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-blue-500'
                          } border focus:outline-none transition-colors`}
                        />
                      </div>
                      
                      {/* Live Image URL Preview */}
                      {formImage && !formImage.startsWith('data:') && (formImage.startsWith('http://') || formImage.startsWith('https://')) && (
                        <div className={`rounded-xl p-2.5 border flex items-center gap-3 ${isDark ? 'bg-[#090d16] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <img
                            src={formImage}
                            alt="URL Preview"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700/20"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black text-blue-400 block mb-0.5">معاينة الرابط الخارجي النشطة 👁️</span>
                            <span className="text-[9px] text-slate-500 font-bold block truncate">{formImage}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    * في حالة ترك هذا الحقل فارغاً، سيقوم الذكاء الاصطناعي للمنصة بإسناد صورة غامرة تتوحد مع الخيار الاستثماري المحدد مسبقاً.
                  </p>
                </div>

                <div className="flex justify-start gap-3 pt-6 border-t border-slate-800/15">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition-colors cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-750 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-705'}`}
                  >
                    إلغاء وإغلاق
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl font-black text-xs bg-[#1E40AF] hover:bg-[#153185] text-white shadow-lg transition-colors cursor-pointer"
                  >
                    {editingProperty ? 'أكد وحفظ التحديثات' : 'توثيق وإدراج المحفظة'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-[28px] p-6 text-right ${
                isDark ? 'bg-[#050C16] border border-slate-850 text-white' : 'bg-white border border-slate-200 text-slate-910'
              } space-y-5`}
            >
              <div className="p-3 bg-red-950/20 text-red-500 rounded-2xl border border-red-900/10 w-fit mx-auto">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-base font-black">هل أنت متأكد من حذف وإلغاء فهرسة هذه المحفظة؟</h3>
                <p className="text-xs text-slate-400 font-bold">
                  سيؤدي هذا الإجراء إلى حذف كافة المرفقات والخرائط والوسائط وصكوك الملكية المرتبطة بهذا العقار نهائياً من أرشيف سعود النعام الرئيسي.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-755 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  تراجع عن الإتلاف
                </button>
                <button
                  onClick={handleDeleteExecute}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-red-600 hover:bg-red-700 text-white shadow"
                >
                  نعم، احذف نهائياً
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESTRICED RBAC ACCESS ALERT DIALOG */}
      <AnimatePresence>
        {permissionAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[28px] p-6 text-center bg-[#070b13] border border-red-950 text-white space-y-5 relative"
            >
              <div className="p-3.5 bg-red-950/40 text-red-500 rounded-2xl border border-red-900/30 w-fit mx-auto">
                <AlertTriangle className="h-7 w-7 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-red-500">جدار الحماية العقاري: العملية محظورة! 🛡️</h3>
                <p className="text-xs text-slate-400 font-bold leading-relaxed px-2">
                  عفواً، حساب المستثمر أو المالك النشط ذو الرتبة المعينة تمنعه شروط المرور من التعديل، الإنشاء أو إتلاف المحافظ العقارية المسجلة لحماية توازن المعطيات ومستندات الإيجار.
                </p>
                <div className="p-3 bg-[#03060a] border border-slate-900 rounded-xl text-[10px] text-slate-500 text-right space-y-1.5 font-mono">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span>الرتبة المعينة:</span>
                    <strong className="text-yellow-500 pr-1">{currentUser?.role || 'owner'}</strong>
                  </div>
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span>المدير المسؤول:</span>
                    <strong className="text-white pr-1">خالد الشمري (الرمز المأذون)</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPermissionAlertOpen(false)}
                className="w-full py-3 rounded-2xl font-black text-xs bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
              >
                أفهم ذلك، إغلاق نافذة التنبيه
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
