'use client';

import { useState } from 'react';
import { MapPin, Building2, Users, Car, Shield, RotateCcw } from 'lucide-react';

interface CareerLocation {
  id: string;
  name: string;
  position: { x: number; y: number };
  icon: React.ReactNode;
  description: string;
  address: string;
}

const careerLocations: CareerLocation[] = [
  {
    id: 'hauptwache',
    name: 'Polizeiwache Hauptbahnhof',
    position: { x: 45, y: 55 },
    icon: <Building2 className="w-5 h-5" />,
    description: 'Zentrale Anlaufstelle für Bürgerdienste und Patrouillen',
    address: 'Bahnhofquai 3, 8001 Zürich'
  },
  {
    id: 'altstadt',
    name: 'Revier Altstadt',
    position: { x: 50, y: 60 },
    icon: <Users className="w-5 h-5" />,
    description: 'Spezialisiert auf Touristensicherheit und Altstadtschutz',
    address: 'Limmatquai 68, 8001 Zürich'
  },
  {
    id: 'verkehr',
    name: 'Verkehrspolizei Zentrum',
    position: { x: 40, y: 50 },
    icon: <Car className="w-5 h-5" />,
    description: 'Verkehrsüberwachung und Unfallaufnahme',
    address: 'Stampfenbachstrasse 52, 8006 Zürich'
  },
  {
    id: 'sicherheit',
    name: 'Sicherheitsdienst Flughafen',
    position: { x: 75, y: 25 },
    icon: <Shield className="w-5 h-5" />,
    description: 'Flughafensicherheit und Grenzschutz',
    address: 'Flughafen Zürich, 8058 Zürich'
  },
  {
    id: 'kripo',
    name: 'Kriminalpolizei',
    position: { x: 35, y: 45 },
    icon: <Building2 className="w-5 h-5" />,
    description: 'Ermittlungsarbeit und Kriminalprävention',
    address: 'Zeughausstrasse 11, 8004 Zürich'
  }
];

export default function ZurichMap() {
  const [selectedLocation, setSelectedLocation] = useState<CareerLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="w-6 h-6" />
          Karrierestandorte in Zürich
        </h2>
        <p className="text-blue-100">
          Entdecken Sie die verschiedenen Arbeitsplätze der Stadtpolizei Zürich
        </p>
      </div>

      <div className="relative">
        {/* Zürich Map SVG */}
        <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 overflow-hidden">
          {/* Simplified Zürich map background */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Lake Zürich */}
            <ellipse cx="70" cy="80" rx="25" ry="15" fill="#3B82F6" opacity="0.3" />
            
            {/* Limmat River */}
            <path d="M 30 40 Q 45 55 50 60 Q 55 65 70 75" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.4" />
            
            {/* City areas */}
            <circle cx="45" cy="55" r="20" fill="#10B981" opacity="0.1" />
            <circle cx="35" cy="45" r="15" fill="#10B981" opacity="0.1" />
            <circle cx="75" cy="25" r="12" fill="#10B981" opacity="0.1" />
            
            {/* Districts */}
            <text x="45" y="55" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Altstadt</text>
            <text x="75" y="25" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Flughafen</text>
            <text x="70" y="80" textAnchor="middle" className="text-xs fill-blue-600 font-medium">Zürichsee</text>
          </svg>

          {/* Career Location Markers */}
          {careerLocations.map((location) => (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                hoveredLocation === location.id ? 'scale-150 z-20' : 'scale-100 z-10'
              }`}
              style={{
                left: `${location.position.x}%`,
                top: `${location.position.y}%`,
              }}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => setSelectedLocation(location)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                selectedLocation?.id === location.id 
                  ? 'bg-yellow-500 ring-4 ring-yellow-300' 
                  : hoveredLocation === location.id
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}>
                {location.icon}
              </div>
              
              {/* Hover tooltip */}
              {hoveredLocation === location.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-30">
                  {location.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          ))}

          {/* Pulse animation for unselected markers */}
          {careerLocations.map((location) => (
            hoveredLocation !== location.id && selectedLocation?.id !== location.id && (
              <div
                key={`pulse-${location.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${location.position.x}%`,
                  top: `${location.position.y}%`,
                }}
              >
                <div className="w-10 h-10 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              </div>
            )
          ))}
        </div>

        {/* Location Details Panel */}
        {selectedLocation && (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 p-6 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {selectedLocation.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedLocation.name}</h3>
                </div>
                <p className="text-gray-600 mb-2">{selectedLocation.description}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedLocation.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Schließen"
              >
                <RotateCcw className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <strong>💡 Tipp:</strong> Klicken Sie auf die Marker, um mehr über die verschiedenen Arbeitsplätze zu erfahren
        </p>
      </div>
    </div>
  );
} 