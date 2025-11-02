import { useLocation } from "react-router-dom";
import { FileText, TrendingUp, Users, Settings, History } from "lucide-react";

const iconMap: Record<string, any> = {
  "/history": History,
  "/documents": FileText,
  "/analytics": TrendingUp,
  "/team": Users,
  "/settings": Settings,
};

const titleMap: Record<string, string> = {
  "/history": "History",
  "/documents": "Documents",
  "/analytics": "Analytics",
  "/team": "Team",
  "/settings": "Settings",
};

export default function PlaceholderPage() {
  const location = useLocation();
  const Icon = iconMap[location.pathname] || FileText;
  const title = titleMap[location.pathname] || "Feature";

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-primary/10 border border-primary/20">
            <Icon className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          This feature is coming soon. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
