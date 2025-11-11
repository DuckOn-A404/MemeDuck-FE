import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Card, CardContent, Chip } from '@mui/material';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import Header from '../components/layout/Header';
import { getUserLeaderboard, type LeaderboardUser } from '../api/userService';
import RankBadge from '../components/common/RankBadge';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await getUserLeaderboard(0, 10);
        setLeaderboard(response.data || []);
      } catch (error) {
        console.error('리더보드 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography>로딩 중...</Typography>
        </Container>
      </Box>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // 순위별 색상 및 아이콘
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          icon: <Crown size={32} color="#FFD700" />,
          shadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
          scale: 1.1,
        };
      case 2:
        return {
          gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
          icon: <Medal size={28} color="#C0C0C0" />,
          shadow: '0 6px 24px rgba(192, 192, 192, 0.4)',
          scale: 1.05,
        };
      case 3:
        return {
          gradient: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
          icon: <Trophy size={28} color="#CD7F32" />,
          shadow: '0 6px 24px rgba(205, 127, 50, 0.4)',
          scale: 1.05,
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
          icon: <TrendingUp size={20} color="#9333EA" />,
          shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          scale: 1,
        };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Trophy size={40} color="#9333EA" />
            <Typography variant="h3" fontWeight={800} sx={{ color: '#1F2937' }}>
              Ranking
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            왕이 되려는 자 밈으로 증명하라 👑
          </Typography>
        </Box>

        {/* TOP 3 - 시상대 스타일 */}
        {top3.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>
              🏆 TOP 3
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              {/* 2위 */}
              {top3[1] && (
                <Card
                  sx={{
                    width: 240,
                    borderRadius: 4,
                    background: getRankStyle(2).gradient,
                    boxShadow: getRankStyle(2).shadow,
                    transform: `scale(${getRankStyle(2).scale})`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: `scale(${getRankStyle(2).scale + 0.05})` },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar
                        src={top3[1].profileImgUrl || '/default_image.png'}
                        sx={{ width: 80, height: 80, border: '4px solid white', mx: 'auto' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 0.5,
                        }}
                      >
                        {getRankStyle(2).icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                      {top3[1].nickname}
                    </Typography>
                    <Chip
                      label="2위"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#6B7280',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <RankBadge rankLevel={top3[1].userRank.rankLevel} size={24} />
                      <Typography sx={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>
                        {top3[1].userRank.roomCreateCount} DP
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* 1위 - 가장 크게 */}
              {top3[0] && (
                <Card
                  sx={{
                    width: 260,
                    borderRadius: 4,
                    background: getRankStyle(1).gradient,
                    boxShadow: getRankStyle(1).shadow,
                    transform: `scale(${getRankStyle(1).scale})`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: `scale(${getRankStyle(1).scale + 0.05})` },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar
                        src={top3[0].profileImgUrl || '/default_image.png'}
                        sx={{ width: 100, height: 100, border: '5px solid white', mx: 'auto' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -15,
                          right: -15,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 1,
                        }}
                      >
                        {getRankStyle(1).icon}
                      </Box>
                    </Box>
                    <Typography variant="h5" fontWeight={800} sx={{ color: 'white', mb: 0.5 }}>
                      {top3[0].nickname}
                    </Typography>
                    <Chip
                      label="👑 1위"
                      size="medium"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: '#FFD700',
                        fontWeight: 800,
                        fontSize: '1rem',
                        mb: 1.5,
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <RankBadge rankLevel={top3[0].userRank.rankLevel} size={28} />
                      <Typography sx={{ fontSize: '1rem', color: 'white', fontWeight: 700 }}>
                        {top3[0].userRank.roomCreateCount} DP
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* 3위 */}
              {top3[2] && (
                <Card
                  sx={{
                    width: 240,
                    borderRadius: 4,
                    background: getRankStyle(3).gradient,
                    boxShadow: getRankStyle(3).shadow,
                    transform: `scale(${getRankStyle(3).scale})`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: `scale(${getRankStyle(3).scale + 0.05})` },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar
                        src={top3[2].profileImgUrl || '/default_image.png'}
                        sx={{ width: 80, height: 80, border: '4px solid white', mx: 'auto' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 0.5,
                        }}
                      >
                        {getRankStyle(3).icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                      {top3[2].nickname}
                    </Typography>
                    <Chip
                      label="3위"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#6B7280',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <RankBadge rankLevel={top3[2].userRank.rankLevel} size={24} />
                      <Typography sx={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>
                        {top3[2].userRank.roomCreateCount} DP
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )}

        {/* 4-10위 - 리스트 스타일 */}
        {rest.length > 0 && (
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              📊 4위 ~ 10위
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {rest.map((user, index) => {
                const rank = index + 4;
                return (
                  <Card
                    key={user.userId}
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(147, 51, 234, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        {/* 순위 */}
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography variant="h6" fontWeight={800} sx={{ color: 'white' }}>
                            {rank}
                          </Typography>
                        </Box>

                        {/* 프로필 */}
                        <Avatar
                          src={user.profileImgUrl || '/default_image.png'}
                          sx={{ width: 60, height: 60, border: '3px solid #F3F4F6' }}
                        />

                        {/* 정보 */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                            {user.nickname}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RankBadge rankLevel={user.userRank.rankLevel} size={20} />
                            <Typography variant="body2" color="text.secondary">
                              {user.userRank.roomCreateCount} DP
                            </Typography>
                          </Box>
                        </Box>

                        {/* 랭크 레벨 배지 */}
                        <Chip
                          label={user.userRank.rankLevel}
                          sx={{
                            bgcolor: 'rgba(147, 51, 234, 0.1)',
                            color: '#9333EA',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* 빈 상태 */}
        {leaderboard.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Trophy size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary">
              아직 리더보드 데이터가 없습니다
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LeaderboardPage;
