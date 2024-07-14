"use client";

import React, { useState, useRef, useEffect } from "react";
import { NavBar } from "../../../Components/NavBar";
import "../global-colors.css";
import styles from "../Styles/Chat.module.css";
import { getChatbotResponse } from '../utils/advancedChatbotLogic';

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { text: input, user: true };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = { text: getChatbotResponse(input), user: false };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentArea}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2 className={styles.chatTitle}>AI Counselor Chat</h2>
          </div>
          <div className={styles.chatWindow} ref={chatWindowRef}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.message} ${message.user ? styles.userMessage : styles.aiMessage}`}>
                {message.text}
              </div>
            ))}
            {isTyping && <div className={styles.typingIndicator}>AI is typing...</div>}
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
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.sendButton}>Send</button>
              <button type="button" onClick={handleClear} className={styles.clearButton}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}