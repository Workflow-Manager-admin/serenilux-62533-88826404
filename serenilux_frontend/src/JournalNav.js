import React from "react";
import "./JournalNav.css";

// PUBLIC_INTERFACE
export default function JournalNav() {
  return (
    <nav className="journal-navbar">
      <div className="nav-container">
        <span className="journal-logo">
          <span className="kaviaicon" aria-label="KAVIA AI">🌙</span>{" "}
          <span>KAVIA AI</span>
        </span>
        <span className="serenilux-title">SereniLux</span>
      </div>
    </nav>
  );
}
