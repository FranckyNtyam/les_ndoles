import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsItems, NewsItem } from '@/data/news';
import { Clock, ArrowRight, Tag, X } from 'lucide-react';

const NewsFeed: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(newsItems.map((n) => (lang === 'fr' ? n.categoryFr : n.category)))];

  const filtered = categoryFilter === 'All'
    ? newsItems
    : newsItems.filter((n) => (lang === 'fr' ? n.categoryFr : n.category) === categoryFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section id="news" className="py-20 bg-[#0a1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CE1126]/10 border border-[#CE1126]/30 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#CE1126] animate-pulse" />
            <span className="text-[#CE1126] text-sm font-medium">{lang === 'fr' ? 'EN DIRECT' : 'LIVE'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('news.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('news.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'All' ? t('players.all') : cat}
            </button>
          ))}
        </div>

        {/* News Layout */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Featured */}
            <div
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-[#006633]/20 hover:border-[#FCD116]/40 transition-all hover:shadow-xl hover:shadow-[#006633]/10"
              onClick={() => setSelectedNews(featured)}
            >
              <div className="relative h-72 sm:h-80 lg:h-full min-h-[300px]">
                <img src={featured.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0f] via-[#0a1a0f]/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#CE1126] text-white text-xs font-bold">
                    {lang === 'fr' ? featured.categoryFr : featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {formatDate(featured.date)}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FCD116] transition-colors mb-2">
                  {lang === 'fr' ? featured.titleFr : featured.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {lang === 'fr' ? featured.excerptFr : featured.excerpt}
                </p>
              </div>
            </div>

            {/* Side articles */}
            <div className="space-y-4">
              {rest.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  className="group flex gap-4 bg-[#111c14] rounded-xl overflow-hidden border border-[#006633]/20 hover:border-[#FCD116]/40 transition-all cursor-pointer hover:shadow-lg"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="w-32 sm:w-40 h-28 flex-shrink-0 overflow-hidden">
                    <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 py-3 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#CE1126] text-xs font-medium">{lang === 'fr' ? news.categoryFr : news.category}</span>
                      <span className="text-gray-600 text-xs">{formatDate(news.date)}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm group-hover:text-[#FCD116] transition-colors line-clamp-2 mb-1">
                      {lang === 'fr' ? news.titleFr : news.title}
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {lang === 'fr' ? news.excerptFr : news.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row */}
        {rest.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.slice(3).map((news) => (
              <div
                key={news.id}
                className="group flex gap-4 bg-[#111c14] rounded-xl overflow-hidden border border-[#006633]/20 hover:border-[#FCD116]/40 transition-all cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
                  <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <span className="text-[#CE1126] text-xs font-medium">{lang === 'fr' ? news.categoryFr : news.category}</span>
                  <h4 className="text-white font-bold text-sm group-hover:text-[#FCD116] transition-colors line-clamp-2 mt-1">
                    {lang === 'fr' ? news.titleFr : news.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedNews(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#0f1f13] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#006633]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img src={selectedNews.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f13] via-transparent to-transparent" />
              <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-[#CE1126] transition-colors flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 -mt-8 relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#CE1126] text-white text-xs font-bold">
                  {lang === 'fr' ? selectedNews.categoryFr : selectedNews.category}
                </span>
                <span className="text-gray-400 text-sm">{formatDate(selectedNews.date)}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-4">
                {lang === 'fr' ? selectedNews.titleFr : selectedNews.title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {lang === 'fr' ? selectedNews.excerptFr : selectedNews.excerpt}
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                {lang === 'fr'
                  ? 'Cet article sera bientôt disponible en intégralité. Restez connecté pour plus de détails sur cette actualité passionnante du football camerounais.'
                  : 'The full article will be available soon. Stay tuned for more details on this exciting Cameroonian football news.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsFeed;
