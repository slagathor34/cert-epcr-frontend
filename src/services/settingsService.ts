interface AISettings {
  customPrompt?: string;
  useCustomPrompt: boolean;
  ollamaUrl?: string;
  modelName: string;
  temperature: number;
  topP: number;
  topK: number;
}

interface AppSettings {
  ai: AISettings;
}

const DEFAULT_AI_PROMPT = `You are a medical documentation assistant helping with Emergency Medical Services (EMS) record analysis for training and educational purposes. Please analyze the following patient care data and provide comprehensive clinical insights.

MEDICAL TRAINING SCENARIO:
Patient Demographics:
- Name: {patientName}
- Age: {patientAge}
- Gender: {patientGender}
- Chief Complaint: {chiefComplaint}

Vital Signs History:
{vitalSignsHistory}

Assessment: {primaryAssessment}
Treatments: {proceduresPerformed}

Please provide detailed educational clinical analysis in JSON format with comprehensive information:
{
  "clinicalSummary": "Comprehensive 3-4 sentence educational summary of patient presentation, vital signs interpretation, and care provided with clinical reasoning",
  "differentialDiagnosis": [
    {
      "diagnosis": "Primary diagnostic consideration with specific medical terminology",
      "rationale": "Detailed clinical reasoning explaining why this diagnosis fits the presentation, including vital signs and symptom correlation",
      "probability": "high/moderate/low",
      "supportingFindings": ["Specific vital signs", "Clinical presentation details", "Assessment findings"],
      "contraindications": ["Factors that may rule out this diagnosis"]
    },
    {
      "diagnosis": "Secondary diagnostic consideration",
      "rationale": "Alternative diagnostic reasoning with clinical justification",
      "probability": "moderate/low",
      "supportingFindings": ["Supporting clinical evidence"],
      "contraindications": ["Contradicting factors"]
    }
  ],
  "treatmentRecommendations": {
    "immediate": ["Specific immediate interventions with medical rationale", "Time-sensitive procedures", "Critical monitoring requirements"],
    "urgent": ["Priority follow-up care within hours", "Specialist consultations needed", "Additional diagnostic tests"],
    "routine": ["Standard documentation requirements", "Follow-up scheduling", "Patient education points", "Discharge planning considerations"]
  },
  "clinicalConcerns": [
    "Detailed monitoring points with specific parameters to watch",
    "Potential complications with early warning signs",
    "Red flag symptoms requiring immediate attention",
    "Ongoing assessment priorities for medical staff"
  ]
}

This is for EMS training and educational documentation purposes only. Provide detailed, educational content suitable for medical training scenarios.`;

const DEFAULT_SETTINGS: AppSettings = {
  ai: {
    useCustomPrompt: false,
    customPrompt: DEFAULT_AI_PROMPT,
    ollamaUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:11434' : 'http://192.168.1.35:11434',
    modelName: 'llama3.2:1b-instruct-q4_K_M',
    temperature: 0.7,
    topP: 0.9,
    topK: 40
  }
};

class SettingsService {
  private storageKey = 'cert_epcr_settings';

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const settings = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...settings,
          ai: {
            ...DEFAULT_SETTINGS.ai,
            ...settings.ai
          }
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: Partial<AppSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        ai: {
          ...currentSettings.ai,
          ...(settings.ai || {})
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  getAISettings(): AISettings {
    const settings = this.getSettings().ai;
    
    // Migrate old default model to new default
    if (settings.modelName === 'tinyllama:1.1b-chat-v0.6-q2_K') {
      settings.modelName = 'llama3.2:1b-instruct-q4_K_M';
      // Auto-save the updated settings without calling getAISettings again
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ai: {
          ...currentSettings.ai,
          modelName: 'llama3.2:1b-instruct-q4_K_M'
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
    }
    
    return settings;
  }

  saveAISettings(aiSettings: Partial<AISettings>): void {
    const currentAI = this.getAISettings();
    const updatedAI = { ...currentAI, ...aiSettings };
    this.saveSettings({ ai: updatedAI });
  }

  getDefaultPrompt(): string {
    return DEFAULT_AI_PROMPT;
  }

  resetAISettings(): void {
    this.saveSettings({ ai: DEFAULT_SETTINGS.ai });
  }

  interpolatePrompt(prompt: string, data: any): string {
    let interpolated = prompt;
    
    // Process vital signs data - include all measurements and trends
    let vitalSignsData = 'Not recorded';
    if (data.vitalSigns && data.vitalSigns.length > 0) {
      const vitalSignsSummary = data.vitalSigns.map((vital: any, index: number) => {
        const timePrefix = `[${vital.time || 'Unknown time'}]`;
        const measurements = [];
        
        if (vital.systolicBP && vital.diastolicBP) {
          measurements.push(`BP: ${vital.systolicBP}/${vital.diastolicBP} mmHg`);
        }
        if (vital.heartRate) {
          measurements.push(`HR: ${vital.heartRate} bpm${vital.pulseRegularity ? ` (${vital.pulseRegularity})` : ''}${vital.pulseStrength ? ` (${vital.pulseStrength})` : ''}`);
        }
        if (vital.respiratoryRate) {
          measurements.push(`RR: ${vital.respiratoryRate}/min${vital.respiratoryQuality ? ` (${vital.respiratoryQuality})` : ''}`);
        }
        if (vital.temperature) {
          measurements.push(`Temp: ${vital.temperature}°F`);
        }
        if (vital.oxygenSaturation) {
          measurements.push(`SpO2: ${vital.oxygenSaturation}%`);
        }
        if (vital.treatment) {
          measurements.push(`Treatment: ${vital.treatment}`);
        }
        if (vital.loc) {
          measurements.push(`Location: ${vital.loc}`);
        }

        return measurements.length > 0 
          ? `${timePrefix} ${measurements.join(', ')}`
          : `${timePrefix} No measurements recorded`;
      });

      vitalSignsData = `Multiple measurements recorded:\n${vitalSignsSummary.join('\n')}`;
      
      // Add trends if multiple vital signs exist
      if (data.vitalSigns.length > 1) {
        const first = data.vitalSigns[0];
        const latest = data.vitalSigns[data.vitalSigns.length - 1];
        const trends = [];
        
        if (first.systolicBP && latest.systolicBP) {
          const bpChange = latest.systolicBP - first.systolicBP;
          if (Math.abs(bpChange) > 10) {
            trends.push(`BP trend: ${bpChange > 0 ? 'increasing' : 'decreasing'} (${Math.abs(bpChange)} mmHg change)`);
          }
        }
        
        if (first.heartRate && latest.heartRate) {
          const hrChange = latest.heartRate - first.heartRate;
          if (Math.abs(hrChange) > 10) {
            trends.push(`HR trend: ${hrChange > 0 ? 'increasing' : 'decreasing'} (${Math.abs(hrChange)} bpm change)`);
          }
        }
        
        if (trends.length > 0) {
          vitalSignsData += `\nTrends observed: ${trends.join(', ')}`;
        }
      }
    }

    
    // Build procedures list from treatmentProvided
    const procedures: string[] = [];
    if (data.treatmentProvided) {
      Object.entries(data.treatmentProvided).forEach(([category, treatments]: [string, any]) => {
        if (treatments && typeof treatments === 'object') {
          Object.entries(treatments).forEach(([treatment, performed]: [string, any]) => {
            if (performed === true) {
              procedures.push(`${category}: ${treatment}`);
            }
          });
        }
      });
    }
    
    // Replace placeholders with actual ePCR data structure
    const replacements: { [key: string]: string } = {
      '{patientName}': `${data.patientDemographics?.firstName || 'Not provided'} ${data.patientDemographics?.lastName || 'Not provided'}`,
      '{patientAge}': data.patientDemographics?.age?.toString() || 'Not provided',
      '{patientGender}': data.patientDemographics?.gender || 'Not provided',
      '{chiefComplaint}': data.medicalHistory?.chiefComplaint || 'Not provided',
      '{vitalSignsHistory}': vitalSignsData,
      '{primaryAssessment}': data.physicalAssessment?.primaryImpression || data.medicalHistory?.diagnosis || 'Assessment pending',
      '{proceduresPerformed}': procedures.length > 0 ? procedures.join(', ') : 'None documented'
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      interpolated = interpolated.replace(new RegExp(placeholder, 'g'), value);
    });

    return interpolated;
  }
}

export const settingsService = new SettingsService();
export { DEFAULT_AI_PROMPT };
export type { AISettings, AppSettings };