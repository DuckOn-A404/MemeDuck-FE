/**
 * 미디어 파일의 재생 시간을 가져오는 유틸리티 함수
 * GIF, MP4, WebM 등의 파일에서 duration을 추출합니다
 */

import { Reader } from 'ts-gif';

// GIF 시그니처 검사 (GIF87a / GIF89a)
const isGifBuffer = (ab: ArrayBuffer): boolean => {
  const sig = new Uint8Array(ab.slice(0, 6));
  const header = String.fromCharCode(...sig);
  return header === 'GIF87a' || header === 'GIF89a';
};

/**
 * GIF 파일의 재생 시간을 계산합니다
 * @param url - GIF 파일 URL
 * @returns 재생 시간 (초 단위) 또는 null
 */
export const getGifDuration = async (url: string): Promise<number | null> => {
  try {
    const response = await fetch(url, { headers: { Accept: 'image/gif' } });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('image/gif')) {
      throw new Error(`NOT_GIF_CONTENT_TYPE:${contentType}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!isGifBuffer(arrayBuffer)) {
      throw new Error('NOT_GIF');
    }
    const reader = new Reader(arrayBuffer);
    
    // 모든 프레임의 delay를 합산
    let totalDelay = 0;
    const frameCount = reader.numFrames();
    
    for (let i = 0; i < frameCount; i++) {
      const frame = reader.frameInfo(i);
      // delay는 1/100초 단위, 0이면 기본값 10 (0.1초) 사용
      totalDelay += frame.delay || 10;
    }
    
    // delay는 1/100초 단위이므로 100으로 나눔
    return totalDelay / 100;
  } catch (error) {
    console.warn('ts-gif로 GIF duration 가져오기 실패:', error);
    // 폴백 없이 null 반환 (정확하지 않은 정보 노출 방지)
    return null;
  }
};

/**
 * GIF 파일의 상세 정보를 가져옵니다
 * @param url - GIF 파일 URL
 * @returns GIF 정보 객체 또는 null
 */
export const getGifInfo = async (url: string) => {
  try {
    const response = await fetch(url, { headers: { Accept: 'image/gif' } });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('image/gif')) {
      throw new Error(`NOT_GIF_CONTENT_TYPE:${contentType}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!isGifBuffer(arrayBuffer)) {
      throw new Error('NOT_GIF');
    }
    const reader = new Reader(arrayBuffer);
    
    // 재생 시간 계산
    let totalDelay = 0;
    const frameCount = reader.numFrames();
    
    // 첫 프레임에서 크기 정보 가져오기
    const firstFrame = frameCount > 0 ? reader.frameInfo(0) : null;
    
    for (let i = 0; i < frameCount; i++) {
      const frame = reader.frameInfo(i);
      totalDelay += frame.delay || 10;
    }
    
    return {
      width: firstFrame?.width || 0,
      height: firstFrame?.height || 0,
      frameCount,
      duration: totalDelay / 100, // 초 단위
    };
  } catch (error) {
    // 폴백 없이 실패로 처리
    console.warn('ts-gif로 GIF 파싱 실패:', error);
    return null;
  }
};

/**
 * 비디오/GIF 파일의 재생 시간을 가져옵니다
 * @param url - 미디어 파일 URL
 * @returns 재생 시간 (초 단위) 또는 null
 */
export const getMediaDuration = async (url: string): Promise<number | null> => {
  // 파일 확장자 확인
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (extension === 'gif') {
    // ts-gif를 사용하여 정확한 GIF 재생 시간 계산
    return await getGifDuration(url);
  }

  // 비디오 파일 (mp4, webm 등)
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      resolve(duration);
    };
    
    video.onerror = () => {
      resolve(null);
    };
    
    video.src = url;
  });
};

/**
 * 초를 "X.X초" 형식의 문자열로 변환
 * @param seconds - 초 단위 시간
 * @returns 포맷된 문자열
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}초`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (remainingSeconds === 0) {
    return `${minutes}분`;
  }
  
  return `${minutes}분 ${remainingSeconds}초`;
};

/**
 * 이미지의 실제 크기를 가져옵니다
 * @param url - 이미지 URL
 * @returns {width, height} 또는 null
 */
export const getImageDimensions = async (url: string): Promise<{ width: number; height: number } | null> => {
  // GIF 파일인 경우 ts-gif로 정확한 크기 가져오기
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (extension === 'gif') {
    try {
      const gifInfo = await getGifInfo(url);
      if (gifInfo) {
        return {
          width: gifInfo.width,
          height: gifInfo.height,
        };
      }
    } catch (error) {
      console.error('GIF 크기 가져오기 실패:', error);
    }
  }

  // 일반 이미지
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      resolve(null);
    };
    
    img.src = url;
  });
};

/**
 * 파일 URL에서 파일 크기를 추정합니다 (실제로는 서버에서 제공해야 함)
 * @param url - 파일 URL
 * @returns 파일 크기 (바이트) 또는 null
 */
export const getFileSize = async (url: string): Promise<number | null> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    
    if (contentLength) {
      return parseInt(contentLength, 10);
    }
    
    return null;
  } catch (error) {
    console.error('파일 크기 가져오기 실패:', error);
    return null;
  }
};

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 * @param bytes - 바이트 수
 * @returns 포맷된 문자열 (예: "2.4 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * 미디어 파일의 모든 정보를 한 번에 가져옵니다
 * @param url - 미디어 파일 URL
 * @returns 미디어 정보 객체
 */
export const getMediaInfo = async (url: string) => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  try {
    if (extension === 'gif') {
      // GIF 파일의 경우 ts-gif로 모든 정보 가져오기
      const [gifInfo, fileSize] = await Promise.all([
        getGifInfo(url),
        getFileSize(url),
      ]);
      
      // ts-gif 성공시에만 반환 (폴백 제거)
      if (gifInfo) {
        return {
          type: 'gif' as const,
          width: gifInfo.width,
          height: gifInfo.height,
          duration: gifInfo.duration,
          frameCount: gifInfo.frameCount,
          fileSize: fileSize ? formatFileSize(fileSize) : null,
          dimensions: `${gifInfo.width} x ${gifInfo.height}`,
        };
      }
      // 실패 시 명확히 null 반환
      return null;
    } else {
      // 비디오 파일
      const [duration, dimensions, fileSize] = await Promise.all([
        getMediaDuration(url),
        getImageDimensions(url),
        getFileSize(url),
      ]);
      
      return {
        type: 'video' as const,
        width: dimensions?.width || 0,
        height: dimensions?.height || 0,
        duration,
        fileSize: fileSize ? formatFileSize(fileSize) : null,
        dimensions: dimensions ? `${dimensions.width} x ${dimensions.height}` : null,
      };
    }
  } catch (error) {
    console.error('미디어 정보 가져오기 실패:', error);
    return null;
  }
};
