// src/app/chat/page.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { NavBar } from "../../../Components/NavBar";
import "../global-colors.css";
import styles from "../Styles/Chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, user: true }]);
      // Here you would typically call an API to get the AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `You said: ${input}`, user: false },
        ]);
      }, 1000);
      setInput("");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentArea}>
        <div className={styles.chatContainer}>
          <header className={styles.chatHeader}>
            <h1 className={styles.chatTitle}>NaviGrowth AI Chat</h1>
          </header>
          <div className={styles.chatWindow}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.user ? styles.userMessage : styles.aiMessage
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
