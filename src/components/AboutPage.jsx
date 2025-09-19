import React from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Target, Eye, Heart, Users } from 'lucide-react';

export function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: t('missionTitle'),
      description: t('missionText')
    },
    {
      icon: <Eye className="h-8 w-8 text-green-600" />,
      title: "Vision",
      description: t('feature1Desc')
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Values",
      description: t('feature2Desc')
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community",
      description: t('feature3Desc')
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">IlmHub Coin</CardTitle>
              <CardDescription className="text-center text-lg">
                {t('ilmhubSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground leading-relaxed">
                {t('heroDescription')}
              </p>
              <p className="text-foreground leading-relaxed">
                {t('aboutDescription')}
              </p>
              <p className="text-foreground leading-relaxed">
                {t('missionText')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  {value.icon}
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {t('ilmhubTitle')} Team
              </CardTitle>
              <CardDescription className="text-blue-100 dark:text-blue-200">
                {t('missionText')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 dark:text-blue-200 leading-relaxed">
                {t('heroDescription')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}