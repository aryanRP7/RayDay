import React, { useRef, useEffect, useState } from "react";

function NotesCarousel({ children }) {
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const slides = React.Children.toArray(children);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let t;
    const onScroll = () => {
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
      clearTimeout(t);
      t = setTimeout(() => setIndex(nearest.i), 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const goTo = (i) => {
    const el = scrollerRef.current;
    const card = el.children[i];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
    setIndex(i);
  };

  return (
    <div className="notes-carousel-wrap">
      <div className="full-bleed-notes__row carousel" ref={scrollerRef}>
        {slides.map((child, i) =>
          React.cloneElement(child, {
            key: i,
            className: `${child.props.className || ""} full-bleed-notes__img`,
          })
        )}
      </div>

      <div className="carousel-controls">
        <button
          className="carousel-prev"
          onClick={() => goTo(Math.max(0, index - 1))}
          aria-label="Previous"
        >
          ‹
        </button>
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="carousel-next"
          onClick={() =>
            goTo(Math.min(slides.length - 1, index + 1))
          }
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}
