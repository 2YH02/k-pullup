export interface User {
  userId: number;
  username: string;
  email: string;
  provider?: "google" | "naver" | "kakao" | "website";
  chulbong?: boolean;
  reportCount?: number;
  markerCount?: number;
  error?: string;
}
