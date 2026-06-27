import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.overview': 'Overview',
    'nav.globalRiskMap': 'Global Risk Map',
    'nav.analytics': 'Analytics',
    'nav.countryAnalytics': 'Country Analytics',
    'nav.commodityAnalytics': 'Commodity Analytics',
    'nav.intelligence': 'Intelligence',
    'nav.mlInsights': 'ML Insights',
    'nav.recommendations': 'Recommendations',
    'nav.forecast': 'Forecast',
    'nav.export': 'Export',
    'nav.reports': 'Reports',
    'nav.admin': 'Admin',
    'nav.userManagement': 'User Management',
    'nav.systemLogs': 'System Logs',
    // Topbar
    'topbar.search': 'Search countries, commodities...',
    // Auth
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email or Username',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.welcome': 'Welcome to AgriShield AI',
    'auth.createAccount': 'Create an Account',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    // Risk Status
    'status.safe': 'Safe',
    'status.lowRisk': 'Low Risk',
    'status.moderate': 'Moderate',
    'status.highRisk': 'High Risk',
    'status.critical': 'Critical',
    // UI Elements
    'ui.loading': 'Loading...',
    'ui.latestDataYear': 'Latest Data Year',
    'ui.totalCountries': 'Total Countries',
    'ui.avgRiskScore': 'Avg Risk Score',
    'ui.highRiskCountries': 'High Risk Countries',
    // Rules
    'rule.if': 'IF',
    'rule.then': 'THEN'
  },
  id: {
    // Nav
    'nav.home': 'Beranda',
    'nav.overview': 'Ringkasan',
    'nav.globalRiskMap': 'Peta Risiko Global',
    'nav.analytics': 'Analitik',
    'nav.countryAnalytics': 'Analitik Negara',
    'nav.commodityAnalytics': 'Analitik Komoditas',
    'nav.intelligence': 'Kecerdasan Buatan',
    'nav.mlInsights': 'Wawasan ML',
    'nav.recommendations': 'Rekomendasi',
    'nav.forecast': 'Prakiraan',
    'nav.export': 'Ekspor',
    'nav.reports': 'Laporan',
    'nav.admin': 'Admin',
    'nav.userManagement': 'Manajemen Pengguna',
    'nav.systemLogs': 'Log Sistem',
    // Topbar
    'topbar.search': 'Cari negara, komoditas...',
    // Auth
    'auth.signin': 'Masuk',
    'auth.signup': 'Daftar',
    'auth.email': 'Email atau Username',
    'auth.password': 'Kata Sandi',
    'auth.name': 'Nama Lengkap',
    'auth.welcome': 'Selamat Datang di AgriShield AI',
    'auth.createAccount': 'Buat Akun Baru',
    'auth.noAccount': 'Belum punya akun?',
    'auth.hasAccount': 'Sudah punya akun?',
    // Risk Status
    'status.safe': 'Aman',
    'status.lowRisk': 'Risiko Rendah',
    'status.moderate': 'Moderat',
    'status.highRisk': 'Risiko Tinggi',
    'status.critical': 'Kritis',
    // UI Elements
    'ui.loading': 'Memuat...',
    'ui.latestDataYear': 'Tahun Data Terakhir',
    'ui.totalCountries': 'Total Negara',
    'ui.avgRiskScore': 'Rata-rata Skor Risiko',
    'ui.highRiskCountries': 'Negara Risiko Tinggi',
    // Rules
    'rule.if': 'JIKA',
    'rule.then': 'MAKA'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('agrishield_lang');
    if (saved && (saved === 'en' || saved === 'id')) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'id' : 'en';
    setLang(next);
    localStorage.setItem('agrishield_lang', next);
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
