import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';

export default function Story() {
  const { content } = useContent();
  const s = content.story;
  return (
    <section className="story-section" id="need">
      <div className="container story-grid">
        <div className="story-copy">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2>{s.title} <em>{s.titleAccent}</em></h2>
          {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <SmartLink className="text-link" href={s.linkHref}>{s.linkLabel} <span>→</span></SmartLink>
        </div>
        <div className="story-media">
          <CmsImage imageRef={s.image} alt={s.imageTag} />
          <span className="image-tag">{s.imageTag}</span>
        </div>
      </div>
    </section>
  );
}
