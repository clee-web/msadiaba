import { useContent } from '../../context/ContentContext';
import SmartLink from '../SmartLink';

export default function Services() {
  const { content } = useContent();
  const s = content.services;
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow centered">{s.eyebrow}</p>
          <h2>{s.title}</h2>
          <p>{s.subtitle}</p>
        </div>
        <div className="services-grid">
          {s.items.map((service, i) => (
            <article className="service-card" key={i}>
              <div className="service-icon">{service.icon}</div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <SmartLink href={service.linkHref} aria-label={`${service.linkLabel}: ${service.title}`}>
                  {service.linkLabel} <span>→</span>
                </SmartLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
