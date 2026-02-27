export interface NewsItem {
  id: number;
  title: string;
  titleFr: string;
  excerpt: string;
  excerptFr: string;
  image: string;
  date: string;
  category: string;
  categoryFr: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'Cameroon U-23 Qualifies for Olympic Games',
    titleFr: 'Le Cameroun U-23 se qualifie pour les Jeux Olympiques',
    excerpt: 'The young Indomitable Lions secured their spot in the upcoming Olympic Games after a thrilling victory in the qualifying tournament.',
    excerptFr: 'Les jeunes Lions Indomptables ont décroché leur place aux prochains Jeux Olympiques après une victoire palpitante en tournoi qualificatif.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143220382_9dd462bd.jpg',
    date: '2026-02-24',
    category: 'National Team',
    categoryFr: 'Équipe Nationale',
  },
  {
    id: 2,
    title: 'Elite One Season Kicks Off with Record Attendance',
    titleFr: 'La saison d\'Elite One démarre avec une affluence record',
    excerpt: 'The new Elite One season has begun with unprecedented fan turnout across all stadiums, signaling growing interest in domestic football.',
    excerptFr: 'La nouvelle saison d\'Elite One a débuté avec une affluence sans précédent dans tous les stades, signe d\'un intérêt croissant pour le football national.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143219781_5e206e69.jpg',
    date: '2026-02-20',
    category: 'League',
    categoryFr: 'Championnat',
  },
  {
    id: 3,
    title: 'Three Cameroonian Players Sign European Contracts',
    titleFr: 'Trois joueurs camerounais signent des contrats européens',
    excerpt: 'In a landmark week for Cameroonian football, three talented players have secured moves to clubs in France, Belgium, and Portugal.',
    excerptFr: 'Dans une semaine historique pour le football camerounais, trois joueurs talentueux ont signé dans des clubs en France, Belgique et Portugal.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143221406_9c692f75.jpg',
    date: '2026-02-18',
    category: 'Transfers',
    categoryFr: 'Transferts',
  },
  {
    id: 4,
    title: 'FECAFOOT Launches New Youth Development Program',
    titleFr: 'La FECAFOOT lance un nouveau programme de développement des jeunes',
    excerpt: 'The Cameroon Football Federation has unveiled an ambitious youth development initiative targeting all 10 regions of the country.',
    excerptFr: 'La Fédération Camerounaise de Football a dévoilé une initiative ambitieuse de développement des jeunes ciblant les 10 régions du pays.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143230228_d34803d4.png',
    date: '2026-02-15',
    category: 'Development',
    categoryFr: 'Développement',
  },
  {
    id: 5,
    title: 'Coton Sport FC Wins Continental Cup Match',
    titleFr: 'Coton Sport FC remporte un match de Coupe Continentale',
    excerpt: 'Coton Sport FC delivered a stunning performance in the CAF Confederation Cup, defeating their opponents 3-1 in a dominant display.',
    excerptFr: 'Coton Sport FC a livré une performance époustouflante en Coupe de la Confédération CAF, battant leurs adversaires 3-1.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143223146_895b7232.jpg',
    date: '2026-02-12',
    category: 'Continental',
    categoryFr: 'Continental',
  },
  {
    id: 6,
    title: 'Women\'s Football Growing Rapidly in Cameroon',
    titleFr: 'Le football féminin en pleine croissance au Cameroun',
    excerpt: 'Women\'s football in Cameroon is experiencing unprecedented growth with new academies opening across the country and increased media coverage.',
    excerptFr: 'Le football féminin au Cameroun connaît une croissance sans précédent avec de nouvelles académies et une couverture médiatique accrue.',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143226145_0482eb79.jpg',
    date: '2026-02-10',
    category: 'Development',
    categoryFr: 'Développement',
  },
];
