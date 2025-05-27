
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Send, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for reminders
const remindersData = [
  {
    id: 1,
    title: "React for Beginners",
    type: "workshop",
    sendTime: "2025-05-01T08:00:00",
    status: "scheduled",
    recipients: 42,
    message: "Your workshop 'React for Beginners' starts in 2 hours. Room A, 10:00 AM."
  },
  {
    id: 2,
    title: "Advanced TypeScript",
    type: "workshop",
    sendTime: "2025-05-01T12:00:00",
    status: "scheduled",
    recipients: 30,
    message: "Your workshop 'Advanced TypeScript' starts in 2 hours. Room B, 2:00 PM."
  },
  {
    id: 3,
    title: "Lunch Break",
    type: "event",
    sendTime: "2025-05-01T11:30:00",
    status: "scheduled",
    recipients: 150,
    message: "Lunch will be served in 30 minutes in the Main Hall."
  },
  {
    id: 4,
    title: "UI/UX Workshop",
    type: "workshop",
    sendTime: "2025-05-02T07:00:00",
    status: "scheduled",
    recipients: 22,
    message: "Your workshop 'UI/UX Workshop' starts in 2 hours. Room C, 9:00 AM."
  },
  {
    id: 5,
    title: "Workshop Feedback",
    type: "feedback",
    sendTime: "2025-05-01T16:00:00",
    status: "scheduled",
    recipients: 72,
    message: "Please take a moment to provide feedback on today's workshops."
  },
  {
    id: 6,
    title: "Welcome Message",
    type: "event",
    sendTime: "2025-04-28T07:00:00",
    status: "sent",
    recipients: 150,
    message: "Welcome to our workshop event! Here's what you need to know for today."
  },
  {
    id: 7,
    title: "Day 1 Summary",
    type: "event",
    sendTime: "2025-04-28T17:00:00",
    status: "sent",
    recipients: 150,
    message: "Thank you for joining us today! Here's a summary of Day 1 and what to expect tomorrow."
  }
];

const reminderSettings = {
  workshopReminderTime: 120, // minutes
  defaultChannel: "email",
  channels: {
    email: true,
    push: true,
    sms: false
  }
};

const Reminder = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  
  // Filter reminders based on status
  const filteredReminders = statusFilter === "all" 
    ? remindersData 
    : remindersData.filter(reminder => reminder.status === statusFilter);

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case "sent":
        return <Badge className="bg-green-500 hover:bg-green-600">Sent</Badge>;
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to format date
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}>
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader 
            title="Reminder System"
            description="Automatic reminders for workshop participants"
          >
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              New Reminder
            </Button>
          </DashboardHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Reminder Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">8</div>
                <p className="text-sm text-gray-500">Scheduled to send</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">16</div>
                <p className="text-sm text-gray-500">Scheduled reminders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Workshop Reminder</span>
                  <span className="text-sm font-medium">{reminderSettings.workshopReminderTime} min before</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Default Channel</span>
                  <span className="text-sm font-medium capitalize">{reminderSettings.defaultChannel}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reminder Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Search reminders..." />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
          
          {/* Reminders Table */}
          <div className="rounded-lg border bg-white dark:bg-gray-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Send Time</TableHead>
                  <TableHead className="text-center">Recipients</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">{reminder.title}</TableCell>
                    <TableCell className="capitalize">{reminder.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDateTime(reminder.sendTime)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{reminder.recipients}</TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(reminder.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Channels */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch checked={reminderSettings.channels.email} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch checked={reminderSettings.channels.push} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch checked={reminderSettings.channels.sms} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reminder;
