import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { checkAdminPassword, fetchDashboardStats } from '@/data/admin';
import AdminSubmissions from '@/components/admin/AdminSubmissions';
import AdminPlayers from '@/components/admin/AdminPlayers';
import AdminInquiries from '@/components/admin/AdminInquiries';

type Tab = 'overview' | 'submissions' | 'players' | 'inquiries';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Check session storage for admin auth
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('lions_admin_auth');
    if (isAdmin === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Load stats when authenticated
  useEffect(() => {
    if (authenticated) {
      loadStats();
    }
  }, [authenticated]);

  const loadStats = async () => {
    setStatsLoading(true);
    const data = await fetchDashboardStats();
    setStats(data);
    setStatsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 500));

    if (checkAdminPassword(password)) {
      sessionStorage.setItem('lions_admin_auth', 'true');
      setAuthenticated(true);
    } else {
      setLoginError('Invalid admin password. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lions_admin_auth');
    setAuthenticated(false);
    setPassword('');
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'submissions', label: 'Submissions', icon: FileText, count: stats.pendingSubmissions },
    { key: 'players', label: 'Players', icon: Users, count: stats.totalPlayers },
    { key: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: stats.pendingInquiries },
  ];

  // ─── Login Screen ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#006633]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CE1126]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#FCD116] transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to LesNdolés
          </button>

          <div className="bg-[#111c14] border border-[#006633]/30 rounded-2xl p-8 shadow-2xl shadow-black/40">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center mb-4 shadow-lg shadow-[#006633]/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">LesNdolés Cameroun - Administration</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-12 py-3 bg-[#0a1a0f] border border-[#006633]/30 rounded-xl text-white text-sm focus:outline-none focus:border-[#FCD116]/50 transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading || !password}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-semibold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all disabled:opacity-50 shadow-lg shadow-[#006633]/20"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Access Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 p-3 bg-[#FCD116]/5 border border-[#FCD116]/20 rounded-lg">
              <p className="text-[#FCD116]/70 text-xs text-center">
                Default password: <span className="font-mono font-bold text-[#FCD116]">LesNdolés2026!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a1a0f]">
      {/* Top Bar */}
      <header className="bg-[#111c14]/95 backdrop-blur-md border-b border-[#006633]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">
                  Les<span className="text-[#FCD116]">Ndolés</span>{' '}
                  <span className="text-[#006633] text-sm font-medium">Admin</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CE1126]/30 text-[#CE1126] hover:bg-[#CE1126]/10 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#006633] text-white shadow-lg shadow-[#006633]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FCD116]/20 text-[#FCD116]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab stats={stats} loading={statsLoading} onRefresh={loadStats} onNavigate={setActiveTab} />}
        {activeTab === 'submissions' && <AdminSubmissions />}
        {activeTab === 'players' && <AdminPlayers />}
        {activeTab === 'inquiries' && <AdminInquiries />}
      </div>
    </div>
  );
};

// ─── Overview Tab ────────────────────────────────────────────────────────────
interface OverviewProps {
  stats: {
    totalPlayers: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    totalInquiries: number;
    pendingInquiries: number;
  };
  loading: boolean;
  onRefresh: () => void;
  onNavigate: (tab: Tab) => void;
}

const OverviewTab: React.FC<OverviewProps> = ({ stats, loading, onRefresh, onNavigate }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FCD116]" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Players',
      value: stats.totalPlayers,
      icon: Users,
      color: 'from-[#006633] to-[#008844]',
      iconBg: 'bg-[#006633]/20',
      iconColor: 'text-[#006633]',
      tab: 'players' as Tab,
    },
    {
      title: 'Player Submissions',
      value: stats.totalSubmissions,
      subtitle: `${stats.pendingSubmissions} pending`,
      icon: FileText,
      color: 'from-[#FCD116] to-[#e6b800]',
      iconBg: 'bg-[#FCD116]/20',
      iconColor: 'text-[#FCD116]',
      tab: 'submissions' as Tab,
    },
    {
      title: 'Scout Inquiries',
      value: stats.totalInquiries,
      subtitle: `${stats.pendingInquiries} pending`,
      icon: MessageSquare,
      color: 'from-[#CE1126] to-[#a00d1e]',
      iconBg: 'bg-[#CE1126]/20',
      iconColor: 'text-[#CE1126]',
      tab: 'inquiries' as Tab,
    },
    {
      title: 'Pending Actions',
      value: stats.pendingSubmissions + stats.pendingInquiries,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      tab: 'submissions' as Tab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Manage players, submissions, and scout inquiries</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#006633]/30 text-gray-400 hover:text-[#FCD116] hover:border-[#FCD116]/40 transition-colors text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => onNavigate(card.tab)}
            className="bg-[#111c14] border border-[#006633]/20 rounded-xl p-5 text-left hover:border-[#006633]/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-600 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.title}</p>
            {card.subtitle && (
              <p className="text-[#FCD116] text-xs mt-1 font-medium">{card.subtitle}</p>
            )}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('submissions')}
            className="flex items-center gap-4 bg-[#111c14] border border-[#006633]/20 rounded-xl p-5 hover:border-[#FCD116]/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">Review Submissions</p>
              <p className="text-gray-500 text-sm">{stats.pendingSubmissions} awaiting review</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('players')}
            className="flex items-center gap-4 bg-[#111c14] border border-[#006633]/20 rounded-xl p-5 hover:border-[#FCD116]/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-[#006633]/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-[#006633]" />
            </div>
            <div>
              <p className="text-white font-medium">Manage Players</p>
              <p className="text-gray-500 text-sm">Edit profiles & stats</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('inquiries')}
            className="flex items-center gap-4 bg-[#111c14] border border-[#006633]/20 rounded-xl p-5 hover:border-[#FCD116]/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-[#CE1126]/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-[#CE1126]" />
            </div>
            <div>
              <p className="text-white font-medium">Scout Inquiries</p>
              <p className="text-gray-500 text-sm">{stats.pendingInquiries} need response</p>
            </div>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#006633]/10 via-[#CE1126]/5 to-[#FCD116]/10 border border-[#006633]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FCD116]/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#FCD116]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Admin Panel - LionsTalent Cameroun</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              This dashboard allows you to manage all aspects of the LesNdolés platform.
              Review player submissions from scouts and agents, edit existing player profiles,
              update statistics and images, and respond to scout inquiries. All changes are
              saved directly to the database and reflected on the public site immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
