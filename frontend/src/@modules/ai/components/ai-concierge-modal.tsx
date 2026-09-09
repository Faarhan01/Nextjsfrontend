'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, ArrowRight, ShoppingBag, RefreshCw, MessageSquare } from 'lucide-react';
import { MockProduct, CartItem } from '@/types';
import SafeImage from '@modules/common/components/safe-image';
import { sdk } from '@lib/sdk';

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogProducts: MockProduct[];
  cartItems: CartItem[];
  onSelectProduct: (product: MockProduct) => void;
  onAddToCart: (product: MockProduct) => void;
  currentThemeBg: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  recommendedProducts?: MockProduct[];
  followUpSuggestions?: string[];
  timestamp: string;
}

export default function AiConciergeModal({
  isOpen,
  onClose,
  catalogProducts,
  cartItems,
  onSelectProduct,
  onAddToCart,
  currentThemeBg
}: AiConciergeModalProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'concierge',
      text: "Hello! I'm your AI Shopping Concierge & Personal Stylist. How can I help you today? Ask me for style advice, product recommendations, or details on any items in our store!",
      followUpSuggestions: [
        "What are the best-selling minimalist items?",
        "Recommend furniture for a home office setup",
        "Suggest a gift under $100"
      ],
      timestamp: 'Just now'
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome-1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const data = await sdk.ai.concierge({
        query: textToSend,
        catalogProducts,
        cartItems,
        history
      });

      if (data && data.success && data.data) {
        const reply = data.data.reply || "I couldn't find a direct match, but I'm happy to help you browse our full collection!";
        const recommendedIds: string[] = data.data.recommendedProductIds || [];
        const matchedProducts = catalogProducts.filter(p =>
          recommendedIds.includes(String(p.id)) ||
          recommendedIds.includes(p.name) ||
          reply.toLowerCase().includes(p.name.toLowerCase())
        ).slice(0, 3);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'concierge',
          text: reply,
          recommendedProducts: matchedProducts,
          followUpSuggestions: data.data.followUpSuggestions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Concierge service returned an empty response');
      }
    } catch (err: any) {
      // Fallback local smart response
      const matched = catalogProducts.filter(p => 
        p.name.toLowerCase().includes(textToSend.toLowerCase()) || 
        p.description?.toLowerCase().includes(textToSend.toLowerCase())
      ).slice(0, 3);

      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'concierge',
        text: matched.length > 0 
          ? `Here are some great options matching "${textToSend}" from our catalog:` 
          : `I've analyzed our catalog! Explore our top featured items below or try asking about specific furniture, decor, or accessories.`,
        recommendedProducts: matched.length > 0 ? matched : catalogProducts.slice(0, 2),
        followUpSuggestions: [
          "Show me new arrivals",
          "What products are on sale?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl h-[85vh] max-h-[700px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                AI Shopping Concierge <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold border border-blue-400/30">Gemini Powered</span>
              </h3>
              <p className="text-[11px] text-slate-300">Personalized styling advice & instant store assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'concierge' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs border border-slate-800 dark:border-slate-700">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[80%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? `${currentThemeBg} text-white font-medium rounded-tr-none shadow-xs`
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Recommended products card attachment */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {msg.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-xs hover:border-blue-500 dark:hover:border-blue-400 transition group cursor-pointer"
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                      >
                        <SafeImage
                          src={prod.imageUrl || (prod as any).img}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0"
                          placeholderType="product"
                          fallbackTitle={prod.name}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{prod.name}</h4>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{prod.price}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(prod);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.followUpSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold rounded-full transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <ArrowRight className="w-3 h-3 text-blue-500 dark:text-blue-400" /> {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 dark:text-slate-500 block px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-500" /> Concierge is styling recommendations...
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about style advice, items under $100, office setups..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className={`p-3.5 rounded-2xl text-white font-bold transition disabled:opacity-40 cursor-pointer shadow-sm ${currentThemeBg}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
