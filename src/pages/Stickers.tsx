import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { ALL_STICKERS, getEarnedStickers, type Sticker } from "@/lib/stickers";

const CATEGORY_LABELS: Record<Sticker['category'], string> = {
  art: "Art Hub",
  week: "My Week",
  calm: "Calm Space",
  wishes: "Wishes & Dreams",
  messages: "Twin Mail",
  quest: "Twin Quest II",
  special: "Special Moments",
};

const Stickers = () => {
  const [earned] = useState<string[]>(() => getEarnedStickers());
  const [hint, setHint] = useState<Sticker | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const grouped = (Object.keys(CATEGORY_LABELS) as Sticker['category'][]).map((cat) => ({
    cat,
    items: ALL_STICKERS.filter((s) => s.category === cat),
  }));

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-dreamy)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Sticker Book" emoji="🌟" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur rounded-3xl p-4 mb-6 text-center shadow-[var(--shadow-soft)]"
        >
          <p className="font-display text-lg text-foreground">
            You've collected {earned.length} of {ALL_STICKERS.length} stickers ✨
          </p>
        </motion.div>

        {grouped.map(({ cat, items }) => (
          <div key={cat} className="mb-6">
            <h2 className="font-display text-xl text-foreground mb-3 px-1">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {items.map((s) => {
                const isEarned = earned.includes(s.id);
                return (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isEarned) {
                        setCelebrate(s.id);
                        setTimeout(() => setCelebrate(null), 800);
                      } else {
                        setHint(s);
                      }
                    }}
                    className={`aspect-square rounded-3xl bg-card/80 backdrop-blur p-2 flex flex-col items-center justify-center gap-1 cursor-pointer border-none ${
                      isEarned
                        ? "shadow-[var(--shadow-glow)]"
                        : "opacity-40 grayscale shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <motion.span
                      className="text-4xl relative"
                      animate={celebrate === s.id ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
                    >
                      {isEarned ? s.emoji : "❓"}
                    </motion.span>
                    <span className="font-body text-[10px] text-center text-foreground leading-tight">
                      {s.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setHint(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-card rounded-3xl p-6 max-w-xs text-center shadow-[var(--shadow-float)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3 opacity-50">{hint.emoji}</div>
              <h3 className="font-display text-xl mb-2">{hint.name}</h3>
              <p className="font-body text-sm text-muted-foreground">{hint.earnedHow}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stickers;
