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
    'nav.profile': 'Profile',
    'nav.account': 'Account',
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
    // Home Page
    'home.title': 'Agricultural Risk Index Dashboard',
    'home.subtitle': 'Global agricultural risk intelligence - powered by AI',
    'home.riskDist': 'Risk Distribution',
    'home.avgTrend': 'Average Risk Trend',
    'home.top10': 'Top 10 Highest Risk Countries',
    'home.catDist': 'Risk Category Distribution by Year',
    'home.countryOverview': 'Country Risk Overview',
    'home.table.country': 'Country',
    'home.table.score': 'Risk Score',
    'home.table.level': 'Risk Level',
    'home.table.production': 'Production',
    'home.table.population': 'Population (K)',
    'home.table.selfSufficiency': 'Self-Sufficiency',
    // Analytics Page
    'analytics.title': 'Country Analytics',
    'analytics.subtitle': 'Detailed risk analysis per country',
    'analytics.shap': 'Explainable AI (SHAP)',
    'analytics.shapSub': 'Current risk factors explained',
    'analytics.why': 'Why does',
    'analytics.haveStatus': 'have a status of',
    'analytics.shapExplains': 'SHAP explains:',
    'analytics.notBlackBox': 'So AI does not become a black box.',
    'analytics.riskTrend': 'Risk Trend',
    'analytics.profile': 'Country Profile',
    'analytics.trade': 'Production, Import & Export',
    'analytics.histData': 'Historical Data',
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
    'nav.profile': 'Profil Saya',
    'nav.account': 'Akun',
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
    // Home Page
    'home.title': 'Dasbor Indeks Risiko Pertanian',
    'home.subtitle': 'Intelijen risiko pertanian global - diberdayakan oleh AI',
    'home.riskDist': 'Distribusi Risiko',
    'home.avgTrend': 'Tren Rata-rata Risiko',
    'home.top10': '10 Negara Risiko Tertinggi',
    'home.catDist': 'Distribusi Kategori Risiko per Tahun',
    'home.countryOverview': 'Ringkasan Risiko Negara',
    'home.table.country': 'Negara',
    'home.table.score': 'Skor Risiko',
    'home.table.level': 'Tingkat Risiko',
    'home.table.production': 'Produksi',
    'home.table.population': 'Populasi (K)',
    'home.table.selfSufficiency': 'Kemandirian Pangan',
    // Analytics Page
    'analytics.title': 'Analitik Negara',
    'analytics.subtitle': 'Analisis risiko detail per negara',
    'analytics.shap': 'Explainable AI (SHAP)',
    'analytics.shapSub': 'Penjelasan faktor risiko saat ini',
    'analytics.why': 'Mengapa',
    'analytics.haveStatus': 'berstatus',
    'analytics.shapExplains': 'SHAP menjelaskan:',
    'analytics.notBlackBox': 'Jadi AI tidak menjadi black box.',
    'analytics.riskTrend': 'Tren Risiko',
    'analytics.profile': 'Profil Negara',
    'analytics.trade': 'Produksi, Impor & Ekspor',
    'analytics.histData': 'Data Historis',
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
