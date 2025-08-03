import { useState } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const parseBotResponse = (response) => {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return { type: "structured", data: parsed };
      } catch (err) {
        console.warn("Failed to parse JSON:", err);
      }
    }
    return { type: "text", data: response };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch("https://loving-jaybird-correctly.ngrok-free.app/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const parsed = parseBotResponse(data.response);
      const botMessage = { sender: "bot", ...parsed };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Failed to fetch bot response:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 flex flex-col space-y-4 border border-purple-300">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">💬 AI Content ChatBot</h1>

        <div className="flex-1 overflow-y-auto h-[28rem] bg-gray-50 rounded-xl p-4 space-y-3">
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 max-w-xs md:max-w-md text-sm shadow ${
                    isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 text-white"
                  }`}
                >
                  {msg.sender === "bot" && msg.type === "structured" ? (
                    <div>
                      <p className="mb-1">
                        <strong>📌 Meta:</strong> {msg.data.meta_description}
                      </p>
                      <p className="mb-1">
                        <strong>📝 TL;DR:</strong> {msg.data.tldr}
                      </p>
                      <p className="font-semibold">🏷️ Tags:</p>
                      <ul className="list-disc list-inside">
                        {msg.data.hashtags.map((tag, idx) => (
                          <li key={idx}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>{msg.text || msg.data}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something amazing..."
            className="flex-1 px-4 py-2 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
