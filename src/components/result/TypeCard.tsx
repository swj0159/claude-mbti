'use client';

import { MbtiTypeInfo } from '@/lib/types';

interface TypeCardProps {
  typeInfo: MbtiTypeInfo;
}

export default function TypeCard({ typeInfo }: TypeCardProps) {
  return (
    <div
      className="text-center py-8 px-6 rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${typeInfo.color}15 0%, ${typeInfo.color}05 100%)`,
        borderTop: `4px solid ${typeInfo.color}`,
      }}
    >
      <div className="text-5xl mb-4">{typeInfo.emoji}</div>
      <div
        className="text-4xl md:text-5xl font-bold mb-2 tracking-wider"
        style={{ color: typeInfo.color }}
      >
        {typeInfo.code}
      </div>
      <h1 className="text-xl md:text-2xl font-semibold mb-3">{typeInfo.name}</h1>
      <p className="text-gray-600 dark:text-gray-400">{typeInfo.summary}</p>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {typeInfo.keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm rounded-full"
            style={{
              backgroundColor: `${typeInfo.color}15`,
              color: typeInfo.color,
            }}
          >
            #{keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
