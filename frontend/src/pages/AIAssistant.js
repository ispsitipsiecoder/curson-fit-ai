import React, { useState } from 'react';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch(`/gemini-search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch AI response');
      const data = await res.json();
      // Gemini API response structure: data.candidates[0].content.parts[0].text
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      setResponse(aiText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f9f9f9', borderRadius: 8 }}>
      <h2>AI Assistant (Gemini)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask me anything..."
          style={{ width: '80%', padding: '0.5rem', fontSize: '1rem' }}
          required
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: 8 }} disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {response && (
        <div style={{ background: '#fff', padding: '1rem', borderRadius: 4, marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>AI Response:</strong>
          <div>{response}</div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 