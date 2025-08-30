import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { aiService, ChatConversation, AIResponse } from '../../services/aiService';

interface ChatInterfaceProps {
  onOpenSettings?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onOpenSettings }) => {
  const [conversation, setConversation] = useState<ChatConversation>(() => 
    aiService.createConversation('CERT Assistant Chat')
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (conversation.messages.length === 0) {
      const welcomeMessage = aiService.createMessage(
        'assistant',
        'Hello! I\'m your CERT Assistant. I can help you with:\n\n• ePCR form guidance\n• Medical protocol assistance\n• Report completion help\n• Emergency procedures\n• Contact information\n\nHow can I assist you today?'
      );
      setConversation(prev => ({
        ...prev,
        messages: [welcomeMessage],
        updatedAt: new Date(),
      }));
    }
  }, [conversation.messages.length]);

  // Save conversation when it changes
  useEffect(() => {
    if (conversation.messages.length > 0) {
      aiService.saveConversation(conversation);
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = aiService.createMessage('user', input.trim());
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      updatedAt: new Date(),
    };

    setConversation(updatedConversation);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Refresh AI service configuration in case settings were updated
      aiService.refreshConfig();

      // Check if AI is enabled
      if (!aiService.isEnabled()) {
        const errorMessage = aiService.createMessage(
          'assistant',
          'AI service is not enabled. Please configure AI providers in System Settings to use the chat assistant.'
        );
        setConversation(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          updatedAt: new Date(),
        }));
        setIsLoading(false);
        return;
      }

      // Prepare messages for AI request (limit to last 10 messages for context)
      const recentMessages = updatedConversation.messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      // Add system context for CERT assistant
      const systemMessage = {
        role: 'system' as const,
        content: `You are a CERT (Community Emergency Response Team) Assistant for the Sacramento Fire Department. You help with:
- ePCR (Electronic Patient Care Report) form guidance
- Medical protocol assistance
- Report completion help
- Emergency procedures
- Contact information
- CERT training and certification questions

Be professional, accurate, and helpful. If you're unsure about medical procedures, always recommend consulting with medical professionals or following official protocols.`
      };

      const aiRequest = {
        messages: [systemMessage, ...recentMessages],
        temperature: 0.7,
        maxTokens: 1000,
      };

      // Send request to AI service
      const response: AIResponse = await aiService.sendMessage(aiRequest);

      if (response.success && response.content) {
        const assistantMessage = aiService.createMessage(
          'assistant',
          response.content,
          response.provider,
          response.model
        );

        setConversation(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          updatedAt: new Date(),
        }));
      } else {
        const errorMessage = aiService.createMessage(
          'assistant',
          response.error || 'Sorry, I encountered an error. Please try again or check your AI configuration in System Settings.'
        );
        setConversation(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          updatedAt: new Date(),
        }));
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = aiService.createMessage(
        'assistant',
        'Sorry, I encountered an unexpected error. Please try again later.'
      );
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        updatedAt: new Date(),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getAIStatus = () => {
    const config = aiService.getConfig();
    const provider = aiService.getPrimaryProvider();
    
    if (!config?.enabled) {
      return { status: 'disabled', text: 'AI Disabled', color: 'error' as const };
    }
    
    if (!provider) {
      return { status: 'no-provider', text: 'No Active Provider', color: 'warning' as const };
    }
    
    return { 
      status: 'active', 
      text: `${provider.name.charAt(0).toUpperCase() + provider.name.slice(1)} Active`, 
      color: 'success' as const 
    };
  };

  const aiStatus = getAIStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            size="small"
            label={aiStatus.text}
            color={aiStatus.color}
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
        <IconButton
          size="small"
          onClick={onOpenSettings}
          sx={{ color: '#6b7280' }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {conversation.messages.map((message, index) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: message.role === 'user' ? '#3b82f6' : '#1e3a8a',
                fontSize: '0.8rem',
              }}
            >
              {message.role === 'user' ? <UserIcon fontSize="small" /> : <BotIcon fontSize="small" />}
            </Avatar>

            {/* Message bubble */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '75%',
                backgroundColor: message.role === 'user' ? '#3b82f6' : 'white',
                color: message.role === 'user' ? 'white' : 'black',
                borderRadius: 2,
                ...(message.role === 'user' && {
                  borderBottomRightRadius: 4,
                }),
                ...(message.role === 'assistant' && {
                  borderBottomLeftRadius: 4,
                }),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {formatMessage(message.content)}
              </Typography>

              {/* Provider info for assistant messages */}
              {message.role === 'assistant' && message.provider && (
                <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e5e7eb' }}>
                  <Typography variant="caption" color="text.secondary">
                    {message.provider}
                    {message.model && ` • ${message.model}`}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#1e3a8a',
              }}
            >
              <BotIcon fontSize="small" />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                borderBottomLeftRadius: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ m: 2, mb: 0 }}>
          {error}
        </Alert>
      )}

      {/* Input */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            variant="outlined"
            placeholder="Ask me about ePCR forms, protocols, procedures..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                color: 'black',
                '& input': {
                  color: 'black',
                },
                '& textarea': {
                  color: 'black',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#6b7280',
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            sx={{
              bgcolor: '#3b82f6',
              color: 'white',
              '&:hover': {
                bgcolor: '#2563eb',
              },
              '&.Mui-disabled': {
                bgcolor: '#9ca3af',
                color: 'white',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Character count or hint */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block' }}
        >
          {aiStatus.status === 'disabled' 
            ? 'Configure AI in System Settings to enable chat'
            : 'Press Enter to send, Shift+Enter for new line'
          }
        </Typography>
      </Box>
    </Box>
  );
};