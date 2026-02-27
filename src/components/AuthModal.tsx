import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { X, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      const { error: err } = await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        setSuccess(
          lang === 'fr'
            ? 'Compte créé ! Vérifiez votre email pour confirmer.'
            : 'Account created! Check your email to confirm.'
        );
        setEmail('');
        setPassword('');
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      } else {
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0f1f13] rounded-2xl max-w-md w-full border border-[#006633]/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#006633]/30 to-[#CE1126]/20 p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 text-white hover:bg-[#CE1126] transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg">Lions</span>
              <span className="text-[#FCD116] font-bold text-lg">Talent</span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'signin'
              ? (lang === 'fr' ? 'Connexion Recruteur' : 'Scout Sign In')
              : (lang === 'fr' ? 'Créer un Compte' : 'Create Account')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'signin'
              ? (lang === 'fr' ? 'Accédez à votre espace recruteur' : 'Access your scouting dashboard')
              : (lang === 'fr' ? 'Inscrivez-vous pour sauvegarder vos listes' : 'Sign up to save your shortlists')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 mx-6 mt-4 rounded-xl p-1">
          <button
            onClick={() => { setMode('signin'); setError(null); setSuccess(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'signin' ? 'bg-[#006633] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {lang === 'fr' ? 'Connexion' : 'Sign In'}
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'signup' ? 'bg-[#006633] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {lang === 'fr' ? 'Inscription' : 'Sign Up'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#CE1126]/10 border border-[#CE1126]/30 rounded-xl text-[#CE1126] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-[#006633]/10 border border-[#006633]/30 rounded-xl text-[#006633] text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scout@club.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block font-medium">
              {lang === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={lang === 'fr' ? 'Minimum 6 caractères' : 'Minimum 6 characters'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-bold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all shadow-lg shadow-[#006633]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-5 h-5" />
                {lang === 'fr' ? 'Se Connecter' : 'Sign In'}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                {lang === 'fr' ? "S'inscrire" : 'Sign Up'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
