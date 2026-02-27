import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { positions, regions, Player } from '@/data/players';
import PlayerCard from './PlayerCard';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';

interface PlayerGridProps {
  players: Player[];
  loading: boolean;
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  onViewProfile: (player: Player) => void;
  viewCounts?: Record<string, number>;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ players, loading, shortlist, onToggleShortlist, onViewProfile, viewCounts }) => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 35]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'age' | 'goals' | 'views'>('rating');

  const filteredPlayers = useMemo(() => {
    let result = players.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.club.toLowerCase().includes(search.toLowerCase());
      const matchesPosition = positionFilter === 'All' || p.position === positionFilter;
      const matchesRegion = regionFilter === 'All' || p.region === regionFilter;
      const matchesAge = p.age >= ageRange[0] && p.age <= ageRange[1];
      return matchesSearch && matchesPosition && matchesRegion && matchesAge;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.rating - a.rating;
        case 'age': return a.age - b.age;
        case 'goals': return b.goals - a.goals;
        case 'views': return (viewCounts?.[b.id] || 0) - (viewCounts?.[a.id] || 0);
        default: return 0;
      }
    });

    return result;
  }, [players, search, positionFilter, regionFilter, ageRange, sortBy, viewCounts]);

  const positionLabels: Record<string, string> = {
    All: t('players.all'),
    Forward: lang === 'fr' ? 'Attaquant' : 'Forward',
    Midfielder: lang === 'fr' ? 'Milieu' : 'Midfielder',
    Defender: lang === 'fr' ? 'Défenseur' : 'Defender',
    Goalkeeper: lang === 'fr' ? 'Gardien' : 'Goalkeeper',
  };

  const activeFilters = (positionFilter !== 'All' ? 1 : 0) + (regionFilter !== 'All' ? 1 : 0) + (ageRange[0] !== 16 || ageRange[1] !== 35 ? 1 : 0);

  return (
    <section id="players" className="py-20 bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#006633]/15 border border-[#006633]/30 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#FCD116] animate-pulse" />
            <span className="text-[#FCD116] text-sm font-medium">{lang === 'fr' ? 'DÉCOUVRIR' : 'DISCOVER'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('players.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('players.subtitle')}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('players.search')}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all font-medium ${
                showFilters || activeFilters > 0
                  ? 'bg-[#006633]/20 border-[#006633]/50 text-[#FCD116]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#CE1126] text-white text-xs flex items-center justify-center">{activeFilters}</span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="rating">{lang === 'fr' ? 'Note' : 'Rating'}</option>
              <option value="name">{lang === 'fr' ? 'Nom' : 'Name'}</option>
              <option value="age">{lang === 'fr' ? 'Âge' : 'Age'}</option>
              <option value="goals">{lang === 'fr' ? 'Buts' : 'Goals'}</option>
              <option value="views">{lang === 'fr' ? 'Vues Vidéo' : 'Video Views'}</option>
            </select>
          </div>

          {showFilters && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-5 animate-in slide-in-from-top-2">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">{t('players.position')}</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPositionFilter(pos)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        positionFilter === pos
                          ? 'bg-[#006633] text-white shadow-lg'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {positionLabels[pos]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">{t('players.region')}</label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setRegionFilter(reg)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        regionFilter === reg
                          ? 'bg-[#006633] text-white shadow-lg'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {reg === 'All' ? t('players.all') : reg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">
                  {t('players.age')}: {ageRange[0]} - {ageRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min={16} max={35} value={ageRange[0]} onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])} className="flex-1 accent-[#006633]" />
                  <input type="range" min={16} max={35} value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])} className="flex-1 accent-[#006633]" />
                </div>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={() => { setPositionFilter('All'); setRegionFilter('All'); setAgeRange([16, 35]); }}
                  className="text-[#CE1126] text-sm font-medium hover:underline"
                >
                  {lang === 'fr' ? 'Réinitialiser les filtres' : 'Clear all filters'}
                </button>
              )}
            </div>
          )}

          <div className="text-gray-500 text-sm">
            <span className="text-[#FCD116] font-bold">{filteredPlayers.length}</span> {t('players.showing')}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#006633] animate-spin mb-4" />
            <p className="text-gray-400">{lang === 'fr' ? 'Chargement des joueurs...' : 'Loading players...'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isShortlisted={shortlist.includes(player.id)}
                  onToggleShortlist={onToggleShortlist}
                  onViewProfile={onViewProfile}
                  viewCount={viewCounts?.[player.id]}
                />
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {lang === 'fr' ? 'Aucun joueur trouvé avec ces critères' : 'No players found with these criteria'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PlayerGrid;
