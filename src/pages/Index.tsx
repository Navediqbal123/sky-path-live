import Hero from "@/components/Hero";
import MapView from "@/components/MapView";
import FlightCard from "@/components/FlightCard";
import StatsGrid from "@/components/StatsGrid";
import { useFlightData } from "@/hooks/useFlightData";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: flightData, isLoading, error } = useFlightData();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

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
            {isLoading ? "Loading live flight data..." : "Currently tracked flights with live data"}
          </p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 text-destructive">
            Failed to load flight data. Please check your API configuration.
          </div>
        )}
        
        {flightData?.data && flightData.data.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {flightData.data.slice(0, 6).map((flight, index) => (
              <FlightCard
                key={`${flight.flight.iata}-${index}`}
                flightNumber={flight.flight.iata || flight.flight.number}
                airline={flight.airline.name}
                departure={`${flight.departure.iata}, ${flight.departure.airport}`}
                arrival={`${flight.arrival.iata}, ${flight.arrival.airport}`}
                status={flight.flight_status === "active" ? "In Air" : 
                       flight.flight_status === "scheduled" ? "On Time" : 
                       flight.flight_status === "landed" ? "Landed" : "Delayed"}
                altitude={flight.live?.altitude ? `${flight.live.altitude} ft` : undefined}
                speed={flight.live?.speed_horizontal ? `${flight.live.speed_horizontal} mph` : undefined}
                estimatedArrival={new Date(flight.arrival.estimated || flight.arrival.scheduled).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              />
            ))}
          </div>
        )}
        
        {!isLoading && !error && (!flightData?.data || flightData.data.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            No live flights available at the moment.
          </div>
        )}
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
