import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import WorkshopManagement from "./pages/WorkshopManagement";
// import SignUp from "./pages/SignUp";
import RoomMonitoring from "./pages/RoomMonitoring";
import Reminder from "./pages/Reminder";
import Overview from "./pages/Overview";
import NotFound from "./pages/NotFound";
import MerchandiseManagement from "./pages/MerchandiseManagement";
import Login from "./pages/Login";
import Index from "./pages/Index";
import CreateEvent from "./pages/CreateEvent";
import Agenda from "./pages/Agenda";
import AddWorkshop from "./pages/AddWorkshop";
import AddAgenda from "./pages/AddAgenda";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Events */}
          <Route path="/event" element={<Overview />} />
          <Route path="/event/create" element={<CreateEvent />} />

          {/* Event Dashboard */}
          <Route path="/event/:id/home" element={<Index />} />

          {/* Agenda */}
          <Route path="/event/:id/agendas" element={<Agenda />} />
          <Route path="/event/:id/agendas/add" element={<AddAgenda />} />

          {/* Workshop */}
          <Route path="/event/:id/workshops" element={<WorkshopManagement />} />
          <Route path="/event/:id/workshops/add" element={<AddWorkshop />} />

          {/* Room Monitoring */}
          <Route path="/event/:id/rooms" element={<RoomMonitoring />} />

          {/* Reminders */}
          <Route path="/event/:id/reminders" element={<Reminder />} />

          {/* Merchandise */}
          <Route
            path="/event/:id/merchandise"
            element={<MerchandiseManagement />}
          />

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
