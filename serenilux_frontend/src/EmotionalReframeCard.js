import React, { useState, useRef } from "react";
import "./EmotionalReframeCard.css";

// PUBLIC_INTERFACE
function EmotionalReframeCard({ message = "You are growing, even when it’s hard." }) {
  // Track animation state and voiceover play
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef(null);

  // Handwritten style uses fallback to cursive and a subtle glow
  // SVG animated "sprouting plant"
  function PlantSproutSVG() {
    // Plant grows up with leaves, drawn SVG paths animate in via CSS
    return (
      <svg
        width="90"
        height="82"
        viewBox="0 0 90 82"
        style={{ display: "block" }}
        aria-hidden="true"
        className="ercard-plant-anim"
      >
        {/* Soil */}
        <ellipse
          cx="45"
          cy="77"
          rx="30"
          ry="5.4"
          fill="rgba(170,195,170,0.17)"
        />
        {/* Stem */}
        <path
          className="ercard-stem"
          d="M45 75 Q46 55, 46 35 Q47 25, 52 18"
          stroke="#3db773"
          strokeWidth="2.1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Leaf left */}
        <path
          className="ercard-leaf ercard-leaf-left"
          d="M46 39 Q37 31, 32 41 Q37 43, 46 39"
          stroke="#41915c"
          strokeWidth="1.3"
          fill="#6fd19f"
        />
        {/* Leaf right */}
        <path
          className="ercard-leaf ercard-leaf-right"
          d="M47 36 Q55 28, 61 36 Q57 39, 47 36"
          stroke="#4e9259"
          strokeWidth="1.1"
          fill="#a2ddb7"
        />
        {/* Sprout bud */}
        <circle
          className="ercard-bud"
          cx="52"
          cy="18"
          r="3"
          fill="#fff7ee"
          stroke="#88eeac"
          strokeWidth="1.0"
          opacity="0.88"
        />
      </svg>
    );
  }

  // Voiceover logic (Web Speech API)
  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Voiceover not supported on this browser");
      return;
    }
    if (speaking) {
      // Stop existing speech
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(message);
    utter.rate = 0.97;
    utter.pitch = 1.04;
    utter.volume = 0.94;
    utter.lang = "en-US";
    // Try to pick a gentle voice, fallback to default
    const voices = window.speechSynthesis.getVoices().filter(v =>
      v.lang.startsWith("en") && /female|soft|Calm|Serene/i.test(v.name + v.voiceURI)
    );
    if (voices.length > 0) utter.voice = voices[0];

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synthRef.current = utter;

    window.speechSynthesis.cancel(); // stop any previous
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      className={`ercard-root${speaking ? " ercard-speaking" : ""}`}
      tabIndex={-1}
      role="region"
      aria-label="Emotional Reframe"
      data-testid="emotional-reframe-card"
    >
      <div className="ercard-floatin">
        <div className="ercard-anim-wrapper">
          <PlantSproutSVG />
        </div>
        <div className="ercard-message">
          <span className="ercard-message-text">{message}</span>
        </div>
        <button
          type="button"
          className={`ercard-voice-btn btn`}
          onClick={handleSpeak}
          aria-label={speaking ? "Stop voiceover" : "Play voiceover"}
          tabIndex={0}
        >
          <span style={{ marginRight: 6, fontSize: "1.4em" }} role="img" aria-label="speaker">
            {speaking ? "🔊" : "🔈"}
          </span>
          {speaking ? "Stop Voiceover" : "Play Voiceover"}
        </button>
      </div>
    </div>
  );
}

export default EmotionalReframeCard;
