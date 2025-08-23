export const printStyles = `
  @media print {
    /* Hide non-essential elements during print */
    .no-print,
    .MuiAppBar-root,
    .MuiStepper-root,
    .MuiButton-root,
    footer {
      display: none !important;
    }
    
    /* Ensure proper page layout */
    body {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      font-size: 12pt;
      line-height: 1.4;
    }
    
    /* Page setup */
    @page {
      size: letter;
      margin: 0.75in;
    }
    
    /* Typography adjustments for print */
    h1, h2, h3, h4, h5, h6 {
      color: #000 !important;
      page-break-after: avoid;
    }
    
    h1 { font-size: 18pt; }
    h2 { font-size: 16pt; }
    h3 { font-size: 14pt; }
    h4, h5, h6 { font-size: 12pt; }
    
    /* Prevent breaking inside elements */
    .MuiPaper-root,
    .MuiCard-root,
    .form-section {
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #ddd !important;
      box-shadow: none !important;
      margin-bottom: 1rem;
    }
    
    /* Table formatting */
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 10pt;
    }
    
    table, th, td {
      border: 1px solid #000;
      padding: 4px 8px;
    }
    
    th {
      background-color: #f5f5f5 !important;
      font-weight: bold;
    }
    
    /* Form field styling */
    .MuiTextField-root,
    .MuiFormControl-root {
      margin-bottom: 0.5rem;
    }
    
    .MuiInputBase-root {
      border-bottom: 1px solid #000 !important;
      background: transparent !important;
    }
    
    .MuiInputLabel-root {
      color: #000 !important;
      font-weight: bold;
      position: relative !important;
      transform: none !important;
      font-size: 10pt;
    }
    
    .MuiInputBase-input {
      color: #000 !important;
      font-size: 10pt;
      padding: 2px 0 !important;
    }
    
    /* Grid adjustments */
    .MuiGrid-container {
      margin: 0 !important;
      width: 100% !important;
    }
    
    .MuiGrid-item {
      padding: 0.25rem !important;
    }
    
    /* Signature areas */
    .signature-line {
      border-bottom: 1px solid #000;
      height: 40px;
      margin: 1rem 0;
    }
    
    .signature-label {
      font-size: 10pt;
      margin-top: 0.5rem;
    }
    
    /* Header for each page */
    .print-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .print-header h1 {
      margin: 0;
      font-size: 16pt;
    }
    
    .print-header .report-info {
      text-align: right;
      font-size: 10pt;
    }
    
    /* Force new page for major sections */
    .page-break {
      page-break-before: always;
    }
    
    /* Vital signs table */
    .vital-signs-table {
      width: 100%;
      margin: 1rem 0;
    }
    
    .vital-signs-table th,
    .vital-signs-table td {
      text-align: center;
      padding: 4px;
      font-size: 9pt;
    }
    
    /* Narrative sections */
    .narrative-section {
      margin: 1rem 0;
      border: 1px solid #000;
      padding: 0.5rem;
    }
    
    .narrative-label {
      font-weight: bold;
      font-size: 10pt;
      text-decoration: underline;
      margin-bottom: 0.25rem;
    }
    
    .narrative-content {
      min-height: 3rem;
      font-size: 10pt;
      line-height: 1.3;
    }
    
    /* Checkbox styling */
    .MuiCheckbox-root {
      transform: scale(0.8);
    }
    
    .MuiFormControlLabel-label {
      font-size: 10pt;
    }
    
    /* Footer on each page */
    .print-footer {
      position: fixed;
      bottom: 0.5in;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #666;
    }
  }
`;

// Function to add print styles to the document
export const addPrintStyles = () => {
  const styleId = 'print-styles';
  
  // Remove existing print styles if they exist
  const existingStyles = document.getElementById(styleId);
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Add new print styles
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = printStyles;
  document.head.appendChild(styleElement);
};

// Function to remove print styles
export const removePrintStyles = () => {
  const styleElement = document.getElementById('print-styles');
  if (styleElement) {
    styleElement.remove();
  }
};