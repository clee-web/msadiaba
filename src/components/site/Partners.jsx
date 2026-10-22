import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';

export default function Partners() {
  const { content } = useContent();
  const p = content.partners;
  if (!p || !p.items || !p.items.length) return null;

  return (
    <section className="partners-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow centered">{p.eyebrow}</p>
          <h2>{p.title} <em>{p.titleAccent}</em></h2>
          {p.subtitle && <p>{p.subtitle}</p>}
        </div>
        <div className="partners-row">
          {p.items.map((partner, i) => {
            const external = partner.url && /^https?:/.test(partner.url);
            return (
              <a
                key={i}
                className="partner-badge"
                href={partner.url || undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                {partner.logo
                  ? <CmsImage imageRef={partner.logo} alt={partner.name} />
                  : <span>{partner.name}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
