'use client';

interface SkillProgressBarsProps {
  userScore: number;
  averageScore: number;
  skillName?: string;
}

export default function SkillProgressBars({ userScore, averageScore, skillName = "Gesamtbewertung" }: SkillProgressBarsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700 mb-3">{skillName}</h4>
      
      {/* User Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Ihre Bewertung</span>
          <span className="text-sm font-bold text-green-600">{userScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-sm h-3">
          <div 
            className="h-3 rounded-sm transition-all duration-1000 ease-out"
            style={{ 
              width: `${userScore}%`,
              background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)'
            }}
          ></div>
        </div>
      </div>

      {/* Average Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Durchschnitt</span>
          <span className="text-sm font-medium text-gray-500">{averageScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-sm h-3">
          <div 
            className="bg-gray-400 h-3 rounded-sm transition-all duration-1000 ease-out"
            style={{ width: `${averageScore}%` }}
          ></div>
        </div>
      </div>

      {/* Comparison Text */}
      <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-sm">
        <p className="text-sm text-green-800">
          {userScore > averageScore ? (
            <>
              <strong>Überdurchschnittlich!</strong> Sie übertreffen den Durchschnitt um{' '}
              <strong>{userScore - averageScore} Punkte</strong> und zeigen eine überdurchschnittliche Eignung für diese Position.
            </>
          ) : userScore === averageScore ? (
            <>
              <strong>Durchschnittlich.</strong> Sie entsprechen dem Durchschnitt und zeigen eine solide Eignung für diese Position.
            </>
          ) : (
            <>
              <strong>Entwicklungspotential.</strong> Mit gezielter Weiterbildung können Sie Ihre Fähigkeiten in diesem Bereich stärken.
            </>
          )}
        </p>
      </div>
    </div>
  );
} 