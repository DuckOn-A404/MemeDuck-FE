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
  imgUrl?: string;
  role: "ADMIN" | "USER";
  bannedTill?: string;
  isFollowing: boolean;
  isFollower: boolean;
};
