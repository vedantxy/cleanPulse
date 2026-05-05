import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, MinusCircle } from 'lucide-react';
import api from '../api/api';

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your CleanPulse Eco-Assistant. How can I help you save the planet today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { 
                messages: [...messages, userMessage] 
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'I am sorry, my solar panels are a bit clouded right now. Please try again later!' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] font-['Inter']">
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-full flex items-center justify-center text-white shadow-[0_10px_40px_rgba(45,106,79,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group relative"
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
                    <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-12 right-0 bg-white/90 dark:bg-black/80 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Eco Assistant
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="glass-card w-[400px] h-[600px] flex flex-col overflow-hidden animate-slide-up shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-white/30 backdrop-blur-2xl">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-[var(--accent-green)]/20 to-transparent flex items-center justify-between border-b border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[var(--accent-green)] rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--accent-green)] flex items-center gap-2">
                                    Eco-Assistant
                                    <Sparkles size={12} className="animate-pulse" />
                                </h3>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Powered by CleanPulse AI</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[var(--text-muted)]">
                                <MinusCircle size={20} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-500">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                                    }`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-indigo-500 text-white rounded-tr-none' 
                                        : 'bg-white/50 dark:bg-white/5 border border-white/20 text-[var(--text-primary)] rounded-tl-none font-medium'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center">
                                        <Bot size={16} />
                                    </div>
                                    <div className="p-4 rounded-2xl rounded-tl-none bg-white/50 dark:bg-white/5 border border-white/20">
                                        <Loader2 className="animate-spin text-[var(--accent-green)]" size={16} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-6 bg-gradient-to-t from-white/20 to-transparent">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about recycling..."
                                className="w-full bg-white/40 dark:bg-black/20 border border-white/30 rounded-2xl px-6 py-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]/50 transition-all placeholder:text-[var(--text-muted)] placeholder:text-[10px] placeholder:uppercase placeholder:font-black placeholder:tracking-widest"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 w-10 h-10 bg-[var(--accent-green)] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[8px] text-center mt-4 text-[var(--text-muted)] font-black uppercase tracking-widest opacity-50">Think before you throw • CleanPulse AI</p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatBot;
