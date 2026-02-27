import React, { useState, useCallback, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Player, fetchPlayers, fetchShortlist, addToShortlist, removeFromShortlist } from '@/data/players';
import { fetchAllViewCounts } from '@/data/videoAnalytics';
import Navbar from './Navbar';
import Hero from './Hero';
import PositionShowcase from './PositionShowcase';
import PlayerGrid from './PlayerGrid';
import PlayerModal from './PlayerModal';
import StatsSection from './StatsSection';
import SuccessStories from './SuccessStories';
import RegionMap from './RegionMap';
import NewsFeed from './NewsFeed';
import ScoutDashboard from './ScoutDashboard';
import MostWatched from './MostWatched';
import Footer from './Footer';
import AuthModal from './AuthModal';

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Fetch players from database on mount
  useEffect(() => {
    const loadPlayers = async () => {
      setPlayersLoading(true);
      const data = await fetchPlayers();
      setPlayers(data);
      setPlayersLoading(false);
    };
    loadPlayers();
  }, []);

  // Fetch video view counts
  const loadViewCounts = useCallback(async () => {
    const counts = await fetchAllViewCounts();
    setViewCounts(counts);
  }, []);

  useEffect(() => {
    loadViewCounts();
  }, [loadViewCounts]);

  // Load shortlist from DB when user logs in, or clear when logged out
  useEffect(() => {
    if (user) {
      const loadShortlist = async () => {
        const ids = await fetchShortlist(user.id);
        setShortlist(ids);
      };
      loadShortlist();
    } else {
      // Keep local shortlist for anonymous users (won't persist)
    }
  }, [user]);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleToggleShortlist = useCallback(async (id: string) => {
    const isCurrentlyShortlisted = shortlist.includes(id);

    // Optimistic update
    setShortlist((prev) =>
      isCurrentlyShortlisted ? prev.filter((pid) => pid !== id) : [...prev, id]
    );

    // If user is logged in, persist to DB
    if (user) {
      if (isCurrentlyShortlisted) {
        const success = await removeFromShortlist(user.id, id);
        if (!success) {
          // Revert on failure
          setShortlist((prev) => [...prev, id]);
        }
      } else {
        const success = await addToShortlist(user.id, id);
        if (!success) {
          // Revert on failure
          setShortlist((prev) => prev.filter((pid) => pid !== id));
        }
      }
    }
  }, [shortlist, user]);

  const handleViewProfile = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedPlayer(null);
  }, []);

  const handleFilterPosition = useCallback((position: string) => {
    handleNavigate('players');
  }, [handleNavigate]);

  const handleOpenAuth = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  // Refresh view counts when a view is recorded
  const handleViewRecorded = useCallback(() => {
    // Debounced refresh of view counts
    setTimeout(() => {
      loadViewCounts();
    }, 1000);
  }, [loadViewCounts]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0a1a0f] text-white">
        <Navbar onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />
        <Hero onNavigate={handleNavigate} />
        <StatsSection />
        <PositionShowcase players={players} onFilterPosition={handleFilterPosition} />
        <PlayerGrid
          players={players}
          loading={playersLoading}
          shortlist={shortlist}
          onToggleShortlist={handleToggleShortlist}
          onViewProfile={handleViewProfile}
          viewCounts={viewCounts}
        />
        <div id="trending">
          <MostWatched
            onViewProfile={handleViewProfile}
            players={players}
          />
        </div>
        <SuccessStories />
        <RegionMap players={players} />
        <NewsFeed />
        <ScoutDashboard
          players={players}
          shortlist={shortlist}
          onToggleShortlist={handleToggleShortlist}
          onViewProfile={handleViewProfile}
          onOpenAuth={handleOpenAuth}
        />
        <Footer onNavigate={handleNavigate} />

        {/* Player Detail Modal */}
        <PlayerModal
          player={selectedPlayer}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          isShortlisted={selectedPlayer ? shortlist.includes(selectedPlayer.id) : false}
          onToggleShortlist={handleToggleShortlist}
          onViewRecorded={handleViewRecorded}
        />

        {/* Auth Modal */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </LanguageProvider>
  );
};

export default AppLayout;
