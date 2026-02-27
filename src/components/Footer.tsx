import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { submitPlayerProfile } from '@/data/players';
import { Send, CheckCircle, MapPin, Phone, Mail, ExternalLink, Loader2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitForm, setSubmitForm] = useState({ name: '', position: '', age: '', region: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const result = await submitPlayerProfile({
      name: submitForm.name,
      position: submitForm.position,
      age: parseInt(submitForm.age),
      region: submitForm.region,
      contact: submitForm.contact,
      submittedBy: user?.id,
    });
    setSubmitLoading(false);
    if (result.success) {
      setSubmitted(true);
      setSubmitForm({ name: '', position: '', age: '', region: '', contact: '' });
      setTimeout(() => { setSubmitted(false); setShowSubmitForm(false); }, 3000);
    }
  };

  const quickLinks = [
    { label: t('nav.home'), section: 'home' },
    { label: t('nav.players'), section: 'players' },
    { label: t('nav.success'), section: 'success' },
    { label: t('nav.news'), section: 'news' },
    { label: t('nav.scout'), section: 'scout' },
  ];

  const partners = ['FECAFOOT', 'CAF', 'FIFA Forward', 'Coton Sport FC', 'Canon Yaoundé', 'Union Douala'];

  return (
    <footer id="contact" className="bg-[#060e08] border-t border-[#006633]/20">
      {/* Submit Player CTA */}
      <div className="bg-gradient-to-r from-[#006633]/20 via-[#CE1126]/10 to-[#FCD116]/10 border-b border-[#006633]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-2">{t('footer.submitPlayer')}</h3>
              <p className="text-gray-400">{t('footer.submitDesc')}</p>
            </div>
            <button onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="px-8 py-4 bg-gradient-to-r from-[#FCD116] to-[#e6be0e] text-[#0a1a0f] font-bold rounded-xl hover:from-[#ffe033] hover:to-[#FCD116] transition-all shadow-lg shadow-[#FCD116]/20 hover:scale-105">
              {t('footer.submitBtn')}
            </button>
          </div>

          {showSubmitForm && (
            <div className="mt-8 bg-[#111c14] rounded-2xl p-6 border border-[#006633]/30">
              {submitted ? (
                <div className="flex flex-col items-center py-8">
                  <CheckCircle className="w-12 h-12 text-[#006633] mb-3" />
                  <p className="text-white font-bold text-lg">
                    {lang === 'fr' ? 'Profil soumis avec succès! En attente de validation.' : 'Profile submitted successfully! Pending review.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPlayer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" required value={submitForm.name} onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                    placeholder={lang === 'fr' ? 'Nom du joueur' : 'Player name'}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633]" />
                  <select required value={submitForm.position} onChange={(e) => setSubmitForm({ ...submitForm, position: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#006633] cursor-pointer">
                    <option value="">{lang === 'fr' ? 'Position' : 'Position'}</option>
                    <option value="Forward">{lang === 'fr' ? 'Attaquant' : 'Forward'}</option>
                    <option value="Midfielder">{lang === 'fr' ? 'Milieu' : 'Midfielder'}</option>
                    <option value="Defender">{lang === 'fr' ? 'Défenseur' : 'Defender'}</option>
                    <option value="Goalkeeper">{lang === 'fr' ? 'Gardien' : 'Goalkeeper'}</option>
                  </select>
                  <input type="number" required min={14} max={40} value={submitForm.age} onChange={(e) => setSubmitForm({ ...submitForm, age: e.target.value })}
                    placeholder={lang === 'fr' ? 'Âge' : 'Age'}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633]" />
                  <input type="text" required value={submitForm.region} onChange={(e) => setSubmitForm({ ...submitForm, region: e.target.value })}
                    placeholder={lang === 'fr' ? 'Région' : 'Region'}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633]" />
                  <input type="text" required value={submitForm.contact} onChange={(e) => setSubmitForm({ ...submitForm, contact: e.target.value })}
                    placeholder={lang === 'fr' ? 'Contact (email/tél)' : 'Contact (email/phone)'}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#006633]" />
                  <button type="submit" disabled={submitLoading}
                    className="px-6 py-3 bg-[#006633] text-white font-bold rounded-xl hover:bg-[#007744] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {t('footer.submitBtn')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006633] via-[#CE1126] to-[#FCD116] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <div><span className="text-white font-bold text-lg">Les</span><span className="text-[#FCD116] font-bold text-lg">Ndolés</span></div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{t('footer.tagline')}</p>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <button key={social} onClick={() => window.open(`https://${social}.com`, '_blank')}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#FCD116] hover:border-[#FCD116]/30 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {social === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}
                    {social === 'twitter' && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>}
                    {social === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5"/></>}
                    {social === 'youtube' && <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/>}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.section}><button onClick={() => onNavigate(link.section)} className="text-gray-500 hover:text-[#FCD116] transition-colors text-sm">{link.label}</button></li>
              ))}
              <li><button className="text-gray-500 hover:text-[#FCD116] transition-colors text-sm">{t('footer.privacy')}</button></li>
              <li><button className="text-gray-500 hover:text-[#FCD116] transition-colors text-sm">{t('footer.terms')}</button></li>
              <li><a href="/admin" className="text-gray-600 hover:text-[#FCD116] transition-colors text-sm flex items-center gap-1">Admin</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-white font-bold mb-4">{t('footer.partners')}</h4>
            <ul className="space-y-3">
              {partners.map((partner) => (
                <li key={partner}><button className="flex items-center gap-2 text-gray-500 hover:text-[#FCD116] transition-colors text-sm group"><ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />{partner}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">{t('footer.newsletter')}</h4>
            <p className="text-gray-500 text-sm mb-4">{t('footer.newsletterDesc')}</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#006633] py-3"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">{lang === 'fr' ? 'Abonné!' : 'Subscribed!'}</span></div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#006633]" />
                <button type="submit" className="px-4 py-3 bg-[#006633] text-white rounded-xl hover:bg-[#007744] transition-colors"><Send className="w-4 h-4" /></button>
              </form>
            )}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm"><MapPin className="w-4 h-4 text-[#006633]" />Yaoundé, Cameroun</div>
              <div className="flex items-center gap-2 text-gray-500 text-sm"><Phone className="w-4 h-4 text-[#006633]" />+237 694 785 153</div>
              <div className="flex items-center gap-2 text-gray-500 text-sm"><Mail className="w-4 h-4 text-[#006633]" />contact@lesndoles.cm</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 LesNdolés. {t('footer.rights')}.</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm overflow-hidden flex"><div className="w-1/3 bg-[#006633]" /><div className="w-1/3 bg-[#CE1126]" /><div className="w-1/3 bg-[#FCD116]" /></div>
            <span className="text-gray-600 text-sm">{lang === 'fr' ? 'Fait avec fierté au Cameroun' : 'Made with pride in Cameroon'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
