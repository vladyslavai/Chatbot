'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillData {
  skill: string;
  value: number;
  fullMark: 100;
}

interface ProfileRadarChartProps {
  userSkills: {
    sozial: number;
    kommunikation: number;
    technisch: number;
    analytisch: number;
    stress: number;
  };
}

export default function ProfileRadarChart({ userSkills }: ProfileRadarChartProps) {
  const data: SkillData[] = [
    {
      skill: 'Soziale Kompetenz',
      value: userSkills.sozial,
      fullMark: 100,
    },
    {
      skill: 'Kommunikation',
      value: userSkills.kommunikation,
      fullMark: 100,
    },
    {
      skill: 'Technisches Verständnis',
      value: userSkills.technisch,
      fullMark: 100,
    },
    {
      skill: 'Analytisches Denken',
      value: userSkills.analytisch,
      fullMark: 100,
    },
    {
      skill: 'Stressresistenz',
      value: userSkills.stress,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="var(--gray-300)" 
            strokeWidth={1}
          />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ 
              fontSize: 12, 
              fill: 'var(--zurich-navy)',
              fontWeight: 500
            }}
            className="text-sm"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ 
              fontSize: 10, 
              fill: 'var(--gray-500)'
            }}
            tickCount={5}
          />
          <Radar
            name="Ihre Bewertung"
            dataKey="value"
            stroke="var(--zurich-blue)"
            fill="var(--zurich-cyan)"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: 'var(--zurich-blue)',
              strokeWidth: 2,
              stroke: 'white'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 