// src/components/QuestionBuilder.jsx
import { Trash2, PlusCircle, GripVertical } from 'lucide-react';

export default function QuestionBuilder({ index, question, onChange, onRemove, canRemove }) {
  const update = (field, value) => onChange({ ...question, [field]: value });

  const updateOption = (i, val) => {
    const opts = [...question.options];
    opts[i] = val;
    update('options', opts);
  };

  const addOption = () => update('options', [...question.options, '']);

  const removeOption = (i) =>
    update('options', question.options.filter((_, idx) => idx !== i));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={question.required}
              onChange={e => update('required', e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Required
          </label>
          {canRemove && (
            <button
              type="button" onClick={onRemove}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Remove question"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Question text */}
      <div>
        <input
          type="text"
          value={question.text}
          onChange={e => update('text', e.target.value)}
          placeholder="Enter your question..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5
            text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Type selector */}
      <div className="flex gap-3">
        {['TEXT', 'MCQ'].map(type => (
          <button
            key={type}
            type="button"
            onClick={() => update('questionType', type)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
              ${question.questionType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
          >
            {type === 'TEXT' ? '✏️ Text' : '☑️ Multiple Choice'}
          </button>
        ))}
      </div>

      {/* MCQ options */}
      {question.questionType === 'MCQ' && (
        <div className="space-y-2 mt-2">
          <p className="text-xs text-slate-500 font-medium">Options</p>
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex-shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                  text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {question.options.length > 2 && (
                <button
                  type="button" onClick={() => removeOption(i)}
                  className="text-slate-600 hover:text-red-400 transition flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button" onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition font-medium mt-1"
          >
            <PlusCircle size={14} /> Add option
          </button>
        </div>
      )}
    </div>
  );
}
