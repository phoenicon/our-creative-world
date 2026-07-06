import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { checkTimeStickers } from "@/lib/stickers";
import Index from "./pages/Index.tsx";
import Gallery from "./pages/Gallery.tsx";
import MyWeek from "./pages/MyWeek.tsx";
import Messages from "./pages/Messages.tsx";
import CalmSpace from "./pages/CalmSpace.tsx";
import Stickers from "./pages/Stickers.tsx";
import Wishes from "./pages/Wishes.tsx";
import TwinMail from "./pages/TwinMail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    checkTimeStickers();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/my-week" element={<MyWeek />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/calm" element={<CalmSpace />} />
            <Route path="/stickers" element={<Stickers />} />
            <Route path="/wishes" element={<Wishes />} />
            <Route path="/twin-mail" element={<TwinMail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
