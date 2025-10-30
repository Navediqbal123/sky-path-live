import { Plane, Globe, Building2, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
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

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-base font-bold text-white">
            SkyTrack Live
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isActive
                            ? "bg-primary text-navy-deep font-semibold shadow-md"
                            : "text-white hover:bg-secondary hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
