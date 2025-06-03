'use client';

import { CareerProfile } from '@/types/chatbot';

interface CareerFlipCardProps {
  profile: CareerProfile;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CareerFlipCard({ profile, isSelected = false, onClick }: CareerFlipCardProps) {
  return (
    <div 
      className={`flip-card cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-105 ring-4 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flip-card-inner">
        {/* Front of card */}
        <div className="flip-card-front zurich-card dynamic-shadow">
          <div className="icon-3d mb-4">
            {profile.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center px-4">
            {profile.title}
          </h3>
          <p className="text-sm text-gray-600 text-center px-4 leading-relaxed">
            Bewegen Sie die Maus über die Karte für mehr Details
          </p>
          <div className="mt-4 text-xs text-blue-600 font-medium">
            ← Hover für Details →
          </div>
        </div>

        {/* Back of card */}
        <div className="flip-card-back">
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">{profile.icon}</div>
              <h3 className="text-lg font-bold mb-3">{profile.title}</h3>
              <p className="text-sm leading-relaxed mb-4 opacity-90">
                {profile.description.substring(0, 120)}...
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs opacity-75">Ihre nächsten Schritte:</div>
              <ul className="text-xs space-y-1">
                {profile.nextSteps.slice(0, 2).map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-300">•</span>
                    <span className="opacity-90">{step.substring(0, 40)}...</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 