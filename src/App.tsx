import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Send,
  Sparkles,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Bookmark
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BatchCard } from './components/BatchCard';
import { BatchView } from './components/BatchView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { TelegramModal } from './components/TelegramModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { getBatches, INITIAL_BATCHES, APP_LOGO, TELEGRAM_URL } from './services/api';
import { Batch } from './types';

export default function App() {
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Enrolled list from localStorage
  const [enrolledIds, setEnrolledIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('gbstudy_enrolled') || localStorage.getItem('studybee_wishlist');
      return saved ? JSON.parse(saved).map(Number) : [151, 152];
    } catch {
      return [151, 152];
    }
  });

  // Selected Batch for Course View
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);

  // Modals
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [playingLecture, setPlayingLecture] = useState<{
    courseId: number | string;
    contentId: string | number;
    title: string;
    isLive?: boolean;
  } | null>(null);
  const [viewingPdf, setViewingPdf] = useState<{
    courseId: number | string;
    contentId: string | number;
    title: string;
  } | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Show Telegram Modal on page open (per requirement)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('gbstudy_telegram_seen');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsTelegramModalOpen(true);
        sessionStorage.setItem('gbstudy_telegram_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch batches
  useEffect(() => {
    let isMounted = true;
    setLoadingBatches(true);
    getBatches()
      .then((data) => {
        if (isMounted) setBatches(data);
      })
      .finally(() => {
        if (isMounted) setLoadingBatches(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save enrolled IDs to localStorage
  const handleToggleEnroll = (e: React.MouseEvent, batchId: number) => {
    e.stopPropagation();
    setEnrolledIds((prev) => {
      const exists = prev.includes(batchId);
      let updated: number[];
      if (exists) {
        updated = prev.filter((id) => id !== batchId);
        showToast('Batch removed from your list', 'info');
      } else {
        updated = [...prev, batchId];
        showToast('Enrolled successfully! Ready to study.', 'success');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#ec4899', '#f472b6', '#db2777', '#ffffff'],
          });
        } catch {}
      }
      localStorage.setItem('gbstudy_enrolled', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter batches for homepage
  const filteredBatches = batches.filter((batch) => {
    if (activeFilterTab === 'JEE') return batch.category === 'JEE';
    if (activeFilterTab === 'NEET') return batch.category === 'NEET';
    if (activeFilterTab === 'enrolled') return enrolledIds.includes(batch.id);
    return true;
  }).filter((batch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      batch.title.toLowerCase().includes(q) ||
      batch.category.toLowerCase().includes(q) ||
      batch.subjects.some((s) => s.toLowerCase().includes(q))
    );
  });

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="min-h-screen bg-[#0b070f] text-gray-100 flex flex-col selection:bg-pink-500 selection:text-white pb-20 md:pb-0">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e0f26] border border-pink-500/50 shadow-[0_10px_30px_rgba(236,72,153,0.4)] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currentTab={activeFilterTab}
        onTabChange={(tab) => {
          setSelectedBatchId(null);
          setActiveFilterTab(tab);
        }}
        enrolledCount={enrolledIds.length}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        isHome={selectedBatchId === null}
        onGoHome={() => {
          setSelectedBatchId(null);
          setActiveFilterTab('all');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedBatch ? (
          /* SINGLE BATCH COURSE VIEW */
          <BatchView
            batch={selectedBatch}
            onBack={() => setSelectedBatchId(null)}
            onOpenVideo={(contentId, title, isLive) =>
              setPlayingLecture({
                courseId: selectedBatch.id,
                contentId,
                title,
                isLive,
              })
            }
            onOpenPdf={(contentId, title) =>
              setViewingPdf({
                courseId: selectedBatch.id,
                contentId,
                title,
              })
            }
          />
        ) : (
          /* HOMEPAGE VIEW */
          <div className="space-y-10 sm:space-y-12">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-8 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-pink-500/15 bg-gradient-to-b from-[#190c23]/80 via-[#0e0714] to-[#0b070f]">
              {/* Radial glow background lights */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute top-20 right-10 w-72 h-72 bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />

              <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
                {/* Brand Logo Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/35 text-pink-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-pink-400">
                    <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
                  </div>
                  <span>GB STUDY • KOTA QUALITY LEARNING</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Crack <span className="pink-text-gradient">JEE &amp; NEET</span> With Top Verified Batches
                </h1>

                {/* Hero Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  100% Free access to India's most sought-after Drona JEE &amp; NEET Class 11th batches. High-definition video lectures, chapterwise DPPs, and formula sheets without any login required.
                </p>

                {/* Highlights bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-300 pt-2">
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <ShieldCheck className="w-4 h-4 text-pink-400" />
                    <span>No Login or Signup</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <Zap className="w-4 h-4 text-pink-400" />
                    <span>HLS Fast Video Streams</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <BookOpen className="w-4 h-4 text-pink-400" />
                    <span>Complete DPPs &amp; Notes</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('batches-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-pink-primary w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Flame className="w-4 h-4 text-white fill-white" />
                    <span>Explore Available Batches</span>
                  </button>

                  <button
                    onClick={() => setIsTelegramModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 text-pink-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-pink-400" />
                    <span>Join GB STUDY Telegram</span>
                  </button>
                </div>
              </div>
            </section>

            {/* BATCHES CONTAINER SECTION */}
            <section id="batches-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Curated Courses</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    All Available Batches
                  </h2>
                </div>

                {/* Search Bar on Section */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter batches..."
                    className="w-full bg-[#160c1d] border border-pink-500/25 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Batches' },
                  { id: 'JEE', label: 'JEE (Main & Adv)' },
                  { id: 'NEET', label: 'NEET UG' },
                  { id: 'enrolled', label: `My Enrolled (${enrolledIds.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilterTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilterTab === tab.id
                        ? 'btn-pink-primary'
                        : 'bg-[#160c1d] hover:bg-[#20102a] border border-pink-500/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Batches Grid */}
              {filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBatches.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      isEnrolled={enrolledIds.includes(batch.id)}
                      onToggleEnroll={handleToggleEnroll}
                      onStudy={(id) => setSelectedBatchId(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="pink-card rounded-3xl p-12 text-center border border-pink-500/20 space-y-3">
                  <FolderOpen className="w-12 h-12 text-pink-400/50 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Batches Match Your Criteria</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    {activeFilterTab === 'enrolled'
                      ? 'You have not enrolled in any batches yet. Click "ENROLL" on any batch to save it here.'
                      : 'Try clearing your search query to see all available JEE & NEET batches.'}
                  </p>
                  <button
                    onClick={() => {
                      setActiveFilterTab('all');
                      setSearchQuery('');
                    }}
                    className="btn-pink-primary px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    View All Batches
                  </button>
                </div>
              )}
            </section>

            {/* TELEGRAM COMMUNITY HIGHLIGHT BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden pink-card border border-pink-500/30 p-6 sm:p-10 shadow-[0_15px_50px_rgba(236,72,153,0.25)]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 blur-3xl pointer-events-none rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] shrink-0 bg-black">
                      <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>100K+ Students Community</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Join GB STUDY Telegram Channel
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                        Daily DPP PDF solutions, chapter mind maps, lecture alerts, and exam strategy directly on your phone.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')}
                    className="btn-pink-primary py-3 px-6 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shrink-0 cursor-pointer shadow-lg w-full md:w-auto justify-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Join Telegram Now</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        onFilterTab={(tab) => {
          setSelectedBatchId(null);
          setActiveFilterTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={activeFilterTab}
        onTabChange={(tab) => {
          setSelectedBatchId(null);
          setActiveFilterTab(tab);
        }}
        enrolledCount={enrolledIds.length}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        onGoHome={() => {
          setSelectedBatchId(null);
          setActiveFilterTab('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Telegram Popup Modal (Initial trigger & button trigger) */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        batches={batches}
        onSelectBatch={(id) => {
          setSelectedBatchId(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectLecture={(batchId, contentId, title) => {
          setSelectedBatchId(batchId);
          setPlayingLecture({ courseId: batchId, contentId, title });
        }}
        onSelectPdf={(batchId, contentId, title) => {
          setSelectedBatchId(batchId);
          setViewingPdf({ courseId: batchId, contentId, title });
        }}
      />

      {/* Video Player Modal */}
      {playingLecture && (
        <VideoPlayerModal
          courseId={playingLecture.courseId}
          contentId={playingLecture.contentId}
          lectureTitle={playingLecture.title}
          isLive={playingLecture.isLive}
          onClose={() => setPlayingLecture(null)}
        />
      )}

      {/* PDF Notes Viewer Modal */}
      {viewingPdf && (
        <PdfViewerModal
          courseId={viewingPdf.courseId}
          contentId={viewingPdf.contentId}
          pdfTitle={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </div>
  );
}
