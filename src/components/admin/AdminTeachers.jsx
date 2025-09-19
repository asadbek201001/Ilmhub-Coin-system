import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog.jsx';
import { Badge } from '../ui/badge.jsx';
import { UserPlus, Edit, Trash2, Search, Mail, Calendar } from 'lucide-react';

export function AdminTeachers({ teachers, setTeachers }) {
  const { t } = useLanguage();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const newTeacher = {
      id: Date.now().toString(),
      name: teacherForm.name,
      email: teacherForm.email,
      createdAt: new Date().toISOString(),
      status: 'active',
      studentsCount: 0
    };

    setTeachers([...teachers, newTeacher]);
    setTeacherForm({ name: '', email: '', password: '' });
    setShowAddDialog(false);
  };

  const handleDeleteTeacher = (teacherId) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('teachers')}</h2>
          <p className="text-muted-foreground">Manage teachers in the system</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>{t('addTeacher')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addTeacher')}</DialogTitle>
              <DialogDescription>Add a new teacher to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-name">{t('name')}</Label>
                <Input
                  id="teacher-name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                  placeholder="Teacher's full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-email">{t('email')}</Label>
                <Input
                  id="teacher-email"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                  placeholder="teacher@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-password">{t('password')}</Label>
                <Input
                  id="teacher-password"
                  type="password"
                  value={teacherForm.password}
                  onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
                  placeholder="Temporary password"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
          <CardDescription>List of all registered teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No teachers found matching your search.' : 'No teachers found. Add a teacher to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                        {teacher.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{teacher.studentsCount || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(teacher.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Teacher Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Students per Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + (t.studentsCount || 0), 0) / teachers.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Students assigned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}