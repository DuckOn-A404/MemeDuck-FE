// import { useState, useCallback, useEffect } from 'react';
// import { Container, Box, Typography, CircularProgress } from '@mui/material';
// import { useInView } from 'react-intersection-observer';
// import Header from '../components/layout/Header';
// import MemeCard from '../components/meme/MemeCard';
// import MasonryGrid from '../components/meme/MasonryGrid';
// import PopularTags from '../components/tag/PopularTags';
// import { Flame, Sparkles } from 'lucide-react';
// import { useUserStore } from '../store/useUserStore';
// import { getAccessToken } from '../api/axiosInstance';
// import { getRandomMemes } from '../api/memeService';
// import { getTopMemes, type MemeItem } from '../api/memeService';
// import { useFavoriteMemes } from '../hooks/useFavoriteMemes';

// const HomePage = () => {
//   const { myUser, setMyUser } = useUserStore();

//   // 즐겨찾기 훅
//   const { favoriteIds, toggleFavorite, isLoaded } = useFavoriteMemes();

//   // 페이지 로드 시 토큰이 있으면 사용자 정보 로드
//   useEffect(() => {
//     const loadUserIfLoggedIn = async () => {
//       const token = getAccessToken();
//       if (token && !myUser) {
//         try {
//           const { fetchMyProfile } = await import('../api/userService');
//           const userData = await fetchMyProfile();
//           const normalized = { ...userData, artistList: userData.artistList ?? [] } as any;
//           setMyUser(normalized);
//         } catch (error) {
//           console.error('사용자 정보 로드 실패:', error);
//         }
//       }
//     };
//     loadUserIfLoggedIn();
//   }, [myUser, setMyUser]);

//   // 실제 GIF URL 사용
//   const gifUrls = [
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_6.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/aespa_giselle_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/aespa_karina_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_2.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/aespa_winter_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_2.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_3.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_4.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_5.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie.jpg',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/blackpink_jisoo.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/bts_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/bts_suga_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/ive_leeseo_1.jpg',
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_1.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_2.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_3.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_4.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/kpop_5.gif',
//     'https://d23breqm38jov9.cloudfront.net/memes/lesserafim_hyj_1.jpg',
//     'https://d23breqm38jov9.cloudfront.net/memes/produce.gif',
//   ];

//   const popularTags = ['NMIXX', '해원', '릴리', '설윤', '배이', '지우', '규진', 'JYP'];
  
//   const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];
  
//   // // 인기 밈 TOP 8 (더미)
//   // const [trendingMemes] = useState(() => 
//   //   Array.from({ length: 8 }, (_, i) => ({
//   //     id: `trending-${i}`,
//   //     gifUrl: getRandomGifUrl(),
//   //     tags: ['NMIXX', '해원', '귀여운'],
//   //     viewCount: Math.floor(Math.random() * 100000) + 50000,
//   //     likeCount: Math.floor(Math.random() * 10000) + 1000,
//   //     isLiked: Math.random() > 0.5,
//   //   }))
//   // );

//   // 인기 밈 Top10
//   const [topMemes, setTopMemes] = useState<MemeItem[]>([]);
//   const [isTopLoading, setIsTopLoading] = useState(true);
  
//   // 실제 API에서 받아온 밈들
//   const [allMemes, setAllMemes] = useState<MemeItem[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);

//   // 초기 밈 로드
//   useEffect(() => {
//     const loadInitialMemes = async () => {
//       try {
//         setIsInitialLoading(true);
//         const response = await getRandomMemes(1, 20);
//         setAllMemes(response.data.items);
//         setCurrentPage(1);
//         setHasMore(response.data.items.length < response.data.total);
//       } catch (error) {
//         console.error('초기 밈 로드 실패:', error);
//       } finally {
//         setIsInitialLoading(false);
//       }
//     };

//     loadInitialMemes();
//   }, []);

//   // 더 많은 밈 로드
//   const loadMoreMemes = useCallback(async () => {
//     if (isLoading || !hasMore) return;
    
//     try {
//       setIsLoading(true);
//       const nextPage = currentPage + 1;
//       const response = await getRandomMemes(nextPage, 12);
      
//       setAllMemes(prev => [...prev, ...response.data.items]);
//       setCurrentPage(nextPage);
      
//       const totalLoaded = allMemes.length + response.data.items.length;
//       if (totalLoaded >= response.data.total || response.data.items.length === 0) {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error('밈 로드 실패:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, isLoading, hasMore, allMemes.length]);

//   // 스크롤 감지
//   const { ref: loadMoreRef } = useInView({
//     threshold: 0,
//     rootMargin: '800px',
//     onChange: (inView) => {
//       if (inView && hasMore && !isLoading) {
//         loadMoreMemes();
//       }
//     },
//   });

//   const handleTagClick = (tag: string) => {
//     console.log('Tag clicked:', tag);
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
//       <Header showSearchBar />
      
//       <Container 
//         maxWidth={false} 
//         sx={{ 
//           py: 6,
//           px: { xs: '5%', sm: '8%', md: '10%' },
//           maxWidth: '100%'
//         }}
//       >
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//           {/* 인기 태그 섹션 */}
//           <PopularTags tags={popularTags} onTagClick={handleTagClick} />

//           {/* 인기 밈 TOP 8 */}
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
//               <Box
//                 sx={{
//                   background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
//                   borderRadius: 3,
//                   p: 1.5,
//                   display: 'flex',
//                   alignItems: 'center',
//                   boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
//                 }}
//               >
//                 <Flame size={28} color="white" />
//               </Box>
//               <Typography 
//                 variant="h4" 
//                 fontWeight={800}
//                 sx={{
//                   background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                 }}
//               >
//                 인기 밈 TOP 8
//               </Typography>
//             </Box>
            
//             <MasonryGrid>
//               {trendingMemes.map((meme) => (
//                 <MemeCard
//                   key={meme.id}
//                   {...meme}
//                   isFavorite={isLoaded && favoriteIds.has(meme.id)}
//                   onToggleFavorite={(id) => toggleFavorite(id)}
//                 />
//               ))}
//             </MasonryGrid>
//           </Box>

//           {/* 전체 밈 */}
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
//               <Box
//                 sx={{
//                   background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
//                   borderRadius: 3,
//                   p: 1.5,
//                   display: 'flex',
//                   alignItems: 'center',
//                   boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
//                 }}
//               >
//                 <Sparkles size={28} color="white" />
//               </Box>
//               <Typography 
//                 variant="h4" 
//                 fontWeight={800}
//                 sx={{
//                   background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                 }}
//               >
//                 전체 밈
//               </Typography>
//             </Box>
            
//             {isInitialLoading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
//                 <CircularProgress size={40} sx={{ color: '#9333EA' }} />
//               </Box>
//             ) : (
//               <MasonryGrid>
//                 {allMemes.map((meme, index) => {
//                   const idStr = meme.memeId.toString();
//                   return (
//                     <MemeCard 
//                       key={`${meme.memeId}-${index}`} 
//                       id={idStr}
//                       gifUrl={meme.memeUrl}
//                       tags={meme.tags}
//                       viewCount={0}
//                       likeCount={0}
//                       isFavorite={isLoaded && favoriteIds.has(idStr)}
//                       onToggleFavorite={(id) => toggleFavorite(id)}
//                     />
//                   );
//                 })}
//               </MasonryGrid>
//             )}
//           </Box>

//           {/* 무한 스크롤 로딩 표시 */}
//           {hasMore && (
//             <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//               {isLoading && (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 2,
//                     px: 4,
//                     py: 2,
//                     bgcolor: 'white',
//                     borderRadius: 3,
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                   }}
//                 >
//                   <CircularProgress size={20} sx={{ color: '#9333EA' }} />
//                   <Typography variant="body2" fontWeight={600} color="text.secondary">
//                     더 많은 밈 불러오는 중...
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           )}
          
//           {/* 모든 밈을 다 불러왔을 때 */}
//           {!hasMore && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//               <Typography variant="body2" fontWeight={600} color="text.secondary">
//                 모든 밈을 불러왔습니다 🎉
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default HomePage;

import { useState, useCallback, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import Header from '../components/layout/Header';
import MemeCard from '../components/meme/MemeCard';
import MasonryGrid from '../components/meme/MasonryGrid';
import PopularTags from '../components/tag/PopularTags';
import { Flame, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { getAccessToken } from '../api/axiosInstance';
import { getRandomMemes, getTopMemes, type MemeItem } from '../api/memeService';
import { useFavoriteMemes } from '../hooks/useFavoriteMemes';

const HomePage = () => {
  const { myUser, setMyUser } = useUserStore();

  // 즐겨찾기 훅
  const { favoriteIds, toggleFavorite, isLoaded } = useFavoriteMemes();

  // 페이지 로드 시 토큰이 있으면 사용자 정보 로드
  useEffect(() => {
    const loadUserIfLoggedIn = async () => {
      const token = getAccessToken();
      if (token && !myUser) {
        try {
          const { fetchMyProfile } = await import('../api/userService');
          const userData = await fetchMyProfile();
          const normalized = { ...userData, artistList: userData.artistList ?? [] } as any;
          setMyUser(normalized);
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
        }
      }
    };
    loadUserIfLoggedIn();
  }, [myUser, setMyUser]);

  // 인기 태그
  const popularTags = ['NMIXX', '해원', '릴리', '설윤', '배이', '지우', '규진', 'JYP'];

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
  };

  // 인기 밈 TOP 10 (실제 API)
  const [topMemes, setTopMemes] = useState<MemeItem[]>([]);
  const [isTopLoading, setIsTopLoading] = useState(true);

  useEffect(() => {
    const loadTopMemes = async () => {
      try {
        setIsTopLoading(true);
        const res = await getTopMemes(); // /memes/top
        setTopMemes(res.data.items.slice(0, 10));
      } catch (err) {
        console.error('탑 밈 로드 실패:', err);
        setTopMemes([]);
      } finally {
        setIsTopLoading(false);
      }
    };

    loadTopMemes();
  }, []);

  // 전체 밈
  const [allMemes, setAllMemes] = useState<MemeItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 초기 밈 로드
  useEffect(() => {
    const loadInitialMemes = async () => {
      try {
        setIsInitialLoading(true);
        const response = await getRandomMemes(1, 20);
        setAllMemes(response.data.items);
        setCurrentPage(1);
        setHasMore(response.data.items.length < response.data.total);
      } catch (error) {
        console.error('초기 밈 로드 실패:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialMemes();
  }, []);

  // 더 많은 밈 로드
  const loadMoreMemes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const response = await getRandomMemes(nextPage, 12);

      setAllMemes((prev) => [...prev, ...response.data.items]);
      setCurrentPage(nextPage);

      const totalLoaded = allMemes.length + response.data.items.length;
      if (totalLoaded >= response.data.total || response.data.items.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('밈 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore, allMemes.length]);

  // 스크롤 감지
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: '800px',
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMoreMemes();
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
          maxWidth: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* 인기 태그 섹션 */}
          <PopularTags tags={popularTags} onTagClick={handleTagClick} />

          {/* 인기 밈 TOP 10 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
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
                <Flame size={28} color="white" />
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                인기 밈 TOP 10
              </Typography>
            </Box>

            {isTopLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: '#9333EA' }} />
              </Box>
            ) : (
              <MasonryGrid>
                {topMemes.map((meme) => {
                  const idStr = meme.memeId.toString();
                  return (
                    <MemeCard
                      key={idStr}
                      id={idStr}
                      gifUrl={meme.memeUrl}
                      tags={meme.tags}
                      viewCount={0}
                      likeCount={0}
                      isFavorite={isLoaded && favoriteIds.has(idStr)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                    />
                  );
                })}
              </MasonryGrid>
            )}
          </Box>

          {/* 전체 밈 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
                }}
              >
                <Sparkles size={28} color="white" />
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                전체 밈
              </Typography>
            </Box>

            {isInitialLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={40} sx={{ color: '#9333EA' }} />
              </Box>
            ) : (
              <MasonryGrid>
                {allMemes.map((meme, index) => {
                  const idStr = meme.memeId.toString();
                  return (
                    <MemeCard
                      key={`${meme.memeId}-${index}`}
                      id={idStr}
                      gifUrl={meme.memeUrl}
                      tags={meme.tags}
                      viewCount={0}
                      likeCount={0}
                      isFavorite={isLoaded && favoriteIds.has(idStr)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                    />
                  );
                })}
              </MasonryGrid>
            )}
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
                  <CircularProgress size={20} sx={{ color: '#9333EA' }} />
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
