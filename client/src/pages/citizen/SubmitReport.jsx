import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    AlertCircle,
    Camera, 
    MapPin, 
    Send, 
    Info, 
    CheckCircle2,
    FileText,
    ArrowLeft,
    Leaf,
    Recycle,
    AlertTriangle,
    Zap
} from 'lucide-react';
import api from '../../api/api';
import LocationPicker from '../../components/LocationPicker';

const SubmitReport = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        garbageType: 'General',
        location: '',
        zone: '',
        description: '',
        urgency: 'Medium',
        photo: null,
        latitude: null,
        longitude: null
    });
    
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const wasteCategories = [
        { value: 'General', label: 'General Waste', icon: <FileText size={16} /> },
        { value: 'Recyclable', label: 'Recyclable', icon: <Recycle size={16} /> },
        { value: 'Compostable', label: 'Compostable', icon: <Leaf size={16} /> },
        { value: 'Hazardous', label: 'Hazardous', icon: <AlertTriangle size={16} /> },
        { value: 'E-Waste', label: 'E-Waste', icon: <Zap size={16} /> },
    ];

    useEffect(() => {
        if (isEdit && id) {
            fetchReportData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, id]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            const { garbageType, location, zone, description, photo, urgency, latitude, longitude } = res.data;
            setFormData({ garbageType, location, zone, description, urgency, photo: null, latitude, longitude });
            if (photo) setPreview(photo);
        } catch (err) {
            setError('Connection error. Failed to fetch report data.');
            console.error(err);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.location || !formData.zone || !formData.latitude || !formData.longitude) {
            setError('Please complete all required fields. Make sure to click on the map to pin the exact garbage location.');
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const dataToSend = { 
                ...formData, 
                photo: preview,
                latitude: formData.latitude,
                longitude: formData.longitude
            };

            if (isEdit) {
                await api.put(`/reports/${id}`, dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await api.post('/reports', dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            }

            setSuccess(true);
            setTimeout(() => navigate('/citizen/my-reports'), 2000);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Submission failed. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-[var(--text-primary)]">
            <div className="max-w-3xl mx-auto animate-slide-up relative z-10">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-all mb-8 group text-[11px] font-black tracking-widest uppercase"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="leaf-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-leaf)]/5 rounded-full blur-[80px]" />
                    
                    <div className="mb-12 flex items-center justify-between border-b border-[var(--border-color)] pb-8">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter font-['Playfair+Display'] uppercase text-[var(--text-primary)]">
                                {isEdit ? 'Edit Report Data' : 'New Waste Report'}
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2 font-bold text-xs uppercase tracking-widest italic">
                                {isEdit ? 'Updating your report' : 'Creating a new report'}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-3xl flex items-center justify-center border border-[var(--accent-green)]/20">
                            <Leaf size={32} />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-4 text-rose-600 dark:text-rose-400">
                            <AlertCircle size={24} />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-4 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={24} />
                            <p className="font-black text-xs uppercase tracking-widest">
                                {isEdit ? 'Report Updated' : 'Report Submitted'}! Syncing...
                            </p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Waste Category */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)] ml-1">Waste Classification</label>
                                <select 
                                    name="garbageType"
                                    value={formData.garbageType}
                                    onChange={onChange}
                                    className="earth-input font-bold uppercase tracking-widest text-[11px]"
                                >
                                    {wasteCategories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Zone */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)] ml-1">Local Zone</label>
                                <select 
                                    name="zone"
                                    required
                                    value={formData.zone}
                                    onChange={onChange}
                                    className="earth-input font-bold uppercase tracking-widest text-[11px]"
                                >
                                    <option value="">Select Zone</option>
                                    <option value="Alpha">Alpha Region</option>
                                    <option value="Beta">Beta Region</option>
                                    <option value="Gamma">Gamma Region</option>
                                    <option value="Delta">Delta Region</option>
                                    <option value="Epsilon">Epsilon Region</option>
                                </select>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1 mb-2 block">Specific Location / Street</label>
                                <div className="relative">
                                    <MapPin className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="location"
                                        type="text"
                                        required
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="Ex: Main Street, Near Park"
                                        value={formData.location}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            {/* Map Picker */}
                            <LocationPicker 
                                onLocationSelect={(coords) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        latitude: coords.lat,
                                        longitude: coords.lng
                                    }));
                                }}
                                initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)] ml-1">Report Description</label>
                            <div className="relative group">
                                <FileText size={18} className="absolute left-5 top-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                <textarea 
                                    name="description"
                                    rows="4"
                                    placeholder="Briefly describe the waste issue..."
                                    value={formData.description}
                                    onChange={onChange}
                                    className="earth-input pl-14 w-full resize-none pt-5 font-medium tracking-tight"
                                />
                            </div>
                        </div>

                        {/* Urgency Rating */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)] ml-1 block">Urgency Level</label>
                            <div className="flex flex-wrap gap-4">
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({...formData, urgency: level})}
                                        className={`px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 text-[10px] tracking-widest uppercase ${
                                            formData.urgency === level 
                                                ? level === 'Low' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                                : level === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/30 animate-pulse'
                                                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/30'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Visual Evidence */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)] ml-1 block">Photo Evidence</label>
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <label className="w-full md:w-80 h-48 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] cursor-pointer hover:border-[var(--accent-green)]/50 hover:bg-[var(--bg-secondary)] transition-all group overflow-hidden relative">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={onFileChange}
                                        className="hidden" 
                                    />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <>
                                            <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl mb-3 border border-[var(--border-color)] group-hover:bg-[var(--accent-green)]/10 transition-colors">
                                                <Camera className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[var(--accent-green)] transition-colors" />
                                            </div>
                                            <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[var(--accent-green)] transition-colors text-center px-6 italic">Upload Photo</span>
                                        </>
                                    )}
                                </label>
                                <div className="flex-1 bg-[var(--bg-secondary)] p-8 rounded-[2.5rem] border border-[var(--border-color)] relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <p className="flex items-center gap-3 mb-4 text-[var(--accent-green)] text-xs font-black uppercase tracking-widest">
                                            <Info size={16} />
                                            <span>Environmental Tip</span>
                                        </p>
                                        <p className="text-[var(--text-muted)] text-sm font-medium leading-relaxed italic">
                                            &quot;A single photo can communicate more than a thousand coordinates. Help us protect our home.&quot;
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--accent-green)]/5 rounded-full blur-2xl transition-all group-hover:scale-125" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-10">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="eco-button w-full py-6 flex items-center justify-center gap-4 text-sm tracking-[0.2em] font-black uppercase"
                                >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>
                                            {isEdit ? 'Update Report' : 'Submit Report'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
