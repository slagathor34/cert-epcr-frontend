import { AIConfig, AIProviderConfig } from '../pages/SystemSettings';

// Types for chat functionality
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  tokens?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  provider?: string;
  model?: string;
  tokens?: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Storage keys
const STORAGE_KEYS = {
  AI_CONFIG: 'epcr_ai_config',
  CHAT_CONVERSATIONS: 'epcr_chat_conversations',
  CHAT_SETTINGS: 'epcr_chat_settings',
};

// AI Service Class
export class AIService {
  private static instance: AIService;
  private config: AIConfig | null = null;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Load AI configuration from localStorage
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load AI configuration:', error);
      this.config = null;
    }
  }

  // Refresh configuration (call when settings are updated)
  public refreshConfig(): void {
    this.loadConfig();
  }

  // Get current AI configuration
  public getConfig(): AIConfig | null {
    return this.config;
  }

  // Check if AI is enabled and configured
  public isEnabled(): boolean {
    return this.config?.enabled === true;
  }

  // Get the primary provider configuration
  public getPrimaryProvider(): { name: string; config: AIProviderConfig } | null {
    if (!this.config || !this.config.enabled) {
      return null;
    }

    const primaryName = this.config.primaryProvider;
    const primaryConfig = this.config.providers[primaryName as keyof typeof this.config.providers];

    if (!primaryConfig || !primaryConfig.enabled) {
      return null;
    }

    return {
      name: primaryName,
      config: primaryConfig,
    };
  }

  // Get fallback provider if primary fails
  public getFallbackProvider(): { name: string; config: AIProviderConfig } | null {
    if (!this.config || !this.config.enabled || !this.config.fallbackEnabled) {
      return null;
    }

    const fallbackName = this.config.fallbackProvider;
    const fallbackConfig = this.config.providers[fallbackName as keyof typeof this.config.providers];

    if (!fallbackConfig || !fallbackConfig.enabled) {
      return null;
    }

    return {
      name: fallbackName,
      config: fallbackConfig,
    };
  }

  // Make a request to the AI provider
  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'AI service is not enabled. Please configure AI providers in System Settings.',
      };
    }

    const provider = this.getPrimaryProvider();
    if (!provider) {
      return {
        success: false,
        error: 'No active AI provider found. Please configure AI providers in System Settings.',
      };
    }

    try {
      // Try primary provider first
      const response = await this.makeRequest(provider, request);
      if (response.success) {
        return response;
      }

      // If primary fails and fallback is enabled, try fallback
      const fallbackProvider = this.getFallbackProvider();
      if (fallbackProvider) {
        console.warn(`Primary provider ${provider.name} failed, trying fallback ${fallbackProvider.name}`);
        return await this.makeRequest(fallbackProvider, request);
      }

      return response;
    } catch (error) {
      console.error('AI request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Make request to specific provider
  private async makeRequest(
    provider: { name: string; config: AIProviderConfig },
    request: AIRequest
  ): Promise<AIResponse> {
    const { name, config } = provider;

    switch (name) {
      case 'ollama':
        return await this.makeOllamaRequest(config, request);
      case 'openai':
        return await this.makeOpenAIRequest(config, request);
      case 'anthropic':
        return await this.makeAnthropicRequest(config, request);
      case 'azure':
        return await this.makeAzureRequest(config, request);
      case 'custom':
        return await this.makeCustomRequest(config, request);
      default:
        return {
          success: false,
          error: `Unsupported provider: ${name}`,
        };
    }
  }

  // Ollama provider implementation
  private async makeOllamaRequest(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
    if (!config.baseUrl) {
      return { success: false, error: 'Nebula base URL not configured' };
    }

    const model = request.model || config.defaultModel || config.model || 'tinyllama:1.1b-chat-v0.6-q2_K';
    const url = `${config.baseUrl}/api/chat`;

    const body = {
      model: model,
      messages: request.messages,
      options: {
        temperature: request.temperature || config.temperature || 0.7,
        num_predict: request.maxTokens || config.maxTokens || 4096,
      },
      stream: false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeout || 30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        content: data.message?.content || 'No content received',
        provider: 'ollama',
        model: model,
      };
    } catch (error) {
      return {
        success: false,
        error: `Nebula request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider: 'ollama',
      };
    }
  }

  // OpenAI provider implementation
  private async makeOpenAIRequest(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
    if (!config.apiKey) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    const model = request.model || config.model || 'gpt-4o';
    const url = `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`;

    const body = {
      model: model,
      messages: request.messages,
      temperature: request.temperature || config.temperature || 0.7,
      max_tokens: request.maxTokens || config.maxTokens || 4096,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        content: data.choices?.[0]?.message?.content || 'No content received',
        provider: 'openai',
        model: model,
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: `OpenAI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider: 'openai',
      };
    }
  }

  // Anthropic provider implementation
  private async makeAnthropicRequest(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
    if (!config.apiKey) {
      return { success: false, error: 'Anthropic API key not configured' };
    }

    const model = request.model || config.model || 'claude-3-5-sonnet-20241022';
    const url = 'https://api.anthropic.com/v1/messages';

    // Convert messages format for Anthropic
    const systemMessage = request.messages.find(m => m.role === 'system');
    const userMessages = request.messages.filter(m => m.role !== 'system');

    const body = {
      model: model,
      max_tokens: request.maxTokens || config.maxTokens || 4096,
      temperature: request.temperature || config.temperature || 0.7,
      system: systemMessage?.content,
      messages: userMessages,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        content: data.content?.[0]?.text || 'No content received',
        provider: 'anthropic',
        model: model,
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: `Anthropic request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider: 'anthropic',
      };
    }
  }

  // Azure OpenAI provider implementation
  private async makeAzureRequest(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
    if (!config.apiKey || !config.endpoint || !config.deploymentName) {
      return { success: false, error: 'Azure OpenAI configuration incomplete' };
    }

    const url = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=2023-12-01-preview`;

    const body = {
      messages: request.messages,
      temperature: request.temperature || config.temperature || 0.7,
      max_tokens: request.maxTokens || config.maxTokens || 4096,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        content: data.choices?.[0]?.message?.content || 'No content received',
        provider: 'azure',
        model: config.deploymentName,
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: `Azure request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider: 'azure',
      };
    }
  }

  // Custom provider implementation
  private async makeCustomRequest(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
    if (!config.baseUrl) {
      return { success: false, error: 'Custom provider base URL not configured' };
    }

    let body: any;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if provided
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    // Format request based on the specified format
    switch (config.requestFormat) {
      case 'anthropic':
        const systemMessage = request.messages.find(m => m.role === 'system');
        const userMessages = request.messages.filter(m => m.role !== 'system');
        body = {
          model: request.model || 'claude-3-5-sonnet-20241022',
          max_tokens: request.maxTokens || config.maxTokens || 4096,
          temperature: request.temperature || config.temperature || 0.7,
          system: systemMessage?.content,
          messages: userMessages,
        };
        break;
      case 'openai':
      default:
        body = {
          model: request.model || 'gpt-4o',
          messages: request.messages,
          temperature: request.temperature || config.temperature || 0.7,
          max_tokens: request.maxTokens || config.maxTokens || 4096,
        };
        break;
    }

    try {
      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Try to extract content from various response formats
      let content = '';
      if (data.choices?.[0]?.message?.content) {
        content = data.choices[0].message.content;
      } else if (data.content?.[0]?.text) {
        content = data.content[0].text;
      } else if (data.message?.content) {
        content = data.message.content;
      } else if (typeof data.content === 'string') {
        content = data.content;
      } else {
        content = 'No content received';
      }

      return {
        success: true,
        content,
        provider: 'custom',
        model: request.model || config.name || 'unknown',
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: `Custom provider request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider: 'custom',
      };
    }
  }

  // Chat conversation management
  public saveConversation(conversation: ChatConversation): void {
    try {
      const conversations = this.getConversations();
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }

      localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  public getConversations(): ChatConversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
    return [];
  }

  public deleteConversation(conversationId: string): void {
    try {
      const conversations = this.getConversations();
      const filtered = conversations.filter(c => c.id !== conversationId);
      localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }

  // Generate a unique ID
  public generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Create a new message
  public createMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
    provider?: string,
    model?: string
  ): ChatMessage {
    return {
      id: this.generateId(),
      role,
      content,
      timestamp: new Date(),
      provider,
      model,
    };
  }

  // Create a new conversation
  public createConversation(title: string = 'New Conversation'): ChatConversation {
    return {
      id: this.generateId(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();