import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  InputBase,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { globalModels, chinaModels } from '../data/leaderboard';
import ScoreBar from './ScoreBar';
import ModelDetail from './ModelDetail';

const ModelCard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const allModels = [...globalModels, ...chinaModels].filter(
    (model, index, self) => index === self.findIndex((m) => m.id === model.id)
  );

  const filteredModels = allModels.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setDetailOpen(true);
  };

  const getTopTags = () => {
    const tagCounts = {};
    allModels.forEach((model) => {
      model.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  const topTags = getTopTags();

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
          AI 模型能力介绍
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          了解各大人工智能模型的核心能力与适用场景
        </Typography>
      </Box>

      {/* Search */}
      <Box 
        sx={{ 
          mb: 4, 
          p: 2, 
          borderRadius: 3, 
          background: 'rgba(15, 15, 25, 0.8)',
          border: '1px solid rgba(0, 163, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="搜索模型名称、公司或能力标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, color: 'text.primary' }}
          />
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1, alignSelf: 'center' }}>
            热门标签:
          </Typography>
          {topTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onClick={() => setSearchQuery(tag)}
              sx={{
                height: 24,
                fontSize: '0.75rem',
                cursor: 'pointer',
                background: searchQuery === tag 
                  ? 'rgba(0, 163, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: searchQuery === tag 
                  ? '1px solid rgba(0, 163, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: searchQuery === tag ? 'primary.main' : 'text.secondary',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Model Cards Grid */}
      <Grid container spacing={3}>
        {filteredModels.map((model) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
                border: '1px solid rgba(0, 163, 255, 0.1)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  border: '1px solid rgba(0, 163, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 163, 255, 0.15)',
                },
              }}
            >
              <CardActionArea 
                onClick={() => handleModelClick(model)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography sx={{ fontSize: '2.5rem' }}>{model.logo}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '1rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {model.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block',
                        }}
                      >
                        {model.company}
                      </Typography>
                    </Box>
                    {model.overallScore >= 90 && (
                      <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                    )}
                  </Box>

                  {/* Score */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        综合评分
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontWeight: 700, 
                          color: 'primary.main',
                          fontSize: '1.1rem',
                        }}
                      >
                        {model.overallScore}
                      </Typography>
                    </Box>
                    <ScoreBar 
                      label="" 
                      score={model.overallScore} 
                      color="#00a3ff" 
                      height={6}
                      showLabel={false}
                    />
                  </Box>

                  {/* Quick Scores */}
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          推理 {model.reasoning}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          编程 {model.coding}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          数学 {model.math}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          多模态 {model.multimodal}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {model.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          background: 'rgba(0, 163, 255, 0.1)',
                          color: 'primary.main',
                        }}
                      />
                    ))}
                    {model.tags.length > 3 && (
                      <Chip
                        label={`+${model.tags.length - 3}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'text.secondary',
                        }}
                      />
                    )}
                  </Box>

                  {/* Context Length */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      mt: 1.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    上下文: {model.contextLength.toLocaleString()} tokens
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredModels.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            未找到匹配的模型
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            请尝试其他关键词
          </Typography>
        </Box>
      )}

      {/* Model Detail Dialog */}
      <ModelDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        model={selectedModel}
      />
    </Box>
  );
};

export default ModelCard;
