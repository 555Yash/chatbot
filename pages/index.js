import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      setMessages((prev) => [...prev, { sender: 'bot', text: data.response || 'No response from bot.' }]);
    } catch (err) {
      console.error('Error:', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'An error occurred. Please try again.' }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chatbot</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
              color: msg.sender === 'user' ? '#fff' : '#000',
              borderTopRightRadius: msg.sender === 'user' ? 0 : 12,
              borderTopLeftRadius: msg.sender === 'user' ? 12 : 0,
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ ...styles.message, opacity: 0.6 }}>Bot is typing...</div>}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    backgroundColor: '#ffffff',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.8rem',
    color: '#333',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    height: '400px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1rem',
    backgroundColor: '#fafafa',
  },
  message: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '1rem',
    lineHeight: '1.4',
    transition: 'all 0.3s',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
