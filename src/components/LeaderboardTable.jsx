import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScoreBar from './ScoreBar';

const LeaderboardTable = ({ data, sortConfig, onSort, onModelClick }) => {
  const scoreColumns = [
    { key: 'overallScore', label: '综合', color: '#00a3ff' },
    { key: 'reasoning', label: '推理', color: '#00d9ff' },
    { key: 'coding', label: '编程', color: '#10b981' },
    { key: 'math', label: '数学', color: '#f59e0b' },
    { key: 'multimodal', label: '多模态', color: '#8b5cf6' },
    { key: 'creativeWriting', label: '创意', color: '#ec4899' },
    { key: 'multilingual', label: '多语言', color: '#06b6d4' },
  ];

  const getRankStyle = (rank) => {
    if (rank === 1) return { color: '#FFD700', fontWeight: 800, textShadow: '0 0 10px #FFD700' };
    if (rank === 2) return { color: '#C0C0C0', fontWeight: 700, textShadow: '0 0 8px #C0C0C0' };
    if (rank === 3) return { color: '#CD7F32', fontWeight: 700, textShadow: '0 0 8px #CD7F32' };
    return { color: 'text.secondary' };
  };

  const getScoreColor = (score) => {
    if (score >= 95) return '#00a3ff';
    if (score >= 90) return '#10b981';
    if (score >= 85) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <TableContainer 
      component={Paper}
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        '& .MuiTable-root': {
          minWidth: 800,
        },
        '::-webkit-scrollbar': {
          height: 8,
        },
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                background: 'rgba(10, 10, 15, 0.95)',
                borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
                py: 1.5,
                fontWeight: 600,
                color: 'primary.main',
                width: 50,
              }}
            >
              排名
            </TableCell>
            <TableCell 
              sx={{ 
                background: 'rgba(10, 10, 15, 0.95)',
                borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
                py: 1.5,
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              模型
            </TableCell>
            <TableCell 
              sx={{ 
                background: 'rgba(10, 10, 15, 0.95)',
                borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
                py: 1.5,
                fontWeight: 600,
                color: 'primary.main',
                display: { xs: 'none', md: 'table-cell' },
              }}
            >
              公司
            </TableCell>
            {scoreColumns.map((col) => (
              <TableCell 
                key={col.key}
                align="center"
                sx={{ 
                  background: 'rgba(10, 10, 15, 0.95)',
                  borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
                  py: 1.5,
                  fontWeight: 600,
                  color: col.color,
                  display: { xs: col.key === 'overallScore' ? 'table-cell' : 'none', sm: 'table-cell' },
                }}
              >
                <TableSortLabel
                  active={sortConfig.key === col.key}
                  direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                  onClick={() => onSort(col.key)}
                  sx={{
                    color: col.color,
                    '&.MuiTableSortLabel-root:hover': { color: col.color },
                    '&.Mui-active': { color: col.color },
                  }}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell 
              sx={{ 
                background: 'rgba(10, 10, 15, 0.95)',
                borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
                py: 1.5,
                width: 50,
              }}
            >
              详情
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((model, index) => (
            <TableRow
              key={model.id}
              sx={{
                '&:hover': {
                  background: 'rgba(0, 163, 255, 0.05)',
                },
                transition: 'background 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => onModelClick(model)}
            >
              <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {index < 3 ? (
                    <StarIcon sx={{ fontSize: 16, ...getRankStyle(index + 1) }} />
                  ) : null}
                  <Typography sx={{ fontWeight: 700, ...getRankStyle(index + 1) }}>
                    {index + 1}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '1.5rem' }}>{model.logo}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {model.name}
                    </Typography>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5, mt: 0.5 }}>
                      {model.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            background: 'rgba(0, 163, 255, 0.1)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell 
                sx={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  py: 1.5,
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {model.company}
                </Typography>
              </TableCell>
              {scoreColumns.map((col) => (
                <TableCell 
                  key={col.key}
                  align="center"
                  sx={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    py: 1.5,
                    display: { xs: col.key === 'overallScore' ? 'table-cell' : 'none', sm: 'table-cell' },
                  }}
                >
                  <Tooltip title={
                    <Box sx={{ p: 0.5 }}>
                      <ScoreBar 
                        label={col.label} 
                        score={model[col.key]} 
                        color={col.color}
                        height={6}
                      />
                    </Box>
                  }>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: getScoreColor(model[col.key]),
                        fontSize: '0.95rem',
                      }}
                    >
                      {model[col.key]}
                    </Typography>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>
                <Tooltip title="查看详情">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModelClick(model);
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
