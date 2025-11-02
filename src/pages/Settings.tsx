import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Globe, Palette, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your flight tracking experience
          </p>
        </div>

        <Card className="gradient-card border-border/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for flight status changes
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="gradient-card border-border/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Language</h3>
                <p className="text-sm text-muted-foreground">English (US)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="gradient-card border-border/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="gradient-card border-border/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your data and privacy settings
                </p>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="save-history" className="text-foreground">
                  Save flight search history
                </Label>
                <Switch id="save-history" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-foreground">
                  Share anonymous analytics
                </Label>
                <Switch id="analytics" />
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
