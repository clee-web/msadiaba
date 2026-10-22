import { useContent } from '../../context/ContentContext';
import SmartLink from '../SmartLink';

export default function FooterCta() {
  const { content } = useContent();
  const c = content.footerCta;
  if (!c || !c.buttons || !c.buttons.length) return null;

  return (
    <section className="footer-cta">
      <div className="container footer-cta-inner">
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
        <div className="footer-cta-actions">
          {c.buttons.map((btn, i) => (
            <SmartLink key={i} className={`btn ${i === 0 ? 'btn-gold' : 'btn-ghost'}`} href={btn.href}>
              {btn.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
