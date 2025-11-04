import { useState, useCallback } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import Header from '../components/layout/Header';
import MemeCard from '../components/meme/MemeCard';
import MasonryGrid from '../components/meme/MasonryGrid';
import PopularTags from '../components/tag/PopularTags';
import { Flame, Sparkles } from 'lucide-react';

const HomePage = () => {
  // 실제 GIF URL 사용
  const gifUrls = [
    'https://media1.tenor.com/m/elCp2_fukbwAAAAC/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
    'https://media1.tenor.com/m/hOjxKIQML6YAAAAC/%EC%A2%8B%EB%B9%A0%EA%B0%80-%EC%9C%A4%EC%84%9D%EC%97%B4.gif',
    'https://media1.tenor.com/m/tOKJBiXdgmUAAAAC/%ED%95%9C%EA%B5%AD%EC%98%81%ED%99%94.gif',
    'https://media1.tenor.com/m/hFbzrQZ1oNEAAAAC/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
    'https://media1.tenor.com/m/9NVSJSAuVhUAAAAd/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
  ];

  const popularTags = ['BTS', '블랙핑크', '뉴진스', 'SEVENTEEN', 'IVE', '에스파', 'NCT', 'TWICE'];
  
  // GIF URL을 섞어서 사용
  const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];
  
  // 인기 밈 TOP 8 (초기 렌더링 시 한 번만 생성)
  const [trendingMemes] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: `trending-${i}`,
      gifUrl: getRandomGifUrl(),
      tags: ['이재명', '정치', '웃긴'],
      viewCount: Math.floor(Math.random() * 100000) + 50000,
      likeCount: Math.floor(Math.random() * 10000) + 1000,
      isLiked: Math.random() > 0.5,
    }))
  );
  
  // 무한 스크롤 상태
  const [allMemes, setAllMemes] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: `all-${i}`,
      gifUrl: getRandomGifUrl(),
      tags: ['윤석열', '한국영화', '밈'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
    }))
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 더 많은 밈 로드
  const loadMoreMemes = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // 실제로는 API 호출, 여기서는 시뮬레이션
    setTimeout(() => {
      const currentLength = allMemes.length;
      const newMemes = Array.from({ length: 12 }, (_, i) => ({
        id: `all-${currentLength + i}`,
        gifUrl: getRandomGifUrl(),
        tags: ['윤석열', '한국영화', '밈'],
        viewCount: Math.floor(Math.random() * 50000) + 10000,
        likeCount: Math.floor(Math.random() * 5000) + 500,
        isLiked: Math.random() > 0.5,
      }));
      
      setAllMemes(prev => [...prev, ...newMemes]);
      setIsLoading(false);
      
      // 100개 이상이면 더 이상 로드하지 않음 (데모용)
      if (currentLength + newMemes.length >= 100) {
        setHasMore(false);
      }
    }, 1000);
  }, [allMemes.length, isLoading, hasMore]);

  // Intersection Observer로 스크롤 감지
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMoreMemes();
      }
    },
  });

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
    // TODO: 태그 필터링 로직
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* 인기 태그 섹션 */}
          <PopularTags tags={popularTags} onTagClick={handleTagClick} />

          {/* 인기 밈 TOP 8 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Flame size={28} color="white" />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                인기 밈 TOP 8
              </Typography>
            </Box>
            
            <MasonryGrid>
              {trendingMemes.map((meme) => (
                <MemeCard key={meme.id} {...meme} />
              ))}
            </MasonryGrid>
          </Box>

          {/* 전체 밈 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <Sparkles size={28} color="white" />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                전체 밈
              </Typography>
            </Box>
            
            <MasonryGrid>
              {allMemes.map((meme) => (
                <MemeCard key={meme.id} {...meme} />
              ))}
            </MasonryGrid>
          </Box>

          {/* 무한 스크롤 로딩 표시 */}
          {hasMore && (
            <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              {isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 4,
                    py: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <CircularProgress size={20} sx={{ color: '#10B981' }} />
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    더 많은 밈 불러오는 중...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {/* 모든 밈을 다 불러왔을 때 */}
          {!hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                모든 밈을 불러왔습니다 🎉
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
