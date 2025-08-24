// Member Type Definitions for CERT Management System

export interface FCCLicense {
  callsign?: string;
  level?: 'Technician' | 'General' | 'Extra';
  extra?: string;
  expirationDate?: string;
}

export interface CertificationRecord {
  isCompleted: boolean;
  dateCompleted?: string;
}

export interface FemaCertType2 {
  basicCert: CertificationRecord;
  is100: CertificationRecord;
  is200: CertificationRecord;
  is700: CertificationRecord;
  is800: CertificationRecord;
  semsG606: CertificationRecord;
  arcSf: CertificationRecord;
  arcDso: CertificationRecord;
  fsw: CertificationRecord;
  wfui: CertificationRecord;
  hazmatFra: CertificationRecord;
  orientation: CertificationRecord;
  bcInfProv: CertificationRecord;
  bcInfSub: CertificationRecord;
  bcCleared: CertificationRecord;
  ptb: CertificationRecord;
}

export interface FemaCertType1Plus {
  is288: CertificationRecord;
  is505: CertificationRecord;
  ptb: CertificationRecord;
}

export interface FemaSectionChief {
  is244: CertificationRecord;
  ics300: CertificationRecord;
  is315: CertificationRecord;
  ics400: CertificationRecord;
  is703: CertificationRecord;
  ptb: CertificationRecord;
}

export interface FemaTeamLeader {
  type2: {
    is244: CertificationRecord;
    is317: CertificationRecord;
    is703: CertificationRecord;
    ptb: CertificationRecord;
  };
  type1: {
    is240: CertificationRecord;
    is241: CertificationRecord;
    is242: CertificationRecord;
    ics400: CertificationRecord;
    is1300: CertificationRecord;
    is2200: CertificationRecord;
    ics300: CertificationRecord;
    g427: CertificationRecord;
    ptb: CertificationRecord;
  };
}

export interface EmergencyMedicalResponder {
  is5: CertificationRecord;
  scemsa: {
    number?: string;
    isCompleted: boolean;
    dateCompleted?: string;
  };
  bls: {
    isCompleted: boolean;
    lastCompleted?: string;
    expirationDate?: string;
  };
  emr: {
    isCompleted: boolean;
    lastCompleted?: string;
    expirationDate?: string;
  };
  otherMed: {
    description?: string;
    lastCompleted?: string;
    expirationDate?: string;
  };
  covid19: {
    isCompleted: boolean;
    dateCompleted?: string;
    expirationDate?: string;
  };
}

export interface Instructor {
  cert: {
    isInstructor: boolean;
    dateEarned?: string;
  };
  teenCert: {
    isInstructor: boolean;
    dateEarned?: string;
  };
  ashiInst: {
    isInstructor: boolean;
    number?: string;
    dateEarned?: string;
  };
}

export interface EquipmentAssignment {
  _id: string;
  itemId: string;
  itemName: string;
  serialNumber?: string;
  assignedDate: string;
  returnDate?: string;
  condition: 'New' | 'Good' | 'Fair' | 'Needs Repair' | 'Lost';
  notes?: string;
}

export interface EventParticipation {
  _id: string;
  eventName: string;
  eventDate: string;
  eventType: 'Training' | 'Deployment' | 'Community Event' | 'Meeting' | 'Exercise';
  hoursServed?: number;
  role?: string;
  notes?: string;
}

export interface MemberNote {
  _id: string;
  content: string;
  author: string;
  date: string;
  type: 'General' | 'Training' | 'Performance' | 'Administrative';
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CurrentAssignment {
  unit?: string;
  position?: string;
  supervisor?: string;
  assignedDate?: string;
}

export interface CertificationSummary {
  femaCertType2: {
    completed: number;
    total: number;
    percentage: number;
  };
  femaCertType1Plus: {
    completed: number;
    total: number;
    percentage: number;
  };
  emergencyMedical: {
    hasEMR: boolean;
    hasBLS: boolean;
    covid19Current: boolean;
  };
  instructor: {
    certInstructor: boolean;
    teenCertInstructor: boolean;
    ashiInstructor: boolean;
  };
}

export interface Member {
  _id: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  status: 'Active' | 'In Training' | 'Inactive' | 'Suspended' | 'Field Ready';
  isGuestMember: boolean;
  
  // Contact Information
  email?: string;
  phone?: string;
  emergencyContact?: EmergencyContact;
  address?: Address;
  
  // Demographics
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  
  // CERT Certifications
  femaCertType2: FemaCertType2;
  femaCertType1Plus: FemaCertType1Plus;
  femaSectionChief: FemaSectionChief;
  femaTeamLeader: FemaTeamLeader;
  
  // Specialized Certifications
  emergencyMedicalResponder: EmergencyMedicalResponder;
  instructor: Instructor;
  fccLicense: FCCLicense;
  
  // Equipment and Events
  equipmentAssigned: EquipmentAssignment[];
  eventHistory: EventParticipation[];
  totalHoursServed: number;
  
  // Assignment
  currentAssignment?: CurrentAssignment;
  
  // Administrative
  joinDate: string;
  lastActiveDate: string;
  backgroundCheckDate?: string;
  backgroundCheckStatus?: 'Pending' | 'Cleared' | 'Requires Review' | 'Failed';
  
  // Notes
  notes: MemberNote[];
  
  // System fields
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  fullName: string;
  displayName: string;
  age?: number;
  certificationSummary?: CertificationSummary;
}

// API Response Types
export interface MemberListResponse {
  success: boolean;
  data: Member[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  filters: {
    status?: string;
    certificationLevel?: string;
    search?: string;
    activeOnly?: string;
    fieldReadyOnly?: string;
  };
}

export interface MemberResponse {
  success: boolean;
  data: Member;
  message?: string;
}

export interface MemberStatsResponse {
  success: boolean;
  data: {
    total: number;
    statusBreakdown: Array<{ _id: string; count: number }>;
    fieldReady: number;
    emrCertified: number;
    instructors: number;
    recentJoiners: number;
    generatedAt: string;
  };
}

// Form Types
export interface MemberFormData {
  firstName: string;
  lastName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status: string;
  dateOfBirth?: string;
  gender?: string;
  fccLicense?: {
    callsign?: string;
    level?: string;
    expirationDate?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
}

// Filter and Search Types
export interface MemberFilters {
  status?: string;
  certificationLevel?: string;
  search?: string;
  activeOnly?: boolean;
  fieldReadyOnly?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}