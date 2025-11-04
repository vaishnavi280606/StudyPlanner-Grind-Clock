import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isDarkMode: boolean;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function callGemini(userMessage: string, retryCount = 0): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      console.error('No API key found');
      return "API key is missing. Please check your .env file.";
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful AI study assistant for students. Help with math, science, programming, and study tips. Provide clear, concise explanations.\n\nStudent question: ${userMessage}`
            }
          ]
        }
      ]
    };

    console.log('Making request to:', GEMINI_URL);
    console.log('API Key present:', !!GEMINI_API_KEY);

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('Parsed Error:', errorData);
      
      if (response.status === 400) {
        return `API Error: ${errorData.error?.message || 'Bad request. The API key might be invalid or restricted.'}`;
      }
      if (response.status === 403) {
        return 'API Error: Access denied. Please check your API key permissions at https://aistudio.google.com/app/apikey';
      }
      if (response.status === 404) {
        return 'API Error: Model not found. Your API key may not have access to this model.';
      }
      if (response.status === 429) {
        // Rate limit - retry with exponential backoff
        if (retryCount < 3) {
          const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Rate limited. Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return callGemini(userMessage, retryCount + 1);
        }
        return '⚠️ Rate limit exceeded. The free tier of Gemini API has limited requests per minute.\n\nPlease wait a moment and try again, or:\n• Upgrade your API key at https://aistudio.google.com/\n• Wait 60 seconds before sending another message';
      }
      
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('Success! Got response');
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    console.error('Unexpected response structure:', data);
    throw new Error('No response text in data');
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export function AIChatbot({ isDarkMode }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your AI study assistant. 🤖\n\nAsk me about:\n• Math, Science, Programming\n• Study tips and techniques\n• Explaining concepts\n\nHow can I help you today?",
    timestamp: new Date()
  };
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await callGemini(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 ${
          isDarkMode
            ? 'bg-gradient-to-br from-blue-600 to-purple-600'
            : 'bg-gradient-to-br from-blue-500 to-purple-500'
        }`}
        title="AI Study Assistant"
      >
        <Bot className="text-white" size={24} />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl rounded-2xl flex flex-col z-50 transition-all ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b rounded-t-2xl ${
          isDarkMode
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-slate-700'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Bot className="text-white" size={20} />
          <div>
            <h3 className="text-white font-semibold text-sm">AI Study Assistant</h3>
            <p className="text-white/80 text-xs">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="text-white/80 hover:text-white transition-colors"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-slate-700 text-slate-100'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600/30">
                      <Bot size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      <span className="text-xs font-medium opacity-75">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <Bot size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-50 text-slate-900 placeholder-slate-500'
                } disabled:opacity-50`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Press Enter to send • Powered by Google Gemini AI
              {isLoading && <span className="ml-2">⏳ Thinking...</span>}
            </p>
          </div>
    </div>
  );
}
