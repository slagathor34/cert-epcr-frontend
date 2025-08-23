import * as yup from 'yup';

// Phone number regex pattern
const phoneRegExp = /^[\+]?[1-9][\d]{0,15}$/;

// SSN regex pattern
const ssnRegExp = /^\d{3}-?\d{2}-?\d{4}$/;

// Patient Demographics Validation Schema
export const patientDemographicsSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(1, 'First name cannot be empty'),
  lastName: yup.string().required('Last name is required').min(1, 'Last name cannot be empty'),
  middleName: yup.string().optional(),
  dateOfBirth: yup.string().required('Date of birth is required'),
  age: yup.number().required('Age is required').positive('Age must be positive').integer('Age must be a whole number'),
  gender: yup.string().required('Gender is required').oneOf(['male', 'female', 'other', 'unknown'], 'Invalid gender selection'),
  weight: yup.number().optional().positive('Weight must be positive'),
  height: yup.number().optional().positive('Height must be positive'),
  race: yup.string().optional(),
  ethnicity: yup.string().optional(),
  ssn: yup.string().optional().matches(ssnRegExp, 'Invalid SSN format'),
  primaryLanguage: yup.string().optional(),
});

// Address Validation Schema
export const addressSchema = yup.object().shape({
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required').min(2, 'State must be at least 2 characters'),
  zipCode: yup.string().required('ZIP code is required').matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: yup.string().required('Country is required'),
});

// Emergency Contact Validation Schema
export const emergencyContactSchema = yup.object().shape({
  name: yup.string().required('Emergency contact name is required'),
  relationship: yup.string().required('Relationship is required'),
  phoneNumber: yup.string().required('Phone number is required').matches(phoneRegExp, 'Invalid phone number'),
  address: addressSchema.optional(),
});

// Incident Information Validation Schema
export const incidentInformationSchema = yup.object().shape({
  incidentNumber: yup.string().required('Incident number is required'),
  dispatchTime: yup.string().required('Dispatch time is required'),
  arrivalTime: yup.string().required('Arrival time is required'),
  patientContactTime: yup.string().required('Patient contact time is required'),
  departureTime: yup.string().optional(),
  arrivalAtDestinationTime: yup.string().optional(),
  incidentLocation: addressSchema.required('Incident location is required'),
  facilityCode: yup.string().optional(),
  facilityName: yup.string().optional(),
  typeOfService: yup.string().required('Type of service is required').oneOf(['emergency', 'non-emergency', 'standby', 'intercept', 'other'], 'Invalid service type'),
  levelOfCare: yup.string().required('Level of care is required').oneOf(['BLS', 'ALS1', 'ALS2', 'CCT', 'SCT'], 'Invalid level of care'),
});

// Chief Complaint Validation Schema
export const chiefComplaintSchema = yup.object().shape({
  primaryComplaint: yup.string().required('Primary complaint is required'),
  secondaryComplaint: yup.string().optional(),
  onsetDateTime: yup.string().optional(),
  durationOfComplaint: yup.string().optional(),
  provokingFactors: yup.string().optional(),
  qualityOfPain: yup.string().optional(),
  radiationOfPain: yup.string().optional(),
  severity: yup.number().optional().min(1, 'Severity must be at least 1').max(10, 'Severity cannot exceed 10'),
  timing: yup.string().optional(),
});

// Vital Signs Validation Schema
export const vitalSignsSchema = yup.object().shape({
  time: yup.string().required('Time is required'),
  systolicBP: yup.number().optional().positive('Systolic BP must be positive').max(300, 'Systolic BP seems too high'),
  diastolicBP: yup.number().optional().positive('Diastolic BP must be positive').max(200, 'Diastolic BP seems too high'),
  heartRate: yup.number().optional().positive('Heart rate must be positive').max(300, 'Heart rate seems too high'),
  respiratoryRate: yup.number().optional().positive('Respiratory rate must be positive').max(100, 'Respiratory rate seems too high'),
  temperature: yup.number().optional().min(80, 'Temperature seems too low').max(115, 'Temperature seems too high'),
  oxygenSaturation: yup.number().optional().min(0, 'Oxygen saturation cannot be negative').max(100, 'Oxygen saturation cannot exceed 100%'),
  bloodGlucose: yup.number().optional().positive('Blood glucose must be positive'),
  painScale: yup.number().optional().min(0, 'Pain scale cannot be negative').max(10, 'Pain scale cannot exceed 10'),
  glasgowComaScale: yup.object().shape({
    eye: yup.number().min(1, 'Eye response minimum is 1').max(4, 'Eye response maximum is 4'),
    verbal: yup.number().min(1, 'Verbal response minimum is 1').max(5, 'Verbal response maximum is 5'),
    motor: yup.number().min(1, 'Motor response minimum is 1').max(6, 'Motor response maximum is 6'),
    total: yup.number().min(3, 'GCS total minimum is 3').max(15, 'GCS total maximum is 15'),
  }).optional(),
});

// Assessment Validation Schema
export const assessmentSchema = yup.object().shape({
  primaryImpression: yup.string().required('Primary impression is required'),
  secondaryImpressions: yup.array().of(yup.string()).optional(),
  anatomicLocation: yup.string().optional(),
  organSystem: yup.string().optional(),
  causesOfInjury: yup.array().of(yup.string()).optional(),
  workRelated: yup.boolean().optional(),
});

// Medication Validation Schema
export const medicationSchema = yup.object().shape({
  name: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  route: yup.string().required('Route is required').oneOf(['oral', 'IV', 'IM', 'sublingual', 'topical', 'inhalation', 'other'], 'Invalid route'),
  time: yup.string().required('Administration time is required'),
  administeredBy: yup.string().required('Administered by is required'),
  patientResponse: yup.string().optional(),
});

// Procedure Validation Schema
export const procedureSchema = yup.object().shape({
  name: yup.string().required('Procedure name is required'),
  time: yup.string().required('Procedure time is required'),
  performedBy: yup.string().required('Performed by is required'),
  successful: yup.boolean().required('Success status is required'),
  complications: yup.string().optional(),
  patientResponse: yup.string().optional(),
});

// Narrative Validation Schema
export const narrativeSchema = yup.object().shape({
  subjective: yup.string().required('Subjective assessment is required'),
  objective: yup.string().required('Objective assessment is required'),
  assessment: yup.string().required('Assessment is required'),
  plan: yup.string().required('Plan is required'),
});

// Crew Member Validation Schema
export const crewMemberSchema = yup.object().shape({
  name: yup.string().required('Crew member name is required'),
  certificationLevel: yup.string().required('Certification level is required').oneOf(['EMR', 'EMT', 'AEMT', 'Paramedic', 'RN', 'MD'], 'Invalid certification level'),
  licenseNumber: yup.string().required('License number is required'),
  role: yup.string().required('Role is required').oneOf(['primary', 'secondary', 'driver', 'observer'], 'Invalid role'),
});

// Disposition Validation Schema
export const dispositionSchema = yup.object().shape({
  patientDisposition: yup.string().required('Patient disposition is required').oneOf(['transported', 'treated-released', 'treated-refused', 'dead-on-scene', 'cancelled'], 'Invalid disposition'),
  transportDestination: yup.string().when('patientDisposition', {
    is: 'transported',
    then: (schema) => schema.required('Transport destination is required when patient is transported'),
    otherwise: (schema) => schema.optional(),
  }),
  reasonForDestination: yup.string().optional(),
  conditionAtDestination: yup.string().optional().oneOf(['improved', 'unchanged', 'worse'], 'Invalid condition status'),
  transferOfCare: yup.string().when('patientDisposition', {
    is: 'transported',
    then: (schema) => schema.required('Transfer of care is required when patient is transported'),
    otherwise: (schema) => schema.optional(),
  }),
  refusalReason: yup.string().when('patientDisposition', {
    is: 'treated-refused',
    then: (schema) => schema.required('Refusal reason is required when patient refuses treatment'),
    otherwise: (schema) => schema.optional(),
  }),
  refusalWitness: yup.string().when('patientDisposition', {
    is: 'treated-refused',
    then: (schema) => schema.required('Refusal witness is required when patient refuses treatment'),
    otherwise: (schema) => schema.optional(),
  }),
});

// Complete ePCR Validation Schema (Relaxed for draft forms)
export const epcrSchema = yup.object().shape({
  reportNumber: yup.string().optional(),
  patientDemographics: patientDemographicsSchema.optional(),
  patientAddress: addressSchema.optional(),
  emergencyContact: emergencyContactSchema.optional(),
  incidentInformation: incidentInformationSchema.optional(),
  chiefComplaint: chiefComplaintSchema.optional(),
  vitalSigns: yup.array().of(vitalSignsSchema).optional(),
  assessment: assessmentSchema.optional(),
  medications: yup.array().of(medicationSchema).optional(),
  procedures: yup.array().of(procedureSchema).optional(),
  narrative: narrativeSchema.optional(),
  crewMembers: yup.array().of(crewMemberSchema).optional(),
  disposition: dispositionSchema.optional(),
  status: yup.string().optional().oneOf(['draft', 'completed', 'submitted', 'approved'], 'Invalid status'),
});