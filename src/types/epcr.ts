// First Responder Emergency Record Type Definitions

export interface PatientDemographics {
  lastName: string;
  firstName: string;
  middleName?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  homePhone?: string;
  workPhone?: string;
  dateOfBirth: string;
  age: number;
  gender?: 'M' | 'F';
  race: string;
  ssn?: string;
  weight?: number;
  height?: number;
}

export interface IncidentInformation {
  incidentNumber?: string;
  date: string;
  time: string;
  patientNumber: number;
  totalPatients: number;
  respondingUnits: string[];
  incidentLocation: string;
  city: string;
  state: string;
  zip: string;
  milepost?: string;
  crossStreets?: string;
  mapCoordinates?: string;
}

export interface CrewPPE {
  crewMemberA: {
    eyeProtection: boolean;
    gloves: boolean;
    gown: boolean;
    n95Mask: boolean;
  };
  crewMemberB: {
    eyeProtection: boolean;
    gloves: boolean;
    gown: boolean;
    n95Mask: boolean;
  };
  crewMemberC: {
    eyeProtection: boolean;
    gloves: boolean;
    gown: boolean;
    n95Mask: boolean;
  };
  crewMemberD: {
    eyeProtection: boolean;
    gloves: boolean;
    gown: boolean;
    n95Mask: boolean;
  };
  crewMemberE: {
    eyeProtection: boolean;
    gloves: boolean;
    gown: boolean;
    n95Mask: boolean;
  };
}

export interface MedicalHistory {
  chiefComplaint?: string;
  bodyFluidExposure?: string[];
  allergies: string;
  allergiesNone?: boolean;
  medications: string;
  medicationStatus?: string;
  medicalHistory: string;
  reportCompletedBy?: string;
}

export interface GlasgowComaScale {
  eyeOpening: number; // 1-4
  verbalResponse: number; // 1-5
  motorResponse: number; // 1-6
  total: number; // 3-15 (auto-calculated)
}

export interface PhysicalAssessment {
  skinColor?: string;
  skinTemperature?: string;
  skinMoisture?: string;
  pupils: {
    left: string;
    right: string;
  };
  perl?: boolean;
  lungSounds: {
    left: string;
    right: string;
  };
}

export interface TraumaAssessment {
  head?: string;
  neckBack?: string;
  chest?: string;
  abdomen?: string;
  pelvis?: string;
  legLeft?: string;
  legRight?: string;
  armLeft?: string;
  armRight?: string;
}

export interface BodyDiagramInjury {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'laceration' | 'bruise' | 'burn' | 'fracture' | 'abrasion' | 'puncture' | 'swelling' | 'deformity' | 'other';
  description?: string;
  side: 'front' | 'back';
  severity?: 'minor' | 'moderate' | 'severe' | 'critical';
}

export interface VitalSigns {
  time: string;
  loc?: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  pulseRegularity?: string;
  pulseStrength?: string;
  respiratoryRate?: number;
  respiratoryQuality?: string;
  temperature?: number;
  oxygenSaturation?: number;
  treatment?: string;
  // Legacy fields for compatibility
  pulse?: number;
  bloodPressure?: string;
  respirations?: number;
  spO2?: number;
  etCO2?: number;
  bloodGlucose?: number;
  painScale?: number;
  glasgow?: GlasgowComaScale;
}

export interface TreatmentOption {
  id: string;
  name: string;
  checked: boolean;
  time?: string;
  details?: string;
}

export interface TreatmentCategories {
  airwayManagement: TreatmentOption[];
  breathing: TreatmentOption[];
  circulation: TreatmentOption[];
  medications: TreatmentOption[];
  procedures: TreatmentOption[];
  immobilization: TreatmentOption[];
  other: TreatmentOption[];
}

// Additional types for form components
export interface PPECompliance {
  crewMember: 'A' | 'B' | 'C' | 'D' | 'E';
  gloves: boolean;
  mask: boolean;
  gown: boolean;
  eyeProtection: boolean;
}

export interface Treatment {
  category: 'airway' | 'cpr' | 'bleeding-control' | 'spinal-immobilization' | 'medication' | 'iv-access' | 'oxygen' | 'defibrillation' | 'other';
  procedure: string;
  time?: string;
  administered: boolean;
  oxygenDeliveryRate?: number;
  notes?: string;
}

export interface BodyRegionInjury {
  region: 'head' | 'neck-back' | 'chest' | 'abdomen' | 'pelvis' | 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg';
  severity: 'none' | 'minimal' | 'moderate' | 'severe' | 'superficial';
  description: string;
}

export interface TransportInformation {
  transportingAgency: string;
  vehicleNumber: string;
  destination: string;
  destinationType: 'hospital' | 'clinic' | 'home' | 'other';
  mileage: {
    begin: number;
    end: number;
    total: number;
  };
  patientRefusal: {
    refused: boolean;
    patientSignature?: string;
    witnessSignature?: string;
    reason?: string;
  };
}

export interface NotesPage {
  narrative: string;
  additionalNotes: string;
}

export interface CrewMember {
  name: string;
  certificationLevel: 'EMR' | 'EMT' | 'AEMT' | 'Paramedic';
  licenseNumber: string;
  signature?: string;
}

export interface Signatures {
  primaryCareProvider: {
    name: string;
    signature?: string;
    date?: string;
  };
  receivingFacility: {
    name: string;
    signature?: string;
    date?: string;
  };
  patientOrGuardian?: {
    name: string;
    signature?: string;
    date?: string;
  };
}

export interface EPCRData {
  id?: string;
  reportNumber: string;
  patientDemographics: PatientDemographics;
  incidentInformation: IncidentInformation;
  crewPPE: CrewPPE;
  medicalHistory: MedicalHistory;
  glasgowComaScale?: GlasgowComaScale;
  physicalAssessment: PhysicalAssessment;
  trauma?: TraumaAssessment;
  bodyDiagramInjuries: BodyDiagramInjury[];
  vitalSigns: VitalSigns[];
  treatmentProvided: TreatmentCategories;
  transportInformation: TransportInformation;
  notesPage: NotesPage;
  crewMembers: CrewMember[];
  signatures: Signatures;
  createdAt?: string;
  updatedAt?: string;
  status: 'draft' | 'completed' | 'submitted' | 'approved';
  version?: number;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormState {
  data: EPCRData;
  errors: FormValidationError[];
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  lastSaved?: string;
}

// Additional interfaces for interactive components
export interface PPECompliance {
  crewMember: 'A' | 'B' | 'C' | 'D' | 'E';
  gloves: boolean;
  mask: boolean;
  gown: boolean;
  eyeProtection: boolean;
}

export interface VitalSignsEntry {
  id: string;
  time: string;
  levelOfConsciousness: 'A' | 'V' | 'P' | 'U' | '';
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  pulse: string;
  pulseRegularity: 'regular' | 'irregular' | '';
  pulseStrength: 'strong' | 'weak' | '';
  respirations: string;
  respirationQuality: {
    shallow: boolean;
    deep: boolean;
    labored: boolean;
    normal: boolean;
  };
  spO2: string;
  temperature: string;
  treatmentNotes: string;
}

export interface PatientRefusalData {
  patientSignature?: string;
  patientName: string;
  patientDate: string;
  witnessSignature?: string;
  witnessName: string;
  witnessDate: string;
  refusalReason: string;
  risksExplained: boolean;
  patientCompetent: boolean;
  alternativesOffered: boolean;
}