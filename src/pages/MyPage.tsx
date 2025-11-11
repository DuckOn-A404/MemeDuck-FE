// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Box,
//   Typography,
//   Avatar,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Tabs,
//   Tab,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import {
//   Heart,
//   Upload,
//   MoreVertical,
// } from 'lucide-react';
// import Header from '../components/layout/Header';
// import MasonryGrid from '../components/meme/MasonryGrid';
// import MemeCard from '../components/meme/MemeCard';
// import { useUserStore } from '../store/useUserStore';
// import PasswordConfirm from '../components/common/PasswordConfirm';
// import EditProfileCard from '../components/domain/user/EditProfileCard';
// import { verifyPassword } from '../api/userService';
// import type { MyUser } from '../types/mypage';

// // 임시 사용자 타입
// interface User {
//   id: string;
//   userId: string;
//   nickname: string;
//   email: string;
//   profileImage?: string;
//   uploadedMemesCount: number;
//   likedMemesCount: number;
// }

// // 임시 밈 타입 (MemeCard props와 호환)
// interface Meme {
//   id: string;
//   gifUrl: string;
//   tags: string[];
//   viewCount: number;
//   likeCount: number;
//   isLiked?: boolean;
//   uploadedAt: string;
// }

// const MyPage = () => {
//   const navigate = useNavigate();
//   const { myUser } = useUserStore();

//   // 로그인 체크 - 비로그인 시 로그인 페이지로 리다이렉트
//   useEffect(() => {
//     if (!myUser) {
//       navigate('/login');
//     }
//   }, [myUser, navigate]);
  
//   // 실제 사용자 데이터를 store에서 가져와 사용
//   const [user, setUser] = useState<User>({
//     id: myUser?.userId || '',
//     userId: myUser?.userId || '',
//     nickname: myUser?.nickname || '',
//     email: myUser?.email || '',
//     profileImage: myUser?.imgUrl || '',
//     uploadedMemesCount: 0, // API에서 가져와야 함
//     likedMemesCount: 0, // API에서 가져와야 함
//   });

//   // myUser가 변경되면 user 상태도 업데이트
//   useEffect(() => {
//     if (myUser) {
//       setUser({
//         id: myUser.userId,
//         userId: myUser.userId,
//         nickname: myUser.nickname,
//         email: myUser.email,
//         profileImage: myUser.imgUrl || '',
//         uploadedMemesCount: 0, // API에서 가져와야 함
//         likedMemesCount: 0, // API에서 가져와야 함
//       });
//     }
//   }, [myUser]);

//   // HomePage에서 사용하는 GIF URL 샘플과 동일하게 사용
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
//   const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];

//   // 임시 업로드한 밈 데이터
//   const [uploadedMemes] = useState<Meme[]>([
//     {
//       id: '1',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '해원', '귀여운'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: Math.random() > 0.5,
//       uploadedAt: '2024-01-15',
//     },
//     {
//       id: '2',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '릴리', '멋진'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: Math.random() > 0.5,
//       uploadedAt: '2024-01-14',
//     },
//     {
//       id: '3',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '설윤', '트렌디'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: Math.random() > 0.5,
//       uploadedAt: '2024-01-13',
//     },
//     {
//       id: '4',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '배이', '웃긴'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: Math.random() > 0.5,
//       uploadedAt: '2024-01-12',
//     },
//   ]);

//   // 임시 좋아요한 밈 데이터
//   const [likedMemes] = useState<Meme[]>([
//     {
//       id: '5',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '지우', '멋진'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: true,
//       uploadedAt: '2024-01-10',
//     },
//     {
//       id: '6',
//       gifUrl: getRandomGifUrl(),
//       tags: ['NMIXX', '규진', '신기한'],
//       viewCount: Math.floor(Math.random() * 50000) + 10000,
//       likeCount: Math.floor(Math.random() * 5000) + 500,
//       isLiked: true,
//       uploadedAt: '2024-01-09',
//     },
//   ]);

//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [currentTab, setCurrentTab] = useState(0);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const isSocial = Boolean((myUser as any)?.socialLogin);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setCurrentTab(newValue);
//   };

//   // 비밀번호 확인 후 편집 진입 (일반 로그인 전용)
//   const handlePasswordConfirm = async (password: string): Promise<boolean> => {
//     try {
//       const ok = await verifyPassword(password);
//       if (ok) {
//         setShowPasswordModal(false);
//         setIsEditing(true);
//         return true;
//       }
//       return false;
//     } catch {
//       return false;
//     }
//   };

//   const handleDeleteAccount = () => {
//     // 실제로는 API 호출
//     console.log('계정 삭제');
//     setShowDeleteDialog(false);
//     navigate('/');
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
//       <Header />
      
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         {/* 프로필 카드 */}
//         {isEditing && myUser ? (
//           <EditProfileCard
//             user={myUser as MyUser}
//             onCancel={() => setIsEditing(false)}
//             onUpdate={(updated) => {
//               // 로컬 표시용 user 동기화
//               setUser((prev) => ({
//                 ...prev,
//                 userId: (updated as any).userId,
//                 nickname: (updated as any).nickname,
//                 email: (updated as any).email,
//                 profileImage: (updated as any).imgUrl || '',
//               }));
//               setIsEditing(false);
//             }}
//           />
//         ) : (
//           <Card
//             sx={{
//               borderRadius: 3,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//               mb: 4,
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
//                 {/* 프로필 이미지 */}
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                   <Box sx={{ position: 'relative' }}>
//                     <Avatar
//                       src={user.profileImage}
//                       sx={{
//                         width: 120,
//                         height: 120,
//                         bgcolor: '#9333EA',
//                         fontSize: '2.5rem',
//                         fontWeight: 700,
//                       }}
//                     >
//                       {user.nickname.charAt(0).toUpperCase()}
//                     </Avatar>
//                   </Box>
//                   <Chip
//                     label={`업로드한 밈 ${user.uploadedMemesCount}개`}
//                     sx={{
//                       bgcolor: 'rgba(147, 51, 234, 0.1)',
//                       color: '#9333EA',
//                       fontWeight: 700,
//                     }}
//                   />
//                 </Box>

//                 {/* 프로필 정보 */}
//                 <Box sx={{ flex: 1 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
//                     <Typography variant="h5" fontWeight={700}>
//                       프로필 정보
//                     </Typography>

//                     <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                       <Button
//                         variant="text"
//                         size="small"
//                         onClick={() => {
//                           if (isSocial) setIsEditing(true);
//                           else setShowPasswordModal(true);
//                         }}
//                         sx={{
//                           color: '#9333EA',
//                           fontSize: '0.875rem',
//                           '&:hover': {
//                             bgcolor: 'rgba(147, 51, 234, 0.08)',
//                           },
//                         }}
//                       >
//                         프로필 수정
//                       </Button>
//                       <IconButton
//                         size="small"
//                         onClick={handleMenuOpen}
//                         sx={{
//                           color: '#6B7280',
//                         }}
//                       >
//                         <MoreVertical size={20} />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             setShowDeleteDialog(true);
//                           }}
//                           sx={{ color: '#EF4444', fontSize: '0.875rem' }}
//                         >
//                           회원탈퇴
//                         </MenuItem>
//                       </Menu>
//                     </Box>
//                   </Box>

//                   {/* 프로필 정보 항목 (읽기 전용) */}
//                   <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
//                         이메일
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.875rem' }}>
//                         {user.email}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
//                         아이디
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.875rem' }}>
//                         {user.userId}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
//                         닉네임
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.875rem' }}>
//                         {user.nickname}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         )}

//         {/* 밈 섹션 - 탭으로 구분 */}
//         <Box>
//           <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//             <Tabs
//               value={currentTab}
//               onChange={handleTabChange}
//               sx={{
//                 '& .MuiTab-root': {
//                   textTransform: 'none',
//                   fontSize: '1rem',
//                   fontWeight: 600,
//                   minHeight: 48,
//                 },
//                 '& .Mui-selected': {
//                   color: '#9333EA !important',
//                 },
//                 '& .MuiTabs-indicator': {
//                   backgroundColor: '#9333EA',
//                   height: 3,
//                 },
//               }}
//             >
//               <Tab
//                 icon={<Heart size={20} />}
//                 iconPosition="start"
//                 label={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     좋아요한 밈
//                     <Chip
//                       label={likedMemes.length}
//                       size="small"
//                       sx={{
//                         height: 20,
//                         fontSize: '0.75rem',
//                         bgcolor: currentTab === 0 ? 'rgba(147, 51, 234, 0.1)' : '#F3F4F6',
//                         color: currentTab === 0 ? '#9333EA' : '#6B7280',
//                       }}
//                     />
//                   </Box>
//                 }
//               />
//               <Tab
//                 icon={<Upload size={20} />}
//                 iconPosition="start"
//                 label={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     내가 업로드한 밈
//                     <Chip
//                       label={uploadedMemes.length}
//                       size="small"
//                       sx={{
//                         height: 20,
//                         fontSize: '0.75rem',
//                         bgcolor: currentTab === 1 ? 'rgba(147, 51, 234, 0.1)' : '#F3F4F6',
//                         color: currentTab === 1 ? '#9333EA' : '#6B7280',
//                       }}
//                     />
//                   </Box>
//                 }
//               />
//             </Tabs>
//           </Box>

//           {/* 탭 컨텐츠 */}
//           {currentTab === 0 && likedMemes.length === 0 && (
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//                 p: 6,
//                 textAlign: 'center',
//               }}
//             >
//               <Heart size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 아직 좋아요한 밈이 없습니다
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 마음에 드는 밈에 좋아요를 눌러보세요!
//               </Typography>
//             </Card>
//           )}

//           {currentTab === 1 && uploadedMemes.length === 0 && (
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//                 p: 6,
//                 textAlign: 'center',
//               }}
//             >
//               <Upload size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 아직 업로드한 밈이 없습니다
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                 첫 번째 밈을 업로드해보세요!
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={() => navigate('/upload')}
//                 sx={{
//                   bgcolor: '#9333EA',
//                   '&:hover': { bgcolor: '#7C3AED' },
//                 }}
//               >
//                 밈 업로드하기
//               </Button>
//             </Card>
//           )}

//           {((currentTab === 0 && likedMemes.length > 0) || (currentTab === 1 && uploadedMemes.length > 0)) && (
//             <MasonryGrid>
//               {(currentTab === 0 ? likedMemes : uploadedMemes).map((meme) => (
//                 <MemeCard key={meme.id} {...meme} />
//               ))}
//             </MasonryGrid>
//           )}
//         </Box>
//       </Container>

//       {/* 비밀번호 확인 모달 (일반 로그인 전용) */}
//       <PasswordConfirm
//         isOpen={showPasswordModal}
//         onClose={() => setShowPasswordModal(false)}
//         onConfirm={handlePasswordConfirm}
//       />

//       {/* 계정 삭제 확인 다이얼로그 */}
//       <Dialog
//         open={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle sx={{ fontWeight: 700 }}>
//           정말 계정을 삭제하시겠습니까?
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary">
//             계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2, gap: 1 }}>
//           <Button
//             onClick={() => setShowDeleteDialog(false)}
//             sx={{
//               color: '#6B7280',
//               '&:hover': { bgcolor: '#F9FAFB' },
//             }}
//           >
//             취소
//           </Button>
//           <Button
//             onClick={handleDeleteAccount}
//             variant="contained"
//             sx={{
//               bgcolor: '#EF4444',
//               '&:hover': { bgcolor: '#DC2626' },
//             }}
//           >
//             삭제
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default MyPage;

// src/pages/MyPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from '@mui/material';
import { Heart, Upload, MoreVertical } from 'lucide-react';
import Header from '../components/layout/Header';
import MasonryGrid from '../components/meme/MasonryGrid';
import MemeCard from '../components/meme/MemeCard';
import { useUserStore } from '../store/useUserStore';
import PasswordConfirm from '../components/common/PasswordConfirm';
import EditProfileCard from '../components/domain/user/EditProfileCard';
import { verifyPassword } from '../api/userService';
import type { MyUser } from '../types/mypage';
import { fetchMyFavoriteMemes } from '../api/memeFavorite';
import { useFavoriteMemes } from '../hooks/useFavoriteMemes';
import NicknameWithRank from '../components/common/NicknameWithRank';
import RankProgress from '../components/common/RankProgress';

// 마이페이지에서 카드에 넘길 형태
type FavoriteMemeForPage = {
  id: string;         // 문자열 id
  gifUrl: string;
  tags: string[];
  favoritedAt?: string;
};

// 임시 업로드 밈 타입 (기존 코드 유지)
interface UploadedMeme {
  id: string;
  gifUrl: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  uploadedAt: string;
}

interface User {
  id: string;
  userId: string;
  nickname: string;
  email: string;
  profileImage?: string;
  uploadedMemesCount: number;
  likedMemesCount: number;
}

const MyPage = () => {
  const navigate = useNavigate();
  const { myUser } = useUserStore();

  // ✅ 즐겨찾기 훅: 홈이랑 같은 걸 씀
  const { favoriteIds, toggleFavorite, isLoaded } = useFavoriteMemes();

  // 로그인 안 했으면 로그인으로
  useEffect(() => {
    if (!myUser) {
      navigate('/login');
    }
  }, [myUser, navigate]);

  // 프로필 표시용
  const [user, setUser] = useState<User>({
    id: myUser?.userId || '',
    userId: myUser?.userId || '',
    nickname: myUser?.nickname || '',
    email: myUser?.email || '',
    profileImage: myUser?.imgUrl || '',
    uploadedMemesCount: 0,
    likedMemesCount: 0,
  });

  // myUser 바뀌면 동기화
  useEffect(() => {
    if (myUser) {
      setUser({
        id: myUser.userId,
        userId: myUser.userId,
        nickname: myUser.nickname,
        email: myUser.email,
        profileImage: myUser.imgUrl || '',
        uploadedMemesCount: 0,
        likedMemesCount: 0,
      });
    }
  }, [myUser]);

  // 실제 즐겨찾기 목록
  const [favoriteMemes, setFavoriteMemes] = useState<FavoriteMemeForPage[]>([]);

  // 마운트 때 한 번, 그리고 훅이 서버 목록을 다 읽어온(isLoaded) 뒤에 한 번 더 가져옴
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const list = await fetchMyFavoriteMemes(); // [{memeId, memeUrl, tags, ...}]
        const mapped: FavoriteMemeForPage[] = (list || []).map((item: any) => ({
          id: String(item.memeId),
          gifUrl: item.memeUrl,
          tags: item.tags || [],
          favoritedAt: item.favoritedAt,
        }));
        setFavoriteMemes(mapped);
      } catch (e) {
        console.error('마이페이지 즐겨찾기 로드 실패:', e);
      }
    };

    // isLoaded가 true가 되면 hook 쪽 Set도 준비된 상태라 맞춰주기 좋음
    if (isLoaded) {
      loadFavorites();
    }
  }, [isLoaded]);

  // 업로드한 밈은 예전 더미 그대로
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
  ];
  const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];

  const [uploadedMemes] = useState<UploadedMeme[]>([
    {
      id: '1',
      gifUrl: getRandomGifUrl(),
      tags: ['NMIXX', '해원', '귀여운'],
      viewCount: 0,
      likeCount: 0,
      uploadedAt: '2024-01-15',
    },
    {
      id: '2',
      gifUrl: getRandomGifUrl(),
      tags: ['NMIXX', '릴리', '멋진'],
      viewCount: 0,
      likeCount: 0,
      uploadedAt: '2024-01-14',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const isSocial = Boolean((myUser as any)?.socialLogin);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 비밀번호 확인 후 편집 진입
  const handlePasswordConfirm = async (password: string): Promise<boolean> => {
    try {
      const ok = await verifyPassword(password);
      if (ok) {
        setShowPasswordModal(false);
        setIsEditing(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteAccount = () => {
    console.log('계정 삭제');
    setShowDeleteDialog(false);
    navigate('/');
  };

  // 마이페이지 카드에서 즐겨찾기 눌렀을 때
  const handleToggleFavoriteOnPage = useCallback(
    async (id: string) => {
      const isNowFavorite = favoriteIds.has(id); // 토글 전 상태
      await toggleFavorite(id);

      // 만약 지금 탭이 "좋아요한 밈"이고, 사용자가 해제한 거라면 화면 리스트에서도 빼준다
      if (isNowFavorite) {
        setFavoriteMemes((prev) => prev.filter((m) => m.id !== id));
      } else {
        // 여기서 즐겨찾기 추가한 경우는 다시 목록을 가져오도록 해도 됨
      }
    },
    [favoriteIds, toggleFavorite]
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 프로필 카드 */}
        {isEditing && myUser ? (
          <EditProfileCard
            user={myUser as MyUser}
            onCancel={() => setIsEditing(false)}
            onUpdate={(updated) => {
              setUser((prev) => ({
                ...prev,
                userId: (updated as any).userId,
                nickname: (updated as any).nickname,
                email: (updated as any).email,
                profileImage: (updated as any).imgUrl || '',
              }));
              setIsEditing(false);
            }}
          />
        ) : (
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* 아바타 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={user.profileImage}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#9333EA',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.nickname?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Chip
                    label={`업로드한 밈 ${uploadedMemes.length}개`}
                    sx={{ bgcolor: 'rgba(147, 51, 234, 0.1)', color: '#9333EA', fontWeight: 700 }}
                  />
                </Box>

                {/* 정보 */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" fontWeight={700}>
                      프로필 정보
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          if (isSocial) setIsEditing(true);
                          else setShowPasswordModal(true);
                        }}
                        sx={{
                          color: '#9333EA',
                          fontSize: '0.875rem',
                          '&:hover': { bgcolor: 'rgba(147, 51, 234, 0.08)' },
                        }}
                      >
                        프로필 수정
                      </Button>
                      <IconButton size="small" onClick={handleMenuOpen} sx={{ color: '#6B7280' }}>
                        <MoreVertical size={20} />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            setShowDeleteDialog(true);
                          }}
                          sx={{ color: '#EF4444', fontSize: '0.875rem' }}
                        >
                          회원탈퇴
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>이메일</Typography>
                      <Typography sx={{ fontSize: '0.875rem' }}>{user.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>아이디</Typography>
                      <Typography sx={{ fontSize: '0.875rem' }}>{user.userId}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>닉네임</Typography>
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        <NicknameWithRank
                          nickname={user.nickname}
                          rankLevel={myUser?.userRank?.rankLevel ?? "GREEN"}
                          badgeSize={18}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* 하단: 랭크 진행도 영역 */}
              {myUser?.userRank && (
                <Box sx={{ mt: 4 }}>
                  <RankProgress
                    rankLevel={myUser.userRank.rankLevel}
                    roomCreateCount={uploadedMemes.length}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* 탭 */}
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', fontWeight: 600, minHeight: 48 },
                '& .Mui-selected': { color: '#9333EA !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#9333EA', height: 3 },
              }}
            >
              <Tab
                icon={<Heart size={20} />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    좋아요한 밈
                    <Chip
                      label={favoriteMemes.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        bgcolor: currentTab === 0 ? 'rgba(147, 51, 234, 0.1)' : '#F3F4F6',
                        color: currentTab === 0 ? '#9333EA' : '#6B7280',
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                icon={<Upload size={20} />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    내가 업로드한 밈
                    <Chip
                      label={uploadedMemes.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        bgcolor: currentTab === 1 ? 'rgba(147, 51, 234, 0.1)' : '#F3F4F6',
                        color: currentTab === 1 ? '#9333EA' : '#6B7280',
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* 좋아요(즐겨찾기) 탭 컨텐츠 */}
          {currentTab === 0 && favoriteMemes.length === 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', p: 6, textAlign: 'center' }}>
              <Heart size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                아직 좋아요한 밈이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                마음에 드는 밈에 좋아요를 눌러보세요!
              </Typography>
            </Card>
          )}

          {currentTab === 0 && favoriteMemes.length > 0 && (
            <MasonryGrid>
              {favoriteMemes.map((meme) => (
                <MemeCard
                  key={meme.id}
                  id={meme.id}
                  gifUrl={meme.gifUrl}
                  tags={meme.tags}
                  viewCount={0}
                  likeCount={0}
                  isFavorite={isLoaded && favoriteIds.has(meme.id)}
                  onToggleFavorite={() => handleToggleFavoriteOnPage(meme.id)}
                />
              ))}
            </MasonryGrid>
          )}

          {/* 업로드한 밈 탭 */}
          {currentTab === 1 && uploadedMemes.length === 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', p: 6, textAlign: 'center' }}>
              <Upload size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                아직 업로드한 밈이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                첫 번째 밈을 업로드해보세요!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/upload')}
                sx={{ bgcolor: '#9333EA', '&:hover': { bgcolor: '#7C3AED' } }}
              >
                밈 업로드하기
              </Button>
            </Card>
          )}

          {currentTab === 1 && uploadedMemes.length > 0 && (
            <MasonryGrid>
              {uploadedMemes.map((meme) => (
                <MemeCard key={meme.id} {...meme} />
              ))}
            </MasonryGrid>
          )}
        </Box>
      </Container>

      {/* 비밀번호 확인 모달 */}
      <PasswordConfirm
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirm}
      />

      {/* 계정 삭제 다이얼로그 */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>정말 계정을 삭제하시겠습니까?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ color: '#6B7280', '&:hover': { bgcolor: '#F9FAFB' } }}>
            취소
          </Button>
          <Button onClick={handleDeleteAccount} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPage;
