import React from 'react';
import { Batch } from '../types';
import { ArrowRight, Check, Plus, Star, Users, BookOpen } from 'lucide-react';

interface BatchCardProps {
  batch: Batch;
  isEnrolled: boolean;
  onToggleEnroll: (e: React.MouseEvent, id: number) => void;
  onStudy: (id: number) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  isEnrolled,
  onToggleEnroll,
  onStudy,
}) => {
  return (
    <div className="pink-card rounded-2xl overflow-hidden flex flex-col group relative border border-pink-500/20 shadow-lg">
      {/* Thumbnail Area */}
      <div
        className="relative w-full aspect-[16/9] overflow-hidden bg-black cursor-pointer"
        onClick={() => onStudy(batch.id)}
      >
        <img
          src={batch.thumbnail}
          alt={batch.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140d1c] via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="bg-pink-500/90 text-white font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-md shadow-md backdrop-blur-md">
            {batch.badge}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/70 border border-pink-400/40 text-pink-300 font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm">
            100% FREE
          </span>
        </div>

        {/* Target Class Pill on Bottom Left */}
        <div className="absolute bottom-2 left-3 z-10">
          <span className="text-[11px] font-semibold text-pink-200 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/30 backdrop-blur-sm">
            {batch.target}
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-20">
        <h3
          onClick={() => onStudy(batch.id)}
          className="text-white font-bold text-base leading-snug mb-2 group-hover:text-pink-300 transition-colors line-clamp-2 cursor-pointer"
        >
          {batch.title}
        </h3>

        {/* Subjects list */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {batch.subjects.map((sub) => (
            <span
              key={sub}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20"
            >
              {sub}
            </span>
          ))}
        </div>

        {/* Meta Stats: Rating & Enrolled */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pb-3 border-b border-pink-500/15">
          <div className="flex items-center gap-1 text-pink-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>{batch.rating || '4.9'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{batch.students || '40K+'} Students</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-pink-300/80">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Syllabus</span>
          </div>
        </div>

        {/* Action Buttons: ENROLL and Let's Study */}
        <div className="flex items-center justify-between gap-2.5 mt-auto pt-1">
          {/* Enroll / Enrolled Button */}
          <button
            onClick={(e) => onToggleEnroll(e, batch.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isEnrolled
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30'
                : 'btn-pink-secondary'
            }`}
          >
            {isEnrolled ? (
              <>
                <Check className="w-3.5 h-3.5 text-pink-400" />
                <span>ENROLLED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>ENROLL</span>
              </>
            )}
          </button>

          {/* Let's Study Button - Fully pink gradient */}
          <button
            onClick={() => onStudy(batch.id)}
            className="btn-pink-primary flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Let's Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
