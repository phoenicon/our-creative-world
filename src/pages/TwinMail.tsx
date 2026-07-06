import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Send, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { earnSticker } from "@/lib/stickers";

type Twin = 'bethan' | 'gwener';

interface TwinMessage {
  id: string;
  from: Twin;
  to: Twin;
  text: string;
  createdAt: number;
  read: boolean;
}

const STORAGE = "ocw-twin-messages";
const ACTIVE_KEY = "ocw-active-twin";

const TWIN_INFO: Record<Twin, { name: string; emoji: string; bg: string }> = {
  bethan: { name: "Bethan", emoji: "🌸", bg: "bg-peach" },
  gwener: { name: "Gwener", emoji: "🌟", bg: "bg-sky" },
};

const EMOJIS = ["💕", "🌸", "🌟", "🦄", "🌈", "🐰", "🍰", "✨", "🌙", "⭐", "🎀", "💛"];

const TwinMail = () => {
  const [active, setActive] = useState<Twin>(() => (localStorage.getItem(ACTIVE_KEY) as Twin) || 'bethan');
  const [messages, setMessages] = useState<TwinMessage[]>(() => {
    const s = localStorage.getItem(STORAGE);
    return s ? JSON.parse(s) : [];
  });
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");

  const other: Twin = active === 'bethan' ? 'gwener' : 'bethan';

  // Mark inbox as read on load/switch
  useEffect(() => {
    const updated = messages.map((m) => (m.to === active ? { ...m, read: true } : m));
    if (JSON.stringify(updated) !== JSON.stringify(messages)) {
      setMessages(updated);
      localStorage.setItem(STORAGE, JSON.stringify(updated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const switchTwin = (t: Twin) => {
    if (t === active) return;
    setActive(t);
    localStorage.setItem(ACTIVE_KEY, t);
    toast(`Hi ${TWIN_INFO[t].name}! ✨`, { duration: 2000 });
  };

  const send = () => {
    if (!text.trim()) return;
    const msg: TwinMessage = {
      id: Date.now().toString(),
      from: active,
      to: other,
      text: text.trim(),
      createdAt: Date.now(),
      read: false,
    };
    const next = [msg, ...messages];
    setMessages(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    setText("");
    setComposing(false);
    earnSticker('sister-love');
    if (next.length >= 10) earnSticker('twin-power');
  };

  const conversation = messages
    .filter((m) => (m.from === active && m.to === other) || (m.from === other && m.to === active))
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-sunset)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Twin Mail" emoji="💌" />

        {/* Identity switcher */}
        <div className="bg-card/80 backdrop-blur rounded-3xl p-2 mb-6 flex gap-2 shadow-[var(--shadow-soft)]">
          {(['bethan', 'gwener'] as Twin[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTwin(t)}
              className={`flex-1 py-3 rounded-2xl font-display font-bold cursor-pointer border-none transition-all ${
                active === t ? `${TWIN_INFO[t].bg} text-foreground` : "bg-transparent text-muted-foreground"
              }`}
            >
              {TWIN_INFO[t].emoji} I'm {TWIN_INFO[t].name}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setComposing(true)}
          className="w-full bg-rose rounded-3xl py-4 font-display font-bold text-rose-foreground mb-6 flex items-center justify-center gap-2 cursor-pointer border-none shadow-[var(--shadow-soft)]"
        >
          <Plus className="w-5 h-5" />
          Write to {TWIN_INFO[other].name}
        </motion.button>

        {/* Conversation */}
        {conversation.length === 0 ? (
          <div className="bg-card/60 backdrop-blur rounded-3xl p-8 text-center">
            <p className="font-body text-muted-foreground">
              No messages yet. Send {TWIN_INFO[other].name} something sweet 💕
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((m) => {
              const mine = m.from === active;
              const bubbleColor = TWIN_INFO[m.from].bg;
              const isUnread = !mine && !m.read;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${bubbleColor} rounded-3xl px-4 py-3 max-w-[75%] shadow-[var(--shadow-soft)] ${
                      isUnread ? "animate-sparkle" : ""
                    }`}
                  >
                    <p className="font-body text-foreground break-words">{m.text}</p>
                    <p className="text-[10px] text-foreground/50 mt-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setComposing(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-card rounded-3xl p-5 w-full max-w-md shadow-[var(--shadow-float)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setComposing(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer border-none"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-display text-xl mb-3">To {TWIN_INFO[other].name} {TWIN_INFO[other].emoji}</h3>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message or just emojis..."
                className="w-full bg-muted/50 rounded-2xl p-3 font-body text-sm resize-none border-none outline-none h-24 mb-2"
              />
              <p className="text-xs text-muted-foreground mb-3 text-center">Send something kind 💛</p>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setText((t) => t + e)}
                    className="text-2xl p-2 rounded-xl hover:bg-muted cursor-pointer border-none bg-transparent"
                  >
                    {e}
                  </button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={send}
                className="w-full bg-rose rounded-2xl py-3 font-display font-bold text-rose-foreground cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send to {TWIN_INFO[other].name}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TwinMail;
