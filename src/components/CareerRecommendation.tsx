'use client';

interface CareerRecommendationProps {
  onContact?: () => void;
  onRestart?: () => void;
}

export default function CareerRecommendation({ 
  onContact, 
  onRestart 
}: CareerRecommendationProps) {
  return (
    <div className="card">
      <h2>Career Recommendation</h2>
      <p>This component is not currently in use.</p>
      
      {onContact && (
        <button onClick={onContact} className="btn-primary">
          Contact
        </button>
      )}
      
      {onRestart && (
        <button onClick={onRestart} className="btn-primary">
          Restart
        </button>
      )}
    </div>
  );
} 