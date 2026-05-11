import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import useRefreshTimer from '../hooks/useRefreshTimer';

const RefreshTimer = ({ onRefresh }) => {
  const { formattedTime, progressPercent, lastUpdateDate, needsRefresh, triggerRefresh } = useRefreshTimer();

  const handleRefresh = () => {
    triggerRefresh();
    if (onRefresh) onRefresh();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1,
        borderRadius: 2,
        background: 'rgba(0, 163, 255, 0.08)',
        border: '1px solid rgba(0, 163, 255, 0.2)',
      }}
    >
      <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 18 }} />
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
          距下次刷新
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}
        >
          {formattedTime}
        </Typography>
      </Box>

      <Box sx={{ width: 60, display: { xs: 'none', sm: 'block' } }}>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00a3ff, #417dff)',
            },
          }}
        />
      </Box>

      <Tooltip title={needsRefresh ? "点击刷新数据" : "数据已是最新"}>
        <Box
          onClick={handleRefresh}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: needsRefresh ? 'primary.main' : 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            ...(needsRefresh && {
              animation: 'pulse-glow 2s ease-in-out infinite',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }),
          }}
        >
          <RefreshIcon 
            sx={{ 
              fontSize: 16, 
              color: needsRefresh ? '#fff' : 'text.secondary',
              transition: 'transform 0.3s ease',
              ...(needsRefresh && { transform: 'rotate(0deg)' })
            }} 
          />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default RefreshTimer;
