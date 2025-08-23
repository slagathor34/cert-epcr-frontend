import { PDFExportService } from '../pdfExport';
import { EPCRData } from '../../types/epcr';

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    text: jest.fn(),
    line: jest.fn(),
    rect: jest.fn(),
    circle: jest.fn(),
    setLineWidth: jest.fn(),
    setDrawColor: jest.fn(),
    getTextWidth: jest.fn().mockReturnValue(100),
    splitTextToSize: jest.fn().mockReturnValue(['test']),
    addPage: jest.fn(),
    save: jest.fn(),
  }));
});

describe('PDFExportService', () => {
  let service: PDFExportService;
  let mockData: EPCRData;

  beforeEach(() => {
    service = new PDFExportService();
    
    // Create mock EPCR data
    mockData = {
      reportNumber: 'TEST-001',
      patientDemographics: {
        lastName: 'Doe',
        firstName: 'John',
        middleName: 'A',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        dateOfBirth: '1990-01-01',
        age: 33,
        gender: 'M',
        race: 'white',
        weight: 180,
        height: 72
      },
      incidentInformation: {
        date: '2023-12-07',
        time: '14:30',
        patientNumber: 1,
        totalPatients: 1,
        respondingUnits: ['Unit 101', 'Unit 102'],
        incidentLocation: '123 Emergency Ave',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      crewPPE: {
        crewMemberA: {
          eyeProtection: true,
          gloves: true,
          gown: false,
          n95Mask: true
        },
        crewMemberB: {
          eyeProtection: false,
          gloves: true,
          gown: false,
          n95Mask: true
        },
        crewMemberC: {
          eyeProtection: false,
          gloves: false,
          gown: false,
          n95Mask: false
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
        allergies: 'None known',
        medications: 'Lisinopril 10mg daily',
        medicalHistory: 'Hypertension'
      },
      glasgowComaScale: {
        eyeOpening: 4,
        verbalResponse: 5,
        motorResponse: 6,
        total: 15
      },
      physicalAssessment: {
        pupils: {
          left: 'reactive',
          right: 'reactive'
        },
        lungSounds: {
          left: 'clear',
          right: 'clear'
        },
        skinSigns: 'normal',
        skinColor: 'pink',
        skinTemperature: 'normal'
      },
      bodyDiagramInjuries: [],
      vitalSigns: [
        {
          time: '14:35',
          pulse: 80,
          bloodPressure: '120/80',
          respirations: 16,
          temperature: 98.6,
          spO2: 98
        }
      ],
      treatmentProvided: {
        airwayManagement: [],
        breathing: [
          { id: '1', name: 'Oxygen therapy', checked: true, time: '14:40' }
        ],
        circulation: [],
        medications: [],
        procedures: [],
        immobilization: [],
        other: []
      },
      transportInformation: {
        transportingAgency: 'Mercy Hospital',
        vehicleNumber: 'A-101',
        destination: 'Mercy Emergency Dept',
        destinationType: 'hospital',
        mileage: {
          begin: 12345,
          end: 12350,
          total: 5
        },
        patientRefusal: {
          refused: false
        }
      },
      notesPage: {
        narrative: 'Patient found alert and oriented x3. No apparent distress. Complains of chest discomfort.',
        additionalNotes: 'Transported without incident.'
      },
      crewMembers: [
        {
          name: 'Jane Smith',
          certificationLevel: 'EMT',
          licenseNumber: 'EMT-12345'
        }
      ],
      signatures: {
        primaryCareProvider: {
          name: 'Jane Smith',
          date: '2023-12-07'
        },
        receivingFacility: {
          name: 'Mercy Hospital',
          date: '2023-12-07'
        }
      },
      status: 'completed',
      createdAt: '2023-12-07T14:30:00Z',
      updatedAt: '2023-12-07T15:00:00Z'
    };
  });

  test('should create PDF export service instance', () => {
    expect(service).toBeInstanceOf(PDFExportService);
  });

  test('should export EPCR data to PDF', () => {
    expect(() => {
      service.exportEPCR(mockData, { filename: 'test-epcr.pdf' });
    }).not.toThrow();
  });

  test('should handle empty data gracefully', () => {
    const emptyData = {
      reportNumber: '',
      patientDemographics: {
        lastName: '',
        firstName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        dateOfBirth: '',
        age: 0,
        gender: 'M' as const,
        race: ''
      },
      incidentInformation: {
        date: '',
        time: '',
        patientNumber: 0,
        totalPatients: 0,
        respondingUnits: [],
        incidentLocation: '',
        city: '',
        state: '',
        zip: ''
      },
      crewPPE: {
        crewMemberA: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        crewMemberB: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        crewMemberC: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        crewMemberD: { eyeProtection: false, gloves: false, gown: false, n95Mask: false },
        crewMemberE: { eyeProtection: false, gloves: false, gown: false, n95Mask: false }
      },
      medicalHistory: { allergies: '', medications: '', medicalHistory: '' },
      physicalAssessment: {
        pupils: { left: 'reactive' as const, right: 'reactive' as const },
        lungSounds: { left: 'clear' as const, right: 'clear' as const },
        skinSigns: 'normal' as const,
        skinColor: 'pink' as const,
        skinTemperature: 'normal' as const
      },
      bodyDiagramInjuries: [],
      vitalSigns: [],
      treatmentProvided: {
        airwayManagement: [], breathing: [], circulation: [],
        medications: [], procedures: [], immobilization: [], other: []
      },
      transportInformation: {
        transportingAgency: '', vehicleNumber: '', destination: '',
        destinationType: 'hospital' as const,
        mileage: { begin: 0, end: 0, total: 0 },
        patientRefusal: { refused: false }
      },
      notesPage: { narrative: '', additionalNotes: '' },
      crewMembers: [],
      signatures: {
        primaryCareProvider: { name: '' },
        receivingFacility: { name: '' }
      },
      status: 'draft' as const
    } as EPCRData;

    expect(() => {
      service.exportEPCR(emptyData);
    }).not.toThrow();
  });

  test('should generate correct filename when none provided', () => {
    const saveSpy = jest.fn();
    (service as any).doc.save = saveSpy;

    service.exportEPCR(mockData);

    expect(saveSpy).toHaveBeenCalledWith(
      expect.stringMatching(/EPCR_TEST-001_\d{4}-\d{2}-\d{2}\.pdf/)
    );
  });
});