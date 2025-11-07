import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Chip } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import MasonryGrid from '../components/meme/MasonryGrid';
import MemeCard from '../components/meme/MemeCard';

const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();
  
  // HomePage와 동일한 GIF URL 사용
  const gifUrls = [
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_6.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/aespa_giselle_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/aespa_karina_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_2.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/aespa_winter_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_2.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_3.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_4.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_5.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie.jpg',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jisoo.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/bts_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/bts_suga_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/ive_leeseo_1.jpg',
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_1.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_2.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_3.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_4.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/kpop_5.gif',
    'https://d23breqm38jov9.cloudfront.net/memes/lesserafim_hyj_1.jpg',
    'https://d23breqm38jov9.cloudfront.net/memes/produce.gif',
  ];
  
  const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];
  
  // 검색 결과 더미 데이터 (실제로는 API 호출)
  const [searchResults, setSearchResults] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: `search-${i}`,
      gifUrl: getRandomGifUrl(),
      tags: ['NMIXX', '해원', '배이', query || '검색어'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
    }))
  );

  // 검색어가 변경될 때마다 결과 재생성 (실제로는 API 호출)
  useEffect(() => {
    if (query) {
      // 실제로는 API 호출: fetch(`/api/search?q=${query}`)
      const newResults = Array.from({ length: 12 }, (_, i) => ({
        id: `search-${query}-${i}`,
        gifUrl: getRandomGifUrl(),
        tags: ['NMIXX', '해원', '배이', query],
        viewCount: Math.floor(Math.random() * 50000) + 10000,
        likeCount: Math.floor(Math.random() * 5000) + 500,
        isLiked: Math.random() > 0.5,
      }));
      setSearchResults(newResults);
    }
  }, [query]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header showSearchBar />
      
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 6,
          px: { xs: '5%', sm: '8%', md: '10%' },
          maxWidth: '100%'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* 검색 결과 헤더 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                }}
              >
                <SearchIcon size={28} color="white" />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight={800}
                  sx={{
                    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  검색 결과
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    검색어:
                  </Typography>
                  <Chip
                    label={query || ''}
                    sx={{
                      bgcolor: 'rgba(147, 51, 234, 0.1)',
                      color: '#9333EA',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      border: '1px solid rgba(147, 51, 234, 0.2)',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    · {searchResults.length}개의 결과
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 검색 결과 밈 그리드 */}
          {searchResults.length > 0 ? (
            <MasonryGrid>
              {searchResults.map((meme) => (
                <MemeCard key={meme.id} {...meme} />
              ))}
            </MasonryGrid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 12,
                gap: 2,
              }}
            >
              <SearchIcon size={64} color="#D1D5DB" />
              <Typography variant="h5" fontWeight={700} color="text.secondary">
                검색 결과가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                다른 검색어로 시도해보세요
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SearchResultPage;
