"use client";

import { getTextResponse } from "../api/ai/service";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NavBar } from "../../../Components/NavBar";
import { getGoals, getAllSkills } from "../actions";
import styles from "../Styles/Chat.module.css";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { text: "Welcome to the Career Advisor Chat! How can I assist you today?", user: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const goals = await getGoals(user.id);
      const skills = await getAllSkills(user.id);
      setUserData({ goals, skills });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Some features may be limited.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      setError(null);
      const userMessage = { text: input, user: true };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const context = `You are a smart, real, and helpful career advisor. The user's information is as follows:
          Goals: ${JSON.stringify(userData?.goals || [])}
          Skills: ${JSON.stringify(userData?.skills || [])}
          Chat history: ${JSON.stringify(messages)}
          Please provide tailored advice based on this information and the chat history.`;

        const aiResponse = await getTextResponse(
          { userMessage: input, context },
          "You are a career advisor. Provide helpful, encouraging, and practical advice based on the user's goals, skills, and previous conversation. Be concise but thorough in your responses."
        );

        if (typeof aiResponse !== "string" || aiResponse.trim() === "") {
          throw new Error("Invalid response from AI");
        }

        const aiMessage = { text: aiResponse, user: false };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setError(
          `I'm having trouble connecting to my knowledge base. The error message is: ${error.message}. Please try again or check back later.`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentArea}>
        <div className={styles.chatContainer}>
          <header className={styles.chatHeader}>
            <h1 className={styles.chatTitle}>Career Advisor Chat</h1>
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
            {isLoading && (
              <div
                className={`${styles.message} ${styles.aiMessage} ${styles.loadingMessage}`}
              >
                Thinking...
              </div>
            )}
            {error && (
              <div className={`${styles.message} ${styles.errorMessage}`}>
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}