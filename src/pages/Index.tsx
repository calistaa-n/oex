
import { 
  Users, 
  MonitorSmartphone, 
  Bell, 
  CalendarDays, 
  ShoppingBag 
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  const modules = [
    {
      title: "Workshop Management",
      description: "Track participants and interactions with speakers",
      icon: <Users className="h-6 w-6" />,
      href: "/workshop-management",
      color: "blue",
      stats: [
        { value: 12, label: "Workshops" },
        { value: 342, label: "Participants" },
      ],
    },
    {
      title: "Room Monitoring",
      description: "Monitor real-time status of workshop rooms",
      icon: <MonitorSmartphone className="h-6 w-6" />,
      href: "/room-monitoring",
      color: "cyan",
      stats: [
        { value: 8, label: "Active Rooms" },
        { value: 187, label: "Current Attendees" },
      ],
    },
    {
      title: "Reminder",
      description: "Automatic reminders based on workshop schedule",
      icon: <Bell className="h-6 w-6" />,
      href: "/reminder",
      color: "amber",
      stats: [
        { value: 24, label: "Scheduled" },
        { value: 8, label: "Sent Today" },
      ],
    },
    {
      title: "Agenda",
      description: "Real-time monitoring of workshop agenda",
      icon: <CalendarDays className="h-6 w-6" />,
      href: "/agenda",
      color: "emerald",
      stats: [
        { value: 18, label: "Sessions" },
        { value: 3, label: "In Progress" },
      ],
    },
    {
      title: "Merchandise Management",
      description: "Manage merchandise collection using QR codes",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/merchandise-management",
      color: "rose",
      stats: [
        { value: 560, label: "Total Items" },
        { value: 128, label: "Collected" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}>
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader 
            title="EventSphere Dashboard"
            description="Overview of your workshop management system"
          >
            <Button>Generate Report</Button>
          </DashboardHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <DashboardCard 
                key={module.title}
                title={module.title}
                description={module.description}
                icon={module.icon}
                href={module.href}
                color={module.color}
                stats={module.stats}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
