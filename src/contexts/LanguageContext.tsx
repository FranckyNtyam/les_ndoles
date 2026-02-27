import React, { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'fr' | 'en';

interface Translations {
  [key: string]: { fr: string; en: string };
}

const translations: Translations = {
  // Navbar
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.players': { fr: 'Joueurs', en: 'Players' },
  'nav.success': { fr: 'Réussites', en: 'Success Stories' },
  'nav.news': { fr: 'Actualités', en: 'News' },
  'nav.scout': { fr: 'Recrutement', en: 'Scouting' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },
  'nav.submit': { fr: 'Soumettre un Joueur', en: 'Submit a Player' },
  'nav.trending': { fr: 'Tendances', en: 'Trending' },

  // Hero
  'hero.title': { fr: "L'Avenir du Football Camerounais", en: 'The Future of Cameroonian Football' },
  'hero.subtitle': { fr: 'Découvrez, valorisez et connectez les talents du Cameroun avec le monde entier', en: 'Discover, valorize and connect Cameroonian talent with the world' },
  'hero.cta': { fr: 'Explorer les Talents', en: 'Explore Talents' },
  'hero.cta2': { fr: 'Espace Recruteur', en: 'Scout Dashboard' },
  'hero.stat1': { fr: 'Joueurs Inscrits', en: 'Registered Players' },
  'hero.stat2': { fr: 'Clubs Partenaires', en: 'Partner Clubs' },
  'hero.stat3': { fr: 'Transferts Réussis', en: 'Successful Transfers' },
  'hero.stat4': { fr: 'Régions Couvertes', en: 'Regions Covered' },

  // Player Grid
  'players.title': { fr: 'Nos Talents', en: 'Our Talents' },
  'players.subtitle': { fr: 'Découvrez les meilleurs footballeurs camerounais prêts à briller sur la scène internationale', en: 'Discover the best Cameroonian footballers ready to shine on the international stage' },
  'players.search': { fr: 'Rechercher un joueur...', en: 'Search for a player...' },
  'players.position': { fr: 'Position', en: 'Position' },
  'players.region': { fr: 'Région', en: 'Region' },
  'players.age': { fr: 'Âge', en: 'Age' },
  'players.all': { fr: 'Tous', en: 'All' },
  'players.forward': { fr: 'Attaquant', en: 'Forward' },
  'players.midfielder': { fr: 'Milieu', en: 'Midfielder' },
  'players.defender': { fr: 'Défenseur', en: 'Defender' },
  'players.goalkeeper': { fr: 'Gardien', en: 'Goalkeeper' },
  'players.showing': { fr: 'joueurs affichés', en: 'players shown' },
  'players.viewProfile': { fr: 'Voir le Profil', en: 'View Profile' },
  'players.addToShortlist': { fr: 'Ajouter à la Liste', en: 'Add to Shortlist' },
  'players.years': { fr: 'ans', en: 'yrs' },
  'players.analytics': { fr: 'Voir les Analyses', en: 'View Analytics' },

  // Player Modal
  'modal.stats': { fr: 'Statistiques', en: 'Statistics' },
  'modal.career': { fr: 'Carrière', en: 'Career' },
  'modal.physical': { fr: 'Attributs Physiques', en: 'Physical Attributes' },
  'modal.contact': { fr: 'Contacter', en: 'Contact' },
  'modal.height': { fr: 'Taille', en: 'Height' },
  'modal.weight': { fr: 'Poids', en: 'Weight' },
  'modal.foot': { fr: 'Pied Fort', en: 'Strong Foot' },
  'modal.goals': { fr: 'Buts', en: 'Goals' },
  'modal.assists': { fr: 'Passes D.', en: 'Assists' },
  'modal.matches': { fr: 'Matchs', en: 'Matches' },
  'modal.rating': { fr: 'Note', en: 'Rating' },
  'modal.speed': { fr: 'Vitesse', en: 'Speed' },
  'modal.shooting': { fr: 'Tir', en: 'Shooting' },
  'modal.passing': { fr: 'Passe', en: 'Passing' },
  'modal.dribbling': { fr: 'Dribble', en: 'Dribbling' },
  'modal.defense': { fr: 'Défense', en: 'Defense' },
  'modal.stamina': { fr: 'Endurance', en: 'Stamina' },
  'modal.inquire': { fr: 'Envoyer une Demande', en: 'Send Inquiry' },
  'modal.close': { fr: 'Fermer', en: 'Close' },
  'modal.fullAnalytics': { fr: 'Voir les Analyses Complètes', en: 'View Full Analytics' },

  // Video
  'modal.video': { fr: 'Vidéo', en: 'Video' },
  'modal.videoHighlights': { fr: 'Vidéo Highlights', en: 'Video Highlights' },
  'modal.noVideo': { fr: 'Aucune vidéo disponible pour ce joueur', en: 'No video available for this player' },
  'modal.watchHighlights': { fr: 'Regarder les Highlights', en: 'Watch Highlights' },
  'modal.videoAvailable': { fr: 'Vidéo Disponible', en: 'Video Available' },

  // Video Analytics / Trending
  'trending.badge': { fr: 'En Tendance', en: 'Trending Now' },
  'trending.title': { fr: 'Joueurs les Plus Regardés', en: 'Most Watched Players' },
  'trending.subtitle': { fr: 'Découvrez les talents qui captent l\'attention des recruteurs du monde entier', en: 'Discover the talents capturing the attention of scouts worldwide' },
  'trending.totalViews': { fr: 'Vues Totales', en: 'Total Views' },
  'trending.watchTime': { fr: 'Temps de Visionnage', en: 'Watch Time' },
  'trending.playersWatched': { fr: 'Joueurs Vus', en: 'Players Watched' },
  'trending.empty': { fr: 'Pas encore de données de visionnage', en: 'No viewing data yet' },
  'trending.emptyDesc': { fr: 'Les statistiques de visionnage apparaîtront ici dès que les vidéos des joueurs seront regardées. Explorez les profils pour regarder les highlights!', en: 'Viewing statistics will appear here once player videos are watched. Explore profiles to watch highlights!' },
  'trending.views': { fr: 'vues', en: 'views' },
  'trending.avgTime': { fr: 'Durée Moyenne', en: 'Avg. Duration' },
  'trending.completion': { fr: 'Complétion', en: 'Completion' },
  'trending.rank': { fr: 'Classement', en: 'Rank' },

  // Analytics Page
  'analytics.ratingProgression': { fr: 'Progression de la Note', en: 'Rating Progression' },
  'analytics.skillProfile': { fr: 'Profil de Compétences', en: 'Skill Profile' },
  'analytics.videoAnalytics': { fr: 'Analytique Vidéo', en: 'Video Analytics' },
  'analytics.scoutEngagement': { fr: 'Engagement des Recruteurs', en: 'Scout Engagement' },
  'analytics.reviews': { fr: 'Avis & Endorsements', en: 'Reviews & Endorsements' },
  'analytics.shareProfile': { fr: 'Partagez ce profil', en: 'Share this Profile' },
  'analytics.leaveReview': { fr: 'Laisser un Avis', en: 'Leave a Review' },
  'analytics.noReviews': { fr: 'Aucun avis pour le moment', en: 'No reviews yet' },
  'analytics.beFirst': { fr: 'Soyez le premier à laisser un avis!', en: 'Be the first to leave a review!' },

  // Success Stories
  'success.title': { fr: 'Histoires de Réussite', en: 'Success Stories' },
  'success.subtitle': { fr: 'Des Lions Indomptables qui ont conquis le monde du football', en: 'Indomitable Lions who conquered the football world' },
  'success.readMore': { fr: 'Lire Plus', en: 'Read More' },

  // News
  'news.title': { fr: 'Dernières Actualités', en: 'Latest News' },
  'news.subtitle': { fr: 'Restez informé des dernières nouvelles du football camerounais', en: 'Stay updated with the latest Cameroonian football news' },
  'news.readMore': { fr: 'Lire la suite', en: 'Read more' },
  'news.viewAll': { fr: 'Voir toutes les actualités', en: 'View all news' },

  // Scout
  'scout.title': { fr: 'Espace Recruteur', en: 'Scout Dashboard' },
  'scout.subtitle': { fr: 'Outils professionnels pour identifier et recruter les meilleurs talents camerounais', en: 'Professional tools to identify and recruit the best Cameroonian talent' },
  'scout.shortlist': { fr: 'Ma Liste de Suivi', en: 'My Shortlist' },
  'scout.compare': { fr: 'Comparer les Joueurs', en: 'Compare Players' },
  'scout.inquiry': { fr: 'Formulaire de Demande', en: 'Inquiry Form' },
  'scout.empty': { fr: 'Aucun joueur dans votre liste. Ajoutez des joueurs depuis la grille.', en: 'No players in your shortlist. Add players from the grid.' },
  'scout.remove': { fr: 'Retirer', en: 'Remove' },
  'scout.name': { fr: 'Votre Nom', en: 'Your Name' },
  'scout.email': { fr: 'Email', en: 'Email' },
  'scout.club': { fr: 'Club / Organisation', en: 'Club / Organization' },
  'scout.message': { fr: 'Message', en: 'Message' },
  'scout.send': { fr: 'Envoyer la Demande', en: 'Send Inquiry' },
  'scout.sent': { fr: 'Demande envoyée avec succès!', en: 'Inquiry sent successfully!' },

  // Footer
  'footer.tagline': { fr: 'Plateforme de visibilité et de valorisation des footballeurs camerounais', en: 'Platform for visibility and valorization of Cameroonian footballers' },
  'footer.links': { fr: 'Liens Rapides', en: 'Quick Links' },
  'footer.partners': { fr: 'Partenaires', en: 'Partners' },
  'footer.newsletter': { fr: 'Newsletter', en: 'Newsletter' },
  'footer.newsletterDesc': { fr: 'Recevez les dernières nouvelles du football camerounais', en: 'Get the latest Cameroonian football news' },
  'footer.subscribe': { fr: "S'abonner", en: 'Subscribe' },
  'footer.emailPlaceholder': { fr: 'Votre email', en: 'Your email' },
  'footer.rights': { fr: 'Tous droits réservés', en: 'All rights reserved' },
  'footer.privacy': { fr: 'Politique de Confidentialité', en: 'Privacy Policy' },
  'footer.terms': { fr: "Conditions d'Utilisation", en: 'Terms of Use' },
  'footer.submitPlayer': { fr: 'Soumettre un Joueur', en: 'Submit a Player' },
  'footer.submitDesc': { fr: 'Connaissez-vous un talent camerounais? Soumettez son profil!', en: 'Know a Cameroonian talent? Submit their profile!' },
  'footer.submitBtn': { fr: 'Soumettre', en: 'Submit' },

  // Regions
  'region.centre': { fr: 'Centre', en: 'Centre' },
  'region.littoral': { fr: 'Littoral', en: 'Littoral' },
  'region.ouest': { fr: 'Ouest', en: 'West' },
  'region.sudouest': { fr: 'Sud-Ouest', en: 'South-West' },
  'region.nordouest': { fr: 'Nord-Ouest', en: 'North-West' },
  'region.nord': { fr: 'Nord', en: 'North' },
  'region.extreme_nord': { fr: 'Extrême-Nord', en: 'Far North' },
  'region.adamaoua': { fr: 'Adamaoua', en: 'Adamawa' },
  'region.est': { fr: 'Est', en: 'East' },
  'region.sud': { fr: 'Sud', en: 'South' },
};


interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('fr');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
