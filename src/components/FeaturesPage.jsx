import React from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { 
  Users, 
  Shield, 
  Zap, 
  Coins, 
  BarChart, 
  Clock, 
  Globe, 
  Smartphone,
  Award,
  Settings,
  Database,
  Lock
} from 'lucide-react';

export function FeaturesPage() {
  const { t } = useLanguage();

  const mainFeatures = [
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      highlights: [t('students'), t('teachers'), t('admin')]
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      highlights: [t('login'), 'SSL', 'Backup']
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-600" />,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      highlights: ['Real-time', 'Fast', 'Instant']
    }
  ];

  const additionalFeatures = [
    {
      icon: <Coins className="h-8 w-8 text-blue-500" />,
      title: t('coins') + ' ' + t('management'),
      description: t('giveCoins') + ' & ' + t('buyItem')
    },
    {
      icon: <BarChart className="h-8 w-8 text-green-500" />,
      title: t('transactions'),
      description: t('transactions') + ' history & analytics'
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: '24/7 ' + t('available'),
      description: 'Always accessible platform'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-500" />,
      title: t('language') + ' Support',
      description: t('language') + ': ' + 'Uzbek & English'
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-500" />,
      title: 'Mobile Responsive',
      description: 'Works on all devices'
    },
    {
      icon: <Award className="h-8 w-8 text-orange-500" />,
      title: t('items') + ' Store',
      description: t('buyItem') + ' with ' + t('coins')
    },
    {
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      title: t('dashboard'),
      description: 'Role-based control panels'
    },
    {
      icon: <Database className="h-8 w-8 text-red-500" />,
      title: 'Data Management',
      description: 'Secure data storage'
    },
    {
      icon: <Lock className="h-8 w-8 text-teal-500" />,
      title: 'Access Control',
      description: 'Role-based permissions'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('featuresTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {feature.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="secondary">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            {t('moreFeatures') || 'More Features'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Stack */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {t('technology') || 'Technology Stack'}
              </CardTitle>
              <CardDescription className="text-blue-100 dark:text-blue-200">
                Modern and reliable technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Frontend</h4>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">React, JavaScript, Tailwind CSS</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Backend</h4>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">Node.js, Express, PostgreSQL</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Security</h4>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">JWT Auth, HTTPS, Data Encryption</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}