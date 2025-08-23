# Interactive EPCR Components

This directory contains advanced interactive React components specifically designed for the First Responder Emergency Record form. These components provide rich interactivity, real-time calculations, and enhanced user experience while maintaining print-friendly layouts.

## Components Overview

### 1. GlasgowComaScaleCalculator
**Purpose**: Interactive calculator for Glasgow Coma Scale assessment with dropdown selections and real-time total calculation.

**Features**:
- Dropdown menus with exact labels (4=Spont, 3=Verbal, 2=Pain, 1=None)
- Real-time total calculation (3-15 range)
- Color-coded severity interpretation
- Critical score alerts for GCS ≤ 8
- Compact mode available
- Print-friendly styling

**Usage**:
```tsx
<GlasgowComaScaleCalculator 
  control={control}
  name="glasgowComaScale"
  compact={false}
/>
```

### 2. InteractiveBodyDiagram
**Purpose**: SVG-based human body diagram with clickable regions for injury documentation.

**Features**:
- Anterior/posterior body views
- 34 numbered clickable regions
- Visual injury markers with color coding
- Injury type selection (laceration, bruise, burn, etc.)
- Severity levels (minor, moderate, severe, critical)
- Interactive injury editing and deletion
- Export data compatible with PDF generation

**Usage**:
```tsx
<InteractiveBodyDiagram
  control={control}
  name="bodyDiagramInjuries"
/>
```

### 3. PPETrackingGrid
**Purpose**: Clean 5x4 grid for tracking PPE compliance across crew members A-E.

**Features**:
- Exact 5 crew members (A, B, C, D, E) in columns
- 4 PPE types (Gloves, Mask, Gown, Eye) in rows
- 20 total checkboxes with state management
- Visual compliance status indicators
- Real-time compliance percentage
- Color-coded crew member identification
- Alerts for incomplete required PPE

**Usage**:
```tsx
<PPETrackingGrid
  control={control}
  name="crewPPE"
  compactView={false}
/>
```

### 4. DynamicVitalSignsTable
**Purpose**: Dynamic table for vital signs monitoring with add/remove entries.

**Features**:
- Add/remove time entries dynamically
- A/V/P/U radio buttons for Level of Consciousness
- Split B/P inputs (systolic/diastolic)
- Pulse with Regular/Irregular and Strong/Weak options
- Respiration quality checkboxes (shallow, deep, labored, normal)
- SpO2 and Temperature inputs
- Treatment notes dialog for each entry
- Trend indicators showing vital sign changes
- Abnormal value highlighting
- Compact mode for space-constrained layouts

**Usage**:
```tsx
<DynamicVitalSignsTable
  control={control}
  name="vitalSigns"
  compact={false}
/>
```

### 5. TreatmentChecklist
**Purpose**: Comprehensive treatment tracking with organized categories and timestamps.

**Features**:
- Organized sections (Airway, Breathing, Circulation, Medications, Procedures, Immobilization, Other)
- Automatic timestamp capture for critical interventions
- O2 flow rate input with special handling
- Progress tracking per category and overall
- Critical treatment identification and alerts
- Expandable/collapsible categories
- Time dialog for manual timestamp entry
- Treatment summary statistics

**Usage**:
```tsx
<TreatmentChecklist
  control={control}
  name="treatmentProvided"
  compact={false}
/>
```

### 6. PatientRefusalSignature
**Purpose**: Digital signature capture for patient refusal of care with legal compliance.

**Features**:
- Canvas-based digital signature capture
- Complete legal refusal text
- Required compliance checkboxes
- Patient and witness signature areas
- Automatic date/time stamping
- Signature validation and clearing
- Print-ready legal format
- Warning indicators for incomplete documentation

**Usage**:
```tsx
<PatientRefusalSignature
  control={control}
  name="patientRefusal"
/>
```

## Integration with Main Form

All components are designed to integrate seamlessly with React Hook Form and the existing EPCR data structure:

```tsx
import { useForm } from 'react-hook-form';
import {
  GlasgowComaScaleCalculator,
  InteractiveBodyDiagram,
  PPETrackingGrid,
  DynamicVitalSignsTable,
  TreatmentChecklist,
  PatientRefusalSignature
} from './components/interactive';

function EPCRForm() {
  const { control } = useForm<EPCRData>();

  return (
    <form>
      <GlasgowComaScaleCalculator control={control} name="glasgowComaScale" />
      <InteractiveBodyDiagram control={control} name="bodyDiagramInjuries" />
      <PPETrackingGrid control={control} name="crewPPE" />
      <DynamicVitalSignsTable control={control} name="vitalSigns" />
      <TreatmentChecklist control={control} name="treatmentProvided" />
      <PatientRefusalSignature control={control} name="patientRefusal" />
    </form>
  );
}
```

## Print Compatibility

All components include print-specific styling:
- Removes shadows and modern UI elements
- Uses solid borders for print clarity
- Prevents page breaks within components
- Maintains layout integrity in PDF generation
- Preserves signature images and important data

## Responsive Design

Components adapt to different screen sizes:
- Desktop: Full feature set with optimal spacing
- Tablet: Condensed layouts with maintained functionality
- Mobile: Stacked layouts and touch-friendly interactions
- Compact modes available for space-constrained environments

## Data Export

All components store data in formats compatible with:
- JSON export for digital records
- PDF generation with proper formatting
- Database storage with normalized structure
- Form validation and error handling

## State Management

- Components use React Hook Form for state management
- Real-time validation and error display
- Automatic data persistence
- Clean integration with backend APIs
- Type-safe interfaces with TypeScript

## Accessibility

- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast color schemes
- Focus management for dialogs and interactions
- Semantic HTML structure

## Performance

- Optimized rendering with React.memo where appropriate
- Efficient state updates to prevent unnecessary re-renders
- Lazy loading for heavy components
- Debounced inputs for real-time calculations
- Minimal bundle impact with tree-shaking support