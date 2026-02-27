import { supabase } from '@/lib/supabase';

// Generate a unique session ID for anonymous view tracking
export function getViewSessionId(): string {
  let sessionId = sessionStorage.getItem('video_session_id');
  if (!sessionId) {
    sessionId = `vs_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('video_session_id', sessionId);
  }
  return sessionId;
}

export interface VideoViewRecord {
  playerId: string;
  sessionId: string;
  viewerId?: string;
  viewerEmail?: string;
  viewerName?: string;
  watchDurationSeconds: number;
  totalDurationSeconds: number;
}

export interface PlayerViewAnalytics {
  playerId: string;
  totalViews: number;
  uniqueViewers: number;
  avgWatchDuration: number;
  avgCompletion: number;
  recentViewers: {
    viewer_name: string | null;
    viewer_email: string | null;
    watched_at: string;
    watch_duration: number;
    completion: number;
  }[];
}

export interface LeaderboardEntry {
  player_id: string;
  total_views: number;
  total_watch_time: number;
  avg_completion: number;
  last_viewed: string;
  player: {
    id: string;
    name: string;
    position: string;
    position_fr: string;
    club: string;
    region: string;
    image: string;
    rating: number;
    video_url: string | null;
    age: number;
  };
}

export interface MostWatchedData {
  leaderboard: LeaderboardEntry[];
  platformStats: {
    totalViews: number;
    totalWatchTimeSeconds: number;
    uniquePlayersWatched: number;
  };
}

// Record a new video view
export async function recordVideoView(record: VideoViewRecord): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('video-analytics', {
      body: {
        action: 'record_view',
        player_id: record.playerId,
        session_id: record.sessionId,
        viewer_id: record.viewerId || null,
        viewer_email: record.viewerEmail || null,
        viewer_name: record.viewerName || null,
        watch_duration_seconds: record.watchDurationSeconds,
        total_duration_seconds: record.totalDurationSeconds,
      },
    });

    if (error) {
      console.error('Error recording video view:', error);
      return null;
    }

    return data?.view?.id || null;
  } catch (err) {
    console.error('Error recording video view:', err);
    return null;
  }
}

// Update watch duration for an existing view session
export async function updateVideoView(
  playerId: string,
  sessionId: string,
  watchDurationSeconds: number,
  totalDurationSeconds: number
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('video-analytics', {
      body: {
        action: 'update_view',
        player_id: playerId,
        session_id: sessionId,
        watch_duration_seconds: watchDurationSeconds,
        total_duration_seconds: totalDurationSeconds,
      },
    });

    return !error;
  } catch {
    return false;
  }
}

// Get analytics for a specific player
export async function fetchPlayerViewAnalytics(playerId: string): Promise<PlayerViewAnalytics | null> {
  try {
    const { data, error } = await supabase.functions.invoke('video-analytics', {
      body: {
        action: 'get_player_views',
        player_id: playerId,
      },
    });

    if (error || !data) return null;

    return {
      playerId: data.player_id,
      totalViews: data.total_views,
      uniqueViewers: data.unique_viewers,
      avgWatchDuration: data.avg_watch_duration,
      avgCompletion: data.avg_completion,
      recentViewers: data.recent_viewers || [],
    };
  } catch {
    return null;
  }
}

// Get most watched leaderboard
export async function fetchMostWatched(limit: number = 10): Promise<MostWatchedData> {
  try {
    const { data, error } = await supabase.functions.invoke('video-analytics', {
      body: {
        action: 'get_most_watched',
        limit,
      },
    });

    if (error || !data) {
      return { leaderboard: [], platformStats: { totalViews: 0, totalWatchTimeSeconds: 0, uniquePlayersWatched: 0 } };
    }

    return {
      leaderboard: data.leaderboard || [],
      platformStats: {
        totalViews: data.platform_stats?.total_views || 0,
        totalWatchTimeSeconds: data.platform_stats?.total_watch_time_seconds || 0,
        uniquePlayersWatched: data.platform_stats?.unique_players_watched || 0,
      },
    };
  } catch {
    return { leaderboard: [], platformStats: { totalViews: 0, totalWatchTimeSeconds: 0, uniquePlayersWatched: 0 } };
  }
}

// Get view counts for all players (lightweight, for cards)
export async function fetchAllViewCounts(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase.functions.invoke('video-analytics', {
      body: { action: 'get_all_view_counts' },
    });

    if (error || !data) return {};
    return data.counts || {};
  } catch {
    return {};
  }
}

// Format seconds into human-readable duration
export function formatWatchTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Format view count with abbreviation
export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}
