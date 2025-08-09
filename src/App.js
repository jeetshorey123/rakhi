import React, { useState } from 'react';
import './App.css';
import { supabase } from './supabase';

function App() {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [yesButtonSize, setYesButtonSize] = useState(100);
  const [yesButtonClicks, setYesButtonClicks] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName.trim()) {
      // Store user login in Supabase
      try {
        const { data, error } = await supabase
          .from('rakhi_users')
          .insert([
            { name: userName, login_time: new Date() }
          ]);
        
        if (error) {
          console.log('Supabase error:', error);
        } else {
          console.log('User logged to Supabase:', data);
        }
      } catch (err) {
        console.log('Error connecting to Supabase:', err);
      }
      
      setIsLoggedIn(true);
    }
  };

  const handleYesHover = async () => {
    // Only reduce size by 10%
    setYesButtonSize(prev => prev * 0.9);
    setYesButtonClicks(prev => prev + 1);
    
    // Log the interaction to Supabase
    try {
      const { data, error } = await supabase
        .from('rakhi_interactions')
        .insert([
          { 
            user_name: userName, 
            action: 'yes_button_hover',
            click_count: yesButtonClicks + 1,
            timestamp: new Date()
          }
        ]);
      
      if (error) {
        console.log('Supabase error:', error);
      }
    } catch (err) {
      console.log('Error logging interaction:', err);
    }
  };

  const handleNoClick = async () => {
    // Log the final choice to Supabase
    try {
      const { data, error } = await supabase
        .from('rakhi_interactions')
        .insert([
          { 
            user_name: userName, 
            action: 'no_button_click',
            timestamp: new Date()
          }
        ]);
      
      if (error) {
        console.log('Supabase error:', error);
      }
    } catch (err) {
      console.log('Error logging final choice:', err);
    }
    
    setShowFinalMessage(true);
  };

  if (showFinalMessage) {
    return (
      <div className="App">
        <div className="final-message">
          <h1>I knew you always liked me 😉 💖</h1>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="App">
        <div className="login-container">
          <h1 className="title">Happy Rakhi 🎉</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="name">Enter your name:</label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="question-container">
        <h1 className="title">Happy Rakhi 🎉</h1>
        <h2 className="question">
          {userName}, will you be Jeet's sister? 👫
        </h2>
        <div className="buttons-container">
          {yesButtonClicks < 8 && (
            <button
              className="yes-btn"
              style={{
                width: yesButtonSize,
                height: yesButtonSize * 0.4,
                fontSize: yesButtonSize * 0.2,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={handleYesHover}
              onClick={handleYesHover}
            >
              Yes
            </button>
          )}
          <button
            className="no-btn"
            onClick={handleNoClick}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
