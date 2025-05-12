"use client";
import React, { useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        text: "👋 Hey there! I'm your Chill Meal assistant. Let me know your goals or preferences, and I'll help you plan the perfect meals!",
        sender: "bot",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "❌ Sorry, an error occurred.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 p-4 mx-auto max-w-3xl shadow-lg">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words inline-block ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 italic text-sm">Loading...</div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 text-white px-4 py-2 rounded-lg  transition disabled:opacity-50 text-sm cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
