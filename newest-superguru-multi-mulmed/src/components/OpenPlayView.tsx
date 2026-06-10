import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Users, Calendar, ArrowLeft, Star,
  Plus, Search, Trash2, CheckCircle2,
  Filter, X, Clock, AlertCircle, HelpCircle, UserCheck, RefreshCw, MapPin, ChevronRight
} from 'lucide-react';

interface Participant {
  murid_id: number;
  murid_name: string;
  murid_avatar: string;
}

interface OpenPlaySession {
  id: number;
  guru_id: number;
  guru_name: string;
  guru_avatar: string;
  title: string;
  subject: string;
  description: string;
  session_date: string;
  cost: number;
  capacity: number;
  participant_count: number;
  participants: Participant[];
  created_at: string;
  lokasi?: string;
}

interface OpenPlayViewProps {
  user: {
    id: number;
    full_name: string;
    role: 'guru' | 'murid' | 'admin';
    avatar_url?: string;
  };
  onBackToHub: () => void;
  onUpdateUser: (updatedUser: any) => void;
}

const CITIES = ['Semua Kota', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang', 'Malang', 'Bali'];

export default function OpenPlayView({ user, onBackToHub, onUpdateUser }: OpenPlayViewProps) {
  const [sessions, setSessions] = useState<OpenPlaySession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date Helpers
  const getIndonesianDayShort = (dayIndex: number) => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[dayIndex];
  };

  // Generate 7 days starting from today dynamically
  const dateTabs = Array.from({ length: 7 }, (_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const dateKey = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    let label = '';
    if (index === 0) {
      label = 'Hari Ini';
    } else {
      const dayShort = getIndonesianDayShort(d.getDay());
      const dateNum = d.getDate();
      label = `${dayShort} ${dateNum}`;
    }
    
    return { dateKey, label, dateObj: d };
  });

  const [activeDateKey, setActiveDateKey] = useState<string>(dateTabs[0].dateKey);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('Semua Kota');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Semua');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matematika');
  const [description, setDescription] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [cost, setCost] = useState(30000);
  const [capacity, setCapacity] = useState(5);
  const [sessionLokasi, setSessionLokasi] = useState('Jakarta');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/openplay/sessions');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Error loading KumpulGuru sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage({ text: '', type: 'success' });
    }, 4000);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !description.trim() || !sessionDate || !sessionTime || capacity <= 0) {
      setFormError('Harap lengkapi semua field formulir dengan benar.');
      return;
    }

    setSubmitting(true);
    const combinedDate = `${sessionDate}T${sessionTime}:00`;

    try {
      const res = await fetch('/api/openplay/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guruId: user.id,
          title,
          subject,
          description,
          sessionDate: combinedDate,
          cost,
          capacity,
          lokasi: sessionLokasi
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Sesi belajar KumpulGuru Anda berhasil dijadwalkan!');
        setShowCreateModal(false);
        // Reset form
        setTitle('');
        setSubject('Matematika');
        setDescription('');
        setSessionDate('');
        setSessionTime('');
        setCost(30000);
        setCapacity(5);
        setSessionLokasi('Jakarta');
        fetchSessions();
      } else {
        setFormError(data.message || 'Gagal menjadwalkan sesi.');
      }
    } catch {
      setFormError('Masalah koneksi jaringan ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinSession = async (sessionId: number, sessionCost: number) => {
    try {
      const res = await fetch('/api/openplay/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, sessionId })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Berhasil bergabung dengan sesi belajar bersama!');
        onUpdateUser(data.user);
        // Store updated local storage user
        localStorage.setItem('swipeguru_user', JSON.stringify(data.user));
        fetchSessions();
      } else {
        triggerToast(data.message || 'Gagal mendaftar sesi.', 'error');
      }
    } catch {
      triggerToast('Gagal memproses pendaftaran. Periksa koneksi internet Anda.', 'error');
    }
  };

  const handleLeaveSession = async (sessionId: number) => {
    try {
      const res = await fetch('/api/openplay/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, sessionId })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Berhasil membatalkan pendaftaran sesi.');
        onUpdateUser(data.user);
        localStorage.setItem('swipeguru_user', JSON.stringify(data.user));
        fetchSessions();
      } else {
        triggerToast(data.message || 'Gagal keluar dari sesi.', 'error');
      }
    } catch {
      triggerToast('Gagal memproses pembatalan.', 'error');
    }
  };

  const handleCancelSession = async (sessionId: number) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan sesi ini?")) {
      return;
    }

    try {
      const res = await fetch('/api/openplay/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, sessionId })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Sesi belajar berhasil dibatalkan.');
        fetchSessions();
      } else {
        triggerToast(data.message || 'Gagal membatalkan sesi.', 'error');
      }
    } catch {
      triggerToast('Gagal memproses pembatalan.', 'error');
    }
  };

  // Helper inside loop to check if student is joined
  const isJoined = (session: OpenPlaySession) => {
    return session.participants.some(p => p.murid_id === user.id);
  };

  // Filtering Logic
  const filteredSessions = sessions.filter(session => {
    // 1. Text Search query
    const matchSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.guru_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Subject select filter
    const matchSubject = selectedSubject === 'Semua' || session.subject === selectedSubject;
    
    // 3. City/Location filter
    const matchCity = selectedCity === 'Semua Kota' || (session.lokasi === selectedCity);

    if (!matchSearch || !matchSubject || !matchCity) return false;

    // 4. Mine or Date Filter
    if (showOnlyMine) {
      const userIsMine = user.role === 'guru' 
        ? session.guru_id === user.id 
        : session.participants.some(p => p.murid_id === user.id);
      return userIsMine;
    } else {
      // Compare only YYYY-MM-DD
      const sDate = new Date(session.session_date);
      const dStr = sDate.toISOString().split('T')[0];
      return dStr === activeDateKey;
    }
  });

  const getSubjectColor = (sub: string) => {
    switch (sub) {
      case 'Matematika': return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50';
      case 'Fisika': return 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100/50';
      case 'Kimia': return 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50';
      case 'Biologi': return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50';
      case 'Bahasa Inggris': return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50';
      case 'Ekonomi': return 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 space-y-8 relative h-full">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Floating Dynamic Toast */}
      <AnimatePresence>
        {toastMessage.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-4 rounded-2xl shadow-xl border flex items-center gap-3 z-50 text-sm font-bold tracking-tight min-w-[300px] max-w-md ${
              toastMessage.type === 'success' 
                ? 'bg-neutral-900 border-neutral-950 text-white' 
                : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
            )}
            <span className="flex-1 leading-normal">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Back & Logo Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group cursor-pointer self-start"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {user.role === 'guru' ? 'Manajemen Sesi' : 'Hub Utama'}
        </button>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Action button for Gurus to create a session */}
          {user.role === 'guru' && (
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormError('');
                setShowCreateModal(true);
              }}
              className="bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Buka Sesi KumpulGuru
            </motion.button>
          )}

          <button 
            onClick={fetchSessions}
            title="Muat Ulang Sesi"
            className="p-3 bg-white border border-slate-150 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 hover:border-indigo-100 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Feature Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-[36px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-teal-950/10">
        <div className="absolute top-0 right-10 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-white rounded-full scale-110 translate-x-20"></div>
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/15 text-emerald-300">
            <Users size={12} className="text-emerald-300 fill-emerald-300 animate-pulse" />
            Fitur KumpulGuru • Ayo Main Bareng
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight italic">
            Belajar Rame-Rame!
          </h2>
          <p className="text-emerald-100/90 text-sm md:text-base font-medium leading-relaxed">
            Sewa mentor privat premium secara patungan (kooperatif) bersama murid-murid lain! Hemat biaya kelas privat Anda, dapatkan relasi diskusi yang seru, dan tetap belajar intensif dengan kurikulum berkualitas.
          </p>
        </div>
      </div>

      {/* Navigation Filter Tabs + Quick Subject Filters */}
      <div className="space-y-4">
        {/* Row 1: Search, City Filter & Date tabs */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
          {/* Date Filter Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 w-full xl:w-auto overflow-x-auto no-scrollbar">
            {dateTabs.map(tab => (
              <button 
                key={tab.dateKey}
                onClick={() => {
                  setActiveDateKey(tab.dateKey);
                  setShowOnlyMine(false);
                }}
                className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  (!showOnlyMine && activeDateKey === tab.dateKey)
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {tab.label === 'Hari Ini' && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                )}
              </button>
            ))}
            <button 
              onClick={() => setShowOnlyMine(true)}
              className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                showOnlyMine 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {user.role === 'guru' ? 'Sesi Saya (Tutor)' : 'Sesi Terdaftar Saya'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* City Selection dropdown */}
            <div className="relative shrink-0 w-full sm:w-44">
              <select 
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200/80 focus:border-indigo-500 text-xs font-bold text-slate-700 focus:ring-0 transition-all cursor-pointer appearance-none"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <MapPin size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <ChevronRight size={14} className="absolute right-3.5 top-3.5 text-slate-400 rotate-90 pointer-events-none" />
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-72">
              <input 
                type="text" 
                placeholder="Cari mentor, judul sesi..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-slate-200/80 focus:border-indigo-500 text-sm font-medium focus:ring-0 transition-all placeholder:text-slate-400"
              />
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Subject Badge Filters */}
        <div className="flex gap-2 pb-2 overflow-x-auto scroll-smooth no-scrollbar select-none -mx-2 px-2">
          {['Semua', 'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Ekonomi'].map(subj => (
            <button 
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedSubject === subj 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' 
                  : 'bg-white border-slate-100 text-slate-450 hover:border-slate-300 hover:text-slate-700 shadow-sm'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sessions Grid Layout */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw size={36} className="text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">Memuat Sesi KumpulGuru...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm mt-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto">
            <Calendar size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-medium text-slate-800 italic">
              Tidak Ada Sesi Terjadwal
            </h3>
            <p className="text-slate-450 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              {showOnlyMine ? 'Anda belum memiliki riwayat pendaftaran atau jadwal mengajar sesi belajar bersama.' :
               activeDateKey === dateTabs[0].dateKey ? 'Wah, belum ada sesi KumpulGuru yang dibuka untuk hari ini.' :
               'Tidak ditemukan sesi yang cocok dengan kata kunci, filter subjek atau filter lokasi Kota Anda di tanggal ini.'}
            </p>
          </div>

          {(showOnlyMine || selectedCity !== 'Semua Kota' || selectedSubject !== 'Semua' || searchQuery) && (
            <button 
              onClick={() => { 
                setShowOnlyMine(false); 
                setSelectedSubject('Semua'); 
                setSearchQuery(''); 
                setSelectedCity('Semua Kota');
                setActiveDateKey(dateTabs[0].dateKey);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              Reset Filter & Lihat Hari Ini
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const joinedList = session.participants || [];
            const userIsJoined = isJoined(session);
            const userIsHost = session.guru_id === user.id;
            const spotsRemaining = session.capacity - session.participant_count;
            const isFull = spotsRemaining <= 0;

            // Formatted Date presentation
            const sDate = new Date(session.session_date);
            const formattedTime = sDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
            
            // Checking only today as per prompt request: "kecual yang hari ini gpp, jangan besok"
            const today = new Date();
            let dateLabel = sDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
            
            if (sDate.getDate() === today.getDate() && sDate.getMonth() === today.getMonth() && sDate.getFullYear() === today.getFullYear()) {
              dateLabel = 'Hari Ini';
            }

            return (
              <motion.div 
                layout
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-100 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 relative group"
              >
                {/* Header Tag block */}
                <div className="p-6 pb-4 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border ${getSubjectColor(session.subject)}`}>
                      {session.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200/60 px-2.5 py-1 rounded-full transition-colors border border-slate-200/30">
                      <MapPin size={10} className="text-rose-500 fill-rose-100" />
                      {session.lokasi || 'Jakarta'}
                    </span>
                  </div>
                  
                  {/* Status badges */}
                  {userIsHost ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 px-2.5 py-1 rounded-md border border-violet-150">
                      HOST ANDA
                    </span>
                  ) : userIsJoined ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-150">
                      TERDAFTAR
                    </span>
                  ) : isFull ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 px-2.5 py-1 rounded-md border border-rose-100">
                      PENUH
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">
                      {spotsRemaining} Slot Tersisa
                    </span>
                  )}
                </div>

                {/* Session main text description */}
                <div className="px-6 space-y-3 flex-1">
                  <h4 className="text-lg font-display text-slate-800 font-bold group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {session.title}
                  </h4>
                  <p className="text-slate-450 text-xs font-semibold leading-relaxed line-clamp-3">
                    {session.description}
                  </p>
                </div>

                {/* Tutor Row Info */}
                <div className="mx-6 my-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                  <img 
                    src={session.guru_avatar || 'https://i.pravatar.cc/150?u=budi'} 
                    alt={session.guru_name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Mentor / Guru</span>
                    <h5 className="text-xs font-bold text-slate-800">{session.guru_name}</h5>
                  </div>
                </div>

                {/* Date & Time display bar */}
                <div className="mx-6 px-4 py-3 bg-slate-50/80 rounded-2xl flex items-center justify-between text-[11px] font-semibold text-slate-600 gap-2 border border-slate-150/40">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Clock size={13} className="text-slate-400" />
                    <span>{formattedTime}</span>
                  </div>
                </div>

                {/* Registered Participants widget */}
                <div className="p-6 pt-4 pb-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Pendaftar</span>
                    <span>{session.participant_count} / {session.capacity} Terisi</span>
                  </div>
                  
                  {joinedList.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2.5 overflow-hidden">
                        {joinedList.map((part, pIdx) => (
                          <img 
                            key={pIdx}
                            src={part.murid_avatar || 'https://www.gravatar.com/avatar/0000?d=mp'} 
                            alt={part.murid_name} 
                            title={part.murid_name}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {joinedList.map(p => p.murid_name.split(' ')[0]).slice(0, 2).join(', ')} 
                        {joinedList.length > 2 && ` dan ${joinedList.length - 2} lainnya...`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-350 italic">Belum ada murid join. Jadi yang pertama!</span>
                  )}
                </div>

                {/* Footer Cost & Action Panel */}
                <div className="p-6 pt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Patungan</span>
                    <p className="text-base font-black text-slate-800">
                      Rp {session.cost.toLocaleString('id-ID')}
                      <span className="text-[10px] text-slate-400 font-medium">/orang</span>
                    </p>
                  </div>

                  {userIsHost ? (
                    <button 
                      onClick={() => handleCancelSession(session.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Batalkan
                    </button>
                  ) : userIsJoined ? (
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleLeaveSession(session.id)}
                      className="bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-all cursor-pointer flex items-center gap-1.5 border border-rose-100"
                    >
                      <AlertCircle size={14} />
                      Batal Ikut
                    </motion.button>
                  ) : user.role === 'guru' ? (
                    <button 
                      disabled
                      className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl border border-slate-100 cursor-not-allowed"
                    >
                      Khusus Murid
                    </button>
                  ) : isFull ? (
                    <button 
                      disabled
                      className="bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl cursor-not-allowed"
                    >
                      Penuh
                    </button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleJoinSession(session.id, session.cost)}
                      className="bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-50 transition-all cursor-pointer flex items-center gap-1"
                    >
                      Gabung Sesi
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: CREATE OPEN PLAY SESSION (GURU) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[36px] border border-slate-100 w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] my-8"
            >
              {/* Header */}
              <div className="p-8 pb-4 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-display font-medium text-slate-800 italic">
                    Buka Sesi KumpulGuru Baru
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Ajarkan materi rame-rame dengan patungan
                  </p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleCreateSession} className="flex-1 overflow-y-auto p-8 space-y-6">
                
                {formError && (
                  <div className="p-4 bg-rose-50 border border-rose-105 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {formError}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Judul Sesi Belajar</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Sesi Bahas Kumpulan Rumus Trigonometri" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all"
                  />
                </div>

                {/* Row: Subject & Capacity */}
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Mata Pelajaran</label>
                    <select 
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 text-sm font-medium transition-all appearance-none text-slate-705"
                    >
                      {['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Ekonomi'].map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Kapasitas Maksimal (Murid)</label>
                    <input 
                      type="number" 
                      min="2"
                      max="20"
                      value={capacity}
                      onChange={e => setCapacity(Number(e.target.value))}
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Lokasi Sesi (Kota) */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Lokasi Sesi (Kota)</label>
                  <select 
                    value={sessionLokasi}
                    onChange={e => setSessionLokasi(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 text-sm font-medium transition-all text-slate-705 appearance-none"
                  >
                    {CITIES.filter(c => c !== 'Semua Kota').map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Deskripsi & Syarat Sesi</label>
                  <textarea 
                    placeholder="Tuliskan detail materi apa saja yang akan dipelajari, persiapan murid sebelum join, dan lainnya..." 
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all"
                  />
                </div>

                {/* Row: Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Tanggal Belajar</label>
                    <input 
                      type="date" 
                      value={sessionDate}
                      onChange={e => setSessionDate(e.target.value)}
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all text-slate-705"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Waktu Mulai (Jam)</label>
                    <input 
                      type="time" 
                      value={sessionTime}
                      onChange={e => setSessionTime(e.target.value)}
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all text-slate-705"
                    />
                  </div>
                </div>

                {/* Cost per participant */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Biaya Sewa Patungan Per Orang (Rp)</label>
                  <input 
                    type="number" 
                    step="5000"
                    min="10000"
                    placeholder="Contoh: 30000"
                    value={cost}
                    onChange={e => setCost(Number(e.target.value))}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 text-sm font-medium transition-all"
                  />
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mt-1.5 border border-indigo-100/50">
                    Estimasi total pendapatan Anda: Rp {(cost * capacity).toLocaleString('id-ID')} jika penuh
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 p-4 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 font-bold text-sm transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 p-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? 'Memproses...' : 'Buka & Jadwalkan'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
