import { Plane, Users, Globe, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const StatsGrid = () => {
  const stats = [
    {
      icon: Plane,
      label: "Active Flights",
      value: "12,847",
      change: "+234",
      changeType: "positive" as const,
    },
    {
      icon: Globe,
      label: "Countries Covered",
      value: "195",
      change: "Global",
      changeType: "neutral" as const,
    },
    {
      icon: Users,
      label: "Airlines Tracked",
      value: "450+",
      change: "+12",
      changeType: "positive" as const,
    },
    {
      icon: TrendingUp,
      label: "Flights Today",
      value: "102.4K",
      change: "+5.2%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="gradient-card border-border/50 p-6 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p
                  className={`text-sm ${
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
