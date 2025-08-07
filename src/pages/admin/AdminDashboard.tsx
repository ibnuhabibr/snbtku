import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Target, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminNavigation from "@/components/AdminNavigation";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalMaterials: 245,
    totalQuestions: 3892,
    totalTryouts: 28,
    activeUsers: 892,
    newUsersToday: 23
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "user_registration",
      description: "User baru mendaftar: Ahmad Rizki",
      timestamp: "2 menit yang lalu",
      status: "success"
    },
    {
      id: 2,
      type: "content_upload",
      description: "Materi baru ditambahkan: Penalaran Matematika - Fungsi",
      timestamp: "15 menit yang lalu",
      status: "success"
    },
    {
      id: 3,
      type: "tryout_completed",
      description: "Try Out SNBT #15 diselesaikan oleh 45 peserta",
      timestamp: "1 jam yang lalu",
      status: "info"
    },
    {
      id: 4,
      type: "system_alert",
      description: "Server load tinggi terdeteksi",
      timestamp: "2 jam yang lalu",
      status: "warning"
    }
  ]);

  const [contentOverview, setContentOverview] = useState({
    materials: {
      total: 245,
      published: 230,
      draft: 15,
      pending: 5
    },
    questions: {
      total: 3892,
      tps: 1456,
      literasi: 1234,
      matematika: 1202
    },
    tryouts: {
      total: 28,
      active: 12,
      scheduled: 8,
      completed: 8
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🎛️</h1>
          <p className="text-muted-foreground">Kelola dan pantau seluruh konten dan aktivitas platform SNBTKU</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-xs text-green-600 mt-1">+{stats.newUsersToday} hari ini</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
              <div className="text-sm text-muted-foreground">Materi</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Soal</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.totalTryouts}</div>
              <div className="text-sm text-muted-foreground">Try Out</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="materials">Materi</TabsTrigger>
                    <TabsTrigger value="questions">Soal</TabsTrigger>
                    <TabsTrigger value="tryouts">Try Out</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="materials" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Materi Pembelajaran</h3>
                        <Link to="/admin/content/materials/new">
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Materi
                          </Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{contentOverview.materials.published}</div>
                          <div className="text-sm text-green-600">Published</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-700">{contentOverview.materials.draft}</div>
                          <div className="text-sm text-yellow-600">Draft</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{contentOverview.materials.pending}</div>
                          <div className="text-sm text-blue-600">Pending</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-700">{contentOverview.materials.total}</div>
                          <div className="text-sm text-gray-600">Total</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/admin/content/materials">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat Semua
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Bulk Edit
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="questions" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Bank Soal</h3>
                        <Link to="/admin/content/questions/new">
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Soal
                          </Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{contentOverview.questions.tps}</div>
                          <div className="text-sm text-blue-600">TPS</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{contentOverview.questions.literasi}</div>
                          <div className="text-sm text-green-600">Literasi</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{contentOverview.questions.matematika}</div>
                          <div className="text-sm text-purple-600">Matematika</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/admin/content/questions">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat Semua
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Import Soal
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tryouts" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Try Out Management</h3>
                        <Link to="/admin/content/tryouts/new">
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Buat Try Out
                          </Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{contentOverview.tryouts.active}</div>
                          <div className="text-sm text-green-600">Active</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{contentOverview.tryouts.scheduled}</div>
                          <div className="text-sm text-blue-600">Scheduled</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-700">{contentOverview.tryouts.completed}</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{contentOverview.tryouts.total}</div>
                          <div className="text-sm text-purple-600">Total</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/admin/content/tryouts">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat Semua
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Target className="h-4 w-4 mr-1" />
                          Schedule Try Out
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/admin/activities">
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Semua Aktivitas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;