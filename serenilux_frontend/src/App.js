import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from "./WelcomeScreen";
import ThoughtEntryZone from "./ThoughtEntryZone";

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
        {/* Main app UI */}
        <main style={{ minHeight: "100vh" }}>
          {/* Thought Entry Zone replaces hero UI */}
          <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
            <React.Suspense fallback={null}>
              {/*
                The ThoughtEntryZone component handles its own centering and backdrop.
              */}
              <ThoughtEntryZone />
            </React.Suspense>
          </div>
        </main>
        </>
      )}
    </div>
  );
}

export default App;