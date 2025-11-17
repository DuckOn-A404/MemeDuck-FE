import { api } from "./axiosInstance";

// 즐겨찾기 밈 아이템 타입
export interface FavoriteMemeItem {
  memeId: number;
  memeUrl: string;
}

// 즐겨찾기 목록 응답 타입
export interface FavoriteMemeResponse {
  page: number;
  size: number;
  total: number;
  items: FavoriteMemeItem[];
}

// 내 즐겨찾기 목록 조회 (페이지네이션 지원)
export async function fetchMyFavoriteMemes(page: number = 1, size: number = 10) {
  const res = await api.get<{ status: number; message: string; data: FavoriteMemeResponse }>(
    "/me/favorite-memes",
    {
      params: { page, size }
    }
  );
  return res.data?.data ?? { page: 1, size: 10, total: 0, items: [] };
}

// 즐겨찾기 추가
export async function addMemeFavorite(memeId: number) {
  return api.post(`/memes/${memeId}/favorite`);
}

// 즐겨찾기 해제
export async function removeMemeFavorite(memeId: number) {
  return api.delete(`/memes/${memeId}/favorite`);
}
