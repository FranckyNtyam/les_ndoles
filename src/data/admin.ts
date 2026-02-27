import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface PlayerSubmission {
  id: string;
  name: string;
  position: string;
  age: number;
  region: string;
  contact: string;
  submitted_by: string | null;
  status: string;
  created_at: string;
}

export interface ScoutInquiry {
  id: string;
  scout_name: string;
  scout_email: string;
  club: string | null;
  message: string;
  player_id: string | null;
  user_id: string | null;
  status: string | null;
  created_at: string;
  player_name?: string;
}

export interface DbPlayer {
  id: string;
  name: string;
  position: string;
  position_fr: string;
  age: number;
  club: string;
  region: string;
  region_key: string;
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
  career: any;
  bio: string;
  bio_fr: string;
  video_url: string | null;
  status: string | null;
  created_at: string;
}


// ─── Admin Auth ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'LesNdolés2026!';

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function checkAdminEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return !error && !!data;
}

// ─── Player Submissions ─────────────────────────────────────────────────────
export async function fetchSubmissions(): Promise<PlayerSubmission[]> {
  const { data, error } = await supabase
    .from('player_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  const { error } = await supabase
    .from('player_submissions')
    .update({ status })
    .eq('id', id);
  return !error;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('player_submissions')
    .delete()
    .eq('id', id);
  return !error;
}

// ─── Players ─────────────────────────────────────────────────────────────────
export async function fetchAllPlayers(): Promise<DbPlayer[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data;
}

export async function updatePlayer(
  id: string,
  updates: Partial<DbPlayer>
): Promise<boolean> {
  const { error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', id);
  return !error;
}

export async function deletePlayer(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  return !error;
}

export async function createPlayerFromSubmission(
  submission: PlayerSubmission
): Promise<boolean> {
  const positionFrMap: Record<string, string> = {
    Forward: 'Attaquant',
    Midfielder: 'Milieu',
    Defender: 'Défenseur',
    Goalkeeper: 'Gardien',
  };
  const regionKeyMap: Record<string, string> = {
    Centre: 'centre',
    Littoral: 'littoral',
    Ouest: 'ouest',
    'Sud-Ouest': 'sudouest',
    'Nord-Ouest': 'nordouest',
    Nord: 'nord',
    'Extrême-Nord': 'extreme_nord',
    Adamaoua: 'adamaoua',
    Est: 'est',
    Sud: 'sud',
  };

  const { error } = await supabase.from('players').insert({
    name: submission.name,
    position: submission.position,
    position_fr: positionFrMap[submission.position] || submission.position,
    age: submission.age,
    club: 'Non affilié',
    region: submission.region,
    region_key: regionKeyMap[submission.region] || submission.region.toLowerCase(),
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772142849934_ea1c948d.jpg',
    height: '1.78m',
    weight: '72kg',
    foot: 'Right',
    goals: 0,
    assists: 0,
    matches: 0,
    rating: 5.0,
    speed: 50,
    shooting: 50,
    passing: 50,
    dribbling: 50,
    defense: 50,
    stamina: 50,
    career: JSON.stringify([]),
    bio: `Promising ${submission.position.toLowerCase()} from ${submission.region}.`,
    bio_fr: `${positionFrMap[submission.position] || submission.position} prometteur de la région ${submission.region}.`,
    status: 'active',
  });
  return !error;
}

// ─── Scout Inquiries ─────────────────────────────────────────────────────────
export async function fetchInquiries(): Promise<ScoutInquiry[]> {
  const { data, error } = await supabase
    .from('scout_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function updateInquiryStatus(
  id: string,
  status: string
): Promise<boolean> {
  const { error } = await supabase
    .from('scout_inquiries')
    .update({ status })
    .eq('id', id);
  return !error;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('scout_inquiries')
    .delete()
    .eq('id', id);
  return !error;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export async function fetchDashboardStats(): Promise<{
  totalPlayers: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  totalInquiries: number;
  pendingInquiries: number;
}> {
  const [playersRes, subsRes, inqRes] = await Promise.all([
    supabase.from('players').select('id', { count: 'exact', head: true }),
    supabase.from('player_submissions').select('id, status'),
    supabase.from('scout_inquiries').select('id, status'),
  ]);

  const totalPlayers = playersRes.count || 0;
  const submissions = subsRes.data || [];
  const inquiries = inqRes.data || [];

  return {
    totalPlayers,
    totalSubmissions: submissions.length,
    pendingSubmissions: submissions.filter((s: any) => s.status === 'pending').length,
    totalInquiries: inquiries.length,
    pendingInquiries: inquiries.filter((i: any) => !i.status || i.status === 'pending').length,
  };
}
