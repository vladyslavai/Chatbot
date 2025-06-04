'use client';

import { Brain, Target, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { OpenAIResponse } from '@/types/chatbot';
import { useState, useEffect } from 'react';

interface CareerRecommendationProps {
  aiResponse: OpenAIResponse;
  onContact?: () => void;
  onRestart?: () => void;
  totalTime?: number;
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ percentage, size = 80, strokeWidth = 8 }: CircularProgressProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return '#1d8348';
    if (percentage >= 60) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColorClass(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[#001c3d]">
          {Math.round(animatedPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default function CareerRecommendation({
  aiResponse,
  onContact,
  onRestart,
  totalTime
}: CareerRecommendationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Sehr hohe Übereinstimmung';
    if (confidence >= 60) return 'Gute Übereinstimmung';
    return 'Moderate Übereinstimmung';
  };

  const getConfidenceBadgeStyle = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Split description into paragraphs
  const formatDescription = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.length > 1 ? paragraphs : [text];
  };

  const descriptionParagraphs = formatDescription(aiResponse.reasoning);

  return (
    <div 
      className={`w-full max-w-3xl mx-auto transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {/* Main Result Card */}
      <div className="bg-[#f0f5f9] border border-[#d6dee4] rounded-xl shadow-md p-6 md:p-8">
        
        {/* Header with Brain Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#001c3d] rounded-full flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">KI-Analyse abgeschlossen</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-[#001c3d] mt-2">
            Ihre ideale Karriere
          </h1>
        </div>

        {/* Recommended Position */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-[#e1e8ed]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0076a8] to-[#0063a1] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Empfohlene Position</p>
              <h2 className="text-xl md:text-2xl font-bold text-[#001c3d] leading-tight">
                {aiResponse.role}
              </h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          {descriptionParagraphs.map((paragraph, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="text-base text-[#1b1b1b] leading-relaxed">
                {paragraph.includes('✓') || paragraph.includes('•') || paragraph.includes('-') ? (
                  // Handle bullet points
                  paragraph.split('\n').map((line, lineIndex) => (
                    <span key={lineIndex} className="block">
                      {line.trim().startsWith('✓') || line.trim().startsWith('•') || line.trim().startsWith('-') ? (
                        <span className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{line.replace(/^[✓•-]\s*/, '')}</span>
                        </span>
                      ) : (
                        line
                      )}
                    </span>
                  ))
                ) : (
                  paragraph
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Match Score with Circular Progress */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-[#e1e8ed]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <CircularProgress percentage={aiResponse.confidence} />
              <div>
                <h3 className="text-lg font-semibold text-[#001c3d] mb-1">
                  Übereinstimmung
                </h3>
                <div className={`px-3 py-1 text-sm font-medium rounded-lg inline-flex items-center gap-1 ${getConfidenceBadgeStyle(aiResponse.confidence)}`}>
                  <TrendingUp className="w-4 h-4" />
                  {getConfidenceLabel(aiResponse.confidence)}
                </div>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-1">Basierend auf</p>
              <p className="text-lg font-semibold text-[#001c3d]">KI-Analyse</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {onContact && (
            <button
              onClick={onContact}
              className="flex-1 bg-[#001c3d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002952] transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              Kontakt aufnehmen
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          <button
            className="text-sm text-[#0076a8] underline hover:text-[#0063a1] transition-colors duration-200 px-4 py-2"
          >
            Mehr über diese Position
          </button>
          
          {onRestart && (
            <button
              onClick={onRestart}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 px-4 py-2"
            >
              Analyse wiederholen
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 