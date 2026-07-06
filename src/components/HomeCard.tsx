import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface HomeCardProps {
  title: string;
  description: string;
  image?: string;
  emoji?: string;
  to: string;
  color: "lavender" | "mint" | "peach" | "sky" | "rose" | "sunshine";
  delay?: number;
  badge?: number;
}

const colorMap = {
  lavender: "bg-lavender",
  mint: "bg-mint",
  peach: "bg-peach",
  sky: "bg-sky",
  rose: "bg-rose",
  sunshine: "bg-sunshine",
};

const HomeCard = ({ title, description, image, emoji, to, color, delay = 0, badge }: HomeCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(to)}
      className={`${colorMap[color]} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)] transition-shadow w-full cursor-pointer border-none outline-none relative`}
    >
      {badge && badge > 0 ? (
        <span className="absolute top-3 right-3 min-w-[24px] h-6 px-2 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center shadow-[var(--shadow-soft)]">
          {badge}
        </span>
      ) : null}
      {image ? (
        <img src={image} alt={title} className="w-28 h-28 object-contain" />
      ) : (
        <div className="w-28 h-28 flex items-center justify-center text-7xl">{emoji}</div>
      )}
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground text-sm font-body">{description}</p>
    </motion.button>
  );
};

export default HomeCard;
