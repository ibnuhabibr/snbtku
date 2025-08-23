import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,

  Users,
  BookOpen,
  Target,
  Clock,
  Trophy,
  Download,

  BarChart3,
  PieChart,
  Activity,
  Eye,
  PlayCircle,
  FileText,
  Star,
  Zap
} from "lucide-react";

import AdminNavigation from "@/components/AdminNavigation";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalContent: number;
  totalQuestions: number;
  totalTryouts: number;
  avgSessionTime: number;
  completionRate: number;
  userGrowth: number;
  engagementRate: number;
}

interface ChartData {
  name: string;
  value: number;
  change?: number;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalUsers: 12847,
    activeUsers: 8934,
    newUsers: 1247,
    totalContent: 2456,
    totalQuestions: 15678,
    totalTryouts: 234,
    avgSessionTime: 45.6,
    completionRate: 78.4,
    userGrowth: 12.5,
    engagementRate: 67.8
  };

  const userGrowthData: ChartData[] = [
    { name: "Jan", value: 8500 },
    { name: "Feb", value: 9200 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 10500 },
    { name: "May", value: 11200 },
    { name: "Jun", value: 11800 },
    { name: "Jul", value: 12847 }
  ];

  const contentUsageData: ChartData[] = [
    { name: "Materi PDF", value: 45.2 },
    { name: "Video", value: 28.7 },
    { name: "Try Out", value: 15.8 },
    { name: "Latihan Soal", value: 10.3 }
  ];

  const subtestPerformance = [
    { name: "TPS", avgScore: 76.8, totalAttempts: 8934, improvement: 5.2 },
    { name: "Literasi", avgScore: 72.4, totalAttempts: 7823, improvement: 3.8 },
    { name: "Matematika", avgScore: 68.9, totalAttempts: 6745, improvement: 7.1 }
  ];

  const topContent = [
    { title: "Penalaran Umum - Logika Dasar", type: "PDF", views: 2847, rating: 4.8 },
    { title: "Fungsi Kuadrat - Video Lengkap", type: "Video", views: 2156, rating: 4.9 },
    { title: "Teks Argumentasi - Analisis", type: "PDF", views: 1923, rating: 4.7 },
    { title: "SNBT Try Out #15", type: "Try Out", views: 1678, rating: 4.6 },
    { title: "Statistika - Konsep Dasar", type: "Video", views: 1534, rating: 4.8 }
  ];

  const recentActivities = [
    { user: "Ahmad Rizki", action: "Menyelesaikan Try Out #15", score: 85, time: "2 menit lalu" },
    { user: "Siti Nurhaliza", action: "Mengunduh materi TPS", score: null, time: "5 menit lalu" },
    { user: "Budi Santoso", action: "Menonton video Matematika", score: null, time: "8 menit lalu" },
    { user: "Maya Putri", action: "Menyelesaikan latihan soal", score: 78, time: "12 menit lalu" },
    { user: "Andi Wijaya", action: "Bergabung dengan platform", score: null, time: "15 menit lalu" }
  ];

  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "try out":
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSubtestColor = (subtest: string) => {
    switch (subtest?.toLowerCase()) {
      case "tps":
        return "bg-blue-100 text-blue-800";
      case "literasi":
        return "bg-green-100 text-green-800";
      case "matematika":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Insights 📊</h1>
            <p className="text-muted-foreground">Monitor performa platform dan analisis data pengguna</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
                <SelectItem value="90d">90 Hari</SelectItem>
                <SelectItem value="1y">1 Tahun</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">+{analyticsData.userGrowth}%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{analyticsData.activeUsers.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <Activity className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{analyticsData.engagementRate}%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Session</p>
                      <p className="text-2xl font-bold">{analyticsData.avgSessionTime}m</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm text-blue-500">+8.2%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">{analyticsData.completionRate}%</p>
                      <div className="flex items-center mt-1">
                        <Trophy className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm text-purple-500">+3.1%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    User Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userGrowthData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.value / Math.max(...userGrowthData.map(d => d.value))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {item.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Content Usage Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentUsageData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={item.value} className="w-32" />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score && (
                          <p className="text-sm font-medium text-green-600">{activity.score}%</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            {/* Subtest Performance */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Subtest Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subtestPerformance.map((subtest, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getSubtestColor(subtest.name)}>
                            {subtest.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {subtest.totalAttempts.toLocaleString()} attempts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">+{subtest.improvement}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Average Score</span>
                            <span className="text-sm font-medium">{subtest.avgScore}%</span>
                          </div>
                          <Progress value={subtest.avgScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getContentTypeIcon(content.type)}
                        </div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          <p className="text-sm text-muted-foreground">{content.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">{content.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>New Users (7d)</span>
                      <span className="font-medium">{analyticsData.newUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-medium">{analyticsData.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention Rate</span>
                      <span className="font-medium">84.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-medium">5,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Duration</span>
                      <span className="font-medium">{analyticsData.avgSessionTime}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages per Session</span>
                      <span className="font-medium">7.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-medium">4.7/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NPS Score</span>
                      <span className="font-medium">72</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support Tickets</span>
                      <span className="font-medium">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Materials</span>
                      <span className="font-medium">{analyticsData.totalContent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Questions</span>
                      <span className="font-medium">{analyticsData.totalQuestions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Try Outs</span>
                      <span className="font-medium">{analyticsData.totalTryouts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Views</span>
                      <span className="font-medium">234,567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Avg. Content Rating</span>
                      <span className="font-medium">4.6/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Download Rate</span>
                      <span className="font-medium">67.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-medium">{analyticsData.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Score</span>
                      <span className="font-medium">8.4/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;