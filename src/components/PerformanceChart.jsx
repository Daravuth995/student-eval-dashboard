import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PerformanceChart({ history }) {
  if (!history || history.length === 0) return null;

  const labels = history.map(h => {
    const [year, month] = (h.date || '').split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleString('default', { month: 'short', year: '2-digit' });
  });

  const datasets = [
    { label: 'Overall', data: history.map(h => h.overallScore), borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.08)', tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 7 },
    { label: 'Pronunciation', data: history.map(h => h.pronunciation), borderColor: '#ff6b2b', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 1.5 },
    { label: 'Communication', data: history.map(h => h.communication), borderColor: '#34d399', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 1.5 },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255,255,255,0.4)',
          font: { family: 'Space Mono', size: 10 },
          boxWidth: 12,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#161626',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.7)',
        bodyColor: 'rgba(255,255,255,0.5)',
        titleFont: { family: 'Syne', size: 11 },
        bodyFont: { family: 'Space Mono', size: 10 },
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'Space Mono', size: 9 } },
        border: { color: 'transparent' },
      },
      y: {
        min: 0, max: 10,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'Space Mono', size: 9 }, stepSize: 2 },
        border: { color: 'transparent' },
      }
    }
  };

  return (
    <motion.div
      className="rounded-2xl border p-5 mb-4"
      style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/25 mb-4 flex items-center gap-3">
        Performance History
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
      </div>
      <div style={{ height: 220 }}>
        <Line data={{ labels, datasets }} options={options} />
      </div>
    </motion.div>
  );
}
