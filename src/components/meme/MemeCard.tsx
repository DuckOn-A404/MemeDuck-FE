import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Chip, IconButton, Box, Fade } from '@mui/material';
import { Download, Star } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import LoginModal from '../common/LoginModal';
import { logMemeUsage } from '../../api/memeService';

interface MemeCardProps {
  id: string;
  gifUrl: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;

  // 즐겨찾기용 prop 추가하기
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const MemeCard = ({ id, gifUrl, tags, isFavorite, onToggleFavorite }: MemeCardProps) => {
  const navigate = useNavigate();
  const { myUser } = useUserStore();
  const [hover, setHover] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 로그인 체크
    if (!myUser) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      // 다운로드 로그 기록
      await logMemeUsage(Number(id), 'DOWNLOAD');
      
      // GIF 다운로드
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meme-${id}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 실패:', error);
    }
  };

  const handleCardClick = () => {
    navigate(`/memes/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 로그인 체크
    if (!myUser) {
      setShowLoginModal(true);
      return;
    }
    
    // 로그인된 경우 즐겨찾기 토글
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <>
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        position: 'relative',
        mb: 2,
        breakInside: 'avoid',
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(147, 51, 234, 0.3)',
          borderRadius: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={gifUrl}
          alt="meme"
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transition: 'transform 0.5s ease',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* 호버 오버레이 */}
        <Fade in={hover}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            }}
          />
        </Fade>

        {/* 즐겨찾기 버튼 */}
        {onToggleFavorite && (
          <Fade in={hover}>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                position: "absolute",
                top: 12,
                right: 60,
                bgcolor: "rgba(0,0,0,0.35)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.6)",
                },
              }}
            >
              <Star
                size={18}
                strokeWidth={2.5}
                color={isFavorite ? "#facc15" : "white"}
                fill={isFavorite ? "#facc15" : "transparent"}
              />
            </IconButton>
          </Fade>
        )}

        {/* 다운로드 버튼 */}
        <Fade in={hover}>
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(147, 51, 234, 0.95)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: '#9333EA',
                transform: 'scale(1.1)',
                boxShadow: '0 4px 16px rgba(147, 51, 234, 0.5)',
              },
            }}
          >
            <Download
              size={18}
              color="white"
              strokeWidth={2.5}
            />
          </IconButton>
        </Fade>

        {/* 태그 */}
        <Fade in={hover}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#9333EA',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    color: 'white',
                    borderColor: 'transparent',
                  },
                }}
              />
            ))}
            {tags.length > 3 && (
              <Chip
                label={`+${tags.length - 3}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#6B7280',
                }}
              />
            )}
          </Box>
        </Fade>
      </Box>
    </Card>
    
    {/* 로그인 모달 - Card 외부로 이동하여 이벤트 버블링 방지 */}
    <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default MemeCard;
