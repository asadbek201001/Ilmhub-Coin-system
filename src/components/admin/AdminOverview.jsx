import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Users, Package, GraduationCap, TrendingUp, Activity, Clock } from 'lucide-react';

export function AdminOverview({ teachers, items, students }) {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('totalTeachers'),
      value: teachers.length,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Active teachers",
      trend: "+2 this month"
    },
    {
      title: t('totalStudents'),
      value: students.length,
      icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
      description: "Enrolled students",
      trend: "+15 this month"
    },
    {
      title: t('totalItems'),
      value: items.length,
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      description: "Available items",
      trend: "+3 this week"
    },
    {
      title: "Total Coins Issued",
      value: students.reduce((total, student) => total + student.coinBalance, 0),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Coins in circulation",
      trend: "+125 today"
    }
  ];

  const recentActivity = [
    { action: "New teacher registered", user: "Ahmad Toshev", time: "2 hours ago" },
    { action: "Student purchased item", user: "Malika Karimova", time: "4 hours ago" },
    { action: "Coins awarded", user: "Jasur Aliyev", time: "6 hours ago" },
    { action: "New item added", user: "Admin", time: "1 day ago" },
    { action: "Student registered", user: "Nodira Yusupova", time: "2 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium">Add Teacher</p>
                <p className="text-sm text-muted-foreground">Register new teacher</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Package className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium">Add Item</p>
                <p className="text-sm text-muted-foreground">Create new store item</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Activity className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-muted-foreground">System analytics</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium">System Stats</p>
                <p className="text-sm text-muted-foreground">Performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium">System Health</h3>
              <p className="text-sm text-muted-foreground">All systems operational</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Healthy
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium">Active Users</h3>
              <p className="text-sm text-muted-foreground">Currently online</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {teachers.length + students.length} users
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium">Performance</h3>
              <p className="text-sm text-muted-foreground">Response time</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  120ms avg
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}