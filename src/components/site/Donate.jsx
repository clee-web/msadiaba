import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import SmartLink from '../SmartLink';
import Reveal from '../Reveal';

function AllocBars() {
  const { content } = useContent();
  const bars = content.donate?.bars || [];
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!bars.length) return null;

  return (
    <div className="alloc" ref={ref}>
      <h3>{content.donate?.barsTitle}</h3>
      {bars.map((bar, i) => (
        <div className="alloc-row" key={i}>
          <span className="alloc-label">{bar.label}</span>
          <div className="alloc-track">
            <div
              className={`alloc-fill c${i % 3}`}
              style={{ width: started ? `${bar.pct}%` : '0%', transitionDelay: `${i * 140}ms` }}
            ></div>
          </div>
          <span className="alloc-pct">{bar.pct}%</span>
        </div>
      ))}
      <p className="alloc-note">{content.donate?.barsNote}</p>
    </div>
  );
}

export default function Donate() {
  const { content } = useContent();
  const d = content.donate || { tiers: [], methods: [] };
  return (
    <section className="donate-section" id="donate">
      <div className="donate-shape shape-a"></div>
      <div className="donate-shape shape-b"></div>
      <div className="container">
        <Reveal className="donate-head">
          <p className="eyebrow centered">{d.eyebrow}</p>
          <h2>{d.title} <em>{d.titleAccent}</em></h2>
          <p>{d.text}</p>
        </Reveal>
        <div className="tier-grid">
          {d.tiers.map((tier, i) => (
            <Reveal key={i} delay={i * 90} className="tier-reveal">
              <div className={`tier-card${tier.badge ? ' featured' : ''}`}>
                {tier.badge && <span className="tier-badge">{tier.badge}</span>}
                <div className="tier-amount">{tier.amount}</div>
                <div className="tier-impact">{tier.impact}</div>
                <SmartLink className="btn btn-gold tier-btn" href={d.btnHref} target="_blank" rel="noopener noreferrer">
                  {d.btnLabel}
                </SmartLink>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="donate-methods">
          {d.methods.map((method, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="method-card">
                <span className="method-icon">{method.icon}</span>
                <div>
                  <strong>{method.title}</strong>
                  <span>{method.detail}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150}>
          <AllocBars />
        </Reveal>
        <Reveal delay={200}>
          <p className="donate-note">{d.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
