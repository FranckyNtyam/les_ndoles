import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Player } from '@/data/players';
import { Crosshair, Shield, Disc, Goal } from 'lucide-react';

interface PositionShowcaseProps {
  players: Player[];
  onFilterPosition: (position: string) => void;
}

const PositionShowcase: React.FC<PositionShowcaseProps> = ({ players, onFilterPosition }) => {
  const { lang } = useLanguage();

  const positionData = [
    { position: 'Forward', positionFr: 'Attaquants', icon: Crosshair, color: '#CE1126', bgGradient: 'from-[#CE1126]/20 to-[#CE1126]/5', borderColor: 'border-[#CE1126]/30', hoverBorder: 'hover:border-[#CE1126]/60', desc: lang === 'fr' ? 'Vitesse, finition et instinct de buteur' : 'Speed, finishing and scoring instinct' },
    { position: 'Midfielder', positionFr: 'Milieux', icon: Disc, color: '#006633', bgGradient: 'from-[#006633]/20 to-[#006633]/5', borderColor: 'border-[#006633]/30', hoverBorder: 'hover:border-[#006633]/60', desc: lang === 'fr' ? 'Créativité, vision et contrôle du jeu' : 'Creativity, vision and game control' },
    { position: 'Defender', positionFr: 'Défenseurs', icon: Shield, color: '#1a5276', bgGradient: 'from-[#1a5276]/20 to-[#1a5276]/5', borderColor: 'border-[#1a5276]/30', hoverBorder: 'hover:border-[#1a5276]/60', desc: lang === 'fr' ? 'Solidité, leadership et jeu aérien' : 'Solidity, leadership and aerial play' },
    { position: 'Goalkeeper', positionFr: 'Gardiens', icon: Goal, color: '#FCD116', bgGradient: 'from-[#FCD116]/20 to-[#FCD116]/5', borderColor: 'border-[#FCD116]/30', hoverBorder: 'hover:border-[#FCD116]/60', desc: lang === 'fr' ? 'Réflexes, agilité et présence' : 'Reflexes, agility and presence' },
  ];

  return (
    <section className="py-16 bg-[#0d2412]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{lang === 'fr' ? 'Explorer par Position' : 'Explore by Position'}</h2>
          <p className="text-gray-400">{lang === 'fr' ? 'Trouvez le talent parfait pour chaque poste' : 'Find the perfect talent for every position'}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {positionData.map((pos) => {
            const count = players.filter((p) => p.position === pos.position).length;
            const topPlayer = players.filter((p) => p.position === pos.position).sort((a, b) => b.rating - a.rating)[0];
            return (
              <button key={pos.position} onClick={() => onFilterPosition(pos.position)}
                className={`group relative bg-gradient-to-b ${pos.bgGradient} rounded-2xl p-6 border ${pos.borderColor} ${pos.hoverBorder} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left`}>
                <pos.icon className="w-8 h-8 mb-4" style={{ color: pos.color }} />
                <h3 className="text-white font-bold text-xl mb-1">{lang === 'fr' ? pos.positionFr : pos.position + 's'}</h3>
                <p className="text-gray-500 text-sm mb-4">{pos.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold" style={{ color: pos.color }}>{count}</span>
                  <span className="text-gray-500 text-xs">{lang === 'fr' ? 'joueurs' : 'players'}</span>
                </div>
                {topPlayer && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                    <img src={topPlayer.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="text-white text-xs font-medium">{topPlayer.name}</div>
                      <div className="text-gray-500 text-xs">{lang === 'fr' ? 'Meilleur noté' : 'Top rated'}: {topPlayer.rating}</div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PositionShowcase;
