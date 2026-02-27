import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Player, submitInquiry } from '@/data/players';
import { ClipboardList, GitCompare, Mail, Trash2, CheckCircle, Send, BarChart3, Users, Eye, Loader2, LogIn } from 'lucide-react';

interface ScoutDashboardProps {
  players: Player[];
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  onViewProfile: (player: Player) => void;
  onOpenAuth: () => void;
}

const ScoutDashboard: React.FC<ScoutDashboardProps> = ({ players, shortlist, onToggleShortlist, onViewProfile, onOpenAuth }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'shortlist' | 'compare' | 'inquiry'>('shortlist');
  const [compareIds, setCompareIds] = useState<[string | null, string | null]>([null, null]);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', club: '', message: '' });

  const shortlistedPlayers = players.filter((p) => shortlist.includes(p.id));

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    const result = await submitInquiry({
      scoutName: inquiryForm.name,
      scoutEmail: inquiryForm.email,
      club: inquiryForm.club,
      message: inquiryForm.message,
      userId: user?.id,
    });
    setInquiryLoading(false);
    if (result.success) {
      setInquirySent(true);
      setTimeout(() => setInquirySent(false), 3000);
      setInquiryForm({ name: '', email: '', club: '', message: '' });
    }
  };

  const comparePlayer1 = compareIds[0] ? players.find((p) => p.id === compareIds[0]) : null;
  const comparePlayer2 = compareIds[1] ? players.find((p) => p.id === compareIds[1]) : null;

  const statKeys: { key: keyof Player; label: string }[] = [
    { key: 'speed', label: t('modal.speed') },
    { key: 'shooting', label: t('modal.shooting') },
    { key: 'passing', label: t('modal.passing') },
    { key: 'dribbling', label: t('modal.dribbling') },
    { key: 'defense', label: t('modal.defense') },
    { key: 'stamina', label: t('modal.stamina') },
  ];

  const tabs = [
    { key: 'shortlist' as const, label: t('scout.shortlist'), icon: ClipboardList },
    { key: 'compare' as const, label: t('scout.compare'), icon: GitCompare },
    { key: 'inquiry' as const, label: t('scout.inquiry'), icon: Mail },
  ];

  return (
    <section id="scout" className="py-20 bg-gradient-to-b from-[#0a1a0f] via-[#0d1f11] to-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#006633]/15 border border-[#006633]/30 mb-4">
            <BarChart3 className="w-4 h-4 text-[#006633]" />
            <span className="text-[#006633] text-sm font-medium">{lang === 'fr' ? 'PROFESSIONNEL' : 'PROFESSIONAL'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">{t('scout.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('scout.subtitle')}</p>
        </div>

        <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1.5 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-[#006633] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#111c14] rounded-2xl border border-[#006633]/20 p-6 min-h-[400px]">
          {/* Shortlist Tab */}
          {activeTab === 'shortlist' && (
            <div>
              {!user && (
                <div className="mb-6 p-4 bg-[#FCD116]/5 border border-[#FCD116]/20 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {lang === 'fr' ? 'Connectez-vous pour sauvegarder votre liste de manière permanente' : 'Sign in to save your shortlist permanently'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {lang === 'fr' ? 'Votre liste actuelle est temporaire et sera perdue à la fermeture' : 'Your current list is temporary and will be lost on close'}
                    </p>
                  </div>
                  <button onClick={onOpenAuth}
                    className="flex items-center gap-2 px-4 py-2 bg-[#006633] text-white text-sm font-bold rounded-lg hover:bg-[#007744] transition-colors">
                    <LogIn className="w-4 h-4" />
                    {lang === 'fr' ? 'Se Connecter' : 'Sign In'}
                  </button>
                </div>
              )}
              {shortlistedPlayers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{t('scout.empty')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shortlistedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#006633]/30 transition-all">
                      <img src={player.image} alt={player.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate">{player.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{lang === 'fr' ? player.positionFr : player.position}</span>
                          <span className="text-gray-600">|</span>
                          <span>{player.club}</span>
                          <span className="text-gray-600">|</span>
                          <span>{player.age} {t('players.years')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center hidden sm:block">
                          <div className="text-[#FCD116] font-bold text-lg">{player.rating}</div>
                          <div className="text-gray-500 text-xs">{t('modal.rating')}</div>
                        </div>
                        <button onClick={() => onViewProfile(player)} className="p-2 rounded-lg bg-[#006633]/20 text-[#006633] hover:bg-[#006633]/40 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => onToggleShortlist(player.id)} className="p-2 rounded-lg bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/40 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[0, 1].map((idx) => (
                  <div key={idx}>
                    <label className="text-sm text-gray-400 mb-2 block">{lang === 'fr' ? `Joueur ${idx + 1}` : `Player ${idx + 1}`}</label>
                    <select value={compareIds[idx] || ''} onChange={(e) => { const newIds = [...compareIds] as [string | null, string | null]; newIds[idx] = e.target.value || null; setCompareIds(newIds); }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#006633] cursor-pointer">
                      <option value="">{lang === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                      {players.map((p) => (<option key={p.id} value={p.id}>{p.name} - {lang === 'fr' ? p.positionFr : p.position}</option>))}
                    </select>
                  </div>
                ))}
              </div>

              {comparePlayer1 && comparePlayer2 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <img src={comparePlayer1.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div><div className="text-white font-bold text-sm">{comparePlayer1.name}</div><div className="text-gray-500 text-xs">{comparePlayer1.club}</div></div>
                    </div>
                    <div className="text-center text-gray-600 text-sm font-medium self-center">VS</div>
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right"><div className="text-white font-bold text-sm">{comparePlayer2.name}</div><div className="text-gray-500 text-xs">{comparePlayer2.club}</div></div>
                      <img src={comparePlayer2.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    </div>
                  </div>
                  {statKeys.map(({ key, label }) => {
                    const v1 = comparePlayer1[key] as number;
                    const v2 = comparePlayer2[key] as number;
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className={`font-bold ${v1 > v2 ? 'text-[#006633]' : v1 < v2 ? 'text-gray-500' : 'text-gray-400'}`}>{v1}</span>
                          <span className="text-gray-400">{label}</span>
                          <span className={`font-bold ${v2 > v1 ? 'text-[#CE1126]' : v2 < v1 ? 'text-gray-500' : 'text-gray-400'}`}>{v2}</span>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div className="flex-1 bg-white/10 rounded-full overflow-hidden flex justify-end"><div className="h-full bg-[#006633] rounded-full transition-all" style={{ width: `${v1}%` }} /></div>
                          <div className="flex-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#CE1126] rounded-full transition-all" style={{ width: `${v2}%` }} /></div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center"><div className="text-2xl font-extrabold text-[#006633]">{comparePlayer1.rating}</div><div className="text-xs text-gray-500">{t('modal.rating')}</div></div>
                    <div />
                    <div className="text-center"><div className="text-2xl font-extrabold text-[#CE1126]">{comparePlayer2.rating}</div><div className="text-xs text-gray-500">{t('modal.rating')}</div></div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <GitCompare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{lang === 'fr' ? 'Sélectionnez deux joueurs pour les comparer' : 'Select two players to compare'}</p>
                </div>
              )}
            </div>
          )}

          {/* Inquiry Tab */}
          {activeTab === 'inquiry' && (
            <div className="max-w-lg mx-auto">
              {inquirySent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-[#006633] mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">{t('scout.sent')}</h3>
                  <p className="text-gray-400">{lang === 'fr' ? 'Nous vous répondrons dans les plus brefs délais.' : 'We will get back to you as soon as possible.'}</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-5">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-medium">{t('scout.name')}</label>
                    <input type="text" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors" placeholder={lang === 'fr' ? 'Jean Dupont' : 'John Smith'} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-medium">{t('scout.email')}</label>
                    <input type="email" required value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors" placeholder="email@club.com" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-medium">{t('scout.club')}</label>
                    <input type="text" required value={inquiryForm.club} onChange={(e) => setInquiryForm({ ...inquiryForm, club: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors" placeholder={lang === 'fr' ? 'Nom du club' : 'Club name'} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-medium">{t('scout.message')}</label>
                    <textarea required rows={4} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors resize-none"
                      placeholder={lang === 'fr' ? 'Décrivez votre intérêt pour un ou plusieurs joueurs...' : 'Describe your interest in one or more players...'} />
                  </div>
                  <button type="submit" disabled={inquiryLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-bold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all shadow-lg shadow-[#006633]/20 disabled:opacity-50">
                    {inquiryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {t('scout.send')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScoutDashboard;
