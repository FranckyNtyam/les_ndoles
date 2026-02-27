import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Player, submitInquiry } from '@/data/players';
import { fetchPlayerViewAnalytics, PlayerViewAnalytics, formatViewCount, formatWatchTime } from '@/data/videoAnalytics';
import { X, Heart, Calendar, Ruler, Weight, Footprints, Send, CheckCircle, Loader2, Film, VideoOff, Eye, Clock, Users, BarChart3, ExternalLink } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  onViewRecorded?: () => void;
}

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const PlayerModal: React.FC<PlayerModalProps> = ({ player, isOpen, onClose, isShortlisted, onToggleShortlist, onViewRecorded }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'video' | 'career' | 'contact'>('stats');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [videoAnalytics, setVideoAnalytics] = useState<PlayerViewAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Load video analytics when video tab is active
  const loadAnalytics = useCallback(async () => {
    if (!player?.id) return;
    setAnalyticsLoading(true);
    const analytics = await fetchPlayerViewAnalytics(player.id);
    setVideoAnalytics(analytics);
    setAnalyticsLoading(false);
  }, [player?.id]);

  useEffect(() => {
    if (isOpen && player && activeTab === 'video') {
      loadAnalytics();
    }
  }, [isOpen, player, activeTab, loadAnalytics]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('stats');
      setVideoAnalytics(null);
    }
  }, [isOpen]);

  if (!isOpen || !player) return null;

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    const result = await submitInquiry({
      scoutName: inquiryForm.name,
      scoutEmail: inquiryForm.email,
      message: inquiryForm.message,
      playerId: player.id,
      userId: user?.id,
    });
    setInquiryLoading(false);
    if (result.success) {
      setInquirySent(true);
      setTimeout(() => setInquirySent(false), 3000);
      setInquiryForm({ name: '', email: '', message: '' });
    }
  };

  const handleViewRecorded = () => {
    loadAnalytics();
    onViewRecorded?.();
  };

  const handleViewAnalytics = () => {
    onClose();
    navigate(`/player/${player.id}`);
  };

  const hasVideo = !!player.videoUrl;

  const tabs = [
    { key: 'stats' as const, label: t('modal.stats') },
    { key: 'video' as const, label: t('modal.video'), hasIndicator: hasVideo },
    { key: 'career' as const, label: t('modal.career') },
    { key: 'contact' as const, label: t('modal.contact') },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#0f1f13] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#006633]/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f13] via-[#0f1f13]/50 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[#CE1126] transition-colors flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(player.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                isShortlisted ? 'bg-[#CE1126] text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-[#CE1126]/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
              {isShortlisted ? (lang === 'fr' ? 'Dans la liste' : 'Shortlisted') : t('players.addToShortlist')}
            </button>
            {hasVideo && (
              <button
                onClick={() => setActiveTab('video')}
                className="px-3 py-2 rounded-full bg-[#FCD116]/90 backdrop-blur-sm text-[#0a1a0f] text-sm font-bold flex items-center gap-1.5 hover:bg-[#FCD116] transition-colors shadow-lg shadow-[#FCD116]/20"
              >
                <Film className="w-4 h-4" />
                <span className="hidden sm:inline">{t('modal.watchHighlights')}</span>
              </button>
            )}
          </div>
          {/* View count badge on header */}
          {videoAnalytics && videoAnalytics.totalViews > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-[#FCD116]/30">
              <Eye className="w-3.5 h-3.5 text-[#FCD116]" />
              <span className="text-white text-xs font-bold">{formatViewCount(videoAnalytics.totalViews)} {lang === 'fr' ? 'vues' : 'views'}</span>
            </div>
          )}
        </div>

        <div className="px-6 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-[#0f1f13] shadow-xl">
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-white">{player.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="px-3 py-0.5 rounded-full bg-[#006633]/30 text-[#006633] text-sm font-medium border border-[#006633]/30">
                  {lang === 'fr' ? player.positionFr : player.position}
                </span>
                <span className="text-gray-400 text-sm">{player.club}</span>
                {hasVideo && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FCD116]/20 text-[#FCD116] text-xs font-bold border border-[#FCD116]/30 flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    {t('modal.videoAvailable')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#FCD116]/10 px-4 py-2 rounded-xl border border-[#FCD116]/30">
                <span className="text-[#FCD116] text-2xl font-extrabold">{player.rating}</span>
                <span className="text-[#FCD116]/60 text-sm">/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { icon: Calendar, label: t('players.age'), value: `${player.age} ${t('players.years')}` },
              { icon: Ruler, label: t('modal.height'), value: player.height },
              { icon: Weight, label: t('modal.weight'), value: player.weight },
              { icon: Footprints, label: t('modal.foot'), value: player.foot },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <item.icon className="w-4 h-4 text-[#FCD116] mb-1" />
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-white font-bold text-sm">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Full Analytics Link */}
          <button
            onClick={handleViewAnalytics}
            className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 bg-gradient-to-r from-[#006633]/20 to-[#FCD116]/10 hover:from-[#006633]/30 hover:to-[#FCD116]/20 text-white rounded-xl transition-all text-sm font-medium border border-[#006633]/30 hover:border-[#FCD116]/30"
          >
            <BarChart3 className="w-4 h-4 text-[#FCD116]" />
            {t('modal.fullAnalytics')}
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </button>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{lang === 'fr' ? player.bioFr : player.bio}</p>

          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.key ? 'bg-[#006633] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                {tab.key === 'video' && <Film className="w-3.5 h-3.5" />}
                {tab.label}
                {tab.hasIndicator && (
                  <span className="w-2 h-2 rounded-full bg-[#FCD116] animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="pb-6">
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: t('modal.goals'), value: player.goals, color: 'text-[#CE1126]' },
                    { label: t('modal.assists'), value: player.assists, color: 'text-[#FCD116]' },
                    { label: t('modal.matches'), value: player.matches, color: 'text-[#006633]' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                      <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <StatBar label={t('modal.speed')} value={player.speed} color="bg-gradient-to-r from-[#006633] to-[#00cc66]" />
                  <StatBar label={t('modal.shooting')} value={player.shooting} color="bg-gradient-to-r from-[#CE1126] to-[#ff4455]" />
                  <StatBar label={t('modal.passing')} value={player.passing} color="bg-gradient-to-r from-[#1a5276] to-[#3498db]" />
                  <StatBar label={t('modal.dribbling')} value={player.dribbling} color="bg-gradient-to-r from-[#FCD116] to-[#f9e547]" />
                  <StatBar label={t('modal.defense')} value={player.defense} color="bg-gradient-to-r from-[#6c3483] to-[#a569bd]" />
                  <StatBar label={t('modal.stamina')} value={player.stamina} color="bg-gradient-to-r from-[#e67e22] to-[#f39c12]" />
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-4">
                {hasVideo ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FCD116]/20 flex items-center justify-center">
                          <Film className="w-5 h-5 text-[#FCD116]" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{t('modal.videoHighlights')}</h3>
                          <p className="text-gray-500 text-xs">
                            {lang === 'fr' ? 'Clips de compétences et moments forts' : 'Skill clips and highlight moments'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Video Analytics Stats Bar */}
                    {analyticsLoading ? (
                      <div className="flex items-center justify-center py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500 mr-2" />
                        <span className="text-gray-500 text-xs">{lang === 'fr' ? 'Chargement des statistiques...' : 'Loading stats...'}</span>
                      </div>
                    ) : videoAnalytics && videoAnalytics.totalViews > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-center">
                          <Eye className="w-4 h-4 text-[#FCD116] mx-auto mb-1" />
                          <div className="text-lg font-extrabold text-white">{formatViewCount(videoAnalytics.totalViews)}</div>
                          <div className="text-[10px] text-gray-500">{lang === 'fr' ? 'Vues' : 'Views'}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-center">
                          <Users className="w-4 h-4 text-[#006633] mx-auto mb-1" />
                          <div className="text-lg font-extrabold text-white">{videoAnalytics.uniqueViewers}</div>
                          <div className="text-[10px] text-gray-500">{lang === 'fr' ? 'Uniques' : 'Unique'}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-center">
                          <Clock className="w-4 h-4 text-[#CE1126] mx-auto mb-1" />
                          <div className="text-lg font-extrabold text-white">{formatWatchTime(videoAnalytics.avgWatchDuration)}</div>
                          <div className="text-[10px] text-gray-500">{lang === 'fr' ? 'Moy. durée' : 'Avg. time'}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-center">
                          <BarChart3 className="w-4 h-4 text-[#FCD116] mx-auto mb-1" />
                          <div className="text-lg font-extrabold text-white">{videoAnalytics.avgCompletion}%</div>
                          <div className="text-[10px] text-gray-500">{lang === 'fr' ? 'Complétion' : 'Completion'}</div>
                        </div>
                      </div>
                    ) : null}

                    <VideoPlayer
                      src={player.videoUrl!}
                      poster={player.image}
                      playerName={player.name}
                      playerId={player.id}
                      viewCount={videoAnalytics?.totalViews}
                      onViewRecorded={handleViewRecorded}
                    />

                    {/* Recent Viewers */}
                    {videoAnalytics && videoAnalytics.recentViewers.length > 0 && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#006633]" />
                          {lang === 'fr' ? 'Vues récentes' : 'Recent Views'}
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {videoAnalytics.recentViewers.slice(0, 5).map((viewer, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#006633]/20 flex items-center justify-center">
                                  <Eye className="w-3 h-3 text-[#006633]" />
                                </div>
                                <span className="text-gray-400">
                                  {viewer.viewer_name || viewer.viewer_email || (lang === 'fr' ? 'Visiteur anonyme' : 'Anonymous viewer')}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-gray-500">
                                <span>{formatWatchTime(Number(viewer.watch_duration))}</span>
                                <span>{new Date(viewer.watched_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Film className="w-4 h-4 text-[#006633]" />
                        <span>
                          {lang === 'fr'
                            ? 'Vidéo de présentation des compétences et des moments forts du joueur en match.'
                            : 'Showcase video of the player\'s skills and match highlights.'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <VideoOff className="w-9 h-9 text-gray-600" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{t('modal.noVideo')}</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      {lang === 'fr'
                        ? 'Les vidéos de highlights seront bientôt disponibles pour ce joueur. Revenez plus tard!'
                        : 'Highlight videos will be available for this player soon. Check back later!'}
                    </p>
                    <div className="mt-6 px-5 py-3 bg-[#006633]/10 border border-[#006633]/30 rounded-xl">
                      <p className="text-[#006633] text-xs font-medium">
                        {lang === 'fr'
                          ? 'Les recruteurs peuvent demander des vidéos via le formulaire de contact.'
                          : 'Scouts can request videos through the contact form.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'career' && (
              <div className="space-y-4">
                {player.career.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FCD116] shadow-lg shadow-[#FCD116]/30" />
                      {i < player.career.length - 1 && <div className="w-0.5 flex-1 bg-[#006633]/30 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-[#FCD116] text-sm font-bold">{event.year}</span>
                      <p className="text-white mt-1">{lang === 'fr' ? event.eventFr : event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                {inquirySent ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <CheckCircle className="w-12 h-12 text-[#006633] mb-3" />
                    <p className="text-white font-bold text-lg">{t('scout.sent')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">{t('scout.name')}</label>
                      <input type="text" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">{t('scout.email')}</label>
                      <input type="email" required value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">{t('scout.message')}</label>
                      <textarea required rows={3} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors resize-none" />
                    </div>
                    <button type="submit" disabled={inquiryLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-bold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all disabled:opacity-50">
                      {inquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {t('modal.inquire')}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
