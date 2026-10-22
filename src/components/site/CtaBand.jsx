import { useContent } from '../../context/ContentContext';
import SmartLink from '../SmartLink';

export default function CtaBand() {
  const { content } = useContent();
  const c = content.cta;
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div className="cta-title"><span>{c.icon}</span><h2>{c.title} <em>{c.titleAccent}</em></h2></div>
        <p>{c.text}</p>
        <SmartLink className="btn btn-gold" href={c.btnHref}>{c.btnLabel} <span>→</span></SmartLink>
      </div>
    </section>
  );
}
