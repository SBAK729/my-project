// src/App.jsx
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <div className="min-h-screen w-24 flex justify-center align-center bg-gray-100">
      <h1 className="text-center text-3xl font-bold p-6">AI Chatbot</h1>
      <ChatBot />
    </div>
  );
}

export default App;
