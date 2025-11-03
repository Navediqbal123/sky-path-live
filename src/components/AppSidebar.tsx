import { MessageSquare, Plane, Radar, History, Building2, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "ChatNova AI", url: "/", icon: MessageSquare },
  { title: "Track Flight", url: "/track-flight", icon: Plane },
  { title: "Live Radar", url: "/live-radar", icon: Radar },
  { title: "Flight History", url: "/flight-history", icon: History },
  { title: "Airport Info", url: "/airport-info", icon: Building2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-4 text-[22px] font-bold flex items-center gap-3">
            <MessageSquare className="w-7 h-7" />
            ChatNova AI
          </SidebarGroupLabel>
          <Separator className="mx-4 mb-3 bg-border/50" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 pl-4 pr-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-base">{item.title}</span>
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
