import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import VulnerabilityScanner from "./components/security/VulnerabilityScanner";
import PasswordAnalyzer from "./components/security/PasswordAnalyzer";
import ReportGenerator from "./components/reports/ReportGenerator";
import RealTimeAlerts from "./components/alerts/RealTimeAlerts";
import BehavioralAnalysis from "./components/analysis/BehavioralAnalysis";
import PredictiveIntelligence from "./components/intelligence/PredictiveIntelligence";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vulnerabilities" element={<div className="min-h-screen bg-background p-6"><VulnerabilityScanner /></div>} />
          <Route path="/passwords" element={<div className="min-h-screen bg-background p-6"><PasswordAnalyzer /></div>} />
          <Route path="/reports" element={<div className="min-h-screen bg-background p-6"><ReportGenerator /></div>} />
          <Route path="/alerts" element={<div className="min-h-screen bg-background p-6"><RealTimeAlerts /></div>} />
          <Route path="/behavioral-analysis" element={<div className="min-h-screen bg-background p-6"><BehavioralAnalysis /></div>} />
          <Route path="/predictive-intelligence" element={<div className="min-h-screen bg-background p-6"><PredictiveIntelligence /></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
