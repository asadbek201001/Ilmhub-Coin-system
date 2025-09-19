import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Badge } from '../ui/badge.jsx';
import { Search, Coins, GraduationCap, TrendingUp, User } from 'lucide-react';

export function AdminStudents({ students, teachers }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCoins = students.reduce((sum, student) => sum + student.coinBalance, 0);
  const averageCoins = students.length > 0 ? Math.round(totalCoins / students.length) : 0;
  const highestBalance = students.length > 0 ? Math.max(...students.map(s => s.coinBalance)) : 0;

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const getCoinBalanceColor = (balance) => {
    if (balance >= 100) return 'text-green-600';
    if (balance >= 50) return 'text-blue-600';
    if (balance >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const coinRanges = [
    { label: '0-19 coins', count: students.filter(s => s.coinBalance < 20).length, color: 'bg-red-100 text-red-800' },
    { label: '20-49 coins', count: students.filter(s => s.coinBalance >= 20 && s.coinBalance < 50).length, color: 'bg-yellow-100 text-yellow-800' },
    { label: '50-99 coins', count: students.filter(s => s.coinBalance >= 50 && s.coinBalance < 100).length, color: 'bg-blue-100 text-blue-800' },
    { label: '100+ coins', count: students.filter(s => s.coinBalance >= 100).length, color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('students')}</h2>
          <p className="text-muted-foreground">View and manage all students</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCoins}</div>
            <p className="text-xs text-muted-foreground">In circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageCoins}</div>
            <p className="text-xs text-muted-foreground">Coins per student</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Highest Balance</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{highestBalance}</div>
            <p className="text-xs text-muted-foreground">Maximum coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Coin Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Coin Distribution</CardTitle>
          <CardDescription>Student distribution by coin balance ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {coinRanges.map((range, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-2">{range.count}</div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${range.color}`}>
                  {range.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>Complete list of registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('studentId')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('coinBalance')}</TableHead>
                <TableHead>{t('teacher')}</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No students found matching your search.' : 'No students found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {student.studentId}
                      </span>
                    </TableCell>
                    <TableCell>
                      {student.email || 'Not provided'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-blue-600" />
                        <span className={`font-medium ${getCoinBalanceColor(student.coinBalance)}`}>
                          {student.coinBalance}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTeacherName(student.teacherId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.coinBalance > 0 ? 'default' : 'secondary'}>
                        {student.coinBalance > 0 ? 'Active' : 'New'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>Top Students by Coin Balance</CardTitle>
          <CardDescription>Students with the highest coin balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students
              .sort((a, b) => b.coinBalance - a.coinBalance)
              .slice(0, 5)
              .map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-lg">{student.coinBalance}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}