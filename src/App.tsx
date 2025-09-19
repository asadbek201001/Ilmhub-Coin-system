import React, { useState } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { FeaturesPage } from './components/FeaturesPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard unless on public pages
  if (user && currentPage === 'login') {
    setCurrentPage('dashboard');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'features':
        return <FeaturesPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'teacher':
            return <TeacherDashboard />;
          case 'student':
            return <StudentDashboard />;
          default:
            return (
              <div className="p-8 text-center">
                <Alert variant="destructive">
                  <AlertDescription>Unknown user role. Please contact support.</AlertDescription>
                </Alert>
              </div>
            );
        }
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const showHeader = currentPage !== 'login';
  const showFooter = currentPage !== 'login' && currentPage !== 'dashboard';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && (
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <main className={`flex-1 ${showHeader ? '' : 'min-h-screen'}`}>
        {renderPage()}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}