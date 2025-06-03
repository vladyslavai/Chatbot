'use client';

import { Analytics, UserResponse } from '@/types/chatbot';
import { Clock, BarChart3, Activity, Award } from 'lucide-react';

interface AnalyticsCardProps {
  analytics: Analytics;
  userResponses: UserResponse[];
  totalTime: number;
  currentQuestion?: number;
  totalQuestions?: number;
}

export default function AnalyticsCard({ 
  analytics, 
  userResponses, 
  totalTime, 
  currentQuestion = 0,
  totalQuestions = 3 
}: AnalyticsCardProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const averageQuestionTime = analytics.questionTimes.length > 0 
    ? analytics.questionTimes.reduce((sum, time) => sum + time, 0) / analytics.questionTimes.length / 1000
    : 0;

  const progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  
  const customAnswersCount = userResponses.filter(response => response.isCustom).length;
  const standardAnswersCount = userResponses.length - customAnswersCount;

  const getEngagementLevel = () => {
    if (averageQuestionTime > 45) return { level: 'Hoch', color: 'var(--kaboom-mint)' };
    if (averageQuestionTime > 20) return { level: 'Mittel', color: 'var(--kaboom-sunflower)' };
    return { level: 'Schnell', color: 'var(--kaboom-lavender)' };
  };

  const engagement = getEngagementLevel();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Progress Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--kaboom-lavender)' }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">{Math.round(progressPercentage)}%</span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Fortschritt</h4>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              background: 'var(--kaboom-lavender)'
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-600">
          {currentQuestion} von {totalQuestions} Fragen
        </p>
      </div>

      {/* Time Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--kaboom-tangerine)' }}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">{formatTime(totalTime)}</span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Gesamtzeit</h4>
        <p className="text-xs text-gray-600">
          ⌀ {formatTime(Math.round(averageQuestionTime))} pro Frage
        </p>
      </div>

      {/* Engagement Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: engagement.color }}
          >
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ background: engagement.color }}
          ></div>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Engagement</h4>
        <p className="text-sm font-medium" style={{ color: engagement.color }}>
          {engagement.level}
        </p>
      </div>

      {/* Custom Answers Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--kaboom-mint)' }}
          >
            <Award className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">{customAnswersCount}</span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Individuelle Antworten</h4>
        <div className="flex gap-1 mb-2">
          <div 
            className="h-1.5 rounded-full flex-1"
            style={{ 
              background: customAnswersCount > 0 ? 'var(--kaboom-dragonfruit)' : 'var(--gray-200)'
            }}
          ></div>
          <div 
            className="h-1.5 rounded-full flex-1"
            style={{ 
              background: standardAnswersCount > 0 ? 'var(--kaboom-violet)' : 'var(--gray-200)'
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-600">
          {standardAnswersCount} Standard-Antworten
        </p>
      </div>
    </div>
  );
} 