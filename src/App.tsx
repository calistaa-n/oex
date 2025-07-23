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
          <Route path="/home" element={<Index />} />

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/event" element={<Overview />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/workshop-management" element={<WorkshopManagement />} />
          <Route path="/room-monitoring" element={<RoomMonitoring />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route
            path="/merchandise-management"
            element={<MerchandiseManagement />}
          />
          <Route path="/add-workshop" element={<AddWorkshop />} />
          <Route path="/add-agenda" element={<AddAgenda />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
