import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  emoji?: string;
}

const PageHeader = ({ title, emoji }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 mb-8"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")}
        className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center shadow-[var(--shadow-soft)] border-none cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </motion.button>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h1>
    </motion.div>
  );
};

export default PageHeader;
