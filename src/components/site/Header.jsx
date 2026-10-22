import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';

const SECTION_IDS = ['home', 'need', 'impact', 'services', 'college', 'donate', 'about'];

export default function Header() {
  const { content } = useContent();
  const { brand, nav } = content;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const pos = window.scrollY + 140;
      let current = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-wrap">
        <SmartLink className="brand" href="#home" onNavigate={closeMenu} aria-label={`${brand.name} home`}>
          <CmsImage imageRef={brand.logo} alt={`${brand.name} logo`} />
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.tagline.split('•').map((part, i) => (
              <span key={i}>{i > 0 && <i>•</i>}{part.trim()}{' '}</span>
            ))}</small>
          </span>
        </SmartLink>
        <button
          className="menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '×' : '☰'}
        </button>
        <nav className={`main-nav${open ? ' open' : ''}`} aria-label="Main navigation">
          {nav.items.map((item, i) => {
            const id = item.href.replace('#', '');
            return (
              <SmartLink
                key={i}
                href={item.href}
                onNavigate={closeMenu}
                className={item.cta ? 'nav-cta' : active === id ? 'active' : undefined}
              >
                {item.label}
              </SmartLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
