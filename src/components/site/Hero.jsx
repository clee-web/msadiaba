import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';
import Reveal from '../Reveal';

const SLIDE_MS = 6500;

export default function Hero() {
  const { content } = useContent();
  const h = content.hero;
  const slides = ((h.slides && h.slides.length ? h.slides : [h.image]).filter(Boolean));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero" id="home">
      <div className="hero-slides" aria-hidden="true">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide${i === index % slides.length ? ' active' : ''}`}>
            <CmsImage imageRef={slide} alt="" />
          </div>
        ))}
      </div>
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <p className="eyebrow">{h.eyebrow}<span></span></p>
          <h1>{h.title} <em>{h.titleAccent}</em></h1>
          <p className="hero-lead">{h.lead}</p>
          <div className="hero-actions">
            <SmartLink className="btn btn-gold" href={h.btn1Href}>{h.btn1Label} <span>→</span></SmartLink>
            <SmartLink className="btn btn-outline" href={h.btn2Href}>{h.btn2Label} <span>↗</span></SmartLink>
          </div>
          <div className="hero-note"><span className="note-icon">✓</span> {h.note}</div>
        </Reveal>
      </div>
    </section>
  );
}
