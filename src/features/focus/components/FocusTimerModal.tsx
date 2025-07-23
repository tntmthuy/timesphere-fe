// src/components/FocusTimerModal.tsx
import { useEffect, useState } from "react";

type Props = {
  targetLabel: string;
  targetMinutes: number; // ✅ số phút mục tiêu
  onClose: () => void;
  onEnd: () => void;     // ✅ gọi khi kết thúc phiên
};

export const FocusTimerModal = ({ targetLabel, targetMinutes, onClose, onEnd }: Props) => {
  const motivationalQuotes = [
    "Keep breathing. You're doing great.",
    "Focus is a form of self-respect.",
    "Every minute counts.",
    "Stay steady. You're building momentum.",
    "Small progress is still progress.",
    "Distraction is a choice. So is discipline.",
    "You're stronger than your excuses.",
    "Let the silence fuel your flow.",
    "Keep your promise to yourself.",
  ];

  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * motivationalQuotes.length));

  const hasReachedTarget = elapsed >= targetMinutes * 60;
  const currentQuote = motivationalQuotes[quoteIndex];

  useEffect(() => {
    if (paused || hasReachedTarget) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next % 300 === 0) {
          setQuoteIndex(Math.floor(Math.random() * motivationalQuotes.length));
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, hasReachedTarget, motivationalQuotes.length]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="relative flex h-[420px] w-[360px] flex-col justify-between rounded-xl border border-yellow-200 bg-yellow-50 p-8 text-center shadow-lg">
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-lg text-slate-600 hover:text-slate-800"
        >
          ✕
        </button>

        {/* 🕐 Title */}
        <h2 className="text-xl font-semibold text-yellow-800">{targetLabel}</h2>

        {/* ⏱️ Timer & quote */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-4xl font-bold text-slate-700">{format(elapsed)}</div>
          <p className="mt-3 max-w-[80%] text-sm text-yellow-700 italic">{currentQuote}</p>
        </div>

        {/* 🎯 Control button */}
        <div className="flex justify-center">
          {hasReachedTarget ? (
            <button
              onClick={onEnd}
              className="rounded-md bg-green-600 px-6 py-3 text-white font-semibold text-sm hover:bg-green-700"
            >
                End Session
            </button>
          ) : (
            <button
              onClick={() => setPaused((p) => !p)}
              className="rounded-full bg-yellow-500 p-5 transition duration-200 hover:bg-yellow-600"
            >
              {paused ? (
                // ▶️ Resume Icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="h-10 w-10 text-white" style={{ transform: "translateX(3px)" }}>
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              ) : (
                // ⏸️ Pause Icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="h-10 w-10 text-white">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};