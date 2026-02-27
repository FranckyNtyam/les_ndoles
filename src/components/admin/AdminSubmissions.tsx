import React, { useState, useEffect } from 'react';
import {
  PlayerSubmission,
  fetchSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  createPlayerFromSubmission,
} from '@/data/admin';
import {
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const AdminSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<PlayerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (sub: PlayerSubmission) => {
    setActionLoading(sub.id + '-approve');
    const success = await updateSubmissionStatus(sub.id, 'approved');
    if (success) {
      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s)));
    }
    setActionLoading(null);
  };

  const handleReject = async (sub: PlayerSubmission) => {
    setActionLoading(sub.id + '-reject');
    const success = await updateSubmissionStatus(sub.id, 'rejected');
    if (success) {
      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: 'rejected' } : s)));
    }
    setActionLoading(null);
  };

  const handleCreatePlayer = async (sub: PlayerSubmission) => {
    setActionLoading(sub.id + '-create');
    const success = await createPlayerFromSubmission(sub);
    if (success) {
      await updateSubmissionStatus(sub.id, 'approved');
      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s)));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    setActionLoading(id + '-delete');
    const success = await deleteSubmission(id);
    if (success) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
    setActionLoading(null);
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.region.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, region, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a1a0f] border border-[#006633]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#FCD116]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#FCD116]/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
        Showing {filtered.length} of {submissions.length} submissions
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No submissions found</p>
          <p className="text-sm mt-1">Player submissions will appear here when users submit profiles.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#006633]/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#006633]/10 border-b border-[#006633]/20">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Player</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Position</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Region</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Age</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <React.Fragment key={sub.id}>
                  <tr
                    className="border-b border-[#006633]/10 hover:bg-[#006633]/5 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006633] to-[#FCD116] flex items-center justify-center text-white text-xs font-bold">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{sub.name}</p>
                          <p className="text-gray-500 text-xs sm:hidden">{sub.position} · {sub.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{sub.position}</td>
                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{sub.region}</td>
                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{sub.age}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[sub.status] || statusColors.pending}`}>
                        {sub.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(sub.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {sub.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApprove(sub); }}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-30"
                              title="Approve"
                            >
                              {actionLoading === sub.id + '-approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleReject(sub); }}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                              title="Reject"
                            >
                              {actionLoading === sub.id + '-reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                        {sub.status === 'approved' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCreatePlayer(sub); }}
                            disabled={!!actionLoading}
                            className="p-1.5 rounded-lg text-[#FCD116] hover:bg-[#FCD116]/10 transition-colors disabled:opacity-30"
                            title="Create Player Profile"
                          >
                            {actionLoading === sub.id + '-create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                          disabled={!!actionLoading}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                          title="Delete"
                        >
                          {actionLoading === sub.id + '-delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                        <span className="text-gray-600 ml-1">
                          {expandedId === sub.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expandedId === sub.id && (
                    <tr className="bg-[#006633]/5">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block text-xs">Contact</span>
                            <span className="text-white">{sub.contact}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Submitted By</span>
                            <span className="text-white">{sub.submitted_by || 'Anonymous'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Position</span>
                            <span className="text-white">{sub.position}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Region</span>
                            <span className="text-white">{sub.region}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
