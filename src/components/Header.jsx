import React, { useState } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { useTheme } from './ThemeContext.jsx';
import { Button } from './ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Menu, X, Coins, LogOut, Sun, Moon } from 'lucide-react';

export function Header({ currentPage, setCurrentPage }) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicPages = ['home', 'about', 'contact', 'features'];
  const isPublicPage = publicPages.includes(currentPage);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <Coins className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-foreground">{t('ilmhubTitle')}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isPublicPage && (
              <>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === 'home' ? 'text-blue-600' : 'text-foreground'
                  }`}
                >
                  {t('home')}
                </button>
                <button
                  onClick={() => handleNavigation('about')}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === 'about' ? 'text-blue-600' : 'text-foreground'
                  }`}
                >
                  {t('about')}
                </button>
                <button
                  onClick={() => handleNavigation('features')}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === 'features' ? 'text-blue-600' : 'text-foreground'
                  }`}
                >
                  {t('features')}
                </button>
                <button
                  onClick={() => handleNavigation('contact')}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === 'contact' ? 'text-blue-600' : 'text-foreground'
                  }`}
                >
                  {t('contact')}
                </button>
              </>
            )}
            
            {user && (
              <>
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    currentPage === 'dashboard' ? 'text-blue-600' : 'text-foreground'
                  }`}
                >
                  {t('dashboard')}
                </button>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{user.name}</span>
                  {user.coinBalance !== undefined && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {user.coinBalance} {t('coins')}
                    </span>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
              title={theme === 'light' ? t('darkMode') : t('lightMode')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">O'zb</SelectItem>
                <SelectItem value="en">Eng</SelectItem>
              </SelectContent>
            </Select>

            {/* Auth buttons */}
            {!user && isPublicPage && (
              <Button
                onClick={() => handleNavigation('login')}
                className="hidden md:flex"
              >
                {t('login')}
              </Button>
            )}

            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with Blur Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 z-50 md:hidden">
              <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg rounded-b-lg mx-4 mt-2">
                <div className="p-6 space-y-4">
                  {isPublicPage && (
                    <>
                      <button
                        onClick={() => handleNavigation('home')}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'home' 
                            ? 'bg-blue-500/20 text-blue-600 backdrop-blur-sm border border-blue-500/30' 
                            : 'text-foreground hover:bg-muted/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        {t('home')}
                      </button>
                      <button
                        onClick={() => handleNavigation('about')}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'about' 
                            ? 'bg-blue-500/20 text-blue-600 backdrop-blur-sm border border-blue-500/30' 
                            : 'text-foreground hover:bg-muted/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        {t('about')}
                      </button>
                      <button
                        onClick={() => handleNavigation('features')}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'features' 
                            ? 'bg-blue-500/20 text-blue-600 backdrop-blur-sm border border-blue-500/30' 
                            : 'text-foreground hover:bg-muted/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        {t('features')}
                      </button>
                      <button
                        onClick={() => handleNavigation('contact')}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'contact' 
                            ? 'bg-blue-500/20 text-blue-600 backdrop-blur-sm border border-blue-500/30' 
                            : 'text-foreground hover:bg-muted/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        {t('contact')}
                      </button>
                      {/* Separator */}
                      <div className="h-px bg-border/50" />
                    </>
                  )}
                  
                  {user && (
                    <>
                      <button
                        onClick={() => handleNavigation('dashboard')}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'dashboard' 
                            ? 'bg-blue-500/20 text-blue-600 backdrop-blur-sm border border-blue-500/30' 
                            : 'text-foreground hover:bg-muted/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        {t('dashboard')}
                      </button>
                      
                      {/* User info card with glass effect */}
                      <div className="py-3 px-4 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/50">
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        {user.coinBalance !== undefined && (
                          <div className="text-blue-600 mt-1 font-medium">
                            {user.coinBalance} {t('coins')}
                          </div>
                        )}
                      </div>
                      
                      {/* Separator */}
                      <div className="h-px bg-border/50" />
                    </>
                  )}

                  {!user && isPublicPage && (
                    <Button
                      onClick={() => handleNavigation('login')}
                      className="w-full backdrop-blur-sm"
                    >
                      {t('login')}
                    </Button>
                  )}

                  {user && (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 backdrop-blur-sm border-border/50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </Button>
                  )}

                  {/* Theme toggle for mobile with glass effect */}
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center space-x-2 backdrop-blur-sm border-border/50"
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span>{theme === 'light' ? t('darkMode') : t('lightMode')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}