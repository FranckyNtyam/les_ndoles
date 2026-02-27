export interface SuccessStory {
  id: number;
  name: string;
  image: string;
  club: string;
  league: string;
  country: string;
  region: string;
  story: string;
  storyFr: string;
  achievements: string[];
  achievementsFr: string[];
  transferValue: string;
}

export const successStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Michel Ndongo',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143192948_2fd4a15c.jpg',
    club: 'Olympique Lyonnais',
    league: 'Ligue 1',
    country: 'France',
    region: 'Centre',
    story: 'From the dusty pitches of Yaoundé to the bright lights of Ligue 1, Michel\'s journey is a testament to perseverance and raw talent.',
    storyFr: 'Des terrains poussiéreux de Yaoundé aux lumières de la Ligue 1, le parcours de Michel est un témoignage de persévérance et de talent brut.',
    achievements: ['Ligue 1 Team of the Season', '15 goals in debut season', 'Cameroon international'],
    achievementsFr: ['Équipe type de la Ligue 1', '15 buts pour sa première saison', 'International camerounais'],
    transferValue: '€12M',
  },
  {
    id: 2,
    name: 'Paul Essomba',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143068410_9c5955bb.jpg',
    club: 'FC Porto',
    league: 'Primeira Liga',
    country: 'Portugal',
    region: 'Littoral',
    story: 'Paul was discovered during a local tournament in Douala and went on to become a key player for one of Europe\'s most historic clubs.',
    storyFr: 'Paul a été découvert lors d\'un tournoi local à Douala et est devenu un joueur clé de l\'un des clubs les plus historiques d\'Europe.',
    achievements: ['Champions League participant', 'Portuguese Cup winner', '50+ appearances'],
    achievementsFr: ['Participant à la Ligue des Champions', 'Vainqueur de la Coupe du Portugal', '50+ matchs joués'],
    transferValue: '€8M',
  },
  {
    id: 3,
    name: 'Christian Mbah',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143068741_63c889be.jpg',
    club: 'RSC Anderlecht',
    league: 'Pro League',
    country: 'Belgium',
    region: 'Ouest',
    story: 'Christian\'s technical brilliance caught the eye of Belgian scouts, and he has since become one of the most exciting players in the Pro League.',
    storyFr: 'La brillance technique de Christian a attiré l\'attention des recruteurs belges, et il est depuis devenu l\'un des joueurs les plus excitants de la Pro League.',
    achievements: ['Belgian Golden Shoe nominee', 'Most assists in league', 'Fan favorite'],
    achievementsFr: ['Nominé au Soulier d\'Or belge', 'Meilleur passeur du championnat', 'Favori des fans'],
    transferValue: '€6M',
  },
  {
    id: 4,
    name: 'Joël Tchidjou',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143084455_b6344052.png',
    club: 'Al Ahly SC',
    league: 'Egyptian Premier League',
    country: 'Egypt',
    region: 'Nord',
    story: 'Joël made the bold move to North Africa and has become a pillar of the most successful club in African football history.',
    storyFr: 'Joël a fait le choix audacieux de l\'Afrique du Nord et est devenu un pilier du club le plus titré de l\'histoire du football africain.',
    achievements: ['CAF Champions League winner', 'Egyptian league champion x2', 'Best foreign player award'],
    achievementsFr: ['Vainqueur de la Ligue des Champions CAF', 'Champion d\'Égypte x2', 'Prix du meilleur joueur étranger'],
    transferValue: '€5M',
  },
  {
    id: 5,
    name: 'Fabien Nkomo',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143080318_f23bc85c.jpg',
    club: 'Istanbul Başakşehir',
    league: 'Süper Lig',
    country: 'Turkey',
    region: 'Sud',
    story: 'Fabien\'s journey from the south of Cameroon to the Turkish Süper Lig showcases the global reach of Cameroonian talent.',
    storyFr: 'Le parcours de Fabien du sud du Cameroun à la Süper Lig turque illustre la portée mondiale du talent camerounais.',
    achievements: ['Süper Lig top scorer', 'Turkish Cup finalist', '20+ goals per season'],
    achievementsFr: ['Meilleur buteur de la Süper Lig', 'Finaliste de la Coupe de Turquie', '20+ buts par saison'],
    transferValue: '€7M',
  },
  {
    id: 6,
    name: 'Raoul Atangana',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772143201360_821bb800.jpg',
    club: 'FC Midtjylland',
    league: 'Danish Superliga',
    country: 'Denmark',
    region: 'Adamaoua',
    story: 'Raoul\'s move to Scandinavia proved that Cameroonian players can thrive in any environment, adapting brilliantly to the Danish style.',
    storyFr: 'Le transfert de Raoul en Scandinavie a prouvé que les joueurs camerounais peuvent s\'épanouir dans n\'importe quel environnement.',
    achievements: ['Danish league champion', 'Europa League group stage', 'Fastest player in league'],
    achievementsFr: ['Champion du Danemark', 'Phase de groupes Europa League', 'Joueur le plus rapide du championnat'],
    transferValue: '€4M',
  },
];
