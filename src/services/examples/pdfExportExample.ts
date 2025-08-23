// Example usage of the PDF export service
// This file demonstrates how to use the PDF export functionality

import { exportEPCRToPDF } from '../pdfExport';
import { EPCRData } from '../../types/epcr';

/**
 * Example: Complete EPCR form data for testing PDF export
 */
const exampleEPCRData: EPCRData = {
  reportNumber: 'SFD-2023-001234',
  
  patientDemographics: {
    lastName: 'Johnson',
    firstName: 'Robert',
    middleName: 'William',
    address: '456 Oak Street',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    homePhone: '555-123-4567',
    workPhone: '555-987-6543',
    dateOfBirth: '1975-08-15',
    age: 48,
    gender: 'M',
    race: 'white',
    ssn: '123-45-6789',
    weight: 185,
    height: 70
  },

  incidentInformation: {
    incidentNumber: 'INC-2023-5678',
    date: '2023-12-07',
    time: '15:42',
    patientNumber: 1,
    totalPatients: 1,
    respondingUnits: ['Ambulance 15', 'Engine 8'],
    incidentLocation: '789 Industrial Blvd, Springfield Manufacturing',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    milepost: '42.5',
    crossStreets: 'Industrial Blvd & Factory Rd',
    mapCoordinates: '39.7817° N, 89.6501° W'
  },

  crewPPE: {
    crewMemberA: {
      eyeProtection: true,
      gloves: true,
      gown: true,
      n95Mask: true
    },
    crewMemberB: {
      eyeProtection: true,
      gloves: true,
      gown: false,
      n95Mask: true
    },
    crewMemberC: {
      eyeProtection: false,
      gloves: true,
      gown: false,
      n95Mask: true
    },
    crewMemberD: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false
    },
    crewMemberE: {
      eyeProtection: false,
      gloves: false,
      gown: false,
      n95Mask: false
    }
  },

  medicalHistory: {
    allergies: 'Penicillin (rash), Shellfish (anaphylaxis)',
    medications: 'Metformin 500mg BID, Lisinopril 10mg daily, Aspirin 81mg daily',
    medicalHistory: 'Type 2 Diabetes, Hypertension, Previous MI (2019)'
  },

  glasgowComaScale: {
    eyeOpening: 3,
    verbalResponse: 4,
    motorResponse: 5,
    total: 12
  },

  physicalAssessment: {
    pupils: {
      left: 'reactive',
      right: 'reactive'
    },
    lungSounds: {
      left: 'clear',
      right: 'diminished'
    },
    skinMoisture: 'dry',
    skinColor: 'pale',
    skinTemperature: 'cool'
  },

  bodyDiagramInjuries: [
    {
      id: '1',
      x: 45,
      y: 30,
      type: 'laceration',
      description: '3cm laceration to forehead',
      side: 'front'
    },
    {
      id: '2', 
      x: 60,
      y: 45,
      type: 'bruise',
      description: 'Contusion to right shoulder',
      side: 'front'
    }
  ],

  vitalSigns: [
    {
      time: '15:45',
      pulse: 110,
      bloodPressure: '90/60',
      respirations: 22,
      temperature: 98.2,
      spO2: 94,
      etCO2: 35,
      bloodGlucose: 180,
      painScale: 7,
      glasgow: {
        eyeOpening: 3,
        verbalResponse: 4,
        motorResponse: 5,
        total: 12
      }
    },
    {
      time: '15:55',
      pulse: 105,
      bloodPressure: '95/65',
      respirations: 20,
      temperature: 98.4,
      spO2: 96,
      etCO2: 38,
      bloodGlucose: 165,
      painScale: 5
    },
    {
      time: '16:05',
      pulse: 98,
      bloodPressure: '100/70',
      respirations: 18,
      temperature: 98.6,
      spO2: 98,
      painScale: 4
    }
  ],

  treatmentProvided: {
    airwayManagement: [
      { id: '1', name: 'Manual airway positioning', checked: true, time: '15:43' },
      { id: '2', name: 'Oral airway (OPA)', checked: false },
      { id: '3', name: 'Suction', checked: true, time: '15:44' }
    ],
    breathing: [
      { id: '4', name: 'Oxygen therapy - Non-rebreather mask', checked: true, time: '15:45', details: '15 L/min' },
      { id: '5', name: 'Bag-valve mask ventilation', checked: false }
    ],
    circulation: [
      { id: '6', name: 'Direct pressure bleeding control', checked: true, time: '15:44' },
      { id: '7', name: 'IV access - 18G left antecubital', checked: true, time: '15:50' }
    ],
    medications: [
      { id: '8', name: 'Normal Saline 500ml IV', checked: true, time: '15:52' },
      { id: '9', name: 'Morphine 4mg IV', checked: true, time: '16:00' }
    ],
    procedures: [
      { id: '10', name: '12-lead ECG', checked: true, time: '15:48' },
      { id: '11', name: 'Blood glucose check', checked: true, time: '15:47' }
    ],
    immobilization: [
      { id: '12', name: 'Cervical collar', checked: true, time: '15:43' },
      { id: '13', name: 'Long spine board', checked: true, time: '15:46' }
    ],
    other: [
      { id: '14', name: 'Wound care - sterile dressing', checked: true, time: '15:44' }
    ]
  },

  transportInformation: {
    transportingAgency: 'Sacramento Fire Department',
    vehicleNumber: 'Ambulance 15',
    destination: 'Springfield General Hospital Emergency Department',
    destinationType: 'hospital',
    mileage: {
      begin: 45780,
      end: 45792,
      total: 12
    },
    patientRefusal: {
      refused: false
    }
  },

  notesPage: {
    narrative: `
NARRATIVE: Dispatched to industrial accident at Springfield Manufacturing. Upon arrival, found 48 y/o male patient who had fallen approximately 8 feet from elevated platform onto concrete floor. Patient was alert but disoriented to time. Complained of severe head and shoulder pain (7/10). 

Initial assessment revealed 3cm laceration to forehead with minimal bleeding and obvious contusion to right shoulder. Patient denied loss of consciousness but coworkers reported brief period of confusion immediately following fall.

Vital signs initially showed hypotension and tachycardia consistent with possible hypovolemic shock. Established IV access and administered fluid bolus with improvement in BP. Pain management provided with morphine 4mg IV with good response.

Patient immobilized with c-collar and long spine board due to mechanism of injury. Continuous monitoring during transport showed stable vital signs. Patient remained alert and oriented x3 by time of arrival at receiving facility.

No complications during transport. Turned over care to ED staff with full report.
    `,
    additionalNotes: 'Patient\'s wife notified and en route to hospital. Workplace safety officer on scene conducting investigation.'
  },

  crewMembers: [
    {
      name: 'Sarah Johnson',
      certificationLevel: 'Paramedic',
      licenseNumber: 'P-IL-12345',
      signature: 'S. Johnson'
    },
    {
      name: 'Mike Rodriguez', 
      certificationLevel: 'EMT',
      licenseNumber: 'EMT-IL-67890',
      signature: 'M. Rodriguez'
    }
  ],

  signatures: {
    primaryCareProvider: {
      name: 'Sarah Johnson, Paramedic',
      signature: 'S. Johnson',
      date: '2023-12-07'
    },
    receivingFacility: {
      name: 'Dr. Amanda Chen, MD - Emergency Medicine',
      signature: 'A. Chen',
      date: '2023-12-07'
    },
    patientOrGuardian: {
      name: 'Robert W. Johnson',
      signature: 'R. Johnson', 
      date: '2023-12-07'
    }
  },

  id: 'epcr-123456789',
  createdAt: '2023-12-07T15:42:00Z',
  updatedAt: '2023-12-07T16:15:00Z',
  status: 'completed',
  version: 1
};

/**
 * Example function to demonstrate PDF export usage
 */
export function demonstratePDFExport() {
  console.log('Exporting sample EPCR to PDF...');
  
  try {
    // Export with default options
    exportEPCRToPDF(exampleEPCRData);
    console.log('✓ PDF exported successfully with default settings');

    // Export with custom filename and options
    exportEPCRToPDF(exampleEPCRData, {
      filename: 'Sample_EPCR_Industrial_Accident.pdf',
      format: 'letter',
      orientation: 'portrait'
    });
    console.log('✓ PDF exported successfully with custom filename');

  } catch (error) {
    console.error('✗ PDF export failed:', error);
  }
}

/**
 * Example of exporting a minimal EPCR (draft state)
 */
export function exportDraftEPCR() {
  const draftData: EPCRData = {
    reportNumber: 'DRAFT-001',
    status: 'draft',
    patientDemographics: {
      lastName: 'Smith',
      firstName: 'Jane',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '90210',
      dateOfBirth: '1990-01-01',
      age: 33,
      gender: 'F',
      race: 'white'
    },
    incidentInformation: {
      date: '2023-12-07',
      time: '10:30',
      patientNumber: 1,
      totalPatients: 1,
      respondingUnits: ['Unit 1'],
      incidentLocation: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '90210'
    },
    // Minimal required fields with empty/default values
    crewPPE: {
      crewMemberA: { eyeProtection: false, gloves: true, gown: false, n95Mask: true },
      crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
      crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
      crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
      crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false }
    },
    medicalHistory: { allergies: 'NKDA', medications: 'None', medicalHistory: 'None' },
    physicalAssessment: {
      pupils: { left: 'reactive', right: 'reactive' },
      lungSounds: { left: 'clear', right: 'clear' },
      skinMoisture: 'normal',
      skinColor: 'pink',
      skinTemperature: 'normal'
    },
    bodyDiagramInjuries: [],
    vitalSigns: [],
    treatmentProvided: {
      airwayManagement: [], breathing: [], circulation: [],
      medications: [], procedures: [], immobilization: [], other: []
    },
    transportInformation: {
      transportingAgency: '',
      vehicleNumber: '',
      destination: '',
      destinationType: 'hospital',
      mileage: { begin: 0, end: 0, total: 0 },
      patientRefusal: { refused: false }
    },
    notesPage: { narrative: '', additionalNotes: '' },
    crewMembers: [],
    signatures: {
      primaryCareProvider: { name: '' },
      receivingFacility: { name: '' }
    }
  };

  exportEPCRToPDF(draftData, {
    filename: 'Draft_EPCR_Form.pdf'
  });
}

// Export the example data for use in other files
export { exampleEPCRData };