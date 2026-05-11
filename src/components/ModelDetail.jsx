import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CalculateIcon from '@mui/icons-material/Calculate';
import BrushIcon from '@mui/icons-material/Brush';
import TranslateIcon from '@mui/icons-material/Translate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { getModelDetail } from '../data/modelDetails';
import ScoreBar from './ScoreBar';

const CAPABILITY_ICONS = {
  '文本理解': <PsychologyIcon />,
  '图像分析': <VisibilityIcon />,
  '代码生成': <CodeIcon />,
  '数学推理': <CalculateIcon />,
  '创意写作': <BrushIcon />,
  '多语言': <TranslateIcon />,
};

const CAPABILITY_COLORS = ['#00a3ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const ModelDetail = ({ open, onClose, model }) => {
  const detail = model ? getModelDetail(model.id) : null;

  return (
    <Dialog
      open={open && !!model}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 163, 255, 0.2)',
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      {model && (
      <>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        pb: 2,
        position: 'sticky',
        top: 0,
        background: 'inherit',
        zIndex: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '3rem' }}>{model.logo}</Typography>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {model.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {model.company}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {/* Overall Score */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, rgba(0, 163, 255, 0.1) 0%, rgba(65, 125, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 163, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            {model.overallScore}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            综合评分
          </Typography>
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            擅长领域
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(model.tags || []).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  background: 'rgba(0, 163, 255, 0.1)',
                  border: '1px solid rgba(0, 163, 255, 0.3)',
                  color: 'primary.main',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Detailed Scores */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
            能力维度评分
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <ScoreBar label="推理能力" score={model.reasoning} color="#00d9ff" />
            <ScoreBar label="编程能力" score={model.coding} color="#10b981" />
            <ScoreBar label="数学能力" score={model.math} color="#f59e0b" />
            <ScoreBar label="多模态" score={model.multimodal} color="#8b5cf6" />
            <ScoreBar label="创意写作" score={model.creativeWriting} color="#ec4899" />
            <ScoreBar label="多语言" score={model.multilingual} color="#06b6d4" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 3 }} />

        {/* Context Length */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            上下文窗口
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {(model.contextLength ?? 0).toLocaleString()} tokens
          </Typography>
        </Box>

        {/* Model Detail Info */}
        {detail.capabilities && detail.capabilities.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
              核心能力详解
            </Typography>
            <List dense>
              {detail.capabilities.map((cap, index) => (
                <ListItem key={cap.name} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {React.cloneElement(CAPABILITY_ICONS[cap.name] || <StarIcon />, {
                      sx: { color: CAPABILITY_COLORS[index % CAPABILITY_COLORS.length] }
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cap.name}
                        </Typography>
                        <Chip 
                          label={`${cap.level}%`} 
                          size="small"
                          sx={{ 
                            height: 18, 
                            fontSize: '0.65rem',
                            background: `${CAPABILITY_COLORS[index % CAPABILITY_COLORS.length]}20`,
                            color: CAPABILITY_COLORS[index % CAPABILITY_COLORS.length],
                          }}
                        />
                      </Box>
                    }
                    secondary={cap.description}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            模型简介
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              lineHeight: 1.8,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
            }}
          >
            {model.description}
          </Typography>
        </Box>

        {detail.fullDescription && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 3 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
                详细介绍
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary',
                }}
              >
                {detail.fullDescription}
              </Typography>
            </Box>
          </>
        )}

        {/* Use Cases */}
        {detail.useCases && detail.useCases.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
              适用场景
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {detail.useCases.map((useCase) => (
                <Chip
                  key={useCase}
                  label={useCase}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'text.secondary',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Pricing */}
        {detail.pricing && (
          <Box 
            sx={{ 
              mt: 4, 
              p: 2, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
              参考价格
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              输入: {detail.pricing.input}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              输出: {detail.pricing.output}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              上下文: {detail.pricing.context}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        p: 2,
      }}>
        <Button onClick={onClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
      </>
      )}
    </Dialog>
  );
};

export default ModelDetail;
