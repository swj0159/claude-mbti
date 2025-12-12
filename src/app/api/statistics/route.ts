import { NextResponse } from 'next/server';
import { MbtiType } from '@/lib/types';

// Reference the global stats from submit-result
declare global {
  // eslint-disable-next-line no-var
  var mbtiStats: Record<MbtiType, number> | undefined;
  // eslint-disable-next-line no-var
  var totalTests: number | undefined;
}

// Initialize with default data if not exists
if (!global.mbtiStats) {
  global.mbtiStats = {
    INTJ: 5234, INTP: 4123, ENTJ: 3456, ENTP: 4567,
    INFJ: 6789, INFP: 7890, ENFJ: 5678, ENFP: 8901,
    ISTJ: 4321, ISFJ: 5432, ESTJ: 3210, ESFJ: 4321,
    ISTP: 2345, ISFP: 3456, ESTP: 2234, ESFP: 3345,
  };
  global.totalTests = Object.values(global.mbtiStats).reduce((sum, count) => sum + count, 0);
}

export async function GET() {
  try {
    return NextResponse.json({
      stats: global.mbtiStats,
      total: global.totalTests,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Statistics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
