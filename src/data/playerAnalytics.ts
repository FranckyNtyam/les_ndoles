import { supabase } from '@/lib/supabase';

export interface RatingPoint {
  year: number;
  month: number;
  rating: number;
  event?: string;
}

export interface VideoAnalyticsSummary {
  total_views: number;
  unique_viewers: number;
  avg_watch_duration: number;
  avg_completion: number;
  total_watch_time: number;
  views_by_date: Record<string, number>;
  viewer_demographics: {
    anonymous: number;
    identified: number;
  };
  recent_viewers: {
    viewer_name: string | null;
    viewer_email: string | null;
    watched_at: string;
    watch_duration: number;
    completion: number;
  }[];
}

export interface PlayerComment {
  id: string;
  player_id: string;
  author_name: string;
  author_role: string;
  author_email: string | null;
  user_id: string | null;
  content: string;
  rating: number | null;
  is_endorsement: boolean;
  created_at: string;
}

export interface RecentInquiry {
  id: string;
  scout_name: string;
  club: string | null;
  created_at: string;
  status: string | null;
}

export interface PlayerAnalyticsData {
  player: any;
  video_analytics: VideoAnalyticsSummary;
  inquiry_count: number;
  recent_inquiries: RecentInquiry[];
  comments: PlayerComment[];
  rating_history: RatingPoint[];
}

export async function fetchPlayerAnalytics(playerId: string): Promise<PlayerAnalyticsData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('player-analytics', {
      body: {
        action: 'get_player_analytics',
        player_id: playerId,
      },
    });

    if (error || !data) {
      console.error('Error fetching player analytics:', error);
      return null;
    }

    return data as PlayerAnalyticsData;
  } catch (err) {
    console.error('Error fetching player analytics:', err);
    return null;
  }
}

export async function addPlayerComment(params: {
  playerId: string;
  authorName: string;
  authorRole?: string;
  authorEmail?: string;
  userId?: string;
  content: string;
  rating?: number;
  isEndorsement?: boolean;
}): Promise<PlayerComment | null> {
  try {
    const { data, error } = await supabase.functions.invoke('player-analytics', {
      body: {
        action: 'add_comment',
        player_id: params.playerId,
        author_name: params.authorName,
        author_role: params.authorRole || 'Scout',
        author_email: params.authorEmail || null,
        user_id: params.userId || null,
        content: params.content,
        rating: params.rating || null,
        is_endorsement: params.isEndorsement || false,
      },
    });

    if (error || !data) return null;
    return data.comment;
  } catch {
    return null;
  }
}

export async function deletePlayerComment(commentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('player-analytics', {
      body: {
        action: 'delete_comment',
        comment_id: commentId,
      },
    });
    return !error && data?.success;
  } catch {
    return false;
  }
}

// Helper to format date relative to now
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}
