import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { successStories, SuccessStory } from '@/data/successStories';
import { Trophy, MapPin, ArrowRight, X, Star } from 'lucide-react';

const SuccessStories: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  return (
    <section id="success" className="py-20 bg-gradient-to-b from-[#0a1a0f] via-[#0d2412] to-[#0a1a0f] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FCD116]/30 to-transparent" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FCD116]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#006633]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCD116]/10 border border-[#FCD116]/30 mb-4">
            <Trophy className="w-4 h-4 text-[#FCD116]" />
            <span className="text-[#FCD116] text-sm font-medium">{lang === 'fr' ? 'FIERTÉ NATIONALE' : 'NATIONAL PRIDE'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('success.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('success.subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="group relative bg-[#111c14] rounded-2xl overflow-hidden border border-[#006633]/20 hover:border-[#FCD116]/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-[#FCD116]/5 hover:-translate-y-1"
              onClick={() => setSelectedStory(story)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111c14] via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#FCD116]/20 backdrop-blur-sm border border-[#FCD116]/30">
                  <span className="text-[#FCD116] text-xs font-bold">{story.transferValue}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[#FCD116] transition-colors">
                  {story.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <span className="font-medium text-[#006633]">{story.club}</span>
                  <span className="text-gray-600">|</span>
                  <span>{story.league}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {lang === 'fr' ? story.storyFr : story.story}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(lang === 'fr' ? story.achievementsFr : story.achievements).slice(0, 2).map((a, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400">
                      <Star className="w-3 h-3 text-[#FCD116]" />
                      {a}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-[#FCD116] text-sm font-medium group-hover:gap-2 transition-all">
                  {t('success.readMore')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedStory(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#0f1f13] rounded-2xl max-w-lg w-full overflow-hidden border border-[#006633]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56">
              <img src={selectedStory.image} alt={selectedStory.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f13] via-[#0f1f13]/40 to-transparent" />
              <button onClick={() => setSelectedStory(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-[#CE1126] transition-colors flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 -mt-8 relative z-10">
              <h3 className="text-2xl font-extrabold text-white mb-1">{selectedStory.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-[#006633] font-medium">{selectedStory.club}</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">{selectedStory.league}, {selectedStory.country}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <MapPin className="w-4 h-4 text-[#FCD116]" />
                <span>{lang === 'fr' ? 'Originaire de la région' : 'From the region of'} {selectedStory.region}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {lang === 'fr' ? selectedStory.storyFr : selectedStory.story}
              </p>
              <div className="space-y-2">
                <h4 className="text-white font-bold text-sm">{lang === 'fr' ? 'Réalisations' : 'Achievements'}</h4>
                {(lang === 'fr' ? selectedStory.achievementsFr : selectedStory.achievements).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <Trophy className="w-4 h-4 text-[#FCD116]" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessStories;
