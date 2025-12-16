'use client';

import { MbtiType, Statistics } from '@/lib/types';
import { mbtiTypes } from '@/lib/mbtiTypes';

interface StatisticsChartProps {
  stats: Statistics;
  userType: MbtiType;
  loading?: boolean;
}

const MBTI_ORDER: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export default function StatisticsChart({ stats, userType, loading }: StatisticsChartProps) {
  const maxCount = Math.max(...Object.values(stats.stats));
  const userPercentage = ((stats.stats[userType] / stats.total) * 100).toFixed(1);

  // Skeleton loading UI
  if (loading) {
    return (
      <div className="mt-16 p-12 border border-border rounded animate-pulse">
        <div className="text-center mb-10">
          <div className="h-6 w-40 bg-border rounded mx-auto mb-3" />
          <div className="h-12 w-32 bg-border rounded mx-auto mb-2" />
          <div className="h-4 w-24 bg-border rounded mx-auto" />
        </div>
        <div className="space-y-3">
          {MBTI_ORDER.map((type) => (
            <div key={type} className="flex items-center gap-3">
              <div className="w-12 h-4 bg-border rounded" />
              <div className="flex-1 h-2 bg-border rounded-full" />
              <div className="w-14 h-4 bg-border rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 p-12 border border-border rounded">
      <div className="text-center mb-12">
        <h3 className="text-xl font-semibold mb-4 text-muted">당신과 같은 유형은...</h3>
        <p className="text-5xl font-bold mb-3">
          {userPercentage}%
        </p>
        <p className="text-caption text-muted">
          총 {stats.total.toLocaleString()}명 참여
        </p>
      </div>

      <div className="space-y-3">
        {MBTI_ORDER.map((type) => {
          const count = stats.stats[type] || 0;
          const percentage = (count / maxCount) * 100;
          const isUserType = type === userType;

          return (
            <div key={type} className="flex items-center gap-4">
              <span
                className={`w-12 text-sm font-mono font-semibold ${
                  isUserType ? 'text-primary' : 'text-muted'
                }`}
              >
                {type}
              </span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-smooth ${
                    isUserType ? 'bg-primary' : 'bg-accent'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={`w-14 text-right text-sm ${isUserType ? 'font-semibold' : 'text-muted'}`}>
                {((count / stats.total) * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
