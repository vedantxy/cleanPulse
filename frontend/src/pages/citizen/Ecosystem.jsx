import { useState } from 'react';
import { 
    Cpu, QrCode, Navigation, Smartphone, 
    Zap, LineChart, Target, Shield, 
    Settings, Sun, Flame, Recycle, 
    LayoutDashboard, Database, Gift, Bell,
    ArrowDown, Info, X, Layers, GitBranch,
    FileText, MessageCircle, ClipboardCheck
} from 'lucide-react';

const Ecosystem = () => {
    const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' or 'workflow'
    const [selectedTopic, setSelectedTopic] = useState(null);

    const architectureLayers = [
        {
            title: "IoT & Data Source Layer",
            color: "emerald",
            items: [
                { id: "iot", name: "IoT Sensors", icon: <Cpu size={24} />, desc: "Real-time fill level detection, odor monitoring, and weight sensors installed in smart bins.", details: "Our IoT suite uses ultrasonic sensors for fill levels and MQ-series gas sensors for odor detection. Data is transmitted via LoRaWAN." },
                { id: "rfid", name: "RFID / QR Track", icon: <QrCode size={24} />, desc: "Bin identity tagging and citizen linkage for automated tracking and credit assignment.", details: "Every household bin is tagged with a unique QR code for automated reward processing." },
                { id: "gps", name: "GPS Fleet Track", icon: <Navigation size={24} />, desc: "Real-time truck location tracking and dynamic route adjustment for pickup fleets.", details: "Trucks are equipped with GPS trackers that feed into our dynamic dispatch system." },
                { id: "mobile_arch", name: "Citizen Mobile App", icon: <Smartphone size={24} />, desc: "App for complaint submission, photo uploads, and pickup scheduling.", details: "The bridge between citizens and the city, featuring geo-tagged reporting and impact tracking." }
            ]
        },
        {
            title: "AI & Processing Layer",
            color: "indigo",
            items: [
                { id: "route", name: "Route Optimizer", icon: <Zap size={24} />, desc: "ML-based shortest path calculation + fill priority scheduling.", details: "Uses Ant Colony Optimization algorithms to determine the most fuel-efficient routes." },
                { id: "predictive", name: "Predictive Analytics", icon: <LineChart size={24} />, desc: "Waste generation forecasting per zone based on seasonal and demographic patterns.", details: "AI predicts capacity issues before they happen based on historical data." },
                { id: "classifier", name: "Image AI Classifier", icon: <Target size={24} />, desc: "Auto waste type detection: dry/wet/hazardous/e-waste using computer vision.", details: "Integrated with Gemini Vision API for automatic categorization from photos." },
                { id: "anomaly", name: "Anomaly Detection", icon: <Shield size={24} />, desc: "Illegal dumping alerts and bin overflow detection via surveillance.", details: "Triggers immediate alerts for irregular patterns or unauthorized disposal." }
            ]
        },
        {
            title: "Smart Infrastructure Layer",
            color: "orange",
            items: [
                { id: "robotic", name: "Robotic Sorting", icon: <Settings size={24} />, desc: "Conveyor + robot arm auto-segregation at central sorting facilities.", details: "Robotic arms separate materials with 98% accuracy in recovery facilities." },
                { id: "solar", name: "Solar Compactors", icon: <Sun size={24} />, desc: "Solar-powered bins that compact waste to provide 5x more capacity.", details: "Mechanical press powered by solar energy for high-traffic zones." },
                { id: "biogas", name: "Biogas Unit", icon: <Flame size={24} />, desc: "Conversion of organic waste into methane for energy generation.", details: "Organic waste is processed in anaerobic digesters to produce energy." },
                { id: "mrf", name: "MRF / Recycling", icon: <Recycle size={24} />, desc: "Material Recovery Facilities for processing recyclables into raw materials.", details: "The final stage where materials are shredded and sold to manufacturers." }
            ]
        },
        {
            title: "Governance & Dashboard Layer",
            color: "amber",
            items: [
                { id: "govt", name: "Govt. Dashboard", icon: <LayoutDashboard size={24} />, desc: "Live KPIs, zone maps, and compliance tracking for city administrators.", details: "Central hub for city officials to monitor performance and cleanliness." },
                { id: "carbon", name: "Carbon Credits", icon: <Database size={24} />, desc: "Emission reduction tracking on a secure blockchain ledger.", details: "Calculates CO2 equivalent saved and records verified credits for trading." },
                { id: "rewards_arch", name: "Citizen Rewards", icon: <Gift size={24} />, desc: "Gamified reward system with points for positive environmental impact.", details: "Incentivizes citizens via XP, levels, and a digital rewards store." },
                { id: "alerts_arch", name: "Auto Alerts", icon: <Bell size={24} />, desc: "Automatic fine notices and cleanup alerts via SMS/Email.", details: "Automated warnings for segregation non-compliance and route changes." }
            ]
        }
    ];

    const workflowLayers = [
        {
            title: "Citizen Features",
            color: "emerald",
            type: "input",
            items: [
                { id: "citizen_app", name: "Citizen Mobile App", icon: <Smartphone size={24} />, desc: "Complaint photo upload & pickup schedule view.", details: "Citizens take photos of waste, which are then geo-tagged and uploaded for management." },
                { id: "qr_track", name: "QR Code Bin Tracking", icon: <QrCode size={24} />, desc: "Scan = Log collection & zone-wise history tracking.", details: "Collectors scan household QR codes to log every successful collection event." },
                { id: "segregation", name: "Segregation Guide", icon: <ClipboardCheck size={24} />, desc: "Dry / wet / e-waste color-coded bin instructions.", details: "In-app educational modules that teach users how to properly sort waste at the source." }
            ]
        },
        {
            title: "Backend / Portal",
            color: "indigo",
            type: "hub",
            items: [
                { 
                    id: "portal", 
                    name: "Central Management Portal", 
                    icon: <LayoutDashboard size={28} />, 
                    desc: "Complaints, schedules, collector routes, zone reports — ek hi jagah.", 
                    details: "The 'Brain' of CleanPulse. It aggregates data from citizens and IoT sensors to manage the entire city's operations from a single dashboard.",
                    isLarge: true
                }
            ]
        },
        {
            title: "Operations",
            color: "rose",
            type: "output",
            items: [
                { id: "route_sched", name: "Route Scheduling", icon: <Navigation size={24} />, desc: "Area-wise daily routes & collector assignment.", details: "Algorithmic route generation pushed directly to collector mobile apps for optimal pickups." },
                { id: "reports_analytics", name: "Reports & Analytics", icon: <FileText size={24} />, desc: "Monthly zone summary & complaint resolution %.", details: "Deep data analysis that helps city planners identify hotspots and improve efficiency." },
                { id: "alerts", name: "SMS / WhatsApp Alerts", icon: <MessageCircle size={24} />, desc: "Pickup day reminders & complaint status updates.", details: "Automated communication channel that keeps citizens informed about their environmental impact." }
            ]
        }
    ];

    return (
        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen font-['Inter'] relative transition-colors duration-500">
            {/* Page Header */}
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-5xl font-black tracking-tighter uppercase font-['Playfair_Display'] text-[var(--text-primary)] leading-tight">
                    CleanPulse <span className="text-[var(--accent-green)]">Ecosystem</span>
                </h1>
                <p className="text-[var(--text-muted)] mt-5 font-black uppercase tracking-[0.3em] text-[10px] max-w-md mx-auto leading-relaxed">
                    Visualizing the technology and operations behind <br />
                    the smart city waste revolution.
                </p>
            </div>

            {/* Tab Toggles */}
            <div className="flex justify-center mb-16 px-4">
                <div className="bg-white/5 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white/10 flex items-center shadow-2xl">
                    <button 
                        onClick={() => setActiveTab('architecture')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.7rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                            activeTab === 'architecture' 
                            ? 'bg-[var(--accent-green)] text-white shadow-lg' 
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        }`}
                    >
                        <Layers size={16} />
                        Architecture
                    </button>
                    <button 
                        onClick={() => setActiveTab('workflow')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.7rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                            activeTab === 'workflow' 
                            ? 'bg-[var(--accent-green)] text-white shadow-lg' 
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        }`}
                    >
                        <GitBranch size={16} />
                        Workflow
                    </button>
                </div>
            </div>

            {/* Content Layers */}
            <div className="animate-fade-in" key={activeTab}>
                {activeTab === 'architecture' ? (
                    <div className="space-y-12">
                        {architectureLayers.map((layer, lIdx) => (
                            <div key={lIdx} className="space-y-6">
                                <div className={`p-4 rounded-3xl bg-${layer.color}-500/10 border border-${layer.color}-500/20 text-center relative overflow-hidden group`}>
                                    <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] text-${layer.color}-600 dark:text-${layer.color}-400 relative z-10`}>
                                        {layer.title}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {layer.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedTopic(item)}
                                            className="glass-card p-8 text-left group hover:scale-[1.03] transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className={`w-12 h-12 bg-${layer.color}-500/10 rounded-2xl flex items-center justify-center text-${layer.color}-600 dark:text-${layer.color}-400 mb-6 group-hover:rotate-6 transition-transform`}>
                                                {item.icon}
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] mb-3">{item.name}</h3>
                                            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                                        </button>
                                    ))}
                                </div>
                                {lIdx < architectureLayers.length - 1 && (
                                    <div className="flex justify-center py-4">
                                        <ArrowDown className="text-[var(--border-color)] animate-bounce-slow opacity-30" size={32} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-12 max-w-5xl mx-auto">
                        {workflowLayers.map((layer, lIdx) => (
                            <div key={lIdx} className="space-y-6">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] text-${layer.color}-500 text-center`}>{layer.title}</h3>
                                
                                <div className={`flex flex-wrap justify-center gap-8 ${layer.type === 'hub' ? 'py-4' : ''}`}>
                                    {layer.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedTopic(item)}
                                            className={`glass-card p-10 text-center group hover:scale-[1.05] transition-all duration-300 border-${layer.color}-500/20 hover:border-${layer.color}-500/50 shadow-xl ${
                                                item.isLarge ? 'w-full max-w-2xl' : 'w-full sm:w-[280px]'
                                            }`}
                                        >
                                            <div className={`mx-auto w-16 h-16 bg-${layer.color}-500/10 rounded-[2rem] flex items-center justify-center text-${layer.color}-600 dark:text-${layer.color}-400 mb-8 group-hover:scale-110 transition-transform`}>
                                                {item.icon}
                                            </div>
                                            <h3 className={`${item.isLarge ? 'text-2xl' : 'text-sm'} font-black uppercase tracking-tighter text-[var(--text-primary)] mb-4 font-['Playfair_Display']`}>
                                                {item.name}
                                            </h3>
                                            <p className={`text-[var(--text-muted)] leading-relaxed ${item.isLarge ? 'text-lg max-w-lg mx-auto' : 'text-[11px]'}`}>
                                                {item.desc}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                {lIdx < workflowLayers.length - 1 && (
                                    <div className="flex flex-col items-center gap-2 opacity-30 animate-pulse">
                                        <ArrowDown className={`text-${layer.color}-500`} size={48} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Data Flow</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Legend */}
                        <div className="flex justify-center gap-8 pt-12">
                            {[
                                { name: 'Citizen features', color: 'emerald' },
                                { name: 'Backend / portal', color: 'indigo' },
                                { name: 'Operations', color: 'rose' }
                            ].map(l => (
                                <div key={l.name} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full bg-${l.color}-500 shadow-lg shadow-${l.color}-500/50`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{l.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Topic Modal Overlay - Refined Premium UI */}
            {selectedTopic && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
                        onClick={() => setSelectedTopic(null)} 
                    />
                    
                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-5xl bg-[#0a0a0a]/40 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row animate-scale-in">
                        
                        {/* Dynamic Background Glow */}
                        <div className={`absolute -top-24 -left-24 w-96 h-96 blur-[120px] opacity-20 pointer-events-none transition-colors duration-500 ${
                            selectedTopic.id === 'portal' || architectureLayers[1].items.some(i => i.id === selectedTopic.id) ? 'bg-indigo-500' :
                            workflowLayers[2].items.some(i => i.id === selectedTopic.id) || architectureLayers[2].items.some(i => i.id === selectedTopic.id) ? 'bg-rose-500' :
                            'bg-emerald-500'
                        }`} />

                        {/* Left Panel - Visual Impact & Summary */}
                        <div className="w-full lg:w-2/5 p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 transition-all duration-500 shadow-2xl ${
                                    selectedTopic.id === 'portal' || architectureLayers[1].items.some(i => i.id === selectedTopic.id) ? 'bg-indigo-500/20 text-indigo-400' :
                                    workflowLayers[2].items.some(i => i.id === selectedTopic.id) || architectureLayers[2].items.some(i => i.id === selectedTopic.id) ? 'bg-rose-500/20 text-rose-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                                } group-hover:scale-110 group-hover:rotate-3`}>
                                    {selectedTopic.icon}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                            selectedTopic.id === 'portal' || architectureLayers[1].items.some(i => i.id === selectedTopic.id) ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                                            workflowLayers[2].items.some(i => i.id === selectedTopic.id) || architectureLayers[2].items.some(i => i.id === selectedTopic.id) ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                            'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                        }`} />
                                        System Node
                                    </h4>
                                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-[var(--text-primary)] font-['Playfair_Display'] leading-[0.9] lg:leading-[1]">
                                        {selectedTopic.name}
                                    </h2>
                                </div>

                                <p className="mt-8 text-lg sm:text-xl text-[var(--text-primary)]/80 font-medium italic leading-relaxed">
                                    "{selectedTopic.desc}"
                                </p>
                            </div>

                            <div className="mt-12 lg:mt-0 relative z-10 border-t border-white/10 pt-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                    CleanPulse Intelligence Unit
                                </p>
                            </div>
                        </div>

                        {/* Right Panel - Technical Breakdown */}
                        <div className="w-full lg:w-3/5 p-12 lg:p-16 bg-white/[0.02] relative">
                            <button 
                                onClick={() => setSelectedTopic(null)} 
                                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-rose-500 transition-all z-20"
                            >
                                <X size={24} />
                            </button>

                            <div className="max-w-xl mx-auto space-y-12">
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-8 flex items-center gap-3">
                                        <Layers size={14} /> Process Specification
                                    </h5>
                                    
                                    <div className="space-y-6">
                                        {selectedTopic.details.split('. ').map((step, idx) => (
                                            <div key={idx} className="flex gap-6 group/step">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${
                                                        selectedTopic.id === 'portal' || architectureLayers[1].items.some(i => i.id === selectedTopic.id) ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/5 group-hover/step:bg-indigo-500 group-hover/step:text-white' :
                                                        workflowLayers[2].items.some(i => i.id === selectedTopic.id) || architectureLayers[2].items.some(i => i.id === selectedTopic.id) ? 'border-rose-500/50 text-rose-400 bg-rose-500/5 group-hover/step:bg-rose-500 group-hover/step:text-white' :
                                                        'border-emerald-500/50 text-emerald-400 bg-emerald-500/5 group-hover/step:bg-emerald-500 group-hover/step:text-white'
                                                    }`}>
                                                        0{idx + 1}
                                                    </div>
                                                    {idx < selectedTopic.details.split('. ').length - 1 && (
                                                        <div className="w-[1px] h-full bg-white/10 my-2" />
                                                    )}
                                                </div>
                                                <p className="text-base text-[var(--text-primary)] leading-relaxed pt-1 group-hover/step:translate-x-1 transition-transform">
                                                    {step}{!step.endsWith('.') && step.length > 0 ? '.' : ''}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-12">
                                    <button 
                                        onClick={() => setSelectedTopic(null)}
                                        className={`w-full py-6 rounded-3xl text-xs font-black uppercase tracking-[0.4em] transition-all duration-300 shadow-2xl relative overflow-hidden group/btn ${
                                            selectedTopic.id === 'portal' || architectureLayers[1].items.some(i => i.id === selectedTopic.id) ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' :
                                            workflowLayers[2].items.some(i => i.id === selectedTopic.id) || architectureLayers[2].items.some(i => i.id === selectedTopic.id) ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' :
                                            'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                        } text-white`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                        Understood Integration
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ecosystem;

