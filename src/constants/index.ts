// Application Constants

// Form validation constants
export const VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    PATIENT_DEMOGRAPHICS: [
      'firstName',
      'lastName',
      'dateOfBirth',
      'age',
      'gender',
    ],
    INCIDENT_INFORMATION: [
      'incidentNumber',
      'dispatchTime',
      'arrivalTime',
      'patientContactTime',
      'typeOfService',
      'levelOfCare',
    ],
    CHIEF_COMPLAINT: [
      'primaryComplaint',
    ],
    ASSESSMENT: [
      'primaryImpression',
    ],
    NARRATIVE: [
      'subjective',
      'objective',
      'assessment',
      'plan',
    ],
    DISPOSITION: [
      'patientDisposition',
    ],
  },
  FIELD_LIMITS: {
    NAME_MAX_LENGTH: 50,
    TEXT_AREA_MAX_LENGTH: 2000,
    PHONE_MAX_LENGTH: 15,
    SSN_LENGTH: 11, // With dashes: XXX-XX-XXXX
    ZIP_CODE_MAX_LENGTH: 10, // XXXXX-XXXX
  },
};

// ePCR Status Options
export const EPCR_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
} as const;

// Patient Demographics Options
export const PATIENT_OPTIONS = {
  GENDER: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' },
  ],
  RACE: [
    { value: 'american_indian', label: 'American Indian or Alaska Native' },
    { value: 'asian', label: 'Asian' },
    { value: 'black', label: 'Black or African American' },
    { value: 'hawaiian_pacific', label: 'Native Hawaiian or Other Pacific Islander' },
    { value: 'white', label: 'White' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' },
  ],
  ETHNICITY: [
    { value: 'hispanic', label: 'Hispanic or Latino' },
    { value: 'not_hispanic', label: 'Not Hispanic or Latino' },
    { value: 'unknown', label: 'Unknown' },
  ],
  LANGUAGES: [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'other', label: 'Other' },
  ],
};

// Incident Information Options
export const INCIDENT_OPTIONS = {
  SERVICE_TYPES: [
    { value: 'emergency', label: 'Emergency' },
    { value: 'non-emergency', label: 'Non-Emergency' },
    { value: 'standby', label: 'Standby' },
    { value: 'intercept', label: 'Intercept' },
    { value: 'other', label: 'Other' },
  ],
  CARE_LEVELS: [
    { value: 'BLS', label: 'BLS - Basic Life Support' },
    { value: 'ALS1', label: 'ALS1 - Advanced Life Support Level 1' },
    { value: 'ALS2', label: 'ALS2 - Advanced Life Support Level 2' },
    { value: 'CCT', label: 'CCT - Critical Care Transport' },
    { value: 'SCT', label: 'SCT - Specialty Care Transport' },
  ],
};

// Medical Options
export const MEDICAL_OPTIONS = {
  MEDICATION_ROUTES: [
    { value: 'oral', label: 'Oral (PO)' },
    { value: 'IV', label: 'Intravenous (IV)' },
    { value: 'IM', label: 'Intramuscular (IM)' },
    { value: 'sublingual', label: 'Sublingual (SL)' },
    { value: 'topical', label: 'Topical' },
    { value: 'inhalation', label: 'Inhalation' },
    { value: 'subcutaneous', label: 'Subcutaneous (SC)' },
    { value: 'rectal', label: 'Rectal (PR)' },
    { value: 'other', label: 'Other' },
  ],
  CERTIFICATION_LEVELS: [
    { value: 'EMR', label: 'EMR - Emergency Medical Responder' },
    { value: 'EMT', label: 'EMT - Emergency Medical Technician' },
    { value: 'AEMT', label: 'AEMT - Advanced Emergency Medical Technician' },
    { value: 'Paramedic', label: 'Paramedic' },
    { value: 'RN', label: 'RN - Registered Nurse' },
    { value: 'MD', label: 'MD - Medical Doctor' },
  ],
  CREW_ROLES: [
    { value: 'primary', label: 'Primary Care Provider' },
    { value: 'secondary', label: 'Secondary Care Provider' },
    { value: 'driver', label: 'Driver/Operator' },
    { value: 'observer', label: 'Observer' },
  ],
};

// Disposition Options
export const DISPOSITION_OPTIONS = {
  PATIENT_DISPOSITION: [
    { value: 'transported', label: 'Transported' },
    { value: 'treated-released', label: 'Treated and Released' },
    { value: 'treated-refused', label: 'Treated but Refused Transport' },
    { value: 'dead-on-scene', label: 'Dead on Scene' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
  CONDITION_AT_DESTINATION: [
    { value: 'improved', label: 'Improved' },
    { value: 'unchanged', label: 'Unchanged' },
    { value: 'worse', label: 'Deteriorated' },
  ],
};

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Application Settings
export const APP_CONFIG = {
  NAME: 'ePCR System',
  VERSION: '1.0.0',
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_SSN: 'Please enter a valid SSN (XXX-XX-XXXX)',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  INVALID_DATE: 'Please enter a valid date',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORM_INVALID: 'Please correct the errors above before submitting.',
  SAVE_FAILED: 'Failed to save form. Please try again.',
  LOAD_FAILED: 'Failed to load form data.',
};