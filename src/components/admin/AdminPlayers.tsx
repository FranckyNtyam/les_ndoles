import React, { useState, useEffect } from 'react';
import { DbPlayer, fetchAllPlayers, deletePlayer, updatePlayer } from '@/data/admin';
import AdminPlayerEditModal from './AdminPlayerEditModal';
import {
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const AdminPlayers: React.FC = () => {
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [editPlayer, setEditPlayer] = useState<DbPlayer | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllPlayers();
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    setActionLoading(id);
    const success = await deletePlayer(id);
    if (success) {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
    setActionLoading(null);
  };

  const handleToggleStatus = async (player: DbPlayer) => {
    const newStatus = player.status === 'active' ? 'inactive' : 'active';
    setActionLoading(player.id + '-status');
    const success = await updatePlayer(player.id, { status: newStatus } as any);
    if (success) {
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? { ...p, status: newStatus } : p)));
    }
    setActionLoading(null);
  };

  const handleEdit = (player: DbPlayer) => {
    setEditPlayer(player);
    setEditOpen(true);
  };

  const handleSaved = () => {
    loadData();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & sort
  const filtered = players
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.club.toLowerCase().includes(search.toLowerCase());
      const matchesPos = posFilter === 'all' || p.position === posFilter;
      const matchesRegion = regionFilter === 'all' || p.region === regionFilter;
      return matchesSearch && matchesPos && matchesRegion;
    })
    .sort((a, b) => {
      const av = (a as any)[sortField];
      const bv = (b as any)[sortField];
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? (av || 0) - (bv || 0) : (bv || 0) - (av || 0);
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const uniqueRegions = [...new Set(players.map((p) => p.region))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FCD116]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or club..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a1a0f] border border-[#006633]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#FCD116]/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={posFilter}
            onChange={(e) => { setPosFilter(e.target.value); setPage(1); }}
            className="bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#FCD116]/50"
          >
            <option value="all">All Positions</option>
            <option value="Forward">Forward</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
            <option value="Goalkeeper">Goalkeeper</option>
          </select>
          <select
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
            className="bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#FCD116]/50"
          >
            <option value="all">All Regions</option>
            {uniqueRegions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={loadData}
            className="p-2.5 rounded-lg border border-[#006633]/30 text-gray-400 hover:text-[#FCD116] hover:border-[#FCD116]/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        Showing {paginated.length} of {filtered.length} players (page {page}/{totalPages || 1})
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No players found</p>
          <p className="text-sm mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#006633]/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#006633]/10 border-b border-[#006633]/20">
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-gray-400 font-medium hover:text-[#FCD116] transition-colors">
                      Player <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Position</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">
                    <button onClick={() => handleSort('club')} className="flex items-center gap-1 text-gray-400 font-medium hover:text-[#FCD116] transition-colors">
                      Club <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">
                    <button onClick={() => handleSort('rating')} className="flex items-center gap-1 text-gray-400 font-medium hover:text-[#FCD116] transition-colors">
                      Rating <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell text-gray-400 font-medium">Region</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((player) => (
                  <tr key={player.id} className="border-b border-[#006633]/10 hover:bg-[#006633]/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#006633]/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://d64gsuwffb70l.cloudfront.net/69a0c0906c293dc787eb0105_1772142849934_ea1c948d.jpg';
                          }}
                        />
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-gray-500 text-xs">{player.age} yrs · {player.foot} foot</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-300">{player.position}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{player.club}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1.5 rounded-full bg-[#0a1a0f] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#006633] to-[#FCD116]"
                            style={{ width: `${(Number(player.rating) / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-[#FCD116] font-mono text-xs">{Number(player.rating).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden lg:table-cell text-xs">{player.region}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[player.status || 'active']}`}>
                        {player.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(player)}
                          className="p-1.5 rounded-lg text-[#FCD116] hover:bg-[#FCD116]/10 transition-colors"
                          title="Edit Player"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(player)}
                          disabled={actionLoading === player.id + '-status'}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                          title={player.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {actionLoading === player.id + '-status' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : player.status === 'active' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(player.id, player.name)}
                          disabled={!!actionLoading}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                          title="Delete Player"
                        >
                          {actionLoading === player.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#006633]/30 text-gray-400 hover:text-white hover:border-[#FCD116]/40 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[#006633] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#006633]/30 text-gray-400 hover:text-white hover:border-[#FCD116]/40 transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <AdminPlayerEditModal
        player={editPlayer}
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditPlayer(null); }}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default AdminPlayers;
