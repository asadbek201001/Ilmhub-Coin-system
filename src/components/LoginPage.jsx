import React, { useState } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { Alert, AlertDescription } from './ui/alert.jsx';
import { Coins, User, Users, Shield, Wifi } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info.jsx';

export function LoginPage({ setCurrentPage }) {
  const { t } = useLanguage();
  const { login, loginStudent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Student login state
  const [studentId, setStudentId] = useState('');

  // Admin/Teacher login state
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin1234');
  const [testResult, setTestResult] = useState('');

  const testConnection = async () => {
    try {
      setTestResult('Testing...');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Server connection: ${data.status}`);
        
        // Test admin endpoint
        const adminResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/test-admin`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setTestResult(prev => `${prev}\n✅ Admin user: ${adminData.message}\n📊 Total users: ${adminData.totalUsers}`);
          
          // Test admin login endpoint
          const adminLoginResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/simple-login`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin1234' })
          });
          
          if (adminLoginResponse.ok) {
            const loginData = await adminLoginResponse.json();
            setTestResult(prev => `${prev}\n✅ Admin login test: Success\n👤 User: ${loginData.user.name} (${loginData.user.role})`);
          } else {
            const loginError = await adminLoginResponse.json();
            setTestResult(prev => `${prev}\n❌ Admin login test failed: ${loginError.error || 'Unknown error'}`);
          }
          
          // Test teacher login endpoint
          const teacherLoginResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/simple-login`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'teacher@gmail.com', password: 'teacher1234' })
          });
          
          if (teacherLoginResponse.ok) {
            const teacherData = await teacherLoginResponse.json();
            setTestResult(prev => `${prev}\n✅ Teacher login test: Success\n👤 User: ${teacherData.user.name} (${teacherData.user.role})`);
          } else {
            const teacherError = await teacherLoginResponse.json();
            setTestResult(prev => `${prev}\n❌ Teacher login test failed: ${teacherError.error || 'Unknown error'}`);
          }
        } else {
          const adminError = await adminResponse.json();
          setTestResult(prev => `${prev}\n❌ Admin check failed: ${adminError.error || 'Unknown error'}`);
        }
      } else {
        setTestResult(`❌ Server error: ${response.status}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error.message}`);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    setError('');

    const result = await loginStudent(studentId);
    
    if (result.success) {
      setCurrentPage('dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const handleAdminTeacherLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      setCurrentPage('dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Coins className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('ilmhubTitle')}</h1>
          <p className="text-gray-600 mt-2">{t('ilmhubSubtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t('login')}</CardTitle>
            <CardDescription className="text-center">
              {t('loginWithStudentId')} {t('adminLogin')} {t('teacherLogin')}
            </CardDescription>
            <div className="bg-blue-50 p-3 rounded-md text-sm space-y-2">
              <p className="font-medium text-blue-800">Demo Credentials:</p>
              <p className="text-blue-700">Admin: admin@gmail.com / admin1234</p>
              <p className="text-blue-700">Teacher: teacher@gmail.com / teacher1234</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={testConnection}
                  className="flex items-center space-x-1"
                >
                  <Wifi className="h-3 w-3" />
                  <span>Test Connection</span>
                </Button>
              </div>
              {testResult && (
                <pre className="text-xs bg-white p-2 rounded border whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {testResult}
                </pre>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full" onValueChange={() => setError('')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{t('student')}</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{t('teacher')}</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>{t('admin')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">{t('studentId')}</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="1234567890"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      disabled={loading}
                      maxLength={10}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !studentId.trim()}
                  >
                    {loading ? t('loading') : t('login')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4 mt-6">
                <form onSubmit={handleAdminTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">{t('email')}</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">{t('password')}</Label>
                    <Input
                      id="teacher-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !email.trim() || !password.trim()}
                  >
                    {loading ? t('loading') : t('login')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <form onSubmit={handleAdminTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">{t('email')}</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">{t('password')}</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !email.trim() || !password.trim()}
                  >
                    {loading ? t('loading') : t('login')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => setCurrentPage('home')}
                className="text-sm"
              >
                {t('back')} {t('home')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}