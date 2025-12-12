export type Dimension = 'E/I' | 'S/N' | 'T/F' | 'J/P';
export type Direction = 'positive' | 'negative';

export interface Question {
  id: number;
  dimension: Dimension;
  direction: Direction;
  target: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  text: string;
}

export interface Answer {
  questionId: number;
  dimension: Dimension;
  score: number; // 0-4
}

export type MbtiType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MbtiTypeInfo {
  code: MbtiType;
  name: string;
  summary: string;
  keywords: string[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  celebrities: string[];
  bestMatches: MbtiType[];
  worstMatch: MbtiType;
  color: string;
  emoji: string;
}

export interface Statistics {
  stats: Record<MbtiType, number>;
  total: number;
  lastUpdated: string;
}

export interface DimensionScore {
  dimension: Dimension;
  firstScore: number;  // E, S, T, J
  secondScore: number; // I, N, F, P
}

// =====================
// Auth Types
// =====================

export interface AuthUser {
  id: string;
  email: string | null;
  nickname: string;
  profileImage: string | null;
}

export interface JwtPayload {
  sub: string; // user id
  email: string | null;
  nickname: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  user: AuthUser;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
}
