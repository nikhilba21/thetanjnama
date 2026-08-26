'use client';
import { useEffect, useState } from 'react';

type PollQuestion = {
  id: string;
  question: string;
  options: string[];
  active: boolean;
};

export default function AajKaSawalWidget() {
  const [poll, setPoll] = useState<PollQuestion | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userOpinion, setUserOpinion] = useState<string>('');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPollData();
  }, []);

  async function loadPollData() {
    try {
      const res = await fetch('/api/poll');
      if (res.ok) {
        const data = await res.json();
        if (data.poll && data.poll.active) {
          setPoll(data.poll);
          setResults(data.results || {});
          setTotalVotes(data.totalVotes || 0);
        }
      }
    } catch (e) {
      console.warn('Poll fetch error');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || !poll) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poll_id: poll.id,
          selected_option: selectedOption,
          user_name: userName,
          user_opinion: userOpinion
        })
      });

      if (res.ok) {
        setSubmitted(true);
        loadPollData();
      }
    } catch (e) {
      alert('जवाब भेजने में त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  if (!poll) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', marginBottom: '14px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
          ❓ आज का सवाल
        </h3>
        <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '2px', fontWeight: 800, textTransform: 'uppercase' }}>
          LIVE POLL
        </span>
      </div>

      <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: '1.4', marginBottom: '16px' }}>
        {poll.question}
      </p>

      {submitted ? (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✅ आपका जवाब दर्ज कर लिया गया है, धन्यवाद!
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            जनता की राय का परिणाम ({totalVotes} वोट):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {poll.options.map((opt) => {
              const votes = results[opt] || 0;
              const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              return (
                <div key={opt}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#000', marginBottom: '3px' }}>
                    <span>{opt}</span>
                    <strong>{percent}% ({votes})</strong>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {poll.options.map((option) => (
              <label
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: selectedOption === option ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                  background: selectedOption === option ? '#fdf2f2' : '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="poll_option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  style={{ accentColor: 'var(--primary)' }}
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="आपका नाम (ऑप्शनल)..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <textarea
              rows={2}
              placeholder="आपकी राय या टिप्पणी (ऑप्शनल)..."
              value={userOpinion}
              onChange={(e) => setUserOpinion(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedOption || submitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              opacity: selectedOption ? 1 : 0.6,
              cursor: selectedOption ? 'pointer' : 'not-allowed'
            }}
          >
            {submitting ? 'दर्ज किया जा रहा है...' : 'अपना जवाब सबमिट करें'}
          </button>
        </form>
      )}
    </div>
  );
}
