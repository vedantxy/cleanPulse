import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Search, 
    Filter, 
    Trash2, 
    Edit3,
    AlertCircle, 
    Clock, 
    CheckCircle2, 
    ArrowLeft,
    Loader2,
    ChevronDown,
    LayoutGrid,
    Activity,
    Leaf,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [statusFilter, setStatusFilter] = useState('All');
    const [urgencyFilter, setUrgencyFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/reports`, {
                headers: { 'x-auth-token': token },
                params: {
                    status: statusFilter,
                    urgency: urgencyFilter,
                    search: searchTerm,
                    page,
                    limit: 6
                }
            });
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
            setTotalReports(res.data.totalReports);
        } catch {
            console.error('Connection error. Could not load reports.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, urgencyFilter, searchTerm, page]);

    useEffect(() => {
        fetchReports();
    }, [statusFilter, urgencyFilter, page, fetchReports]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this report?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchReports();
        } catch {
            alert('Deletion failed.');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
            case 'In Progress': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
        }
    };

    const getWasteBadgeClass = (type) => {
        const base = 'nature-badge ';
        switch (type) {
            case 'Recyclable': return base + 'nature-badge-recyclable';
            case 'Compostable': return base + 'nature-badge-compostable';
            case 'Hazardous': return base + 'nature-badge-hazardous';
            case 'E-Waste': return base + 'nature-badge-ewaste';
            default: return base + 'nature-badge-general';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'High': return 'text-rose-500';
            case 'Medium': return 'text-amber-500';
            case 'Low': return 'text-emerald-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-main)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:border-[var(--accent-green)] transition-all text-[var(--text-muted)] hover:text-[var(--accent-green)] active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase flex items-center gap-4">
                            <Leaf className="text-[var(--accent-green)]" size={32} />
                            My Reports
                        </h1>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-[10px] mt-1 italic">
                            Total Reports: {totalReports}
                        </p>
                    </div>
                </div>
                
                <div className="px-6 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl flex items-center space-x-3">
                     <Sparkles size={18} className="text-[var(--accent-green)] animate-pulse" />
                     <span className="text-[var(--accent-green)] font-black text-[10px] tracking-widest uppercase">Verified User</span>
                </div>
            </div>

            {/* Tactical Grid Filters */}
            <div className="leaf-card mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-leaf)]/5 rounded-full blur-[80px]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchReports()}
                            className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="earth-input pl-14 pr-10 appearance-none font-bold tracking-widest text-[10px] uppercase cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
                    </div>

                    <div className="relative group">
                        <AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <select 
                            value={urgencyFilter}
                            onChange={(e) => setUrgencyFilter(e.target.value)}
                            className="earth-input pl-14 pr-10 appearance-none font-bold tracking-widest text-[10px] uppercase cursor-pointer"
                        >
                            <option value="All">All Priority</option>
                            <option value="High">Urgent</option>
                            <option value="Medium">Moderate</option>
                            <option value="Low">Low</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <p className="mt-6 text-[var(--accent-green)] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading reports...</p>
                </div>
            ) : reports.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reports.map((report) => (
                            <div key={report._id} className="leaf-card group relative overflow-hidden flex flex-col h-full hover:shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-leaf)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`Nature-Badge px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusBadgeClass(report.status)}`}>
                                        {report.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {report.status}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${urgencyFilter === 'High' ? 'animate-pulse' : ''} bg-current ${getUrgencyColor(report.urgency)}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${getUrgencyColor(report.urgency)}`}>{report.urgency}</span>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-xl font-black text-[var(--text-primary)] font-['Playfair+Display'] tracking-tight mb-2 uppercase group-hover:text-[var(--accent-green)] transition-colors">
                                        {report.location}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className={getWasteBadgeClass(report.garbageType)}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {report.garbageType}
                                        </div>
                                        <div className="nature-badge nature-badge-general">
                                            <LayoutGrid size={10} />
                                            Zone {report.zone}
                                        </div>
                                    </div>

                                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 italic mb-6">
                                        &quot;{report.description || 'No description provided.'}&quot;
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
                                    <div className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest italic">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {report.status === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => navigate(`/citizen/edit-report/${report._id}`)}
                                                    className="p-3 text-[var(--text-muted)] hover:text-[var(--accent-green)] bg-[var(--bg-secondary)]/50 hover:bg-white rounded-xl transition-all border border-[var(--border-color)] hover:border-[var(--accent-green)]/30 shadow-sm"
                                                    title="Edit Report"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(report._id)}
                                                    className="p-3 text-[var(--text-muted)] hover:text-rose-500 bg-[var(--bg-secondary)]/50 hover:bg-white rounded-xl transition-all border border-[var(--border-color)] hover:border-rose-500/30 shadow-sm"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                        {report.status !== 'Pending' && (
                                            <div className="px-4 py-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                        <span className="text-[var(--text-muted)] font-black text-[10px] tracking-[0.2em] uppercase">Page {page} of {totalPages}</span>
                        <div className="flex gap-4">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-8 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-black text-[var(--text-muted)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)]/40 disabled:opacity-20 transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-md"
                            >
                                Previous
                            </button>
                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="eco-button py-3 text-[10px] tracking-widest uppercase disabled:opacity-20"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-32 leaf-card border-dashed group">
                    <Activity size={64} className="text-[var(--text-muted)] mx-auto mb-8 opacity-40 group-hover:scale-110 group-hover:text-[var(--accent-green)] transition-all duration-700" />
                    <p className="text-[var(--text-primary)] font-black text-xl uppercase tracking-tighter">No reports found.</p>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs mt-3 italic">Submit a new report to see it here.</p>
                    <button 
                        onClick={() => navigate('/citizen/report')}
                        className="mt-8 eco-button"
                    >
                        New Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyReports;
