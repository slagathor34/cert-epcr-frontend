import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle: React.FC = () => {
  const currentTheme = typeof window !== 'undefined' 
    ? document.documentElement.getAttribute('data-theme') || 'light'
    : 'light';

  const handleToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('themeMode', newTheme);
    window.location.reload();
  };

  return (
    <Tooltip title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={handleToggle}
        color="inherit"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          mx: 1,
          minWidth: '40px',
          minHeight: '40px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {currentTheme === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;