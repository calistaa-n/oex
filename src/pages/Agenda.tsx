import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Users, ChevronRight, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

type Agenda = {
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

type GroupedAgendas = {
  [month: string]: {
    [day: string]: Agenda[];
  };
};

const Agenda = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [groupedAgendas, setGroupedAgendas] = useState<GroupedAgendas>({});
  const [activeMonth, setActiveMonth] = useState<string>("");
  const [agendas, setAgendas] = useState<Agenda[]>([]);

  useEffect(() => {
    const fetchAgendas = async () => {
      const { data, error } = await supabase
        .from("agendas")
        .select("*")
        .order("date", { ascending: true })
        .eq("event_id", eventId);

      if (error) console.error("Error fetching agendas:", error);
      else setAgendas(data);
    };
    fetchAgendas();
  }, []);

  useEffect(() => {
    const grouped = groupAgendasByMonthAndDate(agendas);
    setGroupedAgendas(grouped);
  }, [agendas]);

  useEffect(() => {
    if (!activeMonth && Object.keys(groupedAgendas).length > 0) {
      setActiveMonth(Object.keys(groupedAgendas)[0]);
    }
  }, [groupedAgendas, activeMonth]);

  const groupAgendasByMonthAndDate = (agendas) => {
    const grouped = {};
    agendas.forEach((agenda) => {
      const dateObj = parseISO(agenda.date);
      const monthYear = format(dateObj, "MMMM yyyy");
      const day = format(dateObj, "EEEE, MMM d");

      if (!grouped[monthYear]) grouped[monthYear] = {};
      if (!grouped[monthYear][day]) grouped[monthYear][day] = [];

      grouped[monthYear][day].push(agenda);
    });
    return grouped;
  };

  const getAgendaTypeBadge = (type) => {
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
        className={cn(
          "transition-all duration-300",
          isMobile ? "pl-0" : "pl-64"
        )}
      >
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader
            title="Agenda"
            description="Real-time monitoring of event's schedule"
          >
            <Button
              className="gap-2"
              onClick={() => navigate(`/event/${id}/agendas/add`)}
            >
              {" "}
              <Plus className="h-4 w-4" /> Add Agenda{" "}
            </Button>
          </DashboardHeader>

          {/* Month Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.keys(groupedAgendas).map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                  activeMonth === month
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Agendas of Active Month */}
          {groupedAgendas[activeMonth] &&
            Object.entries(groupedAgendas[activeMonth]).map(
              ([day, dayAgendas]) => (
                <div key={day} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    {day}
                  </h3>
                  <div className="space-y-4">
                    {dayAgendas.map((agenda) => (
                      <Card key={agenda.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm font-medium">
                                    {agenda.start_time?.slice(0, 5)} -{" "}
                                    {agenda.end_time?.slice(0, 5)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">
                                    {agenda.location}
                                  </span>
                                </div>
                                {agenda.capacity && (
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm">
                                      {agenda.registered}/{agenda.capacity}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {getAgendaTypeBadge(agenda.type)}
                            </div>
                            <h3 className="text-xl font-medium mb-2">
                              {agenda.title}
                            </h3>
                            {agenda.speaker && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Speaker:{" "}
                                <span className="font-medium">
                                  {agenda.speaker}
                                </span>
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                              {agenda.description}
                            </p>
                            {agenda.type === "workshop" && (
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
