import React, { useState } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { Alert, AlertDescription } from './ui/alert.jsx';
import { AdminOverview } from './admin/AdminOverview.jsx';
import { AdminTeachers } from './admin/AdminTeachers.jsx';
import { AdminItems } from './admin/AdminItems.jsx';
import { AdminStudents } from './admin/AdminStudents.jsx';
import { BarChart3, Users, Package, GraduationCap } from 'lucide-react';

// Mock data - replace with your own API calls
const initialTeachers = [
  {
    id: '1',
    name: 'Ahmad Toshev',
    email: 'ahmad.toshev@example.com',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'active',
    studentsCount: 25
  },
  {
    id: '2', 
    name: 'Malika Karimova',
    email: 'malika.karimova@example.com',
    createdAt: '2024-02-01T14:20:00Z',
    status: 'active',
    studentsCount: 18
  },
  {
    id: '3',
    name: 'Jasur Aliyev',
    email: 'jasur.aliyev@example.com',
    createdAt: '2024-01-20T09:15:00Z',
    status: 'active',
    studentsCount: 22
  }
];

const initialItems = [
  {
    id: '1',
    name: 'Notebook',
    price: 15,
    description: 'High-quality notebook for taking notes',
    available: true,
    createdAt: '2024-01-10T12:00:00Z',
    purchaseCount: 23
  },
  {
    id: '2',
    name: 'Pen Set',
    price: 8,
    description: 'Set of 3 blue pens',
    available: true,
    createdAt: '2024-01-12T10:30:00Z',
    purchaseCount: 45
  },
  {
    id: '3',
    name: 'Calculator',
    price: 35,
    description: 'Scientific calculator for math classes',
    available: true,
    createdAt: '2024-01-08T16:20:00Z',
    purchaseCount: 12
  },
  {
    id: '4',
    name: 'Book Cover',
    price: 5,
    description: 'Protective cover for textbooks',
    available: false,
    createdAt: '2024-01-05T11:45:00Z',
    purchaseCount: 8
  }
];

const initialStudents = [
  {
    id: '1',
    name: 'Nodira Yusupova',
    email: 'nodira.yusupova@student.com',
    studentId: '2024001001',
    coinBalance: 85,
    teacherId: '1'
  },
  {
    id: '2',
    name: 'Sardor Rahimov',
    email: 'sardor.rahimov@student.com',
    studentId: '2024001002',
    coinBalance: 124,
    teacherId: '1'
  },
  {
    id: '3',
    name: 'Zilola Nazarova',
    email: 'zilola.nazarova@student.com',
    studentId: '2024001003',
    coinBalance: 67,
    teacherId: '2'
  },
  {
    id: '4',
    name: 'Bekzod Tursunov',
    email: 'bekzod.tursunov@student.com',
    studentId: '2024001004',
    coinBalance: 43,
    teacherId: '2'
  },
  {
    id: '5',
    name: 'Munisa Saidova',
    email: 'munisa.saidova@student.com',
    studentId: '2024001005',
    coinBalance: 156,
    teacherId: '3'
  },
  {
    id: '6',
    name: 'Otabek Karimov',
    email: 'otabek.karimov@student.com',
    studentId: '2024001006',
    coinBalance: 92,
    teacherId: '3'
  },
  {
    id: '7',
    name: 'Gulnoza Abdullayeva',
    email: 'gulnoza.abdullayeva@student.com',
    studentId: '2024001007',
    coinBalance: 28,
    teacherId: '1'
  },
  {
    id: '8',
    name: 'Farrux Ergashev',
    email: 'farrux.ergashev@student.com',
    studentId: '2024001008',
    coinBalance: 111,
    teacherId: '2'
  }
];

export function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for mock data - you can replace with API calls
  const [teachers, setTeachers] = useState(initialTeachers);
  const [items, setItems] = useState(initialItems);
  const [students, setStudents] = useState(initialStudents);

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <AlertDescription>Access denied. Admin privileges required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('welcomeAdmin')}, {user.name}
          </h1>
          <p className="text-muted-foreground">{t('dashboard')} - Complete system management</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t('teachers')}</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>{t('items')}</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>{t('students')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <AdminOverview 
              teachers={teachers}
              items={items}
              students={students}
            />
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <AdminTeachers 
              teachers={teachers}
              setTeachers={setTeachers}
            />
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items">
            <AdminItems 
              items={items}
              setItems={setItems}
            />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <AdminStudents 
              students={students}
              teachers={teachers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}