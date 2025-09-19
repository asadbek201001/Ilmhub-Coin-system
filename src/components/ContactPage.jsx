import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';

export function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: t('email'),
      value: 'info@ilmhubcoin.uz',
      href: 'mailto:info@ilmhubcoin.uz'
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: t('phone'),
      value: '+998 90 123 45 67',
      href: 'tel:+998901234567'
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-600" />,
      title: t('address'),
      value: 'Tashkent, Uzbekistan',
      href: '#'
    }
  ];

  const workingHours = [
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: 'Working Hours',
      value: 'Mon-Fri: 9:00 - 18:00'
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-600" />,
      title: 'Support',
      value: '24/7 Online Support'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('contactTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t('sendMessage')}</CardTitle>
                <CardDescription>
                  {t('contactDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <Alert className="mb-6">
                    <AlertDescription>
                      {t('success')}! {t('message')} sent successfully.
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>{t('sendMessage')}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact')} {t('information') || 'Information'}</CardTitle>
                <CardDescription>
                  {t('contactDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {info.icon}
                    <div>
                      <h4 className="font-medium text-foreground">{info.title}</h4>
                      {info.href !== '#' ? (
                        <a 
                          href={info.href} 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workingHours.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {info.icon}
                    <div>
                      <h4 className="font-medium text-foreground">{info.title}</h4>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-white">FAQ</CardTitle>
                <CardDescription className="text-blue-100 dark:text-blue-200">
                  Frequently Asked Questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-white">How to get student ID?</h4>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">{t('teacher')} can create student accounts and provide IDs.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-white">How to earn coins?</h4>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">{t('teacher')} awards coins for good performance.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-white">System requirements?</h4>
                    <p className="text-blue-100 dark:text-blue-200 text-sm">Works on any device with internet connection.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}