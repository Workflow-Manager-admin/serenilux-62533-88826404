import React, { useEffect, useRef, useState } from "react";
import "./JournalCard.css";

// PUBLIC_INTERFACE
export default function JournalCard({
  placeholder = "Type what’s bothering you…",
  disabled,
  value,
  onChange,
  onShred,
  editMode,
  onToggleEdit,
  quote,
  showQuote,
  shredding,
  setShredding,
}) {
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [placeholderDone, setPlaceholderDone] = useState(false);
  const [burning, setBurning] = useState(false);
  const [buttonLocked, setButtonLocked] = useState(true);
  const inputRef = useRef();
  // Typing animation for placeholder
  useEffect(() => {
    if (placeholderDone) return;
    let i = 0;
    function type() {
      setTypedPlaceholder((prev) => prev + placeholder[i]);
      i++;
      if (i < placeholder.length)
        setTimeout(type, 36 + Math.random() * 48);
      else setPlaceholderDone(true);
    }
    type();
    // eslint-disable-next-line
  }, []);

  // Focus animations for edit mode
  useEffect(() => {
    if (editMode && inputRef.current) inputRef.current.focus();
  }, [editMode]);

  // Unlock button if editMode and value not empty; with glow
  useEffect(() => {
    setButtonLocked(!editMode || !value.trim() || shredding);
  }, [editMode, value, shredding]);

  // Paper burn effect and lock
  const burnAndShred = () => {
    if (buttonLocked) return;
    setBurning(true);
    setTimeout(() => {
      setBurning(false);
      setShredding(true);
      setTimeout(() => {
        setShredding(false);
        onShred();
      }, 1950);
    }, 720); // burn start duration
  };

  return (
    <div className={`journal-card-wrap${shredding ? " burning" : ""}${editMode ? " edit-true" : ""}`}>
      <div className="journal-card-glass">
        <div className="edit-toggle-area">
          <label className="edit-toggle-label">
            <input
              type="checkbox"
              checked={editMode}
              onChange={onToggleEdit}
              disabled={shredding}
              className="edit-toggle-checkbox"
              tabIndex={0}
              aria-label="Enable Edit Mode"
            />
            <span className="edit-toggle-slider" />
            <span className="edit-toggle-text">{editMode ? "Edit Mode On" : "Edit Mode Off"}</span>
          </label>
        </div>
        <div className="journal-input-area">
          <textarea
            ref={inputRef}
            className={`journal-input${editMode ? " editable" : ""}`}
            value={editMode && !shredding ? value : ""}
            placeholder={placeholderDone ? placeholder : typedPlaceholder}
            disabled={!editMode || shredding}
            maxLength={480}
            autoFocus={editMode}
            onChange={(e) =>
              editMode && !shredding && onChange(e.target.value)
            }
            style={{
              caretColor: editMode && !shredding ? "#779dff" : "transparent",
              transition: "caret-color 0.24s",
            }}
            rows={5}
            spellCheck={true}
            aria-label={placeholder}
            tabIndex={editMode && !shredding ? 0 : -1}
          />
          {!editMode && (
            <span className="input-locked-tip">
              <span className="typing-cursor" />
            </span>
          )}
        </div>
        <button
          className={`shred-btn${burning ? " burn" : ""}${buttonLocked ? " locked" : ""}`}
          disabled={buttonLocked}
          onClick={burnAndShred}
          aria-label="Shred It"
          tabIndex={buttonLocked ? -1 : 0}
        >
          <span className="shred-btn-icon" aria-hidden="true">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{marginBottom:-3}}>
              <circle cx="12" cy="12" r="10.3" stroke="#b0baff" strokeWidth="2" fill="none"/>
              <path d="M8 13v-3a4 4 0 118 0v3" stroke="#64e8d8" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <rect x="8" y="13" width="8" height="6.2" rx="2.2" fill="#b0c1f4" stroke="#4a5779" strokeWidth="1"/>
              <circle cx="12" cy="16" r="1" fill="#277" />
            </svg>
          </span>
          <span className="shred-btn-text">Shred It</span>
        </button>
        {showQuote && (
          <div className="journal-quote">
            <span>{quote || "Let it go. You’ve taken the first step."}</span>
          </div>
        )}
        <div className={`paper-burn-overlay${burning ? " show" : ""}`} />
      </div>
    </div>
  );
}
