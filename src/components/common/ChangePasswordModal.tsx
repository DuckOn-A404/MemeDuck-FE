import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { changePassword } from "../../api/userService";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

// 영문/숫자/특수문자 각 1개 이상 + 공백 불가 + 8자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const validate = (): boolean => {
    let ok = true;

    if (!currentPassword.trim()) {
      setCurrentPasswordError("현재 비밀번호를 입력해주세요.");
      ok = false;
    } else {
      setCurrentPasswordError("");
    }

    if (!newPassword.trim()) {
      setNewPasswordError("새 비밀번호를 입력해주세요.");
      ok = false;
    } else if (!PASSWORD_REGEX.test(newPassword)) {
      setNewPasswordError("영문, 숫자, 특수문자를 각각 1자 이상 포함하고 최소 8자여야 합니다.");
      ok = false;
    } else {
      setNewPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("새 비밀번호 확인을 입력해주세요.");
      ok = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("새 비밀번호와 일치하지 않습니다.");
      ok = false;
    } else {
      setConfirmPasswordError("");
    }

    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await changePassword(currentPassword, newPassword);

      if (res.status === 200) {
        setSuccess("비밀번호를 성공적으로 변경했습니다.");
        setTimeout(() => {
          handleClose();
        }, 1500);
        return;
      }

      setError(res.message || "비밀번호 변경에 실패했습니다.");
    } catch (err: any) {
      const status = err?.response?.status;
      const message: string | undefined = err?.response?.data?.message;

      if (status === 401) {
        setCurrentPasswordError("현재 비밀번호가 올바르지 않습니다.");
        setError("현재 비밀번호가 올바르지 않습니다.");
      } else if (status === 400) {
        if (message?.includes("동일한 비밀번호")) {
          setError("이전과 동일한 비밀번호로는 변경할 수 없습니다.");
        } else if (message?.includes("보안 정책")) {
          setNewPasswordError("새로운 비밀번호가 보안 정책에 맞지 않습니다.");
          setError("새로운 비밀번호가 보안 정책에 맞지 않습니다.");
        } else {
          setError(message || "비밀번호 변경에 실패했습니다.");
        }
      } else {
        setError("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    if (value && !PASSWORD_REGEX.test(value)) {
      setNewPasswordError("영문, 숫자, 특수문자를 각각 1자 이상 포함하고 최소 8자여야 합니다.");
    } else {
      setNewPasswordError("");
    }

    if (confirmPassword && confirmPassword !== value) {
      setConfirmPasswordError("새 비밀번호와 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (newPassword && newPassword !== value) {
      setConfirmPasswordError("새 비밀번호와 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
        비밀번호 변경
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Box sx={{ py: 4 }}>
            <Typography align="center" color="success.main" sx={{ fontWeight: 600 }}>
              {success}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              type="password"
              label="현재 비밀번호"
              fullWidth
              size="small"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setCurrentPasswordError("");
                setError("");
              }}
              error={!!currentPasswordError}
              helperText={currentPasswordError}
              disabled={loading}
            />

            <TextField
              type="password"
              label="새 비밀번호"
              fullWidth
              size="small"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              error={!!newPasswordError}
              helperText={newPasswordError || "영문/숫자/특수문자 포함, 8자 이상"}
              disabled={loading}
            />

            <TextField
              type="password"
              label="새 비밀번호 확인"
              fullWidth
              size="small"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={loading}
            />

            {error && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ flex: 1, color: "#6B7280", "&:hover": { bgcolor: "#F9FAFB" } }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              flex: 1,
              bgcolor: "#9333EA",
              "&:hover": { bgcolor: "#7C3AED" },
            }}
          >
            {loading ? "변경 중..." : "변경하기"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ChangePasswordModal;
