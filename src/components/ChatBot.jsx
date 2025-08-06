import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I'm BlogBot, your assistant today. How can I help you find the perfect blog today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseBotResponse = (response) => {
    const { message, title, content, hashtags } = response;

    if (message) return message;

  if (title && content && hashtags) {
    const formatted = `Title: ${title}\n\n${content}\n\nHashtags: ${hashtags}`;
    return { type: "text", data: formatted };
  }

    return "Sorry, I couldn't process the response.";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://social-media-blog-0aw9.onrender.com/api/generate-blog",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }), // Use 'query' as per your working blogbot
        }
      );

      const data = await res.json();
      const botText = parseBotResponse(data.response);

      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: botText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          sender: "bot",
          text: "Oops! Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-screen p-4 bg-white"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <div className="bg-orange-100 p-4 rounded-t-lg">
        <h1 className="text-lg font-bold text-black">BlogBot</h1>
        <p className="text-sm text-black">Your AI Blog Assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto border border-gray-200 p-4 space-y-4 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "user" && (
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2 text-white text-sm">
                U
              </div>
            )}
            <div
              className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-orange-100 text-black"
                  : "bg-orange-100 text-black"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "bot" && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-2 text-white text-sm font-bold">
                A
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 text-white text-sm font-bold">
              A
            </div>
            <div className="bg-orange-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-orange-100 border-t border-gray-200">
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
            disabled={loading}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">Powered by AI</p>
      </div>
    </div>
  );
}
