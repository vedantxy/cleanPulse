import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { 
    Search, 
    Filter, 
    Trash2, 
    AlertCircle, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    ArrowLeft,
    Loader2,
    ChevronDown,
    LayoutGrid,
    Sparkles,
    Activity,
    Map as MapIcon,
    List
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const AdminReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'All';
    
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [urgencyFilter, setUrgencyFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [zoneFilter, setZoneFilter] = useState('');
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await api.get(`/reports`, {
                headers: { 'x-auth-token': token },
                params: {
                    status: statusFilter,
                    urgency: urgencyFilter,
                    zone: zoneFilter,
                    search: searchTerm,
                    page,
                    limit: 10
                }
            });
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
            setTotalReports(res.data.totalReports);
        } catch {
            console.error('Connection error. Could not retrieve reports.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, urgencyFilter, zoneFilter, searchTerm, page]);

    useEffect(() => {
        const status = new URLSearchParams(location.search).get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [location.search]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this report permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchReports();
        } catch {
            alert('Delete failed.');
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Nature Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:bg-[var(--accent-green)]/10 hover:border-[var(--accent-green)]/30 transition-all text-[var(--text-muted)] hover:text-[var(--accent-green)] active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter font-['Playfair+Display'] uppercase flex items-center gap-4">
                            <LayoutGrid className="text-[var(--accent-green)]" size={32} />
                            All Reports
                        </h1>
                        <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] mt-1 italic">
                            Managing {totalReports} Waste Reports
                        </p>
                    </div>
                </div>
                
                <div className="px-6 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl flex items-center space-x-3 shadow-xl">
                     <Sparkles size={18} className="text-[var(--accent-green)] animate-pulse" />
                     <span className="text-[var(--accent-green)] font-black text-[10px] tracking-widest uppercase">Admin Access Active</span>
                </div>
            </div>

            {/* Report Filters */}
            <div className="leaf-card p-10 rounded-[3.5rem] bg-[var(--bg-card)] border-[var(--border-color)] shadow-xl mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-green)]/5 rounded-full blur-[80px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search Location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchReports()}
                            className="earth-input pl-14 font-black tracking-widest text-[11px]"
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="earth-input pl-14 pr-10 appearance-none font-black tracking-widest text-[10px] uppercase cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
                    </div>

                    <div className="relative group">
                        <AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <select 
                            value={urgencyFilter}
                            onChange={(e) => setUrgencyFilter(e.target.value)}
                            className="earth-input pl-14 pr-10 appearance-none font-black tracking-widest text-[10px] uppercase cursor-pointer"
                        >
                            <option value="All">All Priority</option>
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
                    </div>

                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Zone Filter..."
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="earth-input pl-14 font-black tracking-widest text-[11px]"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-[var(--accent-green)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                        <List size={14} /> List View
                    </button>
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-[var(--accent-green)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                        <MapIcon size={14} /> Map View
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <p className="mt-6 text-[var(--accent-green)] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading Reports...</p>
                </div>
            ) : reports.length > 0 ? (
                <div className="leaf-card rounded-[3.5rem] border-[var(--border-color)] shadow-xl overflow-hidden relative">
                    {viewMode === 'list' ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                                            <th className="px-10 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Location</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Sector</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Priority</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Status</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                                        {reports.map((report) => (
                                            <tr key={report._id} className="hover:bg-[var(--accent-green)]/5 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-rose-500 border border-[var(--border-color)] group-hover:scale-110 transition-transform">
                                                            <MapPin size={24} className="animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <span className="font-black text-[var(--text-primary)] block text-sm tracking-tight uppercase group-hover:text-[var(--accent-green)] transition-colors">{report.location}</span>
                                                            <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-1 block">{report.garbageType}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="px-4 py-2 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 rounded-xl font-black text-[10px] uppercase tracking-widest">Sector {report.zone}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] ${
                                                            report.urgency === 'High' ? 'text-rose-500 bg-rose-500' : report.urgency === 'Medium' ? 'text-amber-500 bg-amber-500' : 'text-[var(--accent-leaf)] bg-[var(--accent-leaf)]'
                                                        }`} />
                                                        <span className="font-black text-[var(--text-muted)] text-[10px] uppercase tracking-widest">{report.urgency}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                                                        report.status === 'Resolved' ? 'bg-[var(--accent-leaf)]/10 text-[var(--accent-leaf)] border-[var(--accent-leaf)]/20' :
                                                        report.status === 'In Progress' ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/20' :
                                                        'bg-[var(--accent-earth)]/10 text-[var(--accent-earth)] border-[var(--accent-earth)]/20'
                                                    }`}>
                                                        {report.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                        {report.status}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <select 
                                                            value={report.status}
                                                            onChange={async (e) => {
                                                                const newStatus = e.target.value;
                                                                const token = localStorage.getItem('token');
                                                                try {
                                                                    await api.put(`/reports/${report._id}/status`, { status: newStatus }, {
                                                                        headers: { 'x-auth-token': token }
                                                                    });
                                                                    fetchReports();
                                                                } catch {
                                                                    alert('Update failed.');
                                                                }
                                                            }}
                                                            className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[10px] font-black text-[var(--text-muted)] focus:ring-4 focus:ring-[var(--accent-green)]/10 outline-none transition-all uppercase cursor-pointer"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Resolved">Resolved</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        <button 
                                                            onClick={() => handleDelete(report._id)}
                                                            className="p-3 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20 active:scale-95"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-10 py-8 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-6">
                                <span className="text-[var(--text-muted)] font-black text-[10px] tracking-[0.2em] uppercase">Page {page} of {totalPages}</span>
                                <div className="flex gap-4">
                                    <button 
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="px-8 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-green)]/40 disabled:opacity-20 transition-all text-[10px] uppercase tracking-widest active:scale-95"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-8 py-3 eco-button text-white rounded-xl font-black shadow-xl disabled:opacity-20 transition-all text-[10px] uppercase tracking-widest active:scale-95"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-[600px] w-full">
                            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {reports.filter(r => r.latitude !== null && r.latitude !== undefined && r.longitude !== null && r.longitude !== undefined).map(report => (
                                    <Marker key={report._id} position={[report.latitude, report.longitude]}>
                                        <Popup>
                                            <div className="p-2 space-y-2">
                                                <h3 className="font-black uppercase text-xs text-[var(--accent-green)]">{report.garbageType} WASTE</h3>
                                                <p className="text-[10px] font-bold uppercase">{report.location}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${report.urgency === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                    <span className="text-[9px] font-black uppercase">{report.urgency} PRIORITY</span>
                                                </div>
                                                <button 
                                                    onClick={() => navigate(`/admin/reports/${report._id}`)}
                                                    className="w-full py-1.5 bg-[var(--accent-green)] text-white text-[9px] font-black uppercase rounded-lg mt-2"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-32 leaf-card border-dashed border-[var(--border-color)] rounded-[4rem] group">
                    <Activity size={64} className="text-[var(--text-muted)] mx-auto mb-8 opacity-40 group-hover:scale-110 group-hover:text-[var(--accent-green)] transition-all duration-700" />
                    <p className="text-[var(--text-primary)] font-black text-xl uppercase tracking-tighter">No reports matched your search.</p>
                    <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-xs mt-3">Try resetting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
