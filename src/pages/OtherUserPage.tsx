import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Upload } from 'lucide-react';
import Header from '../components/layout/Header';
import MasonryGrid from '../components/meme/MasonryGrid';
import MemeCard from '../components/meme/MemeCard';
import { useUserStore } from '../store/useUserStore';
import { fetchOtherUserProfile } from '../api/userService';
import { fetchUserMemes, type UserMemeItem } from '../api/memeService';
import type { OtherUser } from '../types/mypage';
import NicknameWithRank from '../components/common/NicknameWithRank';
import RankProgress from '../components/common/RankProgress';

// 업로드한 밈 타입
interface UploadedMeme {
  id: string;
  gifUrl: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
}

const OtherUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { myUser } = useUserStore();

  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [uploadedMemes, setUploadedMemes] = useState<UploadedMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  // 무한스크롤 상태
  const [memesPage, setMemesPage] = useState(1);
  const [memesTotal, setMemesTotal] = useState(0);
  const [memesLoading, setMemesLoading] = useState(false);
  const memesObserverTarget = useRef<HTMLDivElement>(null);

  // 유저 정보 및 밈 목록 로드
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        // 타 유저 기본 정보 조회
        const myUserId = myUser?.userId || null;
        const userResponse = await fetchOtherUserProfile(userId, myUserId);
        setOtherUser(userResponse);

        // 업로드한 밈 목록 조회
        const memesResponse = await fetchUserMemes(userId, 1, 20);
        const mapped: UploadedMeme[] = (memesResponse.data.items || []).map((item: UserMemeItem) => ({
          id: String(item.memeId),
          gifUrl: item.memeUrl,
          tags: [],
          viewCount: 0,
          likeCount: 0,
        }));
        setUploadedMemes(mapped);
        setMemesPage(1);
        setMemesTotal(memesResponse.data.total);
      } catch (error) {
        console.error('유저 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, navigate]);

  // 무한스크롤 - 업로드한 밈 추가 로드
  const loadMoreMemes = async () => {
    if (memesLoading || !userId) return;
    if (uploadedMemes.length >= memesTotal) return;

    setMemesLoading(true);
    try {
      const nextPage = memesPage + 1;
      const response = await fetchUserMemes(userId, nextPage, 20);
      const mapped: UploadedMeme[] = (response.data.items || []).map((item: UserMemeItem) => ({
        id: String(item.memeId),
        gifUrl: item.memeUrl,
        tags: [],
        viewCount: 0,
        likeCount: 0,
      }));
      setUploadedMemes(prev => [...prev, ...mapped]);
      setMemesPage(nextPage);
    } catch (error) {
      console.error('밈 목록 로드 실패:', error);
    } finally {
      setMemesLoading(false);
    }
  };

  // IntersectionObserver로 무한스크롤 구현
  useEffect(() => {
    if (!memesObserverTarget.current) return;
    if (uploadedMemes.length >= memesTotal) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !memesLoading) {
          loadMoreMemes();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = memesObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [uploadedMemes.length, memesTotal, memesLoading]);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography>로딩 중...</Typography>
        </Container>
      </>
    );
  }

  if (!otherUser) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography>사용자를 찾을 수 없습니다.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          {/* 프로필 카드 - MyPage와 동일한 디자인 */}
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* 상단: 아바타 + 정보 */}
              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                {/* 아바타 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={otherUser.imgUrl || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#9333EA',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {otherUser.nickname?.charAt(0).toUpperCase()}
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
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>아이디</Typography>
                      <Typography sx={{ fontSize: '0.875rem' }}>{otherUser.userId}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ width: 100, color: '#6B7280', fontSize: '0.875rem' }}>닉네임</Typography>
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        <NicknameWithRank
                          nickname={otherUser.nickname}
                          rankLevel={otherUser.userRank?.rankLevel ?? "GREEN"}
                          badgeSize={18}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* 하단: 랭크 진행도 영역 */}
              {otherUser.userRank && (
                <Box sx={{ mt: 4 }}>
                  <RankProgress
                    rankLevel={otherUser.userRank.rankLevel}
                    roomCreateCount={uploadedMemes.length}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* 탭 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                icon={<Upload size={20} />}
                label={`업로드한 밈 (${uploadedMemes.length})`}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* 업로드한 밈 탭 */}
          {currentTab === 0 && uploadedMemes.length === 0 && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Upload size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="h6" gutterBottom>
                  업로드한 밈이 없습니다
                </Typography>
              </CardContent>
            </Card>
          )}

          {currentTab === 0 && uploadedMemes.length > 0 && (
            <>
              <MasonryGrid>
                {uploadedMemes.map((meme) => (
                  <MemeCard
                    key={meme.id}
                    id={meme.id}
                    gifUrl={meme.gifUrl}
                    tags={meme.tags}
                    viewCount={meme.viewCount}
                    likeCount={meme.likeCount}
                    isFavorite={false}
                  />
                ))}
              </MasonryGrid>

              {/* 무한스크롤 트리거 */}
              {uploadedMemes.length < memesTotal && (
                <Box ref={memesObserverTarget} sx={{ textAlign: 'center', py: 4 }}>
                  {memesLoading && (
                    <Typography variant="body2" color="text.secondary">
                      로딩 중...
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

    </>
  );
};

export default OtherUserPage;
