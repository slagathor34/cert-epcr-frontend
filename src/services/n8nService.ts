import { N8nConfig } from '../pages/SystemSettings';

// Types for n8n workflow management
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  nodes: N8nNode[];
  connections: Record<string, any>;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: 'manual' | 'trigger' | 'webhook' | 'retry';
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'waiting';
  startedAt: string;
  finishedAt?: string;
  data?: Record<string, any>;
}

export interface N8nWebhookTrigger {
  id: string;
  workflowId: string;
  webhookId: string;
  httpMethod: string;
  path: string;
  isTest?: boolean;
}

export interface N8nApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Storage keys
const STORAGE_KEYS = {
  N8N_CONFIG: 'epcr_n8n_config',
  N8N_WORKFLOWS: 'epcr_n8n_workflows',
  N8N_EXECUTIONS: 'epcr_n8n_executions',
};

// N8n Service Class
export class N8nService {
  private static instance: N8nService;
  private config: N8nConfig | null = null;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }

  // Load n8n configuration from localStorage
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.N8N_CONFIG);
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load n8n configuration:', error);
      this.config = null;
    }
  }

  // Refresh configuration (call when settings are updated)
  public refreshConfig(): void {
    this.loadConfig();
  }

  // Get current n8n configuration
  public getConfig(): N8nConfig | null {
    return this.config;
  }

  // Check if n8n is enabled and configured
  public isEnabled(): boolean {
    return this.config?.enabled === true && !!this.config?.baseUrl;
  }

  // Get API headers for n8n requests
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.config?.apiKey) {
      headers['X-N8N-API-KEY'] = this.config.apiKey;
    }

    return headers;
  }

  // Test n8n connection
  public async testConnection(): Promise<N8nApiResponse> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled or configured',
      };
    }

    try {
      // Use simple fetch with minimal configuration to avoid CORS issues
      const response = await fetch(`${this.config!.baseUrl}/healthz`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `n8n connection successful (Status: ${data.status || 'ok'})`,
          data,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('n8n connection test failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'CORS restriction detected. n8n may be running but blocked by browser security. Try clicking "Open n8n Editor" to verify manually.';
        } else if (error.message.includes('AbortError')) {
          errorMessage = 'Connection timeout - n8n took too long to respond';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: `Connection test failed: ${errorMessage}`,
      };
    }
  }

  // Alternative connection test that doesn't use fetch (for CORS workaround)
  public getManualTestUrl(): string {
    return this.config?.baseUrl ? `${this.config.baseUrl}/healthz` : '';
  }

  // Check if n8n editor is accessible
  public getEditorUrl(): string {
    return this.config?.baseUrl || '';
  }

  // Get all workflows
  public async getWorkflows(): Promise<N8nApiResponse<N8nWorkflow[]>> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled',
      };
    }

    try {
      const response = await fetch(`${this.config!.baseUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const workflows = await response.json();
        return {
          success: true,
          data: workflows.data || workflows,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch workflows: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Get workflow by ID
  public async getWorkflow(workflowId: string): Promise<N8nApiResponse<N8nWorkflow>> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled',
      };
    }

    try {
      const response = await fetch(`${this.config!.baseUrl}/api/v1/workflows/${workflowId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const workflow = await response.json();
        return {
          success: true,
          data: workflow,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Execute workflow
  public async executeWorkflow(workflowId: string, data?: Record<string, any>): Promise<N8nApiResponse<N8nExecution>> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled',
      };
    }

    try {
      const response = await fetch(`${this.config!.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data || {}),
      });

      if (response.ok) {
        const execution = await response.json();
        return {
          success: true,
          data: execution,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Trigger webhook
  public async triggerWebhook(webhookPath: string, data: Record<string, any>, method: string = 'POST'): Promise<N8nApiResponse> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled',
      };
    }

    try {
      const webhookUrl = `${this.config!.webhookUrl}/${webhookPath}`;
      const response = await fetch(webhookUrl, {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        let responseData;
        try {
          responseData = await response.json();
        } catch {
          responseData = await response.text();
        }

        return {
          success: true,
          data: responseData,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: `Webhook trigger failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Get executions for a workflow
  public async getExecutions(workflowId?: string, limit: number = 20): Promise<N8nApiResponse<N8nExecution[]>> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'n8n service is not enabled',
      };
    }

    try {
      const params = new URLSearchParams();
      if (workflowId) params.append('workflowId', workflowId);
      params.append('limit', limit.toString());

      const response = await fetch(`${this.config!.baseUrl}/api/v1/executions?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const executions = await response.json();
        return {
          success: true,
          data: executions.data || executions,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch executions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Helper methods for ePCR system integration
  public async triggerEpcrSubmitted(epcrData: Record<string, any>): Promise<N8nApiResponse> {
    if (!this.config?.defaultWorkflows.epcrSubmitted) {
      return {
        success: false,
        error: 'ePCR submitted workflow is not enabled',
      };
    }

    return this.triggerWebhook('epcr-submitted', {
      eventType: 'epcr_submitted',
      timestamp: new Date().toISOString(),
      data: epcrData,
    });
  }

  public async triggerMemberAdded(memberData: Record<string, any>): Promise<N8nApiResponse> {
    if (!this.config?.defaultWorkflows.memberAdded) {
      return {
        success: false,
        error: 'Member added workflow is not enabled',
      };
    }

    return this.triggerWebhook('member-added', {
      eventType: 'member_added',
      timestamp: new Date().toISOString(),
      data: memberData,
    });
  }

  public async triggerEmergencyAlert(alertData: Record<string, any>): Promise<N8nApiResponse> {
    if (!this.config?.defaultWorkflows.emergencyAlert) {
      return {
        success: false,
        error: 'Emergency alert workflow is not enabled',
      };
    }

    return this.triggerWebhook('emergency-alert', {
      eventType: 'emergency_alert',
      timestamp: new Date().toISOString(),
      data: alertData,
    });
  }

  public async triggerAuditLog(auditData: Record<string, any>): Promise<N8nApiResponse> {
    if (!this.config?.defaultWorkflows.auditTrigger) {
      return {
        success: false,
        error: 'Audit trigger workflow is not enabled',
      };
    }

    return this.triggerWebhook('audit-trigger', {
      eventType: 'audit_log',
      timestamp: new Date().toISOString(),
      data: auditData,
    });
  }

  // Create default workflows (would be called during setup)
  public async createDefaultWorkflows(): Promise<N8nApiResponse[]> {
    if (!this.isEnabled()) {
      return [{
        success: false,
        error: 'n8n service is not enabled',
      }];
    }

    const workflows = [
      {
        name: 'ePCR Submitted Notification',
        nodes: this.createEpcrSubmittedWorkflow(),
      },
      {
        name: 'Member Added Notification', 
        nodes: this.createMemberAddedWorkflow(),
      },
      {
        name: 'Emergency Alert Workflow',
        nodes: this.createEmergencyAlertWorkflow(),
      },
      {
        name: 'Audit Log Trigger',
        nodes: this.createAuditLogWorkflow(),
      },
    ];

    const results: N8nApiResponse[] = [];

    for (const workflow of workflows) {
      try {
        const response = await fetch(`${this.config!.baseUrl}/api/v1/workflows`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(workflow),
        });

        if (response.ok) {
          const created = await response.json();
          results.push({
            success: true,
            data: created,
          });
        } else {
          results.push({
            success: false,
            error: `Failed to create ${workflow.name}`,
          });
        }
      } catch (error) {
        results.push({
          success: false,
          error: `Error creating ${workflow.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    return results;
  }

  // Workflow templates
  private createEpcrSubmittedWorkflow(): N8nNode[] {
    return [
      {
        id: 'webhook-trigger',
        name: 'ePCR Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: 'POST',
          path: 'epcr-submitted',
        },
      },
      {
        id: 'email-notification',
        name: 'Email Notification',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          subject: 'New ePCR Submitted',
          text: 'A new ePCR has been submitted and requires review.',
          toEmail: 'admin@sacramento.cert',
        },
      },
    ];
  }

  private createMemberAddedWorkflow(): N8nNode[] {
    return [
      {
        id: 'webhook-trigger',
        name: 'Member Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: 'POST',
          path: 'member-added',
        },
      },
      {
        id: 'welcome-email',
        name: 'Welcome Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          subject: 'Welcome to Sacramento Fire CERT',
          text: 'Welcome to our CERT team! We\'re glad to have you.',
        },
      },
    ];
  }

  private createEmergencyAlertWorkflow(): N8nNode[] {
    return [
      {
        id: 'webhook-trigger',
        name: 'Emergency Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: 'POST',
          path: 'emergency-alert',
        },
      },
      {
        id: 'sms-alert',
        name: 'SMS Alert',
        type: 'n8n-nodes-base.twilioSms',
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          message: 'EMERGENCY ALERT: Immediate response required.',
        },
      },
    ];
  }

  private createAuditLogWorkflow(): N8nNode[] {
    return [
      {
        id: 'webhook-trigger',
        name: 'Audit Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: 'POST',
          path: 'audit-trigger',
        },
      },
      {
        id: 'log-storage',
        name: 'Store Audit Log',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          method: 'POST',
          url: 'http://epcr-backend:5000/api/audit-logs',
        },
      },
    ];
  }
}

// Export singleton instance
export const n8nService = N8nService.getInstance();