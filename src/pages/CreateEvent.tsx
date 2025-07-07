import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CalendarDays, Clock, MapPin, ImagePlus } from "lucide-react";
import supabase from "@/lib/supabase";

const eventFormSchema = z.object({
  name: z.string().min(3, "Event's name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  location: z.string().min(1, "Location is required."),
  type: z.string().min(1, "Event format is required."),
  coverImage: z.any().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const eventTypes = [
  { id: "online", name: "Online" },
  { id: "in-person", name: "In-person" },
  { id: "hybrid", name: "Hybrid" },
];

const roomLocations = [
  { id: "room-a", name: "Room A" },
  { id: "main-hall", name: "Main Hall" },
  { id: "dining-area", name: "Dining Area" },
  { id: "online", name: "Online" },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "",
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true);

      let imageUrl = "";
      if (values.coverImage?.[0]) {
        const { data, error } = await supabase.storage
          .from("event-images")
          .upload(`covers/${Date.now()}_${values.coverImage[0].name}`, values.coverImage[0]);

        if (error) throw error;
        imageUrl = supabase.storage.from("event-images").getPublicUrl(data.path).data.publicUrl;
      }

      const { error } = await supabase.from("events").insert([
        {
          name: values.name,
          description: values.description,
          date: values.date,
          start_time: values.startTime,
          end_time: values.endTime,
          location: values.location,
          type: values.type,
          cover_url: imageUrl,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Event Created",
        description: `${values.name} has been successfully added.`,
      });

      navigate("/agenda");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the event" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="hide-date-time-icon pl-10" {...field} />
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
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="hide-date-time-icon pl-10" {...field} />
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
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="hide-date-time-icon pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location / Venue</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Format</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event format" />
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
              </div>

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image / Thumbnail</FormLabel>
                    <FormControl>
                      <div>
                        <input
                          id="coverImage"
                          type="file"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                        <label
                          htmlFor="coverImage"
                          className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium cursor-pointer bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Choose Cover Image
                        </label>
                        {field.value?.[0] && (
                          <div className="mt-2 flex items-center justify-between rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {field.value[0].name}
                            </p>
                            <button
                              type="button"
                              onClick={() => field.onChange(undefined)}
                              className="text-xs px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => navigate("/event")}>
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
    </div>
  );
}
