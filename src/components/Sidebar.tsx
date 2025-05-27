
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  MonitorSmartphone,
  Bell, 
  CalendarDays, 
  ShoppingBag,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    color: "text-indigo-500"
  },
  {
    title: "Workshop Management",
    href: "/workshop-management",
    icon: Users,
    color: "text-blue-500"
  },
  {
    title: "Room Monitoring",
    href: "/room-monitoring",
    icon: MonitorSmartphone,
    color: "text-cyan-500"
  },
  {
    title: "Reminder",
    href: "/reminder",
    icon: Bell,
    color: "text-amber-500"
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
    color: "text-emerald-500"
  },
  {
    title: "Merchandise",
    href: "/merchandise-management",
    icon: ShoppingBag,
    color: "text-rose-500"
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out transform",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">EventSphere</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Workshop Management</p>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={isMobile ? toggleSidebar : undefined}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-all group",
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-950/50" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? item.color : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )} 
                  />
                  <span 
                    className={cn(
                      "font-medium",
                      isActive 
                        ? "text-indigo-600 dark:text-indigo-400" 
                        : "text-gray-700 dark:text-gray-200"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 mt-auto">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>EventSphere © 2025</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
