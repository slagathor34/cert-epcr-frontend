import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { EPCRData, FormState, VitalSigns, TreatmentOption, CrewMember } from '../types/epcr';
import { recordService } from '../services/recordService';

interface UseEPCRFormOptions {
  initialData?: Partial<EPCRData>;
  autoSaveInterval?: number; // in milliseconds
  onSave?: (data: EPCRData) => void;
  onError?: (error: Error) => void;
}

const defaultEPCRData: Partial<EPCRData> = {
  status: 'draft',
  reportNumber: '',
  patientDemographics: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: 0,
    gender: undefined,
    address: '',
    city: '',
    state: '',
    zip: '',
    race: '',
  },
  incidentInformation: {
    incidentNumber: '',
    date: '',
    time: '',
    patientNumber: 1,
    totalPatients: 1,
    respondingUnits: [],
    incidentLocation: '',
    city: '',
    state: '',
    zip: '',
  },
  crewPPE: {
    crewMemberA: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
    crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
  },
  medicalHistory: {
    allergies: '',
    medications: '',
    medicalHistory: '',
  },
  physicalAssessment: {
    pupils: { left: '', right: '' },
    lungSounds: { left: '', right: '' },
  },
  bodyDiagramInjuries: [],
  vitalSigns: [],
  treatmentProvided: {
    airwayManagement: [],
    breathing: [],
    circulation: [],
    medications: [],
    procedures: [],
    immobilization: [],
    other: [],
  },
  transportInformation: {
    transportingAgency: '',
    vehicleNumber: '',
    destination: '',
    destinationType: 'hospital',
    mileage: { begin: 0, end: 0, total: 0 },
    patientRefusal: { refused: false },
  },
  notesPage: {
    narrative: '',
    additionalNotes: '',
  },
  crewMembers: [],
  signatures: {
    primaryCareProvider: { name: '' },
    receivingFacility: { name: '' },
  },
  // New form sections
  medications: [],
  procedures: [],
  narrative: {
    description: '',
    assessment: '',
    plan: '',
    responseToTreatment: '',
    physicalFindings: [],
  },
  disposition: {
    type: 'transport' as const,
    destination: '',
    transportMethod: '',
    transportPriority: '',
    patientCondition: '',
    notes: '',
    followupInstructions: '',
  },
};

export const useEPCRForm = (options: UseEPCRFormOptions = {}) => {
  const {
    initialData = defaultEPCRData,
    autoSaveInterval = 30000, // 30 seconds
    onSave,
    onError,
  } = options;

  const [formState, setFormState] = useState<FormState>({
    data: { ...defaultEPCRData, ...initialData } as EPCRData,
    errors: [],
    isDirty: false,
    isValid: false,
    isSubmitting: false,
  });

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<string>();

  const form = useForm<EPCRData>({
    // resolver: yupResolver(epcrSchema), // Temporarily disabled for compatibility
    defaultValues: formState.data,
    mode: 'onChange',
  });

  const {
    watch,
    formState: { errors, isDirty, isValid, isSubmitting },
    setValue,
    getValues,
    reset,
  } = form;

  // Watch for changes to trigger auto-save
  const watchedValues = watch();

  // Auto-save functionality
  const autoSave = useCallback(async (data: EPCRData) => {
    if (!data.id || !isDirty) return;

    try {
      const savedData = await recordService.updateRecord(data.id, data);
      lastSaveRef.current = new Date().toISOString();
      
      setFormState(prev => ({
        ...prev,
        data: savedData,
        lastSaved: lastSaveRef.current,
      }));

      if (onSave) {
        onSave(savedData);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [isDirty, onSave, onError]);

  // Set up auto-save timer
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (isDirty && formState.data.id) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave(watchedValues);
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [watchedValues, isDirty, autoSave, autoSaveInterval, formState.data.id]);

  // Update form state when form changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      data: watchedValues,
      errors: Object.entries(errors).map(([field, error]) => ({
        field,
        message: error?.message || 'Invalid value',
      })),
      isDirty,
      isValid,
      isSubmitting,
    }));
  }, [watchedValues, errors, isDirty, isValid, isSubmitting]);

  // Save form data
  const saveForm = useCallback(async (data: EPCRData) => {
    try {
      let savedData: EPCRData;
      
      if (data.id) {
        savedData = await recordService.updateRecord(data.id, data);
      } else {
        savedData = await recordService.saveRecord(data);
      }

      reset(savedData);
      setFormState(prev => ({
        ...prev,
        data: savedData,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      }));

      if (onSave) {
        onSave(savedData);
      }

      return savedData;
    } catch (error) {
      console.error('Save failed:', error);
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }, [reset, onSave, onError]);

  // Submit form for approval
  const submitForm = useCallback(async (data: EPCRData) => {
    try {
      if (!data.id) {
        throw new Error('Cannot submit unsaved form');
      }

      // For now, we'll just update the status since we don't have a submit endpoint in recordService
      const submittedData = await recordService.updateRecord(data.id, { ...data, status: 'submitted' });
      
      setFormState(prev => ({
        ...prev,
        data: submittedData,
        isSubmitting: false,
      }));

      if (onSave) {
        onSave(submittedData);
      }

      return submittedData;
    } catch (error) {
      console.error('Submit failed:', error);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }, [onSave, onError]);

  // Load existing form data
  const loadForm = useCallback(async (id: string) => {
    try {
      const data = await recordService.getRecord(id);
      if (!data) {
        throw new Error('Record not found');
      }
      reset(data);
      setFormState(prev => ({
        ...prev,
        data,
        isDirty: false,
      }));
      return data;
    } catch (error) {
      console.error('Load failed:', error);
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }, [reset, onError]);

  // Add vital signs entry
  const addVitalSigns = useCallback(() => {
    const currentVitalSigns = (getValues('vitalSigns') as VitalSigns[]) || [];
    const newVitalSigns: VitalSigns = {
      time: new Date().toISOString(),
    };
    setValue('vitalSigns', [...currentVitalSigns, newVitalSigns], { shouldDirty: true });
  }, [getValues, setValue]);

  // Remove vital signs entry
  const removeVitalSigns = useCallback((index: number) => {
    const currentVitalSigns = (getValues('vitalSigns') as VitalSigns[]) || [];
    const updatedVitalSigns = currentVitalSigns.filter((_, i) => i !== index);
    setValue('vitalSigns', updatedVitalSigns, { shouldDirty: true });
  }, [getValues, setValue]);

  // Add medication
  const addMedication = useCallback(() => {
    const currentMedications = (getValues('treatmentProvided.medications') as TreatmentOption[]) || [];
    const newMedication: TreatmentOption = {
      id: `med_${Date.now()}`,
      name: '',
      checked: false,
      time: new Date().toISOString(),
    };
    setValue('treatmentProvided.medications', [...currentMedications, newMedication], { shouldDirty: true });
  }, [getValues, setValue]);

  // Remove medication
  const removeMedication = useCallback((index: number) => {
    const currentMedications = (getValues('treatmentProvided.medications') as TreatmentOption[]) || [];
    const updatedMedications = currentMedications.filter((_, i) => i !== index);
    setValue('treatmentProvided.medications', updatedMedications, { shouldDirty: true });
  }, [getValues, setValue]);

  // Add procedure
  const addProcedure = useCallback(() => {
    const currentProcedures = (getValues('treatmentProvided.procedures') as TreatmentOption[]) || [];
    const newProcedure: TreatmentOption = {
      id: `proc_${Date.now()}`,
      name: '',
      checked: false,
      time: new Date().toISOString(),
    };
    setValue('treatmentProvided.procedures', [...currentProcedures, newProcedure], { shouldDirty: true });
  }, [getValues, setValue]);

  // Remove procedure
  const removeProcedure = useCallback((index: number) => {
    const currentProcedures = (getValues('treatmentProvided.procedures') as TreatmentOption[]) || [];
    const updatedProcedures = currentProcedures.filter((_, i) => i !== index);
    setValue('treatmentProvided.procedures', updatedProcedures, { shouldDirty: true });
  }, [getValues, setValue]);

  // Add crew member
  const addCrewMember = useCallback(() => {
    const currentCrewMembers = (getValues('crewMembers') as CrewMember[]) || [];
    const newCrewMember: CrewMember = {
      name: '',
      certificationLevel: 'EMT',
      licenseNumber: '',
    };
    setValue('crewMembers', [...currentCrewMembers, newCrewMember], { shouldDirty: true });
  }, [getValues, setValue]);

  // Remove crew member
  const removeCrewMember = useCallback((index: number) => {
    const currentCrewMembers = (getValues('crewMembers') as CrewMember[]) || [];
    const updatedCrewMembers = currentCrewMembers.filter((_, i) => i !== index);
    setValue('crewMembers', updatedCrewMembers, { shouldDirty: true });
  }, [getValues, setValue]);

  // Wrapper functions to ensure proper return values
  const handleSaveWrapper = useCallback(async () => {
    const currentData = getValues();
    return await saveForm(currentData);
  }, [getValues, saveForm]);

  const handleSubmitWrapper = useCallback(async () => {
    const currentData = getValues();
    return await submitForm(currentData);
  }, [getValues, submitForm]);

  return {
    form,
    formState,
    actions: {
      saveForm: handleSaveWrapper,
      submitForm: handleSubmitWrapper,
      loadForm,
      addVitalSigns,
      removeVitalSigns,
      addMedication,
      removeMedication,
      addProcedure,
      removeProcedure,
      addCrewMember,
      removeCrewMember,
    },
  };
};