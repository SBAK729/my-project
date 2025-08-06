import { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm BlogBot, your assistant today. How can I help you find the perfect blog today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseBotResponse = (response) => {
    const { meta_description, tldr, hashtags } = response;

    if (meta_description && tldr && hashtags) {
      return {
        type: "structured",
        data: {
          meta_description,
          tldr,
          hashtags: hashtags.split(/\s+/),
        },
      };
    }

    return {
      type: "text",
      data: response.message || "I'm not sure how to respond to that.",
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://social-media-blog-0aw9.onrender.com/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const result = await res.json();
      const parsed = parseBotResponse(result.response);

      const botMessage = {
        sender: "bot",
        type: parsed.type,
        data: parsed.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative w-full max-w-md h-full bg-white flex flex-col">
        {/* Header */}
        <div className="bg-orange-100 px-6 py-4 border-b border-orange-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">BlogBot</h2>
            <p className="text-sm text-black">Your AI Blog Assistant</p>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";

            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {isUser && (
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isUser ? "bg-orange-100 text-black" : "bg-orange-100 text-black"
                  }`}
                >
                  {msg.sender === "bot" && msg.type === "structured" ? (
                    <div>
                      <p className="mb-1"><strong>📌 Meta:</strong> {msg.data.meta_description}</p>
                      <p className="mb-1"><strong>📝 TL;DR:</strong> {msg.data.tldr}</p>
                      <p className="font-semibold">🏷️ Tags:</p>
                      <ul className="list-disc list-inside">
                        {msg.data.hashtags.map((tag, idx) => (
                          <li key={idx}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text || msg.data}</p>
                  )}
                </div>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="bg-orange-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-orange-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Powered by AI</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
