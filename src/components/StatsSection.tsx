import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Globe2, Award, Shield } from 'lucide-react';

const StatsSection: React.FC = () => {
  const { lang } = useLanguage();

  const stats = [
    {
      icon: TrendingUp,
      value: '156%',
      label: lang === 'fr' ? 'Croissance des transferts' : 'Transfer Growth',
      desc: lang === 'fr' ? 'Augmentation des transferts internationaux depuis 2023' : 'Increase in international transfers since 2023',
      color: '#006633',
    },
    {
      icon: Globe2,
      value: '23',
      label: lang === 'fr' ? 'Pays de destination' : 'Destination Countries',
      desc: lang === 'fr' ? 'Pays où jouent des footballeurs camerounais' : 'Countries where Cameroonian footballers play',
      color: '#CE1126',
    },
    {
      icon: Award,
      value: '€47M',
      label: lang === 'fr' ? 'Valeur totale des transferts' : 'Total Transfer Value',
      desc: lang === 'fr' ? 'Valeur cumulée des transferts facilités' : 'Cumulative value of facilitated transfers',
      color: '#FCD116',
    },
    {
      icon: Shield,
      value: '10/10',
      label: lang === 'fr' ? 'Régions couvertes' : 'Regions Covered',
      desc: lang === 'fr' ? 'Toutes les régions du Cameroun sont représentées' : 'All regions of Cameroon are represented',
      color: '#006633',
    },
  ];

  return (
    <section className="py-16 bg-[#0a1a0f] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#006633]/5 via-transparent to-[#CE1126]/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group bg-[#111c14] rounded-2xl p-6 border border-white/10 hover:border-[#FCD116]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-white font-medium text-sm mb-2">{stat.label}</div>
              <p className="text-gray-500 text-xs">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
