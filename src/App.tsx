import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Weeks from "./pages/Weeks.tsx";
import WeekDetail from "./pages/WeekDetail.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SOS from "./pages/SOS.tsx";
import Tools from "./pages/Tools.tsx";
import Journal from "./pages/Journal.tsx";
import Settings from "./pages/Settings.tsx";
import GuidedExercise from "./pages/GuidedExercise.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/exercise/:id" element={<GuidedExercise />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/weeks/:weekNumber" element={<WeekDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
