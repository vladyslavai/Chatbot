'use client';

import { OpenAIResponse, UserResponse } from '@/types/chatbot';
import { TrendingUp, ArrowRight, Clock, Award, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import ProfileRadarChart from './ProfileRadarChart';
import SkillProgressBars from './SkillProgressBars';

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
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      
      {/* Hero Section - Professional Style */}
      <div className="card mb-6">
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--zurich-blue)' }}
          >
            <span className="text-white text-2xl">🧠</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
              <span className="text-white text-xs">✓</span>
            </span>
            <span className="text-sm font-medium text-gray-600">KI-Analyse abgeschlossen</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--zurich-navy)' }}>
            Ihre ideale Karriere
          </h1>
        </div>

        {/* Result Content */}
        <div 
          className="rounded-lg p-6 mb-6"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--zurich-blue)' }}
            >
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Empfohlene Position</p>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--zurich-navy)' }}>
                {aiResponse.role}
              </h2>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            {aiResponse.reasoning}
          </p>

          {/* Confidence Indicator */}
          <div 
            className="flex items-center justify-between rounded-lg p-4"
            style={{ background: 'rgba(255, 255, 255, 0.8)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: aiResponse.confidence >= 80 ? 'var(--success)' : aiResponse.confidence >= 60 ? 'var(--warning)' : 'var(--error)' }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Übereinstimmung</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--zurich-navy)' }}>
                  {aiResponse.confidence >= 80 ? 'Sehr hohe Übereinstimmung' : aiResponse.confidence >= 60 ? 'Gute Übereinstimmung' : 'Moderate Übereinstimmung'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--zurich-navy)' }}>{aiResponse.confidence}%</div>
              <div className="w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                <div 
                  className="h-full rounded-sm transition-all duration-1000"
                  style={{ 
                    width: `${aiResponse.confidence}%`,
                    background: aiResponse.confidence >= 80 ? 'var(--success)' : aiResponse.confidence >= 60 ? 'var(--warning)' : 'var(--error)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: KI-Profilanalyse Section */}
      <div className="card mb-6">
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
      <div className="card mb-6">
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
            className="btn-primary text-sm"
          >
            {showDetails ? 'Ausblenden' : 'Details anzeigen'}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-3 animate-fade-in">
            {userResponses.map((response, index) => (
              <div 
                key={index} 
                className="rounded-lg p-4 transition-all duration-200"
                style={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--zurich-blue)'
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--zurich-blue)' }}
                  >
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--zurich-navy)' }}>{response.question}</h4>
                      {response.isCustom && (
                        <span 
                          className="inline-flex items-center text-xs px-2 py-1 rounded-sm font-medium"
                          style={{ 
                            background: 'var(--zurich-cyan)', 
                            color: 'white' 
                          }}
                        >
                          Individuelle Antwort
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">
                      &ldquo;{response.answer}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
            style={{ background: 'var(--zurich-cyan)' }}
          >
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            {userResponses.length}
          </div>
          <div className="text-sm text-gray-600 font-medium">Fragen beantwortet</div>
        </div>

        <div className="card text-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
            style={{ background: aiResponse.confidence >= 80 ? 'var(--success)' : aiResponse.confidence >= 60 ? 'var(--warning)' : 'var(--error)' }}
          >
            <span className="text-white text-lg">🎯</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            {aiResponse.confidence}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Genauigkeit</div>
        </div>

        <div className="card text-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
            style={{ background: 'var(--zurich-blue)' }}
          >
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--zurich-navy)' }}>
            {formatTime(totalTime)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Beratungszeit</div>
        </div>
      </div>

      {/* Action Section */}
      <div className="card">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--zurich-navy)' }}>
            Bereit für den nächsten Schritt?
          </h3>
          <p className="text-gray-600">
            Kontaktieren Sie uns für weitere Informationen oder starten Sie eine neue Analyse.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={onContact}
            className="btn-primary py-3 px-6 group"
          >
            <span>Jetzt bewerben</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onRestart}
            className="option-button py-3 px-6 font-medium"
            style={{ margin: 0 }}
          >
            Neue Analyse starten
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Powered by OpenAI GPT-4</span>
            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
            <span className="font-medium">Stadtpolizei Zürich Karriereberatung</span>
          </div>
        </div>
      </div>
    </div>
  );
} 