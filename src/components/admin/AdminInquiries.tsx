import React, { useState, useEffect } from 'react';
import { ScoutInquiry, fetchInquiries, updateInquiryStatus, deleteInquiry } from '@/data/admin';
import {
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Archive,
  ChevronDown,
  ChevronUp,
  Filter,
  ExternalLink,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  reviewed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  responded: 'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<ScoutInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id + '-status');
    const success = await updateInquiryStatus(id, status);
    if (success) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    setActionLoading(id + '-delete');
    const success = await deleteInquiry(id);
    if (success) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
    setActionLoading(null);
  };

  const filtered = inquiries.filter((i) => {
    const matchesSearch =
      i.scout_name.toLowerCase().includes(search.toLowerCase()) ||
      i.scout_email.toLowerCase().includes(search.toLowerCase()) ||
      (i.club || '').toLowerCase().includes(search.toLowerCase()) ||
      i.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (i.status || 'pending') === statusFilter;
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
            placeholder="Search by scout name, email, club, or message..."
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
            <option value="reviewed">Reviewed</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
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
        Showing {filtered.length} of {inquiries.length} inquiries
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No inquiries found</p>
          <p className="text-sm mt-1">Scout inquiries will appear here when scouts send messages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const isExpanded = expandedId === inq.id;
            const currentStatus = inq.status || 'pending';
            return (
              <div
                key={inq.id}
                className="bg-[#0a1a0f]/60 border border-[#006633]/20 rounded-xl overflow-hidden hover:border-[#006633]/40 transition-colors"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006633]/60 to-[#FCD116]/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#FCD116]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{inq.scout_name}</span>
                      {inq.club && (
                        <span className="text-gray-500 text-xs">({inq.club})</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{inq.scout_email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${statusColors[currentStatus]}`}>
                    {currentStatus}
                  </span>
                  <span className="text-gray-600 text-xs hidden sm:block flex-shrink-0">
                    {new Date(inq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-gray-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[#006633]/10">
                    {/* Message */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Message</p>
                      <div className="bg-[#111c14] rounded-lg px-4 py-3 text-gray-300 text-sm leading-relaxed">
                        {inq.message}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs block">Email</span>
                        <a href={`mailto:${inq.scout_email}`} className="text-[#FCD116] hover:underline flex items-center gap-1">
                          {inq.scout_email} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Club</span>
                        <span className="text-white">{inq.club || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Player ID</span>
                        <span className="text-white font-mono text-xs">{inq.player_id ? inq.player_id.slice(0, 8) + '...' : 'General'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Date</span>
                        <span className="text-white">
                          {new Date(inq.created_at).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#006633]/10">
                      <span className="text-xs text-gray-500 mr-2">Set status:</span>
                      {[
                        { value: 'pending', icon: Clock, label: 'Pending', color: 'text-yellow-400 hover:bg-yellow-500/10' },
                        { value: 'reviewed', icon: CheckCircle, label: 'Reviewed', color: 'text-blue-400 hover:bg-blue-500/10' },
                        { value: 'responded', icon: Mail, label: 'Responded', color: 'text-green-400 hover:bg-green-500/10' },
                        { value: 'archived', icon: Archive, label: 'Archived', color: 'text-gray-400 hover:bg-gray-500/10' },
                      ].map((s) => (
                        <button
                          key={s.value}
                          onClick={() => handleStatusChange(inq.id, s.value)}
                          disabled={currentStatus === s.value || !!actionLoading}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-30 ${s.color} ${currentStatus === s.value ? 'ring-1 ring-current' : ''}`}
                        >
                          {actionLoading === inq.id + '-status' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <s.icon className="w-3 h-3" />
                          )}
                          {s.label}
                        </button>
                      ))}
                      <div className="flex-1" />
                      <button
                        onClick={() => handleDelete(inq.id)}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                      >
                        {actionLoading === inq.id + '-delete' ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
