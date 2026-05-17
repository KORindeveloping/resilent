import { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        message: userMessage.content,
      });

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass flex flex-col h-[70vh] rounded-2xl overflow-hidden">
        <div className="bg-slate-900/50 p-6 border-b border-white/5">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Bot className="text-primary" /> AI Assistant (Gemma3)
          </h2>
          <p className="text-slate-400 text-sm">Powered by self-hosted Ollama</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Bot size={48} className="mb-4 opacity-50" />
              <p>Send a message to start chatting!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-300'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-slate-300 animate-pulse" />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-400 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-400 text-center text-sm bg-red-400/10 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-white/5">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
