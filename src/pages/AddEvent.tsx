import * as z from "zod";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Form validation schema
const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  type: z.string().min(1, { message: "Event type is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  capacity: z.coerce
    .number()
    .int()
    .min(1, { message: "Capacity must be at least 1." })
    .optional(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Mock data for dropdown options
const roomLocations = [
  { id: "room-a", name: "Room A" },
  { id: "room-b", name: "Room B" },
  { id: "room-c", name: "Room C" },
  { id: "room-d", name: "Room D" },
  { id: "room-e", name: "Room E" },
  { id: "main-hall", name: "Main Hall" },
  { id: "dining-area", name: "Dining Area" },
];

const eventTypes = [
  { id: "keynote", name: "Keynote" },
  { id: "break", name: "Break" },
  { id: "social", name: "Social Event" },
  { id: "registration", name: "Registration" },
  { id: "feedback", name: "Feedback Session" },
];

const AddEvent = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapacity, setShowCapacity] = useState(false);

  // Initialize form with validation
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      capacity: 100,
      description: "",
    },
  });

  // Watch the event type to conditionally display capacity field
  const eventType = form.watch("type");

  // Update capacity visibility when event type changes
  React.useEffect(() => {
    // Only show capacity for feedback sessions and some social events
    setShowCapacity(["feedback", "social"].includes(eventType));
  }, [eventType]);

  // Form submission handler
  const onSubmit = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("events").insert([
        {
          title: values.title,
          date: values.date,
          start_time: values.startTime,
          end_time: values.endTime,
          location: values.location,
          description: values.description,
        },
      ]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["agenda"] });

      // Show success message
      toast({
        title: "Event Created",
        description: `${values.title} has been successfully added to the agenda.`,
      });

      // Navigate back to agenda page
      navigate("/agenda");
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not create event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
            title="Add New Event"
            description="Create and schedule a new event for your agenda"
          >
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/agenda")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </DashboardHeader>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your event as it will appear on the
                          agenda.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder="Select a location" />
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

                    {showCapacity && (
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type="number"
                                  placeholder="Maximum number of attendees"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Leave blank if there's no specific limit.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the event"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide information about what attendees can expect.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/agenda")}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Event"}
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

export default AddEvent;
