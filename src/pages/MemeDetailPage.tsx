// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Box,
//   Typography,
//   Card,
//   Avatar,
//   Button,
//   Chip,
//   IconButton,
// } from '@mui/material';
// import {
//   Heart,
//   Download,
//   Share2,
//   Calendar,
//   FileImage,
//   Maximize2,
//   ArrowLeft,
//   User,
// } from 'lucide-react';
// import Header from '../components/layout/Header';
// import { getMediaInfo, formatDuration } from '../utils/mediaUtils';

// const MemeDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // 홈 화면과 동일한 더미 GIF URL 목록
//   const randomGifs = [
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

//   // 임시 데이터 (실제로는 API에서 가져옴)
//   const [meme] = useState(() => {
//     const randomIndex = Math.floor(Math.random() * randomGifs.length);
//     const selectedGif = randomGifs[randomIndex];
    
//     return {
//       id: id || '1',
//       gifUrl: selectedGif,
//       tags: ['NMIXX', '해원', '배이', '귀여운', '웃긴'],
//       uploadDate: '2024.03.15',
//       downloadCount: Math.floor(Math.random() * 5000) + 100,
//       likeCount: Math.floor(Math.random() * 3000) + 50,
//       fileSize: '2.4 MB', // 실제로는 getMediaInfo에서 가져옴
//       dimensions: '480 x 360', // 실제로는 getMediaInfo에서 가져옴
//       duration: '3.2초', // 실제로는 getMediaInfo에서 가져옴
//       uploader: {
//         id: 'user123',
//         nickname: '밈마스터',
//         profileImage: '',
//       },
//     };
//   });

//   const [videoDuration, setVideoDuration] = useState<string | null>(null);
//   const [actualDimensions, setActualDimensions] = useState<string | null>(null);
//   const [actualFileSize, setActualFileSize] = useState<string | null>(null);
//   const [isLiked, setIsLiked] = useState(false);

//   const getTagColors = (tag: string) => {
//     let hash = 0;
//     for (let i = 0; i < tag.length; i++) hash = (hash << 5) - hash + tag.charCodeAt(i);
//     const hue = Math.abs(hash) % 360;
//     const bg = `hsla(${hue}, 90%, 96%, 1)`;
//     const text = `hsl(${hue}, 55%, 35%)`;
//     const hoverBg = `hsla(${hue}, 95%, 90%, 1)`;
//     return { bg, text, hoverBg };
//   };

//   // 미디어 로드 시 실제 정보 가져오기 (ts-gif 사용)
//   useEffect(() => {
//     const loadMediaInfo = async () => {
//       try {
//         const mediaInfo = await getMediaInfo(meme.gifUrl);
        
//         if (mediaInfo) {
//           // 재생 시간
//           if (mediaInfo.duration !== null && mediaInfo.duration !== undefined) {
//             setVideoDuration(formatDuration(mediaInfo.duration));
//           } else if (meme.duration) {
//             // ts-gif가 실패한 경우 기본값 사용
//             setVideoDuration(meme.duration);
//           } else {
//             // 재생 시간을 알 수 없는 경우
//             setVideoDuration(null);
//           }
          
//           // 실제 크기
//           if (mediaInfo.dimensions) {
//             setActualDimensions(mediaInfo.dimensions);
//           }
//           // (미사용) width/height 상태 저장 로직 제거
          
//           // 실제 파일 크기
//           if (mediaInfo.fileSize) {
//             setActualFileSize(mediaInfo.fileSize);
//           }
          
//           console.log('✅ 미디어 정보 로드 완료:', {
//             type: mediaInfo.type,
//             dimensions: mediaInfo.dimensions,
//             duration: mediaInfo.duration,
//             frameCount: mediaInfo.frameCount,
//             fileSize: mediaInfo.fileSize,
//           });
//         } else {
//           // 정보를 가져올 수 없는 경우 기본값 사용
//           console.warn('⚠️ 미디어 정보를 가져올 수 없습니다. 기본값 사용');
//           setVideoDuration(meme.duration || null);
//         }
//       } catch (error) {
//         console.error('미디어 정보 가져오기 실패:', error);
//         setVideoDuration(meme.duration);
//       }
//     };

//     loadMediaInfo();
//   }, [meme.gifUrl, meme.duration]);

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await fetch(meme.gifUrl);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `meme-${meme.id}.gif`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('다운로드 실패:', error);
//     }
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: '밈 공유',
//         text: `#${meme.tags.join(' #')}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('링크가 클립보드에 복사되었습니다!');
//     }
//   };

//   const handleUploaderClick = () => {
//     navigate(`/user/${meme.uploader.id}`);
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
//       <Header />

//       <Container
//         maxWidth="lg"
//         sx={{
//           py: 4,
//           px: { xs: 2, sm: 3, md: 4 },
//         }}
//       >
//         {/* 뒤로가기 버튼 */}
//         <Button
//           startIcon={<ArrowLeft size={20} />}
//           onClick={() => navigate(-1)}
//           sx={{
//             mb: 3,
//             color: '#6B7280',
//             fontWeight: 600,
//             '&:hover': {
//               bgcolor: 'rgba(147, 51, 234, 0.08)',
//               color: '#9333EA',
//             },
//           }}
//         >
//           뒤로가기
//         </Button>

//         <Box
//           sx={{
//             display: 'grid',
//             gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
//             gap: 4,
//           }}
//         >
//           {/* 왼쪽: 밈 이미지 */}
//           <Box>
//             <Card
//               sx={{
//                 borderRadius: 4,
//                 overflow: 'hidden',
//                 boxShadow: 'none',
//                 position: 'relative',
//                 bgcolor: 'transparent',
//                 maxWidth: { xs: '100%', md: 960 },
//                 mx: 'auto',
//               }}
//             >
//               <Box
//                 sx={{
//                   width: '100%',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   bgcolor: '#FAFAFA',
//                 }}
//               >
//                 <Box
//                   component="img"
//                   src={meme.gifUrl}
//                   alt="meme"
//                   sx={{
//                     maxWidth: '100%',
//                     height: 'auto',
//                     maxHeight: { xs: '60vh', md: '72vh' },
//                     display: 'block',
//                   }}
//                 />
//               </Box>
//             </Card>

//             {/* 액션 버튼들 */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 gap: 2,
//                 mt: 3,
//                 flexWrap: 'wrap',
//               }}
//             >
//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={<Heart size={20} fill={isLiked ? 'white' : 'none'} />}
//                 onClick={handleLike}
//                 sx={{
//                   flex: 1,
//                   minWidth: 140,
//                   py: 1.5,
//                   borderRadius: 3,
//                   background: isLiked
//                     ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
//                     : 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
//                   fontWeight: 700,
//                   fontSize: '1rem',
//                   boxShadow: '0 4px 16px rgba(147, 51, 234, 0.3)',
//                   '&:hover': {
//                     boxShadow: '0 6px 24px rgba(147, 51, 234, 0.4)',
//                     transform: 'translateY(-2px)',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 좋아요 {(meme.likeCount + (isLiked ? 1 : 0)).toLocaleString()}
//               </Button>

//               <Button
//                 variant="outlined"
//                 size="large"
//                 startIcon={<Download size={20} />}
//                 onClick={handleDownload}
//                 sx={{
//                   flex: 1,
//                   minWidth: 140,
//                   py: 1.5,
//                   borderRadius: 3,
//                   borderColor: '#9333EA',
//                   color: '#9333EA',
//                   borderWidth: 2,
//                   fontWeight: 700,
//                   fontSize: '1rem',
//                   '&:hover': {
//                     borderWidth: 2,
//                     borderColor: '#9333EA',
//                     bgcolor: 'rgba(147, 51, 234, 0.08)',
//                     transform: 'translateY(-2px)',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 다운로드
//               </Button>

//               <IconButton
//                 onClick={handleShare}
//                 sx={{
//                   width: 56,
//                   height: 56,
//                   borderRadius: 3,
//                   border: '2px solid #E5E7EB',
//                   color: '#6B7280',
//                   '&:hover': {
//                     borderColor: '#9333EA',
//                     color: '#9333EA',
//                     bgcolor: 'rgba(147, 51, 234, 0.08)',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 <Share2 size={24} />
//               </IconButton>
//             </Box>
//           </Box>

//           {/* 오른쪽: 정보 패널 */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             {/* 업로더 정보 */}
//             <Box sx={{ mb: 1 }}>
//               <Typography
//                 variant="caption"
//                 fontWeight={600}
//                 color="text.secondary"
//                 sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
//               >
//                 업로드한 유저
//               </Typography>
//               <Box
//                 onClick={handleUploaderClick}
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 2,
//                   cursor: 'pointer',
//                   p: 2,
//                   borderRadius: 3,
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     bgcolor: 'rgba(147, 51, 234, 0.05)',
//                   },
//                 }}
//               >
//                 <Avatar
//                   src={meme.uploader.profileImage}
//                   sx={{
//                     width: 48,
//                     height: 48,
//                     background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
//                     fontSize: '1.25rem',
//                     fontWeight: 700,
//                   }}
//                 >
//                   {meme.uploader.nickname.charAt(0)}
//                 </Avatar>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography variant="body1" fontWeight={700}>
//                     {meme.uploader.nickname}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     프로필 보기
//                   </Typography>
//                 </Box>
//                 <User size={18} color="#9333EA" />
//               </Box>
//             </Box>

//             {/* 태그 */}
//             <Box sx={{ mb: 1 }}>
//               <Typography
//                 variant="caption"
//                 fontWeight={600}
//                 color="text.secondary"
//                 sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
//               >
//                 태그
//               </Typography>
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                 {meme.tags.map((tag, index) => (
//                   <Chip
//                     key={index}
//                     label={`#${tag}`}
//                     onClick={() => navigate(`/search/${tag}`)}
//                     size="small"
//                     sx={{
//                       bgcolor: getTagColors(tag).bg,
//                       color: getTagColors(tag).text,
//                       fontWeight: 600,
//                       fontSize: '0.8125rem',
//                       border: 'none',
//                       borderRadius: '6px',
//                       '&:hover': {
//                         bgcolor: getTagColors(tag).hoverBg,
//                         transform: 'translateY(-1px)',
//                       },
//                       transition: 'all 0.2s ease',
//                     }}
//                   />
//                 ))}
//               </Box>
//             </Box>

//             {/* 상세 정보 */}
//             <Box sx={{ mb: 1 }}>
//               <Typography
//                 variant="caption"
//                 fontWeight={600}
//                 color="text.secondary"
//                 sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
//               >
//                 상세 정보
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <Calendar size={16} color="#9333EA" />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                       업로드 날짜
//                     </Typography>
//                     <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
//                       {new Date(meme.uploadDate).toLocaleDateString('ko-KR', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                       })}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <FileImage size={16} color="#9333EA" />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                       파일 크기
//                     </Typography>
//                     <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
//                       {actualFileSize || meme.fileSize}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <Maximize2 size={16} color="#9333EA" />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                       이미지 크기
//                     </Typography>
//                     <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
//                       {actualDimensions || meme.dimensions}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <Download size={16} color="#9333EA" />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                       다운로드 수
//                     </Typography>
//                     <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
//                       {meme.downloadCount.toLocaleString()}회
//                     </Typography>
//                   </Box>
//                 </Box>

//                 {videoDuration && (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                       <Box
//                         component="svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="#9333EA"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         sx={{ width: 16, height: 16, flexShrink: 0 }}
//                       >
//                         <circle cx="12" cy="12" r="10" />
//                         <polyline points="12 6 12 12 16 14" />
//                       </Box>
//                       <Box>
//                         <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                           재생 시간
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
//                           {videoDuration}
//                         </Typography>
//                       </Box>
//                     </Box>
//                 )}
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default MemeDetailPage;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Heart,
  Download,
  Share2,
  Calendar,
  FileImage,
  Maximize2,
  ArrowLeft,
  User,
} from "lucide-react";
import Header from "../components/layout/Header";
import { getMediaInfo, formatDuration } from "../utils/mediaUtils";
import { useFavoriteMemes } from "../hooks/useFavoriteMemes";

const MemeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ 즐겨찾기(=좋아요) 훅
  const { favoriteIds, toggleFavorite } = useFavoriteMemes();
  const isFavorited = id ? favoriteIds.has(id) : false;

  // 홈 화면과 동일한 더미 GIF URL 목록
  const randomGifs = [
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_6.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/aespa_giselle_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/aespa_karina_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/aespa_ningning_2.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/aespa_winter_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_2.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_3.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_4.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie_5.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie.jpg",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jennie1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/blackpink_jisoo.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/bts_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/bts_suga_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/ive_leeseo_1.jpg",
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_1.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_2.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_3.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_4.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/kpop_5.gif",
    "https://d23breqm38jov9.cloudfront.net/memes/lesserafim_hyj_1.jpg",
    "https://d23breqm38jov9.cloudfront.net/memes/produce.gif",
  ];

  // 임시 데이터 (실제로는 API에서 가져옴)
  const [meme] = useState(() => {
    const randomIndex = Math.floor(Math.random() * randomGifs.length);
    const selectedGif = randomGifs[randomIndex];

    return {
      id: id || "1",
      gifUrl: selectedGif,
      tags: ["NMIXX", "해원", "배이", "귀여운", "웃긴"],
      uploadDate: "2024.03.15",
      downloadCount: Math.floor(Math.random() * 5000) + 100,
      likeCount: Math.floor(Math.random() * 3000) + 50,
      fileSize: "2.4 MB",
      dimensions: "480 x 360",
      duration: "3.2초",
      uploader: {
        id: "user123",
        nickname: "밈마스터",
        profileImage: "",
      },
    };
  });

  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const [actualDimensions, setActualDimensions] = useState<string | null>(null);
  const [actualFileSize, setActualFileSize] = useState<string | null>(null);

  const getTagColors = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = (hash << 5) - hash + tag.charCodeAt(i);
    const hue = Math.abs(hash) % 360;
    const bg = `hsla(${hue}, 90%, 96%, 1)`;
    const text = `hsl(${hue}, 55%, 35%)`;
    const hoverBg = `hsla(${hue}, 95%, 90%, 1)`;
    return { bg, text, hoverBg };
  };

  // 미디어 로드 시 실제 정보 가져오기
  useEffect(() => {
    const loadMediaInfo = async () => {
      try {
        const mediaInfo = await getMediaInfo(meme.gifUrl);

        if (mediaInfo) {
          if (mediaInfo.duration !== null && mediaInfo.duration !== undefined) {
            setVideoDuration(formatDuration(mediaInfo.duration));
          } else if (meme.duration) {
            setVideoDuration(meme.duration);
          } else {
            setVideoDuration(null);
          }

          if (mediaInfo.dimensions) {
            setActualDimensions(mediaInfo.dimensions);
          }

          if (mediaInfo.fileSize) {
            setActualFileSize(mediaInfo.fileSize);
          }
        } else {
          setVideoDuration(meme.duration || null);
        }
      } catch (error) {
        console.error("미디어 정보 가져오기 실패:", error);
        setVideoDuration(meme.duration);
      }
    };

    loadMediaInfo();
  }, [meme.gifUrl, meme.duration]);

  // ❤️ = 즐겨찾기 토글
  const handleLike = () => {
    if (!id) return;
    toggleFavorite(id);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(meme.gifUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meme-${meme.id}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("다운로드 실패:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "밈 공유",
        text: `#${meme.tags.join(" #")}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  const handleUploaderClick = () => {
    navigate(`/user/${meme.uploader.id}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFA" }}>
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* 뒤로가기 버튼 */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: "#6B7280",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "rgba(147, 51, 234, 0.08)",
              color: "#9333EA",
            },
          }}
        >
          뒤로가기
        </Button>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 4,
          }}
        >
          {/* 왼쪽: 밈 이미지 */}
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "none",
                position: "relative",
                bgcolor: "transparent",
                maxWidth: { xs: "100%", md: 960 },
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#FAFAFA",
                }}
              >
                <Box
                  component="img"
                  src={meme.gifUrl}
                  alt="meme"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: { xs: "60vh", md: "72vh" },
                    display: "block",
                  }}
                />
              </Box>
            </Card>

            {/* 액션 버튼들 */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              {/* ❤️ 좋아요 = 즐겨찾기 */}
              <Button
                variant="contained"
                size="large"
                startIcon={
                  <Heart
                    size={20}
                    fill={isFavorited ? "white" : "none"}
                  />
                }
                onClick={handleLike}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  py: 1.5,
                  borderRadius: 3,
                  background: isFavorited
                    ? "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
                    : "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 4px 16px rgba(147, 51, 234, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 24px rgba(147, 51, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                좋아요{" "}
                {(
                  meme.likeCount + (isFavorited ? 1 : 0)
                ).toLocaleString()}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Download size={20} />}
                onClick={handleDownload}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: "#9333EA",
                  color: "#9333EA",
                  borderWidth: 2,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "#9333EA",
                    bgcolor: "rgba(147, 51, 234, 0.08)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                다운로드
              </Button>

              <IconButton
                onClick={handleShare}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  border: "2px solid #E5E7EB",
                  color: "#6B7280",
                  "&:hover": {
                    borderColor: "#9333EA",
                    color: "#9333EA",
                    bgcolor: "rgba(147, 51, 234, 0.08)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Share2 size={24} />
              </IconButton>
            </Box>
          </Box>

          {/* 오른쪽: 정보 패널 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 업로더 정보 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                업로드한 유저
              </Typography>
              <Box
                onClick={handleUploaderClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  p: 2,
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(147, 51, 234, 0.05)",
                  },
                }}
              >
                <Avatar
                  src={meme.uploader.profileImage}
                  sx={{
                    width: 48,
                    height: 48,
                    background:
                      "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {meme.uploader.nickname.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={700}>
                    {meme.uploader.nickname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    프로필 보기
                  </Typography>
                </Box>
                <User size={18} color="#9333EA" />
              </Box>
            </Box>

            {/* 태그 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                태그
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {meme.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    onClick={() => navigate(`/search/${tag}`)}
                    size="small"
                    sx={{
                      bgcolor: getTagColors(tag).bg,
                      color: getTagColors(tag).text,
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      border: "none",
                      borderRadius: "6px",
                      "&:hover": {
                        bgcolor: getTagColors(tag).hoverBg,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* 상세 정보 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                상세 정보
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Calendar size={16} color="#9333EA" />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      업로드 날짜
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {new Date(meme.uploadDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <FileImage size={16} color="#9333EA" />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      파일 크기
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {actualFileSize || meme.fileSize}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Maximize2 size={16} color="#9333EA" />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      이미지 크기
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {actualDimensions || meme.dimensions}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Download size={16} color="#9333EA" />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      다운로드 수
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {meme.downloadCount.toLocaleString()}회
                    </Typography>
                  </Box>
                </Box>

                {videoDuration && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9333EA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      sx={{ width: 16, height: 16, flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        재생 시간
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {videoDuration}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MemeDetailPage;
