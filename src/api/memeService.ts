import { api } from './axiosInstance';

export interface MemeCreateResponse {
  status: number;
  message: string;
  data: {
    memes: Array<{
      memeId: number;
      imageUrl: string;
      tags: string[];
    }>;
  };
}

export interface MemeItem {
  memeId: number;
  memeUrl: string;
  tags: string[];
}

export interface RandomMemesResponse {
  status: number;
  message: string;
  data: {
    page: number;
    size: number;
    total: number;
    items: MemeItem[];
  };
}

/**
 * 밈 생성 API
 * POST /api/memes/create
 * 
 * @param files - 업로드할 파일 배열 (최대 3개)
 * @param tags - 각 파일에 대응하는 태그 배열
 * @returns 생성된 밈 정보
 */
export const createMemes = async (
  files: File[],
  tags: string[][]
): Promise<MemeCreateResponse> => {
  const formData = new FormData();

  // 파일과 태그를 FormData에 추가
  files.forEach((file, index) => {
    const fileKey = `image${index + 1}`;
    const tagsKey = `tags${index + 1}`;
    
    formData.append(fileKey, file);
    
    // 태그는 배열로 전송
    tags[index].forEach((tag) => {
      formData.append(tagsKey, tag);
    });
  });

  const response = await api.post<MemeCreateResponse>('/memes/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 랜덤 밈 조회 API
 * GET /api/memes/random
 * 
 * @param page - 페이지 번호 (기본값: 1)
 * @param size - 페이지 크기 (기본값: 10)
 * @returns 랜덤 밈 목록
 */
export const getRandomMemes = async (
  page: number = 1,
  size: number = 10
): Promise<RandomMemesResponse> => {
  const response = await api.get<RandomMemesResponse>('/memes/random', {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 밈 top 10 조회 api
export interface TopMemesResponse {
  status: number;
  message: string;
  data: {
    page: number;
    size: number;
    total: number;
    items: MemeItem[];
  };
}

export const getTopMemes = async (): Promise<TopMemesResponse> => {
  const response = await api.get<TopMemesResponse>('/memes/top/total');
  return response.data;
}

export async function fetchMemeDetail(memeId: number | string) {
  const res = await api.get(`/memes/${memeId}/detail`);
  return res.data.data;  
}
/**
 * 밈 사용/다운로드 로그 기록 API
 * POST /api/memes/usage
 * 
 * @param memeId - 밈 ID
 * @param usageType - 사용 타입 ('USE' | 'DOWNLOAD')
 * @returns 응답 데이터
 */
export interface MemeUsageRequest {
  memeId: number;
  usageType: 'USE' | 'DOWNLOAD';
}

export interface MemeUsageResponse {
  status: number;
  message: string;
  data: string;
}

export const logMemeUsage = async (
  memeId: number
): Promise<MemeUsageResponse> => {
  const response = await api.post<MemeUsageResponse>('/memes/usage', {
    memeId,
    usageType: 'DOWNLOAD',
  });

  return response.data;
};

/**
 * 내가 만든 밈 목록 조회 API
 * GET /api/memes/mine
 * 
 * @param page - 페이지 번호 (기본값: 1)
 * @param size - 페이지 크기 (기본값: 10)
 * @returns 내가 생성한 밈 목록
 */
export interface MyMemeItem {
  memeId: number;
  imageUrl: string;
  createdAt: string;
  usageCnt: number;
  downloadCnt: number;
}

export interface MyMemesResponse {
  status: number;
  message: string;
  data: MyMemeItem[];
}

export const getMyMemes = async (
  page: number = 1,
  size: number = 10
): Promise<MyMemesResponse> => {
  const response = await api.get<MyMemesResponse>('/memes/mine', {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

/**
 * 태그 기반 밈 검색 API
 * GET /api/memes/search-basic
 * 
 * @param tag - 검색할 태그 (부분 일치)
 * @param page - 페이지 번호 (기본값: 1)
 * @param size - 페이지 크기 (기본값: 10)
 * @returns 검색된 밈 목록
 */
export interface SearchMemesResponse {
  status: number;
  message: string;
  data: {
    page: number;
    size: number;
    total: number;
    items: MemeItem[];
  };
}

export const searchMemesByTag = async (
  tag: string,
  page: number = 1,
  size: number = 10
): Promise<SearchMemesResponse> => {
  const response = await api.get<SearchMemesResponse>('/memes/search-basic', {
    params: {
      tag,
      page,
      size,
    },
  });

  return response.data;
};
