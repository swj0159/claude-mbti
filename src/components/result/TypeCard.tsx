'use client';

import { MbtiTypeInfo } from '@/lib/types';

interface TypeCardProps {
  typeInfo: MbtiTypeInfo;
}

export default function TypeCard({ typeInfo }: TypeCardProps) {
  return (
    <div className="text-center py-16 px-8 border border-border rounded">
      <div className="text-7xl mb-8">{typeInfo.emoji}</div>
      <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
        {typeInfo.code}
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">{typeInfo.name}</h1>
      <p className="text-body-lg text-muted max-w-2xl mx-auto">{typeInfo.summary}</p>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {typeInfo.keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-4 py-2 text-sm border border-border rounded"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
