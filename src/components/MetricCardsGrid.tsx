'use client';

import { Analytics, UserResponse } from '@/types/chatbot';
import { ChartLine, Clock, Activity, Award } from 'lucide-react';

interface MetricCardsGridProps {
  analytics: Analytics;
  userResponses: UserResponse[];
  totalTime: number;
  currentQuestion?: number;
  totalQuestions?: number;
}

export default function MetricCardsGrid({ 
  analytics, 
  userResponses, 
  totalTime, 
  currentQuestion = 0,
  totalQuestions = 3 
}: MetricCardsGridProps) {
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
    if (averageQuestionTime > 45) return 'Hoch';
    if (averageQuestionTime > 20) return 'Mittel';
    return 'Schnell';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Fortschritt Card */}
      <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <ChartLine className="w-5 h-5 text-blue-600" />
          <h4 className="font-sans text-sm font-medium text-gray-900">Fortschritt</h4>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(progressPercentage)}%
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {currentQuestion} von {totalQuestions} Fragen
          </p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Gesamtzeit Card */}
      <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5" style={{ color: '#0076a8' }} />
          <h4 className="font-sans text-sm font-medium text-gray-900">Gesamtzeit</h4>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatTime(totalTime)}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            ⌀ {formatTime(Math.round(averageQuestionTime))} pro Frage
          </p>
          <div className="flex items-center gap-1">
            <span className="text-green-500">🟢</span>
            <span className="text-xs text-green-600 font-medium">Konstant</span>
          </div>
        </div>
      </div>

      {/* Engagement Card */}
      <div className="bg-blue-50 border border-gray-200 shadow-sm p-4 rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5" style={{ color: '#0076a8' }} />
          <h4 className="font-sans text-sm font-medium text-gray-900">Engagement</h4>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold mb-1" style={{ color: '#001c3d' }}>
            {getEngagementLevel()}
          </div>
          <p className="text-xs text-gray-500">
            Durchschnittliche Bearbeitungszeit
          </p>
        </div>
      </div>

      {/* Individuelle Antworten Card */}
      <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5" style={{ color: '#0076a8' }} />
          <h4 className="font-sans text-sm font-medium text-gray-900">Individuelle Antworten</h4>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {customAnswersCount} / {userResponses.length}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {standardAnswersCount} Standard-Antworten
          </p>
          {/* Stacked Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full flex">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${(customAnswersCount / Math.max(userResponses.length, 1)) * 100}%`,
                  backgroundColor: '#0076a8'
                }}
              ></div>
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${(standardAnswersCount / Math.max(userResponses.length, 1)) * 100}%`,
                  backgroundColor: '#001c3d'
                }}
              ></div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#0076a8' }}></div>
              <span className="text-xs text-gray-500">Individuell</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#001c3d' }}></div>
              <span className="text-xs text-gray-500">Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 