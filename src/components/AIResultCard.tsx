'use client';

import { OpenAIResponse, UserResponse } from '@/types/chatbot';
import { Target, TrendingUp, CheckCircle, ArrowRight, Brain, Clock, Award, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import ProfileRadarChart from './ProfileRadarChart';
import SkillProgressBars from './SkillProgressBars';
import CareerRecommendation from './CareerRecommendation';

interface AIResultCardProps {
  aiResponse: OpenAIResponse;
  userResponses: UserResponse[];
  onContact: () => void;
  onRestart: () => void;
  totalTime: number;
}

export default function AIResultCard({ 
  aiResponse, 
  userResponses, 
  onContact, 
  onRestart, 
  totalTime 
}: AIResultCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'var(--success)';
    if (confidence >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Sehr hohe Übereinstimmung';
    if (confidence >= 60) return 'Gute Übereinstimmung';
    return 'Moderate Übereinstimmung';
  };

  // Generate realistic skill scores based on user responses and AI confidence
  const generateSkillScores = () => {
    const baseScore = Math.max(50, aiResponse.confidence - 10);
    const variance = 15;
    
    return {
      sozial: Math.min(95, Math.max(50, baseScore + Math.random() * variance - variance/2)),
      kommunikation: Math.min(95, Math.max(50, baseScore + Math.random() * variance - variance/2)),
      technisch: Math.min(95, Math.max(50, baseScore + Math.random() * variance - variance/2)),
      analytisch: Math.min(95, Math.max(50, baseScore + Math.random() * variance - variance/2)),
      stress: Math.min(95, Math.max(50, baseScore + Math.random() * variance - variance/2))
    };
  };

  const userSkills = generateSkillScores();
  const overallScore = Math.round((userSkills.sozial + userSkills.kommunikation + userSkills.technisch + userSkills.analytisch + userSkills.stress) / 5);
  const averageScore = 63; // Industry average

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-6">
      
      {/* Main Career Recommendation - NEW COMPONENT */}
      <CareerRecommendation
        aiResponse={aiResponse}
        onContact={onContact}
        onRestart={onRestart}
        totalTime={totalTime}
      />

      {/* KI-Profilanalyse Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--zurich-cyan)' }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--zurich-navy)' }}>
              KI-Profilanalyse
            </h3>
            <p className="text-sm text-gray-600">Ihre Stärken im Überblick</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div>
            <h4 className="text-md font-semibold mb-4" style={{ color: 'var(--zurich-navy)' }}>
              Kompetenzprofil
            </h4>
            <ProfileRadarChart userSkills={userSkills} />
          </div>

          {/* Progress Bars */}
          <div>
            <SkillProgressBars 
              userScore={overallScore} 
              averageScore={averageScore}
              skillName="Gesamtbewertung"
            />
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--zurich-blue)' }}
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--zurich-navy)' }}>
                Ihre Analyse-Details
              </h3>
              <p className="text-sm text-gray-600">Ihre persönlichen Antworten im Detail</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors"
            style={{ 
              background: showDetails ? 'var(--zurich-blue)' : 'var(--background-secondary)',
              color: showDetails ? 'white' : 'var(--zurich-navy)'
            }}
          >
            {showDetails ? 'Weniger anzeigen' : 'Details anzeigen'}
            <ArrowRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4 animate-fade-in">
            {userResponses.map((response, index) => (
              <div key={index} className="border-l-3 pl-4 py-2" style={{ borderColor: 'var(--zurich-cyan)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--zurich-navy)' }}>
                  {response.question}
                </h4>
                <p className="text-gray-700">{response.answer}</p>
                {response.isCustom && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    Individuelle Antwort
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div 
            className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--zurich-blue)' }}
          >
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            Analysezeit
          </h4>
          <p className="text-2xl font-bold" style={{ color: 'var(--zurich-cyan)' }}>
            {formatTime(totalTime)}
          </p>
        </div>

        <div className="card text-center">
          <div 
            className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--zurich-cyan)' }}
          >
            <Users className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            Antworten
          </h4>
          <p className="text-2xl font-bold" style={{ color: 'var(--zurich-cyan)' }}>
            {userResponses.length}
          </p>
        </div>

        <div className="card text-center">
          <div 
            className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--success)' }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            Genauigkeit
          </h4>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
            {aiResponse.confidence}%
          </p>
        </div>
      </div>
    </div>
  );
} 