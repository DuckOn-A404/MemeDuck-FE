import { useState } from 'react';
import { Box, InputBase, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Search, Upload, User, UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직
    console.log('로그아웃');
    handleUserMenuClose();
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.5) 0%, rgba(20, 184, 166, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          maxWidth: '1920px',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* 로고 */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ fontSize: '1.75rem', lineHeight: 1 }}>🦆</Box>
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

        {/* 검색바 */}
        <Box sx={{ flexGrow: 1, maxWidth: '600px', mx: 'auto' }}>
          <Box
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

        {/* 우측 버튼들 */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 1,
                bgcolor: 'white',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  '& svg': {
                    color: '#059669',
                  },
                  '& .upload-text': {
                    color: '#059669',
                  },
                },
              }}
            >
              <Upload size={16} color="#10B981" strokeWidth={2.5} />
              <Box
                className="upload-text"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#10B981',
                  display: { xs: 'none', sm: 'block' },
                  transition: 'color 0.2s ease',
                }}
              >
                업로드
              </Box>
            </Box>
          </Link>

          <Box
            onClick={handleUserMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              bgcolor: open ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.6)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <User size={18} color="white" strokeWidth={2.5} />
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
                  bgcolor: 'rgba(16, 185, 129, 0.08)',
                },
              }}
            >
              <ListItemIcon>
                <UserCircle size={20} color="#10B981" strokeWidth={2} />
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
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
