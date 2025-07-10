import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { Users, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Mock data for room utilization
const roomData = [
  {
    id: "room-a",
    name: "Room A",
    capacity: 50,
    currentAttendees: 38,
    status: "in-progress",
    event: "React for Beginners",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    trend: "up",
    hourlyData: [
      { time: "9 AM", attendees: 0 },
      { time: "10 AM", attendees: 32 },
      { time: "11 AM", attendees: 38 },
      { time: "12 PM", attendees: 0 },
    ],
  },
  {
    id: "room-b",
    name: "Room B",
    capacity: 30,
    currentAttendees: 28,
    status: "in-progress",
    event: "Advanced TypeScript",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    trend: "stable",
    hourlyData: [
      { time: "1 PM", attendees: 0 },
      { time: "2 PM", attendees: 24 },
      { time: "3 PM", attendees: 28 },
      { time: "4 PM", attendees: 0 },
    ],
  },
  {
    id: "room-c",
    name: "Room C",
    capacity: 40,
    currentAttendees: 0,
    status: "upcoming",
    event: "UI/UX Workshop",
    startTime: "9:00 AM",
    endTime: "11:00 AM (tomorrow)",
    trend: "none",
    hourlyData: [
      { time: "8 AM", attendees: 0 },
      { time: "9 AM", attendees: 0 },
      { time: "10 AM", attendees: 0 },
      { time: "11 AM", attendees: 0 },
    ],
  },
  {
    id: "room-d",
    name: "Room D",
    capacity: 45,
    currentAttendees: 30,
    status: "in-progress",
    event: "Cloud Services",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    trend: "down",
    hourlyData: [
      { time: "9 AM", attendees: 0 },
      { time: "10 AM", attendees: 41 },
      { time: "11 AM", attendees: 30 },
      { time: "12 PM", attendees: 0 },
    ],
  },
  {
    id: "room-e",
    name: "Room E",
    capacity: 60,
    currentAttendees: 0,
    status: "available",
    event: "No event scheduled",
    startTime: "-",
    endTime: "-",
    trend: "none",
    hourlyData: [
      { time: "9 AM", attendees: 0 },
      { time: "10 AM", attendees: 0 },
      { time: "11 AM", attendees: 0 },
      { time: "12 PM", attendees: 0 },
    ],
  },
];

// Comparison data for all rooms
const roomComparisonData = [
  {
    time: "9 AM",
    "Room A": 0,
    "Room B": 0,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
  {
    time: "10 AM",
    "Room A": 32,
    "Room B": 0,
    "Room C": 0,
    "Room D": 41,
    "Room E": 0,
  },
  {
    time: "11 AM",
    "Room A": 38,
    "Room B": 0,
    "Room C": 0,
    "Room D": 30,
    "Room E": 0,
  },
  {
    time: "12 PM",
    "Room A": 0,
    "Room B": 0,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
  {
    time: "1 PM",
    "Room A": 0,
    "Room B": 0,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
  {
    time: "2 PM",
    "Room A": 0,
    "Room B": 24,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
  {
    time: "3 PM",
    "Room A": 0,
    "Room B": 28,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
  {
    time: "4 PM",
    "Room A": 0,
    "Room B": 0,
    "Room C": 0,
    "Room D": 0,
    "Room E": 0,
  },
];

const RoomMonitoring = () => {
  const [lastUpdated] = useState(() => new Date().toLocaleTimeString());
  const isMobile = useIsMobile();

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">In Progress</Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
        );
      case "available":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Available</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get trend indicator
  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-5 w-5 text-green-500" />;
      case "down":
        return <ArrowDown className="h-5 w-5 text-red-500" />;
      case "stable":
        return <span className="inline-block h-5 w-5 text-amber-500">→</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}
      >
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader
            title="Room Monitoring"
            description="Real-time status of workshop rooms and attendee counts"
          >
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </DashboardHeader>

          <div className="mb-6 text-sm text-right text-gray-500">
            Last updated: {lastUpdated}
          </div>

          <Tabs defaultValue="rooms">
            <TabsList className="mb-6">
              <TabsTrigger value="rooms">Room Details</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="rooms">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roomData.map((room) => (
                  <Card
                    key={room.id}
                    className={cn(
                      "overflow-hidden",
                      room.status === "in-progress" &&
                        "border-green-200 dark:border-green-900"
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-medium">{room.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {room.event}
                            </p>
                          </div>
                          {getStatusBadge(room.status)}
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-gray-500" />
                              <span className="font-medium">
                                {room.currentAttendees} / {room.capacity}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTrendIndicator(room.trend)}
                            </div>
                          </div>

                          <div className="h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={room.hourlyData}
                                margin={{
                                  top: 5,
                                  right: 10,
                                  left: 0,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  opacity={0.2}
                                />
                                <XAxis dataKey="time" />
                                <YAxis
                                  allowDecimals={false}
                                  domain={[0, "dataMax + 5"]}
                                />
                                <Tooltip />
                                <Bar dataKey="attendees" fill="#6366F1" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500">
                            <div>
                              Start:{" "}
                              <span className="font-medium">
                                {room.startTime}
                              </span>
                            </div>
                            <div>
                              End:{" "}
                              <span className="font-medium">
                                {room.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Room Comparison</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={roomComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Room A" fill="#6366F1" />
                        <Bar dataKey="Room B" fill="#06B6D4" />
                        <Bar dataKey="Room C" fill="#10B981" />
                        <Bar dataKey="Room D" fill="#F59E0B" />
                        <Bar dataKey="Room E" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default RoomMonitoring;
