'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div>
      <div className="progress-info">
        <span>Frage {currentStep} von {totalSteps}</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 