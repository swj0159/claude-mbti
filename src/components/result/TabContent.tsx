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
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {typeInfo.description}
            </p>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">궁합이 좋은 유형</h4>
              <div className="flex gap-2">
                {typeInfo.bestMatches.map((match) => (
                  <span
                    key={match}
                    className="px-4 py-2 bg-success/10 text-success rounded-lg font-medium"
                  >
                    {match}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-3">주의해야 할 유형</h4>
              <span className="px-4 py-2 bg-error/10 text-error rounded-lg font-medium">
                {typeInfo.worstMatch}
              </span>
            </div>
          </div>
        );

      case 'strengths':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-success">✓</span> 강점
              </h4>
              <ul className="space-y-2">
                {typeInfo.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-success/5 rounded-lg"
                  >
                    <span className="text-success">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-warning">!</span> 약점
              </h4>
              <ul className="space-y-2">
                {typeInfo.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg"
                  >
                    <span className="text-warning">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'careers':
        return (
          <div className="animate-fade-in">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {typeInfo.code} 유형에게 어울리는 직업들이에요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {typeInfo.careers.map((career, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center"
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {typeInfo.code} 유형으로 알려진 유명인들이에요
            </p>
            <div className="space-y-3">
              {typeInfo.celebrities.map((celebrity, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg">
                    👤
                  </span>
                  <span className="font-medium">{celebrity}</span>
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
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">{renderContent()}</div>
    </div>
  );
}
