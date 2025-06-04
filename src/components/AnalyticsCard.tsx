'use client';

import { Analytics, UserResponse } from '@/types/chatbot';
import { Clock, BarChart3, Activity, Award, TrendingUp } from 'lucide-react';

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
    if (averageQuestionTime > 45) return { level: 'Hoch', color: 'var(--success)', bgColor: '#f0f9f0' };
    if (averageQuestionTime > 20) return { level: 'Mittel', color: 'var(--warning)', bgColor: '#fff9e6' };
    return { level: 'Schnell', color: 'var(--zurich-cyan)', bgColor: '#e6f7ff' };
  };

  const engagement = getEngagementLevel();

  return (
    <div className="analytics-grid">
      {/* Progress Card */}
      <div className="analytics-card progress-card">
        <div className="analytics-card-header">
          <div className="analytics-icon-container progress-icon">
            <BarChart3 className="analytics-icon" />
          </div>
          <div className="analytics-progress-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <circle
                className="circle-bg"
                cx="18" cy="18" r="15.9"
                fill="transparent"
                stroke="var(--gray-200)"
                strokeWidth="2"
              />
              <circle
                className="circle"
                cx="18" cy="18" r="15.9"
                fill="transparent"
                stroke="var(--zurich-blue)"
                strokeWidth="2"
                strokeDasharray={`${progressPercentage}, 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="20" className="percentage-text">
                {Math.round(progressPercentage)}%
              </text>
            </svg>
          </div>
        </div>
        <div className="analytics-card-content">
          <h4 className="analytics-title">Fortschritt</h4>
          <p className="analytics-subtitle">
            {currentQuestion} von {totalQuestions} Fragen
          </p>
          <div className="analytics-progress-bar">
            <div 
              className="analytics-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Time Card */}
      <div className="analytics-card time-card">
        <div className="analytics-card-header">
          <div className="analytics-icon-container time-icon">
            <Clock className="analytics-icon" />
          </div>
          <div className="analytics-metric">
            <span className="analytics-value">{formatTime(totalTime)}</span>
          </div>
        </div>
        <div className="analytics-card-content">
          <h4 className="analytics-title">Gesamtzeit</h4>
          <p className="analytics-subtitle">
            ⌀ {formatTime(Math.round(averageQuestionTime))} pro Frage
          </p>
          <div className="analytics-trend">
            <TrendingUp className="analytics-trend-icon" />
            <span className="analytics-trend-text">Konstant</span>
          </div>
        </div>
      </div>

      {/* Engagement Card */}
      <div className="analytics-card engagement-card" style={{ background: engagement.bgColor }}>
        <div className="analytics-card-header">
          <div 
            className="analytics-icon-container engagement-icon"
            style={{ background: engagement.color }}
          >
            <Activity className="analytics-icon" />
          </div>
          <div className="analytics-status">
            <div 
              className="analytics-status-dot"
              style={{ background: engagement.color }}
            />
          </div>
        </div>
        <div className="analytics-card-content">
          <h4 className="analytics-title">Engagement</h4>
          <p className="analytics-engagement-level" style={{ color: engagement.color }}>
            {engagement.level}
          </p>
          <p className="analytics-subtitle">
            Durchschnittliche Bearbeitungszeit
          </p>
        </div>
      </div>

      {/* Custom Answers Card */}
      <div className="analytics-card answers-card">
        <div className="analytics-card-header">
          <div className="analytics-icon-container answers-icon">
            <Award className="analytics-icon" />
          </div>
          <div className="analytics-metric">
            <span className="analytics-value">{customAnswersCount}</span>
            <span className="analytics-total">/{userResponses.length}</span>
          </div>
        </div>
        <div className="analytics-card-content">
          <h4 className="analytics-title">Individuelle Antworten</h4>
          <p className="analytics-subtitle">
            {standardAnswersCount} Standard-Antworten
          </p>
          <div className="analytics-distribution">
            <div className="analytics-distribution-bar">
              <div 
                className="analytics-distribution-custom"
                style={{ width: `${(customAnswersCount / Math.max(userResponses.length, 1)) * 100}%` }}
              />
              <div 
                className="analytics-distribution-standard"
                style={{ width: `${(standardAnswersCount / Math.max(userResponses.length, 1)) * 100}%` }}
              />
            </div>
            <div className="analytics-distribution-legend">
              <div className="analytics-legend-item">
                <div className="analytics-legend-color custom" />
                <span>Individuell</span>
              </div>
              <div className="analytics-legend-item">
                <div className="analytics-legend-color standard" />
                <span>Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 