/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  PropertyUnit, Booking, TaskDetail, WhatsAppTemplate,
  PropertyPortfolio, Building, Contract, Tenant, Invoice, PaymentRecord 
} from '../types';

export const INITIAL_UNITS: PropertyUnit[] = [
  {
    id: 'unit-1',
    name: 'شاليه اللافندر الفاخر مع مسبح خاص بمؤثرات مائية - حي الرمال، الرياض',
    type: 'chalet',
    city: 'Riyadh',
    status: 'available',
    pricePerNight: 1250,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '9482',
    smartLockIp: '192.168.1.185',
    smartLockStatus: 'locked',
    wifiName: 'Lavender_Resort_5G',
    wifiPass: 'Riyadh2026_Welcome',
    locationLink: 'https://maps.google.com/?q=24.8123,46.8523',
    addressText: 'منطقة الرمال، طريق الأمير محمد بن سلمان، مخرج 30، الرياض، المملكة العربية السعودية',
    channelsSynced: ['gathern', 'airbnb', 'direct'],
    description: 'شاليه اللافندر يقدم واحة من الهدوء والاسترخاء في الرياض مع مسبح خارجي دافئ ومجلس خارجي فاخر مع شاشة سينما ذكية ومرافق شواء متكاملة.'
  },
  {
    id: 'unit-2',
    name: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
    type: 'apartment',
    city: 'Riyadh',
    status: 'occupied',
    pricePerNight: 650,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '1140',
    smartLockIp: '192.168.4.120',
    smartLockStatus: 'unlocked',
    wifiName: 'Olaya_Elite_Optic',
    wifiPass: 'EliteOlaya8877',
    locationLink: 'https://maps.google.com/?q=24.7012,46.6812',
    addressText: 'حي العليا، شارع التحلية، خلف أبراج العليا وسنتريا مول، الرياض، المملكة العربية السعودية',
    channelsSynced: ['booking', 'airbnb', 'direct'],
    description: 'إقامة عصرية بموقع استراتيجي بقلب الرياض المالي والتجاري تلائم رجال الأعمال والعائلات الباحثة عن الرفاهية والقرب من أشهر معالم العاصمة.'
  },
  {
    id: 'unit-3',
    name: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
    type: 'villa',
    city: 'Riyadh',
    status: 'cleaning',
    pricePerNight: 2450,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '5032',
    smartLockIp: '192.168.12.110',
    smartLockStatus: 'locked',
    wifiName: 'Nakheel_Smart_Villa_VIP',
    wifiPass: 'NakheelHome9988',
    locationLink: 'https://maps.google.com/?q=24.7431,46.6431',
    addressText: 'حي النخيل الغربي، طريق الإمام سعود بن عبد العزيز، الرياض، المملكة العربية السعودية',
    channelsSynced: ['gathern', 'direct'],
    description: 'فيلا ذكية متطورة تتميز بنظام إنارة تفاعلي، وسينما منزلية مجهزة بـ Atmos، وحديقة داخلية خلابة تضاهي أفخم المنتجعات العالمية.'
  },
  {
    id: 'unit-4',
    name: 'جناح الكورنيش الفاخر المطل على البحر الأحمر - جدة',
    type: 'suite',
    city: 'Jeddah',
    status: 'available',
    pricePerNight: 980,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '4321',
    smartLockIp: '192.168.32.14',
    smartLockStatus: 'locked',
    wifiName: 'Seaside_Luxury_WIFI',
    wifiPass: 'JeddahSea2026',
    locationLink: 'https://maps.google.com/?q=21.5832,39.1232',
    addressText: 'طريق الكورنيش الشمالي، أبراج المارينا، الطابق 18، جدة، المملكة العربية السعودية',
    channelsSynced: ['booking', 'airbnb', 'gathern', 'direct'],
    description: 'استمتع بإطلالات بانورامية على البحر الأحمر مباشرة وغروب ساحر في أرقى منطقة سياحية في جدة، مع صالون استقبال فاخر وخدمات الضيافة الملكية.'
  },
  {
    id: 'unit-5',
    name: 'منزل لولوة الأثري التاريخي في واحة النخيل - العلا',
    type: 'suite',
    city: 'AlUla',
    status: 'occupied',
    pricePerNight: 1950,
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '8809',
    smartLockIp: '192.168.1.99',
    smartLockStatus: 'locked',
    wifiName: 'AlUla_Heritage_Optic_5G',
    wifiPass: 'AlUlaMagicResort',
    locationLink: 'https://maps.google.com/?q=26.6212,37.9231',
    addressText: 'العلا، البلدة القديمة، طريق الواحة، خلف مقهى صحارى الأثري، العلا، المملكة العربية السعودية',
    channelsSynced: ['airbnb', 'direct'],
    description: 'تجربة فريدة ومترفة وسط صخور وجبال العلا الساحرة ومزارع النخيل البكر. تصميم تراثي مستمد من الطبيعة مجهز بأساليب الراحة الفندقية.'
  },
  {
    id: 'unit-6',
    name: 'شاليه جبال السودة الفاخر وسط الضباب والغابات - أبها',
    type: 'chalet',
    city: 'Abha',
    status: 'maintenance',
    pricePerNight: 850,
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200',
    smartLockCode: '3051',
    smartLockIp: '192.168.22.4',
    smartLockStatus: 'offline',
    wifiName: 'Abha_Cloud_Fiber',
    wifiPass: 'PassAbha8899',
    locationLink: 'https://maps.google.com/?q=18.2123,42.5012',
    addressText: 'منطقة السودة، متنزهات الضباب، مرتفعات أبها الغربية، عسير، المملكة العربية السعودية',
    channelsSynced: ['gathern', 'booking'],
    description: 'عش فوق السحاب في أجواء ضبابية معتدلة بمرتفعات أبها، واقضِ ليالي شتوية ممتازة أمام الموقد الخشبي الطبيعي وغرفة الساونا المستقلة.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    unitId: 'unit-1',
    unitName: 'شاليه اللافندر الفاخر مع مسبح خاص بمؤثرات مائية - الرياض',
    guestName: 'أحمد بن عبد الرحمن الشمري',
    guestPhone: '966504938123',
    guestEmail: 'a.shammari@ejad.sa',
    checkInDate: '2026-06-22',
    checkOutDate: '2026-06-24',
    createdAt: '2026-06-18',
    source: 'gathern',
    payoutAmount: 2500,
    guestCount: 4,
    status: 'upcoming',
    paidStatus: 'fully_paid',
    smartLockCodeSent: false,
    notes: 'يفضل تسليم الشفرة مبكرًا وطلب قهوة عربية عند الوصول للترحيب بالضيوف.'
  },
  {
    id: 'b-102',
    unitId: 'unit-2',
    unitName: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
    guestName: 'د. خالد سليم السبيعي',
    guestPhone: '966555123987',
    guestEmail: 'dr.subaie@subaieholdings.com',
    checkInDate: '2026-06-20',
    checkOutDate: '2026-06-25',
    createdAt: '2026-06-19',
    source: 'airbnb',
    payoutAmount: 3250,
    guestCount: 2,
    status: 'active',
    paidStatus: 'fully_paid',
    smartLockCodeSent: true,
    notes: 'الضيف في زيارة عمل، طلب فاتورة ضريبة وتوفير شاحن جوال إضافي وسرعة إنترنت ممتازة.'
  },
  {
    id: 'b-103',
    unitId: 'unit-5',
    unitName: 'منزل لولوة الأثري التاريخي في واحة النخيل - العلا',
    guestName: 'المهندس رائد متعب المطيري',
    guestPhone: '966544837261',
    guestEmail: 'r.mutairi@aramco.com',
    checkInDate: '2026-06-14',
    checkOutDate: '2026-06-17',
    createdAt: '2026-06-10',
    source: 'booking',
    payoutAmount: 5850,
    guestCount: 3,
    status: 'completed',
    paidStatus: 'fully_paid',
    smartLockCodeSent: true,
    notes: 'أثنى بشدة على ضيافة أهل العلا وطالب بالمغادرة المتأخرة لمدة ساعة لتجهيز الحقائب.'
  },
  {
    id: 'b-104',
    unitId: 'unit-3',
    unitName: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
    guestName: 'سلطان ممدوح آل رشيد',
    guestPhone: '966533005522',
    checkInDate: '2026-06-26',
    checkOutDate: '2026-06-29',
    createdAt: '2026-06-15',
    source: 'direct',
    payoutAmount: 7350,
    guestCount: 6,
    status: 'upcoming',
    paidStatus: 'partial',
    smartLockCodeSent: false,
    notes: 'حجز مباشر من عميل دائم، يحتاج تحضير حطب خارجي للموقد وثلاجة مجهزة بمرطبات فاخرة.'
  },
  {
    id: 'b-105',
    unitId: 'unit-4',
    unitName: 'جناح الكورنيش الفاخر المطل على البحر الأحمر - جدة',
    guestName: 'أ. طارق عبد المحسن اليوسف',
    guestPhone: '966567119900',
    guestEmail: 't.yousef@yousefcap.sa',
    checkInDate: '2026-06-18',
    checkOutDate: '2026-06-20',
    createdAt: '2026-06-16',
    source: 'gathern',
    payoutAmount: 1960,
    guestCount: 2,
    status: 'completed',
    paidStatus: 'fully_paid',
    smartLockCodeSent: true,
    notes: 'زيارة لإنهاء صفقة تجارية، يحتاج تفعيل التكييف المركزي مسبقا على درجة حرارة 21.'
  }
];

export const INITIAL_TASKS: TaskDetail[] = [
  {
    id: 'task-1',
    unitId: 'unit-3',
    unitName: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
    title: 'تنظيف وتطهير الفيلا وتغيير البياضات وتلميع الزجاج الخارجي',
    type: 'cleaning',
    assignTo: 'أبو محمد (مشرف التجهيز والنظافة)',
    deadline: '2026-06-21 15:30',
    status: 'in_progress',
    notes: 'التركيز على تنظيف السجاد وسينما المنزل والتعقيم عالي المستوى للشراشف والمناشف.',
    cost: 180
  },
  {
    id: 'task-2',
    unitId: 'unit-6',
    unitName: 'شاليه جبال السودة الفاخر وسط الضباب والغابات - أبها',
    title: 'فحص عطل بالواي فاي والتاكد من إمداد كابل الفايبر البصري وصيانة قفل الباب',
    type: 'maintenance',
    assignTo: 'المهندس جاسم المصلح',
    deadline: '2026-06-22 11:00',
    status: 'pending',
    notes: 'القفل الذكي غير متصل بالشبكة، يرجى التشييك على بطاريات القفل وضبط الاتصال يدويًا.',
    cost: 350
  },
  {
    id: 'task-3',
    unitId: 'unit-5',
    unitName: 'منزل لولوة الأثري التاريخي في واحة النخيل - العلا',
    title: 'شراء وتجهيز القهوة الخولانية الفاخرة، التمر السكري الفاخر، والورود الطبيعية للضيف الجديد',
    type: 'inspection',
    assignTo: 'أم مشعل (شريكة الضيافة المحلية)',
    deadline: '2026-06-14 12:00',
    status: 'completed',
    notes: 'تم تقديم الضيافة والتمور مع سلة فواكه طازجة، ونالت رضا الضيف بشدة وذكرها بالتقييم.',
    cost: 140
  },
  {
    id: 'task-4',
    unitId: 'unit-1',
    unitName: 'شاليه اللافندر الفاخر مع مسبح خاص بمؤثرات مائية - الرياض',
    title: 'فحص كيميائي للكلور وتنظيف فلتر المسبح وتشغيل المؤثرات المائية وشلال الحائط',
    type: 'repair',
    assignTo: 'فني حمامات السباحة (إقبال)',
    deadline: '2026-06-21 10:00',
    status: 'pending',
    notes: 'تأكد من تشغيل التدفئة لتصل لـ 28 درجة قبل دخول الضيوف القادمين غداً.',
    cost: 120
  }
];

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    title: 'تأكيد الحجز الترحيبي ورابط الدليل الرقمي',
    type: 'welcome',
    content: 'أهلاً بك يا {GUEST_NAME} فخورون باختيارك الإقامة لدينا في ​​{UNIT_NAME}. ✨ لقد تم تأكيد حجزك للفترة من {CHECK_IN_DATE} حتى {CHECK_OUT_DATE}.\n\nتسهيلاً لإقامتك، قمنا بإنشاء دليل رقمي تفاعلي خاص بك يحتوي على التوجيهات، طريقة الدخول السلسة، والخدمات المتاحة:\n🔗 {GUEST_PORTAL_URL}\n\nنتمنى لك إقامة مميزة وهانئة! 🤍',
    variables: ['{GUEST_NAME}', '{UNIT_NAME}', '{CHECK_IN_DATE}', '{CHECK_OUT_DATE}', '{GUEST_PORTAL_URL}']
  },
  {
    id: 'tpl-2',
    title: 'إرسال شفرة الباب الذكي (دخول ذاتي آمن)',
    type: 'lock_code',
    content: 'مرحباً {GUEST_NAME}، لراحتك تم تفعيل نظام الدخول الذاتي الآمن لوحدتك {UNIT_NAME}.\n🚪 رقم كود القفل الذكي الخاص بك هو: 【 {SMART_LOCK_CODE} 】\n⏱️ هذا الكود ينشط تلقائياً من الساعة 2:00 ظهراً يوم الوصول وينتهي عند 12:00 ظهراً يوم المغادرة.\n\nيسعدنا مساعدتك بأي وقت عبر الضغط على القفل لإدخال الشفرة والضغط على رمز (#).',
    variables: ['{GUEST_NAME}', '{UNIT_NAME}', '{SMART_LOCK_CODE}']
  },
  {
    id: 'tpl-3',
    title: 'أرسل الموقع الجغرافي وتفاصيل الواي فاي Wifi',
    type: 'guide_and_wifi',
    content: 'عزيزنا الضيف {GUEST_NAME}، إليك تفاصيل الوصول والإنترنت المخصصة لك في {UNIT_NAME}:\n📍 موقع الوحد الجغرافي على خرائط Google: {LOCATION_LINK}\n\n📶 تفاصيل الاتصال بشبكة الإنترنت اللاسلكي Wifi بالوحدة:\n- اسم الشبكة: {WIFI_NAME}\n- رقم السري: {WIFI_PASS}\n\nنتمنى لك عملاً مثمراً أو استجماماً رائعاً! 🌐',
    variables: ['{GUEST_NAME}', '{UNIT_NAME}', '{LOCATION_LINK}', '{WIFI_NAME}', '{WIFI_PASS}']
  },
  {
    id: 'tpl-4',
    title: 'تذكير بموعد المغادرة وإجراءات تسليم الوحدة',
    type: 'checkout',
    content: 'عزيزنا الضيف {GUEST_NAME}، نتمنى أنك قضيت وقتاً جميلاً لدينا في {UNIT_NAME}. 🌸\n\nنود تذكيرك بأن موعد تسجيل المغادرة غداً في الساعة 12:00 ظهراً.\n💡 يرجى التفضل بـ:\n1. إطفاء أجهزة التكييف والإنارة قبل الخروج.\n2. إغلاق الباب الخارجي الذكي خلفك بلمس لوحة الأرقام.\n🤝 نأمل تزويدنا بتعليقاتك واقتراحاتك لتحسين تجاربنا القادمة.',
    variables: ['{GUEST_NAME}', '{UNIT_NAME}']
  }
];

export const INITIAL_PROPERTIES: PropertyPortfolio[] = [
  {
    id: 'prop-1',
    name: 'مجمع النعام النرجس السكني',
    type: 'residential',
    city: 'Riyadh',
    address: 'حي النرجس، مخرج 7، الرياض',
    totalBuildings: 3,
    totalUnits: 18,
    occupancyRate: 88,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prop-2',
    name: 'منتجع واحة السلوى السياحي',
    type: 'resort',
    city: 'AlUla',
    address: 'البلدة القديمة، مزارع نخيل لولو، العلا',
    totalBuildings: 1,
    totalUnits: 6,
    occupancyRate: 95,
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prop-3',
    name: 'برج النعام الأعمال والمارينا',
    type: 'commercial',
    city: 'Jeddah',
    address: 'طريق الكورنيش، حي الشاطئ، جدة',
    totalBuildings: 1,
    totalUnits: 12,
    occupancyRate: 80,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'bld-1',
    propertyId: 'prop-1',
    propertyName: 'مجمع النعام النرجس السكني',
    name: 'مبنى النرجس - بلوك أ',
    address: 'حي النرجس، الرياض',
    floorsCount: 4,
    unitsCount: 8,
    elevatorStatus: 'operational',
    waterTankMeter: 82,
    electricityMeterNo: 'ELEC-9824412-RYD',
    cleanlinessGrade: 'A'
  },
  {
    id: 'bld-2',
    propertyId: 'prop-1',
    propertyName: 'مجمع النعام النرجس السكني',
    name: 'مبنى النرجس - بلوك ب',
    address: 'حي النرجس، الرياض',
    floorsCount: 4,
    unitsCount: 10,
    elevatorStatus: 'operational',
    waterTankMeter: 68,
    electricityMeterNo: 'ELEC-9824415-RYD',
    cleanlinessGrade: 'A'
  },
  {
    id: 'bld-3',
    propertyId: 'prop-3',
    propertyName: 'برج النعام الأعمال والمارينا',
    name: 'برج المارينا بلازا',
    address: 'طريق الكورنيش، الشاطئ، جدة',
    floorsCount: 15,
    unitsCount: 12,
    elevatorStatus: 'operational',
    waterTankMeter: 91,
    electricityMeterNo: 'ELEC-439121-JED',
    cleanlinessGrade: 'B'
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'ten-1',
    name: 'عبد الرحمن بن فهد السديري',
    phone: '966504812345',
    email: 'a.sudairy@holding.com',
    nationalId: '1092837482',
    nationality: 'سعودي',
    companyName: 'مجموعة السديري القابضة',
    status: 'active',
    familyMembersCount: 4,
    totalPaidAmount: 45000,
    dueAmount: 0
  },
  {
    id: 'ten-2',
    name: 'م. سري ألكسندر غريغوري',
    phone: '966551829304',
    email: 'gregory@tech-core.sa',
    nationalId: '2391029384',
    nationality: 'بريطاني',
    companyName: 'كور للحلول والذكاء الاصطناعي',
    status: 'active',
    familyMembersCount: 1,
    totalPaidAmount: 38000,
    dueAmount: 5000
  },
  {
    id: 'ten-3',
    name: 'أمل بنت عبد الله السبيعي',
    phone: '966544837269',
    email: 'amal.subaie@edu.sa',
    nationalId: '1102934812',
    nationality: 'سعودية',
    status: 'active',
    familyMembersCount: 3,
    totalPaidAmount: 24000,
    dueAmount: 0
  },
  {
    id: 'ten-4',
    name: 'فيصل بن طلال السعدون',
    phone: '966567229102',
    email: 'saudoon@invest.com.sa',
    nationalId: '1082734123',
    nationality: 'سعودي',
    status: 'prospective',
    familyMembersCount: 2,
    totalPaidAmount: 0,
    dueAmount: 0
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'con-1',
    contractNumber: 'EJARI-2026-09241',
    tenantId: 'ten-1',
    tenantName: 'عبد الرحمن بن فهد السديري',
    unitId: 'unit-2',
    unitName: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    rentalAmount: 45000,
    securityDeposit: 3000,
    billingCycle: 'yearly',
    status: 'active',
    ejariStatus: 'registered',
    ejariNumber: 'E-2918442-998',
    notes: 'تمت المزامنة بالكامل مع شبكة إيجار الوطنية ودفع الرسوم الضريبية.'
  },
  {
    id: 'con-2',
    contractNumber: 'EJARI-2026-11853',
    tenantId: 'ten-2',
    tenantName: 'م. سري ألكسندر غريغوري',
    unitId: 'unit-4',
    unitName: 'جناح الكورنيش الفاخر المطل على البحر الأحمر - جدة',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    rentalAmount: 12000,
    securityDeposit: 1500,
    billingCycle: 'monthly',
    status: 'active',
    ejariStatus: 'registered',
    ejariNumber: 'E-7724128-441',
    notes: 'الدفع شهري في الموعد الأول من كل شهر ميلادي.'
  },
  {
    id: 'con-3',
    contractNumber: 'EJARI-2026-25411',
    tenantId: 'ten-3',
    tenantName: 'أمل بنت عبد الله السبيعي',
    unitId: 'unit-3',
    unitName: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
    startDate: '2026-05-15',
    endDate: '2027-05-14',
    rentalAmount: 96000,
    securityDeposit: 5000,
    billingCycle: 'quarterly',
    status: 'active',
    ejariStatus: 'registered',
    ejariNumber: 'E-8834192-230',
    notes: 'المستأجر ملتزم للغاية والفيلا مشمولة بالرعاية الدورية.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0001',
    contractId: 'con-1',
    tenantName: 'عبد الرحمن بن فهد السديري',
    unitName: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    amount: 45000,
    vatAmount: 6750,
    totalAmount: 51750,
    type: 'rent',
    status: 'paid',
    zatcaQrCode: 'HELLOWORLDZATCAMOCKQR1234567890AAABBBCCCDDDEEE'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0042',
    contractId: 'con-2',
    tenantName: 'م. سري ألكسندر غريغوري',
    unitName: 'جناح الكورنيش الفاخر المطل على البحر الأحمر - جدة',
    issueDate: '2026-06-01',
    dueDate: '2026-06-10',
    amount: 12000,
    vatAmount: 1800,
    totalAmount: 13800,
    type: 'rent',
    status: 'paid',
    zatcaQrCode: 'HELLOWORLDZATCAMOCKQR6512391238421831920808091'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-0089',
    contractId: 'con-3',
    tenantName: 'أمل بنت عبد الله السبيعي',
    unitName: 'فيلا النخيل الذكية المزودة بنظام سينما منزلي متطور - الرياض',
    issueDate: '2026-05-15',
    dueDate: '2026-05-30',
    amount: 24000,
    vatAmount: 3600,
    totalAmount: 27600,
    type: 'rent',
    status: 'paid',
    zatcaQrCode: 'ZATCAQRCODE_VILLANAKHEEL_MAY2026'
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0112',
    contractId: 'con-2',
    tenantName: 'م. سري ألكسندر غريغوري',
    unitName: 'جناح الكورنيش الفاخر المطل على البحر الأحمر - جدة',
    issueDate: '2026-07-01',
    dueDate: '2026-07-10',
    amount: 12000,
    vatAmount: 1800,
    totalAmount: 13800,
    type: 'rent',
    status: 'unpaid',
    zatcaQrCode: 'ZATCA_UNPAID_BILL_JULY_GREGORY'
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-ELEC-7712',
    contractId: 'con-1',
    tenantName: 'عبد الرحمن بن فهد السديري',
    unitName: 'شقة العليا التنفيذية الهادئة بجوار السنتريا مول والتحلية - الرياض',
    issueDate: '2026-06-15',
    dueDate: '2026-06-30',
    amount: 320,
    vatAmount: 48,
    totalAmount: 368,
    type: 'utility_electricity',
    status: 'unpaid',
    zatcaQrCode: 'ZATCA_METER_BILL_0912'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-201',
    paymentNumber: 'PAY-REF-99214',
    invoiceId: 'inv-101',
    invoiceNumber: 'INV-2026-0001',
    amount: 51750,
    paymentDate: '2026-01-02',
    method: 'bank_transfer',
    referenceNumber: 'TXN-99827411200-RYD',
    bankName: 'مصرف الراجحي',
    status: 'cleared'
  },
  {
    id: 'pay-202',
    paymentNumber: 'PAY-REF-99451',
    invoiceId: 'inv-102',
    invoiceNumber: 'INV-2026-0042',
    amount: 13800,
    paymentDate: '2026-06-03',
    method: 'mada',
    referenceNumber: 'MADA-TXN-44129841',
    bankName: 'البنك الأهلي السعودي',
    status: 'cleared'
  },
  {
    id: 'pay-203',
    paymentNumber: 'PAY-REF-99720',
    invoiceId: 'inv-103',
    invoiceNumber: 'INV-2026-0089',
    amount: 27600,
    paymentDate: '2026-05-16',
    method: 'apple_pay',
    referenceNumber: 'APAY-44128941912',
    bankName: 'بنك الرياض',
    status: 'cleared'
  }
];

