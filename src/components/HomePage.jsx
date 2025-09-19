import React from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Coins, Users, Shield, Zap, TrendingUp, Award } from 'lucide-react';

export function HomePage({ setCurrentPage }) {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: t('feature1Title'),
      description: t('feature1Desc')
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: t('feature2Title'),
      description: t('feature2Desc')
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-600" />,
      title: t('feature3Title'),
      description: t('feature3Desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg">
              <Coins className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('ilmhubTitle')}
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t('ilmhubSubtitle')}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => setCurrentPage('login')}
            >
              {t('getStarted')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => setCurrentPage('features')}
            >
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">100%</h3>
              <p className="text-muted-foreground">{t('feature2Title')}</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">24/7</h3>
              <p className="text-muted-foreground">{t('feature1Title')}</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">∞</h3>
              <p className="text-muted-foreground">{t('feature3Title')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('getStarted')}
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200"
            onClick={() => setCurrentPage('login')}
          >
            {t('login')}
          </Button>
        </div>
      </section>
    </div>
  );
}