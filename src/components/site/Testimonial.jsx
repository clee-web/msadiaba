import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import Reveal from '../Reveal';

const INTERVAL = 6000;

export default function Testimonial() {
  const { content } = useContent();
  const items = content.testimonial?.items || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (!items.length) return null;
  const current = items[index % items.length];

  return (
    <section className="testimonial-section">
      <div className="container">
        <Reveal>
          <div
            className="testimonial"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="quote-mark" aria-hidden>“</div>
            <blockquote key={index}>{current.quote}</blockquote>
            <cite>{current.name}<small>{current.role}</small></cite>
            {items.length > 1 && (
              <div className="t-controls">
                <button type="button" aria-label="Previous quote" onClick={() => setIndex((index - 1 + items.length) % items.length)}>←</button>
                <div className="t-dots">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Quote ${i + 1}`}
                      className={i === index % items.length ? 'active' : ''}
                      onClick={() => setIndex(i)}
                    ></button>
                  ))}
                </div>
                <button type="button" aria-label="Next quote" onClick={() => setIndex((index + 1) % items.length)}>→</button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
