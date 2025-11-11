import React, { useEffect, useRef } from "react";
import "./rayday.css";

/**
 * RayDay.jsx
 * Single-page React component with a dark starfield that emits from the center
 * like a 3D warp effect, plus your headline and message.
 *
 * Usage:
 * 1) Place this file as `rayday.jsx`.
 * 2) Create a sibling stylesheet `rayday.css` (I'll provide the contents next).
 * 3) Import and render <RayDay /> in your app.
 */

function Starfield({ density = 2600 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = 0,
      height = 0,
      cx = 0,
      cy = 0,
      maxR = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
      maxR = Math.hypot(width, height) * 0.65;
      // Recompute count on resize for consistent density
      const target = Math.max(120, Math.floor((width * height) / density));
      if (stars.length !== target) stars = Array.from({ length: target }, newStar);
    }

    // individual star factory
    function newStar() {
      const angle = Math.random() * Math.PI * 2;
      const depth = 0.25 + Math.random() * 0.75; // 0.25..1
      return {
        angle,
        r: 0,
        depth,
        speed: (0.35 + Math.random() * 1.25) * (0.6 + depth * 0.9),
        size: 0.5 + depth * 1.7,
        tw: Math.random() * Math.PI * 2,
      };
    }

    let stars = Array.from({ length: 200 }, newStar);

    function frame(t) {
      // Clear with slight fade to create streak feeling
      ctx.fillStyle = "rgba(2, 6, 23, 0.35)"; // deep slate-like
      ctx.fillRect(0, 0, width, height);

      // Add subtle vignette for depth
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cx, cy));
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.globalCompositeOperation = "lighter";
      for (let s of stars) {
        s.r += s.speed;
        const x = cx + Math.cos(s.angle) * s.r;
        const y = cy + Math.sin(s.angle) * s.r;

        const life = 1 - s.r / maxR; // 1..0
        const alpha = Math.max(0, Math.min(1, life * (0.65 + Math.sin(t / 600 + s.tw) * 0.2)));

        // star core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // soft glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, s.size * 3.2);
        g.addColorStop(0, `rgba(180,200,255,${alpha * 0.8})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, s.size * 3.2, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > maxR || x < -50 || x > width + 50 || y < -50 || y > height + 50) {
          Object.assign(s, newStar());
        }
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="rayday-starfield" aria-hidden />;
}

export default function RayDay() {
  return (
    <main className="rayday-wrap">
      <Starfield />
      <section className="rayday-content" role="presentation">
        <h1>
  <span className="emoji">🌅</span>
  <span className="gold-text"> RayDay </span>
  <span className="emoji">💖</span>
</h1>

        <p>The birthday magic became starlight, but your sparkle shines on 💫</p>
      </section>

      {/* decorative center pulse (pure CSS) */}
      <div className="rayday-pulse" aria-hidden />
    </main>
  );
}
