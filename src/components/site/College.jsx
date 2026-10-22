import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';

export default function College() {
  const { content } = useContent();
  const c = content.college;
  return (
    <section className="college-section" id="college">
      <div className="container college-grid">
        <div className="college-image">
          <CmsImage imageRef={c.image} alt="Technical and vocational training in a practical workshop" />
          <span className="image-tag">{c.imageTag}</span>
        </div>
        <div className="college-copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2>{c.title}<br /><em>{c.titleAccent}</em></h2>
          <p>{c.text}</p>
          <SmartLink className="btn btn-gold" href={c.btnHref}>{c.btnLabel} <span>→</span></SmartLink>
        </div>
        <div className="course-panel">
          <h3><span>✦</span> OUR COURSES</h3>
          <ul>
            {c.courses.map((course, i) => <li key={i}>{course}</li>)}
          </ul>
          <p className="course-note">{c.coursesNote}</p>
        </div>
      </div>
    </section>
  );
}
