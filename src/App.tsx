import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import TrackFlight from "./pages/TrackFlight";
import LiveRadar from "./pages/LiveRadar";
import AirportInfo from "./pages/AirportInfo";
import FlightHistory from "./pages/FlightHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex-1">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur px-4">
                <SidebarTrigger />
                <h2 className="text-lg font-semibold text-foreground">Live Flight Tracker</h2>
              </header>
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<TrackFlight />} />
                  <Route path="/live-radar" element={<LiveRadar />} />
                  <Route path="/airport-info" element={<AirportInfo />} />
                  <Route path="/flight-history" element={<FlightHistory />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
