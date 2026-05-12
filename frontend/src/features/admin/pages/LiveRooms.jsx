// src/features/admin/pages/LiveRooms.jsx
import { useState, useEffect, useCallback } from "react";
import { Mic, Video, Users, Clock, XCircle, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const adminApi = axios.create({ baseURL: "/api/admin", withCredentials: true });

const LiveRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [endingRoom, setEndingRoom] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [roomsRes, statsRes] = await Promise.all([
                adminApi.get("/rooms/active"),
                adminApi.get("/rooms/stats"),
            ]);
            setRooms(roomsRes.data?.data?.rooms || []);
            setStats(statsRes.data?.data || null);
        } catch (err) {
            console.error("Failed to load room data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    // Auto-refresh every 15s
    useEffect(() => {
        const iv = setInterval(loadData, 15000);
        return () => clearInterval(iv);
    }, [loadData]);

    const forceEnd = async (roomId) => {
        if (!confirm("Force-end this room? All participants will be disconnected.")) return;
        setEndingRoom(roomId);
        try {
            await adminApi.post(`/rooms/${roomId}/force-end`);
            toast.success("Room ended successfully");
            loadData();
        } catch (err) {
            toast.error("Failed to end room");
        } finally {
            setEndingRoom(null);
        }
    };

    const getDuration = (startedAt) => {
        const ms = Date.now() - new Date(startedAt).getTime();
        const m = Math.floor(ms / 60000);
        return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
    };

    const StatCard = ({ icon, label, value, color }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Rooms</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage active collaboration rooms</p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={<Mic size={18} className="text-purple-600" />} label="Active Voice" value={stats.activeVoice} color="bg-purple-100 dark:bg-purple-500/20" />
                    <StatCard icon={<Video size={18} className="text-blue-600" />} label="Active Video" value={stats.activeVideo} color="bg-blue-100 dark:bg-blue-500/20" />
                    <StatCard icon={<BarChart3 size={18} className="text-green-600" />} label="Total Today" value={stats.totalToday} color="bg-green-100 dark:bg-green-500/20" />
                    <StatCard icon={<Clock size={18} className="text-orange-600" />} label="Avg Duration" value={`${stats.avgDurationMinutes}m`} color="bg-orange-100 dark:bg-orange-500/20" />
                </div>
            )}

            {/* Rooms Table */}
            {rooms.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No active rooms</p>
                    <p className="text-sm mt-1">Rooms will appear here when users start collaborating</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Room</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Type</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Post</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Participants</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {rooms.map((room) => (
                                <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{room.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-400 ml-4">{room.roomCode}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                            room.type === "voice"
                                                ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                                : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                        }`}>
                                            {room.type === "voice" ? <Mic size={10} /> : <Video size={10} />}
                                            {room.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                                        {room.postId?.title || "—"}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Users size={14} />
                                            {room.participants?.length || 0} / {room.maxParticipants}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-mono">
                                        {getDuration(room.startedAt)}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            onClick={() => forceEnd(room._id)}
                                            disabled={endingRoom === room._id}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                                        >
                                            <XCircle size={13} />
                                            {endingRoom === room._id ? "Ending..." : "Force End"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LiveRooms;
