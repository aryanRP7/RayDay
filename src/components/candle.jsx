import React, { useRef, useState, useEffect } from "react";
import "./candle.css";

const emojis = ["😍", "💞", "🥳", "🌻", "✨", "💖"]; // Added extra sparkle

export default function Candle() {
  const [activated, setActivated] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCountdown, setShowCountdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const audioRef = useRef(null);
  const particleId = useRef(0);
  const greetingRef = useRef(null);

  // Countdown
  useEffect(() => {
    const target = new Date("2025-10-12T10:42:40-04:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setShowCountdown(false);
        return;
      }
      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Particles inside greeting
  useEffect(() => {
    if (!activated || !greetingRef.current) return;

    const greetingWidth = greetingRef.current.offsetWidth;

    const interval = setInterval(() => {
      setParticles(prev => {
        const next = [...prev];
        for (let i = 0; i < 7; i++) {
          // Spawn particles around center of greeting
          const center = greetingWidth / 2;
          next.push({
            id: particleId.current++,
            left: center + (Math.random() - 0.5) * 100, // ±50px from center
            size: 18 + Math.random() * 22,
            delay: Math.random() * 0.6,
            duration: 3 + Math.random() * 2,
            driftX: (Math.random() - 0.5) * 80,
            driftY: 200 + Math.random() * 100,
            rotate: Math.random() * 360,
            opacity: 0.5 + Math.random() * 0.5,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            depth: Math.random() > 0.5 ? 1 : 0
          });
        }
        return next.slice(-160);
      });
    }, 180);

    const stopTimeout = setTimeout(() => clearInterval(interval), 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(stopTimeout);
    };
  }, [activated]);

  useEffect(() => {
    if (!particles.length) return;
    const t = setTimeout(() => setParticles(prev => prev.slice(-80)), 3000);
    return () => clearTimeout(t);
  }, [particles]);

  function handleFlameClick() {
    if (activated) return;
    setActivated(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const p = audioRef.current.play();
      if (p && p.catch) p.catch(() => {});
    }
    setTimeout(() => setShowGreeting(true), 900);
  }

  function removeParticle(id) {
    setParticles(prev => prev.filter(p => p.id !== id));
  }

  const placeholderMessage =
    "You fill my life with light and laughter every single day. Wishing you the sweetest birthday, full of love, hugs, and beautiful surprises. I love";

  if (showCountdown) {
    return (
      <div className="countdown-screen">
        <div className="countdown-timer">{timeLeft}</div>
        <p className="countdown-text">Waiting for the magic moment ✨</p>
      </div>
    );
  }

  return (
    <div className={`page ${activated ? "activated" : ""}`}>
<div className="garland top-left">
  {Array.from({ length: 10 }).map((_, i) => (
    <div key={i} className="flag" />
  ))}
</div>

<div className="garland top-right">
  {Array.from({ length: 10 }).map((_, i) => (
    <div key={i} className="flag" />
  ))}
</div>


      <audio ref={audioRef} src="/music/birthday-melody.mp3" loop preload="auto" />
      <div className={`bloom ${activated ? "bloom-animate" : ""}`} />

      <div className="content">
        <div className={`intro-message ${activated ? "fade-out" : ""}`}>
          <p>Touch the candle to blow 🎂✨</p>
        </div>

        <div className="candle-wrapper">
          <svg className="candle-svg" width="140" height="320" viewBox="0 0 140 320">
            <defs>
              <pattern id="zebraStripes" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(45)">
                <rect width="10" height="60" fill="#ffd1b3" />
                <rect x="10" width="50" height="90" fill="#ffb6d9" />
                <rect x="20" width="50" height="90" fill="#ffd1b3" />
                <rect x="30" width="50" height="90" fill="#ffb6d9" />
                <rect x="40" width="50" height="90" fill="#ffd1b3" />
                <rect x="50" width="50" height="90" fill="#ffb6d9" />
              </pattern>
            </defs>
            <rect x="50" y="100" width="40" height="180" rx="12" ry="12" fill="url(#zebraStripes)" stroke="#d46fa6" strokeWidth="3" />
          </svg>

          <div className="wick" />

          <div
            role="button"
            aria-label="Blow out the candle"
            className={`flame ${activated ? "flame-out" : ""}`}
            onClick={handleFlameClick}
            onKeyDown={e => { if (e.key === "Enter") handleFlameClick(); }}
            tabIndex={0}
          >
            <div className="flame-inner" />
            <div className="flame-core" />
          </div>
        </div>

        <div className={`greeting ${showGreeting ? "visible" : ""}`} ref={greetingRef}>
          <h1>🎂 Happy Birthday, My Love 💖</h1>
          <p>{placeholderMessage}</p>

          {/* Particles inside greeting */}
          <div className="particles">
            {particles.map(p => (
              <span
                key={p.id}
                className={`particle depth-${p.depth}`}
                style={{
                  left: `${p.left}px`,
                  bottom: 0,
                  fontSize: `${p.size}px`,
                  opacity: p.opacity,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  transform: `rotate(${p.rotate}deg)`,
                  "--driftX": `${p.driftX}px`,
                  "--driftY": `${p.driftY}px`
                }}
                onAnimationEnd={() => removeParticle(p.id)}
              >
                {p.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="extra-section">
        <div className="extra-box">
          <h2>✨ A Special Surprise ✨</h2>
          <p>This is your light lavender box centered on the cream background!</p>
        </div>
      </div>
    </div>
  );
}
