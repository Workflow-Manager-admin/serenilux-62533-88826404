import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function AnimatedParticles({ className = "", style }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    let ctx, particles = [];
    let animationId;
    const particleCount = window.innerWidth < 700 ? 20 : 36;
    function randomColor(idx) {
      return idx % 4 === 0
        ? "rgba(170,136,241,0.29)"
        : idx % 4 === 1
        ? "rgba(190,227,245,0.33)"
        : idx % 4 === 2
        ? "rgba(245,196,232,0.22)"
        : "rgba(210,255,240,0.16)";
    }
    function randomBetween(a, b) { return a + Math.random() * (b - a); }
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: randomBetween(0, window.innerWidth),
          y: randomBetween(0, window.innerHeight),
          r: randomBetween(1.2, 3.1),
          a: randomBetween(0.29, 0.71),
          sY: randomBetween(-0.14, 0.12),
          sX: randomBetween(-0.07, 0.08),
          color: randomColor(i),
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        // Soft shimmer and twinkle
        const tAlpha = p.a * (0.5 + Math.abs(Math.sin(Date.now() / 1500 + p.twinkle)) * 0.8);
        ctx.globalAlpha = tAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + Math.abs(Math.sin(Date.now()/1900 + p.twinkle))*0.5, 0, 2*Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#fff8f7";
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Move particle
        p.x += p.sX * (1 + Math.sin(Date.now() / 5000 + p.twinkle) * 0.3);
        p.y += p.sY * (1 + Math.cos(Date.now() / 4700 + p.twinkle) * 0.22);
        // minor vertical bounce
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
      }
      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(animateParticles);
    }

    if (canvas) {
      ctx = canvas.getContext("2d");
      resizeCanvas();
      initParticles();
      animateParticles();
      window.addEventListener("resize", resizeCanvas);
    }
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`journal-particles-bg ${className}`}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 2,
        background: "transparent",
        ...style,
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
