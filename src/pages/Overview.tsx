import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Event = {
  id: string;
  name: string;
  date: string;
  coverImageUrl: string;
  isRecentlyAdded?: boolean;
  status: "Not Started" | "Ongoing" | "Finished";
};

function EventCard({ event }: { event: Event }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-2xl shadow hover:bg-gray-50 transition mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={event.coverImageUrl || "/placeholder.png"}
          alt={event.name}
          className="h-12 w-12 rounded object-cover border"
        />
        <div className="flex w-full gap-x-2">
          <div>
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-sm text-gray-500">{event.date}</p>
          </div>
          <div>
            {event.isRecentlyAdded && (
              <Badge variant="secondary" className="bg-red-600">
                Recently added
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Badge
        className={cn(
          "p-2 px-3",
          event.status === "Not Started" &&
            "border-gray-400 text-gray-700 bg-gray-100",
          event.status === "Ongoing" && "border-red-500 text-red-500 bg-red-50",
          event.status === "Finished" &&
            "border-green-500 text-green-500 bg-green-50"
        )}
      >
        {event.status}
      </Badge>
    </div>
  );
}

export default function Overview() {
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) console.error("Error fetching events:", error);
      else setEvents(data);
    };
    fetchEvents();
  }, []);
  const [year, setYear] = useState("all");
  const [status, setStatus] = useState<string>("all");

  function filterEventsByYear(events: Event[], year: string) {
    if (year === "all") return events;
    return events.filter((event) => event.date.includes(year));
  }

  function filterEventsByStatus(events: Event[], status: string) {
    if (status === "all") return events;
    return events.filter((event) => event.status === status);
  }
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Google I/O Extended",
      date: "Saturday, 02 Aug 2025",
      coverImageUrl: "/google-io.png",
      status: "Not Started",
      isRecentlyAdded: true,
    },
    {
      id: "2",
      name: "Build With AI x Cloud Roadshow",
      date: "Sunday, 26 May 2025",
      coverImageUrl: "/cloud-roadshow.png",
      status: "Ongoing",
      isRecentlyAdded: true,
    },
    {
      id: "3",
      name: "Google Developer Festival",
      date: "Saturday, 1 Apr 2024",
      coverImageUrl: "/devfest.png",
      status: "Finished",
      isRecentlyAdded: false,
    },
    {
      id: "4",
      name: "Flutter Indonesia Meetup",
      date: "Saturday, 15 Jun 2024",
      coverImageUrl: "/flutter-meetup.png",
      status: "Finished",
      isRecentlyAdded: false,
    },
    {
      id: "5",
      name: "ReactJS Conference",
      date: "Saturday, 20 Jul 2023",
      coverImageUrl: "/reactjs-conference.png",
      status: "Finished",
      isRecentlyAdded: false,
    },
  ]);
  const filteredEventsByStatus = filterEventsByStatus(events, status);
  const filteredEvents = filterEventsByYear(filteredEventsByStatus, year);
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Event</h1>
        <Button
          onClick={() => navigate("/create-event")}
          className="bg-[#4285F4] hover:bg-[#2469DB]"
        >
          + Add New Event
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">
            Search by Years
          </label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Event Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <img src="/no_event.png" alt="No Events" width={300} height={200} />
          <p className="mt-6 text-gray-500">
            There are no events yet, please create an event first
          </p>
          <Button
            onClick={() => navigate("/create-event")}
            className="mt-4 bg-[#4285F4] hover:bg-[#2469DB] rounded-full"
          >
            Create Event
          </Button>
        </div>
      ) : (
        <div>
          {/* Render events list here */}
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
