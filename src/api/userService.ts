import { api } from "./axiosInstance";
import type { MyUser, OtherUser } from "../types/mypage";
import type { UserRank } from "../types";

// 현재 사용자 정보 조회
export const fetchMyProfile = async (): Promise<MyUser> => {
  const response = await api.get<MyUser>("/me");
  return response.data;
};

// 타 유저 정보 조회
export const fetchOtherUserProfile = async (
  otherUserId: string,
  myUserIdOrNull?: string | null
): Promise<OtherUser> => {
  const params: Record<string, string> = {};
  if (myUserIdOrNull) {
    params.myUserIdOrNull = myUserIdOrNull;
  }
  
  const response = await api.get<OtherUser>(`/users/${otherUserId}`, {
    params,
    skipAuth: true, // JWT 필요 없음 (공개 API)
  });
  return response.data;
};

// 비밀번호 검증 (일반 로그인 계정)
export const verifyPassword = async (password: string): Promise<boolean> => {
  const res = await api.post<{ valid: boolean }>("/me/verify-password", { password });
  return res.data?.valid === true;
};

// 사용자 프로필 업데이트 (변경된 값만 전송, 파일은 선택했을 때만)
export const updateUserProfile = async (formData: FormData): Promise<MyUser> => {
  const fd = new FormData();

  for (const [key, value] of formData.entries()) {
    if (key === "profileImg") {
      if (value instanceof File && value.size > 0) {
        fd.append("profileImg", value);
      }
      continue; // 비어있으면 전송 안 함
    }

    if (typeof value === "string") {
      const v = value.trim();
      if (v !== "") fd.append(key, v);
      continue;
    }

    fd.append(key, value as any);
  }

  const res = await api.patch<MyUser>("/me", fd);
  return res.data;
};

// 비밀번호 변경 API
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ status: number; message: string; data?: string }> => {
  const response = await api.patch("/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 리더보드 유저 타입
export interface LeaderboardUser {
  nickname: string;
  userId: string;
  profileImgUrl: string;
  userRank: UserRank;
}

// 리더보드 응답 타입
export interface LeaderboardResponse {
  status: number;
  message: string;
  data: LeaderboardUser[];
}

// 유저 리더보드 조회 (TOP 10)
export const getUserLeaderboard = async (
  page: number = 0,
  size: number = 10
): Promise<LeaderboardResponse> => {
  const response = await api.get<LeaderboardResponse>("/users/leaderboard", {
    params: { page, size },
  });
  return response.data;
};
