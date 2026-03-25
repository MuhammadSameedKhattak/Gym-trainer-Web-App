import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { storage } from '@/lib/storage';
import Index from "./pages/Index.tsx";
import WorkoutPage from "./pages/WorkoutPage.tsx";
import DietPage from "./pages/DietPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AppLayout from "./components/AppLayout.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [onboarded, setOnboarded] = useState(storage.isOnboarded());

  const handleReset = () => {
    setOnboarded(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          {!onboarded ? (
            <Index />
          ) : (
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage onReset={handleReset} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
