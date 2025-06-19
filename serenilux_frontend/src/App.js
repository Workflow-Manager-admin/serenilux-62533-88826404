import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from "./WelcomeScreen";
// Our new serene journaling interface
import JournalCard from "./JournalCard";
import AnimatedParticles from "./AnimatedParticles";
import MusicPlayer from "./MusicPlayer";
import JournalNav from "./JournalNav";

// PUBLIC_INTERFACE
function App() {
  // State: Show welcome, then show journaling interface
  const [showWelcome, setShowWelcome] = useState(true);

  // State: journal input, edit mode, show quote, shredding effect
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [shredding, setShredding] = useState(false);

  // Handle transition from Welcome to Journal
  const handleStart = () => setShowWelcome(false);

  // Handle text shred (after paper burn)
  const handleShred = () => {
    setInput("");
    setEditMode(false);
    setShowQuote(true);
    // Hide quote again after a while
    setTimeout(() => setShowQuote(false), 4400);
  };

  const handleToggleEdit = () => {
    if (!shredding) setEditMode((v) => !v);
  };

  return (
    <div className="app">
      {/* Animated gradient background */}
      <div className="animated-bg-gradient" aria-hidden="true" />
      {/* Calm animated floating sparkles */}
      <AnimatedParticles />
      {/* Background music player (top right) */}
      {!showWelcome && <MusicPlayer />}
      {showWelcome ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <>
          <JournalNav />
          <main
            style={{
              minHeight: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <JournalCard
              placeholder="Type what’s bothering you…"
              value={input}
              onChange={setInput}
              onShred={handleShred}
              editMode={editMode}
              onToggleEdit={handleToggleEdit}
              quote="Let it go. You’ve taken the first step."
              showQuote={showQuote}
              shredding={shredding}
              setShredding={setShredding}
            />
          </main>
        </>
      )}
    </div>
  );
}

export default App;