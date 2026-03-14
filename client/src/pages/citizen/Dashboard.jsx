import { useAuth } from '../../context/AuthContext';
import { PlusCircle, FileText, CheckCircle, Clock, RefreshCcw, MapPin } from 'lucide-react';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const reports = [
        { id: 1, location: "MG Road", status: "Resolved", icon: <CheckCircle className="text-emerald-500" size={18} /> },
        { id: 2, location: "Station Area", status: "In Progress", icon: <RefreshCcw className="text-blue-500" size={18} /> },
        { id: 3, location: "Park Street", status: "Pending", icon: <Clock className="text-amber-500" size={18} /> }
    ];

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-10 flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
                    👋
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Hello, {user?.name || 'Rahul'}!
                    </h1>
                    <p className="text-slate-500 font-medium">Here's an overview of your reports.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Reports Overview Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 rounded-[2rem] shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <FileText className="text-emerald-600" />
                                <span>My Reports</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Total</span>
                                <span className="text-3xl font-bold text-slate-900">12</span>
                            </div>
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center">
                                <span className="text-emerald-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <CheckCircle size={14} /> <span>Resolved</span>
                                </span>
                                <span className="text-3xl font-bold text-emerald-700">8</span>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center">
                                <span className="text-amber-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <Clock size={14} /> <span>Pending</span>
                                </span>
                                <span className="text-3xl font-bold text-amber-700">3</span>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center">
                                <span className="text-blue-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <RefreshCcw size={14} /> <span>In Progress</span>
                                </span>
                                <span className="text-3xl font-bold text-blue-700">1</span>
                            </div>
                        </div>

                        <button className="mt-10 w-full btn-primary flex items-center justify-center space-x-2 group">
                            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Submit New Report</span>
                        </button>
                    </div>

                    {/* Recent Reports List */}
                    <div className="glass-card p-8 rounded-[2rem] shadow-xl overflow-hidden">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                             <MapPin className="text-emerald-600" />
                             <span>Recent Reports</span>
                        </h2>
                        
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                            <MapPin size={20} className="text-rose-500" />
                                        </div>
                                        <span className="font-bold text-slate-800 tracking-tight text-lg">{report.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50">
                                        {report.icon}
                                        <span className="font-semibold text-slate-600">{report.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Additional Info */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-600 text-white shadow-emerald-100 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">You're making a difference!</h3>
                            <p className="text-emerald-50 leading-relaxed font-light mb-6 text-lg">
                                Your efforts in reporting waste have contributed to a cleaner neighborhood. Keep it up!
                            </p>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                                <span className="text-emerald-100 text-sm font-medium">Achievement unlocked</span>
                                <p className="text-xl font-bold">🌱 Green Warrior</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
