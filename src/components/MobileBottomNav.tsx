import React from 'react';
import { Home, Layers, Bookmark, Send, Search } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  enrolledCount: number;
  onOpenSearch: () => void;
  onOpenTelegramModal: () => void;
  onGoHome: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  enrolledCount,
  onOpenSearch,
  onOpenTelegramModal,
  onGoHome,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#120a17]/95 backdrop-blur-xl border-t border-pink-500/25 px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'all'
              ? 'text-pink-400 font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Batches / Categories */}
        <button
          onClick={() => onTabChange('all')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'JEE' || currentTab === 'NEET'
              ? 'text-pink-400 font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Batches</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* My Batches */}
        <button
          onClick={() => onTabChange('enrolled')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'enrolled'
              ? 'text-pink-400 font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Saved</span>
          {enrolledCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-extrabold flex items-center justify-center">
              {enrolledCount}
            </span>
          )}
        </button>

        {/* Telegram */}
        <button
          onClick={onOpenTelegramModal}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-pink-400 hover:text-pink-300 transition-all cursor-pointer"
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Telegram</span>
        </button>
      </div>
    </div>
  );
};
