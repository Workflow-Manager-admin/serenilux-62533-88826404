import React, { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";

// Use relative path for CRA static asset referencing
const MUSIC_SRC = process.env.REACT_APP_PUBLIC_URL
  ? process.env.REACT_APP_PUBLIC_URL + "/sounds/calm-wind.mp3"
  : process.env.PUBLIC_URL + "/sounds/calm-wind.mp3";

// PUBLIC_INTERFACE
export default function MusicPlayer() {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  // Autoplay muted on mount if possible
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = true;
      audioRef.current.volume = 0.15;
      audioRef.current.loop = true;
      audioRef.current.autoplay = true;
      // Attempt to play in muted mode to avoid browser block
      audioRef.current.play().then(()=> setPlaying(true)).catch(() => {});
    }
  }, []);

  // Toggling mute/unmute and fade volume
  const toggleMute = () => {
    if (!audioRef.current) return;
    setMuted((m) => {
      const futureMuted = !m;
      // Try fade effect for chill
      if (futureMuted) {
        // Fade out
        let v = audioRef.current.volume;
        const fade = setInterval(() => {
          v = Math.max(0, v - 0.03);
          audioRef.current.volume = v;
          if (v <= 0.01) {
            clearInterval(fade);
            audioRef.current.muted = true;
          }
        }, 35);
      } else {
        // Instantly unmute, fade in
        audioRef.current.muted = false;
        let v = 0;
        audioRef.current.volume = 0.01;
        const fade = setInterval(() => {
          v = Math.min(0.18, audioRef.current.volume + 0.03);
          audioRef.current.volume = v;
          if (v >= 0.15) clearInterval(fade);
        }, 38);
      }
      return futureMuted;
    });
    setPlaying(true);
  };

  return (
    <div className="music-toggle-wrap" tabIndex={0} aria-label="Toggle background music">
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        autoPlay
        muted={muted}
        loop
        tabIndex={-1}
        preload="auto"
      />
      <button
        className={`music-btn${muted ? " muted" : ""}`}
        onClick={toggleMute}
        aria-label={muted ? "Play music" : "Mute music"}
        tabIndex={0}
      >
        <span
          className={`music-icon${!muted ? " pulse" : ""}`}
          aria-hidden="true"
        >
          {muted ? (
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
              <g>
                <path d="M5 9v6h4l5 5V4l-5 5H5z" fill="#eef2fd" />
                <line x1="20" y1="8" x2="20" y2="16" stroke="#e0c0c0" strokeWidth="2.5" opacity="0.53"/>
              </g>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <g>
                <path d="M5 9v8h5.5l6.5 5V4l-6.5 5H5z" fill="#e5fff5" />
                <path d="M19 8a4 4 0 010 8" stroke="#b7d3ff" strokeWidth="2.2" fill="none"/>
                <circle
                  cx="21"
                  cy="13"
                  r="2.22"
                  fill="#8fffed"
                  style={{ filter: "blur(0.7px)" }}
                  opacity="0.53"
                />
              </g>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
