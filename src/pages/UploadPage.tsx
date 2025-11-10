import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Upload,
  X,
  Tag,
  FileVideo,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { useUserStore } from '../store/useUserStore';
import { createMemes } from '../api/memeService';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  tags: string[];
  tagInput: string;
}

const UploadPage = () => {
  const navigate = useNavigate();
  const { myUser } = useUserStore();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // 드래그 앤 드롭 설정
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // 최대 3개까지만 업로드 가능
    const remainingSlots = 3 - uploadedFiles.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) return;

    const newFiles = filesToAdd.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading' as const,
      tags: [],
      tagInput: '',
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // 각 파일에 대해 업로드 시뮬레이션
    newFiles.forEach(newFile => {
      simulateUpload(newFile.id);
    });
  }, [uploadedFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: 3,
    multiple: true,
    disabled: uploadedFiles.length >= 3,
  });

  // 업로드 시뮬레이션
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress } : f)
      );

      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'success' } : f)
        );
      }
    }, 200);
  };

  // 파일 제거
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // 특정 파일의 태그 입력 업데이트
  const updateTagInput = (fileId: string, value: string) => {
    setUploadedFiles(prev =>
      prev.map(f => f.id === fileId ? { ...f, tagInput: value } : f)
    );
  };

  // 특정 파일에 태그 추가
  const addTag = (fileId: string) => {
    setUploadedFiles(prev =>
      prev.map(f => {
        if (f.id === fileId) {
          const trimmedTag = f.tagInput.trim();
          if (trimmedTag && !f.tags.includes(trimmedTag) && f.tags.length < 10) {
            return { ...f, tags: [...f.tags, trimmedTag], tagInput: '' };
          }
        }
        return f;
      })
    );
  };

  // 특정 파일의 태그 제거
  const removeTag = (fileId: string, tagToRemove: string) => {
    setUploadedFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, tags: f.tags.filter(tag => tag !== tagToRemove) } : f
      )
    );
  };

  // Enter 키로 태그 추가
  const handleTagKeyPress = (fileId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(fileId);
    }
  };

  // 제출
  const handleSubmit = async () => {
    // 로그인 체크
    if (!myUser) {
      setShowLoginAlert(true);
      return;
    }

    // 모든 파일이 최소 1개의 태그를 가지고 있는지 확인
    const allFilesHaveTags = uploadedFiles.every(f => f.tags.length > 0);
    if (uploadedFiles.length === 0 || !allFilesHaveTags) return;

    setIsSubmitting(true);
    
    try {
      // 파일과 태그 배열 준비
      const files = uploadedFiles.map(f => f.file);
      const tags = uploadedFiles.map(f => f.tags);

      // API 호출
      const response = await createMemes(files, tags);
      
      console.log('밈 업로드 성공:', response);
      
      // 성공 시 홈으로 이동
      navigate('/');
    } catch (error) {
      console.error('밈 업로드 실패:', error);
      alert('밈 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로그인 알림 닫기
  const handleCloseLoginAlert = () => {
    setShowLoginAlert(false);
  };

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    navigate('/login');
  };

  // 가이드 스텝 데이터
  const guideSteps = [
    {
      step: 1,
      title: '지원 파일 형식',
      description: 'GIF, MP4, WebM 형식의 파일을 업로드할 수 있습니다.',
      icon: '📁',
    },
    {
      step: 2,
      title: '적절한 태그 추가',
      description: '밈을 쉽게 찾을 수 있도록 관련 태그를 추가해주세요.',
      icon: '🏷️',
    },
    {
      step: 3,
      title: '저작권 준수',
      description: '저작권을 침해하지 않는 콘텐츠만 업로드해주세요.',
      icon: '⚖️',
    },
    {
      step: 4,
      title: '커뮤니티 가이드라인',
      description: '부적절하거나 공격적인 콘텐츠는 삭제될 수 있습니다.',
      icon: '✅',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Header />
      
      <Container 
        maxWidth={false}
        sx={{ 
          py: 4,
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
        }}
      >
        {/* 헤더 */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                borderRadius: 3,
                p: 2,
                display: 'inline-flex',
                boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
              }}
            >
              <Sparkles size={40} color="white" />
            </Box>
          </Box>
          <Typography 
            variant="h3" 
            fontWeight={800}
            sx={{
              background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            밈 업로드
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            K-POP 밈을 공유하고 다른 사람들과 함께 즐겨보세요
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
            gap: 3,
            width: '100%',
          }}
        >
          {/* 왼쪽: 업로드 영역 */}
          <Box>
            {/* 파일 업로드 드롭존 */}
            {uploadedFiles.length === 0 ? (
              <Paper
                {...getRootProps()}
                sx={{
                  p: 6,
                  minHeight: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px dashed',
                  borderColor: isDragActive ? '#9333EA' : '#D1D5DB',
                  bgcolor: isDragActive ? 'rgba(16, 185, 129, 0.05)' : 'white',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  '&:hover': {
                    borderColor: '#9333EA',
                    bgcolor: 'rgba(16, 185, 129, 0.02)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <input {...getInputProps()} />
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'rgba(147, 51, 234, 0.1)',
                    mb: 3,
                  }}
                >
                  <Upload size={48} color="#9333EA" />
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {isDragActive ? '여기에 놓아주세요' : '파일을 드래그하거나 클릭하세요'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  GIF, MP4, WebM 파일을 업로드할 수 있습니다
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  최대 3개 파일 · 파일당 최대 100MB
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 각 밈마다 하나의 카드로 묶음 (밈 + 태그) */}
                {uploadedFiles.map((file, index) => (
                  <Paper
                    key={file.id}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: file.tags.length === 0 ? '2px solid #FEE2E2' : '1px solid #E5E7EB',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                      {/* 왼쪽: 밈 미리보기 */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <FileVideo size={24} color="#9333EA" />
                          밈 #{index + 1}
                        </Typography>
                        
                        <Box
                          sx={{
                            position: 'relative',
                            border: '1px solid #E5E7EB',
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: '#F9FAFB',
                          }}
                        >
                          {/* 미리보기 이미지 */}
                          <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#F3F4F6' }}>
                            <Box
                              component="img"
                              src={file.preview}
                              alt="Preview"
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                            <IconButton
                              onClick={() => removeFile(file.id)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.8)',
                                },
                              }}
                            >
                              <X size={18} />
                            </IconButton>
                          </Box>

                          {/* 파일 정보 */}
                          <Box sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <FileVideo size={16} color="#6B7280" />
                              <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                                {file.file.name}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>

                            {/* 업로드 상태 */}
                            {file.status === 'uploading' && (
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={file.progress}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: '#E5E7EB',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#9333EA',
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Box>
                            )}

                            {file.status === 'success' && (
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle2 size={14} color="#9333EA" />
                                <Typography variant="caption" color="#9333EA" fontWeight={600}>
                                  업로드 완료
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* 오른쪽: 태그 입력 */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Tag size={24} color="#9333EA" />
                          태그 입력 {file.tags.length === 0 && <Typography component="span" variant="caption" color="error">(필수)</Typography>}
                        </Typography>
                        
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="태그를 입력하고 Enter를 누르세요"
                              value={file.tagInput}
                              onChange={(e) => updateTagInput(file.id, e.target.value)}
                              onKeyPress={(e) => handleTagKeyPress(file.id, e)}
                              disabled={file.tags.length >= 10}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#9333EA',
                                  },
                                },
                              }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => addTag(file.id)}
                              disabled={!file.tagInput.trim() || file.tags.length >= 10}
                              sx={{
                                bgcolor: '#9333EA',
                                borderRadius: 2,
                                px: 2,
                                minWidth: 'auto',
                                '&:hover': {
                                  bgcolor: '#7C3AED',
                                },
                              }}
                            >
                              +
                            </Button>
                          </Box>
                          
                          {/* 태그 목록 */}
                          {file.tags.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {file.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="medium"
                                  onDelete={() => removeTag(file.id, tag)}
                                  sx={{
                                    bgcolor: 'rgba(147, 51, 234, 0.1)',
                                    color: '#9333EA',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    height: 36,
                                    borderRadius: 2,
                                    '& .MuiChip-label': {
                                      px: 2,
                                    },
                                    '& .MuiChip-deleteIcon': {
                                      color: '#9333EA',
                                      fontSize: '20px',
                                      '&:hover': {
                                        color: '#7C3AED',
                                      },
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                              최소 1개의 태그를 추가해주세요 (최대 10개)
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}

                {/* 추가 업로드 버튼 */}
                {uploadedFiles.length < 3 && (
                  <Paper
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed #D1D5DB',
                      borderRadius: 3,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      bgcolor: isDragActive ? 'rgba(147, 51, 234, 0.05)' : 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      '&:hover': {
                        borderColor: '#9333EA',
                        bgcolor: 'rgba(147, 51, 234, 0.02)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <Upload size={40} color="#9333EA" style={{ marginBottom: 12 }} />
                    <Typography variant="h6" fontWeight={700} color="#9333EA" gutterBottom>
                      + 추가 업로드
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {3 - uploadedFiles.length}개 더 추가 가능
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>

          {/* 오른쪽: 가이드 */}
          <Box sx={{ width: '100%' }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                position: { lg: 'sticky' },
                top: 100,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* 카드뉴스 헤더 */}
                <Box sx={{ p: 2.5, borderBottom: '1px solid #F3F4F6' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Info size={24} color="#9333EA" />
                    <Typography variant="h6" fontWeight={700}>
                      업로드 가이드
                    </Typography>
                  </Box>
                  {/* 인디케이터 */}
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 2, justifyContent: 'center' }}>
                    {guideSteps.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: `${100 / guideSteps.length}%`,
                          height: 3,
                          bgcolor: index === currentGuideStep ? '#9333EA' : '#E5E7EB',
                          borderRadius: 1,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* 카드뉴스 컨텐츠 (좌우 스크롤) */}
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      transition: 'transform 0.3s ease',
                      transform: `translateX(-${currentGuideStep * 100}%)`,
                    }}
                  >
                    {guideSteps.map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          minWidth: '100%',
                          p: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          minHeight: 280,
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '4rem',
                            mb: 2,
                          }}
                        >
                          {step.icon}
                        </Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom color="#1F2937">
                          {step.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                          {step.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* 좌우 네비게이션 버튼 */}
                  {currentGuideStep > 0 && (
                    <Box
                      onClick={() => setCurrentGuideStep(prev => prev - 1)}
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '2px solid #9333EA',
                        '&:hover': {
                          bgcolor: '#9333EA',
                          transform: 'translateY(-50%) scale(1.1)',
                          boxShadow: '0 6px 16px rgba(147, 51, 234, 0.4)',
                          '& svg': {
                            color: 'white',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-50%) scale(0.95)',
                        },
                      }}
                    >
                      <Box component="svg" width="24" height="24" viewBox="0 0 24 24" fill="none" sx={{ color: '#9333EA', transition: 'color 0.2s ease' }}>
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </Box>
                    </Box>
                  )}
                  {currentGuideStep < guideSteps.length - 1 && (
                    <Box
                      onClick={() => setCurrentGuideStep(prev => prev + 1)}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '2px solid #9333EA',
                        '&:hover': {
                          bgcolor: '#9333EA',
                          transform: 'translateY(-50%) scale(1.1)',
                          boxShadow: '0 6px 16px rgba(147, 51, 234, 0.4)',
                          '& svg': {
                            color: 'white',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-50%) scale(0.95)',
                        },
                      }}
                    >
                      <Box component="svg" width="24" height="24" viewBox="0 0 24 24" fill="none" sx={{ color: '#9333EA', transition: 'color 0.2s ease' }}>
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* 업로드 버튼 */}
                <Box sx={{ p: 2.5, borderTop: '1px solid #F3F4F6' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={uploadedFiles.length === 0 || !uploadedFiles.every(f => f.tags.length > 0) || isSubmitting}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: '#9333EA',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                      '&:hover': {
                        bgcolor: '#7C3AED',
                        boxShadow: '0 6px 16px rgba(147, 51, 234, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: '#D1D5DB',
                      },
                    }}
                  >
                    {isSubmitting ? '업로드 중...' : '밈 업로드'}
                  </Button>
                </Box>

                <Box sx={{ display: 'none' }}>
                  {/* 가이드 항목 1 */}
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        color: '#9333EA',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      지원 파일 형식
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      GIF, MP4, WebM 형식의 파일을 업로드할 수 있습니다.
                    </Typography>
                  </Box>

                  <Divider />

                  {/* 가이드 항목 2 */}
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        color: '#9333EA',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      적절한 제목과 태그
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      밈을 쉽게 찾을 수 있도록 명확한 제목과 관련 태그를 추가해주세요.
                    </Typography>
                  </Box>

                  <Divider />

                  {/* 가이드 항목 3 */}
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        color: '#9333EA',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      3
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      저작권 준수
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      저작권을 침해하지 않는 콘텐츠만 업로드해주세요.
                    </Typography>
                  </Box>

                  <Divider />

                  {/* 가이드 항목 4 */}
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        color: '#9333EA',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      4
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      커뮤니티 가이드라인
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      부적절하거나 공격적인 콘텐츠는 삭제될 수 있습니다.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* 로그인 필요 알림 Dialog */}
      <Dialog
        open={showLoginAlert}
        onClose={handleCloseLoginAlert}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          로그인이 필요합니다
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            밈을 업로드하려면 로그인이 필요합니다.
            <br />
            로그인 페이지로 이동하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseLoginAlert}
            sx={{
              color: '#6B7280',
              '&:hover': { bgcolor: '#F9FAFB' },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleGoToLogin}
            variant="contained"
            sx={{
              bgcolor: '#9333EA',
              '&:hover': { bgcolor: '#7C3AED' },
            }}
          >
            로그인하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadPage;
