// // md_frontend/src/hooks/useFavoriteMemes.ts
// import { useEffect, useState, useCallback } from "react";
// import {
//   fetchMyFavoriteMemes,
//   addMemeFavorite,
//   removeMemeFavorite,
// } from "../api/memeFavorite";

// // 내 즐겨찾기된 memeId들을 들고 있고, 토글해주는 훅
// export function useFavoriteMemes() {
//   const [favoriteIds, setFavoriteIds] = useState<Set<string | number>>(new Set());

//   // 앱 켜질 때 한 번 가져오기
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await fetchMyFavoriteMemes(1, 100); // 처음엔 100개만
//         const ids = (data?.memeList ?? []).map((m: any) => m.memeId);
//         setFavoriteIds(new Set(ids));
//       } catch (e) {
//         console.error("즐겨찾기 목록 불러오기 실패:", e);
//       }
//     })();
//   }, []);

//   const toggleFavorite = useCallback(
//     async (memeId: string | number) => {
//       const isFav = favoriteIds.has(memeId);

//       // 먼저 화면에 반영 (낙관적 업데이트)
//       setFavoriteIds((prev) => {
//         const next = new Set(prev);
//         if (isFav) next.delete(memeId);
//         else next.add(memeId);
//         return next;
//       });

//       try {
//         if (isFav) {
//           await removeMemeFavorite(memeId);
//         } else {
//           await addMemeFavorite(memeId);
//         }
//       } catch (e) {
//         // 실패하면 롤백
//         console.error("즐겨찾기 토글 실패:", e);
//         setFavoriteIds((prev) => {
//           const next = new Set(prev);
//           if (isFav) next.add(memeId);
//           else next.delete(memeId);
//           return next;
//         });
//       }
//     },
//     [favoriteIds]
//   );

//   return { favoriteIds, toggleFavorite };
// }

// src/hooks/useFavoriteMemes.ts
import { useEffect, useState, useCallback } from "react";
import {
  fetchMyFavoriteMemes,
  addMemeFavorite,
  removeMemeFavorite,
} from "../api/memeFavorite";

// id를 비교용으로 통일하는 함수
// - 화면에서 온 값이 "trending-37" 이면 → "37"
// - "2" 이면 → "2"
// - 5 이면 → "5"
// - 숫자를 못 뽑겠다? 그러면 원본을 그대로 string으로
function normalizeId(raw: string | number): { key: string; numeric: number | null } {
  if (typeof raw === "number") {
    return { key: String(raw), numeric: raw };
  }

  // "123" 같은 순수 숫자
  if (/^\d+$/.test(raw)) {
    return { key: raw, numeric: Number(raw) };
  }

  // 끝에 붙은 숫자만 뽑기 ("trending-123" -> 123)
  const matched = /(\d+)$/.exec(raw);
  if (matched) {
    return { key: matched[1], numeric: Number(matched[1]) };
  }

  // 숫자 아예 없으면 그냥 원본
  return { key: raw, numeric: null };
}

export function useFavoriteMemes() {
  // 항상 "문자열 숫자"로만 넣어둘 거라 타입을 string으로 고정
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // 1) 처음에 내 즐겨찾기 목록 불러오기
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchMyFavoriteMemes();
        // 서버가 [{ memeId: 1, ... }] 이렇게 주니까 "1" 이런 식으로 통일
        const next = new Set<string>();
        for (const item of list) {
          if (item?.memeId != null) {
            next.add(String(item.memeId));
          }
        }
        setFavoriteIds(next);
      } catch (err) {
        console.error("failed to load favorites:", err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // 2) 토글 함수
  const toggleFavorite = useCallback(
    async (rawId: string | number) => {
      const { key, numeric } = normalizeId(rawId);
      const already = favoriteIds.has(key);

      // 화면 먼저 토글 (옵티미스틱)
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (already) next.delete(key);
        else next.add(key);
        return next;
      });

      // 서버 호출 (숫자 뽑혔을 때만)
      if (numeric == null) {
        return;
      }

      try {
        if (already) {
          await removeMemeFavorite(numeric);
        } else {
          await addMemeFavorite(numeric);
        }
      } catch (e) {
        console.error("favorite toggle failed, rollback:", e);
        // 실패 시 다시 되돌림
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (already) next.add(key);
          else next.delete(key);
          return next;
        });
      }
    },
    [favoriteIds]
  );

  return {
    favoriteIds, // Set<string> (예: "1", "2", "37")
    toggleFavorite,
    isLoaded, // 목록 로딩 끝났는지
  };
}

