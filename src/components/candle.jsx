import React, { useRef, useState, useEffect } from "react";
import "./candle.css";
import {
  sendHappyBirthdayEmail,
  sendCorrectPasswordEmail,
  sendIncorrectPasswordEmail,
} from "./email";

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
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [shake, setShake] = useState(false);
  const [isAfterBirthday, setIsAfterBirthday] = useState(false);

  // Post-birthday check (runs only once on refresh)
  // ✅ POST-BIRTHDAY (RAYDAY) CHECK

// //24th october//////////////////////////////////////////////////////////////////////
// useEffect(() => {
//   // 🟢 RayDay now starts Oct 24, 2025 at 12:50 PM New Jersey time (EDT, UTC−4)
//   const targetTime = new Date("2025-10-24T12:56:00-04:00"); // 🟢 changed date + UTC offset

//   // (same timezone conversion logic as before)
//   const now = new Date();
//   const nowInNJ = new Date(
//     now.toLocaleString("en-US", { timeZone: "America/New_York" })
//   );

//   const formatter = new Intl.DateTimeFormat("en-US", {
//     timeZone: "America/New_York",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });

//   const parts = formatter.formatToParts(now);
//   const njString = `${parts.find((p) => p.type === "year").value}-${
//     parts.find((p) => p.type === "month").value
//   }-${parts.find((p) => p.type === "day").value}T${
//     parts.find((p) => p.type === "hour").value
//   }:${parts.find((p) => p.type === "minute").value}:${
//     parts.find((p) => p.type === "second").value
//   }-04:00`; // 🟢 keep -04:00 (EDT, because DST is still active in October)

//   const njTime = new Date(njString);

//   console.log("→ Current NJ time:", njTime.toString());
//   console.log("→ RayDay trigger:", targetTime.toString());

//   if (njTime >= targetTime) {
//     setIsAfterBirthday(true);
//   }
// }, []);



//////////////////////////////ORIGINAL 8 nov
useEffect(() => {
  // 🟢 Changed date: RayDay now starts Nov 8, 2025 at 1:00 AM NJ time (EST)
  // 🟢 Changed UTC offset: -05:00 (because daylight saving ends in November)
  const targetTime = new Date("2025-11-08T01:00:00-05:00");

  // (same as before)
  const now = new Date();
  const nowInNJ = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

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




// ✅ COUNTDOWN SECTION
useEffect(() => {

  // 🎯 Countdown target: Oct 24, 2025 at 12:43 PM New Jersey (EDT, UTC−4)
  const target = new Date("2025-10-25T14:17:59-04:00"); // <-- only this line changed

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
//////////////////////////////////////////////////







// // ✅ COUNTDOWN SECTION
// useEffect(() => {

//   // 🎯 Countdown target: Nov 7, 2025 at 11:59 PM New Jersey (EST) ////////////////////////////////////////
//   const target = new Date("2025-11-07T23:59:00-05:00");

//   const interval = setInterval(() => {
//     const now = new Date();
//     const diff = target - now;

//     if (diff <= 0) {
//       clearInterval(interval);
//       setShowCountdown(false);
//       return;
//     }

//     // 🟢 Added proper days calculation
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);

//      // 🟢 Hide days if 0
//     const dayPart = days > 0 ? `${days}d ` : "";

//     setTimeLeft(
//       `${dayPart}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//         2,
//         "0"
//       )}:${String(seconds).padStart(2, "0")}`
//     );
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);











const [balloonsData] = useState(() =>
  Array.from({ length: 22 }, () => {
    const colors = [
      ["#f85676ff", "#ff99b3"],   // rose pink
      ["#ffd700", "#ffec8b"],   // golden yellow
      ["#6a0dad", "#d9b3ff"],   // royal purple
      ["#00bfff", "#99e6ff"],   // sky blue
      ["#ff7f50", "#ffb399"],   // coral orange
      ["#7fffd4", "#b2fff0"],   // aquamarine
      ["#ff69b4", "#ffb6c1"],   // hot pink
      ["#98fb98", "#c1ffc1"],   // mint green
      ["#ffa07a", "#ffd1b3"],   // light salmon
      ["#ba55d3", "#dda0dd"],   // orchid purple
      ["#f08080", "#ffb6b6"],   // soft red
      ["#40e0d0", "#a0ffff"],   // turquoise
      ["#ffb347", "#ffd580"],   // sunset orange
    ];

    const [c1, c2] = colors[Math.floor(Math.random() * colors.length)];

    // Randomly assign type: "circle" (default), "heart", or "star"
    const rand = Math.random();
    let type = "circle";
    if (rand < 0.15) type = "heart";  // 15% hearts
    else if (rand < 0.25) type = "star"; // 10% stars

    return {
      id: Math.random(),
      left: Math.random() * 90 + "%",
      duration: 6 + Math.random() * 5 + "s",
      rotate: (Math.random() * 30 - 15) + "deg",
      color1: c1,
      color2: c2,
      type,  // 👈 NEW
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
    if (code === "0546") {
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

  function removeParticle(id) {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }

  const placeholderMessage =
    "You bring so much light and laughter into every day, filling every moment with warmth. Wishing you a birthday as cheerful as you are, filled with joy, hugs, and wonderful surprises!";
  if (isAfterBirthday) {
    return (
      <div className="rayday-screen">
        <h1>🌅 RayDay 💖</h1>
        <p>
          The birthday magic has passed, but the light of your love still shines
          every day.
        </p>
      </div>
    );
  }

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
  Happy Birthday, <span class="goldenfish">𝐺𝑜𝑙𝑑𝑒𝑛𝐹𝑖𝑠ℎ</span>
  <span class="float-emoji right-emoji">💖</span>
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

      <div className="extra-section">
        <div className="extra-box">
          <h2>✨ A Special Surprise ✨</h2>
          <p>
            This is your light lavender box centered on the cream background!
          </p>
        </div>
      </div>

      <div className="second-section">
        <div className="extra-box">
          <h2>🎁 Enter the Secret Code 🎁</h2>

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
          <div className="letter-modal" onClick={() => setShowLetter(false)}>
            <div className="letter-box" onClick={(e) => e.stopPropagation()}>
              <h2>💌 A Special Letter 💌</h2>
              <p>
                You light up life’s sparks every day. Wishing you endless happiness, love, and magical moments. Happy Birthday! 💖
              </p>
              <button onClick={() => setShowLetter(false)}>Close</button>
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
