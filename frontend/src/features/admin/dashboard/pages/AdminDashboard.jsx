// src/features/admin/dashboard/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    LayoutDashboard, Users, ShieldAlert, BarChart2, Megaphone,
    Loader2, AlertCircle, BookOpen, CheckCircle2, UserCheck, Activity,
} from 'lucide-react';
import { adminService } from '../../../../services/adminService';

import StatsCard from '../components/StatsCard';
import DailyActiveUsersChart from '../components/DailyActiveUsersChart';
import TasksOverviewChart from '../components/TasksOverviewChart';
import RecentActivity from '../components/RecentActivity';
import FeatureUsage from '../components/FeatureUsage';
import UserManagement from '../components/UserManagement';
import ContentModeration from '../components/ContentModeration';
import Analytics from '../components/Analytics';
import Announcements from '../components/Announcements';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'moderation', label: 'Content Moderation', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
];

// ─── Dashboard tab ─────────────────────────────────────────────────────────────
const DashboardTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getDashboard();
            setData(res.data ?? res);
        } catch (err) {
            setError(err.message ?? 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500 dark:text-slate-400">{error}</p>
            <button onClick={fetchDashboard}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
                Retry
            </button>
        </div>
    );

    // Normalise stat fields from API response
    const totalUsers = data?.totalUsers ?? data?.stats?.totalUsers ?? 0;
    const dailyActive = data?.dailyActive ?? data?.stats?.dailyActive ?? 0;
    const notesCreated = data?.notesCreated ?? data?.stats?.notesCreated ?? 0;
    const tasksCompleted = data?.tasksCompleted ?? data?.stats?.tasksCompleted ?? 0;

    const statsData = [
        { title: 'Total Users', value: totalUsers, icon: Users, growth: data?.growth?.totalUsers ?? null, iconColor: 'blue' },
        { title: 'Daily Active Users', value: dailyActive, icon: UserCheck, growth: data?.growth?.dailyActive ?? null, iconColor: 'cyan' },
        { title: 'Notes Created (7d)', value: notesCreated, icon: BookOpen, growth: data?.growth?.notesCreated ?? null, iconColor: 'teal' },
        { title: 'Tasks Completed (7d)', value: tasksCompleted, icon: CheckCircle2, growth: data?.growth?.tasksCompleted ?? null, iconColor: 'green' },
    ];

    const dauData = data?.dailyActiveUsers ?? data?.dailyUsers ?? [];
    const tasksOverview = data?.tasksOverview ?? { completed: tasksCompleted, pending: data?.tasksPending ?? 0 };
    const recentActivity = data?.recentActivity ?? data?.activities ?? [];
    const featureUsage = data?.featureUsage ?? data?.features ?? [];

    return (
        <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <DailyActiveUsersChart data={dauData} />
                </div>
                <div className="lg:col-span-1">
                    <TasksOverviewChart
                        completed={tasksOverview.completed}
                        pending={tasksOverview.pending}
                    />
                </div>
            </div>

            {/* Recent activity + Feature usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                    <RecentActivity activities={recentActivity} />
                </div>
                <div className="lg:col-span-2">
                    <FeatureUsage features={featureUsage} />
                </div>
            </div>
        </div>
    );
};

// ─── Main shell ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderTab = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardTab />;
            case 'users': return <UserManagement />;
            case 'moderation': return <ContentModeration />;
            case 'analytics': return <Analytics />;
            case 'announcements': return <Announcements />;
            default: return <DashboardTab />;
        }
    };

    return (
        <div className="min-h-screen bg-[#E8F4F8] dark:bg-[#1a1b1e] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 ml-13 pl-0 text-sm">
                        Manage and monitor EduOne platform
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto scrollbar-none">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap
                    border-b-2 transition-all duration-200 cursor-pointer flex-shrink-0
                    ${isActive
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/20'
                                            : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/30'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {renderTab()}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
