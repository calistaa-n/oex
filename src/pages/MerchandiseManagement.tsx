import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";
import {
  ShoppingBag,
  QrCode,
  Plus,
  Search,
  Download,
  Check,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Mock data for merchandise
const merchandiseData = [
  {
    id: 1,
    name: "T-Shirt",
    totalQuantity: 200,
    collectedQuantity: 85,
    size: "M",
    color: "Blue",
  },
  {
    id: 2,
    name: "T-Shirt",
    totalQuantity: 150,
    collectedQuantity: 62,
    size: "L",
    color: "Black",
  },
  {
    id: 3,
    name: "Hoodie",
    totalQuantity: 100,
    collectedQuantity: 43,
    size: "L",
    color: "Gray",
  },
  {
    id: 4,
    name: "Water Bottle",
    totalQuantity: 300,
    collectedQuantity: 160,
    size: "One Size",
    color: "Transparent",
  },
  {
    id: 5,
    name: "Notebook",
    totalQuantity: 250,
    collectedQuantity: 122,
    size: "A5",
    color: "White",
  },
  {
    id: 6,
    name: "Sticker Pack",
    totalQuantity: 400,
    collectedQuantity: 210,
    size: "One Size",
    color: "Mixed",
  },
];

// Mock recent collections
const recentCollections = [
  {
    id: "c1",
    participantName: "Alex Johnson",
    participantId: "P12345",
    item: "T-Shirt (L, Black)",
    timestamp: "2025-04-28T14:35:21",
    status: "collected",
  },
  {
    id: "c2",
    participantName: "Maria Rodriguez",
    participantId: "P12346",
    item: "Hoodie (L, Gray)",
    timestamp: "2025-04-28T14:32:08",
    status: "collected",
  },
  {
    id: "c3",
    participantName: "Sam Wilson",
    participantId: "P12347",
    item: "Water Bottle",
    timestamp: "2025-04-28T14:28:45",
    status: "collected",
  },
  {
    id: "c4",
    participantName: "Lisa Chen",
    participantId: "P12348",
    item: "T-Shirt (M, Blue)",
    timestamp: "2025-04-28T14:25:15",
    status: "collected",
  },
  {
    id: "c5",
    participantName: "David Kim",
    participantId: "P12349",
    item: "Notebook + Sticker Pack",
    timestamp: "2025-04-28T14:20:37",
    status: "collected",
  },
];

// Chart data
const chartData = merchandiseData.map((item) => ({
  name: item.name,
  total: item.totalQuantity,
  collected: item.collectedQuantity,
  remaining: item.totalQuantity - item.collectedQuantity,
}));

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const pieData = [
  { name: "Collected", value: 682 },
  { name: "Remaining", value: 718 },
];

const MerchandiseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  // Filter merchandise based on search term
  const filteredMerchandise = merchandiseData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${isMobile ? "pl-0" : "pl-64"}`}
      >
        <main className="container mx-auto py-8 px-4">
          <DashboardHeader
            title="Merchandise Management"
            description="Manage merchandise collection using QR codes"
          >
            <div className="space-x-2">
              <Button variant="outline" className="gap-2">
                <QrCode className="h-4 w-4" />
                Scan QR
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </DashboardHeader>

          {/* Merchandise Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,400</div>
                <p className="text-sm text-gray-500">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">682</div>
                <p className="text-sm text-gray-500">48.7% of total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">718</div>
                <p className="text-sm text-gray-500">51.3% of total</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inventory" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="collections">Recent Collections</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              {/* Search */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search merchandise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Inventory Table */}
              <div className="rounded-lg border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead className="text-center">
                        Total Quantity
                      </TableHead>
                      <TableHead className="text-center">Collected</TableHead>
                      <TableHead className="text-center">Remaining</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMerchandise.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell className="text-center">
                          {item.totalQuantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.collectedQuantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.totalQuantity - item.collectedQuantity}
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
            </TabsContent>

            <TabsContent value="collections">
              {/* Recent Collections Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Collections</h3>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <QrCode className="h-4 w-4" />
                    New Collection
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCollections.map((collection) => (
                        <TableRow key={collection.id}>
                          <TableCell>
                            {formatTime(collection.timestamp)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {collection.participantName}
                          </TableCell>
                          <TableCell>{collection.participantId}</TableCell>
                          <TableCell>{collection.item}</TableCell>
                          <TableCell className="text-center">
                            {collection.status === "collected" ? (
                              <span className="inline-flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                Collected
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600">
                                <X className="h-4 w-4 mr-1" />
                                Failed
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Collection by Item Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="collected"
                            name="Collected"
                            fill="#10B981"
                          />
                          <Bar
                            dataKey="remaining"
                            name="Remaining"
                            fill="#F59E0B"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Collection Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex flex-col items-center justify-center">
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? "#10B981" : "#F59E0B"}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Collected (682)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-sm">Remaining (718)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* QR Code Section */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <QrCode className="h-24 w-24 text-indigo-600" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-xl font-medium text-indigo-800 dark:text-indigo-300">
                    Quick Collection with QR Codes
                  </h3>
                  <p className="text-indigo-700 dark:text-indigo-400 max-w-md">
                    Scan participant QR codes to quickly record merchandise
                    collection. Use the mobile app or web scanner for instant
                    updates.
                  </p>
                  <div className="space-x-3">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Open Scanner
                    </Button>
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default MerchandiseManagement;
