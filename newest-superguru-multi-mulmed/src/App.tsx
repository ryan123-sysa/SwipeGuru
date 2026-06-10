import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import SmartCourse from './components/SmartCourse'; // imported as SmartCourse, we can still use it or rename internally
import OpenPlayView from './components/OpenPlayView';
import { playMatchSound } from './utils/audio';
import { 
  Flame, MessageCircle, Calendar, User, Heart, X, XCircle,
  Book, DollarSign, Send, CheckCircle, Clock, ShieldCheck,
  ChevronRight, ChevronLeft, LogOut, Shield, ArrowRight, Eye, EyeOff, Camera,
  ArrowLeft, Phone, Video, Users, Filter, Search, Star, Smartphone, Layers, Sparkles, Menu, MapPin
} from 'lucide-react';

// --- Types ---
type UserRole = 'guru' | 'murid' | 'admin';
type BookingStatus = 'requested' | 'unpaid' | 'paid' | 'completed' | 'cancelled';

interface AppUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  saldo_koin?: number;
  bio?: string;
  tarif?: number;
  session_duration?: number;
  kampus?: string;
  profile_picture?: string;
  avatar_url?: string;
  subjects_ids?: number[];
  avg_rating?: number;
  review_count?: number;
  status?: string;
  ktp_url?: string;
  ktm_url?: string;
  subjects?: string;
}

interface Tutor {
  id: number;
  full_name: string;
  bio: string;
  tarif: number;
  session_duration: number;
  kampus: string;
  avatar_url: string;
  subjects: string;
  gender: string;
  lokasi: string;
  avg_rating?: number;
  review_count?: number;
}

interface Match {
  id: number;
  other_id: number;
  other_name: string;
  other_avatar: string;
  tarif: number;
  session_duration: number;
  avg_rating?: number;
  review_count?: number;
}

interface Message {
  id: number;
  sender_id: number;
  content: string;
  timestamp: string;
}

interface Booking {
  id: number;
  other_name: string;
  other_avatar: string;
  amount: number;
  session_count: number;
  session_date: string;
  status: BookingStatus;
  created_at: string;
  guru_id: number;
  murid_id: number;
}

// --- Super App Hub View ---
function HubView({ user, setView }: { user: AppUser; setView: (v: any) => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 space-y-10 relative h-full">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Super App Welcome header banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-[36px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-950/10">
        <div className="absolute top-0 right-10 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-white rounded-full scale-110 translate-x-20"></div>
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 text-indigo-300">
            <Sparkles size={12} className="text-amber-300 fill-amber-300 animate-pulse" />
            SwipeGuru Super App
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight italic">
            Halo, {user.full_name}!
          </h2>
          <p className="text-indigo-100/90 text-sm md:text-base font-medium leading-relaxed">
            Selamat datang di ekosistem belajar masa depan. Temukan mentor privat terbaik, atau tingkatkan nilai akademismu secara mandiri lewat program CourseGuru dengan materi terstruktur pilihanmu!
          </p>
        </div>
      </div>

      {/* Two core application channels styled like Gojek Super-App Shortcuts */}
      <div className="space-y-6 w-full">
        {/* Horizontal flex container matching Superapp launcher exact proportions */}
        <div className="flex flex-row flex-wrap justify-start gap-20 md:gap-28">
          
          {/* Card 1: SwipeGuru Launcher */}
          <motion.div 
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('swipe')}
            className="w-28 flex flex-col items-center gap-4 cursor-pointer group select-none text-center"
          >
            {/* Squircle container with top-left badge and tail notch */}
            <div className="relative">
              {/* Gojek-style black speech bubble badge with custom pointy tail */}
              <div className="absolute -top-3.5 -left-3.5 bg-neutral-900 border border-neutral-950 text-white text-[10px] font-black px-2.5 py-1 rounded-t-xl rounded-br-xl shadow-md z-10 flex items-center select-none uppercase tracking-wider">
                100% GURU!
                {/* Micro tail triangular notch */}
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-neutral-900 absolute left-2.5 top-full"></div>
              </div>
              
              {/* Mentoring Icon Squircle (Soft Green colored frame matching search screen theme & Gojek) */}
              <div className="w-28 h-28 bg-[#e6f9e9] hover:bg-[#d8f5dc] border border-[#cbeed1]/60 rounded-[32px] flex items-center justify-center text-[#10b981] group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-green-150/40 transition-all duration-300 ease-out shadow-md">
                <Flame size={48} className="fill-[#10b981]/15 group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>

            {/* Title written large of course right under the icon */}
            <div className="space-y-1 flex flex-col items-center">
              <h4 className="text-lg md:text-xl font-display font-black tracking-tight text-slate-800 group-hover:text-emerald-600 transition-colors italic whitespace-nowrap">
                SwipeGuru
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                Cari Tutor Privat
              </p>
            </div>
          </motion.div>

          {/* Card 2: CourseGuru Launcher */}
          <motion.div 
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('courses')}
            className="w-28 flex flex-col items-center gap-4 cursor-pointer group select-none text-center"
          >
            {/* Squircle container with top-left badge and tail notch */}
            <div className="relative">
              {/* Gojek-style black speech bubble badge with custom pointy tail */}
              <div className="absolute -top-3.5 -left-3.5 bg-neutral-900 border border-neutral-950 text-white text-[10px] font-black px-2.5 py-1 rounded-t-xl rounded-br-xl shadow-md z-10 flex items-center select-none uppercase tracking-wider">
                GRATIS!
                {/* Micro tail triangular notch */}
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-neutral-900 absolute left-2.5 top-full"></div>
              </div>
              
              {/* Learning Portal Icon Squircle (Soft Rose/Pink colored frame matching GoFood/CourseGuru theme) */}
              <div className="w-28 h-28 bg-[#fff0f1]/90 hover:bg-[#ffe3e5] border border-[#ffd3d6]/60 rounded-[32px] flex items-center justify-center text-rose-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-rose-150/40 transition-all duration-300 ease-out shadow-md">
                <Book size={48} className="group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>

            {/* Title written large right under the icon */}
            <div className="space-y-1 flex flex-col items-center">
              <h4 className="text-lg md:text-xl font-display font-black tracking-tight text-slate-800 group-hover:text-rose-500 transition-colors italic whitespace-nowrap">
                CourseGuru
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                Belajar Mandiri
              </p>
            </div>
          </motion.div>

          {/* Card 3: Open Play Launcher */}
          <motion.div 
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('openplay')}
            className="w-28 flex flex-col items-center gap-4 cursor-pointer group select-none text-center"
          >
            {/* Squircle container with top-left badge and tail notch */}
            <div className="relative">
              {/* Gojek-style black speech bubble badge with custom pointy tail */}
              <div className="absolute -top-3.5 -left-3.5 bg-neutral-900 border border-neutral-950 text-white text-[10px] font-black px-2.5 py-1 rounded-t-xl rounded-br-xl shadow-md z-10 flex items-center select-none uppercase tracking-wider whitespace-nowrap">
                MABAR SERU!
                {/* Micro tail triangular notch */}
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-neutral-900 absolute left-2.5 top-full"></div>
              </div>
              
              {/* Learning Portal Icon Squircle (Soft Emerald/Teal colored frame matching Open Play theme) */}
              <div className="w-28 h-28 bg-[#eefcf7] hover:bg-[#dff9ef] border border-[#a8ebd5]/55 rounded-[32px] flex items-center justify-center text-teal-600 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-teal-150/40 transition-all duration-300 ease-out shadow-md">
                <Users size={48} className="group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>

            {/* Title written large right under the icon */}
            <div className="space-y-1 flex flex-col items-center">
              <h4 className="text-lg md:text-xl font-display font-black tracking-tight text-slate-800 group-hover:text-teal-600 transition-colors italic whitespace-nowrap">
                KumpulGuru
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                Mabar & Belajar
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [view, setView] = useState<'auth' | 'swipe' | 'matches' | 'sessions' | 'admin' | 'chat' | 'profile' | 'hub' | 'courses' | 'openplay'>('auth');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchedTeacherPopup, setMatchedTeacherPopup] = useState<Match | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('swipeguru_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      if (u.role === 'admin') setView('admin');
      else if (u.role === 'guru') setView('sessions');
      else setView('hub');
    }
  }, []);

  const handleLogin = (u: AppUser) => {
    setUser(u);
    localStorage.setItem('swipeguru_user', JSON.stringify(u));
    if (u.role === 'admin') setView('admin');
    else if (u.role === 'guru') setView('sessions');
    else setView('hub');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swipeguru_user');
    setView('auth');
  };

  if (!user && view !== 'auth') setView('auth');

  // Desktop Sidebar + Content Layout
  if (user && view !== 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex ${isSidebarCollapsed ? 'w-20' : 'w-72'} flex-col bg-white border-r border-slate-200 sticky top-0 h-screen z-50 transition-all duration-300 relative shadow-sm`}>
          {/* Collapse/Expand Toggle Button */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-9 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-colors z-50 cursor-pointer"
            id="toggle-sidebar"
            title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            <Menu size={12} />
          </button>

          <div className={`p-8 flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'px-4 justify-center' : ''}`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
              <Flame size={24} />
            </div>
            {!isSidebarCollapsed && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-display italic text-indigo-950 tracking-tight whitespace-nowrap"
              >
                SwipeGuru
              </motion.h1>
            )}
          </div>

          <nav className={`flex-1 px-4 py-4 space-y-1 ${isSidebarCollapsed ? 'px-2' : ''}`}>
            <SidebarLink 
              active={view === 'hub'} 
              onClick={() => setView('hub')} 
              icon={<Layers size={20}/>} 
              label="Hub Utama" 
              hide={user.role === 'guru' || user.role === 'admin'}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarLink 
              active={view === 'openplay'} 
              onClick={() => setView('openplay')} 
              icon={<Users size={20}/>} 
              label="KumpulGuru" 
              hide={user.role !== 'guru'}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarLink 
              active={view === 'matches' || view === 'chat'} 
              onClick={() => setView('matches')} 
              icon={<MessageCircle size={20}/>} 
              label="Pesan & Diskusi" 
              hide={user.role === 'admin'}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarLink 
              active={view === 'sessions'} 
              onClick={() => setView('sessions')} 
              icon={<Calendar size={20}/>} 
              label="Jadwal Sesi" 
              hide={user.role === 'admin'}
              isCollapsed={isSidebarCollapsed}
            />
            {user.role === 'admin' ? (
              <SidebarLink 
                active={view === 'admin'} 
                onClick={() => setView('admin')} 
                icon={<Shield size={20}/>} 
                label="Panel Admin" 
                isCollapsed={isSidebarCollapsed}
              />
            ) : (
              <SidebarLink 
                active={view === 'profile'} 
                onClick={() => setView('profile')} 
                icon={<User size={20}/>} 
                label="Profil Saya" 
                isCollapsed={isSidebarCollapsed}
              />
            )}
          </nav>

          <div className={`p-4 border-t border-slate-100 ${isSidebarCollapsed ? 'px-2' : ''}`}>
            <button 
              onClick={handleLogout}
              title={isSidebarCollapsed ? "Keluar" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 p-3'} text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium`}
            >
              <LogOut size={20} className="shrink-0" /> 
              {!isSidebarCollapsed && <span>Keluar</span>}
            </button>
          </div>
        </aside>

        {/* Global Nav for Mobile */}
        <div className="md:hidden">
           <BottomNav currentView={view} setView={setView} role={user.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'hub' && <HubView user={user} setView={setView} />}
            {view === 'courses' && <SmartCourse user={user} onBackToHub={() => setView('hub')} />}
            {view === 'openplay' && <OpenPlayView user={user} onBackToHub={() => setView(user.role === 'guru' ? 'sessions' : 'hub')} onUpdateUser={(u) => setUser(u)} />}
            {view === 'swipe' && (
              <SwipeView 
                user={user} 
                onMatch={(m) => { 
                  playMatchSound();
                  setMatchedTeacherPopup(m); 
                }} 
              />
            )}
            {view === 'matches' && <MatchesView user={user} onSelect={(m) => { setSelectedMatch(m); setView('chat'); }} />}
            {view === 'chat' && selectedMatch && (
              <ChatView 
                user={user} 
                match={selectedMatch} 
                onBack={() => setView('matches')} 
              />
            )}
            {view === 'sessions' && <SessionsView user={user} setView={setView} />}
            {view === 'admin' && <AdminView user={user} onLogout={handleLogout} />}
            {view === 'profile' && <ProfileView user={user} onLogout={handleLogout} setUser={setUser} />}
          </AnimatePresence>

          {/* Full Screen Match Celebration Animation Overlay */}
          <AnimatePresence>
            {matchedTeacherPopup && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl select-none"
              >
                {/* Floating animated soft roses/hearts in background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: (i % 3 === 0 ? -120 : i % 3 === 1 ? 0 : 120) + (Math.random() * 60 - 30),
                        y: 300,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: 0
                      }}
                      animate={{ 
                        y: [-200, -600],
                        scale: [0.6, 1.2, 0.6],
                        opacity: [0, 0.45, 0]
                      }}
                      transition={{ 
                        duration: 3 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: "easeOut"
                      }}
                      className="absolute left-1/2 top-1/2 shrink-0 text-rose-500/30"
                    >
                      <Heart size={32} className="fill-current" />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0.82, y: 40 }}
                  animate={{ scale: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 120 } }}
                  exit={{ scale: 0.82, y: 40 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[50px] max-w-lg w-full text-center relative overflow-hidden shadow-2xl text-white"
                >
                  {/* Backdrop glow dots */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/30 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative flex justify-center items-center gap-6 md:gap-10 mb-10 mt-4">
                    {/* Student profile circle (slides in from left) */}
                    <motion.div
                      initial={{ x: -120, opacity: 0, rotate: -20 }}
                      animate={{ x: 0, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 12 }}
                      className="relative z-10"
                    >
                      <img 
                        src={user.avatar_url || DEFAULT_AVATAR} 
                        alt={user.full_name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-indigo-400 shadow-xl shadow-indigo-500/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 px-3 py-0.5.5 bg-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-md">
                        Kamu
                      </span>
                    </motion.div>

                    {/* Highly interactive spring connection Heart icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ delay: 0.4, duration: 0.75 }}
                      className="relative flex items-center justify-center shrink-0"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute w-16 h-16 bg-rose-500/20 rounded-full blur-sm"
                      />
                      <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-550/50 relative z-20">
                        <Heart size={24} className="text-white fill-white animate-pulse" />
                      </div>
                    </motion.div>

                    {/* Teacher profile circle (slides in from right) */}
                    <motion.div
                      initial={{ x: 120, opacity: 0, rotate: 20 }}
                      animate={{ x: 0, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 12 }}
                      className="relative z-10"
                    >
                      <img 
                        src={matchedTeacherPopup.other_avatar || DEFAULT_AVATAR} 
                        alt={matchedTeacherPopup.other_name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-rose-400 shadow-xl shadow-rose-500/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 left-0 px-3 py-0.5.5 bg-rose-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-md">
                        Guru
                      </span>
                    </motion.div>
                  </div>

                  {/* Information & descriptions */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-[10px] font-black tracking-widest text-[#93c5fd] bg-blue-500/20 px-3.5 py-1.5 rounded-full uppercase">
                        Kalian Klop Banget!
                      </span>
                    </motion.div>

                    <motion.h4
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-display italic font-black text-white leading-tight"
                    >
                      Berhasil Match!
                    </motion.h4>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-white/80 text-sm max-w-sm mx-auto leading-relaxed"
                    >
                      Selamat bergabung! <strong className="text-amber-400 font-extrabold">{matchedTeacherPopup.other_name}</strong> secara resmi siap membimbing dan membantu kegiatan belajarmu dengan interaktif.
                    </motion.p>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="mt-10 flex flex-col gap-3">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={() => {
                        setSelectedMatch(matchedTeacherPopup);
                        setView('chat');
                        setMatchedTeacherPopup(null);
                      }}
                      className="w-full py-4.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-indigo-900/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-400"
                    >
                      <MessageCircle size={18} />
                      <span>Kirim Pesan Sekarang</span>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      onClick={() => setMatchedTeacherPopup(null)}
                      className="w-full py-3.5 bg-transparent hover:bg-white/5 text-white/60 hover:text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-colors"
                    >
                      Kembali Menjelajah
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AnimatePresence mode="wait">
        {view === 'auth' && <AuthView onLogin={handleLogin} />}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label, hide, isCollapsed }: { active: boolean, onClick: () => void, icon: any, label: string, hide?: boolean, isCollapsed?: boolean }) {
  if (hide) return null;
  return (
    <button 
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'} rounded-xl transition-all font-medium group ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors shrink-0`}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className="whitespace-nowrap">{label}</span>
      )}
      {!isCollapsed && active && (
        <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
      )}
    </button>
  );
}

// --- Sub-Components ---

function AuthView({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('murid');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Guru Specific Fields
  const [bio, setBio] = useState('');
  const [kampus, setKampus] = useState('');
  const [tarif, setTarif] = useState(100000);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [gender, setGender] = useState('Laki-laki');
  const [lokasi, setLokasi] = useState('Jakarta');
  const [ktpUrl, setKtpUrl] = useState('');
  const [ktmUrl, setKtmUrl] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [allSubjects, setAllSubjects] = useState<{id: number, nama_mapel: string}[]>([]);

  useEffect(() => {
    fetch('/api/subjects').then(res => res.json()).then(setAllSubjects);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File terlalu besar. Maksimal 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSubject = (id: number) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin && password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body: any = isLogin ? { email, password } : { email, password, full_name: name, role };
    
    if (!isLogin && role === 'guru') {
      body.bio = bio;
      body.kampus = kampus;
      body.tarif = tarif;
      body.session_duration = sessionDuration;
      body.gender = gender;
      body.lokasi = lokasi;
      body.ktp_url = ktpUrl;
      body.ktm_url = ktmUrl;
      body.subjectIds = selectedSubjects;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      console.log("Response data:", data);
      if (res.ok && data.success) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          alert("Pendaftaran berhasil! Akun guru akan diverifikasi admin.");
          setIsLogin(true);
        }
      } else {
        setError(data.message || (isLogin ? "Email atau password salah" : "Pendaftaran gagal"));
      }
    } catch (err) {
      console.error(err);
      setError("Koneksi gagal atau sistem bermasalah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden selection:bg-indigo-100">
      {/* Left Pane - Branding & Visuals */}
      <div className="hidden md:flex md:w-1/2 lg:w-[60%] bg-indigo-600 relative overflow-hidden flex-col items-center justify-center p-16 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-xl text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-indigo-100 text-xs font-bold uppercase tracking-widest mb-10 border border-white/20">
            <Flame size={14} className="text-white" />
            Tutor Finder Premium
          </div>
          <h1 className="text-6xl lg:text-8xl font-display leading-[0.85] tracking-tight mb-8 italic">
            Mulai Belajar,<br/>Ubah Masa Depan.
          </h1>
          <p className="text-xl text-indigo-100/80 font-medium max-w-sm mx-auto leading-relaxed">
            Platform edukasi paling inovatif untuk menemukan mentor akademik terbaik di sekitarmu.
          </p>
        </motion.div>

        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-slate-900 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        
        {/* Floating Stat card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="absolute bottom-12 left-12 p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] hidden lg:block"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-400 rounded-2xl flex items-center justify-center text-slate-900">
                <CheckCircle size={24} />
             </div>
             <div className="text-left">
                <p className="text-2xl font-display leading-none">2,500+</p>
                <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Tutor Terverifikasi</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 md:w-1/2 lg:w-[40%] flex flex-col p-8 md:p-16 lg:p-24 overflow-y-auto bg-white relative">
        <div className="md:hidden flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Flame size={16} />
              </div>
              <span className="text-xl font-display italic text-indigo-950 tracking-tight">SwipeGuru</span>
            </div>
        </div>

        <div className="max-w-md mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-display text-slate-900 mb-2 italic">
              {isLogin ? 'Selamat Datang Kembali' : 'Bergabung Sekarang'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Masukkan kredensial untuk mulai belajar.' : 'Mulai perjalanan akademikmu hari ini.'}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Nama Lengkap</label>
                  <input 
                    type="text" value={name} onChange={e => setName(e.target.value)} 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 transition-all text-sm font-medium"
                    placeholder="Contoh: Abyan Murid" required
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" onClick={() => setRole('murid')}
                    disabled={loading}
                    className={`flex-1 p-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${role === 'murid' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                  >Murid</button>
                  <button 
                    type="button" onClick={() => setRole('guru')}
                    disabled={loading}
                    className={`flex-1 p-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${role === 'guru' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                  >Tutor</button>
                </div>

                {role === 'guru' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Subjek Pelajaran</label>
                      <div className="flex flex-wrap gap-2">
                        {allSubjects.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleSubject(s.id)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedSubjects.includes(s.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'}`}
                          >
                            {s.nama_mapel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Kampus</label>
                        <select 
                          value={kampus} 
                          onChange={e => setKampus(e.target.value)} 
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium appearance-none" 
                          required
                        >
                          <option value="" disabled>Pilih Kampus</option>
                          <option value="Universitas Indonesia (UI)">Universitas Indonesia (UI)</option>
                          <option value="Institut Teknologi Bandung (ITB)">Institut Teknologi Bandung (ITB)</option>
                          <option value="Universitas Gadjah Mada (UGM)">Universitas Gadjah Mada (UGM)</option>
                          <option value="Universitas Airlangga (UNAIR)">Universitas Airlangga (UNAIR)</option>
                          <option value="Institut Pertanian Bogor (IPB)">Institut Pertanian Bogor (IPB)</option>
                          <option value="Universitas Padjadjaran (UNPAD)">Universitas Padjadjaran (UNPAD)</option>
                          <option value="Universitas Diponegoro (UNDIP)">Universitas Diponegoro (UNDIP)</option>
                          <option value="Universitas Brawijaya (UB)">Universitas Brawijaya (UB)</option>
                          <option value="Bina Nusantara University (BINUS)">Bina Nusantara University (BINUS)</option>
                          <option value="Universitas Telkom">Universitas Telkom</option>
                          <option value="Universitas Hasanuddin (UNHAS)">Universitas Hasanuddin (UNHAS)</option>
                          <option value="Universitas Sumatera Utara (USU)">Universitas Sumatera Utara (USU)</option>
                          <option value="Universitas Sebelas Maret (UNS)">Universitas Sebelas Maret (UNS)</option>
                          <option value="Universitas Pendidikan Indonesia (UPI)">Universitas Pendidikan Indonesia (UPI)</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Tarif / Sesi</label>
                        <input type="number" value={tarif} onChange={e => setTarif(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Durasi / Sesi (Menit)</label>
                      <input type="number" value={sessionDuration} onChange={e => setSessionDuration(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Gender</label>
                         <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium appearance-none">
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Lokasi</label>
                         <select value={lokasi} onChange={e => setLokasi(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium appearance-none">
                            <option value="Jakarta">Jakarta</option>
                            <option value="Bandung">Bandung</option>
                            <option value="Surabaya">Surabaya</option>
                            <option value="Yogyakarta">Yogyakarta</option>
                         </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">KTP</label>
                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-100 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden group">
                          {ktpUrl ? (
                            <img src={ktpUrl} className="w-full h-full object-cover" alt="KTP" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4">
                              <User size={20} className="text-slate-300 mb-1 group-hover:text-indigo-400 transition-colors" />
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Upload KTP</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setKtpUrl)} required={!isLogin} />
                        </label>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">KTM</label>
                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-100 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden group">
                          {ktmUrl ? (
                            <img src={ktmUrl} className="w-full h-full object-cover" alt="KTM" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4">
                              <Book size={20} className="text-slate-300 mb-1 group-hover:text-indigo-400 transition-colors" />
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Upload KTM</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setKtmUrl)} required={!isLogin} />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Alamat Email</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 transition-all text-sm font-medium"
                  placeholder="name@email.com" required
                />
              </div>
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Password</label>
                <input 
                  type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-0 transition-all text-sm font-medium pr-12"
                  placeholder="••••••••" required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-4 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold ring-2 ring-rose-500/5">
                  <XCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white p-5 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 group ${loading ? 'bg-indigo-300' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98]'}`}>
              {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Platform' : 'Daftar Sekarang')} 
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <button 
            onClick={() => { 
              setIsLogin(!isLogin); 
              setError(''); 
              setEmail(''); 
              setPassword(''); 
              setName('');
            }}
            disabled={loading}
            className="w-full mt-10 text-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {isLogin ? "Belum punya akun? Bergabung Sekarang" : "Sudah punya akun? Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SwipeView({ user, onMatch }: { user: AppUser, onMatch: (m: Match) => void }) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCandidates, setLikedCandidates] = useState<Tutor[]>([]);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'discovery' | 'elimination' | 'finished'>('discovery');
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterSubject, setFilterSubject] = useState('Semua');
  const [filterGender, setFilterGender] = useState('Semua');
  const [filterLokasi, setFilterLokasi] = useState('Semua');
  const [filterMaxPrice, setFilterMaxPrice] = useState(500000);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/tutors?userId=${user.id}`)
      .then(res => res.json())
      .then(async data => {
        if (data.length === 0) {
          try {
            await fetch('/api/reset-swipes', { 
              method: 'POST', 
              headers: {'Content-Type': 'application/json'}, 
              body: JSON.stringify({ userId: user.id }) 
            });
            const res = await fetch(`/api/tutors?userId=${user.id}`);
            const freshData = await res.json();
            setTutors(freshData);
            setPhase(freshData.length === 0 ? 'finished' : 'discovery');
          } catch (e) {
            console.error(e);
            setTutors([]);
            setPhase('finished');
          }
        } else {
          setTutors(data);
          setPhase('discovery');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [user.id]);

  const filteredTutors = phase === 'elimination' ? tutors : tutors.filter(t => {
    const matchSubject = filterSubject === 'Semua' || (t.subjects && t.subjects.split(',').includes(filterSubject));
    const matchGender = filterGender === 'Semua' || t.gender === filterGender;
    const matchLokasi = filterLokasi === 'Semua' || t.lokasi === filterLokasi;
    const matchPrice = t.tarif <= filterMaxPrice;
    return matchSubject && matchGender && matchLokasi && matchPrice;
  });

  const handleSwipe = async (dir: 'left' | 'right', tutor: Tutor) => {
    // Record to server
    fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swiperId: user.id, swipedId: tutor.id, direction: dir })
    });

    const newLiked = dir === 'right' ? [...likedCandidates, tutor] : likedCandidates;
    if (dir === 'right') setLikedCandidates(newLiked);

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= filteredTutors.length) {
       handleRoundEnd(newLiked);
    } else {
       setCurrentIndex(nextIndex);
    }
  };

  const handleRoundEnd = (currentLikes: Tutor[]) => {
    if (currentLikes.length === 0) {
      setPhase('finished');
    } else if (currentLikes.length === 1) {
      finalizeMatch(currentLikes[0].id);
    } else {
      // Multiple liked
      if (phase === 'elimination' && tutors.length === 2) {
        // Pitted against each other again (Adu lagi)!
        setTutors(currentLikes);
        setLikedCandidates([]);
        setCurrentIndex(0);
        setRound(prev => prev + 1);
      } else {
        // Move to next elimination phase round
        setTutors(currentLikes);
        setLikedCandidates([]);
        setCurrentIndex(0);
        setRound(prev => prev + 1);
        setPhase('elimination');
      }
    }
  };

  const finalizeMatch = async (tutorId: number) => {
    const res = await fetch('/api/finalize-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, forcedTutorId: tutorId })
    });
    const data = await res.json();
    if (data.match) {
      onMatch(data.matchDetails);
    }
  };

  const currentTutor = filteredTutors[currentIndex];

  // Reset index when filters change during discovery phase
  useEffect(() => {
    if (phase === 'discovery') {
      setCurrentIndex(0);
      setLikedCandidates([]);
    }
  }, [filterSubject, filterGender, filterLokasi, filterMaxPrice, phase]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-4 pt-10"
    >
      <header className="px-2 mb-4 flex justify-between items-center relative">
        <div>
          <h2 className="text-2xl font-display italic">
            {phase === 'discovery' ? 'Discovery' : `Round ${round}`}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {phase === 'discovery' ? 'Mencari Kandidat' : 'Eliminasi Finalis'}
          </p>
        </div>
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${showFilter ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}
        >
          <Filter size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Kategori</span>
        </button>
      </header>

      <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
        {['Semua', 'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Ekonomi'].map(m => (
          <button 
            key={m}
            onClick={() => setFilterSubject(m)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterSubject === m ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 shadow-sm'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {showFilter && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-4 overflow-hidden"
        >
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Pilih Mata Pelajaran (Kategori)</label>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
                {['Semua', 'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Ekonomi'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setFilterSubject(m)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${filterSubject === m ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 font-semibold text-slate-600">
              <div>
                <label className="text-[10px] uppercase block mb-1">Gender</label>
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full p-3 bg-white rounded-xl text-[10px] uppercase font-bold tracking-widest border border-slate-200 shadow-sm appearance-none">
                  <option value="Semua">Semua</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase block mb-1">Lokasi</label>
                <select value={filterLokasi} onChange={e => setFilterLokasi(e.target.value)} className="w-full p-3 bg-white rounded-xl text-[10px] uppercase font-bold tracking-widest border border-slate-200 shadow-sm appearance-none">
                  <option value="Semua">Semua</option>
                  {['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="text-[10px] uppercase block mb-1">Tarif Max</label>
                 <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-600">Rp {(filterMaxPrice / 1000).toLocaleString()}k</span>
                 </div>
              </div>
            </div>
            <div>
              <input 
                type="range" min="0" max="1000000" step="10000" 
                value={filterMaxPrice} onChange={e => setFilterMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
        </motion.div>
      )}

      <div className="flex-1 relative">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 p-8">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-slate-500">Memuat tutor terbaik...</p>
            </div>
          ) : phase !== 'finished' && currentTutor ? (
            <TutorCard 
              key={`${round}-${currentTutor.id}`} 
              tutor={currentTutor} 
              onSwipe={(dir) => handleSwipe(dir, currentTutor)} 
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                <Heart size={48} />
              </div>
              <h3 className="text-xl font-display italic text-slate-800">Tutor Habis!</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-[200px]">
                {filteredTutors.length === 0 && tutors.length > 0 ? "Coba ubah filter pencarianmu." : "Kamu belum menemukan match yang pas."}
              </p>
              
              <button 
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await fetch('/api/reset-swipes', { 
                      method: 'POST', 
                      headers: {'Content-Type': 'application/json'}, 
                      body: JSON.stringify({ userId: user.id }) 
                    });
                    const res = await fetch(`/api/tutors?userId=${user.id}`);
                    const data = await res.json();
                    setTutors(data);
                    setCurrentIndex(0);
                    setLikedCandidates([]);
                    setRound(1);
                    setPhase(data.length === 0 ? 'finished' : 'discovery');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
              >
                Ulangi Pencarian <Clock size={16}/>
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {!isLoading && phase !== 'finished' && currentTutor && (
        <div className="flex justify-center gap-6 mt-6 mb-24">
          <button 
            onClick={() => handleSwipe('left', currentTutor)}
            className="w-16 h-16 rounded-full border-2 border-rose-100 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-50 bg-white hover:scale-110 transition-transform"
          >
            <X size={28} />
          </button>
          <button 
             onClick={() => handleSwipe('right', currentTutor)}
            className="w-16 h-16 rounded-full border-2 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-50 bg-white hover:scale-110 transition-transform"
          >
            <Heart size={28} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function TutorCard({ tutor, onSwipe }: { tutor: Tutor, onSwipe: (dir: 'left' | 'right') => void | Promise<void>, key?: React.Key }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="absolute inset-0 z-10 touch-none"
    >
      <div className="w-full h-full bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative">
        <img 
          src={tutor.avatar_url || DEFAULT_AVATAR} 
          alt={tutor.full_name} 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <div className="flex items-center text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold ml-1">{tutor.avg_rating ? tutor.avg_rating.toFixed(1) : 'New'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">({tutor.review_count || 0} Ulasan)</span>
              </div>
              <h3 className="text-3xl font-display leading-tight">{tutor.full_name}</h3>
              <p className="flex items-center gap-1 text-slate-300 text-sm mt-1">
                <Search size={14} className="text-indigo-400" /> {tutor.lokasi} • {tutor.gender}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tutor.kampus}</p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-bold text-indigo-400">Tarif / {tutor.session_duration || 60}m</span>
              <p className="text-xl font-display">Rp {(tutor.tarif || 0).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 my-4">
            {tutor.subjects?.split(',').map(s => (
              <span key={s} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                {s}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
            {tutor.bio}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MatchesView({ user, onSelect }: { user: AppUser, onSelect: (m: Match) => void }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches?userId=${user.id}`).then(res => res.json()).then(data => {
      setMatches(data);
      setLoading(false);
    });
  }, [user.id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white"
    >
      <header className="px-8 py-10 bg-white border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-display text-slate-900 italic tracking-tight mb-2">Diskusi & Sesi</h2>
           <p className="text-sm text-slate-500 font-medium">Lanjutkan percakapan dengan tutor pilihanmu.</p>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {matches.slice(0, 5).map((m, i) => (
            <img key={i} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white object-cover" src={m.other_avatar || DEFAULT_AVATAR} alt="" referrerPolicy="no-referrer" />
          ))}
          {matches.length > 5 && (
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 border-4 border-white text-xs font-bold text-indigo-600">
              +{matches.length - 5}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-300">
             <div className="w-10 h-10 border-4 border-slate-50 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="font-bold text-[10px] uppercase tracking-widest">Memuat Pesan...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
             <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
                <MessageCircle size={32} />
             </div>
             <h3 className="text-xl font-display text-slate-900 mb-2 italic">Belum Ada Obrolan</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Anda belum memiliki pasangan belajar. Cari tutor potensial di menu "Mencari Tutor" untuk mulai berdiskusi.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(m => (
              <motion.button
                key={m.id}
                whileHover={{ y: -6 }}
                onClick={() => onSelect(m)}
                className="flex items-start gap-5 p-6 bg-white border border-slate-100 rounded-[40px] text-left transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:border-indigo-100 group relative"
              >
                <div className="relative shrink-0">
                  <img 
                    src={m.other_avatar || DEFAULT_AVATAR} 
                    className="w-16 h-16 rounded-[24px] object-cover ring-2 ring-slate-100 transition-transform group-hover:scale-105" 
                    alt="" referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h4 className="font-display text-xl text-slate-900 truncate italic grow">
                      {m.other_name}
                    </h4>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{m.avg_rating ? m.avg_rating.toFixed(1) : 'New'}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-1 mb-3">Klik untuk berdiskusi atau menjadwalkan sesi belajar...</p>
                  <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                     Matched
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChatView({ user, match, onBack }: { user: AppUser, match: Match, onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMsgs = async () => {
    try {
      const res = await fetch(`/api/messages/${match.id}`);
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [match.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input;
    setInput('');
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, senderId: user.id, content })
      });
      fetchMsgs();
    } catch (err) { 
      console.error(err);
      setInput(content); // restore on error
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-white h-screen relative z-10"
    >
      <header className="p-6 md:p-8 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={match.other_avatar || DEFAULT_AVATAR} 
                className="w-14 h-14 rounded-[20px] object-cover ring-2 ring-slate-100 shadow-lg" 
                alt={match.other_name} referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-2xl font-display text-slate-900 italic tracking-tight leading-none mb-1">{match.other_name}</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Online Sekarang</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
            <button className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
               <Phone size={22} />
            </button>
            <button className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
               <Video size={22} />
            </button>
            {user.role === 'murid' && (
              <button 
                onClick={() => setShowBooking(true)}
                className="ml-2 px-8 py-4 bg-indigo-600 text-white rounded-[20px] text-xs font-bold uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >Pesan Sesi Belajar</button>
            )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 bg-slate-50/20 scroll-smooth">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-bold uppercase tracking-widest">Mengambil Riwayat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-16 max-w-sm mx-auto">
             <div className="w-20 h-20 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MessageCircle size={32} />
             </div>
             <p className="text-sm font-medium italic text-slate-400 leading-relaxed">Belum ada percakapan. Mulailah dengan menanyakan ketersediaan jadwal atau materi yang ingin dipelajari.</p>
          </div>
        ) : messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            key={m.id || i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] md:max-w-lg ${m.sender_id === user.id ? 'bg-indigo-600 text-white rounded-[32px] rounded-tr-lg shadow-xl shadow-indigo-100' : 'bg-white text-slate-800 rounded-[32px] rounded-tl-lg shadow-sm border border-slate-100'} p-6`}>
               <p className="text-sm md:text-base font-medium leading-relaxed">{m.content}</p>
               <p className={`text-[9px] uppercase font-bold mt-4 tracking-widest opacity-60 ${m.sender_id === user.id ? 'text-white' : 'text-slate-400'}`}>
                 {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="p-8 md:p-10 bg-white border-t border-slate-100">
        <form onSubmit={sendMessage} className="max-w-5xl mx-auto flex gap-5">
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Tulis pesan anda di sini..."
            className="flex-1 p-5 bg-slate-50 border-none rounded-[28px] focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium shadow-inner"
          />
          <button type="submit" className="w-16 h-16 bg-indigo-600 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
            <Send size={24} />
          </button>
        </form>
      </footer>

      <AnimatePresence>
        {showBooking && (
          <BookingModal 
             match={match} 
             user={user} 
             onClose={() => setShowBooking(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BookingModal({ match, user, onClose }: { match: Match, user: AppUser, onClose: () => void }) {
  const [date, setDate] = useState('');
  const [sessionCount, setSessionCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adminFee = 2500;
      const totalAmount = (match.tarif * sessionCount) + adminFee;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muridId: user.id,
          guruId: match.other_id,
          matchId: match.id,
          amount: totalAmount,
          sessionCount: sessionCount,
          sessionDate: date
        })
      });
      if (res.ok) {
        alert("Pemesanan dikirim! Tutor akan segera memberikan info lanjut.");
        onClose();
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const adminFee = 2500;
  const subtotal = match.tarif * sessionCount;
  const totalAmount = subtotal + adminFee;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-xl rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 mix-blend-multiply"></div>
        
        <header className="flex justify-between items-center mb-10 relative">
          <div>
            <h2 className="text-3xl font-display italic text-slate-900 mb-1">Booking Sesi</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jadwalkan Waktu Belajarmu</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"><X size={24}/></button>
        </header>

        <div className="flex items-center gap-6 mb-12 bg-slate-50 p-6 rounded-[32px] border border-slate-100 relative">
           <img src={match.other_avatar} className="w-16 h-16 rounded-[24px] object-cover border-4 border-white shadow-xl" alt="" referrerPolicy="no-referrer" />
           <div className="flex-1">
             <h4 className="text-xl font-display italic text-indigo-950 mb-1">{match.other_name}</h4>
             <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-black text-lg italic">Rp {Number(match.tarif || 0).toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {match.session_duration || 60} Menit</span>
             </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-3 px-1">Tentukan Waktu</label>
              <input 
                type="datetime-local" 
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border-none p-5 rounded-[24px] focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 shadow-inner appearance-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-3 px-1">Jumlah Sesi</label>
              <div className="flex items-center bg-slate-50 rounded-[24px] p-2 shadow-inner">
                <button 
                  type="button" 
                  onClick={() => setSessionCount(Math.max(1, sessionCount - 1))}
                  className="w-12 h-12 flex items-center justify-center text-indigo-600 hover:bg-white rounded-2xl transition-all"
                >-</button>
                <input 
                  type="number" 
                  value={sessionCount} 
                  onChange={e => setSessionCount(Math.max(1, Number(e.target.value)))}
                  className="flex-1 bg-transparent border-none text-center font-bold text-slate-700 focus:ring-0"
                />
                <button 
                  type="button" 
                  onClick={() => setSessionCount(sessionCount + 1)}
                  className="w-12 h-12 flex items-center justify-center text-indigo-600 hover:bg-white rounded-2xl transition-all"
                >+</button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Biaya Pengajaran ({sessionCount} Sesi)</span>
              <span className="text-slate-900 font-bold">Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Total Durasi Belajar</span>
              <span className="text-slate-900 font-bold">{sessionCount * (match.session_duration || 60)} Menit</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-medium pb-2">
              <span>Biaya Admin Sistem</span>
              <span className="text-indigo-600 font-black">Rp {adminFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-display italic text-indigo-600 pt-4 border-t border-slate-100">
              <span className="text-slate-900 not-italic font-bold text-sm uppercase tracking-widest">Total Pembayaran</span>
              <span>Rp {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-6 rounded-[28px] font-bold shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Mengirim Data...' : 'Konfirmasi Reservasi'} <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ReviewModal({ booking, user, onClose, onComplete }: { booking: Booking, user: AppUser, onClose: () => void, onComplete: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          reviewerId: user.id,
          revieweeId: user.role === 'murid' ? booking.guru_id : (booking as any).murid_id || 0,
          rating,
          comment
        })
      });
      if (res.ok) {
        alert("Ulasan terkirim!");
        onComplete();
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Gagal mengirim ulasan.");
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-all"><X size={24}/></button>
        
        <div className="text-center mb-8">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <Star size={32} fill="currentColor" />
           </div>
           <h3 className="text-2xl font-display italic text-slate-900">Berikan Penilaian</h3>
           <p className="text-sm text-slate-500 mt-1">Gimana pengalaman belajarmu bersama {booking.other_name}?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} type="button" 
                onClick={() => setRating(star)}
                className={`p-2 transition-transform active:scale-90 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
              >
                <Star size={36} fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>

          <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 px-1">Ulasan Tertulis</label>
             <textarea 
               value={comment} onChange={e => setComment(e.target.value)}
               placeholder="Bagikan pengalamanmu..."
               className="w-full bg-slate-50 border-none p-5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 h-32 resize-none shadow-inner"
               required
             />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Ulasan'} <Send size={18} />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function SessionsView({ user, setView }: { user: AppUser, setView: (v: any) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kumpulSessions, setKumpulSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebookData, setRebookData] = useState<any>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewedIds, setReviewedIds] = useState<number[]>([]);

  useEffect(() => {
    // Fetch regular bookings
    fetch(`/api/bookings/${user.id}`).then(res => res.json()).then(data => {
      setBookings(data);
      setLoading(false);
      
      // Check which completed bookings have been reviewed
      const completed = data.filter((b: any) => b.status === 'completed');
      completed.forEach(async (b: any) => {
        const res = await fetch(`/api/reviews/check/${b.id}/${user.id}`);
        const result = await res.json();
        if (result.hasReviewed) {
          setReviewedIds(prev => [...prev, b.id]);
        }
      });
    });

    // Fetch KumpulGuru sessions
    fetch('/api/openplay/sessions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sessions) {
          const filtered = data.sessions.filter((s: any) => {
            if (user.role === 'guru') {
              return s.guru_id === user.id;
            } else {
              return s.participants.some((p: any) => p.murid_id === user.id);
            }
          });
          setKumpulSessions(filtered);
        }
      })
      .catch(err => console.error("Error fetching my KumpulGuru sessions:", err));
  }, [user.id, user.role]);

  const handleRebook = async (e: React.FormEvent) => {
    e.preventDefault();
    const date = (e.target as any).session_date.value;
    if (!date) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muridId: user.id,
          guruId: rebookData.guru_id,
          matchId: rebookData.match_id,
          amount: rebookData.amount,
          sessionCount: rebookData.session_count,
          sessionDate: date
        })
      });

      if (res.ok) {
        alert("Pesanan terkirim! Menunggu konfirmasi tutor.");
        setRebookData(null);
        fetch(`/api/bookings/${user.id}`).then(res => res.json()).then(setBookings);
      }
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id: number, status: string) => {
    let endpoint = '';
    if (status === 'accepted') endpoint = 'accept';
    else if (status === 'cancelled') endpoint = 'cancel';
    else if (status === 'paid') endpoint = 'pay';
    else if (status === 'completed') endpoint = 'complete';

    await fetch(`/api/bookings/${id}/${endpoint}`, { method: 'POST' });
    fetch(`/api/bookings/${user.id}`).then(res => res.json()).then(setBookings);
  };

  const activeBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const history = bookings.filter(b => b.status === 'completed');

  const getStatusLabel = (status: BookingStatus) => {
    switch(status) {
      case 'requested': return { text: 'Menunggu Konfirmasi', color: 'bg-indigo-100 text-indigo-700' };
      case 'unpaid': return { text: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700' };
      case 'paid': return { text: 'Terbayar - Siap Belajar', color: 'bg-emerald-100 text-emerald-700' };
      case 'completed': return { text: 'Sesi Selesai', color: 'bg-slate-100 text-slate-700' };
      case 'cancelled': return { text: 'Dibatalkan', color: 'bg-rose-100 text-rose-700' };
      default: return { text: status, color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white overflow-hidden h-screen"
    >
      <header className="px-8 py-10 bg-white border-b border-slate-100">
          <h2 className="text-4xl font-display text-slate-900 italic tracking-tight mb-2">Manajemen Sesi</h2>
          <p className="text-sm text-slate-500 font-medium">Atur dan pantau semua jadwal belajar terbukamu.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12">
        {user.role === 'guru' && (
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border border-teal-850 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-950/20">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 text-emerald-300">
                <Users size={12} className="text-emerald-300 fill-emerald-300 animate-pulse" />
                Fitur KumpulGuru • Sesi Belajar Rame-Rame
              </span>
              <h4 className="text-2xl font-display font-medium italic text-white">Buka Kelas Patungan Rame-Rame!</h4>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                Ingin mengajar banyak murid sekaligus? Buat sesi belajar bersama KumpulGuru, tentukan materi, lokasi kota, dan tarif patungan bersahabat per murid!
              </p>
            </div>
            <button 
              onClick={() => setView('openplay')}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/40 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              Kelola Sesi KumpulGuru
            </button>
          </div>
        )}

        {user.role === 'guru' && user.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-lg shadow-amber-200/20 shrink-0">
               <Shield size={32} />
            </div>
            <div>
               <h4 className="text-xl font-display italic text-amber-900 mb-1">Verifikasi Sedang Berjalan</h4>
               <p className="text-sm text-amber-700/80 leading-relaxed">
                 Dokumen (KTP & KTM) Anda sedang dalam antrean verifikasi oleh tim Admin. 
                 Setelah diverifikasi, profil Anda akan dipublikasikan dan Anda dapat menerima permintaan sesi belajar.
               </p>
            </div>
          </div>
        )}

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
               <Calendar size={20} />
            </div>
            <h3 className="text-xl font-display italic text-slate-900">Agenda Terdekat</h3>
          </div>

          {loading ? (
             <div className="space-y-4">
                {[1,2].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-[32px]"></div>)}
             </div>
          ) : activeBookings.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {activeBookings.map(b => {
                const badge = getStatusLabel(b.status);
                return (
                  <motion.div 
                    layout key={b.id} 
                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-bl-[20px] ${badge.color}`}>
                      {badge.text}
                    </div>
                    <div className="flex items-center gap-6 mb-8 mt-2">
                      <img 
                        src={b.other_avatar || DEFAULT_AVATAR} 
                        className="w-16 h-16 rounded-[24px] object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105" 
                        alt="" referrerPolicy="no-referrer" 
                      />
                      <div>
                        <h4 className="text-2xl font-display italic text-slate-900 tracking-tight leading-none mb-2">{b.other_name}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-400"/> {new Date(b.session_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          <span className="flex items-center gap-1.5 text-indigo-600"><Users size={14}/> {b.session_count || 1} Sesi</span>
                          <span className="flex items-center gap-1.5 text-indigo-600"><DollarSign size={14}/> IDR {(b.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {user.role === 'murid' && b.status === 'unpaid' && (
                        <button 
                          onClick={() => updateStatus(b.id, 'paid')}
                          className="flex-1 bg-indigo-600 text-white py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                        >Bayar Sekarang</button>
                      )}

                      {user.role === 'guru' && b.status === 'requested' && (
                        <>
                          <button 
                            onClick={() => updateStatus(b.id, 'accepted')}
                            className="flex-[2] bg-emerald-600 text-white py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                          >Terima Jadwal</button>
                          <button 
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            className="flex-1 bg-white text-rose-500 border border-rose-100 py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                          >Tolak</button>
                        </>
                      )}

                      {user.role === 'guru' && b.status === 'paid' && (
                        <button 
                          onClick={() => updateStatus(b.id, 'completed')}
                          className="w-full bg-emerald-600 text-white py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                        >Selesaikan Sesi & Cairkan Dana</button>
                      )}
                      
                      {b.status === 'requested' && user.role === 'murid' && (
                         <button 
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            className="w-full bg-slate-50 text-slate-400 py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest hover:text-rose-500 transition-all"
                         >Batalkan Permintaan</button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center max-w-lg mx-auto">
               <Calendar size={40} className="mx-auto mb-4 text-slate-200" />
               <p className="text-slate-400 font-medium italic">Tidak ada jadwal belajar yang aktif saat ini.</p>
            </div>
          )}
        </section>

        {/* Agenda KumpulGuru Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                 <Users size={20} />
              </div>
              <div>
                <h3 className="text-xl font-display italic text-slate-900">Agenda KumpulGuru</h3>
                <p className="text-xs text-slate-400 font-semibold">Sesi belajar rame-rame patungan terjadwal Anda</p>
              </div>
            </div>
            <button 
              onClick={() => setView('openplay')}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-4 py-2.5 rounded-2xl hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              Cari / Buka Sesi Baru <ChevronRight size={12} />
            </button>
          </div>

          {loading ? (
             <div className="space-y-4">
                <div className="h-32 bg-slate-50 animate-pulse rounded-[32px]"></div>
             </div>
          ) : kumpulSessions.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {kumpulSessions.map(s => {
                return (
                  <motion.div 
                    layout key={`kumpul-${s.id}`} 
                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden group flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-bl-[20px] bg-emerald-100 text-emerald-800 border-l border-b border-emerald-200/40">
                      KumpulGuru
                    </div>
                    
                    <div className="space-y-4 mb-6 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {s.subject}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/30">
                          <MapPin size={10} className="text-rose-500 fill-rose-100" />
                          {s.lokasi || 'Jakarta'}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-display italic text-slate-950 font-bold leading-tight group-hover:text-indigo-600 transition-colors">
                          {s.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 font-medium line-clamp-2 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-3">
                        <img 
                          src={s.guru_avatar || DEFAULT_AVATAR} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100" 
                          alt="" referrerPolicy="no-referrer" 
                        />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {user.role === 'guru' ? 'Anda (Tutor)' : 'Tutor Pengajar'}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 leading-none">{s.guru_name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jadwal Sesi</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1">
                          <Clock size={12} className="text-indigo-500" />
                          {new Date(s.session_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-emerald-500" />
                        {s.participant_count} / {s.capacity} Murid Terdaftar
                      </span>
                      <span className="text-emerald-600">
                        {user.role === 'guru' ? 'Sesi Dibuka oleh Anda' : `Patungan: IDR ${(s.cost || 0).toLocaleString()}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50/50 p-10 rounded-[40px] border border-dashed border-slate-200/60 text-center max-w-lg mx-auto">
               <Users size={32} className="mx-auto mb-3 text-slate-300" />
               <p className="text-slate-400 font-medium italic text-sm">
                 {user.role === 'guru' 
                   ? 'Anda belum pernah membuka sesi KumpulGuru.' 
                   : 'Anda belum mendaftar di sesi KumpulGuru manapun untuk belajar bersama.'}
               </p>
               <button 
                 onClick={() => setView('openplay')}
                 className="mt-4 inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-indigo-600 font-bold text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl border border-slate-200/80 shadow-sm transition-all cursor-pointer"
               >
                 {user.role === 'guru' ? 'Mulai Buka Sesi' : 'Temukan Sesi Mabar'}
               </button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-slate-400" />
            <h3 className="font-bold text-slate-400">Riwayat Selesai</h3>
          </div>
          <div className="space-y-4">
            {history.map(b => (
              <div key={b.id} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 opacity-70">
                <img src={b.other_avatar || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm leading-none mb-1">{b.other_name}</h4>
                  <p className="text-[10px] text-slate-500">{new Date(b.session_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex flex-col gap-1 items-end">
                   {!reviewedIds.includes(b.id) ? (
                     <button 
                       onClick={() => setReviewBooking(b)}
                       className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1"
                     ><Star size={10} fill="currentColor" /> Beri Ulasan</button>
                   ) : (
                     <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Sudah Diulas</span>
                   )}
                   {user.role === 'murid' && (
                     <button 
                       onClick={() => setRebookData(b)}
                       className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100"
                     >Pesan Lagi</button>
                   )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewBooking && (
          <ReviewModal 
            booking={reviewBooking} 
            user={user} 
            onClose={() => setReviewBooking(null)} 
            onComplete={() => setReviewedIds([...reviewedIds, reviewBooking.id])} 
          />
        )}
      </AnimatePresence>

      {/* Rebook Modal */}
      <AnimatePresence>
        {rebookData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setRebookData(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              ><X size={20}/></button>
              
              <div className="text-center mb-8 pt-4">
                <img 
                  src={rebookData.other_avatar} 
                  className="w-20 h-20 rounded-2xl mx-auto object-cover mb-4 ring-4 ring-indigo-50" 
                  alt="" 
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-xl font-bold text-slate-900">Pesan Sesi Baru</h3>
                <p className="text-sm text-slate-500 mt-1">Bersama {rebookData.other_name}</p>
              </div>

              <form onSubmit={handleRebook} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Pilih Jadwal</label>
                  <input 
                    name="session_date" 
                    type="datetime-local" 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" 
                    required 
                  />
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-900/40 uppercase">Biaya Sesi</span>
                  <span className="text-lg font-display text-indigo-600">Rp {(rebookData.amount || 0).toLocaleString()}</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Konfirmasi Pesanan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 rounded-[24px] border-2 border-dashed border-slate-100 text-center opacity-40">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function AdminView({ user, onLogout }: { user: AppUser, onLogout: () => void }) {
  const [reports, setReports] = useState<any>(null);
  const [gurus, setGurus] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchGurus();
  }, []);

  const fetchStats = () => {
    fetch('/api/admin/reports').then(res => res.json()).then(setReports);
  };
  const fetchGurus = () => {
    fetch('/api/admin/gurus').then(res => res.json()).then(data => { setGurus(data); setLoading(false); });
  };

  const handleVerify = async (id: number, status: string) => {
    await fetch(`/api/admin/verify/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchGurus();
    fetchStats();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white overflow-hidden h-screen"
    >
      <header className="px-10 py-12 bg-white border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-display text-slate-900 italic tracking-tight mb-2">Panel Administrasi</h2>
           <p className="text-sm text-slate-500 font-medium">Monitoring sistem dan verifikasi kurikulum tutor.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-200 shadow-sm transition-all hover:scale-105">System Admin Root</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20 space-y-12 pb-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatCard icon={<Users className="text-indigo-600"/>} label="Total Penelusur" value={reports?.totalUsers || 0} />
           <StatCard icon={<Heart className="text-rose-600"/>} label="Match Terbentuk" value={reports?.totalMatches || 0} />
           <StatCard icon={<Shield size={20} className="text-amber-600"/>} label="Tutor Belum Verifikasi" value={gurus.filter(g => g.status === 'pending').length} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5 border border-slate-100">
                 <Shield size={20} />
              </div>
              <h3 className="text-2xl font-display italic text-slate-900">Antrian Verifikasi Tutor</h3>
            </div>
            <p className="text-[10px] font-black p-2 bg-amber-50 text-amber-600 rounded-lg uppercase tracking-widest">Tindakan Diperlukan</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-slate-300">
                <div className="w-10 h-10 border-4 border-slate-50 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : gurus.filter(g => g.status === 'pending').length === 0 ? (
               <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-slate-100">
                  <CheckCircle size={40} className="mx-auto mb-4 text-emerald-200" />
                  <p className="font-medium text-slate-400 italic">Antrian bersih! Semua tutor telah diverifikasi.</p>
               </div>
            ) : gurus.filter(g => g.status === 'pending').map(g => (
              <motion.div 
                layout key={g.id} 
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col md:flex-row gap-10 group"
              >
                <div className="md:w-1/4">
                  <img 
                    src={g.avatar_url || DEFAULT_AVATAR} 
                    className="w-full h-56 rounded-[32px] object-cover ring-8 ring-slate-50 shadow-xl transition-transform group-hover:scale-[1.02]" 
                    alt="" referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="flex-1 space-y-8">
                  <div>
                    <h4 className="text-3xl font-display italic text-slate-900 mb-2 leading-none">{g.full_name}</h4>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">{g.kampus} • {g.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dokumen Identitas (KTP & KTM)</h5>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                           <p className="text-[10px] text-center font-bold text-slate-400 uppercase">KTP</p>
                           <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner group/img relative">
                              {g.ktp_url ? (
                                <img src={g.ktp_url} className="w-full h-full object-cover" alt="KTP" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200"><Shield size={32}/></div>
                              )}
                              <a href={g.ktp_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Buka di Tab Baru</a>
                           </div>
                        </div>
                        <div className="flex-1 space-y-2">
                           <p className="text-[10px] text-center font-bold text-slate-400 uppercase">KTM</p>
                           <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner group/img relative">
                              {g.ktm_url ? (
                                <img src={g.ktm_url} className="w-full h-full object-cover" alt="KTM" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200"><Book size={32}/></div>
                              )}
                              <a href={g.ktm_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Buka di Tab Baru</a>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bio & Keahlian</h5>
                      <p className="text-xs text-slate-600 italic leading-relaxed mb-4 ring-l-4 ring-slate-100 pl-4">"{g.bio}"</p>
                      <div className="flex flex-wrap gap-2">
                        {g.subjects?.split(',').map((s, i) => (
                           <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => handleVerify(g.id, 'verified')}
                      className="flex-1 bg-emerald-600 text-white py-5 rounded-[24px] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Terima & Publikasi
                    </button>
                    <button 
                      onClick={() => handleVerify(g.id, 'rejected')}
                      className="flex-1 bg-rose-50 text-rose-600 py-5 rounded-[24px] font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Tolak Berkas
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: number | string }) {
  return (
    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
       <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
       <div className="relative">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
           {icon}
         </div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
         <p className="text-4xl font-display italic text-slate-900 tracking-tighter">{value}</p>
       </div>
    </div>
  );
}

function ProfileView({ user, onLogout, setUser }: { user: AppUser, onLogout: () => void, setUser: (u: AppUser) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'reviews'>('profile');
  const [profile, setProfile] = useState<AppUser>(user);
  const [name, setName] = useState(user.full_name);
  const [bio, setBio] = useState(user.bio || '');
  const [kampus, setKampus] = useState(user.kampus || '');
  const [tarif, setTarif] = useState(user.tarif || 0);
  const [sessionDuration, setSessionDuration] = useState(user.session_duration || 60);
  const [profilePicture, setProfilePicture] = useState(user.profile_picture || '');
  
  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState<{id: number, nama_mapel: string}[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(user.subjects_ids || []);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/subjects').then(res => res.json()).then(setAllSubjects);
    fetch(`/api/reviews/user/${user.id}`).then(res => res.json()).then(setReviews);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          full_name: name, 
          bio, 
          kampus,
          tarif, 
          session_duration: sessionDuration,
          avatar_url: profilePicture,
          subjectIds: selectedSubjects 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Profil berhasil diperbarui!");
        const updatedUser = { 
          ...user, 
          full_name: name, 
          bio, 
          kampus, 
          tarif, 
          session_duration: sessionDuration, 
          profile_picture: profilePicture 
        };
        localStorage.setItem('swipeguru_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfile(updatedUser);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (newPassword !== confirmPassword) {
      setSecurityError("Konfirmasi password tidak cocok");
      return;
    }
    if (newPassword.length < 6) {
      setSecurityError("Password baru minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess("Password berhasil diubah!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityError(data.message || "Gagal mengubah password");
      }
    } catch (err) { setSecurityError("Terjadi kesalahan sistem."); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleSubject = (id: number) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white overflow-hidden h-screen"
    >
      <header className="px-10 py-12 bg-white border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-8">
           <div className="relative group">
              <img 
                src={profilePicture || DEFAULT_AVATAR} 
                className="w-24 h-24 rounded-[32px] object-cover ring-4 ring-slate-50 shadow-2xl transition-transform group-hover:scale-[1.02]" 
                alt={user.full_name} 
              />
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:bg-indigo-700 transition-all border-4 border-white hover:scale-110 active:scale-95">
                 <Camera size={18} />
                 <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
           </div>
           <div>
              <h2 className="text-4xl font-display text-slate-900 italic tracking-tight mb-2 leading-none">{name}</h2>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
                 <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg border border-amber-100/50">
                    <Star size={10} fill="currentColor" />
                    <span className="text-xs font-bold">{user.avg_rating ? user.avg_rating.toFixed(1) : '0.0'}</span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{user.email}</span>
              </div>
           </div>
        </div>
        <button onClick={onLogout} className="px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 flex items-center gap-2">
           <LogOut size={16} /> Keluar Sistem
        </button>
      </header>

      <div className="flex px-10 pt-8 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Informasi Profil
          {activeTab === 'profile' && <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'security' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Keamanan & Password
          {activeTab === 'security' && <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Ulasan Saya ({reviews.length})
          {activeTab === 'reviews' && <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'profile' ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleUpdateProfile} className="space-y-12 pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <section>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Nama Tampilan</label>
                    <input 
                      type="text" value={name} onChange={e => setName(e.target.value)} 
                      className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
                    />
                  </section>
                  
                  {user.role === 'guru' && (
                    <section>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Kampus</label>
                      <select 
                        value={kampus} 
                        onChange={e => setKampus(e.target.value)} 
                        className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 shadow-sm appearance-none"
                      >
                        <option value="" disabled>Pilih Kampus</option>
                        <option value="Universitas Indonesia (UI)">Universitas Indonesia (UI)</option>
                        <option value="Institut Teknologi Bandung (ITB)">Institut Teknologi Bandung (ITB)</option>
                        <option value="Universitas Gadjah Mada (UGM)">Universitas Gadjah Mada (UGM)</option>
                        <option value="Universitas Airlangga (UNAIR)">Universitas Airlangga (UNAIR)</option>
                        <option value="Institut Pertanian Bogor (IPB)">Institut Pertanian Bogor (IPB)</option>
                        <option value="Universitas Padjadjaran (UNPAD)">Universitas Padjadjaran (UNPAD)</option>
                        <option value="Universitas Diponegoro (UNDIP)">Universitas Diponegoro (UNDIP)</option>
                        <option value="Universitas Brawijaya (UB)">Universitas Brawijaya (UB)</option>
                        <option value="Bina Nusantara University (BINUS)">Bina Nusantara University (BINUS)</option>
                        <option value="Universitas Telkom">Universitas Telkom</option>
                        <option value="Universitas Hasanuddin (UNHAS)">Universitas Hasanuddin (UNHAS)</option>
                        <option value="Universitas Sumatera Utara (USU)">Universitas Sumatera Utara (USU)</option>
                        <option value="Universitas Sebelas Maret (UNS)">Universitas Sebelas Maret (UNS)</option>
                        <option value="Universitas Pendidikan Indonesia (UPI)">Universitas Pendidikan Indonesia (UPI)</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </section>
                  )}

                  {user.role === 'guru' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <section>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Tarif Mengajar / Sesi</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                          <input 
                            type="number" value={tarif} onChange={e => setTarif(Number(e.target.value))} 
                            className="w-full p-5 pl-12 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 shadow-sm"
                          />
                        </div>
                      </section>
                      <section>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Durasi / Sesi (Menit)</label>
                        <input 
                          type="number" value={sessionDuration} onChange={e => setSessionDuration(Number(e.target.value))} 
                          className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 shadow-sm"
                        />
                      </section>
                    </div>
                  )}
                </div>

                <section>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Bio & Pengalaman Belajar</label>
                  <textarea 
                    value={bio} onChange={e => setBio(e.target.value)} rows={6}
                    className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 shadow-sm italic leading-relaxed"
                    placeholder="Ceritakan sedikit tentang latar belakang pendidikan atau gaya belajarmu..."
                  />
                </section>
              </div>

              {user.role === 'guru' && (
                <section>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-5 px-1">Keahlian Materi (Subjects)</label>
                  <div className="flex flex-wrap gap-3">
                    {allSubjects.map(s => (
                      <button
                        key={s.id} type="button"
                        onClick={() => toggleSubject(s.id)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-all ${selectedSubjects.includes(s.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                      >
                        {s.nama_mapel}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="pt-10 border-t border-slate-100">
                 <button 
                  type="submit" disabled={loading}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
                >
                  {loading ? 'Menyimpan...' : 'Perbarui Profil'} <ArrowRight size={20} />
                </button>
              </div>
            </motion.form>
          ) : activeTab === 'security' ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleUpdatePassword} className="space-y-10 max-w-xl pb-20"
            >
              <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 flex items-center gap-6 mb-4">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h3 className="font-display italic text-indigo-950 text-xl">Lindungi Akunmu</h3>
                    <p className="text-xs text-indigo-600 font-medium leading-relaxed">Pastikan password anda kuat dan tidak digunakan di platform lain untuk keamanan maksimal.</p>
                 </div>
              </div>

              <div className="space-y-8">
                <section className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Password Saat Ini</label>
                  <input 
                    type={showCurrentPass ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} 
                    className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium pr-14 shadow-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-5 bottom-5 text-slate-300 hover:text-indigo-600 transition-colors">
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Password Baru</label>
                    <input 
                      type={showNewPass ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} 
                      className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium pr-14 shadow-sm"
                      required
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-5 bottom-5 text-slate-300 hover:text-indigo-600 transition-colors">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </section>
                  <section className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Konfirmasi</label>
                    <input 
                      type={showConfirmPass ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full p-5 bg-white rounded-[24px] border border-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium pr-14 shadow-sm"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-5 bottom-5 text-slate-300 hover:text-indigo-600 transition-colors">
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </section>
                </div>
              </div>

              <AnimatePresence>
                {securityError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 text-xs font-bold">
                    <XCircle size={18} /> {securityError}
                  </motion.div>
                )}
                {securitySuccess && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle size={18} /> {securitySuccess}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white p-6 rounded-[28px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? 'Memproses...' : 'Simpan Perubahan Keamanan'} <ShieldCheck size={20} />
              </button>
            </motion.form>
          ) : (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="space-y-8 pb-20"
            >
               {reviews.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-slate-100 max-w-lg">
                    <Star size={40} className="mx-auto mb-4 text-slate-200" />
                    <p className="font-medium text-slate-400 italic">Anda belum menerima ulasan yang dipublikasikan.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={r.reviewer_avatar} 
                            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50" 
                            alt="" referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                             <h4 className="font-display italic text-xl text-slate-900">{r.reviewer_name}</h4>
                             <div className="flex items-center gap-1.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />
                                ))}
                             </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 p-5 rounded-3xl border border-slate-100">"{r.comment}"</p>
                      </div>
                    ))}
                 </div>
               )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BottomNav({ currentView, setView, role }: { currentView: string, setView: (v: any) => void, role: string }) {
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-white/85 backdrop-blur-xl border-t border-slate-100 py-3.5 px-4 flex justify-around items-center z-40">
      {role !== 'guru' && role !== 'admin' && (
        <NavBtn active={currentView === 'hub'} onClick={() => setView('hub')} icon={<Layers size={22}/>} label="Hub" />
      )}
      {role !== 'guru' && role !== 'admin' && (
        <NavBtn active={currentView === 'swipe'} onClick={() => setView('swipe')} icon={<Flame size={22}/>} label="Tutor" />
      )}
      {role !== 'guru' && role !== 'admin' && (
        <NavBtn active={currentView === 'courses'} onClick={() => setView('courses')} icon={<Book size={22}/>} label="CourseGuru" />
      )}
      {role !== 'admin' && (
        <NavBtn active={currentView === 'matches' || currentView === 'chat'} onClick={() => setView('matches')} icon={<MessageCircle size={22}/>} label="Chat" />
      )}
      {role !== 'admin' && (
        <NavBtn active={currentView === 'openplay'} onClick={() => setView('openplay')} icon={<Users size={22}/>} label="Kumpul" />
      )}
      {role !== 'admin' && (
        <NavBtn active={currentView === 'sessions'} onClick={() => setView('sessions')} icon={<Calendar size={22}/>} label="Jadwal" />
      )}
      {role === 'admin' ? (
        <NavBtn active={currentView === 'admin'} onClick={() => setView('admin')} icon={<Shield size={22}/>} label="Admin" />
      ) : (
        <NavBtn active={currentView === 'profile'} onClick={() => setView('profile')} icon={<User size={22}/>} label="Profil" />
      )}
    </nav>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}
    >
      {icon}
      <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      {active && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />}
    </button>
  );
}
