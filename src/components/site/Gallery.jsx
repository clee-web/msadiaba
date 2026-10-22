import { useCallback, useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import Reveal from '../Reveal';

export default function Gallery() {
  const { content } = useContent();
  const gallery = content.gallery || { items: [] };
  const items = gallery.items || [];
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback((dir) => {
    setOpenIndex((i) => (i === null ? null : (i + dir + items.length) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (openIndex === null) return undefined;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex, close, step]);

  if (!items.length) return null;
  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section className="gallery-section">
      <div className="container">
        <Reveal className="gallery-head">
          <p className="eyebrow centered">{gallery.eyebrow}</p>
          <h2>{gallery.title} <em>{gallery.titleAccent}</em></h2>
          {gallery.subtitle && <p>{gallery.subtitle}</p>}
        </Reveal>
        <div className="gallery-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 90} className="gallery-cell">
              <figure className="gallery-item" onClick={() => setOpenIndex(i)}>
                <CmsImage imageRef={item.image} alt={item.caption || 'Gallery photo'} />
                <span className="gallery-zoom" aria-hidden>⤢</span>
                {item.caption && <figcaption className="gallery-cap">{item.caption}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.caption || 'Photo viewer'} onClick={close}>
          <span className="lb-count">{openIndex + 1} / {items.length}</span>
          <button type="button" className="lb-btn lb-close" aria-label="Close" onClick={close}>✕</button>
          <button
            type="button"
            className="lb-btn lb-prev"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
          >←</button>
          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <CmsImage imageRef={current.image} alt={current.caption || 'Gallery photo'} />
            {current.caption && <figcaption>{current.caption}</figcaption>}
          </figure>
          <button
            type="button"
            className="lb-btn lb-next"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); step(1); }}
          >→</button>
        </div>
      )}
    </section>
  );
}
