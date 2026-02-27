import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, Upload, Film, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { DbPlayer, updatePlayer } from '@/data/admin';
import { supabase } from '@/lib/supabase';

interface Props {
  player: DbPlayer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const statFields = [
  { key: 'speed', label: 'Speed' },
  { key: 'shooting', label: 'Shooting' },
  { key: 'passing', label: 'Passing' },
  { key: 'dribbling', label: 'Dribbling' },
  { key: 'defense', label: 'Defense' },
  { key: 'stamina', label: 'Stamina' },
] as const;

const AdminPlayerEditModal: React.FC<Props> = ({ player, isOpen, onClose, onSaved }) => {
  const [form, setForm] = useState<Partial<DbPlayer>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState('');
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);
  const [videoError, setVideoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (player) {
      setForm({ ...player });
      setError('');
      setVideoError('');
      setVideoUploadSuccess(false);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const { id, created_at, ...updates } = form;
    const success = await updatePlayer(player.id, updates);
    setSaving(false);
    if (success) {
      onSaved();
      onClose();
    } else {
      setError('Failed to save changes. Please try again.');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      setVideoError('Invalid file type. Allowed: MP4, WebM, MOV, AVI');
      return;
    }
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setVideoError('File too large. Maximum size is 50MB.');
      return;
    }

    setVideoUploading(true);
    setVideoError('');
    setVideoUploadSuccess(false);
    setVideoUploadProgress(`Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('playerId', player.id);

      const { data, error: fnError } = await supabase.functions.invoke('upload-video', {
        body: formData,
      });

      if (fnError) {
        setVideoError('Upload failed: ' + fnError.message);
      } else if (data?.error) {
        setVideoError('Upload failed: ' + data.error);
      } else if (data?.videoUrl) {
        setForm((prev) => ({ ...prev, video_url: data.videoUrl }));
        setVideoUploadSuccess(true);
        setVideoUploadProgress('');
        setTimeout(() => setVideoUploadSuccess(false), 4000);
      }
    } catch (err: any) {
      setVideoError('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVideoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    setForm((prev) => ({ ...prev, video_url: null }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111c14] border border-[#006633]/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#111c14] border-b border-[#006633]/30 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            Edit Player: <span className="text-[#FCD116]">{player.name}</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input type="text" value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Club</label>
                <input type="text" value={form.club || ''} onChange={(e) => handleChange('club', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Position</label>
                <select value={form.position || ''} onChange={(e) => handleChange('position', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50">
                  <option value="Forward">Forward</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Age</label>
                <input type="number" value={form.age || ''} onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Region</label>
                <select value={form.region || ''} onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50">
                  {['Centre', 'Littoral', 'Ouest', 'Sud-Ouest', 'Nord-Ouest', 'Nord', 'Extrême-Nord', 'Adamaoua', 'Est', 'Sud'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select value={form.status || 'active'} onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Physical Attributes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input type="text" value={form.height || ''} onChange={(e) => handleChange('height', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weight</label>
                <input type="text" value={form.weight || ''} onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Preferred Foot</label>
                <select value={form.foot || 'Right'} onChange={(e) => handleChange('foot', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50">
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Match Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: 'goals', label: 'Goals' },
                { key: 'assists', label: 'Assists' },
                { key: 'matches', label: 'Matches' },
                { key: 'rating', label: 'Rating' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                  <input type="number" step={f.key === 'rating' ? '0.1' : '1'}
                    value={(form as any)[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, f.key === 'rating' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Skill Stats */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Skill Ratings (0-100)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" value={(form as any)[f.key] ?? 50}
                      onChange={(e) => handleChange(f.key, parseInt(e.target.value))}
                      className="flex-1 accent-[#FCD116]" />
                    <span className="text-white text-sm font-mono w-8 text-right">{(form as any)[f.key] ?? 50}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Image</h3>
            <div className="flex items-start gap-4">
              {form.image && (
                <img src={form.image} alt="Player" className="w-20 h-20 rounded-xl object-cover border border-[#006633]/30" />
              )}
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                <input type="text" value={form.image || ''} onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50" />
              </div>
            </div>
          </div>

          {/* Video Highlights Upload */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Film className="w-4 h-4" />
              Video Highlights
            </h3>

            {form.video_url ? (
              <div className="space-y-3">
                <div className="bg-[#0a1a0f] border border-[#006633]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#FCD116]/20 flex items-center justify-center flex-shrink-0">
                      <Film className="w-6 h-6 text-[#FCD116]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">Video Uploaded</p>
                      <p className="text-gray-500 text-xs truncate">{form.video_url}</p>
                    </div>
                    <button onClick={handleRemoveVideo}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CE1126]/30 text-[#CE1126] hover:bg-[#CE1126]/10 text-xs font-medium transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                  {/* Video Preview */}
                  <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                    <video src={form.video_url} controls className="w-full max-h-48 bg-black" preload="metadata" />
                  </div>
                </div>

                {/* Replace Video */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Replace with new video</label>
                  <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    onChange={handleVideoUpload} disabled={videoUploading}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#006633]/20 file:text-[#006633] hover:file:bg-[#006633]/30 file:cursor-pointer file:transition-colors disabled:opacity-50" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    videoUploading ? 'border-[#FCD116]/40 bg-[#FCD116]/5' : 'border-[#006633]/30 hover:border-[#FCD116]/40 bg-[#0a1a0f]'
                  }`}
                >
                  {videoUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#FCD116]" />
                      <p className="text-white text-sm font-medium">Uploading Video...</p>
                      <p className="text-gray-500 text-xs">{videoUploadProgress}</p>
                      <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#006633] to-[#FCD116] rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#006633]/10 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-[#006633]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Upload Highlight Video</p>
                        <p className="text-gray-500 text-xs mt-1">MP4, WebM, MOV or AVI - Max 50MB (30-60 sec recommended)</p>
                      </div>
                      <label className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#006633] to-[#008844] text-white text-sm font-semibold hover:from-[#007744] hover:to-[#009955] transition-all cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Choose Video File
                        <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                          onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Or paste URL */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Or paste video URL directly</label>
                  <input type="text" value={form.video_url || ''} onChange={(e) => handleChange('video_url', e.target.value || null)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50 placeholder-gray-600" />
                </div>
              </div>
            )}

            {videoUploadSuccess && (
              <div className="mt-3 flex items-center gap-2 bg-[#006633]/10 border border-[#006633]/30 text-[#006633] px-4 py-3 rounded-lg text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Video uploaded successfully! It will be visible on the player's profile.
              </div>
            )}
            {videoError && (
              <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {videoError}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-semibold text-[#FCD116] uppercase tracking-wider mb-3">Biography</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Bio (English)</label>
                <textarea value={form.bio || ''} onChange={(e) => handleChange('bio', e.target.value)} rows={3}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Bio (French)</label>
                <textarea value={form.bio_fr || ''} onChange={(e) => handleChange('bio_fr', e.target.value)} rows={3}
                  className="w-full bg-[#0a1a0f] border border-[#006633]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FCD116]/50 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#111c14] border-t border-[#006633]/30 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#006633] to-[#008844] text-white text-sm font-semibold hover:from-[#007744] hover:to-[#009955] transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayerEditModal;
