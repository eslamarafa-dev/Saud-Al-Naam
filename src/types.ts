/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PropertyUnit {
  id: string;
  name: string;
  type: 'chalet' | 'apartment' | 'villa' | 'lounge' | 'suite';
  city: 'Riyadh' | 'Jeddah' | 'AlUla' | 'Khobar' | 'Abha' | 'Diriyah';
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  pricePerNight: number;
  image: string;
  smartLockCode: string;
  smartLockIp: string;
  smartLockStatus: 'locked' | 'unlocked' | 'low_battery' | 'offline';
  wifiName: string;
  wifiPass: string;
  locationLink: string;
  addressText: string;
  channelsSynced: ('airbnb' | 'booking' | 'gathern' | 'direct')[];
  description: string;
}

export interface Booking {
  id: string;
  unitId: string;
  unitName: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  source: 'airbnb' | 'booking' | 'gathern' | 'direct';
  payoutAmount: number;
  guestCount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  paidStatus: 'fully_paid' | 'partial' | 'unpaid';
  smartLockCodeSent: boolean;
  notes?: string;
}

export interface TaskDetail {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  type: 'cleaning' | 'maintenance' | 'inspection' | 'repair';
  assignTo: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  cost: number;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  content: string;
  variables: string[];
  type: 'welcome' | 'lock_code' | 'guide_and_wifi' | 'checkout' | 'cleaning_crew';
}

export interface SaasLead {
  id: string;
  fullName: string;
  phone: string;
  companyName: string;
  city: string;
  unitsCount: number;
  selectedPlan: 'starter' | 'pro' | 'enterprise';
  status: 'pending' | 'contacted' | 'active';
  createdAt: string;
}

export interface FinancialSummary {
  revenue: number;
  expenses: number;
  occupancyRate: number;
  totalBookings: number;
}

// Full Property Management extensions
export interface PropertyPortfolio {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'resort' | 'mixed_use';
  city: 'Riyadh' | 'Jeddah' | 'AlUla' | 'Khobar' | 'Abha' | 'Diriyah';
  address: string;
  totalBuildings: number;
  totalUnits: number;
  occupancyRate: number;
  image: string;
  images?: string[];
  documents?: { id: string; name: string; size: string; uploadDate: string; url?: string }[];
  annualRevenue?: number;
  monthlyRevenue?: { month: string; amount: number }[];
}

export interface Building {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  address: string;
  floorsCount: number;
  unitsCount: number;
  elevatorStatus: 'operational' | 'maintenance';
  waterTankMeter: number; // % full
  electricityMeterNo: string;
  cleanlinessGrade: 'A' | 'B' | 'C';
}

export interface Contract {
  id: string;
  contractNumber: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitName: string;
  propertyId?: string;
  propertyName?: string;
  startDate: string;
  endDate: string;
  rentalAmount: number;
  securityDeposit: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'expired' | 'terminated' | 'pending';
  ejariStatus: 'registered' | 'pending' | 'none';
  ejariNumber?: string;
  notes?: string;
  isArchived?: boolean;
  renewalCount?: number;
  renewalHistory?: { date: string; amount: number; prevEndDate: string; newEndDate: string }[];
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string; // National ID or Iqama Number (Saudi standard)
  nationality: string;
  companyName?: string;
  status: 'active' | 'former' | 'prospective';
  familyMembersCount: number;
  totalPaidAmount: number;
  dueAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  tenantName: string;
  unitName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  vatAmount: number; // 15% Saudi VAT
  totalAmount: number;
  type: 'rent' | 'utility_water' | 'utility_electricity' | 'maintenance_fee';
  status: 'paid' | 'unpaid' | 'overdue' | 'partial';
  zatcaQrCode?: string; // Base64 or mock QR
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  method: 'mada' | 'apple_pay' | 'stc_pay' | 'credit_card' | 'bank_transfer';
  referenceNumber: string;
  bankName?: string;
  status: 'cleared' | 'pending' | 'failed';
}

export type UserRole = 'super_admin' | 'property_manager' | 'accountant' | 'tenant' | 'owner' | 'maintenance_staff';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  registeredAt: string;
  lastLoginAt?: string;
  otpCode?: string; // used for verification codes and resets
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  userAgent: string;
}

export interface SessionInfo {
  token: string;
  user: AuthUser;
  expiresAt: string;
  issuedAt: string;
}


