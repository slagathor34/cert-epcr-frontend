import { EPCRData } from '../types/epcr';

export const exportToPDF = async (record: EPCRData) => {
  try {
    const printWindow = window.open(`/epcr/${record.id}?print=true`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  } catch (error) {
    console.error('Error opening print window:', error);
    alert('Unable to open print window. Please check your popup blocker settings.');
  }
};

export const exportToCSV = (records: EPCRData[], filename?: string) => {
  const csvHeaders = [
    'Report Number',
    'Patient Last Name',
    'Patient First Name',
    'Age',
    'Gender',
    'Date',
    'Time',
    'Chief Complaint',
    'Glasgow Coma Scale',
    'Allergies',
    'Medications',
    'Medical History',
    'Transport Agency',
    'Destination',
    'Status',
    'Created At',
    'Updated At',
  ];

  const csvRows = records.map(record => [
    record.reportNumber || '',
    record.patientDemographics?.lastName || '',
    record.patientDemographics?.firstName || '',
    record.patientDemographics?.age?.toString() || '',
    record.patientDemographics?.gender || '',
    record.incidentInformation?.date || '',
    record.incidentInformation?.time || '',
    record.medicalHistory?.chiefComplaint || '',
    record.glasgowComaScale?.total?.toString() || '',
    record.medicalHistory?.allergies || '',
    record.medicalHistory?.medications || '',
    record.medicalHistory?.medicalHistory || '',
    record.transportInformation?.transportingAgency || '',
    record.transportInformation?.destination || '',
    record.status || '',
    record.createdAt || '',
    record.updatedAt || '',
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `epcr_records_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportSingleRecordToCSV = (record: EPCRData) => {
  const filename = `epcr_${record.reportNumber || record.id}_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV([record], filename);
};

export const exportToJSON = (records: EPCRData[], filename?: string) => {
  const jsonContent = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `epcr_records_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportSingleRecordToJSON = (record: EPCRData) => {
  const filename = `epcr_${record.reportNumber || record.id}_${new Date().toISOString().split('T')[0]}.json`;
  exportToJSON([record], filename);
};

export const generatePatientSummary = (record: EPCRData): string => {
  const patient = record.patientDemographics;
  const medical = record.medicalHistory;
  const incident = record.incidentInformation;
  const gcs = record.glasgowComaScale;
  const transport = record.transportInformation;

  return `
PATIENT CARE REPORT SUMMARY
==========================

Report: ${record.reportNumber || record.id}
Date: ${new Date().toLocaleDateString()}

PATIENT INFORMATION:
- Name: ${patient?.firstName} ${patient?.lastName}
- Age: ${patient?.age} | Gender: ${patient?.gender}
- DOB: ${patient?.dateOfBirth}

INCIDENT DETAILS:
- Date/Time: ${incident?.date} ${incident?.time}
- Location: ${incident?.incidentLocation}, ${incident?.city}, ${incident?.state}
- Responding Units: ${incident?.respondingUnits?.join(', ')}

MEDICAL ASSESSMENT:
- Chief Complaint: ${medical?.chiefComplaint}
- Glasgow Coma Scale: ${gcs?.total} (E${gcs?.eyeOpening}, V${gcs?.verbalResponse}, M${gcs?.motorResponse})
- Allergies: ${medical?.allergies}
- Medications: ${medical?.medications}
- Medical History: ${medical?.medicalHistory}

TRANSPORT:
- Agency: ${transport?.transportingAgency}
- Destination: ${transport?.destination}
- Vehicle: ${transport?.vehicleNumber}

Status: ${record.status?.toUpperCase()}
Generated: ${new Date().toLocaleString()}
`.trim();
};

export const exportPatientSummary = (record: EPCRData) => {
  const summaryContent = generatePatientSummary(record);
  const blob = new Blob([summaryContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `patient_summary_${record.reportNumber || record.id}.txt`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};