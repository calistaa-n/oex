import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import supabase from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
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
        .order("date", { ascending: true })
        .eq("event_id", eventId);

      if (error) console.error("Error fetching agendas:", error);
      else setAgendas(data);
    };
    fetchAgendas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-3xl transition-all duration-300">
        <main className="py-8 px-4">
          <DashboardHeader
            title="Google I/O Extended Bali 2025"
            description=""
          />

          {agendas.map((agenda) => (
            <Card key={agenda.id} className="overflow-hidden mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center md:w-1/4">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">
                      {agenda.start_time?.slice(0, 5)} -{" "}
                      {agenda.end_time?.slice(0, 5)}
                    </span>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className="text-xl font-medium mb-1">{agenda.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {agenda.description}
                    </p>
                  </div>
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
