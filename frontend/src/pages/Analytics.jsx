// src/pages/Analytics.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { ArrowLeft, Users, BarChart2 } from 'lucide-react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#10b981','#f59e0b',
  '#3b82f6','#ef4444','#14b8a6','#f97316','#84cc16',
];

function MCQChart({ question }) {
  const labels = question.optionCounts.map(o => o.optionText);
  const data = question.optionCounts.map(o => o.count);
  const total = data.reduce((a, b) => a + b, 0);

  const pieData = {
    labels,
    datasets: [{ data, backgroundColor: COLORS.slice(0, labels.length), borderWidth: 0 }],
  };
  const barData = {
    labels,
    datasets: [{
      label: 'Responses',
      data,
      backgroundColor: COLORS.slice(0, labels.length),
      borderRadius: 6,
    }],
  };
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', stepSize: 1 }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Multiple Choice</span>
        <h3 className="text-white font-semibold mt-1">{question.questionText}</h3>
        <p className="text-slate-500 text-sm">{total} responses</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center">
          <div style={{ maxWidth: 220 }}>
            <Pie data={pieData} />
          </div>
        </div>
        <div>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      {/* Option breakdown */}
      <div className="space-y-2 pt-2">
        {question.optionCounts.map((o, i) => (
          <div key={o.optionId} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-sm text-slate-300 flex-1 truncate">{o.optionText}</span>
            <span className="text-sm font-semibold text-white">{o.count}</span>
            <span className="text-xs text-slate-500 w-10 text-right">
              {total > 0 ? Math.round((o.count / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextAnswers({ question }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Text Responses</span>
        <h3 className="text-white font-semibold mt-1">{question.questionText}</h3>
        <p className="text-slate-500 text-sm">{question.textAnswers?.length || 0} responses</p>
      </div>
      {question.textAnswers?.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No text responses yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {question.textAnswers?.map((ans, i) => (
            <div key={i} className="bg-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300">
              {ans}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsAPI.getSurveyAnalytics(id)
      .then(r => setData(r.data))
      .catch(() => setError('Could not load analytics.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-48 animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">{error}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/surveys" className="text-slate-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{data.surveyTitle}</h1>
          <p className="text-slate-400 mt-0.5">Analytics</p>
        </div>
      </div>

      {/* Total responses badge */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Responses</p>
          <p className="text-2xl font-bold text-white">{data.totalResponses}</p>
        </div>
      </div>

      {data.questions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No questions found.</div>
      ) : (
        <div className="space-y-5">
          {data.questions.map(q => (
            q.questionType === 'MCQ'
              ? <MCQChart key={q.questionId} question={q} />
              : <TextAnswers key={q.questionId} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
