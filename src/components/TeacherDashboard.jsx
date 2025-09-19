import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Users, UserPlus, Coins, Plus, Send } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';


export function TeacherDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Student form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: ''
  });
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  // Give coins form
  const [coinsForm, setCoinsForm] = useState({
    studentId: '',
    amount: '',
    reason: ''
  });
  const [showCoinsDialog, setShowCoinsDialog] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/students`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter students by teacher (if applicable)
        const teacherStudents = data.students.filter((s) => 
          s.teacherId === user?.id || !s.teacherId
        );
        setStudents(teacherStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/add-student`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentForm)
      });

      const data = await response.json();

      if (response.ok) {
        setStudentForm({ name: '', email: '' });
        setShowStudentDialog(false);
        setSuccess(`Student added successfully! Student ID: ${data.student.studentId}`);
        await fetchStudents();
      } else {
        setError(data.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const giveCoins = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const coinsData = {
        ...coinsForm,
        amount: parseInt(coinsForm.amount)
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/give-coins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coinsData)
      });

      const data = await response.json();

      if (response.ok) {
        setCoinsForm({ studentId: '', amount: '', reason: '' });
        setShowCoinsDialog(false);
        setSuccess(`Coins given successfully! New balance: ${data.newBalance}`);
        await fetchStudents();
      } else {
        setError(data.error || 'Failed to give coins');
      }
    } catch (error) {
      console.error('Error giving coins:', error);
      setError('Failed to give coins');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (!user || user.role !== 'teacher') {
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <AlertDescription>Access denied. Teacher privileges required.</AlertDescription>
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
            {t('welcomeTeacher')}, {user.name}
          </h1>
          <p className="text-muted-foreground">{t('dashboard')}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <Button variant="ghost" size="sm" className="ml-2" onClick={clearMessages}>
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>
              {success}
              <Button variant="ghost" size="sm" className="ml-2" onClick={clearMessages}>
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalStudents')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coins Given</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.reduce((total, student) => total + student.coinBalance, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">{t('students')}</TabsTrigger>
            <TabsTrigger value="coins">{t('giveCoins')}</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t('students')}</CardTitle>
                    <CardDescription>Manage your students</CardDescription>
                  </div>
                  <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>{t('addStudent')}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('addStudent')}</DialogTitle>
                        <DialogDescription>
                          Add a new student to your class. A random 10-digit ID will be generated.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={addStudent} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="student-name">{t('name')}</Label>
                          <Input
                            id="student-name"
                            value={studentForm.name}
                            onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-email">{t('email')}</Label>
                          <Input
                            id="student-email"
                            type="email"
                            value={studentForm.email}
                            onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowStudentDialog(false)}>
                            {t('cancel')}
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? t('loading') : t('add')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('studentId')}</TableHead>
                      <TableHead>{t('email')}</TableHead>
                      <TableHead>{t('coinBalance')}</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No students found. Add some students to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="font-mono">{student.studentId}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell className="flex items-center space-x-1">
                            <Coins className="h-4 w-4 text-blue-600" />
                            <span>{student.coinBalance}</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCoinsForm({...coinsForm, studentId: student.studentId});
                                setShowCoinsDialog(true);
                              }}
                            >
                              {t('giveCoins')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Give Coins Tab */}
          <TabsContent value="coins">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t('giveCoins')}</CardTitle>
                    <CardDescription>Reward students with coins for their achievements</CardDescription>
                  </div>
                  <Dialog open={showCoinsDialog} onOpenChange={setShowCoinsDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>{t('giveCoins')}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('giveCoins')}</DialogTitle>
                        <DialogDescription>
                          Give coins to a student as a reward
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={giveCoins} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="coins-student-id">{t('studentId')}</Label>
                          <Input
                            id="coins-student-id"
                            value={coinsForm.studentId}
                            onChange={(e) => setCoinsForm({...coinsForm, studentId: e.target.value})}
                            placeholder="1234567890"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coins-amount">{t('amount')}</Label>
                          <Input
                            id="coins-amount"
                            type="number"
                            min="1"
                            value={coinsForm.amount}
                            onChange={(e) => setCoinsForm({...coinsForm, amount: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coins-reason">{t('reason')}</Label>
                          <Textarea
                            id="coins-reason"
                            value={coinsForm.reason}
                            onChange={(e) => setCoinsForm({...coinsForm, reason: e.target.value})}
                            placeholder="Good performance in class"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowCoinsDialog(false)}>
                            {t('cancel')}
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? t('loading') : t('giveCoins')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {students.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      No students available. Add some students first.
                    </div>
                  ) : (
                    students.map((student) => (
                      <Card key={student.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{student.name}</CardTitle>
                              <CardDescription className="font-mono">ID: {student.studentId}</CardDescription>
                            </div>
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Coins className="h-3 w-3" />
                              <span>{student.coinBalance}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setCoinsForm({...coinsForm, studentId: student.studentId});
                              setShowCoinsDialog(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('giveCoins')}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}