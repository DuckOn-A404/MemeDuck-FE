import type { UserRank } from './index';

export type MyUser = {
  userId: string;
  email: string;
  nickname: string;
  artistList?: number[];
  language: string;
  role: "ADMIN" | "USER";
  followingCount: number;
  followerCount: number;
  bannedTill?: string; // 제재 당한 사용자라면 언제까지인지 날짜
  imgUrl?: string;
  penaltyList: any[];
  socialLogin?: boolean;
  userRank?: UserRank;
};

export type OtherUser = {
  userId: string;
  nickname: string;
  imgUrl?: string | null;
  following: boolean;  // 백엔드 응답 필드명
  followerCount: number;
  followingCount: number;
  roomList?: any[];  // 방 목록 (선택적)
  activeRoom?: any | null;  // 활성 방 (선택적)
  userRank?: UserRank;
};
