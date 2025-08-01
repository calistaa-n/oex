import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
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
const agendaFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  room: z.string(),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  capacity: z.coerce
    .number()
    .int()
    .min(1, { message: "Capacity must be at least 1." })
    .optional(),
  description: z.string(),
});

type AgendaFormValues = z.infer<typeof agendaFormSchema>;

const AddAgenda = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with validation
  const form = useForm<AgendaFormValues>({
    resolver: zodResolver(agendaFormSchema),
    defaultValues: {
      title: "",
      room: "",
      startTime: "",
      endTime: "",
      capacity: 100,
      description: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: AgendaFormValues) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("agendas").insert([
        {
          title: values.title,
          room: values.room,
          start_time: values.startTime,
          end_time: values.endTime,
          description: values.description,
          event_id: eventId,
        },
      ]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["agenda"] });

      // Show success message
      toast({
        title: "Agenda Created",
        description: `${values.title} has been successfully added to the agenda.`,
      });

      // Navigate back to agenda page
      navigate(`/event/${id}/agendas`);
    } catch (error) {
      console.error("Error submitting agenda:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not create agenda. Please try again.",
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
            title="Add New Agenda"
            description="Create new agenda for your event"
          >
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/event/${id}/agendas`)}
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
                        <FormLabel>Agenda Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter agenda title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Location</FormLabel>
                          <FormControl>
                            <Input
                              type="room"
                              placeholder="Enter room name or number"
                              {...field}
                            />
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
                              <Input
                                type="time"
                                className="pl-10 hide-date-time-icon"
                                {...field}
                              />
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
                              <Input
                                type="time"
                                className="pl-10  hide-date-time-icon"
                                {...field}
                              />
                            </div>
                          </FormControl>
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
                        <FormLabel>Agenda Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the agenda"
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
                      onClick={() => navigate(`/event/${id}/agendas`)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Agenda"}
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

export default AddAgenda;
