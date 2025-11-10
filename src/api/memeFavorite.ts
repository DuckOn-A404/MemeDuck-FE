import { api } from "./axiosInstance";

// 내 즐겨찾기 목록 조회
export async function fetchMyFavoriteMemes() {
  const res = await api.get("/memes/favorites");
  return res.data?.data ?? [];
}

// 즐겨찾기 추가
export async function addMemeFavorite(memeId: number) {
  return api.post(`/memes/${memeId}/favorite`);
}

// 즐겨찾기 해제
export async function removeMemeFavorite(memeId: number) {
  return api.delete(`/memes/${memeId}/favorite`);
}
