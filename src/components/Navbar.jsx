import React from 'react';
import { AppBar, Toolbar, Box, Typography, Chip, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshTimer from './RefreshTimer';

const Navbar = ({ activeTab, onTabChange, onRefresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const tabs = [
    { key: 'leaderboard', label: '排行榜', icon: '🏆' },
    { key: 'news', label: '最新资讯', icon: '📰' },
    { key: 'models', label: '模型介绍', icon: '🤖' },
  ];

  const handleTabClick = (key) => {
    onTabChange(key);
    setDrawerOpen(false);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 163, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00a3ff 0%, #417dff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 163, 255, 0.4)',
              }}
            >
              <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00a3ff 0%, #417dff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.1rem',
                }}
              >
                AI 大模型排行榜
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                AI LLM Leaderboard
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flex: 1 }}>
            {tabs.map((tab) => (
              <Chip
                key={tab.key}
                icon={<span style={{ fontSize: '1rem' }}>{tab.icon}</span>}
                label={tab.label}
                onClick={() => handleTabClick(tab.key)}
                sx={{
                  px: 1,
                  height: 40,
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  background: activeTab === tab.key 
                    ? 'linear-gradient(135deg, rgba(0, 163, 255, 0.2) 0%, rgba(65, 125, 255, 0.2) 100%)'
                    : 'transparent',
                  border: activeTab === tab.key 
                    ? '1px solid rgba(0, 163, 255, 0.4)'
                    : '1px solid transparent',
                  color: activeTab === tab.key ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(0, 163, 255, 0.1)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                  },
                }}
              />
            ))}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              color: 'primary.main'
            }}
          >
            {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          {/* Refresh Timer */}
          <Box sx={{ display: { xs: 'none', lg: 'block' }, ml: 'auto' }}>
            <RefreshTimer onRefresh={onRefresh} />
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        {drawerOpen && (
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              py: 2,
              px: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {tabs.map((tab) => (
              <Box
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  mb: 0.5,
                  background: activeTab === tab.key 
                    ? 'linear-gradient(135deg, rgba(0, 163, 255, 0.15) 0%, rgba(65, 125, 255, 0.15) 100%)'
                    : 'transparent',
                  border: activeTab === tab.key 
                    ? '1px solid rgba(0, 163, 255, 0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                <Typography 
                  sx={{ 
                    color: activeTab === tab.key ? 'primary.main' : 'text.primary',
                    fontWeight: activeTab === tab.key ? 600 : 400,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2 }}>
              <RefreshTimer onRefresh={onRefresh} />
            </Box>
          </Box>
        )}
      </Container>
    </AppBar>
  );
};

export default Navbar;
