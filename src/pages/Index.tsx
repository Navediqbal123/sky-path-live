import Hero from "@/components/Hero";
import MapView from "@/components/MapView";
import FlightCard from "@/components/FlightCard";
import StatsGrid from "@/components/StatsGrid";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  // Sample flight data (would come from AviationStack API)
  const sampleFlights = [
    {
      flightNumber: "AA123",
      airline: "American Airlines",
      departure: "JFK, New York",
      arrival: "LAX, Los Angeles",
      status: "In Air" as const,
      altitude: "35,000 ft",
      speed: "520 mph",
      estimatedArrival: "14:45 PST",
    },
    {
      flightNumber: "DL456",
      airline: "Delta Airlines",
      departure: "ATL, Atlanta",
      arrival: "LHR, London",
      status: "On Time" as const,
      altitude: "38,000 ft",
      speed: "545 mph",
      estimatedArrival: "06:30 GMT",
    },
    {
      flightNumber: "UA789",
      airline: "United Airlines",
      departure: "SFO, San Francisco",
      arrival: "NRT, Tokyo",
      status: "Delayed" as const,
      estimatedArrival: "18:20 JST",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* API Notice */}
      <div className="container mx-auto px-4 py-6">
        <Alert className="border-primary/50 bg-primary/10">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">API Integration Required</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            To enable live flight tracking, you'll need to add your AviationStack API key. 
            Consider connecting to Lovable Cloud for secure API key storage.
          </AlertDescription>
        </Alert>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8">
        <StatsGrid />
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Live Flight Map</h2>
              <p className="text-muted-foreground mt-1">
                Real-time global flight tracking
              </p>
            </div>
          </div>
          <MapView />
        </div>
      </div>

      {/* Flight Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 mb-6">
          <h2 className="text-3xl font-bold">Active Flights</h2>
          <p className="text-muted-foreground">
            Currently tracked flights with live data
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleFlights.map((flight, index) => (
            <FlightCard key={index} {...flight} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-16 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            SkyTrack Live - Real-time flight tracking powered by aviation data
          </p>
          <p className="text-xs mt-2">
            Built with React, Tailwind CSS, and Mapbox
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
