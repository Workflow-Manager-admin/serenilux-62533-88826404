import React, { useState, useRef, useEffect } from "react";
import "./ThoughtEntryZone.css";
import windSoft from "./assets/wind-soft.mp3"; // We will add this asset

// PUBLIC_INTERFACE
function ThoughtEntryZone() {
  // State to store user input and letter animation
  const [input, setInput] = useState("");
  const [animatedLetters, setAnimatedLetters] = useState([]);
  const [bgStormLevel, setBgStormLevel] = useState(0);
  const audioRef = useRef(null);

  // Animate new letters as "ink spreading"
  useEffect(() => {
    // For each letter, add a key/index and the letter itself
    const arr = input.split("").map((char, idx) => ({
      char,
      key: `${char}-${idx}`,
      appeared: true
    }));
    setAnimatedLetters(arr);
    setBgStormLevel(Math.min(input.length / 25, 1)); // 0 to 1 as storm intensity
  }, [input]);

  // Handle the stormy wind audio volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.12 + 0.38 * bgStormLevel;
      if (input.length > 0) {
        audioRef.current.loop = true;
        if (audioRef.current.paused) audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [input, bgStormLevel]);

  // For accessibility - manage focus
  const textareaRef = useRef(null);
  useEffect(() => {
    // Focus on mount
    textareaRef.current && textareaRef.current.focus();
  }, []);

  // Helper: "ink" span with mask effect per letter
  const InkSpan = ({ char, idx }) => (
    <span className="ink-span" style={{ animationDelay: `${idx * 0.03}s` }}>
      {char === " " ? "\u00A0" : char}
    </span>
  );

  return (
    <div
      className="tezone-bg"
      style={{
        // Dynamic filters and gradients for storminess
        filter: `saturate(${1 - bgStormLevel * 0.7}) grayscale(${
          bgStormLevel * 0.45
        }) blur(${bgStormLevel * 2.5}px)`,
        background: `linear-gradient(135deg, rgba(74,144,226,.30) 30%, rgba(80,227,194,0.25) 60%, rgba(45,25,80,0.23) 100%)`
      }}
    >
      <audio src={windSoft} ref={audioRef} preload="auto" />
      <div className="tezone-card">
        <div className="tezone-animated-input">
          {/* Visually rendered ink spans over a textarea for animation */}
          <div className="ink-textlayer" aria-hidden="true">
            {animatedLetters.map((l, i) => (
              <InkSpan char={l.char} key={l.key} idx={i} />
            ))}
            {/* Cursor blink */}
            <span className="tezone-cursor" />
          </div>
          <textarea
            ref={textareaRef}
            className="tezone-textarea"
            placeholder="Type what’s bothering you…"
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 480))}
            rows={4}
            maxLength={480}
            aria-label="Type what's bothering you"
            spellCheck={true}
          />
        </div>
        <div
          className="tezone-hint"
          style={{ opacity: input.length < 2 ? 1 : 0 }}
        >
          Let the words flow – everything is private and safe here.
        </div>
      </div>

      {/* Subtle storm overlays */}
      <svg
        className="storm-overlay"
        style={{ opacity: bgStormLevel * 0.38 }}
        width="100%"
        height="100%"
        viewBox="0 0 500 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="stormGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#adb7d8" stopOpacity="0.13" />
            <stop offset="90%" stopColor="#43495c" stopOpacity="0.24" />
          </linearGradient>
          <filter id="noise" x="0" y="0">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              result="turb"
              seed="8"
            />
            <feColorMatrix
              in="turb"
              type="saturate"
              values="0.7"
              result="saturate"
            />
            <feComponentTransfer in="saturate">
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect
          width="100%"
          height="120"
          fill="url(#stormGrad)"
          filter="url(#noise)"
        />
      </svg>
    </div>
  );
}

export default ThoughtEntryZone;
