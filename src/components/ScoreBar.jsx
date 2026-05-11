import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';

const ScoreBar = ({ label, score, color = '#00a3ff', showLabel = true, height = 8 }) => {
  const safeScore = typeof score === 'number' ? Math.min(100, Math.max(0, score)) : 0;
  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {label}
          </Typography>
          <Tooltip title={`${safeScore}/100`} placement="top">
            <Typography 
              variant="caption" 
              sx={{ 
                color: color, 
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {safeScore}
            </Typography>
          </Tooltip>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={safeScore}
        sx={{
          height: height,
          borderRadius: height / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
            background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}66`,
          },
        }}
      />
    </Box>
  );
};

export default ScoreBar;
