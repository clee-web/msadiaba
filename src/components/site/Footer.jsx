import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';

export default function Footer() {
  const { content } = useContent();
  const { brand, footer, nav } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <SmartLink className="footer-brand" href="#home">
            <CmsImage imageRef={brand.logo} alt="" />
            <span><strong>{brand.name}</strong><small>{brand.tagline}</small></span>
          </SmartLink>
          <SmartLink className="btn btn-gold footer-donate" href="#donate">♥ Donate</SmartLink>
          <nav className="footer-explore" aria-label="Footer navigation">
            {nav.items.map((item, i) => (
              <SmartLink key={i} href={item.href}>{item.label.replace('♥', '').trim()}</SmartLink>
            ))}
          </nav>
        </div>
        <div className="footer-item">
          <span className="footer-icon">☎</span>
          <div>
            <strong>Call / WhatsApp</strong>
            <a href={footer.phoneHref}>{footer.phone}</a>
            <small>Talk to our team</small>
          </div>
        </div>
        <div className="footer-item">
          <span className="footer-icon">✉</span>
          <div>
            <strong>Email us</strong>
            <a href={`mailto:${footer.email}`}>{footer.email}</a>
            <small>We'd love to hear from you</small>
          </div>
        </div>
        <div className="footer-item">
          <span className="footer-icon">⌖</span>
          <div>
            <strong>Find us</strong>
            <span>{footer.address}</span>
            <small>{footer.box}</small>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {year} {brand.name}. All rights reserved.</span>
          <span>{footer.bottomRight.replace('🌿', '')} <b>🌿</b></span>
          <SmartLink href="#home">Back to top ↑</SmartLink>
        </div>
      </div>
    </footer>
  );
}
