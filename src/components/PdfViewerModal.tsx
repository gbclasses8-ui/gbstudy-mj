import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';
import { resolveMediaContent } from '../services/api';
import { ResolvedMedia } from '../types';

interface PdfViewerModalProps {
  courseId: number | string;
  contentId: string | number;
  pdfTitle: string;
  initialUrl?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  courseId,
  contentId,
  pdfTitle,
  initialUrl,
  onClose,
}) => {
  const [loading, setLoading] = useState(!initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedMedia | null>(() => {
    if (initialUrl) {
      return {
        courseId: String(courseId),
        contentId: String(contentId),
        decryptedData: {
          id: Number(contentId) || 1,
          title: pdfTitle,
          file_url: initialUrl,
          file_type: 1,
          download_urls: [{ title: 'PDF', url: initialUrl }]
        }
      };
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>('pdf');

  useEffect(() => {
    let isMounted = true;
    if (!initialUrl) {
      setLoading(true);
    }
    setError(null);

    resolveMediaContent(courseId, contentId)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.decryptedData) {
          setResolved(data);
        } else if (!initialUrl) {
          setError('PDF document URL is currently unavailable.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!initialUrl) {
          setError(err.message || 'Failed to resolve PDF document');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, contentId, initialUrl]);

  const fileUrl = resolved?.decryptedData.file_url || initialUrl || 'https://ncert.nic.in/textbook/pdf/keph101.pdf';
  const title = resolved?.decryptedData.title || pdfTitle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl h-[92vh] bg-[#140c1a] border border-pink-500/30 rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(236,72,153,0.3)] flex flex-col">
        {/* Header Bar */}
        <div className="p-3 sm:p-4 bg-black/70 border-b border-pink-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden max-w-[60%] sm:max-w-[70%]">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xs sm:text-sm text-white truncate">{title}</h3>
              <p className="text-[10px] text-pink-300/70 font-semibold truncate">
                GB STUDY • Kota Verified Notes &amp; DPP Sheet
              </p>
            </div>
          </div>

          {/* Mode Switcher & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-black/50 border border-pink-500/30 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'pdf'
                    ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Key Formulas &amp; Summary</span>
              </button>
            </div>

            {fileUrl && (
              <>
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pink-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden border-b border-pink-500/20 bg-black/40 p-1">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-1.5 text-xs font-bold text-center rounded-lg transition-colors ${
              activeTab === 'pdf' ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40' : 'text-gray-400'
            }`}
          >
            PDF Document
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1.5 text-xs font-bold text-center rounded-lg transition-colors ${
              activeTab === 'notes' ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40' : 'text-gray-400'
            }`}
          >
            Formulas &amp; Notes
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black/40 relative flex items-center justify-center overflow-hidden">
          {activeTab === 'pdf' ? (
            <div className="w-full h-full relative flex flex-col items-center justify-center">
              {loading && (
                <div className="flex flex-col items-center gap-3 text-pink-400">
                  <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
                  <p className="text-sm font-semibold tracking-wide">Loading Study Material PDF...</p>
                </div>
              )}

              {!loading && (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                  title={title}
                  className="w-full h-full border-0 bg-white/5"
                />
              )}
            </div>
          ) : (
            /* Built-in Study Notes & Formulas reader */
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-gray-200">
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-2">
                <div className="flex items-center gap-2 text-pink-400 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>CHAPTER QUICK REVISION &amp; FORMULA SHEET</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
                <p className="text-xs text-gray-300">
                  Curated Kota classroom notes, essential formula derivations, and board/JEE/NEET high-yield pointers.
                </p>
              </div>

              {/* Key Concept Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-pink-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Points &amp; Fundamental Principles</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">1. Conceptual Clarity</span>
                    <p className="text-gray-400">
                      Master basic definitions and standard sign conventions before solving complex multi-step problems.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">2. Units &amp; Dimensional Consistency</span>
                    <p className="text-gray-400">
                      Always double-check SI unit conversions (cm to m, minutes to seconds, grams to kg) in numerical calculations.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">3. Graphical Interpretation</span>
                    <p className="text-gray-400">
                      Slope and area under curves represent instantaneous rates and accumulated quantities (e.g., F-x curve area gives work done).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">4. High-Yield PYQs</span>
                    <p className="text-gray-400">
                      Previous 10 years question dissection shows over 70% of exam questions follow identical fundamental derivations.
                    </p>
                  </div>
                </div>
              </div>

              {/* DPP Practice Guidance */}
              <div className="p-4 rounded-xl bg-black/60 border border-pink-500/20 space-y-3">
                <h3 className="text-sm font-black text-pink-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-pink-400" />
                  <span>How to Solve This Chapter's DPP Sheet</span>
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300">
                  <li>Complete the video lectures (L-01 to L-04) before attempting Level-2 questions.</li>
                  <li>Set a timer for 45 minutes for each 15-question problem set.</li>
                  <li>Maintain a separate error notebook for tricky and calculation-heavy questions.</li>
                  <li>Revisit the Formula Handbook PDF before mock tests.</li>
                </ol>
              </div>

              {/* Direct Download Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-black text-white">Full Resolution PDF Available</h4>
                  <p className="text-xs text-pink-300/80">
                    Download the complete 40+ page handwritten classroom sheet for offline printing.
                  </p>
                </div>
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pink-primary px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF File</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
