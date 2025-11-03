import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Plane, Search, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AirportInfo = () => {
  const [airportCode, setAirportCode] = useState("");

  const handleSearch = () => {
    // Placeholder for future airport search functionality
    console.log("Searching for airport:", airportCode);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">Airport Info</h1>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <Building2 className="w-10 h-10 text-primary" />
              Airport Information
            </h1>
          <p className="text-muted-foreground">
            Search for airport details and statistics
          </p>
        </div>

        <Card className="gradient-card border-border/50 p-6">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter airport code (e.g., DEL, JFK)"
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-background/50 border-border/50 focus:border-primary"
            />
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="gradient-card border-border/50 p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Active Departures
                </h3>
                <p className="text-3xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
              </div>
            </div>
          </Card>

          <Card className="gradient-card border-border/50 p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Active Arrivals
                </h3>
                <p className="text-3xl font-bold text-primary">142</p>
                <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="gradient-card border-border/50 p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Popular Airports
          </h3>
          <div className="space-y-3">
            {[
              { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi, India" },
              { code: "JFK", name: "John F. Kennedy International Airport", city: "New York, USA" },
              { code: "LHR", name: "London Heathrow Airport", city: "London, UK" },
              { code: "DXB", name: "Dubai International Airport", city: "Dubai, UAE" },
            ].map((airport) => (
              <div
                key={airport.code}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div>
                  <p className="font-bold text-foreground">{airport.name}</p>
                  <p className="text-sm text-muted-foreground">{airport.city}</p>
                </div>
                <div className="text-primary font-bold text-lg">{airport.code}</div>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default AirportInfo;
