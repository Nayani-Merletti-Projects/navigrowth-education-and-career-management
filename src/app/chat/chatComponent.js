// ChatComponent.js
"use client";

import { useState, useRef, useEffect } from "react";
import "../Styles/chat.css";

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, user: true }]);
      // Here you would typically call an API to get the AI response
      // For this example, we'll just echo the user's message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `You said: ${input}`, user: false },
        ]);
      }, 1000);
      setInput("");
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user ? "userMessage" : "aiMessage"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          rows="1"
        />
        <div className="buttonGroup">
          <button type="submit" className="sendButton">
            Send
          </button>
          <button type="button" onClick={handleClear} className="clearButton">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
