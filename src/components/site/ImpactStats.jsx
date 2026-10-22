import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function ImpactStats() {
  const { content } = useContent();
  const imp = content.impact;
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(() => imp.items.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    const targets = imp.items.map((it) => parseFloat(it.value) || 0);
    const duration = 1300;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(targets.map((v) => Math.round(v * eased)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, imp.items]);

  return (
    <section className="stats-section" id="impact">
      <div className="container">
        <div className="stats-head">
          <p className="eyebrow centered">{imp.eyebrow}</p>
          <h2>{imp.title} <em>{imp.titleAccent}</em></h2>
          <p>{imp.subtitle}</p>
        </div>
        <div className="stats-grid" ref={ref}>
          {imp.items.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-value">{display[i]}<span className="suffix">{stat.suffix}</span></div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
