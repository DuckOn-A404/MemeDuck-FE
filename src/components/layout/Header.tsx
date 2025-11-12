import { useState, useEffect, useRef } from 'react';
import { Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider, InputBase, Avatar } from '@mui/material';
import { Upload, UserCircle, LogOut, Search, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { logSearchKeyword } from '../../api/tagService';

interface HeaderProps {
  showSearchBar?: boolean;
}

const Header = ({ showSearchBar = false }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  // 로그인 상태 확인
  const { myUser, logout } = useUserStore();

  useEffect(() => {
    if (!showSearchBar) return;

    const handleScroll = () => {
      // 마우스 휠 한 틱 정도면 반응하도록 임계값을 낮춤
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSearchBar]);

  // 스크롤 머지/분리 시에도 포커스 유지
  useEffect(() => {
    if (!showSearchBar) return;
    if (searchFocused) {
      // 다음 틱에 포커스 복원 (레이아웃 전환 완료 후)
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isScrolled, searchFocused, showSearchBar]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      // 1. 검색 로그 기록 (비동기, 실패해도 검색은 진행)
      logSearchKeyword(q).catch((err) => {
        console.warn('검색 로그 기록 실패:', err);
      });
      
      // 2. 검색 페이지로 이동
      navigate(`/search/${encodeURIComponent(q)}`);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleUserIconClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!myUser) {
      // 비로그인 상태면 로그인 페이지로 이동
      navigate('/login');
    } else {
      // 로그인 상태면 메뉴 열기
      handleUserMenuOpen(event);
    }
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(to right, rgba(124, 58, 237, 0.95), rgba(236, 72, 153, 0.95))',
          backdropFilter: 'blur(12px) saturate(180%)',
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.25)',
          zIndex: 1000,
        }}
      >
        <LayoutGroup>
          <Box
            component={motion.div}
            layout
            sx={{
              maxWidth: '1920px',
              mx: 'auto',
              px: { xs: 2, sm: 4 },
              py: 0,
              height: '72px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              transition: 'all 0.3s ease',
            }}
          >
          {/* 로고 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center' }}>
                  <img src="/duck.svg" alt="MEMEDUCK" style={{ width: '100%', height: '100%' }} />
                </Box>
                <Box
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '-0.02em',
                    display: { xs: 'none', sm: 'block' },
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  MEMEDUCK
                </Box>
              </Box>
            </Link>
            
            {/* DuckOn 링크 버튼 */}
            <Box
              component="a"
              href="https://duckon.site"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                px: 2,
                py: 0.75,
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              DuckOn
            </Box>
          </Box>

          {/* 검색창 (스크롤 시 헤더 내부) */}
          {showSearchBar && isScrolled && (
            <motion.div
              layoutId="search-bar"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
              style={{ flexGrow: 1, maxWidth: '600px' }}
            >
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 3,
                  px: 2,
                  height: 40,
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:focus-within': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.5)',
                    borderColor: 'rgba(147, 51, 234, 0.5)',
                    '& svg': {
                      color: '#9333EA',
                    },
                    '& input': {
                      color: '#1F2937',
                    },
                    '& input::placeholder': {
                      color: '#6B7280',
                    },
                  },
                }}
              >
                <Search size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
                <InputBase
                  placeholder="검색"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  inputRef={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // 강제 제출
                      handleSearchSubmit(e as any);
                    }
                  }}
                />
              </Box>
            </motion.div>
          )}

          {/* 스크롤 전에는 동일 폭의 숨김 placeholder로 레이아웃 고정 */}
          {showSearchBar && !isScrolled && (
            <Box sx={{ flexGrow: 1, maxWidth: '600px', visibility: 'hidden' }} />
          )}

          {/* 우측 버튼들 */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {/* 리더보드 버튼 */}
            <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    '& .leaderboard-text': {
                      color: '#FFD700',
                    },
                  },
                }}
              >
                <Trophy size={16} color="white" strokeWidth={2.5} />
                <Box
                  className="leaderboard-text"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'white',
                    display: { xs: 'none', sm: 'block' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  랭킹
                </Box>
              </Box>
            </Link>

            {/* 업로드 버튼 */}
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: 'white',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 6px 20px rgba(147, 51, 234, 0.3)',
                    '& svg': {
                      color: '#7C3AED',
                    },
                    '& .upload-text': {
                      color: '#7C3AED',
                    },
                  },
                }}
              >
                <Upload size={16} color="#9333EA" strokeWidth={2.5} />
                <Box
                  className="upload-text"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#9333EA',
                    display: { xs: 'none', sm: 'block' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  업로드
                </Box>
              </Box>
            </Link>

            {myUser ? (
              <>
                {/* 로그인 상태: 닉네임 + 유저 아이콘 + 랭크 뱃지 */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {myUser.nickname}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    onClick={handleUserIconClick}
                    src={myUser?.imgUrl || '/default_image.png'}
                    sx={{
                      width: 36,
                      height: 36,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    {myUser?.nickname?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  {/* 랭크 뱃지 - 프로필 오른쪽 */}
                  {myUser.userRank && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={`/badge/${myUser.userRank.rankLevel.toLowerCase()}_badge.png`}
                        alt={myUser.userRank.rankLevel}
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                      />
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <>
                {/* 비로그인 상태: 로그인 + 회원가입 */}
                <Box
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 2.5,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                >
                  로그인
                </Box>
                <Box
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 2.5,
                    py: 1,
                    bgcolor: 'white',
                    borderRadius: 3,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#9333EA',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.3)',
                      color: '#7C3AED',
                    },
                  }}
                >
                  회원가입
                </Box>
              </>
            )}
          </Box>
        </Box>

          {/* 하단: 검색바 (absolute positioning으로 레이아웃 플로우에서 분리) */}
          {showSearchBar && !isScrolled && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 999,
                background: 'transparent',
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  maxWidth: '1920px',
                  mx: 'auto',
                  px: { xs: 2, sm: 4 },
                  py: 0,
                }}
              >
                <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                  <motion.div
                    layoutId="search-bar"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                    style={{ marginTop: 24 }}
                  >
                    <Box
                      component="form"
                      onSubmit={handleSearchSubmit}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        borderRadius: 3,
                        px: 2,
                        height: 40,
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        '&:focus-within': {
                          bgcolor: 'white',
                          boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.4)',
                          borderColor: 'rgba(147, 51, 234, 0.5)',
                          '& svg': {
                            color: '#9333EA',
                          },
                          '& input': {
                            color: '#1F2937',
                          },
                          '& input::placeholder': {
                            color: '#6B7280',
                          },
                        },
                        pointerEvents: 'auto',
                      }}
                    >
                      <Search size={18} color="#9333EA" strokeWidth={2} />
                      <InputBase
                        placeholder="검색"
                        sx={{
                          ml: 1.5,
                          flex: 1,
                          fontSize: '0.875rem',
                          color: '#1F2937',
                          '& input::placeholder': {
                            color: '#6B7280',
                            opacity: 1,
                          },
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        inputRef={inputRef}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            // 강제 제출
                            handleSearchSubmit(e as any);
                          }
                        }}
                      />
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </Box>
          )}
        </LayoutGroup>
      </Box>

      {/* 유저 메뉴 드롭다운 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem
          component={Link}
          to="/mypage"
          onClick={handleUserMenuClose}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(147, 51, 234, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <UserCircle size={20} color="#9333EA" strokeWidth={2} />
          </ListItemIcon>
          <ListItemText
            primary="마이페이지"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          />
        </MenuItem>
        
        <Divider sx={{ my: 0.5 }} />
        
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <LogOut size={20} color="#EF4444" strokeWidth={2} />
          </ListItemIcon>
          <ListItemText
            primary="로그아웃"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#EF4444',
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
