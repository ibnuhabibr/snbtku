import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Shield,
  // Mail, // Removed unused import
  Database,
  // Palette, // Removed unused import
  Bell,
  Users,
  Key,
  Server,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download
} from "lucide-react";
// import { Link } from "react-router-dom"; // Removed unused import
import AdminNavigation from "@/components/AdminNavigation";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFileUploadSize: number;
  sessionTimeout: number;
  defaultLanguage: string;
  timezone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  userRegistrations: boolean;
  contentUpdates: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  maxLoginAttempts: number;
  accountLockoutDuration: number;
  sessionSecurityLevel: string;
  ipWhitelist: string[];
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("2024-01-15 14:30");

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: "SNBTKU",
    siteDescription: "Platform persiapan SNBT terlengkap dan gratis",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileUploadSize: 10,
    sessionTimeout: 30,
    defaultLanguage: "id",
    timezone: "Asia/Jakarta"
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    userRegistrations: true,
    contentUpdates: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    maxLoginAttempts: 5,
    accountLockoutDuration: 15,
    sessionSecurityLevel: "high",
    ipWhitelist: []
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setLastSaved(new Date().toLocaleString('id-ID'));
  };

  const handleSystemReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
      // Reset logic here
      console.log('System reset initiated');
    }
  };

  const handleBackup = () => {
    console.log('Creating system backup...');
  };

  const handleRestore = () => {
    console.log('Restoring from backup...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Settings ⚙️</h1>
            <p className="text-muted-foreground">Kelola konfigurasi sistem dan pengaturan platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBackup}>
              <Download className="h-4 w-4 mr-2" />
              Backup
            </Button>
            <Button variant="outline" onClick={handleRestore}>
              <Upload className="h-4 w-4 mr-2" />
              Restore
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Last Saved Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Last saved: {lastSaved}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Site Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select value={systemSettings.defaultLanguage} onValueChange={(value) => setSystemSettings({...systemSettings, defaultLanguage: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                        <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                        <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Registration Enabled</Label>
                      <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                    </div>
                    <Switch
                      checked={systemSettings.registrationEnabled}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, registrationEnabled: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={systemSettings.emailVerificationRequired}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailVerificationRequired: checked})}
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileUploadSize"
                      type="number"
                      value={systemSettings.maxFileUploadSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileUploadSize: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                  {systemSettings.maintenanceMode && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Maintenance Mode Active</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        The site is currently in maintenance mode. Only administrators can access the platform.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                    </div>
                    <Switch
                      checked={securitySettings.passwordRequireSpecialChars}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordRequireSpecialChars: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Access Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountLockoutDuration">Account Lockout Duration (minutes)</Label>
                    <Input
                      id="accountLockoutDuration"
                      type="number"
                      value={securitySettings.accountLockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, accountLockoutDuration: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionSecurityLevel">Session Security Level</Label>
                    <Select value={securitySettings.sessionSecurityLevel} onValueChange={(value) => setSecuritySettings({...securitySettings, sessionSecurityLevel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Communication Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Weekly analytics reports</p>
                        </div>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Security-related notifications</p>
                        </div>
                        <Switch
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>User Registrations</Label>
                          <p className="text-sm text-muted-foreground">New user registration alerts</p>
                        </div>
                        <Switch
                          checked={notificationSettings.userRegistrations}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, userRegistrations: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Content Updates</Label>
                          <p className="text-sm text-muted-foreground">Content creation and updates</p>
                        </div>
                        <Switch
                          checked={notificationSettings.contentUpdates}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, contentUpdates: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Connection Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Connected</span>
                      </div>
                    </div>
                    <div>
                      <Label>Database Size</Label>
                      <p className="text-sm mt-1">2.4 GB</p>
                    </div>
                    <div>
                      <Label>Total Records</Label>
                      <p className="text-sm mt-1">1,247,893</p>
                    </div>
                    <div>
                      <Label>Last Backup</Label>
                      <p className="text-sm mt-1">2024-01-15 02:00</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Firebase Storage</span>
                      <span className="text-sm">8.2 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Supabase Storage</span>
                      <span className="text-sm">3.7 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>• Images: 2.1 GB</p>
                    <p>• Videos: 4.8 GB</p>
                    <p>• Documents: 5.0 GB</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    Advanced Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Warning</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Advanced settings can affect system performance and stability. Only modify these settings if you understand the implications.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                      <Input id="cacheTimeout" type="number" defaultValue="3600" />
                    </div>
                    <div>
                      <Label htmlFor="apiRateLimit">API Rate Limit (requests/minute)</Label>
                      <Input id="apiRateLimit" type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label htmlFor="logLevel">Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxConcurrentUsers">Max Concurrent Users</Label>
                      <Input id="maxConcurrentUsers" type="number" defaultValue="1000" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">Reset System Settings</h3>
                    <p className="text-sm text-red-600 mb-3">
                      This will reset all system settings to their default values. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleSystemReset}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">Clear All Cache</h3>
                    <p className="text-sm text-red-600 mb-3">
                      This will clear all cached data. Users may experience slower performance temporarily.
                    </p>
                    <Button variant="destructive">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
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

export default Settings;