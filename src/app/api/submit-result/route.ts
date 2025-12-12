import { NextRequest, NextResponse } from 'next/server';
import { MbtiType } from '@/lib/types';

// In-memory storage (for MVP without database)
// In production, this would be replaced with a database
const VALID_MBTI_TYPES: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

// Global stats storage (persisted in memory during server runtime)
declare global {
  // eslint-disable-next-line no-var
  var mbtiStats: Record<MbtiType, number> | undefined;
  // eslint-disable-next-line no-var
  var totalTests: number | undefined;
}

// Initialize stats if not exists
if (!global.mbtiStats) {
  global.mbtiStats = {
    INTJ: 5234, INTP: 4123, ENTJ: 3456, ENTP: 4567,
    INFJ: 6789, INFP: 7890, ENFJ: 5678, ENFP: 8901,
    ISTJ: 4321, ISFJ: 5432, ESTJ: 3210, ESFJ: 4321,
    ISTP: 2345, ISFP: 3456, ESTP: 2234, ESFP: 3345,
  };
  global.totalTests = Object.values(global.mbtiStats).reduce((sum, count) => sum + count, 0);
}

interface SubmitResultRequest {
  mbtiType: string;
  answers?: Array<{
    questionId: number;
    dimension: string;
    score: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitResultRequest = await request.json();
    const { mbtiType } = body;

    // Validate MBTI type
    if (!mbtiType || !VALID_MBTI_TYPES.includes(mbtiType as MbtiType)) {
      return NextResponse.json(
        { error: 'Invalid MBTI type', message: 'mbtiType must be one of 16 valid types' },
        { status: 400 }
      );
    }

    // Update statistics
    global.mbtiStats![mbtiType as MbtiType]++;
    global.totalTests!++;

    return NextResponse.json({
      success: true,
      totalTests: global.totalTests,
    });
  } catch (error) {
    console.error('Submit result error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
