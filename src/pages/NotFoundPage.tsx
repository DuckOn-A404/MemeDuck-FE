import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />
      
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 100px)',
            textAlign: 'center',
            py: 8,
          }}
        >
          {/* 404 아이콘 */}
          <Box
            sx={{
              position: 'relative',
              mb: 4,
            }}
          >
            <AlertCircle
              size={120}
              strokeWidth={1.5}
              style={{
                color: '#FF6B9D',
                opacity: 0.2,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              404
            </Typography>
          </Box>

          {/* 메시지 */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            페이지를 찾을 수 없습니다
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 5,
              maxWidth: '500px',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.7,
            }}
          >
            요청하신 페이지 같은 건 없어요~
          </Typography>

          {/* 액션 버튼들 */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home size={20} />}
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#667eea',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  bgcolor: '#5568d3',
                  boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              홈으로 돌아가기
            </Button>
          </Box>

          {/* 데코레이션 요소 */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: 0.1,
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              opacity: 0.1,
              filter: 'blur(50px)',
              zIndex: 0,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
