import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Mock data for workshops
const workshopsData = [
  {
    id: 1,
    title: "React for Beginners",
    speaker: "Jane Smith",
    date: "2025-05-01",
    time: "10:00 AM - 12:00 PM",
    location: "Room A",
    capacity: 50,
    registered: 42,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Advanced TypeScript",
    speaker: "John Doe",
    date: "2025-05-01",
    time: "2:00 PM - 4:00 PM",
    location: "Room B",
    capacity: 30,
    registered: 30,
    status: "full",
  },
  {
    id: 3,
    title: "UI/UX Workshop",
    speaker: "Alice Johnson",
    date: "2025-05-02",
    time: "9:00 AM - 11:00 AM",
    location: "Room C",
    capacity: 40,
    registered: 22,
    status: "upcoming",
  },
  {
    id: 4,
    title: "Mobile Development",
    speaker: "Bob Martin",
    date: "2025-05-02",
    time: "1:00 PM - 3:00 PM",
    location: "Room A",
    capacity: 35,
    registered: 18,
    status: "upcoming",
  },
  {
    id: 5,
    title: "Cloud Services",
    speaker: "Eva Williams",
    date: "2025-05-03",
    time: "10:00 AM - 12:00 PM",
    location: "Room D",
    capacity: 45,
    registered: 43,
    status: "almost-full",
  },
];

const WorkshopManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Filter workshops based on search term
  const filteredWorkshops = workshopsData.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
        );
      case "full":
        return <Badge className="bg-red-500 hover:bg-red-600">Full</Badge>;
      case "almost-full":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">Almost Full</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
            title="Workshop Management"
            description="Manage your workshops, speakers, and participants"
          >
            <Button className="gap-2" onClick={() => navigate("/add-workshop")}>
              <Plus className="h-4 w-4" />
              Add Workshop
            </Button>
          </DashboardHeader>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Workshops table */}
          <div className="rounded-lg border bg-white dark:bg-gray-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Registration</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium">
                      {workshop.title}
                    </TableCell>
                    <TableCell>{workshop.speaker}</TableCell>
                    <TableCell>
                      {workshop.date.split("-").slice(1).join("/")}
                      <br />
                      <span className="text-xs text-gray-500">
                        {workshop.time}
                      </span>
                    </TableCell>
                    <TableCell>{workshop.location}</TableCell>
                    <TableCell className="text-center">
                      {workshop.registered}/{workshop.capacity}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            workshop.registered / workshop.capacity > 0.9
                              ? "bg-red-500"
                              : workshop.registered / workshop.capacity > 0.7
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              (workshop.registered / workshop.capacity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(workshop.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkshopManagement;
