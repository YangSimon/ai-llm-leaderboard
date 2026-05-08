import React, { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import LeaderboardTable from './LeaderboardTable';
import { globalModels, nonChinaModels, chinaModels } from '../data/leaderboard';

const Leaderboard = ({ onModelClick }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'overallScore', direction: 'desc' });

  const tabData = [
    { label: '全球大语言模型', data: globalModels },
    { label: '国外', data: nonChinaModels },
    { label: '国内', data: chinaModels },
  ];

  const currentData = tabData[activeTab].data;

  const sortedData = useMemo(() => {
    const sorted = [...currentData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
    return sorted;
  }, [currentData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const topModels = useMemo(() => {
    return sortedData.slice(0, 3);
  }, [sortedData]);

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #00a3ff 0%, #417dff 50%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AI 大模型排行榜
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          基于推理、编程、数学、多模态等多维度能力综合评估
        </Typography>
      </Box>

      {/* Top 3 Highlight */}
      <Box sx={{ display: { xs: 'none', lg: 'block' }, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {topModels.map((model, index) => (
            <Paper
              key={model.id}
              onClick={() => onModelClick(model)}
              sx={{
                p: 2,
                width: 280,
                background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
                border: index === 0 
                  ? '2px solid rgba(255, 215, 0, 0.5)' 
                  : index === 1 
                    ? '2px solid rgba(192, 192, 192, 0.4)'
                    : '2px solid rgba(205, 127, 50, 0.4)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: index === 0 
                    ? '0 8px 30px rgba(255, 215, 0, 0.2)' 
                    : '0 8px 30px rgba(0, 163, 255, 0.2)',
                },
                '&::before': index === 0 ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                } : {},
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{ fontSize: '2.5rem' }}>{model.logo}</Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    #{index + 1} {model.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {model.company}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  综合评分
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 800,
                    color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                  }}
                >
                  {model.overallScore}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          background: 'rgba(15, 15, 25, 0.8)',
          borderRadius: 3,
          border: '1px solid rgba(0, 163, 255, 0.1)',
          mb: 3,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            '& .MuiTab-root': {
              py: 2,
              px: 3,
              fontWeight: 500,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #00a3ff, #417dff)',
              height: 3,
            },
          }}
        >
          {tabData.map((tab, index) => (
            <Tab 
              key={index} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tab.label}</span>
                  <Chip 
                    label={tab.data.length} 
                    size="small"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem',
                      background: activeTab === index 
                        ? 'rgba(0, 163, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                    }} 
                  />
                </Box>
              } 
            />
          ))}
        </Tabs>
      </Paper>

      {/* Table */}
      <Box sx={{ 
        overflowX: 'auto',
        borderRadius: 3,
        border: '1px solid rgba(0, 163, 255, 0.1)',
        background: 'rgba(15, 15, 25, 0.6)',
      }}>
        <LeaderboardTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={handleSort}
          onModelClick={onModelClick}
        />
      </Box>
    </Box>
  );
};

export default Leaderboard;
