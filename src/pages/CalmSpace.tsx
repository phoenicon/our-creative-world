import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { earnSticker } from "@/lib/stickers";

const COLORS = [
  "hsl(270 60% 85%)",
  "hsl(200 70% 85%)",
  "hsl(160 45% 85%)",
  "hsl(340 60% 88%)",
  "hsl(45 85% 85%)",
  "hsl(20 80% 88%)",
];

const CalmSpace = () => {
  const [breathing, setBreathing] = useState(false);
  const startedAt = useRef<number | null>(null);
  const accumulated = useRef<number>(0);

  useEffect(() => {
    if (breathing) {
      startedAt.current = Date.now();
      earnSticker('first-breath');
    } else if (startedAt.current) {
      accumulated.current += Date.now() - startedAt.current;
      startedAt.current = null;
      if (accumulated.current >= 60000) earnSticker('zen-master');
    }
  }, [breathing]);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-calm)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Calm Space" emoji="🌙" />

        {/* Breathing exercise */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center mt-8"
        >
          <p className="font-body text-muted-foreground mb-6 text-center text-lg">
            {breathing ? "Breathe in... and out... 🌊" : "Tap the bubble to start breathing 🫧"}
          </p>

          <motion.button
            onClick={() => setBreathing(!breathing)}
            className={`w-48 h-48 rounded-full cursor-pointer border-none relative ${
              breathing ? "animate-breathe" : ""
            }`}
            style={{ background: `radial-gradient(circle, ${COLORS[0]}, ${COLORS[1]})` }}
            whileHover={{ scale: breathing ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-display text-2xl text-foreground/60">
              {breathing ? "🌊" : "🫧"}
            </span>
          </motion.button>

          {breathing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-sm text-muted-foreground font-body"
            >
              Tap again to stop
            </motion.p>
          )}
        </motion.div>

        {/* Colour bubbles */}
        <div className="mt-16">
          <h2 className="font-display text-xl text-foreground text-center mb-6">
            Calming Colours 🎨
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {COLORS.map((color, i) => (
              <motion.div
                key={color}
                className="w-16 h-16 rounded-full animate-float"
                style={{
                  background: color,
                  animationDelay: `${i * 0.5}s`,
                  boxShadow: `0 8px 25px -5px ${color}`,
                }}
                whileHover={{ scale: 1.3 }}
              />
            ))}
          </div>
        </div>

        {/* Sparkles */}
        <div className="mt-12 flex justify-center gap-6">
          {["✨", "🌟", "💫", "⭐", "🌸"].map((s, i) => (
            <motion.span
              key={s}
              className="text-3xl animate-sparkle"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalmSpace;
