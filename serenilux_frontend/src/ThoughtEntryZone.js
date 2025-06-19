import React, { useState, useRef, useEffect } from "react";
import "./ThoughtEntryZone.css";
/**
 * Use audios from public/sounds with dynamic references.
 * Audio can be loaded using: new Audio(process.env.REACT_APP_PUBLIC_URL + '/sounds/<filename>')
 * (For CRA, process.env.REACT_APP_PUBLIC_URL is preferred. If undefined, fallback to process.env.PUBLIC_URL.)
 */
import EmotionalReframeCard from "./EmotionalReframeCard";

// PUBLIC_INTERFACE
function ThoughtEntryZone() {
  // State for input, background, and animation
  const [input, setInput] = useState("");
  const [animatedLetters, setAnimatedLetters] = useState([]);
  const [bgStormLevel, setBgStormLevel] = useState(0);
  const [shredding, setShredding] = useState(false);
  const [shredParticles, setShredParticles] = useState([]);
  const [rippleActive, setRippleActive] = useState(false);
  const [bgBrighten, setBgBrighten] = useState(false);

  // New: Control Emotional Reframe Card appearance
  const [showReframe, setShowReframe] = useState(false);

  // Remove unused import-based refs, use dynamically constructed Audio objects for sound playback
  const windAudioRef = useRef(null);
  const whooshAudioRef = useRef(null);
  const textareaRef = useRef(null);
  const shredCanvasRef = useRef(null);

  // Animate new letters as "ink spreading"
  useEffect(() => {
    if (!shredding) {
      const arr = input.split("").map((char, idx) => ({
        char,
        key: `${char}-${idx}`,
        appeared: true,
      }));
      setAnimatedLetters(arr);
      setBgStormLevel(Math.min(input.length / 25, 1));
    }
  }, [input, shredding]);

  // Handle the ambient wind audio volume effect
  useEffect(() => {
    // Set Audio ref once with direct static path for portability
    if (!windAudioRef.current) {
      windAudioRef.current = new window.Audio("/sounds/wind-soft.mp3");
    }
    const windAudio = windAudioRef.current;
    windAudio.volume = 0.12 + 0.38 * bgStormLevel;
    if (input.length > 0 && !shredding) {
      windAudio.loop = true;
      if (windAudio.paused) windAudio.play().catch(()=>{});
    } else {
      windAudio.pause();
      windAudio.currentTime = 0;
    }
    // Cleanup on component unmount
    return () => { windAudio.pause(); windAudio.currentTime = 0; };
  }, [input, bgStormLevel, shredding]);

  // For accessibility - focus textarea on mount (but not during shred)
  useEffect(() => {
    if (!shredding && !showReframe) textareaRef.current && textareaRef.current.focus();
  }, [shredding, showReframe]);

  // Helper: Ink animation span per letter
  const InkSpan = ({ char, idx }) => (
    <span className="ink-span" style={{ animationDelay: `${idx * 0.03}s` }}>
      {char === " " ? "\u00A0" : char}
    </span>
  );

  // Whoosh particle sound must sync with first burst for realism
  function playWhoosh() {
    // Use static whoosh sound (create new each time to allow fast retriggers if needed)
    const whoosh = new window.Audio("/sounds/whoosh-1.mp3");
    whoosh.volume = 0.54;
    whoosh.currentTime = 0;
    whoosh.play().catch(()=>{});
  }

  // Particle data generation for the shred
  function makeShredParticles(text, box) {
    // break input into words, then characters, randomize emission position
    const maxParticles = Math.min(text.length, 120);
    const chars = text.split("").slice(0, maxParticles);
    const angleSpread = Math.PI / 2; // 90deg upward cone spread
    return chars.map((ch, idx) => {
      const theta = Math.PI / 2 - angleSpread / 2 + (idx / maxParticles) * angleSpread + (Math.random()-0.5)*0.17;
      const radius = (box.width / 2) * (0.44 + 0.26*Math.random());
      return {
        x: box.x + box.width / 2 + Math.cos(theta) * (radius * 0.53 + Math.random()*18-9),
        y: box.y + box.height / 2 + (Math.random()-0.2) * box.height / 2,
        vx: Math.cos(theta) * (92 + Math.random() * 24),
        vy: -Math.abs(Math.sin(theta)) * (220 + Math.random()*44),
        a: 0.44 + Math.random() * 0.4,
        char: ch,
        t: 0,
        r: 0,
        fontSize: 18 + Math.random()*10,
        dx: (Math.random()-.5)*1.3,
        dy: (Math.random()-.5)*2.2+2,
        id: idx + "-" + Math.random().toFixed(3)
      };
    });
  }

  // The core: handle shred trigger
  const handleShred = () => {
    if (!input.trim() || shredding) return;
    setShredding(true);
    setShowReframe(false); // Hide card if shown previously
    // Calculate position/size of animated box to emit from (centered on text box)
    const card = document.querySelector(".tezone-card");
    const box = card.getBoundingClientRect();
    const baseBox = {
      x: box.left,
      y: box.top,
      width: box.width,
      height: box.height * 0.65, // focus emit toward upper portion for realism
    };
    // Spawn particles based on text and card box
    const parts = makeShredParticles(input, baseBox);
    setShredParticles(parts);
    // Play sound and start ripple+brighten
    setTimeout(() => {
      playWhoosh();
      setRippleActive(true);
      setBgBrighten(true);
    }, 150);
    // Animation: fade particles, fade storm, brighten background, then clear
    setTimeout(() => {
      setShredParticles([]);
      setInput("");
    }, 1900); // total particle duration
    setTimeout(() => {
      setRippleActive(false);
      setBgBrighten(false);
      setShredding(false);
      setShowReframe(true); // Show emotional reframe card
    }, 2250);
  };

  // Canvas-based animation for upward-text-particles
  useEffect(() => {
    let running = true;
    if (!shredding || shredParticles.length === 0) return;
    const canvas = shredCanvasRef.current;
    const ctx = canvas.getContext("2d");
    let { width, height } = canvas;
    const devicePixelRatio = window.devicePixelRatio || 1;
    function resizeCanvas() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let localParts = shredParticles.map(p => ({...p}));

    function animateParticleStep(ts) {
      ctx.clearRect(0, 0, width, height);
      let allDone = true;
      for (let p of localParts) {
        // Animate position and fading
        p.t += 1/60;
        const progress = p.t/1.44; // duration in seconds
        if (progress < 1){
          allDone = false;
        }
        // Upward curve
        let curve = 1 - Math.pow(1-progress, 3.3);
        p.x += p.vx * (1-curve) * 0.029 + p.dx * (1-curve);
        p.y += -p.vy * 0.0073 * (1-curve) + (-(1-curve)*18 + p.dy * curve);
        p.r = Math.sin(p.t * 4.5) * 5 * (1-curve);
        // Fade and uplift
        ctx.save();
        ctx.globalAlpha = p.a * (1-curve) * 0.85 + 0.08;
        ctx.font = `${p.fontSize+curve*12}px Inter, Arial, sans-serif`;
        ctx.translate(p.x, p.y - progress*180);
        ctx.rotate(p.r * Math.PI/180);
        ctx.shadowColor = "#c1eaff";
        ctx.shadowBlur = 8 * (1-curve);
        ctx.fillStyle = "#2e425d";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }
      if (!allDone && running) requestAnimationFrame(animateParticleStep);
    }
    animateParticleStep();
    return () => {
      running = false;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [shredParticles, shredding]);

  // For screen ripple/haptic effect
  useEffect(() => {
    if (!rippleActive) return;
    const root = document.querySelector("body");
    root.style.transition = "box-shadow 0.34s cubic-bezier(.47,1.4,.58,.97)";
    root.style.boxShadow =
      "0 0 48px 18px #6dbae699, 0 0 45px 14px #fff5e91c";
    setTimeout(() => {
      root.style.boxShadow = "none";
    }, 720);
    // Cleanup on dismount
    return () => {
      root.style.boxShadow = "none";
    };
  }, [rippleActive]);

  // Fade background brighten effect
  const bgFilter = shredding || bgBrighten
    ? `brightness(${1.27}) saturate(1.26) blur(${bgStormLevel * 0.7}px)`
    : `saturate(${1 - bgStormLevel * 0.7}) grayscale(${bgStormLevel * 0.45}) blur(${bgStormLevel * 2.5}px)`;

  const bgGradient =
    bgBrighten || shredding
      ? "linear-gradient(120deg, #85e5ee 12%, #95ffd5 56%, #f7d8ef66 97%)"
      : "linear-gradient(135deg, rgba(74,144,226,.30) 30%, rgba(80,227,194,0.25) 60%, rgba(45,25,80,0.23) 100%)";

  // UI logic for locking input while shredding
  const disableInput = shredding;

  return (
    <div
      className="tezone-bg"
      style={{
        filter: bgFilter,
        background: bgGradient,
        transition: "filter 0.40s cubic-bezier(.44,.82,.47,1), background 0.64s cubic-bezier(.52,1.4,.76,.95)",
      }}
    >
      {/* Audio playback handled via new Audio(process.env.PUBLIC_URL + ...) so no <audio> tags needed for these sounds */}
      {/* Shred particle canvas overlay */}
      <canvas
        ref={shredCanvasRef}
        className="shred-canvas"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 30,
          pointerEvents: "none",
          display: shredParticles && shredParticles.length > 0 ? "block" : "none",
          background: "transparent",
          transition: "opacity 0.5s"
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Main input card (hide visually if reframe card showing) */}
      {!showReframe && (
      <div
        className={`tezone-card${disableInput ? " tezone-disabled" : ""}`}
        style={{
          opacity: shredding ? 0.79 : 1,
          boxShadow:
            shredding || bgBrighten
              ? "0 8px 40px 0 #e8fff9, 0 2.5px 18px 2.5px #c9e7da78"
              : undefined,
          filter: bgBrighten
            ? "drop-shadow(0 0 14px #fffdec66)"
            : undefined,
          transition:
            "opacity 0.7s cubic-bezier(.53,1.5,.68,1.09), box-shadow 0.6s, filter 0.7s",
        }}
      >
        <div className="tezone-animated-input">
          <div className="ink-textlayer" aria-hidden="true">
            {!shredding
              ? animatedLetters.map((l, i) => (
                  <InkSpan char={l.char} key={l.key} idx={i} />
                ))
              : null}
            {/* Hide blinking cursor during shred */}
            {!shredding && <span className="tezone-cursor" />}
          </div>
          <textarea
            ref={textareaRef}
            className="tezone-textarea"
            placeholder="Type what’s bothering you…"
            value={shredding ? "" : input}
            onChange={e =>
              !disableInput &&
              setInput(e.target.value.slice(0, 480))
            }
            disabled={disableInput}
            rows={4}
            maxLength={480}
            aria-label="Type what's bothering you"
            spellCheck={true}
            tabIndex={disableInput ? -1 : 0}
            style={{
              opacity: shredding ? 0.34 : 1,
              pointerEvents: disableInput ? "none" : undefined,
              background: shredding
                ? "linear-gradient(95deg, #eff5fa 60%, #e4f1ef44 100%)"
                : "transparent",
              transition: "opacity 0.5s, background 0.6s",
            }}
          />
        </div>
        <div
          className="tezone-hint"
          style={{
            opacity: input.length < 2 && !shredding ? 1 : 0,
            transition: "opacity 0.6s"
          }}
        >
          Let the words flow – everything is private and safe here.
        </div>
        {/* Shred action button */}
        <button
          className="btn btn-large"
          onClick={handleShred}
          disabled={disableInput || input.length < 2}
          style={{
            marginTop: "23px",
            opacity: disableInput ? 0.73 : 1,
            cursor:
              disableInput || input.length < 2 ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
            fontWeight: 600,
            background:
              "linear-gradient(99deg,#50E3C2 0%, #B494E8 65%, #F5A623 100%)",
            boxShadow: !disableInput
              ? "0 2px 24px 0 #6eeebe32"
              : "none",
            filter: disableInput
              ? "grayscale(0.17) blur(0.7px) brightness(0.97)"
              : "none",
            transition: "opacity 0.5s, filter 0.6s",
          }}
          tabIndex={disableInput ? -1 : 0}
          aria-label="Shred Your Thought"
        >
          <span role="img" aria-label="shred">🧺</span> Shred It
        </button>
      </div>
      )}
      {/* Subtle storm overlays */}
      <svg
        className="storm-overlay"
        style={{ opacity: shredding ? 0 : bgStormLevel * 0.38 }}
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
      {/* Emotional Reframe Card: floats in after shredding ritual */}
      {showReframe && (
        <EmotionalReframeCard
          message="You are growing, even when it’s hard."
        />
      )}
    </div>
  );
}

export default ThoughtEntryZone;
