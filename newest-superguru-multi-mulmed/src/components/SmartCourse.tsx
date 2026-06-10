import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playCorrectSound, playIncorrectSound, playSuccessSound } from '../utils/audio';
import { 
  Book, Play, Lock, CheckCircle, ArrowLeft, ArrowRight, Star,
  Award, RefreshCw, Smartphone, Sparkles, Check, X, Bookmark,
  TrendingUp, Users, Video, Clock
} from 'lucide-react';

// --- Shared Types ---
export const extractYouTubeId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
};

export interface Course {
  id: number;
  title: string;
  description: string;
  badge: string;
  instructor: string;
  price: number;
  image_url: string;
  subject: string;
  lesson_count: number;
  is_purchased: boolean | number;
  completed_count?: number;
}

export interface QuizQuestion {
  id: number;
  lesson_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D' | string;
  explanation: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  type: 'video' | 'quiz';
  title: string;
  content_url: string;
  order_index: number;
  completed: boolean;
  score?: number | null;
  total_questions?: number | null;
  questions?: QuizQuestion[];
}

interface SmartCourseProps {
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
  onBackToHub?: () => void;
}

export default function SmartCourse({ user, onBackToHub }: SmartCourseProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseDetails, setCourseDetails] = useState<{ course: Course; lessons: Lesson[] } | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswersTrack, setQuizAnswersTrack] = useState<{questionIdx: number, selected: string, isCorrect: boolean}[]>([]);

  // Fetch all courses on load
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses?userId=${user.id}`);
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error("Error loading courses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user.id]);

  // Fetch single course details
  const fetchCourseDetails = async (courseId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setCourseDetails(data);
        setSelectedCourseId(courseId);
        setActiveLessonId(null);
        setActiveLesson(null);
      }
    } catch (e) {
      console.error("Error loading course details:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single lesson for player
  const fetchLesson = async (lessonId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/lesson/${lessonId}?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setActiveLesson(data);
        setActiveLessonId(lessonId);
        // Reset quiz states when opening a quiz lesson
        if (data.type === 'quiz') {
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setQuizScore(0);
          setQuizFinished(false);
          setQuizAnswersTrack([]);
        }
      } else {
        alert(data.message || "Gagal memuat materi.");
      }
    } catch (e) {
      console.error("Error loading lesson:", e);
    } finally {
      setLoading(false);
    }
  };

  // Process visual-simulated buy
  const handlePurchase = async (course: Course) => {
    setPurchaseLoading(true);
    try {
      const res = await fetch('/api/courses/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId: course.id })
      });
      if (res.ok) {
        setShowPurchaseSuccess(true);
        playSuccessSound();
        setTimeout(() => {
          setShowPurchaseSuccess(false);
          fetchCourseDetails(course.id);
          fetchCourses();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal melakukan pembelian virtual.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Complete Video Lesson
  const handleCompleteVideo = async () => {
    if (!activeLesson) return;
    try {
      const res = await fetch(`/api/courses/lesson/${activeLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        // Reload details to show completed state
        if (selectedCourseId) {
          fetchCourseDetails(selectedCourseId);
        }
        setActiveSection('details');
        alert("Selamat! Kepingan progres video berhasil dicatat. Yuk lanjutkan belajar!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Quiz answers
  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Answered already
    setSelectedOption(option);
    
    const currentQ = activeLesson?.questions?.[currentQuestionIndex];
    if (!currentQ) return;
    
    const isCorrect = option === currentQ.correct_option;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    setQuizAnswersTrack(prev => [...prev, {
      questionIdx: currentQuestionIndex,
      selected: option,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (!activeLesson?.questions) return;
    if (currentQuestionIndex + 1 < activeLesson.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleSubmitQuizScore = async () => {
    if (!activeLesson) return;
    try {
      const totalQ = activeLesson.questions?.length || 0;
      const res = await fetch(`/api/courses/lesson/${activeLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          score: quizScore,
          total_questions: totalQ
        })
      });
      if (res.ok) {
        if (selectedCourseId) {
          fetchCourseDetails(selectedCourseId);
        }
        setActiveSection('details');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [activeSection, setActiveSection] = useState<'list' | 'details' | 'player'>('list');

  // Handle view flows
  const openCourse = (courseId: number) => {
    fetchCourseDetails(courseId);
    setActiveSection('details');
  };

  const openLesson = (lessonId: number) => {
    fetchLesson(lessonId);
    setActiveSection('player');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden relative">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Dynamic notice bubble */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 inset-x-0 mx-auto w-fit max-w-sm bg-slate-900 text-white px-5 py-4 rounded-[20px] z-[110] shadow-2xl flex items-center gap-3 border border-slate-800"
          >
            <Sparkles size={16} className="text-rose-450 fill-rose-450 shrink-0 select-none" />
            <span className="text-xs font-semibold flex-1 leading-snug">{noticeMessage}</span>
            <button 
              onClick={() => setNoticeMessage(null)}
              className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-white bg-transparent border-0 select-none cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success payment overlay */}
      <AnimatePresence>
        {showPurchaseSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-white"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }}
              className="bg-white text-slate-900 rounded-[40px] p-10 max-w-sm text-center shadow-2xl relative"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 animate-bounce">
                <Check size={40} className="stroke-[3]" />
              </div>
              <h3 className="text-2xl font-display italic text-indigo-950 font-black">Pembelian Berhasil!</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Kursus premium telah diaktifkan ke akun muridmu. Selamat menjelajah kurikulum interaktif!
              </p>
              <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.8 }}
                  className="h-full bg-emerald-500"
                ></motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Navigation header */}
        <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {selectedClass !== null && activeSection !== 'list' && (
              <button 
                onClick={() => {
                  if (activeSection === 'player') {
                    setActiveSection('details');
                  } else {
                    setActiveSection('list');
                  }
                }}
                className="p-2.5 hover:bg-slate-50 rounded-2xl text-slate-500 transition-all active:scale-95 border border-slate-100"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-md tracking-wider">
                  {selectedClass === null ? "Portal Kelas" : `Kelas ${selectedClass} SD`}
                </span>
                <span className="text-xs font-bold text-slate-400">• Kurikulum Merdeka</span>
                {selectedClass !== null && activeSection === 'list' && (
                  <button 
                    onClick={() => {
                      setSelectedClass(null);
                      setNoticeMessage("Silakan pilih jenjang kelas bimbingan mandiri kamu.");
                    }}
                    className="text-[10px] text-rose-700 bg-rose-50 hover:bg-rose-100 border-0 px-2.5 py-0.5 rounded-md ml-2 transition-all cursor-pointer font-bold select-none whitespace-nowrap"
                  >
                    Ganti Kelas
                  </button>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-display font-medium text-rose-950 italic">
                {selectedClass === null && "CourseGuru Portal Belajar"}
                {selectedClass !== null && activeSection === 'list' && "CourseGuru Belajar Mandiri"}
                {selectedClass !== null && activeSection === 'details' && courseDetails?.course.title}
                {selectedClass !== null && activeSection === 'player' && activeLesson?.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBackToHub && (
              <button 
                onClick={onBackToHub}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 bg-white text-xs font-semibold hover:bg-slate-50 transition-all hover:border-rose-300 shadow-sm flex items-center gap-1.5"
              >
                <Smartphone size={14} className="text-rose-500" />
                Kembali ke Hub
              </button>
            )}
          </div>
        </header>

        {/* Content body based on view */}
        <div className="flex-1 overflow-hidden relative">
          {loading && !activeLesson && !courseDetails && selectedClass !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-50 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Menata Kurikulum...</span>
            </div>
          )}

          {/* 0. CLASS LEVEL SELECTION DASHBOARD */}
          {selectedClass === null && (
            <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-rose-950/10">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-rose-450 via-transparent to-transparent rounded-full scale-125"></div>
                </div>
                <div className="max-w-2xl space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-rose-300 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles size={12} className="text-rose-400 fill-rose-400 animate-pulse" />
                    Belajar Atraktif Mandiri
                  </div>
                  <h1 className="text-3xl md:text-5xl font-display tracking-tight font-black leading-tight italic">
                    Pilih Kelas Kamu,<br/>Mulai Belajar Mandiri!
                  </h1>
                  <p className="text-rose-100/80 text-sm md:text-base font-semibold max-w-xl leading-relaxed">
                    Akses ringkasan video interaktif berbahasa Indonesia, lalu uji ketangguhan pemahaman lewat evaluasi set kuis digital dengan penjelasan pembahasan instan.
                  </p>
                </div>
              </div>

              {/* Class options grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-black italic text-rose-950">Pilih Jenjang Belajar</h3>
                  <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">1 Jenjang Aktif</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Kelas 6 SD (Ready & Productive) */}
                  <motion.div 
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-[32px] border-2 border-rose-100 shadow-md overflow-hidden p-6 flex flex-col justify-between space-y-6 group hover:shadow-xl hover:shadow-rose-100/60 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                        6
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Terbuka &amp; Aktif</span>
                        <h4 className="text-xl font-display font-black text-rose-950 leading-tight"> Kelas 6 SD </h4>
                        <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                          Pembelajaran modular Matematika Bangun Ruang, Sains Tata Surya, dan Kosakata Bahasa Inggris teruji.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedClass('6');
                        setNoticeMessage("Berhasil membuka materi CourseGuru Kelas 6 SD. Silakan pilih subjek!");
                        setTimeout(() => setNoticeMessage(null), 4000);
                      }}
                      className="w-full py-3 bg-rose-600 group-hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      Mulai Kelas <ArrowRight size={12} />
                    </button>
                  </motion.div>

                  {/* Card 2: Kelas 5 SD */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-slate-55/60 rounded-[32px] border border-slate-200/50 p-6 flex flex-col justify-between space-y-6 opacity-75 group transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                        5
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Segera Hadir</span>
                        <h4 className="text-xl font-display font-medium text-slate-400 leading-tight"> Kelas 5 SD </h4>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Kurikulum Aritmatika Pecahan, Sejarah Kerajaan Indonesia, dan Sastra Tata Bahasa Indonesia dasar.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setNoticeMessage("Materi Kelas 5 SD sedang dikurasi oleh tim guru bimbingan privat CourseGuru.");
                        setTimeout(() => setNoticeMessage(null), 4000);
                      }}
                      className="w-full py-3 bg-slate-100 text-slate-550 hover:bg-slate-200 text-slate-500 border-0 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      Buka Materi <Lock size={12} />
                    </button>
                  </motion.div>

                  {/* Card 3: Kelas 4 SD */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-slate-55/60 rounded-[32px] border border-slate-200/50 p-6 flex flex-col justify-between space-y-6 opacity-75 group transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                        4
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Segera Hadir</span>
                        <h4 className="text-xl font-display font-medium text-slate-400 leading-tight"> Kelas 4 SD </h4>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Modul Dasar Alam Sekitar, Geometri Sudut Bidang, dan Belajar Bahasa Inggris Pintar dasar kelas 4.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setNoticeMessage("Modul dasar Kelas 4 SD sedang divalidasi kurikulumnya. Buka bimbingan privat SwipeGuru untuk tanya langsung!");
                        setTimeout(() => setNoticeMessage(null), 5000);
                      }}
                      className="w-full py-3 bg-slate-100 text-slate-550 hover:bg-slate-200 text-slate-500 border-0 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      Buka Materi <Lock size={12} />
                    </button>
                  </motion.div>

                  {/* Card 4: SMP & SMA */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-slate-55/60 rounded-[32px] border border-slate-200/50 p-6 flex flex-col justify-between space-y-6 opacity-75 group transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-md">
                        7-12
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Segera Hadir</span>
                        <h4 className="text-xl font-display font-medium text-slate-400 leading-tight"> SMP &amp; SMA Level </h4>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Simulasi Ujian Sekolah Komputer, Soal Potensi Skolastik UTBK SBMPTN, fisika, kimia, dan matematika lanjut.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setNoticeMessage("Modul bimbingan SMP & SMA sedang dijadwalkan. Silakan hubungi pengurus bimbingan untuk info lanjut!");
                        setTimeout(() => setNoticeMessage(null), 5000);
                      }}
                      className="w-full py-3 bg-slate-100 text-slate-550 hover:bg-slate-200 text-slate-500 border-0 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      Buka Materi <Lock size={12} />
                    </button>
                  </motion.div>

                </div>
              </div>
            </div>
          )}

          {/* 1. COURSE LISTING */}
          {activeSection === 'list' && selectedClass !== null && (
            <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-950/10">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent rounded-full scale-125"></div>
                </div>
                <div className="max-w-2xl space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles size={12} className="text-indigo-400" />
                    Pemberdayaan Mandiri • Kelas {selectedClass}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-display tracking-tight font-black leading-tight italic">
                    Belajar Atraktif,<br/>Kuasai Ujian Kelas {selectedClass} SD!
                  </h1>
                  <p className="text-indigo-100/80 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                    Tingkatkan pemahaman belajar mandirimu dengan menonton rangkuman video kreatif berbahasa Indonesia serta uji nyali pemahaman lewat simulasi Latihan Kuis Interaktif.
                  </p>
                </div>
              </div>

              {/* Course cards grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold italic text-slate-800">Daftar Mata Pelajaran</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">3 Modul Tersedia</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <motion.div 
                      key={course.id}
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                    >
                      {/* Course graphic image */}
                      <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0">
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-indigo-600/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg border border-white/10">
                            {course.badge}
                          </span>
                        </div>
                      </div>

                      {/* Card Content info */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <span>Oleh {course.instructor}</span>
                          </div>
                          <h4 className="text-lg font-display text-indigo-950 leading-tight group-hover:text-indigo-600 transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          {/* Progress Bar per Kursus */}
                          <div className="pt-2">
                            <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">
                              <span>Progres Belajar</span>
                              <span>{course.completed_count || 0}/{course.lesson_count} Selesai</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${((course.completed_count || 0) / course.lesson_count) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Akses</span>
                            <p className="text-base font-display font-medium text-indigo-600">
                              {course.price === 0 ? "GRATIS" : `Rp ${course.price.toLocaleString()}`}
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => openCourse(course.id)}
                            className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-black transition-all group-hover:scale-105 active:scale-95"
                          >
                            Masuk Kelas
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. COURSE DETAILS VIEW */}
          {activeSection === 'details' && courseDetails ? (() => {
            const completedLessonsCount = courseDetails.lessons.filter(l => l.completed).length;
            const totalLessonsCount = courseDetails.lessons.length;
            const percentCompleted = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

            return (
              <div className="h-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                <div className="bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 mix-blend-multiply"></div>
                  
                  <img 
                    src={courseDetails.course.image_url} 
                    alt={courseDetails.course.title}
                    className="w-full md:w-64 h-48 rounded-[24px] object-cover border-4 border-slate-50 shadow-lg relative shrink-0" 
                  />

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">{courseDetails.course.badge}</span>
                      <span className="text-xs font-bold text-slate-400">• Penyusun: {courseDetails.course.instructor}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-display font-medium text-slate-900 leading-tight italic">
                      {courseDetails.course.title}
                    </h3>

                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {courseDetails.course.description}
                    </p>

                    {courseDetails.course.is_purchased ? (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1">
                            <Sparkles size={14} className="text-indigo-500 fill-indigo-500 animate-pulse" /> 
                            Progres Belajar Kamu
                          </span>
                          <span className="text-indigo-600 font-extrabold">{completedLessonsCount} dari {totalLessonsCount} Selesai ({percentCompleted}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentCompleted}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : null}

                    <div className="pt-3 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Aktivasi</span>
                        <p className="text-xl font-display font-black text-indigo-600">
                          {courseDetails.course.price === 0 ? "GRATIS" : `Rp ${courseDetails.course.price.toLocaleString()}`}
                        </p>
                      </div>

                      {!courseDetails.course.is_purchased ? (
                        <button 
                          onClick={() => handlePurchase(courseDetails.course)}
                          disabled={purchaseLoading}
                          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:bg-indigo-300"
                        >
                          {purchaseLoading ? 'Memproses Virtual Pay...' : 'Ambil Kelas ini'}
                        </button>
                      ) : (
                        <span className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                          <CheckCircle size={16} /> Kelas Terbuka
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lessons Syllabus list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-display font-bold italic text-slate-800">Silabus Kurikulum Belajar</h4>
                    <span className="text-xs text-slate-400 font-semibold">{courseDetails.lessons.length} Materi Pembelajaran</span>
                  </div>

                  <div className="space-y-3">
                    {courseDetails.lessons.map((lesson, idx) => {
                      const isCourseLocked = !courseDetails.course.is_purchased && courseDetails.course.price > 0;
                      const isProgressLocked = idx > 0 && !courseDetails.lessons[idx - 1].completed;
                      const isLocked = isCourseLocked || isProgressLocked;

                      return (
                        <div 
                          key={lesson.id}
                          className={`bg-white p-5 rounded-[24px] border ${lesson.completed ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'} transition-all flex items-center justify-between gap-6 group relative`}
                        >
                          {/* Left part: icon + title */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              isLocked ? 'bg-slate-50 text-slate-300' :
                              lesson.type === 'video' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {isLocked ? <Lock size={18} /> : 
                               lesson.type === 'video' ? <Play size={18} fill="currentColor" /> : <Book size={18} />}
                            </div>

                            <div className="min-w-0">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Unit #{idx + 1} • {lesson.type === 'video' ? 'Video Edukasi' : 'Kuis Latihan'}
                              </span>
                              <h5 className={`font-display text-sm md:text-base font-medium truncate leading-snug ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                {lesson.title}
                              </h5>
                            </div>
                          </div>

                          {/* Right part: status / lock */}
                          <div className="shrink-0 flex items-center gap-4">
                            {isLocked ? (
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                {isProgressLocked ? (
                                  <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full select-none">
                                    <Lock size={11} /> Seri sebelumnya terkunci
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full select-none">
                                    <Lock size={11} /> Terkunci
                                  </span>
                                )}
                              </span>
                            ) : lesson.completed ? (
                              <div className="flex items-center gap-3">
                                {lesson.score !== null && (
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded-lg font-mono">
                                    Skor: {lesson.score}/{lesson.total_questions}
                                  </span>
                                )}
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                                  <Check size={12} className="stroke-[3]" /> Selesai
                                </span>
                                <button 
                                  onClick={() => openLesson(lesson.id)}
                                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all active:scale-95 border border-indigo-100"
                                >
                                  {lesson.type === 'quiz' ? 'Ulangi Kuis' : 'Tonton Lagi'}
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => openLesson(lesson.id)}
                                className="px-4 py-2 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                              >
                                Mulai
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })() : null}

          {/* 3. ACTIVE LESSON PLAYER (VIDEO / QUIZ) */}
          {activeSection === 'player' && activeLesson && (
            <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-100">
              {/* Left Column: Player workspace */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between h-full">
                
                {activeLesson.type === 'video' ? (
                  /* --- VIDEO LEARNING INTERFACE --- */
                  <div className="space-y-6 max-w-4xl mx-auto w-full">
                    <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-xl border-4 border-white relative">
                      <iframe 
                        src={`https://www.youtube.com/embed/${extractYouTubeId(activeLesson.content_url || 'ptpA6eWRx4k')}?autoplay=0&rel=0`}
                        title={activeLesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                      ></iframe>
                    </div>

                    <div className="bg-white p-6 rounded-[28px] border border-slate-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Video Bahasa Indonesia</span>
                        <h4 className="text-lg font-display text-slate-900 font-bold italic">{activeLesson.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">Selesaikan menonton YouTube pembelajaran ini lalu tandai progresmu.</p>
                      </div>

                      <button 
                        onClick={handleCompleteVideo}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-100 shrink-0 transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Check size={16} className="stroke-[3]" /> Selesai Belajar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- QUIZ PRACTICE INTERFACE --- */
                  <div className="max-w-xl mx-auto w-full space-y-6">
                    {!quizFinished ? (
                      /* ACTIVE QUIZZING FLOW */
                      courseDetails && activeLesson.questions && activeLesson.questions.length > 0 ? (
                        (() => {
                          const currentQuestion = activeLesson.questions[currentQuestionIndex];
                          const options = [
                            { key: 'A', text: currentQuestion.option_a },
                            { key: 'B', text: currentQuestion.option_b },
                            { key: 'C', text: currentQuestion.option_c },
                            { key: 'D', text: currentQuestion.option_d }
                          ];
                          const hasAnswered = selectedOption !== null;
                          const isCorrect = selectedOption === currentQuestion.correct_option;

                          return (
                            <motion.div 
                              key={currentQuestionIndex}
                              initial={{ opacity: 0, x: 20 }} 
                              animate={hasAnswered 
                                ? (isCorrect 
                                    ? { opacity: 1, scale: [1, 1.05, 0.96, 1.02, 1], y: [0, -15, 4, -1, 0], x: 0 }
                                    : { opacity: 1, x: [0, -12, 12, -10, 10, -5, 5, 0], y: 0, scale: 1 }
                                  )
                                : { opacity: 1, x: 0, y: 0, scale: 1 }
                              }
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden"
                            >
                              {/* Decorative Confetti Background Sparkles on Correct */}
                              {hasAnswered && isCorrect && (
                                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
                                  <motion.div 
                                    initial={{ scale: 0.3, opacity: 0 }}
                                    animate={{ scale: [1, 1.5, 2], opacity: [0, 0.8, 0] }}
                                    transition={{ duration: 0.8 }}
                                    className="w-48 h-48 rounded-full border-4 border-dashed border-emerald-400 opacity-20"
                                  />
                                  <motion.div 
                                    initial={{ scale: 0.1, opacity: 0 }}
                                    animate={{ scale: [1, 1.8], opacity: [0, 0.6, 0] }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="w-72 h-72 rounded-full border-2 border-dotted border-indigo-400 opacity-10"
                                  />
                                </div>
                              )}
                              {/* progress header */}
                              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                  Soal {currentQuestionIndex + 1} dari {activeLesson.questions.length}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                  <Clock size={12} /> Kuis Interaktif
                                </div>
                              </div>

                              {/* Question title */}
                              <h4 className="text-base md:text-lg text-slate-800 font-bold leading-relaxed pr-2">
                                {currentQuestion.question}
                              </h4>

                              {/* Options stacking */}
                              <div className="space-y-3">
                                {options.map(opt => {
                                  const isSelected = selectedOption === opt.key;
                                  const isCorrectOption = opt.key === currentQuestion.correct_option;
                                  
                                  let optionStyle = "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700";
                                  if (hasAnswered) {
                                    if (isSelected) {
                                      optionStyle = isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-rose-500 bg-rose-50 text-rose-800";
                                    } else if (isCorrectOption) {
                                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-800";
                                    } else {
                                      optionStyle = "border-slate-100 bg-slate-50 opacity-40 text-slate-400";
                                    }
                                  }

                                  return (
                                    <motion.button 
                                      key={opt.key}
                                      onClick={() => handleOptionSelect(opt.key)}
                                      disabled={hasAnswered}
                                      animate={isSelected ? (isCorrect ? { scale: [1, 1.08, 0.95, 1.03, 1], y: [0, -12, 4, -2, 0] } : { x: [0, -10, 10, -10, 10, -5, 5, 0] }) : { scale: 1, y: 0, x: 0 }}
                                      transition={{ duration: 0.5, ease: "easeInOut" }}
                                      className={`w-full p-4.5 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between gap-4 ${optionStyle}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                          isSelected ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-500'
                                        }`}>
                                          {opt.key}
                                        </span>
                                        <span>{opt.text}</span>
                                      </div>
                                      
                                      {hasAnswered && isCorrectOption && <Check size={16} className="text-emerald-600 stroke-[3]" />}
                                      {hasAnswered && isSelected && !isCorrect && <X size={16} className="text-rose-600 stroke-[3]" />}
                                    </motion.button>
                                  );
                                })}
                              </div>

                              {/* Feedback / Explanation display */}
                              {hasAnswered && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                  className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-2 mt-4 overflow-hidden relative ${
                                    isCorrect ? 'bg-emerald-50/50 border-emerald-100 text-slate-700' : 'bg-rose-50/30 border-rose-100 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 font-bold">
                                    {isCorrect ? (
                                      <span className="text-emerald-700 flex items-center gap-1"><Check size={16} /> Hore! Benar sekali!</span>
                                    ) : (
                                      <span className="text-rose-700 flex items-center gap-1"><X size={16} /> Yaa, Jawaban Kurang Tepat...</span>
                                    )}
                                  </div>
                                  <p className="text-slate-600 font-medium">
                                    <strong className="text-slate-800">Pembahasan:</strong> {currentQuestion.explanation}
                                  </p>
                                </motion.div>
                              )}

                              {/* Footer control */}
                              <div className="pt-4 border-t border-slate-50 flex justify-end">
                                <button
                                  onClick={handleNextQuestion}
                                  disabled={!hasAnswered}
                                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center gap-1"
                                >
                                  {currentQuestionIndex + 1 === activeLesson.questions.length ? "Lihat Hasil" : "Soal Berikutnya"}
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })()
                      ) : (
                        <div className="text-center p-12">Belum ada daftar pertanyaan kuis.</div>
                      )
                    ) : (
                      /* QUIZ RESULTS / COMPLETION SUMMARY */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200 shadow-sm text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                          <Award size={40} className="stroke-[2]" />
                        </div>

                        <div>
                          <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Kuis Selesai!</span>
                          <h4 className="text-2xl font-display font-medium text-slate-900 mt-2">Ringkasan Hasil Nilai</h4>
                          <p className="text-xs text-slate-400">Kerja bagus telah menuntaskan kuis evaluasi ini!</p>
                        </div>

                        {/* Visual Circle Gauge Score */}
                        <div className="py-6 flex items-center justify-center">
                          <div className="bg-slate-50/50 border-4 border-indigo-600/10 rounded-full w-36 h-36 flex flex-col justify-center items-center shadow-inner">
                            <span className="text-4xl font-display font-black text-indigo-600">
                              {Math.round((quizScore / (activeLesson.questions?.length || 1)) * 100)}%
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                              Skor: {quizScore} / {activeLesson.questions?.length}
                            </span>
                          </div>
                        </div>

                        {/* Explanation notes */}
                        <p className="text-slate-600 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                          Jawaban benar sebanyak <strong className="text-indigo-600">{quizScore}</strong> dari <strong className="text-slate-800">{activeLesson.questions?.length}</strong> pertanyaan dikerjakan. Hasil ini tercatat ke progres belajarmu.
                        </p>

                        <button 
                          onClick={handleSubmitQuizScore}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4.5 rounded-2.5xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                          Simpan & Kembali ke Kelas <CheckCircle size={16} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Mini curriculum syllabus outline sidebar */}
              <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-full shrink-0">
                <div className="p-5 border-b border-slate-100">
                  <h4 className="font-display font-bold italic text-slate-800 leading-tight">Kurikulum Modul</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Alur Belajar Mandiri</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {courseDetails?.lessons.map((lesson, idx) => {
                    const isSelected = lesson.id === activeLessonId;
                    const isCourseLocked = !courseDetails?.course.is_purchased && courseDetails?.course.price > 0;
                    const isProgressLocked = idx > 0 && !courseDetails?.lessons[idx - 1].completed;
                    const isLocked = isCourseLocked || isProgressLocked;

                    return (
                      <button
                        key={lesson.id}
                        disabled={isLocked && !isSelected}
                        onClick={() => {
                          if (isLocked) {
                            alert("Selesaikan materi sebelumnya terlebih dahulu!");
                            return;
                          }
                          fetchLesson(lesson.id);
                        }}
                        className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center gap-3 relative ${
                          isLocked ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-60 cursor-not-allowed' :
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' :
                          lesson.completed ? 'bg-emerald-50/10 border-emerald-50 hover:bg-slate-50 text-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                          isLocked ? 'bg-slate-100 text-slate-400' :
                          isSelected ? 'bg-white/20 text-white' :
                          lesson.type === 'video' ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-500'
                        }`}>
                          {isLocked ? <Lock size={12} /> :
                           lesson.type === 'video' ? <Play size={12} fill="currentColor" /> : <Book size={12} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>Unit #{idx+1}</p>
                          <h6 className="font-display text-xs font-bold leading-tight truncate">{lesson.title}</h6>
                        </div>

                        {isLocked ? (
                          <Lock size={12} className="text-slate-300" />
                        ) : lesson.completed ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-white text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Check size={10} className="stroke-[3]" />
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
