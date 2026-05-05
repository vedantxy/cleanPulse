import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { 
    Truck, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Search, 
    Loader2,
    ArrowLeft,
    Play,
    Check,
    Sparkles,
    ShieldCheck,
    Zap,
    Map as MapIcon,
    List
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

const CollectorPickups = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'All';
    const [filter, setFilter] = useState(initialStatus);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    
    const fetchPickups = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await api.get(`/reports?zone=${user.zone}&status=${filter}`, {
                headers: { 'x-auth-token': token }
            });
            setReports(res.data.reports);
        } catch {
            setError('Connection error. Could not retrieve tasks.');
        } finally {
            setLoading(false);
        }
    }, [filter, user?.zone]);

    useEffect(() => {
        const status = new URLSearchParams(location.search).get('status');
        if (status) {
            setFilter(status);
        }
    }, [location.search]);

    useEffect(() => {
        if (user?.zone) {
            fetchPickups();
        }
    }, [fetchPickups, user?.zone]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/reports/${id}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchPickups();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const filteredReports = reports.filter(report => 
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.landmark?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Task Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/collector')}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:bg-[var(--accent-green)]/10 hover:border-[var(--accent-green)]/30 transition-all text-[var(--text-muted)] hover:text-[var(--accent-green)] active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter font-['Playfair+Display'] uppercase flex items-center gap-4">
                            <Truck className="text-[var(--accent-green)]" size={32} />
                            Task Manager
                        </h1>
                        <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] mt-1 italic">
                            Manage and complete your assigned pickups. &quot;Your hard work keeps the world green.&quot;
                        </p>
                    </div>
                </div>
                
                <div className="px-6 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl flex items-center space-x-3 shadow-xl">
                     <ShieldCheck size={18} className="text-[var(--accent-green)] animate-pulse" />
                     <span className="text-[var(--accent-green)] font-black text-[10px] tracking-widest uppercase">Zone: {user.zone}</span>
                </div>
            </div>

            {/* Task Filters */}
            <div className="mb-12 flex flex-col lg:flex-row items-center gap-8">
                <div className="relative group w-full lg:flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by landmark or region..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="earth-input pl-14 font-black tracking-widest text-[11px]"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 bg-[var(--bg-secondary)] p-2 rounded-[1.5rem] border border-[var(--border-color)] shadow-xl">
                    {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${
                                filter === status 
                                ? 'bg-[var(--accent-green)] text-white shadow-lg' 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-12 flex justify-center gap-4">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-[var(--accent-green)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'}`}
                >
                    <List size={14} /> List View
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-[var(--accent-green)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'}`}
                >
                    <MapIcon size={14} /> Map View
                </button>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <p className="mt-6 text-[var(--accent-green)] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading Tasks...</p>
                </div>
            ) : error ? (
                <div className="leaf-card border-rose-500/20 p-12 rounded-[3.5rem] text-center space-y-6 animate-shake">
                    <AlertCircle size={64} className="text-rose-500 mx-auto" />
                    <p className="text-rose-400 font-black tracking-widest uppercase text-sm">{error}</p>
                    <button onClick={fetchPickups} className="eco-button px-10 py-4 text-[10px] tracking-widest uppercase rounded-2xl">Try Again</button>
                </div>
            ) : filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {viewMode === 'list' ? (
                        filteredReports.map((report) => (
                            <div key={report._id} className="leaf-card p-10 rounded-[3.5rem] border-[var(--border-color)] shadow-xl group hover:border-[var(--accent-green)]/30 transition-all duration-700 relative overflow-hidden">
                                {/* Priority Level */}
                                <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl relative z-10 ${
                                    report.urgency === 'High' ? 'bg-rose-500' : report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-[var(--accent-leaf)]'
                                }`}>
                                    <Sparkles size={12} className="inline-block mr-2 animate-pulse" />
                                    {report.urgency} PRIORITY
                                </div>

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-[1.5rem] flex items-center justify-center border border-[var(--border-color)] group-hover:scale-110 group-hover:bg-[var(--accent-green)]/10 transition-all duration-500 shadow-inner">
                                                <MapPin className="text-rose-500 animate-pulse" size={30} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-2 font-['Playfair+Display'] uppercase group-hover:text-[var(--accent-green)] transition-colors">{report.location}</h3>
                                                <p className="text-[var(--text-muted)] font-black flex items-center gap-3 uppercase tracking-widest text-[10px] italic">
                                                    <Zap size={14} className="text-amber-500" />
                                                    Landmark: {report.landmark}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-3 px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-muted)] group-hover:bg-[var(--bg-card)] transition-colors">
                                                <Clock size={14} />
                                                <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-5 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl text-[var(--accent-green)]">
                                                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                                                <span>Waste Type: {report.garbageType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        {report.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(report._id, 'In Progress')}
                                                className="w-full sm:w-auto flex items-center justify-center gap-4 eco-button text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] transform active:scale-95 transition-all shadow-xl uppercase shadow-[var(--accent-green)]/20"
                                            >
                                                <Play size={18} />
                                                <span>Start Pickup</span>
                                            </button>
                                        )}
                                        {report.status === 'In Progress' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[var(--accent-earth)] text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] transform hover:bg-[var(--accent-earth)]/90 active:scale-95 transition-all shadow-xl uppercase shadow-[var(--accent-earth)]/20"
                                            >
                                                <Check size={18} />
                                                <span>Complete</span>
                                            </button>
                                        )}
                                        {report.status === 'Resolved' && (
                                            <div className="flex items-center gap-4 px-10 py-5 bg-[var(--accent-leaf)]/10 text-[var(--accent-leaf)] rounded-3xl border border-[var(--accent-leaf)]/20 font-black text-[10px] tracking-[0.3em] uppercase">
                                                <CheckCircle2 size={24} />
                                                <span>DONE</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--accent-green)]/5 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                            </div>
                        ))
                    ) : (
                        <div className="h-[600px] w-full leaf-card rounded-[3.5rem] overflow-hidden border-[var(--border-color)]">
                            <MapContainer center={[20.5937, 78.9629]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {filteredReports.filter(r => r.latitude !== null && r.latitude !== undefined && r.longitude !== null && r.longitude !== undefined).map(report => (
                                    <Marker key={report._id} position={[report.latitude, report.longitude]}>
                                        <Popup>
                                            <div className="p-3 space-y-3 min-w-[200px]">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-black uppercase text-xs text-[var(--accent-green)]">{report.garbageType}</h3>
                                                    <span className={`px-2 py-1 rounded-md text-[8px] font-black text-white ${report.urgency === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}>{report.urgency}</span>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase text-[var(--text-primary)]">{report.location}</p>
                                                
                                                <div className="pt-2 border-t border-[var(--border-color)]">
                                                    {report.status === 'Pending' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(report._id, 'In Progress')}
                                                            className="w-full py-2 bg-[var(--accent-green)] text-white text-[9px] font-black uppercase rounded-lg shadow-lg"
                                                        >
                                                            Start Pickup
                                                        </button>
                                                    )}
                                                    {report.status === 'In Progress' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                                            className="w-full py-2 bg-[var(--accent-earth)] text-white text-[9px] font-black uppercase rounded-lg shadow-lg"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    {report.status === 'Resolved' && (
                                                        <div className="text-center py-2 text-[var(--accent-leaf)] font-black text-[9px] uppercase tracking-widest">
                                                            Task Completed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-32 leaf-card rounded-[4rem] border-dashed border-[var(--border-color)] group">
                    <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700 shadow-inner">
                        <ShieldCheck size={48} className="text-[var(--text-muted)] opacity-40 group-hover:text-[var(--accent-green)]/50 group-hover:opacity-100 transition-all" />
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text-primary)] font-['Playfair+Display'] tracking-tighter uppercase mb-4">All Clear!</h3>
                    <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[10px] italic">No {filter !== 'All' ? filter : ''} tasks found in your zone.</p>
                </div>
            )}
        </div>
    );
};

export default CollectorPickups;
