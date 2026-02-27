import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Loader2, Film, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { recordVideoView, updateVideoView, getViewSessionId, formatViewCount } from '@/data/videoAnalytics';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  playerName?: string;
  playerId?: string;
  viewCount?: number;
  onViewRecorded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, playerName, playerId, viewCount, onViewRecorded }) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Analytics tracking state
  const viewSessionRef = useRef<string | null>(null);
  const hasRecordedView = useRef(false);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef(0);

  // Record a view when video starts playing
  const recordView = useCallback(async () => {
    if (hasRecordedView.current || !playerId) return;
    hasRecordedView.current = true;

    const sessionId = `${getViewSessionId()}_${playerId}_${Date.now()}`;
    viewSessionRef.current = sessionId;

    await recordVideoView({
      playerId,
      sessionId,
      viewerId: user?.id,
      viewerEmail: user?.email || undefined,
      watchDurationSeconds: 0,
      totalDurationSeconds: duration,
    });

    onViewRecorded?.();
  }, [playerId, user, duration, onViewRecorded]);

  // Periodically update watch duration
  const startDurationTracking = useCallback(() => {
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);

    updateIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || !playerId || !viewSessionRef.current) return;

      const currentWatchTime = video.currentTime;
      // Only update if at least 2 seconds have passed since last update
      if (currentWatchTime - lastUpdateTimeRef.current >= 2) {
        lastUpdateTimeRef.current = currentWatchTime;
        updateVideoView(playerId, viewSessionRef.current, currentWatchTime, video.duration);
      }
    }, 5000); // Update every 5 seconds
  }, [playerId]);

  const stopDurationTracking = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // Final update when pausing/stopping
    const video = videoRef.current;
    if (video && playerId && viewSessionRef.current) {
      updateVideoView(playerId, viewSessionRef.current, video.currentTime, video.duration);
    }
  }, [playerId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDurationTracking();
    };
  }, [stopDurationTracking]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset tracking state when src changes
    hasRecordedView.current = false;
    viewSessionRef.current = null;
    lastUpdateTimeRef.current = 0;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      stopDurationTracking();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [src, stopDurationTracking]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      stopDurationTracking();
    } else {
      video.play().catch(() => {
        setHasError(true);
      });
      // Record view on first play
      recordView();
      startDurationTracking();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    video.currentTime = percentage * video.duration;
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
    startDurationTracking();
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  if (hasError) {
    return (
      <div className="relative w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-[#CE1126]/30 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#CE1126]/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#CE1126]" />
        </div>
        <p className="text-gray-400 text-sm text-center px-4">Unable to load video. The file may be unavailable or in an unsupported format.</p>
        <button
          onClick={() => { setHasError(false); setIsLoading(true); hasRecordedView.current = false; }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#006633]/30 group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#FCD116]" />
            <span className="text-white/70 text-sm">Loading video...</span>
          </div>
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={togglePlay}>
          <div className="w-20 h-20 rounded-full bg-[#006633]/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-[#006633]/40 hover:scale-110 transition-transform">
            <Play className="w-9 h-9 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Player Name Badge + View Count */}
      <div className={`absolute top-3 left-3 right-3 flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {playerName && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
            <Film className="w-3.5 h-3.5 text-[#FCD116]" />
            <span className="text-white text-xs font-medium">{playerName} - Highlights</span>
          </div>
        )}
        {viewCount !== undefined && viewCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
            <Eye className="w-3.5 h-3.5 text-[#FCD116]" />
            <span className="text-white text-xs font-medium">{formatViewCount(viewCount)} views</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10 pb-3 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-2.5 transition-all"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-[#006633] to-[#FCD116] rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FCD116] shadow-lg shadow-[#FCD116]/40 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            <span className="text-white/70 text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={handleFullscreen}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Maximize className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
