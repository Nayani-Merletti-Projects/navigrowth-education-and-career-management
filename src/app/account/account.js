/*"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPassword, updateUsernameAndEmail, updatePassword } from '../actions';
import styles from '../Styles/account.module.css';

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [username, setUsernameState] = useState('');
  const [email, setEmailState] = useState('');
  const [activeChange, setActiveChange] = useState(null);
  const [password, setPassword] = useState('');
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    if (user && user.username) {
      const [name, emailPart] = user.username.split('|');
      setUsernameState(name); 
      setEmailState(emailPart);
    }
  }, [user]);

  const handleChangeClick = (type) => {
    setActiveChange(type);
    setPassword('');
    setNewValue('');
    setError('');
    setSuccessMessage('');
    setIsPasswordVerified(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsChanging(true);
    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, password }),
      });

      const data = await response.json();

      if (data.isValid) {
        setIsPasswordVerified(true);
        setPassword('');
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Error verifying password');
    } finally {
      setIsChanging(false);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setIsChanging(true);
    setError('');
    setSuccessMessage('');
  
    try {
      let result;
      switch (activeChange) {
        case 'username':
          result = await updateUsernameAndEmail(user.id, newValue, null); // Pass null for email to keep it unchanged
          if (result) {
            const [updatedUsername, updatedEmail] = result.split('|');
            setUsernameState(updatedUsername);
            updateUser({ ...user, username: result });
            setSuccessMessage('Username updated successfully');
          }
          break;
        case 'email':
          result = await updateUsernameAndEmail(user.id, username, newValue);
          if (result) {
            const [updatedUsername, updatedEmail] = result.split('|');
            setEmailState(updatedEmail);
            updateUser({ ...user, username: result });
            setSuccessMessage('Email updated successfully');
          }
          break;
        case 'password':
          result = await updatePassword(user.id, newValue);
          if (result) {
            setSuccessMessage('Password updated successfully');
          }
          break;
      }
  
      if (result) {
        resetState();
      } else {
        setError('Failed to update. Please try again.');
      }
    } catch (error) {
      console.error('Error updating:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  const resetState = () => {
    setActiveChange(null);
    setPassword('');
    setNewValue('');
    setError('');
    setIsPasswordVerified(false);
  };

  const handleCancel = () => {
    resetState();
  };

  return (
    <div className={styles.accountContainer}>
      <h1 className={styles.username}>{username}</h1>
      
      {!activeChange && (
        <div className={styles.buttonContainer}>
          <button onClick={() => handleChangeClick('username')} className={styles.changeButton}>Change Username</button>
          <button onClick={() => handleChangeClick('password')} className={styles.changeButton}>Change Password</button>
          <button onClick={() => handleChangeClick('email')} className={styles.changeButton}>Change Email</button>
        </div>
      )}

      {activeChange && !isPasswordVerified && (
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
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
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
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
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </div>
  );
}*/