import MapView from "@/components/MapView";
import StatsGrid from "@/components/StatsGrid";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const LiveRadar = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">Live Radar</h1>
      </div>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground">Live Flight Radar</h1>
          <p className="text-muted-foreground">
            Real-time flight tracking across the globe
          </p>
        </div>

        <StatsGrid />
        
          <div className="mt-8">
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRadar;
