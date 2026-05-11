import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Leaderboard from './Leaderboard';
import NewsTimeline from './NewsTimeline';
import ModelCard from './ModelCard';
import ModelDetail from './ModelDetail';
import RefreshTimer from './RefreshTimer';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedModel, setSelectedModel] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setDetailOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard key={refreshKey} onModelClick={handleModelClick} />;
      case 'news':
        return <NewsTimeline key={refreshKey} />;
      case 'models':
        return <ModelCard key={refreshKey} />;
      default:
        return <Leaderboard key={refreshKey} onModelClick={handleModelClick} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '50vh',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 163, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50vh',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Navbar
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />

      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Mobile Refresh Timer */}
        <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
          <RefreshTimer onRefresh={handleRefresh} />
        </Box>

        {renderContent()}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            AI 大模型排行榜
          </Box>
          {' · '}数据每日零点自动更新{' · '}
          <Box component="span" sx={{ color: 'text.secondary' }}>
            2024-{new Date().getFullYear()}
          </Box>
        </Box>
      </Box>

      {/* Model Detail Modal */}
      <ModelDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        model={selectedModel}
      />
    </Box>
  );
};

export default Layout;
