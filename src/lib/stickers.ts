import { toast } from "sonner";

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: 'art' | 'week' | 'calm' | 'wishes' | 'messages' | 'quest' | 'special';
  earnedHow: string;
}

export const ALL_STICKERS: Sticker[] = [
  { id: 'first-art', emoji: '🎨', name: 'First Drawing', category: 'art', earnedHow: 'Save your first artwork' },
  { id: 'art-collector', emoji: '🖼️', name: 'Art Collector', category: 'art', earnedHow: 'Save 5 artworks' },
  { id: 'rainbow-artist', emoji: '🌈', name: 'Rainbow Artist', category: 'art', earnedHow: 'Use 5 different colours in one drawing' },

  { id: 'mood-tracker', emoji: '😊', name: 'Mood Tracker', category: 'week', earnedHow: 'Log your mood for 3 days' },
  { id: 'storyteller', emoji: '📖', name: 'Storyteller', category: 'week', earnedHow: 'Write notes for a whole week' },

  { id: 'first-breath', emoji: '🫧', name: 'Deep Breather', category: 'calm', earnedHow: 'Complete one breathing session' },
  { id: 'zen-master', emoji: '🌙', name: 'Zen Master', category: 'calm', earnedHow: 'Breathe for 1 full minute' },

  { id: 'first-wish', emoji: '⭐', name: 'Wish Maker', category: 'wishes', earnedHow: 'Make your first wish' },
  { id: 'dream-keeper', emoji: '✨', name: 'Dream Keeper', category: 'wishes', earnedHow: 'Save 5 wishes or dreams' },

  { id: 'sister-love', emoji: '💕', name: 'Sister Love', category: 'messages', earnedHow: 'Send your first twin message' },
  { id: 'twin-power', emoji: '👯', name: 'Twin Power', category: 'messages', earnedHow: 'Send 10 twin messages' },

  // Earned inside Twin Quest II — the game writes straight to the same storage key
  { id: 'quest-greenwood', emoji: '🐶', name: 'Greenwood Hero', category: 'quest', earnedHow: 'Beat the Slime King in the Greenwood' },
  { id: 'quest-caves', emoji: '💎', name: 'Cave Explorer', category: 'quest', earnedHow: 'Light up the Crystal Caves' },
  { id: 'quest-ruins', emoji: '🐸', name: 'Ruin Raider', category: 'quest', earnedHow: 'Defeat the Grumpy Frog in the Flooded Ruins' },
  { id: 'quest-castle', emoji: '👑', name: 'Castle Champion', category: 'quest', earnedHow: 'Rescue the golden puppy from the Slime King\'s Castle' },

  { id: 'morning-bird', emoji: '🌅', name: 'Morning Bird', category: 'special', earnedHow: 'Use the app before 9am' },
  { id: 'night-owl', emoji: '🦉', name: 'Night Owl', category: 'special', earnedHow: 'Use the app after 7pm' },
  { id: 'weekend-wonder', emoji: '🌟', name: 'Weekend Wonder', category: 'special', earnedHow: 'Use the app on a weekend' },
];

const STORAGE_KEY = 'ocw-stickers';

export function getEarnedStickers(): string[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function earnSticker(id: string): boolean {
  const earned = getEarnedStickers();
  if (earned.includes(id)) return false;
  earned.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
  const sticker = ALL_STICKERS.find((s) => s.id === id);
  if (sticker) {
    toast.success(`✨ New Sticker! ${sticker.name}`, {
      description: `${sticker.emoji} ${sticker.earnedHow}`,
      duration: 4000,
    });
  }
  return true;
}

export function hasSticker(id: string): boolean {
  return getEarnedStickers().includes(id);
}

export function checkTimeStickers() {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay();
  if (h < 9) earnSticker('morning-bird');
  if (h >= 19) earnSticker('night-owl');
  if (day === 0 || day === 6) earnSticker('weekend-wonder');
}
