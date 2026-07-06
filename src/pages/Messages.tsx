import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";

interface Message {
  id: string;
  text: string;
  date: string;
  emoji?: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ocw-messages");
    return saved ? JSON.parse(saved) : [];
  });

  // Messages from Dad ship with the site itself (public/content/dad-messages.json),
  // so editing that file in the repo delivers them to every device on next deploy.
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/dad-messages.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((shipped: Message[]) => {
        setMessages((local) => {
          const localIds = new Set(local.map((m) => m.id));
          return [...shipped.filter((m) => !localIds.has(m.id)), ...local];
        });
      })
      .catch(() => {});
  }, []);

  const [newMsg, setNewMsg] = useState("");

  const addMessage = () => {
    if (!newMsg.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMsg,
      date: new Date().toLocaleDateString(),
      emoji: "💛",
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    localStorage.setItem("ocw-messages", JSON.stringify(updated));
    setNewMsg("");
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-sunset)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="From Dad" emoji="💌" />

        {/* Add message (parent mode) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur rounded-3xl p-4 mb-6 shadow-[var(--shadow-soft)]"
        >
          <textarea
            placeholder="Write a message... 💛"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-full bg-transparent rounded-2xl p-2 text-sm font-body resize-none border-none outline-none placeholder:text-muted-foreground/60 h-20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addMessage}
            className="w-full bg-rose rounded-2xl py-3 font-display font-bold text-rose-foreground cursor-pointer border-none text-base"
          >
            Send with love 💌
          </motion.button>
        </motion.div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card/80 backdrop-blur rounded-3xl p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="text-3xl mb-2">{msg.emoji}</div>
              <p className="font-body text-foreground leading-relaxed">{msg.text}</p>
              <p className="text-xs text-muted-foreground mt-3">{msg.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
