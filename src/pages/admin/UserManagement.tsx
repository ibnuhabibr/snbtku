import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Clock,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminNavigation from "@/components/AdminNavigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  totalXP: number;
  level: number;
  streak: number;
  completedTryouts: number;
  averageScore: number;
  studyTime: number; // in minutes
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");


  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
      avatar: "/avatars/01.png",
      role: "student",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-15 14:30",
      totalXP: 2850,
      level: 12,
      streak: 7,
      completedTryouts: 15,
      averageScore: 78.5,
      studyTime: 1240,

    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@email.com",
      role: "student",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "2024-01-15 16:45",
      totalXP: 3420,
      level: 15,
      streak: 12,
      completedTryouts: 22,
      averageScore: 82.3,
      studyTime: 1680,

    },
    {
      id: "3",
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      role: "student",
      status: "inactive",
      joinDate: "2024-01-05",
      lastActive: "2024-01-12 10:20",
      totalXP: 1250,
      level: 8,
      streak: 0,
      completedTryouts: 8,
      averageScore: 65.2,
      studyTime: 580,

    },
    {
      id: "4",
      name: "Dr. Matematika",
      email: "dr.matematika@snbtku.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-01",
      lastActive: "2024-01-15 17:00",
      totalXP: 0,
      level: 0,
      streak: 0,
      completedTryouts: 0,
      averageScore: 0,
      studyTime: 0,

    },
    {
      id: "5",
      name: "Maya Putri",
      email: "maya.putri@email.com",
      role: "student",
      status: "suspended",
      joinDate: "2024-01-12",
      lastActive: "2024-01-14 09:15",
      totalXP: 890,
      level: 6,
      streak: 0,
      completedTryouts: 5,
      averageScore: 58.7,
      studyTime: 320,

    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const avgScore = users.filter(u => u.role === 'student').reduce((acc, u) => acc + u.averageScore, 0) / users.filter(u => u.role === 'student').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management 👥</h1>
          <p className="text-muted-foreground">Kelola pengguna, monitor aktivitas, dan analisis performa</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{activeUsers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{avgScore.toFixed(1)}%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>

                  <TableHead>Level/XP</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Study Time</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {user.role === 'student' ? (
                        <div>
                          <p className="font-medium">Level {user.level}</p>
                          <p className="text-sm text-muted-foreground">{user.totalXP.toLocaleString()} XP</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === 'student' ? (
                        <div>
                          <p className="font-medium">{user.averageScore.toFixed(1)}%</p>
                          <p className="text-sm text-muted-foreground">{user.completedTryouts} try-outs</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === 'student' ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatStudyTime(user.studyTime)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{user.lastActive}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;