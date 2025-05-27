
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock, 
  MapPin, 
  Users, 
  ChevronRight,
  Plus, 
  CalendarDays 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for agenda
const agendaData = {
  day1: [
    {
      id: "1a",
      title: "Registration & Welcome Coffee",
      time: "8:00 AM - 9:00 AM",
      location: "Main Hall",
      type: "break",
      description: "Pick up your badge and enjoy welcome refreshments"
    },
    {
      id: "1b",
      title: "Opening Keynote",
      time: "9:00 AM - 10:00 AM",
      location: "Main Hall",
      speaker: "Sarah Johnson",
      type: "keynote",
      description: "The Future of Technology and Innovation"
    },
    {
      id: "1c",
      title: "React for Beginners",
      time: "10:00 AM - 12:00 PM",
      location: "Room A",
      speaker: "Jane Smith",
      capacity: 50,
      registered: 42,
      type: "workshop",
      description: "Introduction to React fundamentals and component-based architecture"
    },
    {
      id: "1d",
      title: "Lunch Break",
      time: "12:00 PM - 1:00 PM",
      location: "Dining Area",
      type: "break",
      description: "Networking lunch with fellow attendees"
    },
    {
      id: "1e",
      title: "Advanced TypeScript",
      time: "2:00 PM - 4:00 PM",
      location: "Room B",
      speaker: "John Doe",
      capacity: 30,
      registered: 30,
      type: "workshop",
      description: "Deep dive into TypeScript's advanced type system and patterns"
    },
    {
      id: "1f",
      title: "Networking Reception",
      time: "5:00 PM - 6:30 PM",
      location: "Main Hall",
      type: "social",
      description: "Drinks and appetizers while networking with peers and speakers"
    }
  ],
  day2: [
    {
      id: "2a",
      title: "Morning Coffee",
      time: "8:30 AM - 9:00 AM",
      location: "Main Hall",
      type: "break",
      description: "Start your day with coffee and light breakfast"
    },
    {
      id: "2b",
      title: "UI/UX Workshop",
      time: "9:00 AM - 11:00 AM",
      location: "Room C",
      speaker: "Alice Johnson",
      capacity: 40,
      registered: 22,
      type: "workshop",
      description: "Principles of effective UI/UX design and user research methods"
    },
    {
      id: "2c",
      title: "Mobile Development",
      time: "1:00 PM - 3:00 PM",
      location: "Room A",
      speaker: "Bob Martin",
      capacity: 35,
      registered: 18,
      type: "workshop",
      description: "Building cross-platform mobile applications with React Native"
    },
    {
      id: "2d",
      title: "Cloud Services",
      time: "10:00 AM - 12:00 PM",
      location: "Room D",
      speaker: "Eva Williams",
      capacity: 45,
      registered: 43,
      type: "workshop",
      description: "Introduction to cloud computing platforms and services"
    },
    {
      id: "2e",
      title: "Closing Remarks",
      time: "4:00 PM - 4:30 PM",
      location: "Main Hall",
      type: "keynote",
      description: "Summary of the event and future directions"
    }
  ]
};

// Current time for highlighting (mocked)
const currentTime = "2025-05-01T11:00:00";
const currentDay = "day1";

const Agenda = () => {
  const [activeDay, setActiveDay] = useState(currentDay);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Function to check if an event is current/in-progress
  const isEventCurrent = (timeRange: string, day: string) => {
    if (day !== currentDay) return false;
    
    const [startStr, endStr] = timeRange.split(" - ");
    
    // Convert times to comparable format (very simple check for demo purposes)
    const currentHour = new Date(currentTime).getHours();
    const startHour = parseInt(startStr.split(":")[0]) + (startStr.includes("PM") && startStr.split(":")[0] !== "12" ? 12 : 0);
    const endHour = parseInt(endStr.split(":")[0]) + (endStr.includes("PM") && endStr.split(":")[0] !== "12" ? 12 : 0);
    
    return currentHour >= startHour && currentHour < endHour;
  };

  // Function to get badge for event type
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "workshop":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Workshop</Badge>;
      case "keynote":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Keynote</Badge>;
      case "break":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Break</Badge>;
      case "social":
        return <Badge className="bg-green-500 hover:bg-green-600">Social</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}>
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader 
            title="Event Agenda"
            description="Real-time monitoring of workshop schedule"
          >
            <Button className="gap-2" onClick={() => navigate("/add-event")}>
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DashboardHeader>
          
          <Tabs defaultValue={activeDay} onValueChange={setActiveDay} className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="day1">Day 1 (May 1)</TabsTrigger>
                <TabsTrigger value="day2">Day 2 (May 2)</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                View Full Calendar
              </Button>
            </div>
            
            <TabsContent value="day1" className="space-y-4">
              {agendaData.day1.map((event) => (
                <Card 
                  key={event.id}
                  className={`overflow-hidden ${
                    isEventCurrent(event.time, "day1") 
                      ? "border-l-4 border-l-green-500" 
                      : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          {event.capacity && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">
                                {event.registered}/{event.capacity}
                              </span>
                            </div>
                          )}
                        </div>
                        {getEventTypeBadge(event.type)}
                      </div>
                      
                      <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                      {event.speaker && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Speaker: <span className="font-medium">{event.speaker}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                      
                      {isEventCurrent(event.time, "day1") && (
                        <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-2 rounded flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Currently in progress
                        </div>
                      )}
                      
                      {event.type === "workshop" && (
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="gap-1">
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="day2" className="space-y-4">
              {agendaData.day2.map((event) => (
                <Card 
                  key={event.id}
                  className={`overflow-hidden ${
                    isEventCurrent(event.time, "day2") 
                      ? "border-l-4 border-l-green-500" 
                      : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          {event.capacity && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">
                                {event.registered}/{event.capacity}
                              </span>
                            </div>
                          )}
                        </div>
                        {getEventTypeBadge(event.type)}
                      </div>
                      
                      <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                      {event.speaker && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Speaker: <span className="font-medium">{event.speaker}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                      
                      {isEventCurrent(event.time, "day2") && (
                        <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-2 rounded flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Currently in progress
                        </div>
                      )}
                      
                      {event.type === "workshop" && (
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="gap-1">
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Upcoming Next</h3>
                <p className="text-blue-700 dark:text-blue-400">Advanced TypeScript with John Doe (2:00 PM - 4:00 PM, Room B)</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Agenda;
