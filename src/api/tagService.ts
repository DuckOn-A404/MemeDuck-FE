import { api } from './axiosInstance';

/**
 * 인기 태그 아이템 인터페이스
 */
export interface TrendingTagItem {
  tagId: number;
  tagName: string;
  count: number;
}

/**
 * 인기 태그 조회 응답 인터페이스
 */
export interface TrendingTagsResponse {
  status: number;
  message: string;
  data: TrendingTagItem[];
}

/**
 * 실시간 인기 태그 조회 API
 * GET /api/tags/trending
 * 
 * @param range - 조회 기간 ('TEN_MINUTES' | 'HOUR' | 'DAY'), 기본값: 'HOUR'
 * @param size - 조회할 태그 개수, 기본값: 10
 * @returns 인기 태그 목록
 */
export const getTrendingTags = async (
  range: 'TEN_MINUTES' | 'HOUR' | 'DAY' = 'TEN_MINUTES',
  size: number = 10
): Promise<TrendingTagsResponse> => {
  const response = await api.get<TrendingTagsResponse>('/tags/trending', {
    params: {
      range,
      size,
    },
  });

  return response.data;
};

/**
 * 태그 검색 로그 기록 응답 인터페이스
 */
export interface SearchLogResponse {
  status: number;
  message: string;
  data: string;
}

/**
 * 태그 검색 키워드 로그 기록 API
 * POST /api/tags/search/log
 * 
 * @param keyword - 검색한 키워드
 * @returns 로그 기록 결과
 */
export const logSearchKeyword = async (
  keyword: string
): Promise<SearchLogResponse> => {
  const response = await api.post<SearchLogResponse>('/tags/search/log', {
    keyword,
  });

  return response.data;
};
