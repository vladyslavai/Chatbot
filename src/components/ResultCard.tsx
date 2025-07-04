'use client';

import { CareerProfile } from '@/types/chatbot';
import { Clock } from 'lucide-react';

interface ResultCardProps {
  profile: CareerProfile;
  onLearnMore: () => void;
  onContact: () => void;
  onRestart: () => void;
  totalTime: number;
}

export default function ResultCard({ 
  profile, 
  onContact, 
  onRestart, 
  totalTime 
}: Omit<ResultCardProps, 'onLearnMore'>) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <div className="mb-4 text-center">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--zurich-blue)' }}
        >
          <span className="text-white text-2xl">{profile.icon}</span>
        </div>
        <h2 className="mb-2" style={{ color: 'var(--zurich-navy)' }}>Ihr Karriere-Match</h2>
        <h3 style={{ color: 'var(--zurich-blue)' }}>{profile.title}</h3>
      </div>

      <div className="text-center mb-6">
        <p>{profile.explanation}</p>
      </div>

      <div className="card mb-6">
        <h3 style={{ color: 'var(--zurich-navy)' }}>Beschreibung</h3>
        <p>{profile.description}</p>
      </div>

      <div className="card mb-6">
        <h3 style={{ color: 'var(--zurich-navy)' }}>Nächste Schritte</h3>
        <ul style={{ listStyle: 'decimal', paddingLeft: '1.25rem' }}>
          {profile.nextSteps.map((step: string, index: number) => (
            <li key={index} className="mb-2">
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 mb-6 text-muted">
        <Clock className="w-4 h-4" />
        <span>Beratungszeit: {formatTime(totalTime)}</span>
      </div>

      <div className="text-center">
        <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
          <button onClick={onContact} className="btn-primary">
            Jetzt bewerben
          </button>
          <button 
            onClick={onRestart} 
            className="option-button"
            style={{ margin: 0 }}
          >
            Neuer Test
          </button>
        </div>
      </div>
    </div>
  );
} 