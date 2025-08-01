import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/DashboardHeader";

type Agenda = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  room: string;
};

const AgendaPreview = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const [agendas, setAgendas] = useState<Agenda[]>([]);

  useEffect(() => {
    const fetchAgendas = async () => {
      const { data, error } = await supabase
        .from("agendas")
        .select("*")
        .order("start_time", { ascending: true })
        .eq("event_id", eventId);

      if (error) console.error("Error fetching agendas:", error);
      else setAgendas(data);
    };
    fetchAgendas();
  }, []);

  const isAgendaOngoing = (start: string, end: string) => {
    const now = new Date();
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startTime = new Date(now);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(now);
    endTime.setHours(endHour, endMinute, 0, 0);

    return now >= startTime && now <= endTime;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-3xl transition-all duration-300">
        <main className="py-12 px-4">
          <DashboardHeader
            title="Google I/O Extended Bali 2025"
            description=""
          />

          {agendas.map((agenda) => (
            <Card
              key={agenda.id}
              className={cn(
                "rounded-xl shadow-sm mb-6",
                isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                  "border-indigo-300"
              )}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-1 md:gap-4">
                  <div className="space-y-2 max-w-md">
                    <div className="flex gap-x-3">
                      {isAgendaOngoing(agenda.start_time, agenda.end_time) && (
                        <div className="flex items-center gap-2 border border-red-500 rounded-full px-2 py-1 bg-red-100">
                          <div className="flex relative size-3">
                            <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </div>
                          <span className="text-sm text-red-600">Live</span>
                        </div>
                      )}
                      <h3
                        className={cn(
                          "text-lg",
                          isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                            "font-medium"
                        )}
                      >
                        {agenda.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {agenda.description}
                    </p>
                    <div className="flex items-center">
                      <Clock
                        className={cn(
                          "h-4 w-4 text-gray-500 mr-1",
                          isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                            "text-indigo-600"
                        )}
                      />
                      <span
                        className={cn(
                          "text-md text-gray-500",
                          isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                            " text-black"
                        )}
                      >
                        {agenda.start_time?.slice(0, 5)} -{" "}
                        {agenda.end_time?.slice(0, 5)}
                      </span>
                    </div>
                  </div>

                  {agenda.room && (
                    <div className="flex items-center md:justify-end mt-2 md:mt-0">
                      <MapPin
                        className={cn(
                          "h-4 w-4 text-gray-500 mr-1",
                          isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                            "text-indigo-600"
                        )}
                      />
                      <span
                        className={cn(
                          "text-md text-left text-gray-500",
                          isAgendaOngoing(agenda.start_time, agenda.end_time) &&
                            " text-black"
                        )}
                      >
                        {agenda.room}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
};

export default AgendaPreview;
