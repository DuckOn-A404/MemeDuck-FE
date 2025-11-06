import { Box, Typography } from '@mui/material';
import { Hash } from 'lucide-react';

interface PopularTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const PopularTags = ({ tags, onTagClick }: PopularTagsProps) => {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Hash size={20} strokeWidth={2.5} color="#9333EA" />
        <Typography 
          variant="h6" 
          fontWeight={700} 
          sx={{ color: '#1F2937', letterSpacing: '-0.02em' }}
        >
          인기 태그
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {tags.map((tag, index) => (
          <Box
            key={index}
            onClick={() => onTagClick?.(tag)}
            sx={{
              px: 2.5,
              py: 1,
              bgcolor: '#F9FAFB',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                transform: 'translateY(-2px)',
                '& .tag-text': {
                  color: 'white',
                },
              },
            }}
          >
            <Typography
              className="tag-text"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#6B7280',
                transition: 'color 0.2s ease',
              }}
            >
              #{tag}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularTags;
