import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import SourceIcon from '@mui/icons-material/Source';
import { formatDateTime } from '../utils/timeUtils';

const NewsDetail = ({ open, onClose, news }) => {
  if (!news) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 163, 255, 0.2)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Typography sx={{ fontSize: '2rem' }}>{news.image}</Typography>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.4, mb: 1 }}>
              {news.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                label={formatDateTime(news.date)}
                size="small"
                sx={{ 
                  background: 'rgba(0, 163, 255, 0.1)',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                icon={<SourceIcon sx={{ fontSize: 14 }} />}
                label={news.source}
                size="small"
                sx={{ 
                  background: 'rgba(65, 125, 255, 0.1)',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                label={news.category}
                size="small"
                sx={{ 
                  background: 'rgba(139, 92, 246, 0.1)',
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            摘要
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            {news.summary}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            详细内容
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
            }}
          >
            {news.content}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        p: 2,
      }}>
        <Button onClick={onClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsDetail;
