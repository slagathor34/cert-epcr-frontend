import React, { useState } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';

export const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTooltipToggle = () => {
    if (!open) {
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          '@media print': { display: 'none' },
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <Fade in={showTooltip && !open}>
          <Paper
            sx={{
              position: 'absolute',
              bottom: 70,
              right: 0,
              p: 1.5,
              backgroundColor: '#1e3a8a',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '100%',
                right: '16px',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #1e3a8a',
              },
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              Need help? Chat with us!
            </Typography>
          </Paper>
        </Fade>

        {/* Chat FAB */}
        <Zoom in timeout={300}>
          <Fab
            color="primary"
            onClick={handleOpen}
            onMouseEnter={handleTooltipToggle}
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <ChatIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Chat Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 100,
            right: 24,
            top: 'auto',
            left: 'auto',
            margin: 0,
            width: 350,
            maxWidth: 'calc(100vw - 48px)',
            height: 500,
            maxHeight: 'calc(100vh - 150px)',
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.25), 0 4px 6px -2px rgb(0 0 0 / 0.1)',
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                CERT Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                Sacramento Fire Department
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            backgroundColor: '#f8fafc',
          }}
        >
          {/* Bot Avatar */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          >
            <BotIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          {/* Coming Soon Message */}
          <Typography
            variant="h5"
            sx={{
              color: '#1e3a8a',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Coming Soon!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            Our AI-powered CERT Assistant will help you with:
          </Typography>

          {/* Feature List */}
          <Box sx={{ textAlign: 'left', width: '100%' }}>
            {[
              '📋 ePCR form guidance',
              '🩺 Medical protocol assistance',
              '📊 Report completion help',
              '🚑 Emergency procedures',
              '📞 Contact information',
            ].map((feature, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: '#374151',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                }}
              >
                {feature}
              </Typography>
            ))}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#9ca3af',
              mt: 3,
              fontStyle: 'italic',
            }}
          >
            Stay tuned for updates!
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};