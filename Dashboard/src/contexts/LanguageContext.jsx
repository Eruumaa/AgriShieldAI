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
    'rule.then': 'THEN',
    // Landing
    'landing.hero.badge': 'Introducing Predictive Global Analytics',
    'landing.hero.title1': 'Predict ',
    'landing.hero.title2': 'Agricultural Risks',
    'landing.hero.title3': ' Before They Happen',
    'landing.hero.subtitle': 'Empowering governments and organizations with AI-driven insights to safeguard global food security against climate change and supply chain disruptions.',
    'landing.hero.btnPrimary': 'Open Dashboard',
    'landing.hero.btnSecondary': 'Learn More',
    
    'landing.problem.title': 'The Global Challenge',
    'landing.problem.subtitle': 'Traditional methods are no longer sufficient to secure the food supply of tomorrow.',
    'landing.problem.c1.title': 'Climate Volatility',
    'landing.problem.c1.desc': 'Unpredictable weather patterns and extreme climate events devastate crop yields, causing billions in agricultural losses annually.',
    'landing.problem.c2.title': 'Supply Chain Disruption',
    'landing.problem.c2.desc': 'Geopolitical conflicts and logistical breakdowns sever food trade routes, creating catastrophic regional shortages.',
    'landing.problem.c3.title': 'Data Fragmentation',
    'landing.problem.c3.desc': 'Critical data is siloed across organizations. Without unified intelligence, policymakers are forced to make reactive decisions.',
    
    'landing.impact.title': 'Our Impact & Results',
    'landing.impact.subtitle': 'AgriShield AI leverages advanced Machine Learning and FAO data to provide unparalleled accuracy in agricultural risk forecasting.',
    'landing.impact.l1.title': '95% Prediction Accuracy',
    'landing.impact.l1.desc': 'Our Random Forest models achieve industry-leading accuracy in forecasting production volatility.',
    'landing.impact.l2.title': '50+ Countries Monitored',
    'landing.impact.l2.desc': 'Real-time food security index tracking across major global agricultural producers.',
    'landing.impact.l3.title': 'Actionable AI Recommendations',
    'landing.impact.l3.desc': 'Automated Gemini LLM integration provides policy suggestions based on real-time data anomalies.',
    'landing.impact.s1.val': '3M+',
    'landing.impact.s1.lbl': 'Data Points Analyzed',
    'landing.impact.s2.val': 'Tier 1',
    'landing.impact.s2.lbl': 'FAO Data Integration',
    
    'landing.footer.title': 'Ready to secure the future?',
    'landing.footer.btn': 'Create Free Account',

    'landing.card.alert': 'Global Risk Alert',
    'landing.card.alertTitle': 'Wheat Shortage Predicted',
    'landing.card.critical': 'Critical Level',
    'landing.card.reco': 'AI Recommendation',
    'landing.card.recoTitle': 'Increase Reserves',
    'landing.card.confidence': 'Confidence'
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
    'rule.then': 'MAKA',
    // Landing
    'landing.hero.badge': 'Memperkenalkan Analitik Global Prediktif',
    'landing.hero.title1': 'Prediksi ',
    'landing.hero.title2': 'Risiko Pertanian',
    'landing.hero.title3': ' Sebelum Terjadi',
    'landing.hero.subtitle': 'Memberdayakan pemerintah dan organisasi dengan wawasan AI untuk menjaga ketahanan pangan global dari perubahan iklim dan gangguan rantai pasokan.',
    'landing.hero.btnPrimary': 'Buka Dashboard',
    'landing.hero.btnSecondary': 'Pelajari Lebih Lanjut',
    
    'landing.problem.title': 'Tantangan Global',
    'landing.problem.subtitle': 'Metode tradisional tidak lagi cukup untuk mengamankan pasokan pangan masa depan.',
    'landing.problem.c1.title': 'Volatilitas Iklim',
    'landing.problem.c1.desc': 'Pola cuaca tak menentu dan kejadian ekstrem menghancurkan hasil panen, menyebabkan kerugian miliaran dolar setiap tahun.',
    'landing.problem.c2.title': 'Gangguan Rantai Pasokan',
    'landing.problem.c2.desc': 'Konflik geopolitik dan masalah logistik memutus rute perdagangan pangan, memicu kelangkaan regional.',
    'landing.problem.c3.title': 'Fragmentasi Data',
    'landing.problem.c3.desc': 'Data penting terpencar di berbagai organisasi. Tanpa intelijen terpadu, pembuat kebijakan hanya bisa merespons secara reaktif.',
    
    'landing.impact.title': 'Dampak & Hasil Kami',
    'landing.impact.subtitle': 'AgriShield AI memanfaatkan Machine Learning dan data FAO untuk memberikan akurasi prediksi risiko pertanian yang tak tertandingi.',
    'landing.impact.l1.title': 'Akurasi Prediksi 95%',
    'landing.impact.l1.desc': 'Model Random Forest kami mencapai akurasi terdepan dalam memprakirakan volatilitas produksi pangan.',
    'landing.impact.l2.title': 'Pemantauan 50+ Negara',
    'landing.impact.l2.desc': 'Pelacakan indeks ketahanan pangan secara real-time di seluruh produsen pertanian utama dunia.',
    'landing.impact.l3.title': 'Rekomendasi AI Terukur',
    'landing.impact.l3.desc': 'Integrasi LLM Gemini otomatis memberikan saran kebijakan berdasarkan anomali data.',
    'landing.impact.s1.val': '3 Juta+',
    'landing.impact.s1.lbl': 'Titik Data Dianalisis',
    'landing.impact.s2.val': 'Tier 1',
    'landing.impact.s2.lbl': 'Integrasi Data FAO',
    
    'landing.footer.title': 'Siap mengamankan masa depan?',
    'landing.footer.btn': 'Buat Akun Gratis',

    'landing.card.alert': 'Peringatan Risiko Global',
    'landing.card.alertTitle': 'Krisis Gandum Diprediksi',
    'landing.card.critical': 'Tingkat Kritis',
    'landing.card.reco': 'Rekomendasi AI',
    'landing.card.recoTitle': 'Tingkatkan Cadangan',
    'landing.card.confidence': 'Tingkat Keyakinan'
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
    return translations[lang][key] || translations['en'][key] || key;
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
