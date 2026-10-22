import { useContent } from '../../context/ContentContext';

export default function Topbar() {
  const { content } = useContent();
  const { topbar } = content;
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="quick-contact">
          <a href={topbar.phoneHref}><span aria-hidden>☎ </span><span>{topbar.phone}</span></a>
          <a href={`mailto:${topbar.email}`}><span aria-hidden>✉ </span><span>{topbar.email}</span></a>
          <span><span aria-hidden>⌖ </span><span>{topbar.location}</span></span>
        </div>
        <p>{topbar.tagline}</p>
      </div>
    </div>
  );
}
