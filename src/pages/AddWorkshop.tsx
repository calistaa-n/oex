
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";

// Form validation schema
const workshopFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  speaker: z.string().min(2, { message: "Speaker name is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  capacity: z.coerce.number().int().min(1, { message: "Capacity must be at least 1." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

type WorkshopFormValues = z.infer<typeof workshopFormSchema>;

// Mock locations for dropdown
const roomLocations = [
  { id: "room-a", name: "Room A" },
  { id: "room-b", name: "Room B" },
  { id: "room-c", name: "Room C" },
  { id: "room-d", name: "Room D" },
  { id: "room-e", name: "Room E" },
  { id: "main-hall", name: "Main Hall" },
];

const AddWorkshop = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with validation
  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      title: "",
      speaker: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      capacity: 30,
      description: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: WorkshopFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally send data to your API
      console.log("Workshop form data:", values);
      
      // Invalidate queries to refetch workshop data
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      
      // Show success message
      toast({
        title: "Workshop Created",
        description: `${values.title} has been successfully added to the schedule.`,
      });
      
      // Navigate back to workshop management
      navigate("/workshop-management");
    } catch (error) {
      console.error("Error submitting workshop:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not create workshop. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}>
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader 
            title="Add New Workshop"
            description="Create and schedule a new workshop for your event"
          >
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate("/workshop-management")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </DashboardHeader>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter workshop title" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your workshop as it will appear on the schedule.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="speaker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speaker Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter speaker's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input type="time" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input type="time" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder="Select a room" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomLocations.map((room) => (
                                    <SelectItem key={room.id} value={room.name}>
                                      {room.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input 
                                type="number" 
                                placeholder="Maximum number of participants" 
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Maximum number of attendees.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter a detailed description of the workshop" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about what participants will learn.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/workshop-management")}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Workshop"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddWorkshop;
