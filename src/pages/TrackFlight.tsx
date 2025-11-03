import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plane, MapPin, Clock, Loader2, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface FlightData {
  airline: { name: string };
  flight: { iata: string };
  departure: { airport: string; iata: string; scheduled: string };
  arrival: { airport: string; iata: string; scheduled: string };
  flight_status: string;
}

const TrackFlight = () => {
  const [flightCode, setFlightCode] = useState("");
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackFlight = async () => {
    if (!flightCode.trim()) {
      setError("Please enter a flight code");
      return;
    }

    setLoading(true);
    setError("");
    setFlightData(null);

    try {
      const { data, error } = await supabase.functions.invoke("fetch-flights", {
        body: { flight_iata: flightCode.trim() },
      });

      if (error) throw error;

      if (data?.data && data.data.length > 0) {
        setFlightData(data.data[0]);
      } else {
        setError("Flight not found. Please check the flight code and try again.");
      }
    } catch (err) {
      setError("Failed to fetch flight data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("active") || statusLower.includes("enroute")) {
      return "bg-primary/20 text-primary border-primary/50";
    }
    if (statusLower.includes("landed")) {
      return "bg-green-500/20 text-green-400 border-green-500/50";
    }
    if (statusLower.includes("scheduled")) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
    if (statusLower.includes("cancelled") || statusLower.includes("delayed")) {
      return "bg-red-500/20 text-red-400 border-red-500/50";
    }
    return "bg-muted/20 text-muted-foreground border-muted/50";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">Track Flight</h1>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <Plane className="w-10 h-10 text-primary" />
              Track Your Flight
            </h1>
          <p className="text-muted-foreground">
            Enter a flight code to get real-time flight information
          </p>
        </div>

        <Card className="gradient-card border-border/50 p-6">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter flight code (e.g., AI185)"
              value={flightCode}
              onChange={(e) => setFlightCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrackFlight()}
              className="flex-1 bg-background/50 border-border/50 focus:border-primary"
            />
            <Button
              onClick={handleTrackFlight}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4" />
                  Track Flight
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/50 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </Card>

        {flightData && (
          <Card className="gradient-card border-border/50 p-6 animate-fade-in glow-primary">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {flightData.airline.name}
                  </h2>
                  <p className="text-xl text-primary mt-1">
                    Flight {flightData.flight.iata}
                  </p>
                </div>
                <Badge className={`${getStatusColor(flightData.flight_status)} border text-base px-4 py-2`}>
                  {flightData.flight_status}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">DEPARTURE</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {flightData.departure.airport}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {flightData.departure.iata}
                    </p>
                  </div>
                  {flightData.departure.scheduled && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {new Date(flightData.departure.scheduled).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">ARRIVAL</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {flightData.arrival.airport}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {flightData.arrival.iata}
                    </p>
                  </div>
                  {flightData.arrival.scheduled && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {new Date(flightData.arrival.scheduled).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default TrackFlight;
