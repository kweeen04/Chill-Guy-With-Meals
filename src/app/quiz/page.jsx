
"use client"
import React from 'react';
import FormPage from './formPage';
import { useState } from 'react';
const GoalComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages([...messages, { text: input, sender: "user" }, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...messages, { text: input, sender: "user" }, { text: "Sorry, an error occurred.", sender: "bot" }])
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "90vh" }}>
      <div 
      style={{ flex: 1, overflowY: "auto", padding: "1rem" }}
      className=''
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "0.5rem",
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: message.sender === "user" ? "#BEDBFF" : "#E5E5EA",
              padding: "0.5rem",
              borderRadius: "8px",
              maxWidth: "70%",
            }}
            className={``}
          >
            {message.text}
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
      <div style={{ padding: "1rem", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem", marginRight: "0.5rem", borderRadius: "4px" }}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          className='border-1'
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>)
};

export default GoalComponent;
