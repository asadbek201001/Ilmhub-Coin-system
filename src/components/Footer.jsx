import React from 'react';
import { useLanguage } from './LanguageContext';
import { Coins, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">IlmHub Coin</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
              {t('footerDescription') || 'Empowering education through innovative digital rewards and learning management.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('quickLinks') || 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('home') || 'Home'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('about') || 'About'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('features') || 'Features'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('contact') || 'Contact'}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('services') || 'Services'}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('studentManagement') || 'Student Management'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('coinRewards') || 'Coin Rewards'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('teacherDashboard') || 'Teacher Dashboard'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors">
                  {t('adminPanel') || 'Admin Panel'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('contactInfo') || 'Contact Info'}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 dark:text-gray-400">info@ilmhubcoin.uz</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 dark:text-gray-400">+998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 dark:text-gray-400">Tashkent, Uzbekistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              © {currentYear} IlmHub Coin. {t('allRightsReserved') || 'All rights reserved.'}
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                {t('privacyPolicy') || 'Privacy Policy'}
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                {t('termsOfService') || 'Terms of Service'}
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors">
                {t('cookiePolicy') || 'Cookie Policy'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;