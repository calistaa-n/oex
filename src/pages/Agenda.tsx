import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import supabase from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  speaker?: string;
  capacity?: number;
  registered?: number;
  type?: string;
};

type GroupedEvents = {
  [month: string]: {
    [day: string]: Event[];
  };
};

const Agenda = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});
  const [activeMonth, setActiveMonth] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("agendas")
        .select("*")
        .order("date", { ascending: true });

      if (error) console.error("Error fetching events:", error);
      else setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const grouped = groupEventsByMonthAndDate(events);
    setGroupedEvents(grouped);
  }, [events]);

  useEffect(() => {
    if (!activeMonth && Object.keys(groupedEvents).length > 0) {
      setActiveMonth(Object.keys(groupedEvents)[0]);
    }
  }, [groupedEvents, activeMonth]);

  const groupEventsByMonthAndDate = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const dateObj = parseISO(event.date);
      const monthYear = format(dateObj, "MMMM yyyy");
      const day = format(dateObj, "EEEE, MMM d");

      if (!grouped[monthYear]) grouped[monthYear] = {};
      if (!grouped[monthYear][day]) grouped[monthYear][day] = [];

      grouped[monthYear][day].push(event);
    });
    return grouped;
  };

  const getEventTypeBadge = (type) => {
    switch (type) {
      case "workshop":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Workshop</Badge>
        );
      case "keynote":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">Keynote</Badge>
        );
      case "break":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Break</Badge>;
      case "social":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Social</Badge>
        );
      default:
        return <Badge>{type}</Badge>;
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
            title="Event Agenda"
            description="Real-time monitoring of workshop schedule"
          >
            <Button className="gap-2" onClick={() => navigate("/add-agenda")}>
              {" "}
              <Plus className="h-4 w-4" /> Add Event{" "}
            </Button>
          </DashboardHeader>

          {/* Month Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.keys(groupedEvents).map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeMonth === month
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Events of Active Month */}
          {groupedEvents[activeMonth] &&
            Object.entries(groupedEvents[activeMonth]).map(
              ([day, dayEvents]) => (
                <div key={day} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    {day}
                  </h3>
                  <div className="space-y-4">
                    {dayEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm font-medium">
                                    {event.start_time?.slice(0, 5)} -{" "}
                                    {event.end_time?.slice(0, 5)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">
                                    {event.location}
                                  </span>
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
                            <h3 className="text-xl font-medium mb-2">
                              {event.title}
                            </h3>
                            {event.speaker && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Speaker:{" "}
                                <span className="font-medium">
                                  {event.speaker}
                                </span>
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                              {event.description}
                            </p>
                            {event.type === "workshop" && (
                              <div className="mt-4 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1"
                                >
                                  View Details{" "}
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            )}
        </main>
      </div>
    </div>
  );
};

export default Agenda;
