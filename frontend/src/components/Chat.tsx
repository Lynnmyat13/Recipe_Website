import React, { useState, useRef, useEffect } from "react";
import { api, type ChatRecipe } from "../lib/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  recipes?: ChatRecipe[];
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Recipe Assistant. Ask me for recipes, like 'healthy chicken dinner' or 'quick pasta'!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const response = await api.chat(input);
      
      // Ensure at least 2 seconds of loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        recipes: response.recipes,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-100 max-w-[calc(100vw-2rem)] h-150 max-h-[calc(100vh-8rem)] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-black/5 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-6 bg-charcoal text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-black text-lg leading-tight">Recipe AI</h3>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Always Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-black/5 text-charcoal rounded-tl-none"
                    }`}
                >
                  {msg.text}
                </div>
                {msg.recipes && msg.recipes.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-4 w-full">
                    {msg.recipes.map((recipe, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={recipe.image_url}
                          alt={recipe.recipe_name}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400&h=300";
                          }}
                        />
                        <div className="p-4">
                          <h4 className="font-serif font-black text-charcoal text-sm mb-2 line-clamp-1">{recipe.recipe_name}</h4>
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {recipe.cooking_time_minutes}m
                            </span>
                            <span>{recipe.calories_per_serving} kcal</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black/5 p-4 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-charcoal/20 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-charcoal/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-charcoal/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-white border-t border-black/5 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a recipe..."
              className="flex-1 bg-black/5 rounded-full px-6 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center hover:bg-primary disabled:opacity-50 disabled:hover:bg-charcoal transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
