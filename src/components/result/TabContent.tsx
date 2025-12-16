'use client';

import { useState } from 'react';
import { MbtiTypeInfo } from '@/lib/types';

interface TabContentProps {
  typeInfo: MbtiTypeInfo;
}

const tabs = [
  { id: 'traits', label: '특징' },
  { id: 'strengths', label: '강점/약점' },
  { id: 'careers', label: '추천 직업' },
  { id: 'celebrities', label: '유명인' },
];

export default function TabContent({ typeInfo }: TabContentProps) {
  const [activeTab, setActiveTab] = useState('traits');

  const renderContent = () => {
    switch (activeTab) {
      case 'traits':
        return (
          <div className="animate-fade-in">
            <p className="text-body-lg leading-relaxed mb-10">
              {typeInfo.description}
            </p>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">궁합이 좋은 유형</h4>
              <div className="flex gap-3">
                {typeInfo.bestMatches.map((match) => (
                  <span
                    key={match}
                    className="px-5 py-3 border border-border rounded font-medium"
                  >
                    {match}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">주의해야 할 유형</h4>
              <span className="px-5 py-3 border border-border rounded font-medium">
                {typeInfo.worstMatch}
              </span>
            </div>
          </div>
        );

      case 'strengths':
        return (
          <div className="animate-fade-in space-y-10">
            <div>
              <h4 className="text-xl font-semibold mb-5">강점</h4>
              <ul className="space-y-3">
                {typeInfo.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-body-lg leading-relaxed"
                  >
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-5">약점</h4>
              <ul className="space-y-3">
                {typeInfo.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="text-body-lg leading-relaxed text-muted"
                  >
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'careers':
        return (
          <div className="animate-fade-in">
            <p className="text-body-lg text-muted mb-8">
              {typeInfo.code} 유형에게 어울리는 직업들이에요
            </p>
            <div className="grid grid-cols-2 gap-4">
              {typeInfo.careers.map((career, index) => (
                <div
                  key={index}
                  className="p-5 border border-border rounded text-center"
                >
                  <span className="font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'celebrities':
        return (
          <div className="animate-fade-in">
            <p className="text-body-lg text-muted mb-8">
              {typeInfo.code} 유형으로 알려진 유명인들이에요
            </p>
            <div className="space-y-4">
              {typeInfo.celebrities.map((celebrity, index) => (
                <div
                  key={index}
                  className="p-5 border border-border rounded"
                >
                  <span className="font-medium text-lg">{celebrity}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-8 border-b border-border mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              pb-4 text-base font-medium transition-colors duration-smooth whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'text-foreground border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">{renderContent()}</div>
    </div>
  );
}
