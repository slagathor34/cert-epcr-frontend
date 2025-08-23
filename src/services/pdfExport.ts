import jsPDF from 'jspdf';
import { EPCRData } from '../types/epcr';

// PDF Export Service for First Responder Emergency Record
// This service creates a PDF that exactly matches the original form layout

export interface PDFExportOptions {
  format?: 'letter' | 'a4';
  orientation?: 'portrait' | 'landscape';
  filename?: string;
}

// Form dimensions and positioning constants (exact measurements)
const FORM_CONFIG = {
  // Page dimensions (8.5 x 11 inches)
  PAGE_WIDTH: 612, // points (8.5 * 72)
  PAGE_HEIGHT: 792, // points (11 * 72)
  
  // Margins
  MARGIN_LEFT: 36, // 0.5 inch
  MARGIN_RIGHT: 36, // 0.5 inch
  MARGIN_TOP: 36, // 0.5 inch
  MARGIN_BOTTOM: 36, // 0.5 inch
  
  // Content width
  CONTENT_WIDTH: 540, // PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
  
  // Form section heights and positions
  HEADER: {
    HEIGHT: 80,
    TITLE_Y: 50,
    SUBTITLE_Y: 65,
    INFO_ROW_Y: 75
  },
  
  PATIENT_INFO: {
    START_Y: 120,
    HEIGHT: 100,
    LOCATION_BOX_HEIGHT: 40,
    DEMOGRAPHICS_Y: 180
  },
  
  PPE_GRID: {
    START_Y: 240,
    HEIGHT: 80,
    CELL_WIDTH: 80,
    CELL_HEIGHT: 16
  },
  
  MEDICAL_INFO: {
    START_Y: 340,
    HEIGHT: 60
  },
  
  GLASGOW: {
    START_Y: 420,
    HEIGHT: 80,
    COL_WIDTH: 180
  },
  
  ASSESSMENT: {
    START_Y: 520,
    HEIGHT: 100
  },
  
  VITALS: {
    START_Y: 640,
    HEIGHT: 100,
    ROW_HEIGHT: 20
  },
  
  // Font sizes
  FONTS: {
    TITLE: 16,
    SUBTITLE: 10,
    SECTION_HEADER: 12,
    FIELD_LABEL: 9,
    FIELD_VALUE: 9,
    SMALL: 8
  }
};

export class PDFExportService {
  private doc: jsPDF;
  private currentY: number = 0;
  
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });
  }

  /**
   * Exports EPCR data to PDF with exact form layout
   */
  public exportEPCR(data: EPCRData, options: PDFExportOptions = {}): void {
    const filename = options.filename || `EPCR_${data.reportNumber || 'Draft'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Page 1: Main form
    this.renderFormPage(data);
    
    // Page 2: Notes
    this.doc.addPage();
    this.renderNotesPage(data);
    
    // Save the PDF
    this.doc.save(filename);
  }

  /**
   * Renders the main form page (page 1)
   */
  private renderFormPage(data: EPCRData): void {
    this.currentY = FORM_CONFIG.MARGIN_TOP;
    
    // Header section
    this.renderHeader(data);
    
    // Patient information
    this.renderPatientInformation(data);
    
    // PPE tracking grid
    this.renderPPEGrid(data);
    
    // Medical information
    this.renderMedicalInformation(data);
    
    // Glasgow Coma Scale
    this.renderGlasgowComaScale(data);
    
    // Physical assessment
    this.renderPhysicalAssessment(data);
    
    // Vital signs table
    this.renderVitalSigns(data);
    
    // Body diagram
    this.renderBodyDiagram(data);
    
    // Treatment section
    this.renderTreatmentSection(data);
    
    // Transport/signature section
    this.renderTransportSection(data);
  }

  /**
   * Renders the notes page (page 2)
   */
  private renderNotesPage(data: EPCRData): void {
    this.currentY = FORM_CONFIG.MARGIN_TOP;
    
    // Notes header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NOTES:', FORM_CONFIG.MARGIN_LEFT, this.currentY + 20);
    
    // Lined paper for narrative
    this.renderLinedPaper();
    
    // Add narrative content if available
    if (data.notesPage?.narrative) {
      this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_VALUE);
      this.doc.setFont('helvetica', 'normal');
      const splitText = this.doc.splitTextToSize(data.notesPage.narrative, FORM_CONFIG.CONTENT_WIDTH - 20);
      this.doc.text(splitText, FORM_CONFIG.MARGIN_LEFT + 10, this.currentY + 40);
    }
  }

  /**
   * Renders the form header section
   */
  private renderHeader(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    
    // Main title
    this.doc.setFontSize(FORM_CONFIG.FONTS.TITLE);
    this.doc.setFont('helvetica', 'bold');
    const titleText = 'FIRST RESPONDER EMERGENCY RECORD';
    const titleWidth = this.doc.getTextWidth(titleText);
    this.doc.text(titleText, MARGIN_LEFT + (CONTENT_WIDTH - titleWidth) / 2, FORM_CONFIG.HEADER.TITLE_Y);
    
    // Privacy Act subtitle
    this.doc.setFontSize(FORM_CONFIG.FONTS.SUBTITLE);
    this.doc.setFont('helvetica', 'normal');
    const subtitleText = 'THIS FORM IS SUBJECT TO THE PRIVACY ACT OF 1974';
    const subtitleWidth = this.doc.getTextWidth(subtitleText);
    this.doc.text(subtitleText, MARGIN_LEFT + (CONTENT_WIDTH - subtitleWidth) / 2, FORM_CONFIG.HEADER.SUBTITLE_Y);
    
    // Incident information row
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'normal');
    
    const incidentY = FORM_CONFIG.HEADER.INFO_ROW_Y;
    
    // Incident number
    this.doc.text('Incident #:', MARGIN_LEFT, incidentY);
    this.drawUnderline(MARGIN_LEFT + 55, incidentY, 80);
    if (data.incidentInformation?.date) {
      this.doc.text(data.incidentInformation.date, MARGIN_LEFT + 60, incidentY);
    }
    
    // Date
    this.doc.text('Date:', MARGIN_LEFT + 150, incidentY);
    this.drawUnderline(MARGIN_LEFT + 175, incidentY, 80);
    if (data.incidentInformation?.date) {
      this.doc.text(data.incidentInformation.date, MARGIN_LEFT + 180, incidentY);
    }
    
    // Time
    this.doc.text('Time:', MARGIN_LEFT + 270, incidentY);
    this.drawUnderline(MARGIN_LEFT + 295, incidentY, 60);
    if (data.incidentInformation?.time) {
      this.doc.text(data.incidentInformation.time, MARGIN_LEFT + 300, incidentY);
    }
    
    // Patient number
    this.doc.text('Patient', MARGIN_LEFT + 380, incidentY);
    this.drawUnderline(MARGIN_LEFT + 415, incidentY, 25);
    if (data.incidentInformation?.patientNumber) {
      this.doc.text(data.incidentInformation.patientNumber.toString(), MARGIN_LEFT + 420, incidentY);
    }
    this.doc.text('of', MARGIN_LEFT + 450, incidentY);
    this.drawUnderline(MARGIN_LEFT + 465, incidentY, 25);
    if (data.incidentInformation?.totalPatients) {
      this.doc.text(data.incidentInformation.totalPatients.toString(), MARGIN_LEFT + 470, incidentY);
    }
    
    // Responding units field
    this.doc.text('Responding Unit(s) / Person(s):', MARGIN_LEFT, incidentY + 15);
    this.drawUnderline(MARGIN_LEFT + 150, incidentY + 15, CONTENT_WIDTH - 150);
    if (data.incidentInformation?.respondingUnits) {
      this.doc.text(data.incidentInformation.respondingUnits.join(', '), MARGIN_LEFT + 155, incidentY + 15);
    }
  }

  /**
   * Renders the patient information section
   */
  private renderPatientInformation(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = FORM_CONFIG.PATIENT_INFO.START_Y;
    
    // Location field with crosshatch pattern box
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Location:', MARGIN_LEFT, startY);
    
    // Draw crosshatch pattern box (40px height)
    this.drawCrosshatchBox(MARGIN_LEFT + 50, startY - 35, CONTENT_WIDTH - 50, 40);
    
    if (data.incidentInformation?.incidentLocation) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(data.incidentInformation.incidentLocation, MARGIN_LEFT + 55, startY - 10);
    }
    
    // Patient demographics
    const demoY = startY + 20;
    
    // Patient name
    this.doc.text('Patient Name:', MARGIN_LEFT, demoY);
    this.drawUnderline(MARGIN_LEFT + 80, demoY, 200);
    const patientName = `${data.patientDemographics.lastName}, ${data.patientDemographics.firstName} ${data.patientDemographics.middleName || ''}`.trim();
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(patientName, MARGIN_LEFT + 85, demoY);
    
    // Address
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Address:', MARGIN_LEFT + 300, demoY);
    this.drawUnderline(MARGIN_LEFT + 340, demoY, CONTENT_WIDTH - 340);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.address) {
      this.doc.text(data.patientDemographics.address, MARGIN_LEFT + 345, demoY);
    }
    
    // City, State, ZIP
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('City:', MARGIN_LEFT, demoY + 20);
    this.drawUnderline(MARGIN_LEFT + 30, demoY + 20, 120);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.city) {
      this.doc.text(data.patientDemographics.city, MARGIN_LEFT + 35, demoY + 20);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('State:', MARGIN_LEFT + 160, demoY + 20);
    this.drawUnderline(MARGIN_LEFT + 190, demoY + 20, 40);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.state) {
      this.doc.text(data.patientDemographics.state, MARGIN_LEFT + 195, demoY + 20);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ZIP:', MARGIN_LEFT + 240, demoY + 20);
    this.drawUnderline(MARGIN_LEFT + 260, demoY + 20, 80);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.zip) {
      this.doc.text(data.patientDemographics.zip, MARGIN_LEFT + 265, demoY + 20);
    }
    
    // Age, DOB, Sex, Weight, Height (horizontal layout)
    const detailsY = demoY + 40;
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Age:', MARGIN_LEFT, detailsY);
    this.drawUnderline(MARGIN_LEFT + 25, detailsY, 30);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.age) {
      this.doc.text(data.patientDemographics.age.toString(), MARGIN_LEFT + 30, detailsY);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DOB:', MARGIN_LEFT + 70, detailsY);
    this.drawUnderline(MARGIN_LEFT + 95, detailsY, 80);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.dateOfBirth) {
      this.doc.text(data.patientDemographics.dateOfBirth, MARGIN_LEFT + 100, detailsY);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Sex:', MARGIN_LEFT + 190, detailsY);
    this.drawUnderline(MARGIN_LEFT + 210, detailsY, 30);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.gender) {
      this.doc.text(data.patientDemographics.gender.toUpperCase(), MARGIN_LEFT + 215, detailsY);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Weight:', MARGIN_LEFT + 260, detailsY);
    this.drawUnderline(MARGIN_LEFT + 295, detailsY, 40);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.weight) {
      this.doc.text(`${data.patientDemographics.weight} lbs`, MARGIN_LEFT + 300, detailsY);
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Height:', MARGIN_LEFT + 350, detailsY);
    this.drawUnderline(MARGIN_LEFT + 380, detailsY, 40);
    this.doc.setFont('helvetica', 'normal');
    if (data.patientDemographics.height) {
      this.doc.text(`${data.patientDemographics.height}"`, MARGIN_LEFT + 385, detailsY);
    }
  }

  /**
   * Renders the PPE tracking grid
   */
  private renderPPEGrid(data: EPCRData): void {
    const { MARGIN_LEFT } = FORM_CONFIG;
    const startY = FORM_CONFIG.PPE_GRID.START_Y;
    const cellWidth = FORM_CONFIG.PPE_GRID.CELL_WIDTH;
    const cellHeight = FORM_CONFIG.PPE_GRID.CELL_HEIGHT;
    
    // Section header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PPE TRACKING', MARGIN_LEFT, startY);
    
    // Grid headers
    const gridStartX = MARGIN_LEFT + 80;
    const gridStartY = startY + 10;
    
    // Draw grid structure
    this.doc.setLineWidth(1);
    
    // Column headers (A, B, C, D, E crew members)
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'bold');
    
    // Header row
    this.doc.text('Crewmember', MARGIN_LEFT, gridStartY + 12);
    const crewLabels = ['A', 'B', 'C', 'D', 'E'];
    crewLabels.forEach((label, index) => {
      const x = gridStartX + (index * cellWidth);
      this.doc.rect(x, gridStartY, cellWidth, cellHeight);
      this.doc.text(label, x + cellWidth/2 - 4, gridStartY + 12);
    });
    
    // PPE rows
    const ppeItems = ['Gloves', 'Mask', 'Gown', 'Eye'];
    ppeItems.forEach((item, rowIndex) => {
      const y = gridStartY + cellHeight + (rowIndex * cellHeight);
      
      // Row label
      this.doc.text(item, MARGIN_LEFT, y + 12);
      
      // Checkboxes for each crew member
      crewLabels.forEach((crewLabel, colIndex) => {
        const x = gridStartX + (colIndex * cellWidth);
        this.doc.rect(x, y, cellWidth, cellHeight);
        
        // Draw checkbox
        const checkboxX = x + cellWidth/2 - 6;
        const checkboxY = y + cellHeight/2 - 6;
        this.doc.rect(checkboxX, checkboxY, 12, 12);
        
        // Check if this PPE item is checked for this crew member
        if (this.isPPEChecked(data, crewLabel, item)) {
          this.drawCheckmark(checkboxX + 2, checkboxY + 6);
        }
      });
    });
  }

  /**
   * Renders medical information section
   */
  private renderMedicalInformation(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = FORM_CONFIG.MEDICAL_INFO.START_Y;
    
    // Chief complaint
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Chief Complaint:', MARGIN_LEFT, startY);
    this.drawUnderline(MARGIN_LEFT + 85, startY, CONTENT_WIDTH - 85);
    
    // Body fluid exposure checkboxes
    this.doc.text('Body Fluid Exposure:', MARGIN_LEFT, startY + 20);
    const exposureX = MARGIN_LEFT + 120;
    ['A', 'B', 'C', 'D', 'E'].forEach((label, index) => {
      const x = exposureX + (index * 30);
      this.doc.rect(x, startY + 10, 12, 12);
      this.doc.text(label, x + 15, startY + 20);
    });
    
    // Allergies
    this.doc.text('Allergies:', MARGIN_LEFT, startY + 40);
    this.drawUnderline(MARGIN_LEFT + 50, startY + 40, 200);
    this.doc.setFont('helvetica', 'normal');
    if (data.medicalHistory?.allergies) {
      this.doc.text(data.medicalHistory.allergies, MARGIN_LEFT + 55, startY + 40);
    }
    
    // Medications
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Medications:', MARGIN_LEFT + 270, startY + 40);
    this.drawUnderline(MARGIN_LEFT + 330, startY + 40, CONTENT_WIDTH - 330);
    this.doc.setFont('helvetica', 'normal');
    if (data.medicalHistory?.medications) {
      this.doc.text(data.medicalHistory.medications, MARGIN_LEFT + 335, startY + 40);
    }
  }

  /**
   * Renders Glasgow Coma Scale table
   */
  private renderGlasgowComaScale(data: EPCRData): void {
    const { MARGIN_LEFT } = FORM_CONFIG;
    const startY = FORM_CONFIG.GLASGOW.START_Y;
    const colWidth = FORM_CONFIG.GLASGOW.COL_WIDTH;
    
    // Section header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('GLASGOW COMA SCALE', MARGIN_LEFT, startY);
    
    // Column headers
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    const headers = ['Eyes', 'Verbal', 'Motor'];
    headers.forEach((header, index) => {
      const x = MARGIN_LEFT + (index * colWidth);
      this.doc.rect(x, startY + 10, colWidth, 20);
      this.doc.text(header, x + 5, startY + 22);
    });
    
    // Score options
    const eyeOptions = [
      { score: 4, text: 'Spontaneous' },
      { score: 3, text: 'To Voice' },
      { score: 2, text: 'To Pain' },
      { score: 1, text: 'None' }
    ];
    
    const verbalOptions = [
      { score: 5, text: 'Oriented' },
      { score: 4, text: 'Confused' },
      { score: 3, text: 'Inappropriate' },
      { score: 2, text: 'Incomprehensible' },
      { score: 1, text: 'None' }
    ];
    
    const motorOptions = [
      { score: 6, text: 'Obeys Commands' },
      { score: 5, text: 'Localizes Pain' },
      { score: 4, text: 'Withdraws' },
      { score: 3, text: 'Flexion' },
      { score: 2, text: 'Extension' },
      { score: 1, text: 'None' }
    ];
    
    const allOptions = [eyeOptions, verbalOptions, motorOptions];
    const maxRows = Math.max(...allOptions.map(opts => opts.length));
    
    // Draw option rows
    this.doc.setFont('helvetica', 'normal');
    for (let row = 0; row < maxRows; row++) {
      const y = startY + 30 + (row * 12);
      
      allOptions.forEach((options, colIndex) => {
        if (row < options.length) {
          const option = options[row];
          const x = MARGIN_LEFT + (colIndex * colWidth);
          
          // Draw checkbox
          this.doc.rect(x + 5, y - 5, 8, 8);
          this.doc.text(option.score.toString(), x + 18, y);
          this.doc.text(option.text, x + 30, y);
          
          // Check if this option is selected
          if (this.isGlasgowScoreSelected(data, colIndex, option.score)) {
            this.drawCheckmark(x + 6, y - 1);
          }
        }
      });
    }
    
    // Total score box
    const totalY = startY + 30 + (maxRows * 12) + 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TOTAL (3-15):', MARGIN_LEFT + 400, totalY);
    this.doc.rect(MARGIN_LEFT + 480, totalY - 10, 30, 15);
    
    if (data.glasgowComaScale?.total) {
      this.doc.text(data.glasgowComaScale.total.toString(), MARGIN_LEFT + 490, totalY);
    }
  }

  /**
   * Renders physical assessment grid
   */
  private renderPhysicalAssessment(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = FORM_CONFIG.ASSESSMENT.START_Y;
    
    // Section header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PHYSICAL ASSESSMENT', MARGIN_LEFT, startY);
    
    // Three-column layout
    const colWidth = CONTENT_WIDTH / 3;
    
    // Skin signs column
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.text('Skin Signs:', MARGIN_LEFT, startY + 20);
    const skinOptions = ['Normal', 'Pale', 'Flushed', 'Cyanotic', 'Jaundiced', 'Mottled'];
    skinOptions.forEach((option, index) => {
      const y = startY + 35 + (index * 12);
      this.doc.rect(MARGIN_LEFT + 5, y - 5, 8, 8);
      this.doc.text(option, MARGIN_LEFT + 18, y);
      
      if (data.physicalAssessment?.skinColor === option.toLowerCase()) {
        this.drawCheckmark(MARGIN_LEFT + 6, y - 1);
      }
    });
    
    // Pupils column
    this.doc.text('Pupils:', MARGIN_LEFT + colWidth, startY + 20);
    const pupilOptions = ['Reactive', 'Fixed', 'Dilated', 'Constricted'];
    pupilOptions.forEach((option, index) => {
      const y = startY + 35 + (index * 15);
      
      // Left checkbox
      this.doc.rect(MARGIN_LEFT + colWidth + 5, y - 5, 8, 8);
      this.doc.text('L', MARGIN_LEFT + colWidth + 18, y);
      
      // Right checkbox
      this.doc.rect(MARGIN_LEFT + colWidth + 30, y - 5, 8, 8);
      this.doc.text('R', MARGIN_LEFT + colWidth + 43, y);
      
      this.doc.text(option, MARGIN_LEFT + colWidth + 55, y);
      
      // Check if selected
      if (data.physicalAssessment?.pupils?.left === option.toLowerCase()) {
        this.drawCheckmark(MARGIN_LEFT + colWidth + 6, y - 1);
      }
      if (data.physicalAssessment?.pupils?.right === option.toLowerCase()) {
        this.drawCheckmark(MARGIN_LEFT + colWidth + 31, y - 1);
      }
    });
    
    // Lung sounds column
    this.doc.text('Lung Sounds:', MARGIN_LEFT + (colWidth * 2), startY + 20);
    const lungOptions = ['Clear', 'Diminished', 'Absent', 'Rales', 'Rhonchi', 'Wheeze'];
    lungOptions.forEach((option, index) => {
      const y = startY + 35 + (index * 12);
      
      // Left checkbox
      this.doc.rect(MARGIN_LEFT + (colWidth * 2) + 5, y - 5, 8, 8);
      this.doc.text('L', MARGIN_LEFT + (colWidth * 2) + 18, y);
      
      // Right checkbox
      this.doc.rect(MARGIN_LEFT + (colWidth * 2) + 30, y - 5, 8, 8);
      this.doc.text('R', MARGIN_LEFT + (colWidth * 2) + 43, y);
      
      this.doc.text(option, MARGIN_LEFT + (colWidth * 2) + 55, y);
      
      // Check if selected
      if (data.physicalAssessment?.lungSounds?.left === option.toLowerCase()) {
        this.drawCheckmark(MARGIN_LEFT + (colWidth * 2) + 6, y - 1);
      }
      if (data.physicalAssessment?.lungSounds?.right === option.toLowerCase()) {
        this.drawCheckmark(MARGIN_LEFT + (colWidth * 2) + 31, y - 1);
      }
    });
  }

  /**
   * Renders vital signs table
   */
  private renderVitalSigns(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = FORM_CONFIG.VITALS.START_Y;
    const rowHeight = FORM_CONFIG.VITALS.ROW_HEIGHT;
    
    // Section header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('VITAL SIGNS', MARGIN_LEFT, startY);
    
    // Table headers
    const headers = ['Time', 'LOC', 'B/P', 'Pulse', 'Respirations', 'SpO2', 'Temp', 'Treatment'];
    const colWidths = [60, 40, 60, 60, 80, 50, 50, 140]; // Adjust to fit content width
    
    let currentX = MARGIN_LEFT;
    const headerY = startY + 15;
    
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    headers.forEach((header, index) => {
      this.doc.rect(currentX, headerY, colWidths[index], rowHeight);
      this.doc.text(header, currentX + 2, headerY + 14);
      currentX += colWidths[index];
    });
    
    // Data rows (show up to 4 rows)
    this.doc.setFont('helvetica', 'normal');
    const maxRows = Math.min(4, data.vitalSigns?.length || 0);
    
    for (let row = 0; row < 4; row++) { // Always show 4 rows for consistency
      currentX = MARGIN_LEFT;
      const rowY = headerY + ((row + 1) * rowHeight);
      
      headers.forEach((header, colIndex) => {
        this.doc.rect(currentX, rowY, colWidths[colIndex], rowHeight);
        
        // Fill in data if available
        if (row < maxRows && data.vitalSigns && data.vitalSigns[row]) {
          const vital = data.vitalSigns[row];
          let cellText = '';
          
          switch (colIndex) {
            case 0: cellText = vital.time || ''; break;
            case 1: cellText = ''; break; // LOC - would need to be added to VitalSigns type
            case 2: cellText = vital.bloodPressure || ''; break;
            case 3: cellText = vital.pulse?.toString() || ''; break;
            case 4: cellText = vital.respirations?.toString() || ''; break;
            case 5: cellText = vital.spO2?.toString() || ''; break;
            case 6: cellText = vital.temperature?.toString() || ''; break;
            case 7: cellText = ''; break; // Treatment column
          }
          
          if (cellText) {
            this.doc.text(cellText, currentX + 2, rowY + 14);
          }
        }
        
        currentX += colWidths[colIndex];
      });
    }
  }

  /**
   * Renders body diagram
   */
  private renderBodyDiagram(data: EPCRData): void {
    const { MARGIN_LEFT } = FORM_CONFIG;
    const startY = 680; // Position below vital signs
    
    // Section header
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('BODY DIAGRAM', MARGIN_LEFT, startY);
    
    // Draw basic body outlines (anterior and posterior)
    const figureWidth = 80;
    const figureHeight = 120;
    const anteriorX = MARGIN_LEFT + 50;
    const posteriorX = anteriorX + figureWidth + 50;
    const figureY = startY + 20;
    
    // Anterior figure
    this.doc.text('Anterior', anteriorX + 20, figureY - 5);
    this.drawBodyFigure(anteriorX, figureY, figureWidth, figureHeight, 'anterior');
    
    // Posterior figure
    this.doc.text('Posterior', posteriorX + 20, figureY - 5);
    this.drawBodyFigure(posteriorX, figureY, figureWidth, figureHeight, 'posterior');
    
    // Body region numbers (9, 18, 9, 9 for anterior; 18, 9, 9 for posterior)
    this.doc.setFontSize(FORM_CONFIG.FONTS.SMALL);
    this.doc.text('9', anteriorX + 20, figureY + figureHeight + 15); // Head
    this.doc.text('18', anteriorX + 20, figureY + figureHeight + 25); // Torso
    this.doc.text('9', anteriorX + 10, figureY + figureHeight + 35); // Left leg
    this.doc.text('9', anteriorX + 30, figureY + figureHeight + 35); // Right leg
    
    this.doc.text('18', posteriorX + 20, figureY + figureHeight + 15); // Back/torso
    this.doc.text('9', posteriorX + 10, figureY + figureHeight + 25); // Left leg
    this.doc.text('9', posteriorX + 30, figureY + figureHeight + 25); // Right leg
  }

  /**
   * Renders treatment section
   */
  private renderTreatmentSection(data: EPCRData): void {
    // Due to space constraints on page 1, render a compact treatment summary
    // Full treatment details would be on page 2 or a separate page
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = 600; // Adjust based on available space
    
    this.doc.setFontSize(FORM_CONFIG.FONTS.SECTION_HEADER);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TREATMENT PROVIDED', MARGIN_LEFT, startY);
    
    // Key treatment categories with checkboxes
    const treatments = [
      'Airway Management', 'CPR/Resuscitation', 'Bleeding Control', 
      'Spinal Immobilization', 'Medications', 'IV Access', 'Oxygen Therapy'
    ];
    
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'normal');
    
    const colWidth = CONTENT_WIDTH / 3;
    treatments.forEach((treatment, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = MARGIN_LEFT + (col * colWidth);
      const y = startY + 15 + (row * 15);
      
      // Checkbox
      this.doc.rect(x, y - 5, 8, 8);
      this.doc.text(treatment, x + 12, y);
      
      // Check if any treatments in this category were provided
      if (this.hasTraeatmentInCategory(data, treatment)) {
        this.drawCheckmark(x + 1, y - 1);
      }
    });
    
    // O2 delivery rate field
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('O2 L/min:', MARGIN_LEFT + 350, startY + 15);
    this.drawUnderline(MARGIN_LEFT + 395, startY + 15, 40);
    
    // Time fields for critical interventions
    this.doc.text('Time:', MARGIN_LEFT + 450, startY + 15);
    this.drawUnderline(MARGIN_LEFT + 475, startY + 15, 60);
  }
  
  private hasTraeatmentInCategory(data: EPCRData, category: string): boolean {
    // Check if any treatments were provided in this category
    // This is a simplified check - in a real implementation, you'd check the actual treatment data
    if (!data.treatmentProvided) return false;
    
    // Map category names to data structure
    const categoryMap: { [key: string]: keyof typeof data.treatmentProvided } = {
      'Airway Management': 'airwayManagement',
      'CPR/Resuscitation': 'procedures', // Simplified mapping
      'Bleeding Control': 'circulation',
      'Spinal Immobilization': 'immobilization',
      'Medications': 'medications',
      'IV Access': 'procedures',
      'Oxygen Therapy': 'breathing'
    };
    
    const dataKey = categoryMap[category];
    if (!dataKey) return false;
    
    return data.treatmentProvided[dataKey]?.some(treatment => treatment.checked) || false;
  }

  /**
   * Renders transport and signature section
   */
  private renderTransportSection(data: EPCRData): void {
    const { MARGIN_LEFT, CONTENT_WIDTH } = FORM_CONFIG;
    const startY = 720; // Bottom of page
    
    // Transport agency
    this.doc.setFontSize(FORM_CONFIG.FONTS.FIELD_LABEL);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Transport Agency:', MARGIN_LEFT, startY);
    this.drawUnderline(MARGIN_LEFT + 100, startY, 200);
    
    if (data.transportInformation?.transportingAgency) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(data.transportInformation.transportingAgency, MARGIN_LEFT + 105, startY);
    }
    
    // Patient refusal section
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Patient Refusal:', MARGIN_LEFT, startY + 20);
    this.doc.rect(MARGIN_LEFT + 85, startY + 10, 12, 12);
    
    if (data.transportInformation?.patientRefusal?.refused) {
      this.drawCheckmark(MARGIN_LEFT + 86, startY + 16);
    }
    
    // Signature blocks
    this.doc.text('Patient/Witness Signature:', MARGIN_LEFT, startY + 40);
    this.drawUnderline(MARGIN_LEFT + 140, startY + 40, 200);
    
    this.doc.text('Date:', MARGIN_LEFT + 350, startY + 40);
    this.drawUnderline(MARGIN_LEFT + 375, startY + 40, 80);
  }

  /**
   * Renders lined paper for notes
   */
  private renderLinedPaper(): void {
    const { MARGIN_LEFT, CONTENT_WIDTH, PAGE_HEIGHT, MARGIN_BOTTOM } = FORM_CONFIG;
    const lineSpacing = 20;
    const startY = this.currentY + 40;
    
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(200, 200, 200);
    
    for (let y = startY; y < PAGE_HEIGHT - MARGIN_BOTTOM; y += lineSpacing) {
      this.doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH, y);
    }
    
    this.doc.setDrawColor(0, 0, 0); // Reset to black
  }

  // Helper methods

  private drawUnderline(x: number, y: number, width: number): void {
    this.doc.setLineWidth(0.5);
    this.doc.line(x, y + 2, x + width, y + 2);
  }

  private drawCheckmark(x: number, y: number): void {
    this.doc.setLineWidth(1.5);
    this.doc.line(x, y, x + 3, y + 3);
    this.doc.line(x + 3, y + 3, x + 8, y - 2);
  }

  private drawCrosshatchBox(x: number, y: number, width: number, height: number): void {
    // Draw box
    this.doc.rect(x, y, width, height);
    
    // Draw crosshatch pattern
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(150, 150, 150);
    
    const spacing = 10;
    for (let i = 0; i < width; i += spacing) {
      this.doc.line(x + i, y, x + i, y + height);
    }
    for (let i = 0; i < height; i += spacing) {
      this.doc.line(x, y + i, x + width, y + i);
    }
    
    this.doc.setDrawColor(0, 0, 0); // Reset to black
  }

  private drawBodyFigure(x: number, y: number, width: number, height: number, side: 'anterior' | 'posterior'): void {
    // Simple body outline
    this.doc.setLineWidth(1);
    
    // Head (circle)
    const headRadius = width * 0.15;
    this.doc.circle(x + width/2, y + headRadius, headRadius);
    
    // Torso (rectangle)
    const torsoWidth = width * 0.6;
    const torsoHeight = height * 0.5;
    this.doc.rect(x + (width - torsoWidth)/2, y + headRadius * 2, torsoWidth, torsoHeight);
    
    // Arms (lines)
    const armY = y + headRadius * 2.5;
    this.doc.line(x + (width - torsoWidth)/2, armY, x + (width - torsoWidth)/2 - 15, armY + 20);
    this.doc.line(x + (width + torsoWidth)/2, armY, x + (width + torsoWidth)/2 + 15, armY + 20);
    
    // Legs (lines)
    const legStartY = y + headRadius * 2 + torsoHeight;
    this.doc.line(x + width/2 - 10, legStartY, x + width/2 - 10, legStartY + height * 0.3);
    this.doc.line(x + width/2 + 10, legStartY, x + width/2 + 10, legStartY + height * 0.3);
  }

  private isPPEChecked(data: EPCRData, crewMember: string, ppeItem: string): boolean {
    if (!data.crewPPE) return false;
    
    // Map crew member letter to data structure
    const crewMap: { [key: string]: keyof typeof data.crewPPE } = {
      'A': 'crewMemberA',
      'B': 'crewMemberB', 
      'C': 'crewMemberC',
      'D': 'crewMemberD',
      'E': 'crewMemberE'
    };
    
    const crewKey = crewMap[crewMember];
    if (!crewKey || !data.crewPPE[crewKey]) return false;
    
    // Map PPE item to data field
    const ppeMap: { [key: string]: keyof typeof data.crewPPE.crewMemberA } = {
      'Gloves': 'gloves',
      'Mask': 'n95Mask',
      'Gown': 'gown',
      'Eye': 'eyeProtection'
    };
    
    const ppeKey = ppeMap[ppeItem];
    if (!ppeKey) return false;
    
    return data.crewPPE[crewKey][ppeKey] || false;
  }

  private isGlasgowScoreSelected(data: EPCRData, category: number, score: number): boolean {
    if (!data.glasgowComaScale) return false;
    
    switch (category) {
      case 0: return data.glasgowComaScale.eyeOpening === score;
      case 1: return data.glasgowComaScale.verbalResponse === score;
      case 2: return data.glasgowComaScale.motorResponse === score;
      default: return false;
    }
  }
}

// Export singleton instance
export const pdfExportService = new PDFExportService();

// Convenience function for quick export
export const exportEPCRToPDF = (data: EPCRData, options?: PDFExportOptions) => {
  const service = new PDFExportService();
  service.exportEPCR(data, options);
};