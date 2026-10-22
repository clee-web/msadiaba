import { useCallback, useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import CmsImage from '../CmsImage';
import SmartLink from '../SmartLink';
import ThematicIcon from './ThematicIcon';

export default function Services() {
  const { content, resolveImage } = useContent();
  const s = content.services || { items: [] };
  const items = s.items || [];
  const allPhotos = s.photos || [];
  const [album, setAlbum] = useState(null);

  const photosFor = useCallback(
    (area) => allPhotos.filter((p) => p.area === area),
    [allPhotos]
  );

  const openAlbum = useCallback(
    (area, index) => {
      const photos = photosFor(area);
      if (photos.length) setAlbum({ area, index });
    },
    [photosFor]
  );

  const close = useCallback(() => setAlbum(null), []);
  const step = useCallback(
    (dir) => setAlbum((a) => {
      if (!a) return a;
      const total = photosFor(a.area).length;
      return { ...a, index: (a.index + dir + total) % total };
    }),
    [photosFor]
  );

  useEffect(() => {
    if (!album) return undefined;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [album, close, step]);

  const albumPhotos = album ? photosFor(album.area) : [];
  const currentPhoto = album && albumPhotos.length ? albumPhotos[album.index] : null;
  const albumTitle = album ? (items.find((it) => it.icon === album.area)?.title || '') : '';

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow centered">{s.eyebrow}</p>
          <h2>{s.title} {s.titleAccent && <em>{s.titleAccent}</em>}</h2>
          <p>{s.subtitle}</p>
        </div>
        <div className="services-grid">
          {items.map((service, i) => {
            const photos = photosFor(service.icon);
            const cover = photos[0];
            return (
              <article className={`service-card${cover ? ' has-photo' : ''}`} key={i}>
                <span className="service-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                {cover && (
                  <button
                    type="button"
                    className="service-photo"
                    onClick={() => openAlbum(service.icon, 0)}
                    aria-label={`View photos: ${service.title}`}
                  >
                    <CmsImage imageRef={cover.image} alt={cover.caption || service.title} />
                    {photos.length > 1 && (
                      <span className="service-photo-count">{photos.length} photos</span>
                    )}
                    <span className="service-zoom" aria-hidden>⤢</span>
                  </button>
                )}
                <div className="service-icon"><ThematicIcon name={service.icon} /></div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <SmartLink href={service.linkHref} aria-label={`${service.linkLabel}: ${service.title}`}>
                    {service.linkLabel} <span>→</span>
                  </SmartLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {currentPhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={albumTitle} onClick={close}>
          <span className="lb-count">{album.area.toUpperCase()} — {album.index + 1} / {albumPhotos.length}</span>
          <button type="button" className="lb-btn lb-close" aria-label="Close" onClick={close}>✕</button>
          <button
            type="button"
            className="lb-btn lb-prev"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
          >←</button>
          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <img src={resolveImage(currentPhoto.image)} alt={currentPhoto.caption || albumTitle} />
            <figcaption>{albumTitle}{currentPhoto.caption ? ` — ${currentPhoto.caption}` : ''}</figcaption>
          </figure>
          <button
            type="button"
            className="lb-btn lb-next"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); step(1); }}
          >→</button>
        </div>
      )}
    </section>
  );
}
