import { useState, useCallback, useRef } from 'react';

interface Meme {
  id: string;
  gifUrl: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
}

interface UseInfiniteMemesOptions {
  initialLimit?: number;
  apiEndpoint?: string;
}

export const useInfiniteMemes = (options: UseInfiniteMemesOptions = {}) => {
  const { initialLimit = 12, apiEndpoint = '/api/memes' } = options;
  
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pageRef = useRef(0);  // 현재 페이지 (0부터 시작)
  const retryCountRef = useRef(0);

  // 화면 크기에 따른 최적 로딩 개수
  const getOptimalLoadCount = useCallback(() => {
    if (typeof window === 'undefined') return initialLimit;
    
    const width = window.innerWidth;
    const columnCount = width < 600 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 4;
    return columnCount * 3; // 컬럼 수 * 3줄
  }, [initialLimit]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const limit = getOptimalLoadCount();
      const offset = pageRef.current * limit;
      
      const url = new URL(apiEndpoint, window.location.origin);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const newMemes: Meme[] = data.memes || data.data || [];
      const totalCount: number | undefined = data.total;

      // 중복 제거 (ID 기반) - offset 방식에서도 안전장치
      setMemes((prev) => {
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMemes = newMemes.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMemes];
      });

      // 페이지 증가
      pageRef.current += 1;
      
      // 더 이상 데이터가 없는지 확인
      // 1. 응답 데이터가 limit보다 적으면 마지막 페이지
      // 2. total이 있으면 offset + limit >= total인지 확인
      if (newMemes.length < limit) {
        setHasMore(false);
      } else if (totalCount !== undefined && offset + limit >= totalCount) {
        setHasMore(false);
      }

      // 성공 시 재시도 카운트 리셋
      retryCountRef.current = 0;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '밈을 불러오는데 실패했습니다';
      setError(errorMessage);
      console.error('Failed to load memes:', err);

      // 자동 재시도 (최대 3회, 지수 백오프)
      if (retryCountRef.current < 3) {
        const delay = 2000 * Math.pow(2, retryCountRef.current);
        retryCountRef.current += 1;
        
        setTimeout(() => {
          loadMore();
        }, delay);
      }

    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, apiEndpoint, getOptimalLoadCount]);

  // 초기 로드
  const initialize = useCallback(() => {
    setMemes([]);
    setHasMore(true);
    setError(null);
    pageRef.current = 0;
    retryCountRef.current = 0;
    loadMore();
  }, [loadMore]);

  // 수동 재시도
  const retry = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    loadMore();
  }, [loadMore]);

  return {
    memes,
    isLoading,
    hasMore,
    error,
    loadMore,
    initialize,
    retry,
    currentPage: pageRef.current,
  };
};
