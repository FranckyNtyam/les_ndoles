import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Player } from '@/data/players';
import { fetchMostWatched, MostWatchedData, formatViewCount, formatWatchTime } from '@/data/videoAnalytics';
import { TrendingUp, Eye, Clock, Users, Film, Trophy, Flame, ChevronRight, BarChart3, Loader2 } from 'lucide-react';

interface MostWatchedProps {
  onViewProfile: (player: Player) => void;
  players: Player[];
}

const MostWatched: React.FC<MostWatchedProps> = ({ onViewProfile, players }) => {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<MostWatchedData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await fetchMostWatched(8);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewPlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      onViewProfile(player);
    }
  };

  const positionColors: Record<string, string> = {
    Forward: 'from-[#CE1126] to-[#a00e1e]',
    Midfielder: 'from-[#006633] to-[#004d26]',
    Defender: 'from-[#1a5276] to-[#0e3a54]',
    Goalkeeper: 'from-[#FCD116] to-[#d4a80e]',
  };

  const rankBadges = [
    { bg: 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]', text: 'text-[#0a1a0f]', shadow: 'shadow-[#FFD700]/30' },
    { bg: 'bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0]', text: 'text-[#0a1a0f]', shadow: 'shadow-[#C0C0C0]/30' },
    { bg: 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D]', text: 'text-white', shadow: 'shadow-[#CD7F32]/30' },
  ];

  const hasData = data && data.leaderboard.length > 0;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0f] via-[#0d2214] to-[#0a1a0f]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FCD116]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CE1126]/5 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCD116]/10 border border-[#FCD116]/30 rounded-full mb-4">
            <Flame className="w-4 h-4 text-[#FCD116]" />
            <span className="text-[#FCD116] text-sm font-bold uppercase tracking-wider">{t('trending.badge')}</span>
            <TrendingUp className="w-4 h-4 text-[#FCD116]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t('trending.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('trending.subtitle')}</p>
        </div>
        {hasData && (
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Eye className="w-5 h-5 text-[#FCD116] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">{formatViewCount(data!.platformStats.totalViews)}</div>
              <div className="text-xs text-gray-500">{t('trending.totalViews')}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Clock className="w-5 h-5 text-[#006633] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">{formatWatchTime(data!.platformStats.totalWatchTimeSeconds)}</div>
              <div className="text-xs text-gray-500">{t('trending.watchTime')}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Users className="w-5 h-5 text-[#CE1126] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">{data!.platformStats.uniquePlayersWatched}</div>
              <div className="text-xs text-gray-500">{t('trending.playersWatched')}</div>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#FCD116] mb-4" />
            <p className="text-gray-400 text-sm">{lang === 'fr' ? 'Chargement des tendances...' : 'Loading trending data...'}</p>
          </div>
        )}
        {!loading && !hasData && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <BarChart3 className="w-9 h-9 text-gray-600" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{t('trending.empty')}</h3>
            <p className="text-gray-500 text-sm max-w-sm">{t('trending.emptyDesc')}</p>
          </div>
        )}
        {!loading && hasData && (
          <div className="space-y-3">
            {data!.leaderboard.map((entry, index) => {
              const rankBadge = index < 3 ? rankBadges[index] : null;
              const player = entry.player;
              const posColor = positionColors[player.position] || 'from-gray-500 to-gray-600';
              return (
                <div key={entry.player_id} onClick={() => handleViewPlayer(entry.player_id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
                    index === 0 ? 'bg-gradient-to-r from-[#FFD700]/10 via-[#111c14] to-[#111c14] border-[#FFD700]/30 hover:border-[#FFD700]/60 hover:shadow-xl hover:shadow-[#FFD700]/10'
                    : index === 1 ? 'bg-gradient-to-r from-[#C0C0C0]/10 via-[#111c14] to-[#111c14] border-[#C0C0C0]/20 hover:border-[#C0C0C0]/40'
                    : index === 2 ? 'bg-gradient-to-r from-[#CD7F32]/10 via-[#111c14] to-[#111c14] border-[#CD7F32]/20 hover:border-[#CD7F32]/40'
                    : 'bg-[#111c14] border-white/10 hover:border-[#006633]/40'
                  }`}>
                  <div className="flex-shrink-0">
                    {rankBadge ? (
                      <div className={`w-10 h-10 rounded-xl ${rankBadge.bg} ${rankBadge.shadow} shadow-lg flex items-center justify-center`}>
                        <span className={`text-sm font-extrabold ${rankBadge.text}`}>#{index + 1}</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-[#FCD116]/40 transition-colors">
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-bold text-sm sm:text-base truncate group-hover:text-[#FCD116] transition-colors">{player.name}</h3>
                      <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full bg-gradient-to-r ${posColor} text-white text-[10px] font-bold`}>
                        {lang === 'fr' ? player.position_fr : player.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{player.club}</span>
                      <span className="hidden sm:inline">{player.region}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-[#FCD116]"><Eye className="w-3.5 h-3.5" /><span className="font-bold text-sm">{formatViewCount(entry.total_views)}</span></div>
                      <span className="text-[10px] text-gray-500">{lang === 'fr' ? 'vues' : 'views'}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-[#006633]"><Clock className="w-3.5 h-3.5" /><span className="font-bold text-sm">{formatWatchTime(entry.total_watch_time)}</span></div>
                      <span className="text-[10px] text-gray-500">{lang === 'fr' ? 'temps' : 'time'}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{entry.avg_completion}%</div>
                      <span className="text-[10px] text-gray-500">{lang === 'fr' ? 'complétion' : 'completion'}</span>
                    </div>
                  </div>
                  <div className="flex md:hidden items-center gap-1 text-[#FCD116]">
                    <Eye className="w-3.5 h-3.5" /><span className="font-bold text-xs">{formatViewCount(entry.total_views)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FCD116]/10 border border-[#FCD116]/30 flex items-center justify-center">
                      <span className="text-[#FCD116] text-sm font-bold">{player.rating}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#FCD116] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {hasData && (
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
              <Film className="w-4 h-4 text-[#FCD116]" />
              {lang === 'fr' ? 'Les classements sont mis à jour en temps réel' : 'Rankings are updated in real-time based on video views'}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostWatched;
