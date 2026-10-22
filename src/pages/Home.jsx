import { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import Topbar from '../components/site/Topbar';
import Header from '../components/site/Header';
import Hero from '../components/site/Hero';
import Ticker from '../components/site/Ticker';
import Values from '../components/site/Values';
import Story from '../components/site/Story';
import ImpactStats from '../components/site/ImpactStats';
import Services from '../components/site/Services';
import College from '../components/site/College';
import Gallery from '../components/site/Gallery';
import Testimonial from '../components/site/Testimonial';
import CtaBand from '../components/site/CtaBand';
import Donate from '../components/site/Donate';
import Faq from '../components/site/Faq';
import About from '../components/site/About';
import Footer from '../components/site/Footer';
import SmartLink from '../components/SmartLink';

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      if (ref.current) ref.current.style.width = `${max > 0 ? (el.scrollTop / max) * 100 : 0}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true"></div>;
}

function DonatePill() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <SmartLink href="#donate" className={`donate-pill${show ? ' show' : ''}`} aria-label="Donate">
      ♥ Donate
    </SmartLink>
  );
}

export default function Home() {
  const { content } = useContent();
  const t = content.theme;

  return (
    <div
      className="site-root"
      style={{
        '--navy': t.navy,
        '--navy-deep': t.navyDeep,
        '--blue': t.blue,
        '--gold': t.gold,
        '--gold-light': t.goldLight,
        '--green': t.green,
        '--pale': t.pale,
        '--ink': t.ink,
        '--muted': t.muted,
      }}
    >
      <ScrollProgress />
      <div className="grain" aria-hidden="true"></div>
      <Topbar />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Values />
        <Story />
        <ImpactStats />
        <Services />
        <College />
        <Gallery />
        <Testimonial />
        <CtaBand />
        <Donate />
        <Faq />
        <About />
      </main>
      <Footer />
      <DonatePill />
    </div>
  );
}
