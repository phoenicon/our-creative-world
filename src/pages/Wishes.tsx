import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Plus, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { earnSticker } from "@/lib/stickers";

interface JournalEntry {
  id: string;
  type: 'wish' | 'dream';
  text: string;
  createdAt: number;
  favourite?: boolean;
}

const STORAGE = "ocw-journal";

const STARS = Array.from({ length: 22 }).map(() => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  size: 0.5 + Math.random() * 1,
}));

function relativeDate(ts: number): string {
  const diff = Date.now() - ts;
  const day = 86400000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  const days = Math.floor(diff / day);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "a week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  return new Date(ts).toLocaleDateString();
}

const Wishes = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const s = localStorage.getItem(STORAGE);
    return s ? JSON.parse(s) : [];
  });
  const [tab, setTab] = useState<'wish' | 'dream'>('wish');
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");

  const save = (next: JournalEntry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  };

  const add = () => {
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      type: tab,
      text: text.trim(),
      createdAt: Date.now(),
    };
    const next = [entry, ...entries];
    save(next);
    setText("");
    setComposing(false);
    if (entries.length === 0) earnSticker('first-wish');
    if (next.length >= 5) earnSticker('dream-keeper');
  };

  const toggleFav = (id: string) => {
    save(entries.map((e) => (e.id === id ? { ...e, favourite: !e.favourite } : e)));
  };

  const remove = (id: string) => {
    if (!confirm("Tuck this away forever?")) return;
    save(entries.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) => e.type === tab);

  return (
    <div className="min-h-screen px-4 py-8 relative overflow-hidden" style={{ background: "var(--gradient-calm)" }}>
      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-card"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size * 4}px`,
              height: `${s.size * 4}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + s.delay, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <PageHeader title="Wishes & Dreams" emoji="⭐" />

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'wish' | 'dream')}>
          <TabsList className="w-full bg-card/80 backdrop-blur rounded-2xl mb-4">
            <TabsTrigger value="wish" className="flex-1 rounded-xl font-display">✨ Wishes</TabsTrigger>
            <TabsTrigger value="dream" className="flex-1 rounded-xl font-display">🌙 Dreams</TabsTrigger>
          </TabsList>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setComposing(true)}
            className="w-full bg-lavender rounded-3xl py-4 font-display font-bold text-lavender-foreground mb-4 flex items-center justify-center gap-2 cursor-pointer border-none shadow-[var(--shadow-soft)]"
          >
            <Plus className="w-5 h-5" />
            {tab === 'wish' ? "Make a wish ⭐" : "Record a dream 🌙"}
          </motion.button>

          <TabsContent value={tab} className="mt-0">
            {filtered.length === 0 ? (
              <div className="bg-card/60 backdrop-blur rounded-3xl p-8 text-center">
                <p className="font-body text-muted-foreground">
                  {tab === 'wish'
                    ? "Your wishes live here. Tap the star to make one ✨"
                    : "Your dreams sleep here. Tuck one in 🌙"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card/85 backdrop-blur rounded-3xl p-4 shadow-[var(--shadow-soft)]"
                  >
                    <p className="font-body text-foreground leading-relaxed mb-3">{e.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{relativeDate(e.createdAt)}</span>
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFav(e.id)}
                          className="w-9 h-9 rounded-full bg-rose/40 flex items-center justify-center cursor-pointer border-none"
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={e.favourite ? "hsl(var(--rose-foreground))" : "none"}
                            color="hsl(var(--rose-foreground))"
                          />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(e.id)}
                          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center cursor-pointer border-none"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setComposing(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-card rounded-3xl p-6 w-full max-w-md shadow-[var(--shadow-float)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setComposing(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer border-none"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-display text-2xl mb-3">
                {tab === 'wish' ? "Make a wish ⭐" : "Record a dream 🌙"}
              </h3>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={tab === 'wish' ? "I wish..." : "Last night I dreamed..."}
                className="w-full bg-muted/50 rounded-2xl p-3 font-body text-sm resize-none border-none outline-none h-32 mb-3"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={add}
                className="w-full bg-lavender rounded-2xl py-3 font-display font-bold text-lavender-foreground cursor-pointer border-none"
              >
                {tab === 'wish' ? "Save my wish ⭐" : "Tuck this dream in 🌙"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishes;
