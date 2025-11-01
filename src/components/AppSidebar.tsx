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
    </Sidebar>
  );
}
