import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Copy } from "lucide-react";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  link: string;
};

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, link }) => {
  const [copied, setCopied] = useState(false);

  // 모달이 열릴 때마다 복사 상태 리셋
  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (err) {
      console.error("링크 복사 실패:", err);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* modal */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "white",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          p: 4,
          minWidth: 360,
          textAlign: "center",
          zIndex: 1301,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}
        >
          친구에게 밈을 공유해보세요!
        </Typography>

        {/* 링크 박스 + 복사 버튼 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: "12px",
            py: 1,
            px: 1.5,
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              textAlign: "left",
              color: "#1f2937",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={link}
          >
            {link}
          </Typography>
          <IconButton
            onClick={handleCopy}
            sx={{
              border: "1.5px solid #9333EA",
              bgcolor: "white",
              width: 34,
              height: 34,
              borderRadius: "9999px",
              color: copied ? "#9333EA" : "#9333EA",
            }}
          >
            <Copy size={18} />
          </IconButton>
        </Box>

        {/* 복사되었을 때만 표시 (이제는 모달 열 때마다 초기화됨) */}
        {copied && (
          <Typography
            variant="caption"
            sx={{
              color: "#16a34a",
              fontWeight: 600,
              mb: 2,
              display: "block",
            }}
          >
            링크가 복사되었습니다 ✅
          </Typography>
        )}

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            mt: copied ? 1 : 2,
            borderRadius: "9999px",
            px: 4,
            background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              background:
                "linear-gradient(135deg, #a855f7 0%, #f472b6 100%)",
            },
          }}
        >
          닫기
        </Button>
      </Box>
    </Box>
  );
};

export default ShareModal;
