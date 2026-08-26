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

  // Form Fields State
  const [userName, setUserName] = useState('');
  const [cityDistrict, setCityDistrict] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [userOpinion, setUserOpinion] = useState('');
  const [solutionIdea, setSolutionIdea] = useState('');
  const [publishConsent, setPublishConsent] = useState('हाँ, मेरे नाम के साथ प्रकाशित की जा सकती है।');
  const [mobileNumber, setMobileNumber] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    setErrorMsg('');

    if (!userName.trim() || !cityDistrict.trim() || !selectedOption || !userOpinion.trim() || !publishConsent) {
      setErrorMsg('कृपया सभी अनिवार्य (*) फ़ील्ड भरें।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poll_id: poll?.id,
          user_name: userName,
          city_district: cityDistrict,
          selected_option: selectedOption,
          user_opinion: userOpinion,
          solution_idea: solutionIdea,
          publish_consent: publishConsent,
          mobile_number: mobileNumber
        })
      });

      if (res.ok) {
        setSubmitted(true);
        loadPollData();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'सबमिट करने में त्रुटि हुई।');
      }
    } catch (e) {
      setErrorMsg('नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  if (!poll) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--primary)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
        marginBottom: '28px'
      }}
    >
      {/* HEADER BANNER */}
      <div style={{ background: '#000000', color: '#ffffff', padding: '18px 20px', borderBottom: '3px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
            ❓ जनमत मंच
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>* अनिवार्य फ़ील्ड</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
          आज का सवाल — Tanjnama
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
          सवाल हमारा, आवाज़ आपकी।
        </p>
        <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px', lineHeight: '1.4' }}>
          किसी महत्वपूर्ण सामाजिक, स्थानीय, जनहित या समसामयिक विषय पर अपनी संक्षिप्त और सम्मानजनक राय दें। आपके द्वारा भेजी गई चुनिंदा प्रतिक्रियाएं संपादकीय समीक्षा के बाद Tanjnama पर प्रकाशित की जा सकती हैं।
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {submitted ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
              ✅ आपकी प्रतिक्रिया सफलतापूर्वक दर्ज कर ली गई है!
            </div>
            <p style={{ fontSize: '13px', color: '#334155', marginBottom: '16px' }}>
              Tanjnama की टीम आपकी राय की समीक्षा करेगी। चुनिंदा प्रतिक्रियाओं को मुख्य पृष्ठ पर प्रकाशित किया जाएगा।
            </p>

            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#000', marginBottom: '8px' }}>
                जनता की राय का परिणाम ({totalVotes} वोट):
              </div>
              {poll.options.map((opt) => {
                const votes = results[opt] || 0;
                const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                return (
                  <div key={opt} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#111', marginBottom: '2px' }}>
                      <span>{opt}</span>
                      <strong>{percent}% ({votes})</strong>
                    </div>
                    <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            {/* FIELD 1: NAME */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                1. आपका नाम क्या है? <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="अपना पूरा नाम लिखें..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                required
              />
            </div>

            {/* FIELD 2: CITY / DISTRICT */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                2. आप किस शहर / जिले से हैं? <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="उदा. जयपुर, राजस्थान"
                value={cityDistrict}
                onChange={(e) => setCityDistrict(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                required
              />
            </div>

            {/* FIELD 3: DYNAMIC AAJ KA SAWAL & OPTIONS */}
            <div style={{ marginBottom: '18px', background: '#fdf2f2', padding: '14px', borderRadius: '6px', border: '1px solid #fecaca' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                3. आज का सवाल: "{poll.question}" <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {poll.options.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: selectedOption === option ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      background: selectedOption === option ? '#ffffff' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600
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
            </div>

            {/* FIELD 4: USER OPINION */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>
                4. आज के सवाल पर आपकी राय क्या है? <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                अपने विचार संक्षेप में और सम्मानजनक भाषा में लिखें।
              </span>
              <textarea
                rows={3}
                placeholder="अपनी राय यहाँ विस्तार से लिखें..."
                value={userOpinion}
                onChange={(e) => setUserOpinion(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                required
              />
            </div>

            {/* FIELD 5: SOLUTION IDEA (OPTIONAL) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>
                5. आपकी राय में समाधान क्या है? (ऑप्शनल)
              </label>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                यदि इस विषय से जुड़ी कोई समस्या है, तो आपके अनुसार उसका बेहतर समाधान क्या हो सकता है?
              </span>
              <textarea
                rows={2}
                placeholder="समाधान के लिए आपका सुझाव..."
                value={solutionIdea}
                onChange={(e) => setSolutionIdea(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {/* FIELD 6: PUBLISH CONSENT */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>
                6. क्या आप चाहते हैं कि आपकी राय Tanjnama पर प्रकाशित की जा सकती है? <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'हाँ, मेरे नाम के साथ प्रकाशित की जा सकती है।',
                  'हाँ, लेकिन मेरा नाम प्रकाशित न किया जाए।',
                  'नहीं, मेरी राय प्रकाशित न की जाए।'
                ].map((consentOption) => (
                  <label key={consentOption} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="publish_consent"
                      value={consentOption}
                      checked={publishConsent === consentOption}
                      onChange={(e) => setPublishConsent(e.target.value)}
                      style={{ accentColor: 'var(--primary)' }}
                      required
                    />
                    <span>{consentOption}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FIELD 7: MOBILE NUMBER (OPTIONAL) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>
                7. मोबाइल नंबर (वैकल्पिक)
              </label>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                आवश्यकता पड़ने पर आपसे संपर्क करने के लिए।
              </span>
              <input
                type="tel"
                placeholder="10 अंकों का मोबाइल नंबर..."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {/* DISCLAIMER FOOTER */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginBottom: '16px' }}>
              <strong>महत्वपूर्ण सूचना:</strong> आपके द्वारा भेजी गई प्रतिक्रिया आपकी व्यक्तिगत राय होगी। सभी प्रतिक्रियाओं का प्रकाशित होना आवश्यक नहीं है। Tanjnama द्वारा प्रतिक्रियाओं की संपादकीय समीक्षा के बाद चयनित विचार प्रकाशित किए जा सकते हैं। अभद्र या अपमानजनक सामग्री प्रकाशित नहीं की जाएगी।
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
            >
              {submitting ? 'प्रतिक्रिया भेजी जा रही है...' : 'प्रतिक्रिया सबमिट करें (Submit Response)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
