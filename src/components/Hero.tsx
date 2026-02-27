import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, Play, Users, Building2, ArrowRightLeft, MapPin } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const AnimatedCounter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: 248, suffix: '+', label: t('hero.stat1') },
    { icon: Building2, value: 85, suffix: '+', label: t('hero.stat2') },
    { icon: ArrowRightLeft, value: 42, suffix: '', label: t('hero.stat3') },
    { icon: MapPin, value: 10, suffix: '', label: t('hero.stat4') },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772142831319_982904ff.jpg"
          alt="Cameroon Football Stadium"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a0f]/95 via-[#0a1a0f]/80 to-[#0a1a0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0f] via-transparent to-[#0a1a0f]/40" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#006633]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#CE1126]/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-[#FCD116]/6 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006633]/20 border border-[#006633]/40 mb-8">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[#006633]" />
              <div className="w-3 h-3 rounded-full bg-[#CE1126]" />
              <div className="w-3 h-3 rounded-full bg-[#FCD116]" />
            </div>
            <span className="text-[#FCD116] text-sm font-medium tracking-wide">
              Les Camerounais méritent d'être vus.
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('hero.title').split(' ').map((word, i) => {
              if (word.toLowerCase() === 'camerounais' || word.toLowerCase() === 'cameroonian') {
                return <span key={i} className="text-[#FCD116]">{word} </span>;
              }
              if (word.toLowerCase() === "l'avenir" || word.toLowerCase() === 'future') {
                return <span key={i} className="text-[#006633] drop-shadow-[0_0_20px_rgba(0,102,51,0.5)]">{word} </span>;
              }
              return <span key={i}>{word} </span>;
            })}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <button
              onClick={() => onNavigate('players')}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#006633] to-[#008844] text-white font-bold rounded-xl hover:from-[#007744] hover:to-[#009955] transition-all shadow-xl shadow-[#006633]/30 hover:shadow-[#006633]/50 hover:scale-105"
            >
              {t('hero.cta')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => onNavigate('scout')}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:border-[#FCD116]/40 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 text-[#FCD116]" />
              {t('hero.cta2')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#FCD116]/30 transition-all group">
                <stat.icon className="w-5 h-5 text-[#FCD116] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => onNavigate('players')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-[#FCD116] transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default Hero;
