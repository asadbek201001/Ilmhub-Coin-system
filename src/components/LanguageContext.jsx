import React, { createContext, useContext, useState } from 'react';

const translations = {
  // Common
  language: { uz: "O'zbek", en: "English" },
  login: { uz: "Kirish", en: "Login" },
  logout: { uz: "Chiqish", en: "Logout" },
  save: { uz: "Saqlash", en: "Save" },
  cancel: { uz: "Bekor qilish", en: "Cancel" },
  add: { uz: "Qo'shish", en: "Add" },
  edit: { uz: "Tahrirlash", en: "Edit" },
  delete: { uz: "O'chirish", en: "Delete" },
  confirm: { uz: "Tasdiqlash", en: "Confirm" },
  back: { uz: "Orqaga", en: "Back" },
  next: { uz: "Keyingi", en: "Next" },
  loading: { uz: "Yuklanmoqda...", en: "Loading..." },
  error: { uz: "Xatolik", en: "Error" },
  success: { uz: "Muvaffaqiyat", en: "Success" },

  // Navigation
  home: { uz: "Bosh sahifa", en: "Home" },
  about: { uz: "Biz haqimizda", en: "About" },
  contact: { uz: "Aloqa", en: "Contact Us" },
  features: { uz: "Imkoniyatlar", en: "Features" },
  dashboard: { uz: "Boshqaruv paneli", en: "Dashboard" },

  // Authentication
  email: { uz: "Elektron pochta", en: "Email" },
  password: { uz: "Parol", en: "Password" },
  studentId: { uz: "O'quvchi ID", en: "Student ID" },
  name: { uz: "Ism", en: "Name" },
  role: { uz: "Rol", en: "Role" },
  student: { uz: "O'quvchi", en: "Student" },
  teacher: { uz: "O'qituvchi", en: "Teacher" },
  admin: { uz: "Administrator", en: "Admin" },
  loginWithStudentId: { uz: "O'quvchi ID bilan kirish", en: "Login with Student ID" },
  adminLogin: { uz: "Administrator kirish", en: "Admin Login" },
  teacherLogin: { uz: "O'qituvchi kirish", en: "Teacher Login" },

  // Dashboard
  welcomeAdmin: { uz: "Xush kelibsiz, Administrator", en: "Welcome, Admin" },
  welcomeTeacher: { uz: "Xush kelibsiz, O'qituvchi", en: "Welcome, Teacher" },
  welcomeStudent: { uz: "Xush kelibsiz, O'quvchi", en: "Welcome, Student" },
  totalTeachers: { uz: "Jami o'qituvchilar", en: "Total Teachers" },
  totalStudents: { uz: "Jami o'quvchilar", en: "Total Students" },
  totalItems: { uz: "Jami mahsulotlar", en: "Total Items" },
  coinBalance: { uz: "Tanga balansi", en: "Coin Balance" },

  // Items
  items: { uz: "Mahsulotlar", en: "Items" },
  itemName: { uz: "Mahsulot nomi", en: "Item Name" },
  price: { uz: "Narx", en: "Price" },
  description: { uz: "Ta'rif", en: "Description" },
  available: { uz: "Mavjud", en: "Available" },
  addItem: { uz: "Mahsulot qo'shish", en: "Add Item" },
  buyItem: { uz: "Sotib olish", en: "Buy Item" },
  coins: { uz: "tangalar", en: "coins" },
  insufficientCoins: { uz: "Tangalar yetarli emas", en: "Insufficient coins" },

  // Students
  students: { uz: "O'quvchilar", en: "Students" },
  addStudent: { uz: "O'quvchi qo'shish", en: "Add Student" },
  giveCoins: { uz: "Tanga berish", en: "Give Coins" },
  amount: { uz: "Miqdor", en: "Amount" },
  reason: { uz: "Sabab", en: "Reason" },
  transactions: { uz: "Tranzaksiyalar", en: "Transactions" },

  // Teachers
  teachers: { uz: "O'qituvchilar", en: "Teachers" },
  addTeacher: { uz: "O'qituvchi qo'shish", en: "Add Teacher" },

  // Home page
  ilmhubTitle: { uz: "IlmHub Coin", en: "IlmHub Coin" },
  ilmhubSubtitle: { uz: "Ta'lim uchun raqamli tanga tizimi", en: "Digital Coin System for Education" },
  heroDescription: { uz: "IlmHub Coin - bu ta'lim muassasalari uchun zamonaviy raqamli mukofot tizimi. O'quvchilar faoliyati uchun tangalar olib, ularni turli mahsulotlarga almashtirishlari mumkin.", en: "IlmHub Coin is a modern digital reward system for educational institutions. Students can earn coins for their activities and exchange them for various items." },
  getStarted: { uz: "Boshlash", en: "Get Started" },
  learnMore: { uz: "Batafsil", en: "Learn More" },

  // About page
  aboutTitle: { uz: "Biz haqimizda", en: "About Us" },
  aboutDescription: { uz: "IlmHub Coin - bu ta'lim sohasida inqilobiy o'zgarishlar olib keladigan raqamli mukofot tizimi.", en: "IlmHub Coin is a revolutionary digital reward system that brings innovation to education." },
  missionTitle: { uz: "Bizning missiyamiz", en: "Our Mission" },
  missionText: { uz: "Biz ta'limni yanada qiziqarli va motivatsion qilish uchun zamonaviy texnologiyalardan foydalanamiz.", en: "We use modern technology to make education more engaging and motivational." },

  // Features page
  featuresTitle: { uz: "Imkoniyatlar", en: "Features" },
  feature1Title: { uz: "Oson boshqaruv", en: "Easy Management" },
  feature1Desc: { uz: "Administratorlar va o'qituvchilar uchun sodda va qulay interfeys", en: "Simple and convenient interface for administrators and teachers" },
  feature2Title: { uz: "Xavfsiz tizim", en: "Secure System" },
  feature2Desc: { uz: "Ma'lumotlarning xavfsizligi va maxfiyligini ta'minlash", en: "Ensuring data security and privacy" },
  feature3Title: { uz: "Real vaqt", en: "Real-time" },
  feature3Desc: { uz: "Tanga o'tkazmalari va balans o'zgarishlari real vaqtda yangilanadi", en: "Coin transfers and balance changes are updated in real-time" },

  // Contact page
  contactTitle: { uz: "Aloqa", en: "Contact Us" },
  contactDescription: { uz: "Bizga murojaat qiling va savollaringizni bering", en: "Contact us and ask your questions" },
  phone: { uz: "Telefon", en: "Phone" },
  address: { uz: "Manzil", en: "Address" },
  sendMessage: { uz: "Xabar yuborish", en: "Send Message" },
  message: { uz: "Xabar", en: "Message" },
  
  // Additional translations
  management: { uz: "boshqaruv", en: "management" },
  information: { uz: "ma'lumot", en: "information" },
  moreFeatures: { uz: "Ko'proq imkoniyatlar", en: "More Features" },
  technology: { uz: "Texnologiya", en: "Technology" },

  // Footer translations
  footerDescription: { uz: "Ta'limni innovatsion raqamli mukofotlar va o'quv boshqaruvi orqali rivojlantirish", en: "Empowering education through innovative digital rewards and learning management" },
  quickLinks: { uz: "Tezkor havolalar", en: "Quick Links" },
  services: { uz: "Xizmatlar", en: "Services" },
  studentManagement: { uz: "O'quvchilarni boshqarish", en: "Student Management" },
  coinRewards: { uz: "Tanga mukofotlari", en: "Coin Rewards" },
  teacherDashboard: { uz: "O'qituvchi paneli", en: "Teacher Dashboard" },
  adminPanel: { uz: "Administrator paneli", en: "Admin Panel" },
  contactInfo: { uz: "Aloqa ma'lumotlari", en: "Contact Info" },
  allRightsReserved: { uz: "Barcha huquqlar himoyalangan", en: "All rights reserved" },
  privacyPolicy: { uz: "Maxfiylik siyosati", en: "Privacy Policy" },
  termsOfService: { uz: "Foydalanish shartlari", en: "Terms of Service" },
  cookiePolicy: { uz: "Cookie siyosati", en: "Cookie Policy" },

  // Theme translations
  lightMode: { uz: "Yorug' rejim", en: "Light Mode" },
  darkMode: { uz: "Qora rejim", en: "Dark Mode" },
  theme: { uz: "Mavzu", en: "Theme" },
};

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('uz');

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}