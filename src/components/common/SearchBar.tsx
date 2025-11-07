import { useState, useEffect } from 'react';
import { Box, InputBase } from '@mui/material';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // 100px 이상 스크롤하면 헤더와 병합
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // 검색 후 입력창 초기화
    }
  };

  return (
    <Box
      sx={{
        position: isScrolled ? 'sticky' : 'relative',
        top: isScrolled ? 0 : 'auto',
        background: isScrolled
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.5) 0%, rgba(20, 184, 166, 0.95) 100%)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid' : 'none',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: isScrolled ? '0 4px 16px rgba(16, 185, 129, 0.15)' : 'none',
        zIndex: 999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {!isScrolled ? (
        // 기본 상태: 중앙 정렬된 검색창
        <Box
          sx={{
            maxWidth: '1920px',
            mx: 'auto',
            px: { xs: 2, sm: 4 },
            py: 2,
          }}
        >
          <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                px: 2,
                py: 1,
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:focus-within': {
                  bgcolor: 'white',
                  boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.5)',
                  '& svg': {
                    color: '#10B981',
                  },
                  '& input': {
                    color: '#1F2937',
                  },
                  '& input::placeholder': {
                    color: '#9CA3AF',
                  },
                },
              }}
            >
              <Search size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
              <InputBase
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e as any);
                  }
                }}
                sx={{
                  ml: 1.5,
                  flex: 1,
                  fontSize: '0.875rem',
                  color: 'white',
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        // 스크롤 상태: 로고와 검색창 병합
        <Box
          sx={{
            maxWidth: '1920px',
            mx: 'auto',
            px: { xs: 2, sm: 4 },
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideDown': {
              '0%': {
                opacity: 0,
                transform: 'translateY(-10px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '780px' }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                px: 2,
                py: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:focus-within': {
                  bgcolor: 'white',
                  boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.5)',
                  '& svg': {
                    color: '#10B981',
                  },
                  '& input': {
                    color: '#1F2937',
                  },
                  '& input::placeholder': {
                    color: '#9CA3AF',
                  },
                  '& .logo-text': {
                    color: '#10B981',
                  },
                },
              }}
            >
              {/* 로고 (검색창 내부) */}
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <img src="/duck.svg" alt="MEMEDUCK" style={{ width: '100%', height: '100%' }} />
                  </Box>
                  <Box
                    className="logo-text"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'white',
                      letterSpacing: '-0.02em',
                      display: { xs: 'none', sm: 'block' },
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    MEMEDUCK
                  </Box>
                </Box>
              </Link>

              <Box 
                sx={{ 
                  width: '1px', 
                  height: '24px', 
                  bgcolor: 'rgba(255, 255, 255, 0.3)', 
                  mx: 1,
                  transition: 'background-color 0.3s ease',
                }} 
              />

              <Search size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
              <InputBase
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e as any);
                  }
                }}
                sx={{
                  ml: 1.5,
                  flex: 1,
                  fontSize: '0.875rem',
                  color: 'white',
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
