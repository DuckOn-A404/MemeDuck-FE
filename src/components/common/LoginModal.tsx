import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, IconButton, Box, Typography, TextField, Button, Divider } from "@mui/material";
import { X, Mail, LockKeyhole } from "lucide-react";
import { logIn } from "../../api/authService";
import { useUserStore } from "../../store/useUserStore";
import { buildLoginCredentials } from "../../utils/authUtils";
import { fetchMyProfile } from "../../api/userService";
import { emitTokenRefreshed } from "../../api/axiosInstance";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useUserStore((state) => state.setMyUser);
  const API_BASE_URL = import.meta.env.VITE_OAUTH2_BASE_URL ?? "";

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    const credentials = buildLoginCredentials(loginInput.trim(), password);

    try {
      await logIn(credentials);
      emitTokenRefreshed(localStorage.getItem("accessToken"));
      const userData = await fetchMyProfile();
      const userForStore = {
        ...userData,
        artistList: userData.artistList || [],
      };
      setUser(userForStore);
      onClose();
      // 페이지 새로고침하지 않고 상태만 업데이트
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleSignupClick = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 24px 48px rgba(147, 51, 234, 0.2)",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* 닫기 버튼 */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ p: 4 }}>
          {/* 로고 & 타이틀 */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              component="img"
              src="/duck.svg"
              alt="밈덕 로고"
              sx={{ height: 48, mb: 2, mx: "auto" }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              로그인
            </Typography>
            <Typography variant="body2" color="text.secondary">
              밈을 공유하고 즐기는 공간
            </Typography>
          </Box>

          {/* 이메일 입력 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              이메일(아이디)
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="이메일 또는 아이디를 입력하세요"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Mail size={20} style={{ marginRight: 8, color: "#9CA3AF" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#9333EA",
                  },
                },
              }}
            />
          </Box>

          {/* 비밀번호 입력 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              비밀번호
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <LockKeyhole size={20} style={{ marginRight: 8, color: "#9CA3AF" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#9333EA",
                  },
                },
              }}
            />
          </Box>

          {/* 에러 메시지 */}
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: "center" }}>
              아이디 또는 비밀번호를 확인해주세요.
            </Typography>
          )}

          {/* 로그인 버튼 */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
                boxShadow: "0 6px 16px rgba(147, 51, 234, 0.4)",
              },
              "&:disabled": {
                bgcolor: "#D1D5DB",
              },
            }}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          {/* 구분선 */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              또는
            </Typography>
          </Divider>

          {/* 소셜 로그인 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Google 로그인 */}
            <Button
              fullWidth
              variant="outlined"
              href={`${API_BASE_URL}/oauth2/authorization/google`}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: "#E5E7EB",
                color: "#374151",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#D1D5DB",
                  bgcolor: "#F9FAFB",
                },
              }}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.322C33.76 32.042 29.369 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.653 0 5.077.976 6.938 2.582l6.045-6.045C33.27 6.337 28.88 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.34-.138-2.651-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.145 16.093 18.727 13 24 13c2.653 0 5.077.976 6.938 2.582l6.045-6.045C33.27 6.337 28.88 4 24 4 16.318 4 9.656 8.531 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c4.737 0 9.055-1.62 12.438-4.348l-5.781-4.89C28.369 35.613 26.261 36 24 36c-5.354 0-9.748-3.525-11.341-8.307l-6.57 5.061C9.622 40.367 16.296 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.322c-1.004 2.728-3.038 5.033-5.665 6.454l.001-.001 5.781 4.89C35.186 40.869 39 37 41.5 32.5c1.468-2.708 2.111-5.933 2.111-9.417 0-1.34-.138-2.651-.389-3.917z" />
                </svg>
              }
            >
              Google로 계속하기
            </Button>
          </Box>

          {/* 회원가입 안내 */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
            계정이 없으신가요?{" "}
            <Typography
              component="span"
              variant="body2"
              onClick={handleSignupClick}
              sx={{
                color: "#9333EA",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              회원가입
            </Typography>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
