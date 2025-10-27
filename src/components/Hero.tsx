import { Plane, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[40vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="w-12 h-12 text-primary animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold text-glow">
            SkyTrack Live
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Track flights in real-time across the globe with live data, paths, and airline information
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex gap-2 p-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
            <Input
              placeholder="Enter flight number or airline (e.g., AA123, Delta)"
              className="flex-1 bg-background/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
              <Search className="w-5 h-5 mr-2" />
              Track Flight
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Live Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Global Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
