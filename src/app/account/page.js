// src/app/account/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsername, getEmail, updateUsernameAndEmail, updatePassword } from '../actions';
import { NavBar } from '../../../Components/NavBar';
import styles from '../Styles/account.module.css';

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [activeChange, setActiveChange] = useState(null);
  const [password, setPassword] = useState('');
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isChanging, setIsChanging] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    console.log('Current user:', user);
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    console.log('Fetching user info for user ID:', user.id);
    const fetchedUsername = await getUsername(user.id);
    const fetchedEmail = await getEmail(user.id);
    console.log('Fetched user info:', { fetchedUsername, fetchedEmail });
    setUsername(fetchedUsername);
    setEmail(fetchedEmail);
  };

  const handleChangeClick = (type) => {
    console.log('Change clicked:', type);
    setActiveChange(type);
    resetForm();
    console.log('Active change set to:', type);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log('Password submit initiated');
    setIsChanging(true);
    try {
      console.log('Sending password verification request for user:', user.id);
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, password }),
      });
      console.log('Password verification response status:', response.status);
      const data = await response.json();
      console.log('Password verification response data:', data);
      if (data.isValid) {
        console.log('Password verified successfully');
        setIsPasswordVerified(true);
        setPassword('');
      } else {
        console.log('Password verification failed');
        setMessage({ type: 'error', content: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setMessage({ type: 'error', content: 'Error verifying password' });
    } finally {
      setIsChanging(false);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    console.log('Change initiated for:', activeChange);
    setIsChanging(true);
    setMessage({ type: '', content: '' });
  
    try {
      let result;
      switch (activeChange) {
        case 'username':
          result = await updateUsernameAndEmail(user.id, newValue, email);
          break;
        case 'email':
          result = await updateUsernameAndEmail(user.id, username, newValue);
          break;
        case 'password':
          result = await updatePassword(user.id, newValue);
          break;
      }
      console.log('Update result:', result);
      if (result) {
        updateUser({ ...user, username: result });
        resetForm();
        setMessage({ type: 'success', content: `${activeChange} updated successfully` });
      } else {
        setMessage({ type: 'error', content: 'Failed to update. Please try again.' });
      }
    } catch (error) {
      console.error('Error updating:', error);
      setMessage({ type: 'error', content: `An error occurred: ${error.message}` });
    } finally {
      setIsChanging(false);
    }
  };

  const resetForm = () => {
    setActiveChange(null);
    setPassword('');
    setNewValue('');
    setMessage({ type: '', content: '' });
    setIsPasswordVerified(false);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentArea}>
        <div className={styles.accountContainer}>
          <div className={styles.header}>
            <h1 className={styles.username}>{username}</h1>
            <p className={styles.email}>{email}</p>
          </div>
          
          {!activeChange && (
            <div className={styles.buttonContainer}>
              <button onClick={() => handleChangeClick('username')} className={styles.changeButton}>Change Username</button>
              <button onClick={() => handleChangeClick('email')} className={styles.changeButton}>Change Email</button>
              <button onClick={() => handleChangeClick('password')} className={styles.changeButton}>Change Password</button>
            </div>
          )}

          {activeChange && !isPasswordVerified && (
            <form onSubmit={(e) => {
              console.log('Password verification form submitted');
              handlePasswordSubmit(e);
            }} className={styles.form}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                className={styles.input}
              />
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton} disabled={isChanging}>
                  {isChanging ? 'Verifying...' : 'Verify'}
                </button>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          )}

          {activeChange && isPasswordVerified && (
            <form onSubmit={handleChange} className={styles.form}>
              <input
                type={activeChange === 'password' ? 'password' : 'text'}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter new ${activeChange}`}
                className={styles.input}
              />
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton} disabled={isChanging}>
                  {isChanging ? 'Changing...' : 'Change'}
                </button>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          )}

          {message.content && (
            <p className={`${styles.message} ${styles[message.type]}`}>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}