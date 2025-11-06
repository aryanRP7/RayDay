import React, { useRef, useState, useEffect } from "react";
import "./candle.css";
import {
  sendHappyBirthdayEmail,
  sendCorrectPasswordEmail,
  sendIncorrectPasswordEmail,
  sendCountdownLoadedEmail,
  sendRaydayLoadedEmail,
  sendSurpriseClosedEmail,
} from "./email";

// import note1 from "../images/note1.svg";
// import note2 from "../images/note2.svg";
// import note3 from "../images/note3.svg";
// import rose7 from "../images/rose7.svg";
// import boat from "../images/boat.svg";

// import opheliaSong from "../images/ophelia.mp3";

const emojis = ["😍", "💞", "🥳", "🌻", "✨", "💖"]; // Added extra sparkle
/* ---------- NotesCarousel helper (dots-only, one-swipe-per-slide) ---------- */
/* ---------- NotesCarousel helper (dots-only, one-swipe-per-slide robust) ---------- */
/* ---------- NotesCarousel helper (robust: exactly one slide per swipe) ---------- */
// Candle.jsx (top of file)
const base = process.env.PUBLIC_URL || "";
const note1 = `${base}/images/note1.svg`;
const note2 = `${base}/images/note2.svg`;
const note3 = `${base}/images/note3.svg`;
const rose7 = `${base}/images/rose7.svg`;
const boat = `${base}/images/boat.svg`;
const opheliaSong = `${base}/images/ophelia.mp3`; // 👈 add this line


function NotesCarousel({ children }) {
  const scrollerRef = useRef(null);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);
  const startIndexRef = useRef(0);
  const pointerIdRef = useRef(null);
  const [index, setIndex] = useState(0);
  const slides = React.Children.toArray(children);

  const getNearestIndex = (el) => {
    const cards = Array.from(el.children);
    const center = el.scrollLeft + el.clientWidth / 2;
    const nearest = cards.reduce(
      (best, card, i) => {
        const mid = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        return dist < best.dist ? { i, dist } : best;
      },
      { i: 0, dist: Infinity }
    );
    return nearest.i;
  };

  // helper to scroll to a card index
  const scrollToIndex = (el, idx) => {
    const card = el.children[idx];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
    setIndex(idx);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let scrollTimeout;

    const onScroll = () => {
      // update visible index while scrolling (throttled)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIndex(getNearestIndex(el));
      }, 80);
    };

    // pointer / touch start
    const onPointerDown = (ev) => {
      // support PointerEvent and TouchEvent
      const pageX =
        ev.pageX ?? (ev.touches && ev.touches[0] && ev.touches[0].pageX) ?? 0;
      startXRef.current = pageX;
      startTimeRef.current = performance.now();
      startIndexRef.current = getNearestIndex(el);

      // capture pointer id for pointer events (if available)
      if (ev.pointerId) {
        pointerIdRef.current = ev.pointerId;
        try {
          el.setPointerCapture(ev.pointerId);
        } catch (e) {}
      }
    };

    // pointer / touch end
    // replace your onPointerUp and onCancel with this version
    const onPointerUp = (ev) => {
      const pageX =
        ev.pageX ??
        (ev.changedTouches &&
          ev.changedTouches[0] &&
          ev.changedTouches[0].pageX) ??
        0;
      const dx = pageX - startXRef.current; // positive -> finger moved right
      const dt = Math.max(6, performance.now() - startTimeRef.current); // ms, avoid div by 0

      // thresholds (tweak if needed)
      const width = el.clientWidth;
      const distanceThreshold = Math.max(24, width * 0.08); // 8% or min 24px
      const velocity = Math.abs(dx) / dt; // px per ms
      const velocityThreshold = (0.5 / 1000) * 1000; // keep as px/ms

      // start index at start of gesture (guarantees only single-step)
      const startIndex = startIndexRef.current;
      let delta = 0;

      if (Math.abs(dx) >= distanceThreshold || velocity > velocityThreshold) {
        delta = dx < 0 ? 1 : -1;
      } else {
        delta = 0;
      }

      const target = Math.max(
        0,
        Math.min(slides.length - 1, startIndex + delta)
      );

      // *** STOP any momentum immediately by forcing current scroll position ***
      // assignment cancels deceleration on most browsers
      const current = el.scrollLeft;
      el.scrollLeft = current;

      // give browser one frame to settle, then perform our smooth scroll to target
      requestAnimationFrame(() => {
        // small extra safety: if target already visible, still snap to nearest
        scrollToIndex(el, target);
      });

      // release pointer capture if used
      if (pointerIdRef.current) {
        try {
          el.releasePointerCapture(pointerIdRef.current);
        } catch (e) {}
        pointerIdRef.current = null;
      }
    };

    const onCancel = (ev) => {
      // treat as pointer up (same logic)
      onPointerUp(ev);
    };

    // event listeners
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("pointercancel", onCancel, { passive: true });
    el.addEventListener("touchstart", onPointerDown, { passive: true });
    el.addEventListener("touchend", onPointerUp, { passive: true });
    el.addEventListener("touchcancel", onCancel, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onCancel);
      el.removeEventListener("touchstart", onPointerDown);
      el.removeEventListener("touchend", onPointerUp);
      el.removeEventListener("touchcancel", onCancel);
      clearTimeout(scrollTimeout);
    };
  }, [slides.length]);

  const goTo = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(i, slides.length - 1));
    scrollToIndex(el, idx);
  };

  return (
    <div className="notes-carousel-wrap">
      <div
        className="full-bleed-notes__row carousel"
        ref={scrollerRef}
        style={{ touchAction: "pan-x" }}
      >
        {slides.map((child, i) =>
          React.cloneElement(child, {
            key: i,
            className: `${child.props.className || ""} full-bleed-notes__img`,
          })
        )}
      </div>

      <div className="carousel-controls">
        <div className="carousel-dots" role="tablist" aria-label="Notes slides">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-pressed={i === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
/* ---------- End NotesCarousel helper ---------- */

/* ---------- End NotesCarousel helper ---------- */

/* ---------- End NotesCarousel helper ---------- */

export default function Candle() {
  const [activated, setActivated] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCountdown, setShowCountdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const audioRef = useRef(null);
    const opheliaRef = useRef(null); // will hold Audio(opheliaSong)
  const opheliaPlayingRef = useRef(false); // track play state
  const particleId = useRef(0);
  const greetingRef = useRef(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [shake, setShake] = useState(false);
  const [isAfterBirthday, setIsAfterBirthday] = useState(false);
  // one-time-send guards
  const countdownSentRef = useRef(false);
  const raydaySentRef = useRef(false);


  

  //////////////////////////////ORIGINAL 9 nov
  useEffect(() => {
    // 🟢 Changed date: RayDay now starts Nov 9, 2025 at 1:00 AM NJ time (EST)
    // 🟢 Changed UTC offset: -05:00 (because daylight saving ends in November)
    const targetTime = new Date("2025-11-09T13:00:00-05:00");

    // (same as before)
    const now = new Date();
    

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);

    const njString = `${parts.find((p) => p.type === "year").value}-${
      parts.find((p) => p.type === "month").value
    }-${parts.find((p) => p.type === "day").value}T${
      parts.find((p) => p.type === "hour").value
    }:${parts.find((p) => p.type === "minute").value}:${
      parts.find((p) => p.type === "second").value
    }-05:00`; // 🟢 Changed from -04:00 → -05:00 (EST timezone)

    const njTime = new Date(njString);

    console.log("→ Current NJ time:", njTime.toString());
    console.log("→ RayDay trigger:", targetTime.toString());

    if (njTime >= targetTime) {
      setIsAfterBirthday(true);
    }
  }, []);
  // Send email once when countdown page is visible/loaded
  useEffect(() => {
    if (showCountdown && !countdownSentRef.current) {
      // sendCountdownLoadedEmail();               /////////////////////////////////////////
      countdownSentRef.current = true;
    }
  }, [showCountdown]);

///////////////////////////////////////////play song if countdown ends
    useEffect(() => {
    if (!showCountdown) {
      // countdown finished — play Ophelia once
      tryPlayOphelia();
    }
  }, [showCountdown]);


  // Send email once when RayDay / after-birthday screen becomes visible
  useEffect(() => {
    if (isAfterBirthday && !raydaySentRef.current) {
      // sendRaydayLoadedEmail();     //////////////////////////////////////////////////
      raydaySentRef.current = true;
    }
  }, [isAfterBirthday]);


  /////////////////after birthday ray day screen song play 
    useEffect(() => {
    if (isAfterBirthday) {
      tryPlayOphelia();
    }
  }, [isAfterBirthday]);


  // ✅ COUNTDOWN SECTION
  useEffect(() => {
    const target = new Date("2025-11-06T09:01:00-05:00"); // <-- only this line changed
      // const target = new Date("2025-11-07T23:59:00-05:00");

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setShowCountdown(false);
        return;
      }
      // 🟢 Added proper days calculation
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // 🟢 Hide days if 0
      const dayPart = days > 0 ? `${days}d ` : "";

      setTimeLeft(
        `${dayPart}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);




    useEffect(() => {
    if (!opheliaSong) return;
    const a = new Audio(opheliaSong);
    a.loop = false; // DO NOT repeat
    a.preload = "auto";
    opheliaRef.current = a;

    function onEnd() {
      opheliaPlayingRef.current = false;
    }
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("ended", onEnd);
      try {
        a.pause();
        a.src = "";
      } catch (e) {}
      opheliaRef.current = null;
    };
  }, []);



  
  

  const [balloonsData] = useState(() =>
    Array.from({ length: 22 }, () => {
      const colors = [
        ["#f85676ff", "#ff99b3"], // rose pink
        ["#ffd700", "#ffec8b"], // golden yellow
        ["#6a0dad", "#d9b3ff"], // royal purple
        ["#00bfff", "#99e6ff"], // sky blue
        ["#ff7f50", "#ffb399"], // coral orange
        ["#7fffd4", "#b2fff0"], // aquamarine
        ["#ff69b4", "#ffb6c1"], // hot pink
        ["#98fb98", "#c1ffc1"], // mint green
        ["#ffa07a", "#ffd1b3"], // light salmon
        ["#ba55d3", "#dda0dd"], // orchid purple
        ["#f08080", "#ffb6b6"], // soft red
        ["#40e0d0", "#a0ffff"], // turquoise
        ["#ffb347", "#ffd580"], // sunset orange
      ];

      const [c1, c2] = colors[Math.floor(Math.random() * colors.length)];

      // Randomly assign type: "circle" (default), "heart", or "star"
      const rand = Math.random();
      let type = "circle";
      if (rand < 0.15) type = "heart"; // 15% hearts
      else if (rand < 0.25) type = "star"; // 10% stars

      return {
        id: Math.random(),
        left: Math.random() * 90 + "%",
        duration: 6 + Math.random() * 5 + "s",
        rotate: Math.random() * 30 - 15 + "deg",
        color1: c1,
        color2: c2,
        type, // 👈 NEW
      };
    })
  );

  // Particles inside greeting
  useEffect(() => {
    if (!activated || !greetingRef.current) return;

    const greetingWidth = greetingRef.current.offsetWidth;

    const interval = setInterval(() => {
      setParticles((prev) => {
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
            depth: Math.random() > 0.5 ? 1 : 0,
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

  const handleCodeSubmit = () => {
    if (code === "0811") {
      setShowLetter(true); // Show the letter modal
      setError("");
      setCode(""); // optionally clear after success too
      // ✅ Send "correct password" email
      // sendCorrectPasswordEmail(code); ///////////////////////////////////////////////////////////////
    } else {
      // show error, clear entered code, trigger a shake animation
      setError("Incorrect code. Try again!");
      setCode("");
      setShake(true);

      // ✅ Send "incorrect password" email
      // sendIncorrectPasswordEmail(code); ////////////////////////////////////////////////////////////

      // remove shake after animation finishes
      setTimeout(() => setShake(false), 600);

      // optionally clear the error after a couple seconds
      setTimeout(() => setError(""), 1800);
    }
  };

  useEffect(() => {
    if (!particles.length) return;
    const t = setTimeout(() => setParticles((prev) => prev.slice(-80)), 3000);
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
    // send email notification
    // sendHappyBirthdayEmail(); ////////////////////////////////////////////////////////////////////
  }
///////////////////////////////ophelia song function 
  const tryPlayOphelia = () => {
    const a = opheliaRef.current;
    if (!a) return;

    // if already playing, do nothing
    if (!a.paused && !a.ended) return;

    // pause birthday melody if playing
    if (audioRef.current && !audioRef.current.paused) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }

    const p = a.play();
    if (p && p.catch) {
      p.catch((err) => {
        // autoplay may be blocked until user interaction; swallow error
        console.warn("Ophelia autoplay failed:", err);
      });
    }
    opheliaPlayingRef.current = true;
  };

///////////////////////////////ophelia song function end
  function removeParticle(id) {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }

  const placeholderMessage =
<p>
  You bring so much light and laughter into every moment, filling it with good vibes.
  <br />
  Wishing you a birthday as cheerful as you are ~ full of joy, moments, wonderful surprises, and those everyday snaps bursting with energy.
  <br />
  Keep shining, keep smiling, and keep being you. 🌸
</p>
  if (isAfterBirthday) {
    return (
      <div className="rayday-screen">
        <h1>🌅 RayDay 💖</h1>
        <p>
          The birthday magic became starlight, but your sparkle shines on 💫
        </p>
      </div>
    );
  }

  if (showCountdown) {
    return (
      <div className="countdown-screen">
        <div className="countdown-timer">{timeLeft}</div>
        <p className="countdown-text">Midnight magic, celestial vibes 🌙✨</p>
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

      {/* 🎈 Balloons floating freely */}
      <div className="balloons">
        {balloonsData.map((b) => (
          <div
            key={b.id}
            className={`balloon ${b.type} ${activated ? "float" : ""}`}
            style={{
              left: b.left,
              "--duration": b.duration,
              "--color1": b.color1,
              "--color2": b.color2,
              "--rotate": b.rotate,
            }}
          ></div>
        ))}
      </div>

      <audio
        ref={audioRef}
        src="/music/birthday-melody.mp3"
        loop
        preload="auto"
      />
      <div className={`bloom ${activated ? "bloom-animate" : ""}`} />

      <div className="content">
        <div className={`intro-message ${activated ? "fade-out" : ""}`}>
          <p>Touch the candle to blow 🎂✨</p>
        </div>

        <div className="candle-wrapper">
          <svg
            className="candle-svg"
            width="140"
            height="320"
            viewBox="0 0 140 320"
          >
            <defs>
              <pattern
                id="zebraStripes"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
                patternTransform="rotate(45)"
              >
                <rect width="10" height="60" fill="#ffd1b3" />
                <rect x="10" width="50" height="90" fill="#ffb6d9" />
                <rect x="20" width="50" height="90" fill="#ffd1b3" />
                <rect x="30" width="50" height="90" fill="#ffb6d9" />
                <rect x="40" width="50" height="90" fill="#ffd1b3" />
                <rect x="50" width="50" height="90" fill="#ffb6d9" />
              </pattern>
            </defs>
            <rect
              x="50"
              y="100"
              width="40"
              height="180"
              rx="12"
              ry="12"
              fill="url(#zebraStripes)"
              stroke="#d46fa6"
              strokeWidth="3"
            />
          </svg>

          <div className="wick" />

          <div
            role="button"
            aria-label="Blow out the candle"
            className={`flame ${activated ? "flame-out" : ""}`}
            onClick={handleFlameClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFlameClick();
            }}
            tabIndex={0}
          >
            <div className="flame-inner" />
            <div className="flame-core" />
          </div>
        </div>

        <div
          className={`greeting ${showGreeting ? "visible" : ""}`}
          ref={greetingRef}
        >
          <div className="birthday-message">
            <h1>
              <span class="float-emoji left-emoji">🎂</span>
              Happy Birthday,<span class="goldenfish"> 𝐹𝑎𝑙𝑔𝑢𝑛𝑖</span>
              <span class="float-emoji right-emoji">🌻</span>
            </h1>

            <p>{placeholderMessage}</p>
          </div>

          {/* Particles inside greeting */}
          <div className="particles">
            {particles.map((p) => (
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
                  "--driftY": `${p.driftY}px`,
                }}
                onAnimationEnd={() => removeParticle(p.id)}
              >
                {p.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {activated && (
        <div className="full-bleed-notes-band">
          <div className="full-bleed-notes__inner">
            <h2>🎨 Pieces, Traces & a Palette ✨</h2>
            <NotesCarousel>
              <img src={note1} alt="Note 1" />
              <img src={note2} alt="Note 2" />
              <img src={note3} alt="Note 3" />
            </NotesCarousel>
          </div>
        </div>
      )}

      <div className="second-section">
        <div className="extra-box">
          <h2>✨ Unlock the Bloom 🎁</h2>

          {/* Code display */}
          <div className={`code-display ${shake ? "shake" : ""}`}>
            {code.split("").map((digit, i) => (
              <span key={i} className="digit">
                {digit}
              </span>
            ))}
            {Array.from({ length: 4 - code.length }).map((_, i) => (
              <span key={i + code.length} className="digit placeholder">
                •
              </span>
            ))}
          </div>

          {/* Locker-style keypad */}
          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="key"
                onClick={() =>
                  setCode((prev) =>
                    prev.length < 4 ? prev + num.toString() : prev
                  )
                }
              >
                {num}
              </button>
            ))}

            <button
              className="key backspace"
              onClick={() => setCode((prev) => prev.slice(0, -1))}
            >
              ←
            </button>
            <button
              className="key"
              onClick={() =>
                setCode((prev) => (prev.length < 4 ? prev + "0" : prev))
              }
            >
              0
            </button>
            <button className="key enter" onClick={handleCodeSubmit}>
              ✔
            </button>
          </div>

          {/* Error message */}
          {error && <p className="code-error">{error}</p>}
        </div>

        {/* Letter Modal */}
        {/* Letter Modal */}
        {showLetter && (
          <div
            className="full-screen-surprise"
            role="dialog"
            aria-modal="true"
            aria-label="Special surprise"
            onClick={() => setShowLetter(false)}
          >
            <div
              className="surprise-inner"
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              {/* Full-screen rose image (covering available viewport area) */}
              <div className="rose-wrap" aria-hidden="false">
                <div className="rose-caption" role="heading" aria-level="3">
                  <span className="rose-caption__line">You deserve</span>
                  <span className="rose-caption__highlight">everything</span>
                </div>

                <img src={rose7} alt="Special rose" className="rose-full" />
              </div>

              {/* Small boat below the rose */}
              <div className="boat-wrap">
                <img src={boat} className="boat-small" alt="boat" />
                <div className="waves-wrap" aria-hidden="true">
                  <div className="wave wave--one"></div>
                  <div className="wave wave--two"></div>
                  <div className="wave wave--three"></div>
                </div>
              </div>

              {/* Close button */}
              <div className="surprise-controls">
                <button
                  className="surprise-close"
                  onClick={() => setShowLetter(false)}
                  aria-label="Close surprise"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 👇 Footer section */}
      <footer className="copyright-footer">
        © 2025 RayDay — Made with 💖 : 🦚 : Don’t judge this website, I already
        know how pitiful it is.
      </footer>
    </div>
  );
}
