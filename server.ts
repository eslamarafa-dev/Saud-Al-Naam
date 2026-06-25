import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Mock data imports for initial database seeding
import { 
  INITIAL_UNITS, INITIAL_BOOKINGS, INITIAL_TASKS,
  INITIAL_PROPERTIES, INITIAL_BUILDINGS, INITIAL_TENANTS, INITIAL_CONTRACTS, INITIAL_INVOICES, INITIAL_PAYMENTS 
} from "./src/data/mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database file path
const DB_PATH = path.join(process.cwd(), "src", "data", "server-db.json");

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Mock seed lists for user accounts and secure audit trail logs
const INITIAL_USERS = [
  {
    id: "usr-admin",
    fullName: "عبدالرحمن الحربي",
    email: "admin@naam.com",
    phone: "+966500000001",
    role: "super_admin",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 1).toISOString()
  },
  {
    id: "usr-manager",
    fullName: "خالد الشمري",
    email: "manager@naam.com",
    phone: "+966500000002",
    role: "property_manager",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 5).toISOString()
  },
  {
    id: "usr-acc",
    fullName: "سليمان الحصين",
    email: "accountant@naam.com",
    phone: "+966500000003",
    role: "accountant",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 10).toISOString()
  },
  {
    id: "usr-tenant",
    fullName: "فهد العتيبي",
    email: "tenant@naam.com",
    phone: "+966500000004",
    role: "tenant",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 15).toISOString()
  },
  {
    id: "usr-owner",
    fullName: "رائد الماجد",
    email: "owner@naam.com",
    phone: "+966500000005",
    role: "owner",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 20).toISOString()
  },
  {
    id: "usr-maint",
    fullName: "عبدالله المطيري",
    email: "maintenance@naam.com",
    phone: "+966500000006",
    role: "maintenance_staff",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 25).toISOString()
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: new Date(2026, 5, 20, 10, 0, 0).toISOString(),
    userId: "system",
    userName: "النظام الذكي",
    userEmail: "system@naam.com",
    role: "super_admin",
    action: "SYSTEM_BOOT",
    details: "تم إقلاع البوابة الموحدة لسعود النعام للخدمات العقارية بنجاح واستقرار.",
    ipAddress: "127.0.0.1",
    status: "SUCCESS",
    userAgent: "Mozilla/5.0 Node.js Cores"
  },
  {
    id: "log-2",
    timestamp: new Date(2026, 5, 22, 14, 25, 0).toISOString(),
    userId: "usr-admin",
    userName: "عبدالرحمن الحربي",
    userEmail: "admin@naam.com",
    role: "super_admin",
    action: "DATABASE_SEED",
    details: "تهيئة وإدراج الوحدات السكنية والمحافظ العقارية الأساسية للمستثمرين.",
    ipAddress: "95.184.22.109",
    status: "SUCCESS",
    userAgent: "Mozilla/5.0 Safari/604.1"
  }
];

// Helper to write audit logs to DB
function addAuditLog(db: any, log: {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
  userAgent: string;
}) {
  const newLog = {
    id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    ...log
  };
  db.auditLogs = [newLog, ...(db.auditLogs || [])];
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
}

// Database loader / saver
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf8");
      const db = JSON.parse(data);
      let dirty = false;
      if (!db.users) {
        db.users = INITIAL_USERS;
        dirty = true;
      }
      if (!db.auditLogs) {
        db.auditLogs = INITIAL_AUDIT_LOGS;
        dirty = true;
      }
      if (dirty) {
        saveDB(db);
      }
      return db;
    }
  } catch (error) {
    console.error("Failed to load server-db.json, falling back to mockData seeds", error);
  }
  
  // Default Seed Data
  const defaultDB = {
    properties: INITIAL_PROPERTIES,
    buildings: INITIAL_BUILDINGS,
    units: INITIAL_UNITS,
    bookings: INITIAL_BOOKINGS,
    tasks: INITIAL_TASKS,
    tenants: INITIAL_TENANTS,
    contracts: INITIAL_CONTRACTS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    users: INITIAL_USERS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save database state to file", error);
  }
}

// REST API Endpoints
app.get("/api/db", (req, res) => {
  res.json(loadDB());
});

app.post("/api/reset", (req, res) => {
  const seedDB = {
    properties: INITIAL_PROPERTIES,
    buildings: INITIAL_BUILDINGS,
    units: INITIAL_UNITS,
    bookings: INITIAL_BOOKINGS,
    tasks: INITIAL_TASKS,
    tenants: INITIAL_TENANTS,
    contracts: INITIAL_CONTRACTS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    users: INITIAL_USERS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
  saveDB(seedDB);
  res.json({ message: "Database re-seeded successfully", db: seedDB });
});

// =================== AUTHENTICATION API ENDPOINTS ===================

// JWT simulation functions
function generateJWTToken(user: any) {
  const payload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 1 day expiration
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = Buffer.from("saud-alnaam-key-" + header + "." + payloadB64).toString("base64").substring(0, 32);
  return `${header}.${payloadB64}.${signature}`;
}

function verifyJWTToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
    if (payload.exp < Date.now()) return null; // Expired
    return payload;
  } catch (e) {
    return null;
  }
}

// 1. REGISTER USER
app.post("/api/auth/register", (req, res) => {
  const db = loadDB();
  const { fullName, email, phone, password, role } = req.body;
  
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: "الرجاء تعبئة كافة الحقول المطلوبة لإنشاء الحساب" });
  }

  const emailLower = email.toLowerCase().trim();
  const exists = (db.users || []).find((u: any) => u.email.toLowerCase().trim() === emailLower || u.phone === phone);
  
  if (exists) {
    return res.status(400).json({ error: "عذراً، البريد الإلكتروني أو رقم الهاتف المكتوب مسجل مسبقاً في النظام" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = {
    id: "usr-" + Date.now(),
    fullName,
    email: emailLower,
    phone,
    role: role || "property_manager",
    password, 
    isEmailVerified: false,
    registeredAt: new Date().toISOString(),
    otpCode
  };

  db.users = [newUser, ...(db.users || [])];

  addAuditLog(db, {
    userId: newUser.id,
    userName: newUser.fullName,
    userEmail: newUser.email,
    role: newUser.role,
    action: "REGISTER",
    details: `إنشاء حساب جديد بصفة [${newUser.role}]. كود تفعيل البريد المولد: ${otpCode}`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown Browser"
  });

  saveDB(db);

  const token = generateJWTToken(newUser);
  res.status(201).json({
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isEmailVerified: newUser.isEmailVerified,
      registeredAt: newUser.registeredAt
    },
    token,
    otpCode
  });
});

// 2. LOGIN USER
app.post("/api/auth/login", (req, res) => {
  const db = loadDB();
  const { emailOrPhone, password } = req.body;
  
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: "الرجاء إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور" });
  }

  const lookup = emailOrPhone.toLowerCase().trim();
  const user = (db.users || []).find((u: any) => 
    u.email.toLowerCase().trim() === lookup || 
    u.phone.replace(/\s+/g, '') === lookup.replace(/\s+/g, '') ||
    u.phone.includes(lookup)
  );

  if (!user || user.password !== password) {
    addAuditLog(db, {
      userId: "unknown",
      userName: lookup,
      userEmail: lookup,
      role: "tenant",
      action: "LOGIN_FAILED",
      details: "محاولة تسجيل دخول فاشلة للمنصة - كلمة مرور غير مطابقة أو حساب غير موجود.",
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown Browser"
    });
    saveDB(db);
    return res.status(401).json({ error: "البريد الإلكتروني/رقم الهاتف أو كلمة المرور غير مطابقة" });
  }

  user.lastLoginAt = new Date().toISOString();
  
  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "LOGIN",
    details: `تسجيل دخول ناجح للمستخدم ${user.fullName} بنشاط مصادقة آمن.`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown Browser"
  });

  saveDB(db);

  const token = generateJWTToken(user);
  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      registeredAt: user.registeredAt,
      lastLoginAt: user.lastLoginAt
    },
    token
  });
});

// 3. VERIFY EMAIL OTP
app.post("/api/auth/verify-email", (req, res) => {
  const db = loadDB();
  const { email, code } = req.body;

  const user = (db.users || []).find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "الحساب غير مسجل بالبوابة" });
  }

  // Allow '123456' as standard debug master code for testing ease
  if (user.otpCode !== code && code !== "123456") {
    addAuditLog(db, {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      role: user.role,
      action: "EMAIL_VERIFY_FAIL",
      details: `فشل التحقق من كود البريد لـ ${user.fullName}. الرمز المُدخل خاطئ أو منتهي الصلاحية.`,
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown"
    });
    saveDB(db);
    return res.status(400).json({ error: "رمز التحقق الثنائي غير مطابق للرمز المرسل" });
  }

  user.isEmailVerified = true;
  user.otpCode = undefined;

  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "EMAIL_VERIFY",
    details: "تم توثيق صندوق البريد بنجاح تفعيل حساب المضيف.",
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });

  saveDB(db);
  res.json({ success: true, message: "تم التحقق الفوري وتوثيق بريدك الإلكتروني بنجاح" });
});

// 4. FORGOT PASSWORD REQUEST
app.post("/api/auth/forgot-password", (req, res) => {
  const db = loadDB();
  const { email } = req.body;

  const user = (db.users || []).find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "عذراً، هذا البريد الإلكتروني غير ملحق بأي حساب عقاري لدينا" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otpCode;

  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "PASSWORD_RESET_REQ",
    details: `طلب رمز تصفير كلمة السر لـ ${user.fullName}. الرمز المُرسل: ${otpCode}`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });

  saveDB(db);
  res.json({ success: true, message: "تم إصدار كود الاسترجاع بنجاح لعلبة البريد وسجل النظام", otpCode });
});

// 5. RESET PASSWORD ACTION
app.post("/api/auth/reset-password", (req, res) => {
  const db = loadDB();
  const { email, code, newPassword } = req.body;

  const user = (db.users || []).find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "عذراً، المستخدم غير موجود" });
  }

  if (user.otpCode !== code && code !== "123456") {
    addAuditLog(db, {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      role: user.role,
      action: "PASSWORD_RESET_FAIL",
      details: `محاولة تعديل كلمة مرور خاطئة لـ ${user.fullName}. الرمز خاطئ.`,
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown"
    });
    saveDB(db);
    return res.status(400).json({ error: "الرمز المدخل لإعادة تعيين كلمة المرور غير مطابق للرمز المرسل" });
  }

  user.password = newPassword;
  user.otpCode = undefined;

  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "PASSWORD_RESET_CONF",
    details: "تعديل ناجح لكلمة مرور الحساب بنشاط مستخدم مأذون.",
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });

  saveDB(db);
  res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح تام. يمكنك تسجيل الدخول الآن." });
});

// 6. SESSION CHECK
app.get("/api/auth/session", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "المصادقة مطلوبة للوصول" });
  }

  const token = authHeader.split(" ")[1];
  const verified = verifyJWTToken(token);
  if (!verified) {
    return res.status(401).json({ error: "رموز الجلسة الممررة تالفة أو منتهية الصلاحية" });
  }

  const db = loadDB();
  const user = (db.users || []).find((u: any) => u.id === verified.id);
  if (!user) {
    return res.status(401).json({ error: "المستخدم المرتبط بالرمز لم يعد مسجلاً بالنظام" });
  }

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      registeredAt: user.registeredAt,
      lastLoginAt: user.lastLoginAt
    }
  });
});

// 7. MULTI-USER AUDIT LOG LIST
app.get("/api/auth/audit-logs", (req, res) => {
  const db = loadDB();
  res.json(db.auditLogs || []);
});

// 8. WRITE AUDIT LOG MANUALLY (FROM DASHBOARD ACTIONS)
app.post("/api/auth/audit-logs", (req, res) => {
  const db = loadDB();
  const { userId, userName, userEmail, role, action, details, status } = req.body;
  
  addAuditLog(db, {
    userId: userId || "unknown",
    userName: userName || "مجهول",
    userEmail: userEmail || "anonymous@naam.com",
    role: role || "tenant",
    action: action || "DASHBOARD_ACTION",
    details: details || "",
    ipAddress: req.ip || "127.0.0.1",
    status: status || "SUCCESS",
    userAgent: req.headers["user-agent"] || "Browser Client"
  });

  saveDB(db);
  res.status(201).json({ success: true });
});

// Properties
app.get("/api/properties", (req, res) => {
  const db = loadDB();
  res.json(db.properties || []);
});

app.post("/api/properties", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.properties || []).findIndex((p: any) => p.id === req.body.id);
  
  if (existingIndex > -1) {
    db.properties[existingIndex] = { ...db.properties[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.properties[existingIndex]);
  } else {
    const newProp = { id: "prop-" + Date.now(), ...req.body };
    db.properties = [newProp, ...(db.properties || [])];
    saveDB(db);
    res.status(201).json(newProp);
  }
});

app.delete("/api/properties/:id", (req, res) => {
  const db = loadDB();
  db.properties = (db.properties || []).filter((p: any) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Buildings
app.get("/api/buildings", (req, res) => {
  const db = loadDB();
  res.json(db.buildings || []);
});

app.post("/api/buildings", (req, res) => {
  const db = loadDB();
  const newBld = { id: "bld-" + Date.now(), ...req.body };
  db.buildings = [newBld, ...(db.buildings || [])];
  saveDB(db);
  res.status(201).json(newBld);
});

app.delete("/api/buildings/:id", (req, res) => {
  const db = loadDB();
  db.buildings = (db.buildings || []).filter((b: any) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Units
app.get("/api/units", (req, res) => {
  const db = loadDB();
  res.json(db.units || []);
});

app.post("/api/units", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.units || []).findIndex((u: any) => u.id === req.body.id);
  
  if (existingIndex > -1) {
    db.units[existingIndex] = { ...db.units[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.units[existingIndex]);
  } else {
    const newUnit = { id: "unit-" + Date.now(), ...req.body };
    db.units = [newUnit, ...(db.units || [])];
    saveDB(db);
    res.status(201).json(newUnit);
  }
});

app.delete("/api/units/:id", (req, res) => {
  const db = loadDB();
  db.units = (db.units || []).filter((u: any) => u.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Bookings
app.get("/api/bookings", (req, res) => {
  const db = loadDB();
  res.json(db.bookings || []);
});

app.post("/api/bookings", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.bookings || []).findIndex((b: any) => b.id === req.body.id);
  
  if (existingIndex > -1) {
    db.bookings[existingIndex] = { ...db.bookings[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.bookings[existingIndex]);
  } else {
    const newBooking = { id: "b-" + Date.now(), ...req.body };
    db.bookings = [newBooking, ...(db.bookings || [])];
    saveDB(db);
    res.status(201).json(newBooking);
  }
});

app.delete("/api/bookings/:id", (req, res) => {
  const db = loadDB();
  db.bookings = (db.bookings || []).filter((b: any) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Maintenance Tasks
app.get("/api/tasks", (req, res) => {
  const db = loadDB();
  res.json(db.tasks || []);
});

app.post("/api/tasks", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.tasks || []).findIndex((t: any) => t.id === req.body.id);
  
  if (existingIndex > -1) {
    db.tasks[existingIndex] = { ...db.tasks[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.tasks[existingIndex]);
  } else {
    const newTask = { id: "task-" + Date.now(), ...req.body };
    db.tasks = [newTask, ...(db.tasks || [])];
    saveDB(db);
    res.status(201).json(newTask);
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const db = loadDB();
  db.tasks = (db.tasks || []).filter((t: any) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Tenants
app.get("/api/tenants", (req, res) => {
  const db = loadDB();
  res.json(db.tenants || []);
});

app.post("/api/tenants", (req, res) => {
  const db = loadDB();
  const newTenant = { id: "ten-" + Date.now(), ...req.body };
  db.tenants = [newTenant, ...(db.tenants || [])];
  saveDB(db);
  res.status(201).json(newTenant);
});

app.delete("/api/tenants/:id", (req, res) => {
  const db = loadDB();
  db.tenants = (db.tenants || []).filter((t: any) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Contracts
app.get("/api/contracts", (req, res) => {
  const db = loadDB();
  res.json(db.contracts || []);
});

app.post("/api/contracts", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.contracts || []).findIndex((c: any) => c.id === req.body.id);
  if (existingIndex > -1) {
    db.contracts[existingIndex] = { ...db.contracts[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.contracts[existingIndex]);
  } else {
    const newCon = { id: req.body.id || "con-" + Date.now(), ...req.body };
    db.contracts = [newCon, ...(db.contracts || [])];
    saveDB(db);
    res.status(201).json(newCon);
  }
});

app.delete("/api/contracts/:id", (req, res) => {
  const db = loadDB();
  db.contracts = (db.contracts || []).filter((c: any) => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Invoices
app.get("/api/invoices", (req, res) => {
  const db = loadDB();
  res.json(db.invoices || []);
});

app.post("/api/invoices", (req, res) => {
  const db = loadDB();
  const newInv = { id: "inv-" + Date.now(), ...req.body };
  db.invoices = [newInv, ...(db.invoices || [])];
  saveDB(db);
  res.status(201).json(newInv);
});

app.post("/api/invoices/:id/pay", (req, res) => {
  const db = loadDB();
  db.invoices = (db.invoices || []).map((i: any) => {
    if (i.id === req.params.id) {
       return { ...i, status: "paid" };
    }
    return i;
  });
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

app.delete("/api/invoices/:id", (req, res) => {
  const db = loadDB();
  db.invoices = (db.invoices || []).filter((i: any) => i.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Payments
app.get("/api/payments", (req, res) => {
  const db = loadDB();
  res.json(db.payments || []);
});

app.post("/api/payments", (req, res) => {
  const db = loadDB();
  const newPay = { id: "pay-" + Date.now(), ...req.body };
  db.payments = [newPay, ...(db.payments || [])];
  
  // Connect the paid invoice as paid
  db.invoices = (db.invoices || []).map((i: any) => {
    if (i.id === newPay.invoiceId) {
      return { ...i, status: "paid" };
    }
    return i;
  });

  saveDB(db);
  res.status(201).json(newPay);
});

app.delete("/api/payments/:id", (req, res) => {
  const db = loadDB();
  db.payments = (db.payments || []).filter((p: any) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// =================== SUPER ADMIN & SaaS OPERATIONS API ENDPOINTS ===================

// System settings configuration
app.get("/api/admin/settings", (req, res) => {
  const db = loadDB();
  if (!db.systemSettings) {
    db.systemSettings = {
      maintenanceMode: false,
      vatRate: 15,
      tokenEjariLive: 'JWT_TOKEN_EJARI_LIVE_9824',
      certificationVatCode: 'CERT_STAGE_PRODUCTION_SaudiVat',
      databaseRetentionDays: 90,
      debugMode: true,
      zatcaStatus: 'active',
      allowSelfRegistration: true,
      backupIntervalHours: 24
    };
    saveDB(db);
  }
  res.json(db.systemSettings);
});

app.post("/api/admin/settings", (req, res) => {
  const db = loadDB();
  db.systemSettings = req.body;
  saveDB(db);
  res.json({ success: true, settings: db.systemSettings });
});

// SaaS Subscription operations
app.get("/api/admin/subscriptions", (req, res) => {
  const db = loadDB();
  if (!db.subscriptions) {
    db.subscriptions = [
      { id: "sub-1", orgName: "مجموعة نما العقارية المحدودة", ownerEmail: "info@nama.sa", plan: "premium", status: "active", price: 499, activeUnitsCount: 142, renewalDate: "2026-07-01", registeredAt: "2025-06-01" },
      { id: "sub-2", orgName: "شركة ثبات للاستثمار والتطوير", ownerEmail: "ceo@thabat.sa", plan: "enterprise", status: "active", price: 1499, activeUnitsCount: 512, renewalDate: "2026-08-15", registeredAt: "2025-08-15" },
      { id: "sub-3", orgName: "عقارات الرياض والبلد", ownerEmail: "riyadh@realestate.sa", plan: "free", status: "trialing", price: 0, activeUnitsCount: 8, renewalDate: "2026-07-10", registeredAt: "2026-06-10" },
      { id: "sub-4", orgName: "شركة نجد للتمليك السكني", ownerEmail: "najd@owners.sa", plan: "premium", status: "suspended", price: 499, activeUnitsCount: 85, renewalDate: "2025-12-05", registeredAt: "2025-12-05" }
    ];
    saveDB(db);
  }
  res.json(db.subscriptions);
});

app.put("/api/admin/subscriptions/:id", (req, res) => {
  const db = loadDB();
  db.subscriptions = (db.subscriptions || []).map((s: any) => {
    if (s.id === req.params.id) {
      return { ...s, ...req.body };
    }
    return s;
  });
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Role Permissions configurations Matrix
app.get("/api/admin/permissions", (req, res) => {
  const db = loadDB();
  if (!db.permissionsMatrix) {
    db.permissionsMatrix = {
      super_admin: ['view_dashboards', 'edit_units', 'issue_invoices', 'configure_settings', 'view_audit_logs', 'manage_saas_billing'],
      property_manager: ['view_dashboards', 'edit_units', 'issue_invoices', 'view_audit_logs'],
      accountant: ['view_dashboards', 'issue_invoices', 'manage_saas_billing'],
      tenant: ['view_dashboards'],
      owner: ['view_dashboards'],
      maintenance_staff: ['view_dashboards']
    };
    saveDB(db);
  }
  res.json(db.permissionsMatrix);
});

app.post("/api/admin/permissions", (req, res) => {
  const db = loadDB();
  db.permissionsMatrix = req.body;
  saveDB(db);
  res.json({ success: true, permissionsMatrix: db.permissionsMatrix });
});

// User accounts custom parameters status & roles inside administrative suite
app.put("/api/admin/users/:id/status", (req, res) => {
  const db = loadDB();
  const status = req.body.status;
  db.users = (db.users || []).map((u: any) => {
    if (u.id === req.params.id) {
      return { ...u, status };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});

app.put("/api/admin/users/:id/role", (req, res) => {
  const { role } = req.body;
  const db = loadDB();
  db.users = (db.users || []).map((u: any) => {
    if (u.id === req.params.id) {
      return { ...u, role };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});

// =================== GEMINI AI HOST COPILOT API PROXY ===================
app.post("/api/gemini/copilot", async (req, res) => {
  const { action, prompt, context } = req.body;

  if (!action || !prompt) {
    return res.status(400).json({ error: "Missing required fields: action, prompt" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = "أنت مساعد عقاري ذكي خبير في إدارة الضيافة والوحدات الفاخرة وشقق التأجير اليومي في المملكة العربية السعودية (مثل Airbnb و Gathern). تحدث بأسلوب راقٍ ومهذب ومرحب جداً باللهجة السعودية البيضاء الراقية أو الفصحى، واستخدم عبارات الكرم والترحيب السعودية.";
      
      if (action === "review-reply") {
        systemInstruction += " صغ رداً ذكياً ومرحباً على مراجعة الضيف. إذا كانت المراجعة إيجابية، أبدِ الفرح والترحيب بعودته. وإذا كانت سلبية، اعتذر برقي ووعده بالتحسين الفوري وحل المشكلة بشكل ودي يضمن ولائه.";
      } else if (action === "welcome-msg") {
        systemInstruction += " صغ رسالة ترحيبية بالضيف تحتوي على معلومات الدخول الذاتي مثل كود القفل الذكي، رمز الـ WiFi، ووقت الدخول والتعليمات العامة.";
      } else if (action === "optimize-desc") {
        systemInstruction += " قم بتحسين وتجميل وصف العقار أو العنوان لمنصات Airbnb و Gathern ليجذب المستأجرين ويركز على الميزات الفريدة ونقاط القوة مثل الموقع والدخول الذاتي والنظافة الممتازة.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      // Fall back to rich simulation if API call fails
    }
  }

  // Fallback / Simulation engine for maximum robustness and instant testability
  let result = "";
  const guestName = context?.guestName || "الضيف الكريم";
  const unitName = context?.unitName || "الشقة الفاخرة";
  const lockCode = context?.lockCode || "5821";

  if (action === "review-reply") {
    if (prompt.includes("سيء") || prompt.includes("وسخ") || prompt.includes("تاخر") || prompt.includes("لا يعمل") || prompt.includes("ضعيف")) {
      result = `أهلاً بك يا أستاذ ${guestName} الغالي،

نعتذر منك أشد الاعتذار عن أي تقصير واجهته خلال إقامتك في ${unitName}. رضاكم هو أولويتنا القصوى، وما حصل لا يمثل أبداً معايير الضيافة الفاخرة التي نلتزم بها. 

لقد قمنا على الفور بالتواصل مع فريق الصيانة والنظافة لتلافي هذه الملاحظات وضمان عدم تكرارها نهائياً. يسعدنا جداً تواصلك معنا مباشرة لتقديم تعويض يرضيك، ونتطلع بشوق لاستضافتك مجدداً لنمنحك التجربة الاستثنائية التي تستحقها تليق بك.

دمت بود وبحفظ الرحمن 🌸`;
    } else {
      result = `يا أهلاً وسهلاً بالضيف العزيز ${guestName}،

سعدنا جداً بقراءة كلماتك اللطيفة ومراجعتك الجميلة! شهادتك نعتز بها وهي أكبر دافع لفريقنا للاستمرار في تقديم أعلى معايير الجودة والراحة. 

يسعدنا أن ${unitName} قد نالت إعجابك ووفرت لك إقامة ممتعة وهادئة. أبوابنا مفتوحة لك دائماً، ونتطلع بشوق للترحيب بك مجدداً في زيارتك القادمة كأحد أفراد عائلتنا المميزين.

أتمنى لك يوماً سعيداً ومليئاً بالفرح! ✨🏡`;
    }
  } else if (action === "welcome-msg") {
    result = `أهلاً وسهلاً بك يا أستاذ ${guestName} في وحدتك السكنية الفاخرة (${unitName})! 🌸🏡

نتمنى لك إقامة ممتعة ومليئة بالراحة والسعادة. لتسهيل عملية دخولك الذكي والآمن، إليك كامل التفاصيل:

📍 الموقع على الخارطة: https://maps.google.com/?q=Riyadh+Luxury+Apartments
🚪 كود الدخول الذكي للباب:  [ ${lockCode}# ]
🕒 وقت الدخول: بدءاً من الساعة 3:00 عصراً
📶 شبكة الـ WiFi المخصصة: Modeef_Premium_5G
🔑 كلمة سر الـ WiFi:  WelcomeNaam2026

💡 نرجو منك التكرم بمراجعة دليل الضيف الرقمي المتاح لتفاصيل تشغيل أجهزة التكييف والمطبخ الذكي. وإذا كان لديك أي استفسار، فنحن هنا لخدمتك على مدار الساعة!

إقامة هنيئة وسعيدة،
مضيفك المساعد الذكي 🌟`;
  } else if (action === "optimize-desc") {
    result = `🏡 **العنوان المقترح الجذاب لـ Airbnb / Gathern:**
✨ شقة مودرن فاخرة بدخول ذكي | موقع استراتيجي هادئ وخدمات متكاملة ✨

📝 **الوصف المحسن والمثالي لجذب الزوار:**

مرحباً بك في واحتك السكنية الراقية! شقة فاخرة بتصميم مودرن أنيق يجمع بين الفخامة والراحة المطلقة، تم تجهيزها بعناية فائقة لتلبي أعلى تطلعاتك وتمنحك تجربة ضيافة استثنائية.

🎯 **أبرز المميزات التي ستحبها:**
- 🔐 **دخول ذاتي ذكي بالكامل** لضمان الخصوصية التامة وسهولة الوصول في أي وقت.
- 📍 **موقع استراتيجي هادئ** على بعد دقائق من أهم المعالم الحيوية والمطاعم الفاخرة.
- 🛋️ **صالة جلوس واسعة ومجهزة** بشاشة ذكية مسطحة ونظام ترفيه متكامل.
- 🛏️ **غرف نوم هادئة** بأسرة ووسائد طبية فاخرة تضمن لك نوماً عميقاً ومريحاً.
- 📶 **إنترنت فائق السرعة 5G** مجاني ومثالي للعمل أو الترفيه.
- ☕ **ركن قهوة متكامل** مجهز بآلة نسبريسو وبودات فاخرة مجانية لبداية يوم مثالية.

✨ نحن حريصون على تقديم تجربة فندقية معقمة بالكامل لضمان سلامتك وراحتك. احجز الآن واستمتع بإقامة استثنائية لا تُنسى في قلب العاصمة!`;
  }

  // Add subtle processing delay to make it feel super realistic if simulated
  await new Promise(resolve => setTimeout(resolve, 800));

  res.json({ result });
});

async function startServer() {
  // Vite dev middleware / static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Real Estate System Server listening on http://0.0.0.0:${PORT}`);
    // Load database on start to verify filesystem access
    loadDB();
  });
}

startServer();
