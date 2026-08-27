'use client';
import { useState } from 'react';

export default function CitizenJournalismForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    city_district: '',
    news_type: 'खबर',
    title: '',
    location: '',
    description: '',
    has_media: 'नहीं',
    is_original_permission: 'हाँ',
    source_info: '',
    declaration_consent: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.declaration_consent) {
      setErrorMsg('कृपया घोषणा एवं सहमति चेकबॉक्स को स्वीकार करें।');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/citizen-journalism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedId(data.id || `CJ-${Date.now()}`);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'सबमिशन में त्रुटि आई। पुनः प्रयास करें।');
      }
    } catch (e) {
      setErrorMsg('सर्वर नेटवर्क में समस्या आई। कृपया थोड़ी देर बाद प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div
        id="submission-success-box"
        style={{
          background: '#f0fdf4',
          border: '2px solid #16a34a',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          marginTop: '24px'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
        <h3 style={{ fontSize: '24px', color: '#166534', fontWeight: 800, marginBottom: '8px' }}>
          आपकी खबर सफलतापूर्वक प्राप्त हो गई है!
        </h3>
        <p style={{ fontSize: '15px', color: '#15803d', lineHeight: '1.6', marginBottom: '16px' }}>
          आपकी नागरिक पत्रकारिता रिपोर्ट तंजनामा संपादकीय टीम को भेज दी गई है। संपादकीय परीक्षण व तथ्य-जांच के बाद इसे प्रकाशित किया जाएगा।
        </p>
        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'inline-block', fontSize: '13px', color: '#166534', fontWeight: 700 }}>
          रेफरेंस आईडी: {submittedId}
        </div>
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => {
              setSubmittedId(null);
              setFormData({
                full_name: '',
                mobile_number: '',
                email: '',
                city_district: '',
                news_type: 'खबर',
                title: '',
                location: '',
                description: '',
                has_media: 'नहीं',
                is_original_permission: 'हाँ',
                source_info: '',
                declaration_consent: true
              });
            }}
            className="btn-primary"
            style={{ background: '#166534', border: 'none' }}
          >
            ➕ दूसरी खबर / लेख भेजें
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        marginTop: '28px'
      }}
    >
      <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '14px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--dark-bg)' }}>
          📰 नागरिक पत्रकारिता आवेदन फॉर्म
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          कृपया केवल सही और सत्यापित जानकारी भरें। लाल स्टार (<strong>*</strong>) वाले प्रश्न अनिवार्य हैं।
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            आपका पूरा नाम <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="जैसे: राहुल शर्मा"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            मोबाइल नंबर <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="10 अंकों का नंबर..."
            value={formData.mobile_number}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            ई-मेल आईडी (Email Address)
          </label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            आपका शहर / जिला <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            name="city_district"
            placeholder="जैसे: जयपुर, राजस्थान"
            value={formData.city_district}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          खबर का प्रकार <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <select
          name="news_type"
          value={formData.news_type}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
        >
          <option value="खबर">खबर</option>
          <option value="नागरिक समस्या">नागरिक समस्या</option>
          <option value="नागरिक लेख">नागरिक लेख</option>
          <option value="सकारात्मक / प्रेरणादायक खबर">सकारात्मक / प्रेरणादायक खबर</option>
          <option value="अन्य">अन्य</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          खबर / लेख का शीर्षक <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="संक्षिप्त आकर्षक शीर्षक लिखें..."
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          घटना / समस्या का स्थान <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          type="text"
          name="location"
          placeholder="स्थान, वार्ड, गाँव या लैंडमार्क..."
          value={formData.location}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          खबर / लेख का पूरा विवरण <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <textarea
          name="description"
          rows={5}
          placeholder="घटना या समस्या का पूरा ब्यौरा यहाँ विस्तार से लिखें..."
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            क्या आपके पास फोटो, वीडियो या दस्तावेज़ हैं?
          </label>
          <select
            name="has_media"
            value={formData.has_media}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
          >
            <option value="हाँ">हाँ</option>
            <option value="नहीं">नहीं</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight 700, color: '#334155', marginBottom: '6px' }}>
            क्या यह आपके द्वारा बनाया गया है या साझा करने की अनुमति है? <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            name="is_original_permission"
            value={formData.is_original_permission}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
          >
            <option value="हाँ">हाँ</option>
            <option value="नहीं">नहीं</option>
            <option value="लागू नहीं">लागू नहीं</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          इस जानकारी का स्रोत क्या है? (ऑप्शनल)
        </label>
        <input
          type="text"
          name="source_info"
          placeholder="प्रत्यक्षदर्शी, सोशल मीडिया, आधिकारिक विज्ञप्ति आदि..."
          value={formData.source_info}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      {/* CONSENT DECLARATION BOX */}
      <div style={{ background: '#fdf2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '20px' }}>
        <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="declaration_consent"
            checked={formData.declaration_consent}
            onChange={handleChange}
            style={{ marginTop: '3px', width: '18px', height: '18px' }}
          />
          <span style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.5' }}>
            <strong>महत्वपूर्ण घोषणा एवं सहमति:</strong> मैं घोषणा करता/करती हूँ कि मेरे द्वारा दी गई जानकारी मेरी जानकारी के अनुसार सही है। मैं समझता/समझती हूँ कि TANJNAMA सामग्री की संपादकीय समीक्षा और तथ्य-जाँच के बाद ही उसे प्रकाशित करने का निर्णय लेगा।
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700, borderRadius: '8px' }}
      >
        {submitting ? '⏳ सबमिट किया जा रहा है...' : '✉️ खबर / लेख सबमिट करें (Submit Report)'}
      </button>
    </form>
  );
}
