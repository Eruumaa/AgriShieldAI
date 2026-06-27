import { useLanguage } from '../../contexts/LanguageContext';

const categoryMap = {
  'Critical': 'critical',
  'High Risk': 'high-risk',
  'Medium': 'medium',
  'Safe': 'safe',
  'Very Safe': 'very-safe',
};

const translationKeys = {
  'Critical': 'status.critical',
  'High Risk': 'status.highRisk',
  'Medium': 'status.moderate',
  'Safe': 'status.lowRisk',
  'Very Safe': 'status.safe',
};

export default function RiskBadge({ category }) {
  const { t } = useLanguage();
  const cls = categoryMap[category] || 'safe';
  const label = translationKeys[category] ? t(translationKeys[category]) : category;

  return (
    <span className={`risk-badge ${cls}`}>
      <span className="risk-dot" />
      {label}
    </span>
  );
}

export function getRiskColor(category) {
  const colors = {
    'Critical': '#ef4444',
    'High Risk': '#f97316',
    'Medium': '#f59e0b',
    'Safe': '#22c55e',
    'Very Safe': '#16db93',
  };
  return colors[category] || '#94a3b8';
}

export function getFSRICategory(score) {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High Risk';
  if (score >= 30) return 'Medium';
  if (score >= 20) return 'Safe';
  return 'Very Safe';
}
