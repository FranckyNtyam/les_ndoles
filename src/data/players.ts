import { supabase } from '@/lib/supabase';

export interface Player {
  id: string;
  name: string;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  positionFr: string;
  age: number;
  club: string;
  region: string;
  regionKey: string;
  image: string;
  height: string;
  weight: string;
  foot: string;
  goals: number;
  assists: number;
  matches: number;
  rating: number;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  stamina: number;
  career: { year: string; event: string; eventFr: string }[];
  bio: string;
  bioFr: string;
  videoUrl: string | null;
}


// Map DB snake_case rows to camelCase Player interface
function mapDbPlayer(row: any): Player {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    positionFr: row.position_fr,
    age: row.age,
    club: row.club,
    region: row.region,
    regionKey: row.region_key,
    image: row.image,
    height: row.height,
    weight: row.weight,
    foot: row.foot,
    goals: row.goals,
    assists: row.assists,
    matches: row.matches,
    rating: Number(row.rating),
    speed: row.speed,
    shooting: row.shooting,
    passing: row.passing,
    dribbling: row.dribbling,
    defense: row.defense,
    stamina: row.stamina,
    career: typeof row.career === 'string' ? JSON.parse(row.career) : (row.career || []),
    bio: row.bio,
    bioFr: row.bio_fr,
    videoUrl: row.video_url || null,
  };
}


// Fetch all approved players from Supabase
export async function fetchPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching players:', error);
    return fallbackPlayers;
  }

  if (!data || data.length === 0) {
    return fallbackPlayers;
  }

  return data.map(mapDbPlayer);
}

// Fetch a single player by ID
export async function fetchPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapDbPlayer(data);
}

// Submit a player inquiry to the database
export async function submitInquiry(params: {
  scoutName: string;
  scoutEmail: string;
  club?: string;
  message: string;
  playerId?: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('scout_inquiries').insert({
    scout_name: params.scoutName,
    scout_email: params.scoutEmail,
    club: params.club || '',
    message: params.message,
    player_id: params.playerId || null,
    user_id: params.userId || null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Submit a new player profile for review
export async function submitPlayerProfile(params: {
  name: string;
  position: string;
  age: number;
  region: string;
  contact: string;
  submittedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('player_submissions').insert({
    name: params.name,
    position: params.position,
    age: params.age,
    region: params.region,
    contact: params.contact,
    submitted_by: params.submittedBy || null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Shortlist helpers
export async function fetchShortlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('shortlists')
    .select('player_id')
    .eq('user_id', userId);

  if (error || !data) return [];
  return data.map((row: any) => row.player_id);
}

export async function addToShortlist(userId: string, playerId: string): Promise<boolean> {
  const { error } = await supabase.from('shortlists').insert({
    user_id: userId,
    player_id: playerId,
  });
  return !error;
}

export async function removeFromShortlist(userId: string, playerId: string): Promise<boolean> {
  const { error } = await supabase
    .from('shortlists')
    .delete()
    .eq('user_id', userId)
    .eq('player_id', playerId);
  return !error;
}

// Fallback data in case DB is unavailable
const fallbackPlayers: Player[] = [
  {
    id: 'fallback-1',
    name: 'Jean-Pierre Mbarga',
    position: 'Forward',
    positionFr: 'Attaquant',
    age: 22,
    club: 'Coton Sport FC',
    region: 'Centre',
    regionKey: 'centre',
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772142849934_ea1c948d.jpg',
    height: '1.82m', weight: '76kg', foot: 'Right',
    goals: 18, assists: 7, matches: 32, rating: 8.2,
    speed: 88, shooting: 85, passing: 72, dribbling: 84, defense: 35, stamina: 82,
    career: [
      { year: '2022', event: 'Joined Coton Sport FC', eventFr: 'Rejoint Coton Sport FC' },
      { year: '2023', event: 'Top scorer of Elite One', eventFr: 'Meilleur buteur de l\'Elite One' },
      { year: '2024', event: 'Called up to national team', eventFr: 'Convoqué en équipe nationale' },
    ],
    bio: 'A prolific striker with exceptional pace and clinical finishing ability.',
    bioFr: 'Un attaquant prolifique avec une vitesse exceptionnelle et une finition clinique.',
    videoUrl: null,
  },
];


export const positions = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'] as const;
export const regions = [
  'All', 'Centre', 'Littoral', 'Ouest', 'Sud-Ouest', 'Nord-Ouest',
  'Nord', 'Extrême-Nord', 'Adamaoua', 'Est', 'Sud'
] as const;
