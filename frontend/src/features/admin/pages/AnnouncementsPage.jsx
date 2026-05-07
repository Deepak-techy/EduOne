// src/features/admin/pages/AnnouncementsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Trash2, Pin, Edit, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonLoader';

const AnnouncementsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', targetAudience: 'All' });
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminService.announcements.getAll({ limit: 1000 });
      const payload = res.data ?? res;
      const list = payload?.announcements ?? payload ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditItem(null); setForm({ title: '', content: '', targetAudience: 'All' }); setShowModal(true); };
  const openEdit = (a) => { setEditItem(a); setForm({ title: a.title || '', content: a.content || a.body || a.message || '', targetAudience: a.targetAudience || 'All' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error('Title and message required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await adminService.announcements.update(editItem._id || editItem.id, form);
        const updated = res.data ?? res;
        setItems(p => p.map(a => (a._id || a.id) === (editItem._id || editItem.id) ? { ...a, ...updated, ...form } : a));
        toast.success('Announcement updated');
      } else {
        const res = await adminService.announcements.create(form);
        const newItem = res.data ?? res;
        setItems(p => [newItem, ...p]);
        toast.success('Announcement posted!');
      }
      setShowModal(false);
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id); setConfirmDel(null);
    try { await adminService.announcements.delete(id); setItems(p => p.filter(a => (a._id || a.id) !== id)); toast.success('Deleted'); }
    catch (e) { toast.error(e.message); } finally { setDeleting(null); }
  };

  const handlePin = async (id) => {
    try { await adminService.announcements.pin(id); setItems(p => p.map(a => (a._id || a.id) === id ? { ...a, isPinned: !a.isPinned } : a)); toast.success('Pin toggled'); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="grid grid-cols-1 gap-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3"><AlertCircle className="w-8 h-8 text-red-400" /><p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button></div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Announcements</h2><p className="text-sm text-slate-400">{items.length} posted</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer">
          <Plus className="w-4 h-4" />New Announcement
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Create your first announcement." action={openCreate} actionLabel="Create" />
      ) : (
        <div className="space-y-3">
          {items.map(a => {
            const aid = a._id || a.id;
            const date = a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
            return (
              <div key={aid} className={`bg-[#1e2030] rounded-2xl p-5 border transition-all duration-300 hover:border-white/10 ${a.isPinned ? 'border-indigo-500/30' : 'border-white/5'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${a.isPinned ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>
                      {a.isPinned ? <Pin className="w-4 h-4 text-white" /> : <Megaphone className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{a.title || 'Untitled'}</p>
                        {a.isPinned && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">PINNED</span>}
                      </div>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{a.content || a.body || a.message || ''}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500">{date}</span>
                        {a.targetAudience && a.targetAudience !== 'All' && <span className="text-xs text-indigo-400 font-semibold">→ {a.targetAudience}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handlePin(aid)} title="Toggle pin" className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 cursor-pointer"><Pin className="w-4 h-4" /></button>
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white cursor-pointer"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDel(aid)} disabled={deleting === aid} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal open={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Announcement' : 'New Announcement'} icon={Megaphone}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title…"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Message</label>
            <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your announcement…"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Target Audience</label>
            <select value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
              <option value="All">All Users</option><option value="Students">Students Only</option><option value="Teachers">Teachers Only</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-sm hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editItem ? 'Update' : 'Post'}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={() => handleDelete(confirmDel)}
        title="Delete announcement?" description="This will permanently remove this announcement." confirmText="Delete" variant="danger" loading={!!deleting} />
    </div>
  );
};

export default AnnouncementsPage;
