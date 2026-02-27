import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Player } from '@/data/players';
import { MapPin, Users } from 'lucide-react';

interface RegionMapProps {
  players: Player[];
}

const RegionMap: React.FC<RegionMapProps> = ({ players }) => {
  const { lang } = useLanguage();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regionData = [
    { name: 'Centre', nameFr: 'Centre', x: 48, y: 55, color: '#006633' },
    { name: 'Littoral', nameFr: 'Littoral', x: 38, y: 52, color: '#CE1126' },
    { name: 'Ouest', nameFr: 'Ouest', x: 35, y: 45, color: '#FCD116' },
    { name: 'Sud-Ouest', nameFr: 'Sud-Ouest', x: 28, y: 48, color: '#006633' },
    { name: 'Nord-Ouest', nameFr: 'Nord-Ouest', x: 30, y: 38, color: '#CE1126' },
    { name: 'Nord', nameFr: 'Nord', x: 52, y: 25, color: '#FCD116' },
    { name: 'Extrême-Nord', nameFr: 'Extrême-Nord', x: 55, y: 10, color: '#006633' },
    { name: 'Adamaoua', nameFr: 'Adamaoua', x: 50, y: 35, color: '#CE1126' },
    { name: 'Est', nameFr: 'Est', x: 65, y: 50, color: '#FCD116' },
    { name: 'Sud', nameFr: 'Sud', x: 45, y: 68, color: '#006633' },
  ];

  const getPlayerCount = (region: string) => players.filter((p) => p.region === region).length;

  return (
    <section className="py-20 bg-[#0d2412] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FCD116 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#006633]/15 border border-[#006633]/30 mb-4">
            <MapPin className="w-4 h-4 text-[#006633]" />
            <span className="text-[#006633] text-sm font-medium">{lang === 'fr' ? 'COUVERTURE NATIONALE' : 'NATIONAL COVERAGE'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">{lang === 'fr' ? 'Talents par Région' : 'Talents by Region'}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{lang === 'fr' ? 'Nos joueurs viennent de toutes les régions du Cameroun' : 'Our players come from all regions of Cameroon'}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] max-w-md mx-auto w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 45 5 L 58 8 L 60 15 L 55 22 L 58 30 L 55 38 L 60 42 L 58 48 L 68 52 L 72 58 L 65 62 L 58 65 L 52 72 L 45 75 L 38 72 L 35 65 L 30 60 L 25 55 L 22 48 L 25 42 L 28 38 L 25 32 L 30 25 L 35 18 L 40 12 Z"
                fill="#006633" fillOpacity="0.15" stroke="#006633" strokeWidth="0.5" strokeOpacity="0.4" />
              {regionData.map((region) => {
                const count = getPlayerCount(region.name);
                const isHovered = hoveredRegion === region.name;
                const size = Math.max(2, count * 1.5);
                return (
                  <g key={region.name} onMouseEnter={() => setHoveredRegion(region.name)} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                    <circle cx={region.x} cy={region.y} r={isHovered ? size + 4 : size + 2} fill={region.color} fillOpacity={isHovered ? 0.3 : 0.1} className="transition-all duration-300">
                      <animate attributeName="r" values={`${size + 1};${size + 4};${size + 1}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="fill-opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={region.x} cy={region.y} r={isHovered ? size + 1 : size} fill={region.color} className="transition-all duration-300" />
                    {count > 0 && <text x={region.x} y={region.y + 0.8} textAnchor="middle" fill="white" fontSize="2.5" fontWeight="bold">{count}</text>}
                    {isHovered && (
                      <g>
                        <rect x={region.x - 12} y={region.y - size - 8} width="24" height="5" rx="1" fill="#0a1a0f" fillOpacity="0.9" stroke={region.color} strokeWidth="0.3" />
                        <text x={region.x} y={region.y - size - 4.5} textAnchor="middle" fill="white" fontSize="2.2" fontWeight="bold">{lang === 'fr' ? region.nameFr : region.name}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="space-y-3">
            {regionData.map((region) => {
              const count = getPlayerCount(region.name);
              const isHovered = hoveredRegion === region.name;
              return (
                <div key={region.name} onMouseEnter={() => setHoveredRegion(region.name)} onMouseLeave={() => setHoveredRegion(null)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${isHovered ? 'bg-white/10 border-[#FCD116]/40 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: region.color }} />
                  <span className={`flex-1 font-medium transition-colors ${isHovered ? 'text-[#FCD116]' : 'text-white'}`}>{lang === 'fr' ? region.nameFr : region.name}</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-[#FCD116] font-bold">{count}</span>
                    <span className="text-gray-500 text-sm">{lang === 'fr' ? 'joueurs' : 'players'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionMap;
