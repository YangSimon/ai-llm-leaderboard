import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { newsData, newsCategories } from '../data/news';
import NewsDetail from './NewsDetail';
import { formatDate } from '../utils/timeUtils';

const CATEGORY_COLORS = {
  '产品发布': '#10b981',
  '技术突破': '#f59e0b',
  '开源发布': '#8b5cf6',
  '行业动态': '#00a3ff',
  '行业应用': '#ec4899',
  '行业报告': '#06b6d4',
};

const getCategoryColor = (category) => CATEGORY_COLORS[category] || '#6b7280';

const NewsTimeline = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'all') {
      return newsData;
    }
    return newsData.filter(news => news.category === selectedCategory);
  }, [selectedCategory]);

  const handleNewsClick = (news) => {
    setSelectedNews(news);
    setDetailOpen(true);
  };

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
          AI 大模型最新资讯
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          追踪最新 AI 技术动态，了解行业前沿发展
        </Typography>
      </Box>

      {/* Category Filter */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          background: 'rgba(15, 15, 25, 0.8)',
          borderRadius: 3,
          border: '1px solid rgba(0, 163, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            分类筛选：
          </Typography>
          {newsCategories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              onClick={() => setSelectedCategory(cat.key)}
              sx={{
                background: selectedCategory === cat.key 
                  ? 'linear-gradient(135deg, rgba(0, 163, 255, 0.2) 0%, rgba(65, 125, 255, 0.2) 100%)'
                  : 'transparent',
                border: selectedCategory === cat.key 
                  ? '1px solid rgba(0, 163, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === cat.key ? 'primary.main' : 'text.secondary',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(0, 163, 255, 0.1)',
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* News Cards for Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
        {filteredNews.map((news) => (
          <Card
            key={news.id}
            onClick={() => handleNewsClick(news)}
            sx={{
              mb: 2,
              background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
              border: '1px solid rgba(0, 163, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                border: '1px solid rgba(0, 163, 255, 0.3)',
              },
            }}
          >
            <CardActionArea>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography sx={{ fontSize: '2rem' }}>{news.image}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                      {news.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {(news.summary || '').substring(0, 80)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={news.category}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          background: `${getCategoryColor(news.category)}20`,
                          color: getCategoryColor(news.category),
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                        {formatDate(news.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Timeline for Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Timeline position="alternate" sx={{ px: 0 }}>
          {filteredNews.map((news, index) => (
            <TimelineItem key={news.id}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    background: `linear-gradient(135deg, ${getCategoryColor(news.category)} 0%, ${getCategoryColor(news.category)}88 100%)`,
                    boxShadow: `0 0 15px ${getCategoryColor(news.category)}66`,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  {news.image}
                </TimelineDot>
                {index < filteredNews.length - 1 && (
                  <TimelineConnector 
                    sx={{ 
                      background: 'linear-gradient(180deg, rgba(0, 163, 255, 0.5) 0%, rgba(65, 125, 255, 0.1) 100%)',
                    }} 
                  />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  onClick={() => handleNewsClick(news)}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
                    border: '1px solid rgba(0, 163, 255, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    maxWidth: 700,
                    '&:hover': {
                      transform: 'translateX(8px)',
                      border: '1px solid rgba(0, 163, 255, 0.3)',
                      boxShadow: '0 4px 20px rgba(0, 163, 255, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                      {news.title}
                    </Typography>
                    <Chip
                      label={news.category}
                      size="small"
                      sx={{
                        ml: 2,
                        height: 24,
                        fontSize: '0.75rem',
                        background: `${getCategoryColor(news.category)}20`,
                        color: getCategoryColor(news.category),
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {news.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        来源: {news.source}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 14 }} />
                      {formatDate(news.date)}
                    </Typography>
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>

      {/* News Detail Dialog */}
      <NewsDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        news={selectedNews}
      />
    </Box>
  );
};

export default NewsTimeline;
