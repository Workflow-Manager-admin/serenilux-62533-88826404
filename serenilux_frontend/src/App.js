import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from "./WelcomeScreen";

function App() {
  // Manage screen state; future: swap WelcomeScreen for main app after Start Detox
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStart = () => {
    setShowWelcome(false);
    // Transition to main experience
  };

  return (
    <div className="app">
      {showWelcome ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <>
        {/* Main app UI here */}
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> KAVIA AI
              </div>
              <button className="btn">Template Button</button>
            </div>
          </div>
        </nav>
        <main>
          <div className="container">
            <div className="hero">
              <div className="subtitle">AI Workflow Manager Template</div>
              <h1 className="title">serenilux_frontend</h1>
              <div className="description">
                Start building your application.
              </div>
              <button className="btn btn-large">Button</button>
            </div>
          </div>
        </main>
        </>
      )}
    </div>
  );
}

export default App;