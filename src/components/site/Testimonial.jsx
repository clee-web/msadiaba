import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import Reveal from '../Reveal';

const AVATAR_COLORS = ['#073b68', '#24824a', '#d6a51b'];

const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function Testimonial() {
  const { content } = useContent();
  const t = content.testimonial || {};
  const items = t.items || [];
  if (!items.length) return null;

  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow centered">{t.eyebrow}</p>
          <h2>{t.title} <em>{t.titleAccent}</em></h2>
        </div>
        <div className="t-grid">
          {items.map((item, i) => (
            <Reveal className="t-card" key={i} delay={i * 90}>
              <div className="quote-mark" aria-hidden>“</div>
              <blockquote>{item.quote}</blockquote>
              <div className="t-person">
                {item.photo ? (
                  <span className="t-avatar"><CmsImage imageRef={item.photo} alt="" /></span>
                ) : (
                  <span className="t-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }} aria-hidden>
                    {initials(item.name || '?')}
                  </span>
                )}
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
