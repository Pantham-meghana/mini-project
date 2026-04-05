// src/pages/PublicSurvey.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';

export default function PublicSurvey() {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    publicAPI.getSurvey(publicId)
      .then(r => {
        setSurvey(r.data);
        // Initialize answers map
        const init = {};
        r.data.questions.forEach(q => { init[q.id] = ''; });
        setAnswers(init);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [publicId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    for (const q of survey.questions) {
      if (q.required && !answers[q.id]?.trim()) {
        setError(`Please answer: "${q.text}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await publicAPI.submitResponse(publicId, { answers });
      navigate('/survey/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading survey...</div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-white mb-2">Survey Not Found</h1>
        <p className="text-slate-400 text-sm">This survey doesn't exist or is no longer available.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Survey header */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
          {survey.description && (
            <p className="text-slate-400 mt-2">{survey.description}</p>
          )}
          <p className="text-slate-500 text-xs mt-4">{survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {survey.questions.map((q, i) => (
            <div key={q.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-indigo-400 font-semibold text-sm flex-shrink-0 mt-0.5">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {q.text}
                    {q.required && <span className="text-red-400 ml-1">*</span>}
                  </p>
                </div>
              </div>

              {q.questionType === 'TEXT' ? (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Your answer..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5
                    text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none text-sm"
                />
              ) : (
                <div className="space-y-2 ml-5">
                  {q.options.map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={String(opt.id)}
                        checked={answers[q.id] === String(opt.id)}
                        onChange={() => setAnswers(a => ({ ...a, [q.id]: String(opt.id) }))}
                        className="text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
                      />
                      <span className="text-slate-300 text-sm group-hover:text-white transition">{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit" disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs pb-6">Powered by SurveyFlow</p>
      </div>
    </div>
  );
}
