import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// The prompt gives the AI context about what dashboard it is helping with.
const SYSTEM_INSTRUCTION = `You are the AgriShield AI assistant. You help users navigate a Food Security Business Intelligence Dashboard. 
The dashboard provides FSRI (Food Security Risk Index) predictions, ML insights (using LightGBM), commodity analytics, and AI recommendations.

CRITICAL RULES:
1. You must ONLY answer questions directly related to AgriShield AI, food security, agricultural analytics, FSRI data, commodities, or navigating this dashboard.
2. If the user asks a question, requests general code (such as LeetCode two-sum, web dev, etc.), or requests any information that is outside of this scope, you must politely but firmly refuse to answer. Response: "Maaf, sebagai asisten AgriShield AI, saya hanya dapat menjawab pertanyaan yang berkaitan dengan ketahanan pangan, analisis komoditas, dan penggunaan dashboard ini." (or in English if the user asked in English).
3. Keep your answers professional, concise, and helpful. Format your responses with markdown.`;

export default function GeminiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the AgriShield AI assistant. How can I help you analyze food security data today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Initialize chat session on mount
  useEffect(() => {
    if (genAI && !chatSession) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        setChatSession(model.startChat({ history: [] }));
      } catch (error) {
        console.error("Failed to initialize Gemini:", error);
      }
    }
  }, [chatSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    if (!API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '⚠️ **API Key Missing**: Please add your `VITE_GEMINI_API_KEY` to the `.env` file to enable the AI assistant.' 
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      if (!chatSession) throw new Error("Chat session not initialized");
      
      const result = await chatSession.sendMessage(userMessage);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: **${error.message}**` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="chat-fab"
        title="Open AgriShield AI Assistant"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`chat-widget ${isExpanded ? 'expanded' : ''}`}>
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="chat-avatar">
            <img src="/logo.svg" alt="AI" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.2 }}>AgriShield Assistant</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              Online
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setIsExpanded(!isExpanded)} className="chat-action-btn">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="chat-action-btn">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message-wrapper ${msg.role}`}>
            <div className={`chat-message ${msg.role}`}>
              {msg.role === 'assistant' ? (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message-wrapper assistant">
            <div className="chat-message assistant" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={14} className="spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about the dashboard..."
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading} className="chat-send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
