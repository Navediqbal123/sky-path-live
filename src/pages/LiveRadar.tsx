import MapView from "@/components/MapView";
import StatsGrid from "@/components/StatsGrid";

const LiveRadar = () => {
  return (
    <div className="min-h-screen bg-background p-6">
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
  );
};

export default LiveRadar;
