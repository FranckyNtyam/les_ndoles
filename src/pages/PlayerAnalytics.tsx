import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchPlayerAnalytics,
  addPlayerComment,
  PlayerAnalyticsData,
  PlayerComment,
  formatRelativeDate,
} from '@/data/playerAnalytics';
import { formatViewCount, formatWatchTime } from '@/data/videoAnalytics';
import RadarChart from '@/components/analytics/RadarChart';
import RatingTimeline from '@/components/analytics/RatingTimeline';
import VideoPlayer from '@/components/VideoPlayer';
import {
  ArrowLeft, Share2, ExternalLink, Eye, Users, Clock, BarChart3,
  MessageSquare, Send, Star, Award, TrendingUp, Calendar, MapPin,
  Target, Ruler, Weight, Footprints, Film, Loader2, Copy, Check,
  ChevronDown, ChevronUp, Shield, Zap, Heart, Globe, Mail,
  UserCheck, AlertCircle,
} from 'lucide-react';

// Inner component that uses language context
const PlayerAnalyticsContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user } = useAuth();

  const [data, setData] = useState<PlayerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAllInquiries, setShowAllInquiries] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Comment form
  const [commentForm, setCommentForm] = useState({
    name: '',
    role: 'Scout',
    email: '',
    content: '',
    rating: 0,
    isEndorsement: false,
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const result = await fetchPlayerAnalytics(id);
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: data ? `${data.player.name} - Player Analytics` : 'Player Analytics',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentForm.name || !commentForm.content) return;

    setSubmittingComment(true);
    const result = await addPlayerComment({
      playerId: id,
      authorName: commentForm.name,
      authorRole: commentForm.role,
      authorEmail: commentForm.email || undefined,
      userId: user?.id,
      content: commentForm.content,
      rating: commentForm.rating > 0 ? commentForm.rating : undefined,
      isEndorsement: commentForm.isEndorsement,
    });

    if (result) {
      setData((prev) =>
        prev ? { ...prev, comments: [result, ...prev.comments] } : prev
      );
      setCommentForm({ name: '', role: 'Scout', email: '', content: '', rating: 0, isEndorsement: false });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    }
    setSubmittingComment(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#FCD116]" />
          <p className="text-gray-400 text-sm">
            {lang === 'fr' ? 'Chargement des analyses...' : 'Loading analytics...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#CE1126]/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#CE1126]" />
          </div>
          <h2 className="text-white text-xl font-bold">
            {lang === 'fr' ? 'Joueur non trouvé' : 'Player Not Found'}
          </h2>
          <p className="text-gray-400 text-sm max-w-md">
            {lang === 'fr'
              ? "Ce profil de joueur n'existe pas ou n'est plus disponible."
              : "This player profile doesn't exist or is no longer available."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-[#006633] text-white rounded-xl hover:bg-[#007744] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'fr' ? "Retour à l'accueil" : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  const player = data.player;
  const va = data.video_analytics;
  const hasVideo = !!player.video_url;

  // Map player data for radar chart
  const radarData = [
    { label: t('modal.speed'), value: player.speed },
    { label: t('modal.shooting'), value: player.shooting },
    { label: t('modal.passing'), value: player.passing },
    { label: t('modal.dribbling'), value: player.dribbling },
    { label: t('modal.defense'), value: player.defense },
    { label: t('modal.stamina'), value: player.stamina },
  ];

  const avgSkill = Math.round(
    (player.speed + player.shooting + player.passing + player.dribbling + player.defense + player.stamina) / 6
  );

  const sections = [
    { key: 'overview', label: lang === 'fr' ? 'Aperçu' : 'Overview' },
    { key: 'skills', label: lang === 'fr' ? 'Compétences' : 'Skills' },
    { key: 'video', label: lang === 'fr' ? 'Vidéo' : 'Video' },
    { key: 'engagement', label: lang === 'fr' ? 'Engagement' : 'Engagement' },
    { key: 'comments', label: lang === 'fr' ? 'Avis' : 'Reviews' },
  ];

  const endorsements = data.comments.filter((c) => c.is_endorsement);
  const regularComments = data.comments.filter((c) => !c.is_endorsement);
  const avgCommentRating =
    data.comments.filter((c) => c.rating).length > 0
      ? data.comments.filter((c) => c.rating).reduce((sum, c) => sum + (c.rating || 0), 0) /
        data.comments.filter((c) => c.rating).length
      : 0;

  return (
    <div className="min-h-screen bg-[#0a1a0f] text-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1a0f]/95 backdrop-blur-md border-b border-[#006633]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">
                  {lang === 'fr' ? 'Retour' : 'Back'}
                </span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-sm">
                  Lions<span className="text-[#FCD116]">Talent</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#006633]/50 text-sm font-medium text-gray-300 hover:text-[#FCD116] hover:border-[#FCD116]/50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[#006633] text-white rounded-lg hover:bg-[#007744] transition-colors text-sm font-medium"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {copied
                    ? lang === 'fr' ? 'Copié!' : 'Copied!'
                    : lang === 'fr' ? 'Partager' : 'Share'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative pt-16">
        <div className="h-56 sm:h-72 overflow-hidden relative">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0f] via-[#0a1a0f]/70 to-[#0a1a0f]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a0f]/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-[#0a1a0f] shadow-2xl flex-shrink-0">
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#006633]/30 text-[#006633] text-xs font-bold border border-[#006633]/30">
                  {lang === 'fr' ? player.position_fr : player.position}
                </span>
                {hasVideo && (
                  <span className="px-3 py-1 rounded-full bg-[#FCD116]/20 text-[#FCD116] text-xs font-bold border border-[#FCD116]/30 flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    {lang === 'fr' ? 'Vidéo Disponible' : 'Video Available'}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/10">
                  ID: {player.id?.slice(0, 8)}...
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{player.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#006633]" />
                  {player.club}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#CE1126]" />
                  {player.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FCD116]" />
                  {player.age} {lang === 'fr' ? 'ans' : 'years'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center bg-[#FCD116]/10 px-6 py-4 rounded-2xl border border-[#FCD116]/30">
                <div className="text-3xl font-extrabold text-[#FCD116]">{Number(player.rating).toFixed(1)}</div>
                <div className="text-xs text-[#FCD116]/60 font-medium">{lang === 'fr' ? 'Note' : 'Rating'}</div>
              </div>
              <div className="text-center bg-white/5 px-5 py-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-extrabold text-white">{avgSkill}</div>
                <div className="text-xs text-gray-500 font-medium">{lang === 'fr' ? 'Moy. Comp.' : 'Avg. Skill'}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-8">
            {[
              { icon: Ruler, label: lang === 'fr' ? 'Taille' : 'Height', value: player.height },
              { icon: Weight, label: lang === 'fr' ? 'Poids' : 'Weight', value: player.weight },
              { icon: Footprints, label: lang === 'fr' ? 'Pied' : 'Foot', value: player.foot },
              { icon: Target, label: lang === 'fr' ? 'Buts' : 'Goals', value: player.goals },
              { icon: Zap, label: lang === 'fr' ? 'Passes D.' : 'Assists', value: player.assists },
              { icon: Shield, label: lang === 'fr' ? 'Matchs' : 'Matches', value: player.matches },
              { icon: Eye, label: lang === 'fr' ? 'Vues Vidéo' : 'Video Views', value: formatViewCount(va.total_views) },
              { icon: Mail, label: lang === 'fr' ? 'Demandes' : 'Inquiries', value: data.inquiry_count },
            ].map((stat, i) => (
              <div key={i} className="bg-[#111c14] rounded-xl p-3 border border-[#006633]/20 hover:border-[#FCD116]/30 transition-colors">
                <stat.icon className="w-4 h-4 text-[#FCD116] mb-1.5" />
                <div className="text-white font-bold text-sm">{stat.value}</div>
                <div className="text-gray-500 text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-16 z-40 bg-[#0a1a0f]/95 backdrop-blur-md border-b border-[#006633]/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setActiveSection(s.key);
                  document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeSection === s.key
                    ? 'bg-[#006633] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* SECTION: Overview - Rating Timeline */}
        <section id="section-overview">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#006633]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#006633]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'fr' ? 'Progression de la Note' : 'Rating Progression'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'fr' ? 'Évolution de la performance au fil du temps' : 'Performance evolution over time'}
              </p>
            </div>
          </div>
          <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20">
            <RatingTimeline data={data.rating_history} height={280} />
            {/* Career events legend */}
            {data.rating_history.filter((r) => r.event).length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <h4 className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                  {lang === 'fr' ? 'Événements Clés' : 'Key Events'}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {data.rating_history
                    .filter((r) => r.event)
                    .map((r, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-[#FCD116]/10">
                        <div className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        <span className="text-gray-400 text-xs">{r.year}</span>
                        <span className="text-white text-xs font-medium">{r.event}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 mt-6">
            <p className="text-gray-300 leading-relaxed">
              {lang === 'fr' ? player.bio_fr : player.bio}
            </p>
          </div>
        </section>

        {/* SECTION: Skills - Radar Chart */}
        <section id="section-skills">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FCD116]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#FCD116]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'fr' ? 'Profil de Compétences' : 'Skill Profile'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'fr' ? 'Analyse détaillée des attributs du joueur' : 'Detailed analysis of player attributes'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 flex items-center justify-center">
              <RadarChart data={radarData} size={320} />
            </div>

            {/* Skill Bars */}
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 space-y-4">
              <h3 className="text-white font-bold mb-4">
                {lang === 'fr' ? 'Détail des Attributs' : 'Attribute Details'}
              </h3>
              {[
                { label: t('modal.speed'), value: player.speed, color: 'from-[#006633] to-[#00cc66]', icon: Zap },
                { label: t('modal.shooting'), value: player.shooting, color: 'from-[#CE1126] to-[#ff4455]', icon: Target },
                { label: t('modal.passing'), value: player.passing, color: 'from-[#1a5276] to-[#3498db]', icon: Send },
                { label: t('modal.dribbling'), value: player.dribbling, color: 'from-[#FCD116] to-[#f9e547]', icon: Zap },
                { label: t('modal.defense'), value: player.defense, color: 'from-[#6c3483] to-[#a569bd]', icon: Shield },
                { label: t('modal.stamina'), value: player.stamina, color: 'from-[#e67e22] to-[#f39c12]', icon: Heart },
              ].map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <skill.icon className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-400 text-sm">{skill.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{skill.value}</span>
                      <span className="text-gray-600 text-xs">/100</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Overall */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">
                    {lang === 'fr' ? 'Moyenne Globale' : 'Overall Average'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FCD116] font-extrabold text-lg">{avgSkill}</span>
                    <span className="text-gray-600 text-xs">/100</span>
                  </div>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#006633] via-[#FCD116] to-[#CE1126] transition-all duration-700"
                    style={{ width: `${avgSkill}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Video Analytics */}
        <section id="section-video">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#CE1126]/20 flex items-center justify-center">
              <Film className="w-5 h-5 text-[#CE1126]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'fr' ? 'Highlights Vidéo & Analytique' : 'Video Highlights & Analytics'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'fr' ? 'Performance vidéo et engagement des recruteurs' : 'Video performance and scout engagement'}
              </p>
            </div>
          </div>

          {hasVideo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 bg-[#111c14] rounded-2xl p-4 border border-[#006633]/20">
                <VideoPlayer
                  src={player.video_url}
                  poster={player.image}
                  playerName={player.name}
                  playerId={player.id}
                  viewCount={va.total_views}
                  onViewRecorded={loadData}
                />
              </div>

              {/* Video Stats */}
              <div className="space-y-4">
                <div className="bg-[#111c14] rounded-2xl p-5 border border-[#006633]/20">
                  <h3 className="text-white font-bold text-sm mb-4">
                    {lang === 'fr' ? 'Métriques Vidéo' : 'Video Metrics'}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Eye, label: lang === 'fr' ? 'Vues Totales' : 'Total Views', value: formatViewCount(va.total_views), color: 'text-[#FCD116]' },
                      { icon: Users, label: lang === 'fr' ? 'Spectateurs Uniques' : 'Unique Viewers', value: va.unique_viewers, color: 'text-[#006633]' },
                      { icon: Clock, label: lang === 'fr' ? 'Durée Moy.' : 'Avg. Duration', value: formatWatchTime(va.avg_watch_duration), color: 'text-[#CE1126]' },
                      { icon: BarChart3, label: lang === 'fr' ? 'Complétion Moy.' : 'Avg. Completion', value: `${va.avg_completion}%`, color: 'text-[#FCD116]' },
                      { icon: Clock, label: lang === 'fr' ? 'Temps Total' : 'Total Watch Time', value: formatWatchTime(va.total_watch_time), color: 'text-[#006633]' },
                    ].map((metric, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center ${metric.color}`}>
                          <metric.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-500 text-xs">{metric.label}</div>
                          <div className="text-white font-bold">{metric.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Viewer Demographics */}
                <div className="bg-[#111c14] rounded-2xl p-5 border border-[#006633]/20">
                  <h3 className="text-white font-bold text-sm mb-4">
                    {lang === 'fr' ? 'Démographie des Spectateurs' : 'Viewer Demographics'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#006633]" />
                        <span className="text-gray-400 text-sm">
                          {lang === 'fr' ? 'Identifiés' : 'Identified'}
                        </span>
                      </div>
                      <span className="text-white font-bold">{va.viewer_demographics.identified}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400 text-sm">
                          {lang === 'fr' ? 'Anonymes' : 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-white font-bold">{va.viewer_demographics.anonymous}</span>
                    </div>
                    {va.total_views > 0 && (
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-[#006633] rounded-full"
                          style={{
                            width: `${(va.viewer_demographics.identified / va.total_views) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111c14] rounded-2xl p-12 border border-[#006633]/20 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Film className="w-9 h-9 text-gray-600" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {lang === 'fr' ? 'Aucune vidéo disponible' : 'No Video Available'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {lang === 'fr'
                  ? 'Les vidéos de highlights seront bientôt disponibles pour ce joueur.'
                  : 'Highlight videos will be available for this player soon.'}
              </p>
            </div>
          )}

          {/* Recent Viewers */}
          {va.recent_viewers.length > 0 && (
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 mt-6">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#006633]" />
                {lang === 'fr' ? 'Spectateurs Récents' : 'Recent Viewers'}
              </h3>
              <div className="space-y-2">
                {va.recent_viewers.slice(0, showAllInquiries ? 20 : 5).map((viewer, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#006633]/20 flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-[#006633]" />
                      </div>
                      <div>
                        <span className="text-white text-sm font-medium">
                          {viewer.viewer_name || viewer.viewer_email || (lang === 'fr' ? 'Visiteur anonyme' : 'Anonymous viewer')}
                        </span>
                        <div className="text-gray-500 text-xs">{formatRelativeDate(viewer.watched_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatWatchTime(viewer.watch_duration)}
                      </span>
                      <span>{viewer.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {va.recent_viewers.length > 5 && (
                <button
                  onClick={() => setShowAllInquiries(!showAllInquiries)}
                  className="mt-3 text-[#FCD116] text-xs font-medium flex items-center gap-1 hover:underline"
                >
                  {showAllInquiries ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showAllInquiries
                    ? lang === 'fr' ? 'Voir moins' : 'Show less'
                    : lang === 'fr' ? 'Voir tout' : 'Show all'}
                </button>
              )}
            </div>
          )}
        </section>

        {/* SECTION: Engagement - Inquiries */}
        <section id="section-engagement">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#006633]/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#006633]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'fr' ? 'Engagement des Recruteurs' : 'Scout Engagement'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'fr' ? 'Demandes et intérêt des recruteurs professionnels' : 'Inquiries and interest from professional scouts'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 text-center">
              <Mail className="w-8 h-8 text-[#FCD116] mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-white">{data.inquiry_count}</div>
              <div className="text-gray-500 text-xs mt-1">
                {lang === 'fr' ? 'Demandes Totales' : 'Total Inquiries'}
              </div>
            </div>
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 text-center">
              <Eye className="w-8 h-8 text-[#006633] mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-white">{va.total_views}</div>
              <div className="text-gray-500 text-xs mt-1">
                {lang === 'fr' ? 'Vues de Profil' : 'Profile Views'}
              </div>
            </div>
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 text-center">
              <MessageSquare className="w-8 h-8 text-[#CE1126] mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-white">{data.comments.length}</div>
              <div className="text-gray-500 text-xs mt-1">
                {lang === 'fr' ? 'Avis & Endorsements' : 'Reviews & Endorsements'}
              </div>
            </div>
          </div>

          {/* Recent Inquiries */}
          {data.recent_inquiries.length > 0 && (
            <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FCD116]" />
                {lang === 'fr' ? 'Demandes Récentes' : 'Recent Inquiries'}
              </h3>
              <div className="space-y-3">
                {data.recent_inquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FCD116]/10 flex items-center justify-center">
                        <span className="text-[#FCD116] text-xs font-bold">
                          {inq.scout_name?.charAt(0)?.toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white text-sm font-medium">{inq.scout_name}</span>
                        {inq.club && (
                          <span className="text-gray-500 text-xs ml-2">({inq.club})</span>
                        )}
                        <div className="text-gray-500 text-xs">{formatRelativeDate(inq.created_at)}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        inq.status === 'replied'
                          ? 'bg-[#006633]/20 text-[#006633]'
                          : inq.status === 'pending' || !inq.status
                          ? 'bg-[#FCD116]/20 text-[#FCD116]'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {inq.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION: Comments & Endorsements */}
        <section id="section-comments">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FCD116]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#FCD116]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'fr' ? 'Avis & Endorsements' : 'Reviews & Endorsements'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'fr'
                  ? 'Commentaires publics des recruteurs et agents'
                  : 'Public comments from scouts and agents'}
              </p>
            </div>
            {avgCommentRating > 0 && (
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#FCD116]/10 rounded-lg border border-[#FCD116]/20">
                <Star className="w-4 h-4 text-[#FCD116] fill-[#FCD116]" />
                <span className="text-[#FCD116] font-bold text-sm">{avgCommentRating.toFixed(1)}</span>
                <span className="text-gray-500 text-xs">({data.comments.filter((c) => c.rating).length})</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Comment Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#111c14] rounded-2xl p-6 border border-[#006633]/20 sticky top-36">
                <h3 className="text-white font-bold text-sm mb-4">
                  {lang === 'fr' ? 'Laisser un Avis' : 'Leave a Review'}
                </h3>

                {commentSuccess ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#006633]/20 flex items-center justify-center mb-3">
                      <Check className="w-6 h-6 text-[#006633]" />
                    </div>
                    <p className="text-white font-medium">
                      {lang === 'fr' ? 'Avis publié!' : 'Review posted!'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComment} className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {lang === 'fr' ? 'Votre Nom' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors"
                        placeholder={lang === 'fr' ? 'Jean Dupont' : 'John Doe'}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {lang === 'fr' ? 'Rôle' : 'Role'}
                      </label>
                      <select
                        value={commentForm.role}
                        onChange={(e) => setCommentForm({ ...commentForm, role: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#006633] transition-colors"
                      >
                        <option value="Scout">{lang === 'fr' ? 'Recruteur' : 'Scout'}</option>
                        <option value="Agent">Agent</option>
                        <option value="Coach">{lang === 'fr' ? 'Entraîneur' : 'Coach'}</option>
                        <option value="Fan">Fan</option>
                        <option value="Journalist">{lang === 'fr' ? 'Journaliste' : 'Journalist'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email</label>
                      <input
                        type="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {lang === 'fr' ? 'Note' : 'Rating'}
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setCommentForm({
                                ...commentForm,
                                rating: commentForm.rating === star ? 0 : star,
                              })
                            }
                            className="p-1 transition-colors"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= commentForm.rating
                                  ? 'text-[#FCD116] fill-[#FCD116]'
                                  : 'text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {lang === 'fr' ? 'Commentaire' : 'Comment'} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors resize-none"
                        placeholder={lang === 'fr' ? 'Partagez votre avis...' : 'Share your thoughts...'}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commentForm.isEndorsement}
                        onChange={(e) =>
                          setCommentForm({ ...commentForm, isEndorsement: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#006633] focus:ring-[#006633]"
                      />
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#FCD116]" />
                        {lang === 'fr' ? 'Endorsement officiel' : 'Official endorsement'}
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-bold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all disabled:opacity-50 text-sm"
                    >
                      {submittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {lang === 'fr' ? 'Publier' : 'Post Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Endorsements */}
              {endorsements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs text-[#FCD116] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    {lang === 'fr' ? 'Endorsements' : 'Endorsements'} ({endorsements.length})
                  </h4>
                  {endorsements.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} lang={lang} isEndorsement />
                  ))}
                </div>
              )}

              {/* Regular Comments */}
              {regularComments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {lang === 'fr' ? 'Commentaires' : 'Comments'} ({regularComments.length})
                  </h4>
                  {(showAllComments ? regularComments : regularComments.slice(0, 5)).map((comment) => (
                    <CommentCard key={comment.id} comment={comment} lang={lang} />
                  ))}
                  {regularComments.length > 5 && (
                    <button
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="text-[#FCD116] text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      {showAllComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showAllComments
                        ? lang === 'fr' ? 'Voir moins' : 'Show less'
                        : lang === 'fr' ? `Voir les ${regularComments.length - 5} autres` : `Show ${regularComments.length - 5} more`}
                    </button>
                  )}
                </div>
              )}

              {data.comments.length === 0 && (
                <div className="bg-[#111c14] rounded-2xl p-12 border border-[#006633]/20 text-center">
                  <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">
                    {lang === 'fr' ? 'Aucun avis pour le moment' : 'No reviews yet'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {lang === 'fr'
                      ? 'Soyez le premier à laisser un avis sur ce joueur!'
                      : 'Be the first to leave a review for this player!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Share CTA */}
        <div className="bg-gradient-to-r from-[#006633]/20 via-[#111c14] to-[#FCD116]/10 rounded-2xl p-8 border border-[#006633]/30 text-center">
          <Share2 className="w-8 h-8 text-[#FCD116] mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">
            {lang === 'fr' ? 'Partagez ce profil' : 'Share this Profile'}
          </h3>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
            {lang === 'fr'
              ? "Envoyez ce lien aux agents et recruteurs pour qu'ils découvrent ce talent."
              : 'Send this link to agents and scouts so they can discover this talent.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 text-sm max-w-sm truncate">
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{window.location.href}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#006633] text-white rounded-xl hover:bg-[#007744] transition-colors font-medium text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? (lang === 'fr' ? 'Copié!' : 'Copied!') : (lang === 'fr' ? 'Copier' : 'Copy')}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#006633]/20 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">
              Lions<span className="text-[#FCD116]">Talent</span>
            </span>
          </Link>
          <p className="text-gray-600 text-xs">
            &copy; 2026 LionsTalent Cameroun. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

// Comment Card Component
const CommentCard: React.FC<{
  comment: PlayerComment;
  lang: string;
  isEndorsement?: boolean;
}> = ({ comment, lang, isEndorsement }) => {
  const roleColors: Record<string, string> = {
    Scout: 'bg-[#006633]/20 text-[#006633] border-[#006633]/30',
    Agent: 'bg-[#FCD116]/20 text-[#FCD116] border-[#FCD116]/30',
    Coach: 'bg-[#CE1126]/20 text-[#CE1126] border-[#CE1126]/30',
    Fan: 'bg-white/10 text-gray-400 border-white/20',
    Journalist: 'bg-[#1a5276]/20 text-[#3498db] border-[#1a5276]/30',
  };

  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        isEndorsement
          ? 'bg-[#FCD116]/5 border-[#FCD116]/20 hover:border-[#FCD116]/40'
          : 'bg-[#111c14] border-[#006633]/20 hover:border-[#006633]/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isEndorsement ? 'bg-[#FCD116]/20' : 'bg-[#006633]/20'
          }`}
        >
          {isEndorsement ? (
            <Award className="w-5 h-5 text-[#FCD116]" />
          ) : (
            <span className={`text-sm font-bold ${isEndorsement ? 'text-[#FCD116]' : 'text-[#006633]'}`}>
              {comment.author_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-white font-bold text-sm">{comment.author_name}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                roleColors[comment.author_role] || roleColors.Fan
              }`}
            >
              {comment.author_role}
            </span>
            {isEndorsement && (
              <span className="px-2 py-0.5 rounded-full bg-[#FCD116]/20 text-[#FCD116] text-[10px] font-bold border border-[#FCD116]/30 flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5" />
                {lang === 'fr' ? 'Endorsement' : 'Endorsed'}
              </span>
            )}
          </div>
          {comment.rating && (
            <div className="flex items-center gap-0.5 mb-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= comment.rating! ? 'text-[#FCD116] fill-[#FCD116]' : 'text-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
          <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
          <div className="text-gray-600 text-xs mt-2">{formatRelativeDate(comment.created_at)}</div>
        </div>
      </div>
    </div>
  );
};

// Wrapper with LanguageProvider
const PlayerAnalytics: React.FC = () => {
  return (
    <LanguageProvider>
      <PlayerAnalyticsContent />
    </LanguageProvider>
  );
};

export default PlayerAnalytics;
