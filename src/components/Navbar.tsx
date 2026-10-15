import React from 'react';
import { Search, Send, Bookmark, BookOpen, GraduationCap } from 'lucide-react';
import { APP_LOGO, TELEGRAM_URL } from '../services/api';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  enrolledCount: number;
  onOpenSearch: () => void;
  onOpenTelegramModal: () => void;
  isHome: boolean;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  enrolledCount,
  onOpenSearch,
  onOpenTelegramModal,
  isHome,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full pink-glass-nav border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.35)] shrink-0 bg-black">
            <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                GB <span className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">STUDY</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                FREE
              </span>
            </div>
            <p className="text-[10px] text-pink-300/70 hidden sm:block font-medium">Kota Quality • 100% Free Education</p>
          </div>
        </div>

        {/* Center Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full bg-[#160c1d] hover:bg-[#20102b] border border-pink-500/25 hover:border-pink-500/50 rounded-xl px-4 py-2 text-sm text-gray-400 flex items-center justify-between transition-all group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
              <span>Search batches, subjects, lectures &amp; notes...</span>
            </div>
            <kbd className="hidden lg:inline-block text-[10px] font-semibold text-pink-300 bg-pink-950/60 border border-pink-500/30 px-1.5 py-0.5 rounded">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-pink-950/30 border border-pink-500/25 text-pink-300 hover:text-white hover:bg-pink-900/40 transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Enrolled Batches Link */}
          <button
            onClick={() => onTabChange('enrolled')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'enrolled'
                ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                : 'bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/25 text-pink-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Batches</span>
            {enrolledCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-pink-400 text-black text-[10px] font-extrabold flex items-center justify-center">
                {enrolledCount}
              </span>
            )}
          </button>

          {/* Telegram Channel Button */}
          <button
            onClick={onOpenTelegramModal}
            className="btn-pink-primary px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Join Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </button>
        </div>
      </div>
    </header>
  );
};
