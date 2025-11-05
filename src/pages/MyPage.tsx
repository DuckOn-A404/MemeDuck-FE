import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
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
import {
  Camera,
  Save,
  X,
  Heart,
  Upload,
  MoreVertical,
} from 'lucide-react';
import Header from '../components/layout/Header';
import MasonryGrid from '../components/meme/MasonryGrid';
import MemeCard from '../components/meme/MemeCard';

// 임시 사용자 타입
interface User {
  id: string;
  userId: string;
  nickname: string;
  email: string;
  profileImage?: string;
  uploadedMemesCount: number;
  likedMemesCount: number;
}

// 임시 밈 타입 (MemeCard props와 호환)
interface Meme {
  id: string;
  gifUrl: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  uploadedAt: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  
  // 임시 사용자 데이터 (실제로는 API에서 가져옴)
  const [user, setUser] = useState<User>({
    id: '1',
    userId: 'memelover123',
    nickname: 'MemeLover',
    email: 'memelover@example.com',
    profileImage: '',
    uploadedMemesCount: 24,
    likedMemesCount: 15,
  });

  // HomePage에서 사용하는 GIF URL 샘플과 동일하게 사용
  const gifUrls = [
    'https://media1.tenor.com/m/elCp2_fukbwAAAAC/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
    'https://media1.tenor.com/m/hOjxKIQML6YAAAAC/%EC%A2%8B%EB%B9%A0%EA%B0%80-%EC%9C%A4%EC%84%9D%EC%97%B4.gif',
    'https://media1.tenor.com/m/tOKJBiXdgmUAAAAC/%ED%95%9C%EA%B5%AD%EC%98%81%ED%99%94.gif',
    'https://media1.tenor.com/m/hFbzrQZ1oNEAAAAC/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
    'https://media1.tenor.com/m/9NVSJSAuVhUAAAAd/%EC%9D%B4%EC%9E%AC%EB%AA%85-%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9.gif',
  ];
  const getRandomGifUrl = () => gifUrls[Math.floor(Math.random() * gifUrls.length)];

  // 임시 업로드한 밈 데이터
  const [uploadedMemes] = useState<Meme[]>([
    {
      id: '1',
      gifUrl: getRandomGifUrl(),
      tags: ['BTS', '웃긴', '댄스'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
      uploadedAt: '2024-01-15',
    },
    {
      id: '2',
      gifUrl: getRandomGifUrl(),
      tags: ['블랙핑크', '귀여운'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
      uploadedAt: '2024-01-14',
    },
    {
      id: '3',
      gifUrl: getRandomGifUrl(),
      tags: ['뉴진스', '트렌디'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
      uploadedAt: '2024-01-13',
    },
    {
      id: '4',
      gifUrl: getRandomGifUrl(),
      tags: ['SEVENTEEN', '웃긴'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: Math.random() > 0.5,
      uploadedAt: '2024-01-12',
    },
  ]);

  // 임시 좋아요한 밈 데이터
  const [likedMemes] = useState<Meme[]>([
    {
      id: '5',
      gifUrl: getRandomGifUrl(),
      tags: ['아이브', '멋진'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: true,
      uploadedAt: '2024-01-10',
    },
    {
      id: '6',
      gifUrl: getRandomGifUrl(),
      tags: ['에스파', '신기한'],
      viewCount: Math.floor(Math.random() * 50000) + 10000,
      likeCount: Math.floor(Math.random() * 5000) + 500,
      isLiked: true,
      uploadedAt: '2024-01-09',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 저장
      setUser(editedUser);
      // 실제로는 API 호출
    } else {
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // 실제로는 API 호출
    console.log('계정 삭제');
    setShowDeleteDialog(false);
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 프로필 카드 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* 프로필 이미지 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={isEditing ? editedUser.profileImage : user.profileImage}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#10B981',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {(isEditing ? editedUser.nickname : user.nickname).charAt(0).toUpperCase()}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: '#10B981',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#059669',
                        },
                      }}
                    >
                      <Camera size={20} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </IconButton>
                  )}
                </Box>
                
                {!isEditing && (
                  <Chip
                    label={`업로드한 밈 ${user.uploadedMemesCount}개`}
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      fontWeight: 700,
                    }}
                  />
                )}
              </Box>

              {/* 프로필 정보 */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700}>
                    프로필 정보
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {!isEditing && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleEditToggle}
                        sx={{
                          color: '#10B981',
                          fontSize: '0.875rem',
                          '&:hover': {
                            bgcolor: 'rgba(16, 185, 129, 0.05)',
                          },
                        }}
                      >
                        프로필 수정
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{
                        color: '#6B7280',
                      }}
                    >
                      <MoreVertical size={20} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
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

                {/* 프로필 정보 항목 */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isEditing ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
                          닉네임
                        </Typography>
                        <TextField
                          size="small"
                          value={editedUser.nickname}
                          onChange={(e) => setEditedUser({ ...editedUser, nickname: e.target.value })}
                          sx={{ flex: 1, maxWidth: 300 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Save size={18} />}
                          onClick={handleEditToggle}
                          sx={{
                            bgcolor: '#10B981',
                            '&:hover': { bgcolor: '#059669' },
                          }}
                        >
                          저장
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<X size={18} />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: '#E5E7EB',
                            color: '#6B7280',
                          }}
                        >
                          취소
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
                          이메일
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem' }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
                          아이디
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem' }}>
                          {user.userId}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>
                          닉네임
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem' }}>
                          {user.nickname}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 밈 섹션 - 탭으로 구분 */}
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: '#10B981 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#10B981',
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<Heart size={20} />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    좋아요한 밈
                    <Chip
                      label={likedMemes.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        bgcolor: currentTab === 0 ? 'rgba(16, 185, 129, 0.1)' : '#F3F4F6',
                        color: currentTab === 0 ? '#059669' : '#6B7280',
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
                        bgcolor: currentTab === 1 ? 'rgba(16, 185, 129, 0.1)' : '#F3F4F6',
                        color: currentTab === 1 ? '#059669' : '#6B7280',
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* 탭 컨텐츠 */}
          {currentTab === 0 && likedMemes.length === 0 && (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                p: 6,
                textAlign: 'center',
              }}
            >
              <Heart size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                아직 좋아요한 밈이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                마음에 드는 밈에 좋아요를 눌러보세요!
              </Typography>
            </Card>
          )}

          {currentTab === 1 && uploadedMemes.length === 0 && (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                p: 6,
                textAlign: 'center',
              }}
            >
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
                sx={{
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                밈 업로드하기
              </Button>
            </Card>
          )}

          {((currentTab === 0 && likedMemes.length > 0) || (currentTab === 1 && uploadedMemes.length > 0)) && (
            <MasonryGrid>
              {(currentTab === 0 ? likedMemes : uploadedMemes).map((meme) => (
                <MemeCard key={meme.id} {...meme} />
              ))}
            </MasonryGrid>
          )}
        </Box>
      </Container>

      {/* 계정 삭제 확인 다이얼로그 */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          정말 계정을 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{
              color: '#6B7280',
              '&:hover': { bgcolor: '#F9FAFB' },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            sx={{
              bgcolor: '#EF4444',
              '&:hover': { bgcolor: '#DC2626' },
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPage;
