import { EPCRData } from '../types/epcr';

export interface RecordServiceInterface {
  saveRecord: (record: EPCRData) => Promise<EPCRData>;
  updateRecord: (id: string, record: EPCRData) => Promise<EPCRData>;
  getRecord: (id: string) => Promise<EPCRData | null>;
  getAllRecords: () => Promise<EPCRData[]>;
  deleteRecord: (id: string) => Promise<boolean>;
}

// Mock implementation - in production this would connect to your backend API
class MockRecordService implements RecordServiceInterface {
  private storageKey = 'epcr_records';

  private getRecordsFromStorage(): EPCRData[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading records from localStorage:', error);
      return [];
    }
  }

  private saveRecordsToStorage(records: EPCRData[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(records));
      // Trigger a custom event to notify other components of the change
      window.dispatchEvent(new CustomEvent('epcr-records-updated', { detail: records }));
    } catch (error) {
      console.error('Error saving records to localStorage:', error);
      throw new Error('Failed to save record. Please try again.');
    }
  }

  private generateReportNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-4); // Last 4 digits of timestamp
    return `SFD-${year}-${month}${day}-${time}`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async saveRecord(record: EPCRData): Promise<EPCRData> {
    const records = this.getRecordsFromStorage();
    const now = new Date().toISOString();
    
    const newRecord: EPCRData = {
      ...record,
      id: this.generateId(),
      reportNumber: record.reportNumber || this.generateReportNumber(),
      createdAt: now,
      updatedAt: now,
      status: record.status || 'draft'
    };

    records.push(newRecord);
    this.saveRecordsToStorage(records);
    
    return newRecord;
  }

  async updateRecord(id: string, record: EPCRData): Promise<EPCRData> {
    const records = this.getRecordsFromStorage();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error(`Record with id ${id} not found`);
    }

    const updatedRecord: EPCRData = {
      ...record,
      id,
      reportNumber: record.reportNumber || records[index].reportNumber,
      createdAt: records[index].createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    records[index] = updatedRecord;
    this.saveRecordsToStorage(records);
    
    return updatedRecord;
  }

  async getRecord(id: string): Promise<EPCRData | null> {
    const records = this.getRecordsFromStorage();
    return records.find(r => r.id === id) || null;
  }

  async getAllRecords(): Promise<EPCRData[]> {
    return this.getRecordsFromStorage();
  }

  async deleteRecord(id: string): Promise<boolean> {
    const records = this.getRecordsFromStorage();
    const filteredRecords = records.filter(r => r.id !== id);
    
    if (filteredRecords.length === records.length) {
      return false; // Record not found
    }

    this.saveRecordsToStorage(filteredRecords);
    return true;
  }
}

// Production API service (commented out - implement when backend is ready)
/*
class ApiRecordService implements RecordServiceInterface {
  private baseUrl = process.env.REACT_APP_API_URL || '/api';

  async saveRecord(record: EPCRData): Promise<EPCRData> {
    const response = await fetch(`${this.baseUrl}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save record');
    }
    
    return response.json();
  }

  async updateRecord(id: string, record: EPCRData): Promise<EPCRData> {
    const response = await fetch(`${this.baseUrl}/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update record');
    }
    
    return response.json();
  }

  async getRecord(id: string): Promise<EPCRData | null> {
    const response = await fetch(`${this.baseUrl}/records/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to load record');
    }
    
    return response.json();
  }

  async getAllRecords(): Promise<EPCRData[]> {
    const response = await fetch(`${this.baseUrl}/records`);
    
    if (!response.ok) {
      throw new Error('Failed to load records');
    }
    
    return response.json();
  }

  async deleteRecord(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/records/${id}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  }
}
*/

// Export the service instance
export const recordService: RecordServiceInterface = new MockRecordService();

// Helper function to initialize with mock data if no records exist
export const initializeMockData = async (): Promise<void> => {
  const existingRecords = await recordService.getAllRecords();
  if (existingRecords.length === 0) {
    // Add some initial mock data
    const mockRecords: Partial<EPCRData>[] = [
      {
        patientDemographics: {
          lastName: 'Johnson',
          firstName: 'Michael',
          dateOfBirth: '1985-06-15',
          age: 38,
          gender: 'M',
          address: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701',
          race: 'White',
        },
        incidentInformation: {
          date: '2024-01-15',
          time: '09:15',
          patientNumber: 1,
          totalPatients: 1,
          respondingUnits: ['Unit 12'],
          incidentLocation: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        },
        medicalHistory: {
          allergies: 'NKDA',
          medications: 'Lisinopril 10mg',
          medicalHistory: 'Hypertension',
          chiefComplaint: 'Chest pain'
        },
        glasgowComaScale: {
          eyeOpening: 4,
          verbalResponse: 5,
          motorResponse: 6,
          total: 15,
        },
        status: 'completed'
      },
      {
        patientDemographics: {
          lastName: 'Davis',
          firstName: 'Sarah',
          dateOfBirth: '1992-03-22',
          age: 31,
          gender: 'F',
          address: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zip: '62702',
          race: 'Hispanic',
        },
        incidentInformation: {
          date: '2024-01-15',
          time: '14:05',
          patientNumber: 1,
          totalPatients: 1,
          respondingUnits: ['Unit 8'],
          incidentLocation: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zip: '62702'
        },
        medicalHistory: {
          allergies: 'Penicillin',
          medications: 'Birth control pills',
          medicalHistory: 'None',
          chiefComplaint: 'Motor vehicle accident'
        },
        glasgowComaScale: {
          eyeOpening: 3,
          verbalResponse: 4,
          motorResponse: 5,
          total: 12,
        },
        status: 'completed'
      }
    ];

    for (const mockRecord of mockRecords) {
      await recordService.saveRecord(mockRecord as EPCRData);
    }
  }
};