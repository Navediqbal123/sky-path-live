import { Card } from "@/components/ui/card";
import { History, Plane, Clock, MapPin, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

const FlightHistory = () => {
  const historyData = [
    {
      flightNumber: "AI185",
      airline: "Air India",
      date: "2024-01-15",
      from: "DEL",
      to: "JFK",
      status: "Completed",
    },
    {
      flightNumber: "BA142",
      airline: "British Airways",
      date: "2024-01-14",
      from: "LHR",
      to: "DEL",
      status: "Completed",
    },
    {
      flightNumber: "EK507",
      airline: "Emirates",
      date: "2024-01-13",
      from: "DXB",
      to: "BOM",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">Flight History</h1>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <History className="w-10 h-10 text-primary" />
              Flight History
            </h1>
          <p className="text-muted-foreground">
            View your previously tracked flights
          </p>
        </div>

        <div className="space-y-4">
          {historyData.map((flight, index) => (
            <Card
              key={index}
              className="gradient-card border-border/50 p-6 hover:border-primary/50 transition-all duration-300 hover:glow-primary cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {flight.flightNumber}
                    </h3>
                    <p className="text-muted-foreground">{flight.airline}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 border">
                    {flight.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>From</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{flight.from}</p>
                  </div>

                  <div className="px-4">
                    <Plane className="w-6 h-6 text-primary rotate-90" />
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                      <span>To</span>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold mt-1">{flight.to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(flight.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {historyData.length === 0 && (
          <Card className="gradient-card border-border/50 p-12 text-center">
            <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No flight history available yet. Start tracking flights!
            </p>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default FlightHistory;
