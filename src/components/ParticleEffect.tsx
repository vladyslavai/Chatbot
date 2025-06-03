'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  opacity: number;
}

interface ParticleEffectProps {
  count?: number;
  color?: string;
}

export default function ParticleEffect({ count = 20, color = 'rgba(0, 102, 204, 0.6)' }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: color,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
} 