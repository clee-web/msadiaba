import { useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';
import Reveal from '../Reveal';

export default function Hero() {
  const { content } = useContent();
  const h = content.hero;

  useEffect(() => {
    let raf;
    const shapes = document.querySelectorAll('.hero-shape');
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        shapes.forEach((shape, i) => {
          shape.style.transform = `translateY(${y * (i === 0 ? 0.08 : -0.05)}px)`;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-shape shape-one"></div>
      <div className="hero-shape shape-two"></div>
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
        <Reveal className="hero-visual" delay={180}>
          <div className="hero-photo-main">
            <CmsImage imageRef={h.image} alt="Learners gaining practical technical skills" />
            <div className="photo-label"><strong>{h.photoLabelTitle}</strong><span>{h.photoLabelText}</span></div>
          </div>
          <div className="hero-stamp"><span>{h.stampTop}</span><strong>{h.stampMain}</strong><small>{h.stampSub}</small></div>
          <div className="floating-card">
            <span className="floating-icon">{h.floatIcon}</span>
            <span><strong>{h.floatTitle}</strong><small>{h.floatText}</small></span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
