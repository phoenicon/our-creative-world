import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { earnSticker } from "@/lib/stickers";

import girlsInVan from "@/assets/drawings/girls-in-van.jpg";
import girlsWithHorse from "@/assets/drawings/girls-with-horse.jpg";
import dogBunnyCat from "@/assets/drawings/dog-bunny-cat.jpg";
import girlsAndMap from "@/assets/drawings/girls-and-map.jpg";
import adventureVan from "@/assets/drawings/adventure-van.png";
import girlsAndHorses from "@/assets/drawings/girls-and-horses.jpg";

interface Drawing {
  id: string;
  src: string;
  name: string;
  date: string;
  fromDad?: boolean;
}

const DAD_DRAWINGS: Drawing[] = [
  { id: "dad-1", src: girlsInVan, name: "Girls in the Van", date: "From Dad 💛", fromDad: true },
  { id: "dad-2", src: girlsWithHorse, name: "Girls & Horse", date: "From Dad 💛", fromDad: true },
  { id: "dad-3", src: dogBunnyCat, name: "Dog, Bunny & Cat", date: "From Dad 💛", fromDad: true },
  { id: "dad-4", src: girlsAndMap, name: "Adventure Map", date: "From Dad 💛", fromDad: true },
  { id: "dad-5", src: adventureVan, name: "Adventure Awaits!", date: "From Dad 💛", fromDad: true },
  { id: "dad-6", src: girlsAndHorses, name: "Farm Friends", date: "From Dad 💛", fromDad: true },
];

const Gallery = () => {
  const [drawings, setDrawings] = useState<Drawing[]>(() => {
    const saved = localStorage.getItem("ocw-drawings");
    return saved ? JSON.parse(saved) : [];
  });
  const [selected, setSelected] = useState<Drawing | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = (updated: Drawing[]) => {
    setDrawings(updated);
    localStorage.setItem("ocw-drawings", JSON.stringify(updated));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newDrawing: Drawing = {
        id: Date.now().toString(),
        src: reader.result as string,
        name: file.name.replace(/\.[^.]+$/, ""),
        date: new Date().toLocaleDateString(),
      };
      const next = [newDrawing, ...drawings];
      save(next);
      earnSticker('first-art');
      if (next.length >= 5) earnSticker('art-collector');
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--gradient-sunset)" }}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Art Hub" emoji="🎨" />

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Upload button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-3xl bg-card/80 backdrop-blur border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <span className="font-display text-sm text-muted-foreground">Add Drawing</span>
          </motion.button>

          {/* User drawings */}
          {drawings.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(d)}
              className="aspect-square rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] cursor-pointer border-none p-0"
            >
              <img src={d.src} alt={d.name} className="w-full h-full object-cover" />
            </motion.button>
          ))}

          {/* Dad's colouring pages */}
          {DAD_DRAWINGS.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (drawings.length + i) * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(d)}
              className="aspect-square rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] cursor-pointer border-none p-0 bg-white"
            >
              <img src={d.src} alt={d.name} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.src} alt={selected.name} className="w-full rounded-3xl shadow-[var(--shadow-float)]" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-card shadow-[var(--shadow-soft)] flex items-center justify-center cursor-pointer border-none"
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
              <div className="mt-3 text-center">
                <p className="font-display text-lg text-card">{selected.name}</p>
                <p className="text-card/70 text-sm">{selected.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
