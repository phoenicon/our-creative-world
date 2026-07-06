import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HomeCard from "@/components/HomeCard";
import artHub from "@/assets/art-hub.png";
import myWeek from "@/assets/my-week.png";
import messages from "@/assets/messages.png";
import calmMode from "@/assets/calm-mode.png";

const Index = () => {
  const [twinUnread, setTwinUnread] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("ocw-twin-messages");
    const active = localStorage.getItem("ocw-active-twin") || "bethan";
    if (raw) {
      const msgs = JSON.parse(raw) as Array<{ to: string; read: boolean }>;
      setTwinUnread(msgs.filter((m) => m.to === active && !m.read).length);
    }
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 md:py-12" style={{ background: "var(--gradient-dreamy)" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          >
            🌈 Our Creative World
          </motion.h1>
          <p className="text-muted-foreground font-body text-lg">
            Welcome, Bethan & Gwener! ✨
          </p>
        </motion.div>

        <motion.a
          href={`${import.meta.env.BASE_URL}games/twin-quest.html`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5, type: "spring", bounce: 0.4 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="block mb-6 rounded-3xl p-6 md:p-7 shadow-[var(--shadow-float)] hover:shadow-[var(--shadow-glow)] transition-shadow relative overflow-hidden"
          style={{ background: "var(--gradient-sunset)" }}
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl md:text-7xl animate-float">🗡️</div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-accent-foreground/70 mb-1">
                ✨ New Adventure
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Twin Quest II
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                Four worlds! Greenwood · Crystal Caves · Flooded Ruins · the Castle 🎮
              </p>
            </div>
          </div>
        </motion.a>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <HomeCard title="Art Hub" description="Draw & colour!" image={artHub} to="/gallery" color="peach" delay={0.1} />
          <HomeCard title="My Week" description="What's happening!" image={myWeek} to="/my-week" color="sky" delay={0.15} />
          <HomeCard title="From Dad" description="Messages for you 💛" image={messages} to="/messages" color="rose" delay={0.2} />
          <HomeCard title="Wishes" description="Wishes & dreams ⭐" emoji="⭐" to="/wishes" color="lavender" delay={0.25} />
          <HomeCard title="Twin Mail" description="Bethan ↔ Gwener" emoji="💌" to="/twin-mail" color="sunshine" delay={0.3} badge={twinUnread} />
          <HomeCard title="Stickers" description="Your collection 🌟" emoji="🌟" to="/stickers" color="mint" delay={0.35} />
          <HomeCard title="Calm Space" description="Breathe & relax" image={calmMode} to="/calm" color="sky" delay={0.4} />
        </div>
      </div>
    </div>
  );
};

export default Index;
