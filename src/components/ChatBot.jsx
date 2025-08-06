import { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      // call your API
      const res = await fetch("https://social-media-blog-0aw9.onrender.com/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.response || "No response", sender: "bot" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <h1>BlogBot</h1>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              margin: "0.5rem 0",
              background: m.sender === "user" ? "#e0f7fa" : "#f1f8e9",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
