import { Plane, Clock, MapPin, TrendingUp, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FlightCardProps {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  status: "On Time" | "Delayed" | "In Air" | "Landed";
  altitude?: string;
  speed?: string;
  estimatedArrival?: string;
}

const FlightCard = ({
  flightNumber,
  airline,
  departure,
  arrival,
  status,
  altitude,
  speed,
  estimatedArrival,
}: FlightCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Delayed":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "In Air":
        return "bg-primary/20 text-primary border-primary/50";
      case "Landed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50";
    }
  };

  return (
    <Card className="gradient-card border-border/50 p-6 hover:border-primary/50 transition-all duration-300 hover:glow-primary">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{flightNumber}</h3>
            <p className="text-muted-foreground">{airline}</p>
          </div>
          <Badge className={`${getStatusColor(status)} border`}>{status}</Badge>
        </div>

        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>From</span>
            </div>
            <p className="text-lg font-semibold mt-1">{departure}</p>
          </div>

          <div className="px-4">
            <Plane className="w-6 h-6 text-primary rotate-90" />
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <span>To</span>
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold mt-1">{arrival}</p>
          </div>
        </div>

        {/* Flight Details */}
        {(altitude || speed || estimatedArrival) && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            {altitude && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Altitude</p>
                  <p className="text-sm font-semibold">{altitude}</p>
                </div>
              </div>
            )}
            {speed && (
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-sm font-semibold">{speed}</p>
                </div>
              </div>
            )}
            {estimatedArrival && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p className="text-sm font-semibold">{estimatedArrival}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FlightCard;
