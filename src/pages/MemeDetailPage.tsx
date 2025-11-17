// src/pages/MemeDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Star,
  Download,
  Share2,
  Calendar,
  FileImage,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/layout/Header";
import { getMediaInfo, formatDuration } from "../utils/mediaUtils";
import { useFavoriteMemes } from "../hooks/useFavoriteMemes";
import { fetchMemeDetail, logMemeUsage } from "../api/memeService";
import ShareModal from "../components/common/ShareModal";
import { getAccessToken } from "../api/axiosInstance";
import LoginModal from "../components/common/LoginModal";

type MemeDetail = {
  id: string;
  gifUrl: string;
  tags: string[];
  uploadDate: string;
  downloadCount: number;
  likeCount: number;
  fileSize?: string | null;
  dimensions?: string | null;
  duration?: string | null;
  uploader: {
    id: string;
    nickname: string;
    profileImage: string;
  };
};

const MemeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isLoggedIn = !!getAccessToken();

  const [showLoginModal, setShowLoginModal] = useState(false);

  // 좋아요(즐겨찾기)
  const { favoriteIds, toggleFavorite } = useFavoriteMemes();
  const isFavorited = id ? favoriteIds.has(id) : false;

  // API로 받아온 밈
  const [meme, setMeme] = useState<MemeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayLikeCount, setDisplayLikeCount] = useState<number>(0);

  // 프론트에서 추가로 계산하는 메타데이터
  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const [actualDimensions, setActualDimensions] = useState<string | null>(null);
  const [actualFileSize, setActualFileSize] = useState<string | null>(null);

  const [isShareOpen, setIsShareOpen] = useState(false);

  // 1) 디테일 API 가져오기
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await fetchMemeDetail(id);
        // 백엔드 응답을 프론트 모델로 매핑
        const mapped: MemeDetail = {
          id: String(data.memeId),
          gifUrl: data.imageUrl,
          tags: data.tags ?? [],
          uploadDate: data.createdAt,
          downloadCount: data.downloadCnt ?? 0,
          likeCount: data.favoriteCnt ?? 0,
          fileSize: null,
          dimensions: null,
          duration: null,
          uploader: {
            id: data.creator?.userId ?? "",  // 계정 ID (문자열)
            nickname: data.creator?.nickname ?? "알 수 없음",
            profileImage: data.creator?.imgUrl ?? "",
          },
        };
        setMeme(mapped);
        setDisplayLikeCount(mapped.likeCount);
      } catch (e) {
        console.error("밈 디테일 가져오기 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 2) 이미지/미디어 실제 정보 프론트에서 채우기
  useEffect(() => {
    if (!meme?.gifUrl) return;

    // (a) getMediaInfo로 duration 등 가져오기 (너가 이미 쓰던 유틸)
    const loadMediaInfo = async () => {
      try {
        const mediaInfo = await getMediaInfo(meme.gifUrl);
        if (mediaInfo) {
          if (mediaInfo.duration !== null && mediaInfo.duration !== undefined) {
            setVideoDuration(formatDuration(mediaInfo.duration));
          } else if (meme.duration) {
            setVideoDuration(meme.duration);
          } else {
            setVideoDuration(null);
          }

          if (mediaInfo.dimensions) {
            setActualDimensions(mediaInfo.dimensions);
          }

          if (mediaInfo.fileSize) {
            setActualFileSize(mediaInfo.fileSize);
          }
        } else {
          setVideoDuration(meme.duration || null);
        }
      } catch (error) {
        console.error("미디어 정보 가져오기 실패:", error);
        setVideoDuration(meme.duration ?? null);
      }
    };

    // (b) 단순 이미지로 width/height만 읽기
    const loadImageSizeOnly = () => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w && h) {
          setActualDimensions(`${w} x ${h}`);
        }
      };
      img.src = meme.gifUrl;
    };

    // (c) HEAD로 content-length만 따로 시도 (CORS 안 열려 있으면 무시)
    const loadFileSize = async () => {
      try {
        const res = await fetch(meme.gifUrl, { method: "HEAD" });
        const len = res.headers.get("content-length");
        if (len) {
          const kb = Math.round(Number(len) / 1024);
          setActualFileSize(`${kb.toLocaleString()} KB`);
        }
      } catch (e) {
        // CORS 막혀도 화면은 그려야 하니까 그냥 무시
      }
    };

    // 실행
    loadMediaInfo();
    loadImageSizeOnly();
    loadFileSize();
  }, [meme?.gifUrl, meme?.duration]);

  // 태그 색상 유틸
  const getTagColors = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = (hash << 5) - hash + tag.charCodeAt(i);
    const hue = Math.abs(hash) % 360;
    const bg = `hsla(${hue}, 90%, 96%, 1)`;
    const text = `hsl(${hue}, 55%, 35%)`;
    const hoverBg = `hsla(${hue}, 95%, 90%, 1)`;
    return { bg, text, hoverBg };
  };

  // 좋아요 토글
  const handleLike = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!id || !meme) return;
    const already = isFavorited;
    setDisplayLikeCount((prev) => prev + (already ? -1 : 1));
    toggleFavorite(id);
  };

  // 다운로드
  const handleDownload = async () => {
    if (!meme) return;
    try {
      // 다운로드 로그 기록
      await logMemeUsage(Number(meme.id));
      
      // 실제 다운로드 수행
      const response = await fetch(meme.gifUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meme-${meme.id}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("다운로드 실패:", error);
    }
  };

  // 공유
  const handleShare = () => {
    if (!meme) return;
    navigator.clipboard.writeText(window.location.href);
    setIsShareOpen(true)
  }

  // 업로더 클릭
  const handleUploaderClick = () => {
    if (!meme) return;
    navigate(`/user/${meme.uploader.id}`);
  };

  // 로딩 화면
  if (loading || !meme) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFA" }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            뒤로가기
          </Button>
          <Typography>밈 정보를 불러오는 중입니다...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFA" }}>
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* 뒤로가기 */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: "#6B7280",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "rgba(147, 51, 234, 0.08)",
              color: "#9333EA",
            },
          }}
        >
          뒤로가기
        </Button>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 4,
          }}
        >
          {/* 왼쪽: 이미지 */}
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "none",
                position: "relative",
                bgcolor: "transparent",
                maxWidth: { xs: "100%", md: 960 },
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#FAFAFA",
                }}
              >
                <Box
                  component="img"
                  src={meme.gifUrl}
                  alt="meme"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: { xs: "60vh", md: "72vh" },
                    display: "block",
                  }}
                />
              </Box>
            </Card>

            {/* 액션 버튼들 */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={
                  <Star
                    size={20}
                    strokeWidth={2.5}
                    color={isFavorited ? "#facc15" : "white"}
                    fill={isFavorited ? "#facc15" : "transparent"}
                  />
                }
                onClick={handleLike}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  py: 1.5,
                  borderRadius: 3,
                  background: isFavorited
                    ? "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
                    : "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 4px 16px rgba(147, 51, 234, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 24px rgba(147, 51, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                좋아요 {displayLikeCount.toLocaleString()}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Download size={20} />}
                onClick={handleDownload}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: "#9333EA",
                  color: "#9333EA",
                  borderWidth: 2,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "#9333EA",
                    bgcolor: "rgba(147, 51, 234, 0.08)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                다운로드
              </Button>

              <IconButton
                onClick={handleShare}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  border: "2px solid #E5E7EB",
                  color: "#6B7280",
                  "&:hover": {
                    borderColor: "#9333EA",
                    color: "#9333EA",
                    bgcolor: "rgba(147, 51, 234, 0.08)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Share2 size={24} />
              </IconButton>
            </Box>
          </Box>

          {/* 오른쪽 패널 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 업로더 정보 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                업로드한 유저
              </Typography>
              <Box
                onClick={handleUploaderClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  p: 2,
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(147, 51, 234, 0.05)",
                  },
                }}
              >
                <Avatar
                  src={meme.uploader.profileImage}
                  sx={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {meme.uploader.nickname.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={700}>
                    {meme.uploader.nickname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    프로필 보기
                  </Typography>
                </Box>
                {/* <User size={18} color="#9333EA" /> */}
              </Box>
            </Box>

            {/* 태그 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                태그
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {meme.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    onClick={() => navigate(`/search/${tag}`)}
                    size="small"
                    sx={{
                      bgcolor: getTagColors(tag).bg,
                      color: getTagColors(tag).text,
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      border: "none",
                      borderRadius: "6px",
                      "&:hover": {
                        bgcolor: getTagColors(tag).hoverBg,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* 상세 정보 */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                상세 정보
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* 날짜 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Calendar size={16} color="#9333EA" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      업로드 날짜
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                      {meme.uploadDate
                        ? new Date(meme.uploadDate).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </Typography>
                  </Box>
                </Box>

                {/* 파일 크기 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <FileImage size={16} color="#9333EA" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      파일 크기
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                      {actualFileSize || meme.fileSize || "알 수 없음"}
                    </Typography>
                  </Box>
                </Box>

                {/* 이미지 크기 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Maximize2 size={16} color="#9333EA" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      이미지 크기
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                      {actualDimensions || meme.dimensions || "알 수 없음"}
                    </Typography>
                  </Box>
                </Box>

                {/* 다운로드 수 */}
                {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Download size={16} color="#9333EA" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      다운로드 수
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                      {meme.downloadCount.toLocaleString()}회
                    </Typography>
                  </Box>
                </Box> */}

                {/* 재생 시간 (있을 때만) */}
                {videoDuration && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9333EA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      sx={{ width: 16, height: 16, flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                        재생 시간
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                        {videoDuration}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* 공유 모달 */}
      <ShareModal 
        open={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        link={window.location.href} 
      />

      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </Box>
  );
};

export default MemeDetailPage;
