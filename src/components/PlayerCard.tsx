import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Player } from '@/data/players';
import { Heart, Eye, MapPin, Calendar, Target, Film, BarChart3 } from 'lucide-react';
import { formatViewCount } from '@/data/videoAnalytics';

interface PlayerCardProps {
  player: Player;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  onViewProfile: (player: Player) => void;
  viewCount?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isShortlisted, onToggleShortlist, onViewProfile, viewCount }) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const positionColors: Record<string, string> = {
    Forward: 'from-[#CE1126] to-[#a00e1e]',
    Midfielder: 'from-[#006633] to-[#004d26]',
    Defender: 'from-[#1a5276] to-[#0e3a54]',
    Goalkeeper: 'from-[#FCD116] to-[#d4a80e]',
  };

  const hasVideo = !!player.videoUrl;
  const hasViews = viewCount !== undefined && viewCount > 0;

  return (
    <div className="group relative bg-[#111c14] rounded-2xl overflow-hidden border border-[#006633]/20 hover:border-[#FCD116]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#006633]/10 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img src={player.image} alt={player.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111c14] via-transparent to-transparent" />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${positionColors[player.position]} text-white text-xs font-bold shadow-lg`}>
          {lang === 'fr' ? player.positionFr : player.position}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {hasVideo && (
            <div className="w-8 h-8 rounded-full bg-[#FCD116]/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-[#FCD116]/30" title={t('modal.videoAvailable')}>
              <Film className="w-3.5 h-3.5 text-[#0a1a0f]" />
            </div>
          )}
          <div className="w-10 h-10 rounded-full bg-[#0a1a0f]/80 backdrop-blur-sm border border-[#FCD116]/50 flex items-center justify-center">
            <span className="text-[#FCD116] text-sm font-bold">{player.rating}</span>
          </div>
        </div>
        {/* View Count Badge */}
        {hasViews && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
            <Eye className="w-3 h-3 text-[#FCD116]" />
            <span className="text-white text-[11px] font-semibold">{formatViewCount(viewCount!)}</span>
            <span className="text-gray-400 text-[10px]">{lang === 'fr' ? 'vues' : 'views'}</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleShortlist(player.id); }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isShortlisted ? 'bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/30' : 'bg-white/10 backdrop-blur-sm text-white hover:bg-[#CE1126]/80'
          }`}
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#FCD116] transition-colors">{player.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{player.club}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{player.age} {t('players.years')}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{player.region}</span>
          <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{player.goals} {lang === 'fr' ? 'buts' : 'goals'}</span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-14">{t('modal.speed')}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#006633] to-[#FCD116] rounded-full transition-all duration-500" style={{ width: `${player.speed}%` }} />
            </div>
            <span className="text-xs text-gray-400 w-6 text-right">{player.speed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-14">{t('modal.shooting')}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#CE1126] to-[#FCD116] rounded-full transition-all duration-500" style={{ width: `${player.shooting}%` }} />
            </div>
            <span className="text-xs text-gray-400 w-6 text-right">{player.shooting}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewProfile(player)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-[#006633]/30 text-gray-300 hover:text-[#FCD116] rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-[#006633]/50"
          >
            {hasVideo ? <Film className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {hasVideo ? t('modal.watchHighlights') : t('players.viewProfile')}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/player/${player.id}`); }}
            className="flex items-center justify-center w-10 py-2.5 bg-white/5 hover:bg-[#FCD116]/20 text-gray-400 hover:text-[#FCD116] rounded-xl transition-all border border-white/10 hover:border-[#FCD116]/30"
            title={t('players.analytics')}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
