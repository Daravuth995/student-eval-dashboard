export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_hGdyYmWukTCzaZoxuKMv34mYpQMXd7JtSFzpMpRjGd947eM70u-a1xTUJYA894FwAQ/exec';
export const POINTS_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzRktKyql2I_FbPESNRpCrFDlse-qNd9_Opv9si-g-j2lcanOUPP49IzcyA59lFqVycdA/exec';

export const SAMPLE_HISTORY = [
  { date: '2024-01', overallScore: 7.2, pronunciation: 7.0, intonation: 6.8, communication: 7.5, participation: 7.5, risingFalling: 7.0, linkingSounds: 7.0 },
  { date: '2024-02', overallScore: 7.8, pronunciation: 7.5, intonation: 7.2, communication: 8.0, participation: 8.5, risingFalling: 7.5, linkingSounds: 7.5 },
  { date: '2024-03', overallScore: 8.1, pronunciation: 8.0, intonation: 7.8, communication: 8.5, participation: 8.2, risingFalling: 8.0, linkingSounds: 8.0 },
  { date: '2024-04', overallScore: 8.6, pronunciation: 9.0, intonation: 8.0, communication: 9.2, participation: 8.0, risingFalling: 8.5, linkingSounds: 8.5 },
];

export const SCORE_COLORS = {
  excellent: '#34d399',
  good: '#ff6b2b',
  poor: '#f87171',
};

export function getScoreClass(score) {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  return 'poor';
}

export function getScoreColor(score) {
  return SCORE_COLORS[getScoreClass(score)];
}

export function getScoreGradient(score) {
  if (score >= 8) return 'linear-gradient(135deg, #34d399, #10b981)';
  if (score >= 6) return 'linear-gradient(135deg, #ff6b2b, #f97316)';
  return 'linear-gradient(135deg, #f87171, #ef4444)';
}
