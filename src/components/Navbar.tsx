import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Globe, LogIn, LogOut, User } from 'lucide-react';
interface NavbarProps {
  onNavigate: (section: string) => void;
  onOpenAuth: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenAuth
}) => {
  const {
    lang,
    setLang,
    t
  } = useLanguage();
  const {
    user,
    signOut
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [{
    key: 'home',
    label: t('nav.home')
  }, {
    key: 'players',
    label: t('nav.players')
  }, {
    key: 'trending',
    label: t('nav.trending')
  }, {
    key: 'success',
    label: t('nav.success')
  }, {
    key: 'news',
    label: t('nav.news')
  }, {
    key: 'scout',
    label: t('nav.scout')
  }];
  const handleNav = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
  };
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1a0f]/95 backdrop-blur-md border-b border-[#006633]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Les</span>
              <span className="text-[#FCD116] font-bold text-lg">Ndolés</span>
              <span className="text-[#006633] text-xs block -mt-1 font-medium tracking-wider">CAMEROUN</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => <button key={item.key} onClick={() => handleNav(item.key)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FCD116] transition-colors rounded-lg hover:bg-white/5">
                {item.label}
              </button>)}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#006633]/50 text-sm font-medium text-gray-300 hover:text-[#FCD116] hover:border-[#FCD116]/50 transition-all">
              <Globe className="w-4 h-4" />
              <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
            </button>

            {/* Auth Button */}
            {user ? <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#006633]/20 border border-[#006633]/40">
                  <User className="w-4 h-4 text-[#FCD116]" />
                  <span className="text-gray-300 text-sm max-w-[120px] truncate">{user.email}</span>
                </div>
                <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#CE1126]/40 text-sm font-medium text-gray-300 hover:text-[#CE1126] hover:border-[#CE1126]/60 transition-all" title={lang === 'fr' ? 'Déconnexion' : 'Sign Out'}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div> : <button onClick={onOpenAuth} className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#006633] to-[#008844] text-white text-sm font-semibold rounded-lg hover:from-[#007744] hover:to-[#009955] transition-all shadow-lg shadow-[#006633]/20">
                <LogIn className="w-4 h-4" />
                {lang === 'fr' ? 'Espace Recruteur' : 'Scout Login'}
              </button>}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-300 hover:text-white">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && <div className="md:hidden bg-[#0a1a0f]/98 backdrop-blur-md border-t border-[#006633]/20">
          <div className="px-4 py-4 space-y-1">
            {navItems.map(item => <button key={item.key} onClick={() => handleNav(item.key)} className="block w-full text-left px-4 py-3 text-gray-300 hover:text-[#FCD116] hover:bg-white/5 rounded-lg transition-colors">
                {item.label}
              </button>)}
            {user ? <>
                <div className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </div>
                <button onClick={() => {
            signOut();
            setMobileOpen(false);
          }} className="block w-full text-left px-4 py-3 text-[#CE1126] hover:bg-white/5 rounded-lg transition-colors">
                  {lang === 'fr' ? 'Déconnexion' : 'Sign Out'}
                </button>
              </> : <button onClick={() => {
          onOpenAuth();
          setMobileOpen(false);
        }} className="block w-full text-left px-4 py-3 text-[#FCD116] font-semibold hover:bg-white/5 rounded-lg transition-colors">
                {lang === 'fr' ? 'Connexion Recruteur' : 'Scout Login'}
              </button>}
          </div>
        </div>}
    </nav>;
};
export default Navbar;