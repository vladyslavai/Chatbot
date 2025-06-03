'use client';

import { CareerProfile } from '@/types/chatbot';
import { ArrowRight, CheckCircle, Clock, RotateCcw, MapPin, Users, TrendingUp } from 'lucide-react';
import ZurichMap from './ZurichMap';

interface ResultCardProps {
  profile: CareerProfile;
  onLearnMore: () => void;
  onRestart: () => void;
  onContact: () => void;
  totalTime: number;
}

export default function ResultCard({ profile, onLearnMore, onRestart, onContact, totalTime }: ResultCardProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Mock data for demonstration
  const mockStats = {
    similarProfiles: 847,
    averageTime: '2:34',
    matchAccuracy: 94
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up space-y-8">
      {/* Header with Swiss-style precision */}
      <div className="zurich-gradient px-8 py-10 text-white rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full animate-shimmer"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-lg font-semibold opacity-90">Ihr perfektes Ergebnis</span>
            </div>
            <div className="flex items-center gap-4 text-blue-200 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Abgeschlossen in {formatTime(totalTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{mockStats.matchAccuracy}% Übereinstimmung</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="icon-3d text-6xl">{profile.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.title}</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Du passt perfekt zur <span className="font-semibold text-yellow-300">{profile.title.toLowerCase()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <ZurichMap />
      </div>

      {/* Split-screen content */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="split-screen p-8">
          {/* Left side - Information */}
          <div className="space-y-8">
            <div className="swiss-spacing">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                Was Sie erwartet
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {profile.description}
              </p>
            </div>

            <div className="swiss-spacing">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                Warum Sie ideal geeignet sind
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {profile.explanation}
              </p>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistische Einblicke</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mockStats.similarProfiles}</div>
                  <div className="text-sm text-gray-600">ähnliche Profile</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mockStats.averageTime}</div>
                  <div className="text-sm text-gray-600">⌀ Entscheidungszeit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mockStats.matchAccuracy}%</div>
                  <div className="text-sm text-gray-600">Genauigkeit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Timeline and Actions */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ihr Karrierepfad</h2>
              <div className="timeline">
                {profile.nextSteps.map((step, index) => (
                  <div key={index} className="timeline-item">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">
                            Schritt {index + 1}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons with premium styling */}
            <div className="space-y-4">
              <button
                onClick={onContact}
                className="w-full btn-primary py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 micro-bounce"
              >
                <span>Jetzt Kontakt aufnehmen</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onLearnMore}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 dynamic-shadow"
                >
                  <span>Mehr Details</span>
                </button>
                
                <button
                  onClick={onRestart}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 dynamic-shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Neu starten</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with premium touches */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <strong>Interessiert?</strong> Unsere Experten helfen Ihnen gerne bei den nächsten Schritten.
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Powered by KI-Technologie</span>
              <span>•</span>
              <span>Stadtpolizei Zürich</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 