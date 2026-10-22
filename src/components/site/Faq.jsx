import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import Reveal from '../Reveal';

export default function Faq() {
  const { content } = useContent();
  const faq = content.faq || { items: [] };
  const [open, setOpen] = useState(0);

  if (!faq.items?.length) return null;

  return (
    <section className="faq-section">
      <div className="container">
        <Reveal className="faq-head">
          <p className="eyebrow centered">{faq.eyebrow}</p>
          <h2>{faq.title} <em>{faq.titleAccent}</em></h2>
        </Reveal>
        <Reveal className="faq-wrap" delay={120}>
          {faq.items.map((item, i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {item.q}
                <span className="faq-icon" aria-hidden>+</span>
              </button>
              <div className="faq-a">
                <div><p>{item.a}</p></div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
