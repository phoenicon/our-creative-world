import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { earnSticker } from "@/lib/stickers";

const DAYS = [
  { day: "Tuesday", clubs: ["📖 Story Explorers", "🏊 Swimming"], color: "bg-sky" },
  { day: "Wednesday", clubs: ["✏️ Sketching Club"], color: "bg-sunshine" },
  { day: "Thursday", clubs: ["🎨 Mindful Colouring"], color: "bg-lavender" },
];

const MOODS = ["😊", "😐", "😢", "🤩", "😴", "🥰"];

interface DayEntry {
  mood?: string;
  note?: string;
}

const MyWeek = () => {
  const [entries, setEntries] = useState<Record<string, DayEntry>>(() => {
    const saved = localStorage.getItem("ocw-week");
    return saved ? JSON.parse(saved) : {};
  });

  const updateDay = (day: string, update: Partial<DayEntry>) => {
    const updated = { ...entries, [day]: { ...entries[day], ...update } };
    setEntries(updated);
    localStorage.setItem("ocw-week", JSON.stringify(updated));
    const moodDays = Object.values(updated).filter((e) => e.mood).length;
    if (moodDays >= 3) earnSticker('mood-tracker');
    const noteDays = Object.values(updated).filter((e) => e.note && e.note.trim()).length;
    if (noteDays >= DAYS.length) earnSticker('storyteller');
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-ocean)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="My Week" emoji="📅" />

        <div className="space-y-4">
          {DAYS.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className={`${d.color} rounded-3xl p-5 shadow-[var(--shadow-soft)]`}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{d.day}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {d.clubs.map((club) => (
                  <span key={club} className="bg-card/60 backdrop-blur px-3 py-1 rounded-full text-sm font-body">
                    {club}
                  </span>
                ))}
              </div>

              {/* Mood selector */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2 font-body">How did you feel?</p>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <motion.button
                      key={m}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateDay(d.day, { mood: m })}
                      className={`text-2xl p-1 rounded-xl border-2 transition-colors cursor-pointer ${
                        entries[d.day]?.mood === m
                          ? "border-primary bg-card/80"
                          : "border-transparent"
                      }`}
                    >
                      {m}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <textarea
                placeholder="What did you like? ✨"
                value={entries[d.day]?.note || ""}
                onChange={(e) => updateDay(d.day, { note: e.target.value })}
                className="w-full bg-card/60 backdrop-blur rounded-2xl p-3 text-sm font-body resize-none border-none outline-none placeholder:text-muted-foreground/60 h-16"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWeek;
