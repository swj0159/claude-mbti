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
      <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse">
        <div className="text-center mb-6">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>
        <div className="space-y-2">
          {MBTI_ORDER.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="w-14 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">당신과 같은 유형은...</h3>
        <p className="text-3xl font-bold text-primary">
          전체의 {userPercentage}%
        </p>
        <p className="text-sm text-gray-500 mt-1">
          총 {stats.total.toLocaleString()}명 참여
        </p>
      </div>

      <div className="space-y-2">
        {MBTI_ORDER.map((type) => {
          const count = stats.stats[type] || 0;
          const percentage = (count / maxCount) * 100;
          const isUserType = type === userType;
          const typeInfo = mbtiTypes[type];

          return (
            <div key={type} className="flex items-center gap-2">
              <span
                className={`w-12 text-xs font-mono font-semibold ${
                  isUserType ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {type}
              </span>
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: isUserType ? typeInfo.color : '#94a3b8',
                  }}
                />
              </div>
              <span className="w-14 text-right text-xs text-gray-500">
                {((count / stats.total) * 100).toFixed(1)}%
              </span>
              {isUserType && (
                <span className="text-xs text-primary font-semibold">← YOU</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
