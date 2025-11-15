import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Chip, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Header from '../components/layout/Header';
import MasonryGrid from '../components/meme/MasonryGrid';
import MemeCard from '../components/meme/MemeCard';
import { searchMemesByTag, type MemeItem } from '../api/memeService';
import { useFavoriteMemes } from '../hooks/useFavoriteMemes';

const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();
  
  // 즐겨찾기 훅
  const { favoriteIds, toggleFavorite, isLoaded } = useFavoriteMemes();
  
  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<MemeItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 초기 검색 결과 로드
  useEffect(() => {
    if (!query) return;

    const loadInitialResults = async () => {
      try {
        setIsInitialLoading(true);
        setSearchResults([]);
        setCurrentPage(1);
        setHasMore(true);
        
        const response = await searchMemesByTag(query, 1, 30);
        setSearchResults(response.data.items);
        setTotalResults(response.data.total);
        setHasMore(response.data.items.length >= 30);
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialResults();
  }, [query]);

  // 더 많은 검색 결과 로드
  const loadMoreResults = useCallback(async () => {
    if (isLoading || !hasMore || !query) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const response = await searchMemesByTag(query, nextPage, 30);

      setSearchResults((prev) => [...prev, ...response.data.items]);
      setCurrentPage(nextPage);

      if (response.data.items.length < 30) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('추가 검색 결과 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore, query]);

  // 스크롤 감지
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: '800px',
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMoreResults();
      }
    },
  });

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
                    · {totalResults}개의 결과
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 검색 결과 밈 그리드 */}
          {isInitialLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#9333EA' }} />
            </Box>
          ) : searchResults.length > 0 ? (
            <>
              <MasonryGrid>
                {searchResults.map((meme, index) => {
                  const idStr = meme.memeId.toString();
                  return (
                    <MemeCard
                      key={`${meme.memeId}-${index}`}
                      id={idStr}
                      gifUrl={meme.memeUrl}
                      tags={meme.tags ?? []}
                      viewCount={0}
                      likeCount={0}
                      isFavorite={isLoaded && favoriteIds.has(idStr)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                    />
                  );
                })}
              </MasonryGrid>

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
                      <CircularProgress size={20} sx={{ color: '#9333EA' }} />
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        더 많은 결과 불러오는 중...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* 모든 결과를 다 불러왔을 때 */}
              {!hasMore && searchResults.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    모든 검색 결과를 불러왔습니다 🎉
                  </Typography>
                </Box>
              )}
            </>
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
