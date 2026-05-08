import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Trash2, Pin, Edit, AlertCircle, RefreshCw, Loader2, Bell, Users, Clock, Search, Eye, EyeOff, Send } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

const AnnouncementsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', targetAudience: 'All', notifyUsers: true, isPinned: false });
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');

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

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', content: '', targetAudience: 'All', notifyUsers: true, isPinned: false });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditItem(a);
    setForm({
      title: a.title || '',
      content: a.content || '',
      targetAudience: a.targetAudience || 'All',
      notifyUsers: false,
      isPinned: a.isPinned || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error('Title and content are required'); return; }
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
    try {
      await adminService.announcements.delete(id);
      setItems(p => p.filter(a => (a._id || a.id) !== id));
      toast.success('Deleted');
    } catch (e) { toast.error(e.message); } finally { setDeleting(null); }
  };

  const handlePin = async (id) => {
    try {
      await adminService.announcements.pin(id);
      setItems(p => p.map(a => (a._id || a.id) === id ? { ...a, isPinned: !a.isPinned } : a));
      toast.success('Pin toggled');
    } catch (e) { toast.error(e.message); }
  };

  const handleToggleActive = async (a) => {
    const aid = a._id || a.id;
    try {
      await adminService.announcements.update(aid, { isActive: !a.isActive });
      setItems(p => p.map(item => (item._id || item.id) === aid ? { ...item, isActive: !item.isActive } : item));
      toast.success(a.isActive ? 'Deactivated' : 'Activated');
    } catch (e) { toast.error(e.message); }
  };

  // Stats
  const totalCount = items.length;
  const pinnedCount = items.filter(a => a.isPinned).length;
  const activeCount = items.filter(a => a.isActive !== false).length;

  // Filter + Search
  const filtered = items.filter(a => {
    const matchesSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase());
    if (filterTab === 'pinned') return a.isPinned && matchesSearch;
    if (filterTab === 'inactive') return a.isActive === false && matchesSearch;
    return matchesSearch;
  });

  const audienceColors = {
    All: 'from-blue-500 to-cyan-500',
    Students: 'from-emerald-500 to-teal-500',
    Teachers: 'from-amber-500 to-orange-500',
  };

  const audienceBadge = {
    All: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Students: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Teachers: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 animate-pulse">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchData} className="px-5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-bold cursor-pointer flex items-center gap-2 hover:bg-indigo-500/20 transition">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: totalCount, icon: Megaphone, gradient: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-500/10' },
          { label: 'Pinned', value: pinnedCount, icon: Pin, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
          { label: 'Active', value: activeCount, icon: Bell, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1e2030] rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'pinned', 'inactive'].map(tab => (
            <button key={tab} onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterTab === tab ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition" />
          </div>
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer whitespace-nowrap">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1e2030] rounded-2xl border border-white/5 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No announcements</h3>
          <p className="text-sm text-slate-500 mb-6">Create your first announcement to get started.</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold cursor-pointer">
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const aid = a._id || a.id;
            const date = a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
            const isActive = a.isActive !== false;
            const gradientClass = audienceColors[a.targetAudience] || audienceColors.All;
            const badgeClass = audienceBadge[a.targetAudience] || audienceBadge.All;

            return (
              <div key={aid} className={`group bg-[#1e2030] rounded-2xl border transition-all duration-300 hover:border-white/15 hover:shadow-lg hover:shadow-black/20 ${
                !isActive ? 'opacity-50 border-white/5' : a.isPinned ? 'border-indigo-500/30 shadow-indigo-500/5' : 'border-white/5'
              }`}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-md`}>
                      {a.isPinned ? <Pin className="w-5 h-5 text-white" /> : <Megaphone className="w-5 h-5 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white truncate">{a.title || 'Untitled'}</h3>
                        {a.isPinned && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 uppercase">Pinned</span>}
                        {!isActive && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20 uppercase">Inactive</span>}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{a.content || ''}</p>
                      <div className="flex items-center flex-wrap gap-3 mt-3">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {date}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass} flex items-center gap-1`}>
                          <Users className="w-3 h-3" /> {a.targetAudience || 'All'}
                        </span>
                        {a.createdBy && <span className="text-[11px] text-slate-500">by {a.createdBy.fullName || a.createdBy.userName || '—'}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => handleToggleActive(a)} title={isActive ? 'Deactivate' : 'Activate'}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white cursor-pointer transition">
                        {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handlePin(aid)} title={a.isPinned ? 'Unpin' : 'Pin to top'}
                        className={`p-2 rounded-lg hover:bg-white/5 cursor-pointer transition flex items-center gap-1 ${a.isPinned ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-indigo-400'}`}>
                        <Pin className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{a.isPinned ? 'Unpin' : 'Pin'}</span>
                      </button>
                      <button onClick={() => openEdit(a)} title="Edit"
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white cursor-pointer transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDel(aid)} disabled={deleting === aid} title="Delete"
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer transition disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal open={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Announcement' : 'New Announcement'} icon={Megaphone}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title…"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
            <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your announcement…"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Audience</label>
              <select value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                <option value="All">All Users</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <span className="text-xs font-bold text-slate-300"><Pin className="w-3 h-3 inline mr-1" />Pin to top</span>
              </label>
            </div>
          </div>

          {!editItem && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
              <input type="checkbox" id="notifyUsers" checked={form.notifyUsers} onChange={e => setForm(f => ({ ...f, notifyUsers: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              <label htmlFor="notifyUsers" className="cursor-pointer select-none">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><Send className="w-3 h-3" /> Send notification to all users</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Users will see this in their notification center</p>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editItem ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={() => handleDelete(confirmDel)}
        title="Delete announcement?" description="This will permanently remove this announcement and any associated notifications." confirmText="Delete" variant="danger" loading={!!deleting} />
    </div>
  );
};

export default AnnouncementsPage;
