"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Styles/settings.module.css';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    // For now, we'll just redirect to the login page
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      
      <div className={styles.settingItem}>
        <label className={styles.label}>
          Dark Mode
          <input 
            type="checkbox" 
            checked={darkMode} 
            onChange={() => setDarkMode(!darkMode)}
            className={styles.checkbox}
          />
        </label>
      </div>

      <div className={styles.settingItem}>
        <label className={styles.label}>
          Email Notifications
          <input 
            type="checkbox" 
            checked={emailNotifications} 
            onChange={() => setEmailNotifications(!emailNotifications)}
            className={styles.checkbox}
          />
        </label>
      </div>

      <div className={styles.settingItem}>
        <label className={styles.label}>
          Language
          <select className={styles.select}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </div>

      <div className={styles.settingItem}>
        <button onClick={() => router.push('/privacy')} className={styles.button}>
          Privacy Policy
        </button>
      </div>

      <div className={styles.settingItem}>
        <button onClick={() => router.push('/terms')} className={styles.button}>
          Terms of Service
        </button>
      </div>

      <div className={styles.settingItem}>
        <button onClick={handleLogout} className={`${styles.button} ${styles.logoutButton}`}>
          Logout
        </button>
      </div>
    </div>
  );
}