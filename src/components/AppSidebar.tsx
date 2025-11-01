import { Plane, Globe, Building2, History, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Track Flight", url: "/", icon: Plane },
  { title: "Live Radar", url: "/live-radar", icon: Globe },
  { title: "Airport Info", url: "/airport-info", icon: Building2 },
  { title: "Flight History", url: "/flight-history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/auth");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[#1E90FF]/20" style={{ backgroundColor: '#000000' }}>
      <SidebarContent style={{ backgroundColor: '#000000' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-base font-bold flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <Plane className="w-6 h-6" />
            SkyTrack
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 font-bold ${
                          isActive
                            ? "shadow-[0_0_15px_rgba(30,144,255,0.6)]"
                            : "hover:shadow-[0_0_10px_rgba(30,144,255,0.4)]"
                        }`
                      }
                      style={{ color: '#FFFFFF' }}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter style={{ backgroundColor: '#000000' }} className="border-t border-[#1E90FF]/20 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 font-bold hover:shadow-[0_0_10px_rgba(30,144,255,0.4)] w-full"
              style={{ color: '#FFFFFF' }}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
