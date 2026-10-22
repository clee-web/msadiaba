import { useContent } from '../../context/ContentContext';
import SmartLink from '../SmartLink';

export default function About() {
  const { content } = useContent();
  const a = content.about;
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div>
          <p className="eyebrow">{a.eyebrow}</p>
          <h2>{a.title} <em>{a.titleAccent}</em></h2>
        </div>
        <p>{a.text}</p>
        <SmartLink className="text-link" href={a.linkHref}>{a.linkLabel} <span>→</span></SmartLink>
      </div>
    </section>
  );
}
