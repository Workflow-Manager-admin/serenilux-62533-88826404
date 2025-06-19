import React, { useEffect, useRef, useState } from "react";
import "./WelcomeScreen.css";

// PUBLIC_INTERFACE
function WelcomeScreen({ onStart }) {
  // Fade in state for the message
  const [messageVisible, setMessageVisible] = useState(false);
  // Ref for particles canvas
  const canvasRef = useRef(null);

  // Fade in effect for the welcome message
  useEffect(() => {
    const timer = setTimeout(() => setMessageVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Glitter particle animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    let ctx, particles = [];
    let animationId;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const NUM_PARTICLES = 36; // Subtle, not crowded

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          radius: randomBetween(0.7, 2),
          speedY: randomBetween(-0.07, 0.06), // Some drift up, some almost static
          speedX: randomBetween(-0.04, 0.04),
          alpha: randomBetween(0.5, 1),
          twinkle: Math.random() * Math.PI * 2,
          color: i % 3 === 0
            ? "#F5A623AA"
            : i % 3 === 1
            ? "#B494E8BB"
            : "#FFF8E7BB"
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        // Twinkle shimmer
        const twinkleAlpha = p.alpha * (0.7 + Math.abs(Math.sin(Date.now() / 1200 + p.twinkle)) * 0.7);
        ctx.globalAlpha = twinkleAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + Math.abs(Math.sin(Date.now()/1700 + p.twinkle))*0.7, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;
        // Wrap particle to other edge subtly for infinite drift
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(animateParticles);
    }

    if (canvas) {
      ctx = canvas.getContext("2d");
      resizeCanvas();
      initParticles();
      animateParticles();
      window.addEventListener('resize', resizeCanvas);
    }
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="welcomescreen-root">
      <canvas
        ref={canvasRef}
        className="welcomescreen-particles"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="welcomescreen-gradients-bg" />
      <div className="welcomescreen-content">
        <h1
          className={`welcomescreen-message${messageVisible ? " fade-in" : ""}`}
        >
          Release what weighs you down.
        </h1>
        <button
          className="welcomescreen-btn"
          onClick={onStart}
          aria-label="Start Detox"
        >
          <span className="feather-icon" role="img" aria-label="feather">🪶</span>
          Start Detox
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
