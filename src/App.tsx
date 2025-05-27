
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkshopManagement from "./pages/WorkshopManagement";
import RoomMonitoring from "./pages/RoomMonitoring";
import Reminder from "./pages/Reminder";
import Agenda from "./pages/Agenda";
import MerchandiseManagement from "./pages/MerchandiseManagement";
import AddWorkshop from "./pages/AddWorkshop";
import AddEvent from "./pages/AddEvent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workshop-management" element={<WorkshopManagement />} />
          <Route path="/room-monitoring" element={<RoomMonitoring />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/merchandise-management" element={<MerchandiseManagement />} />
          <Route path="/add-workshop" element={<AddWorkshop />} />
          <Route path="/add-event" element={<AddEvent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
