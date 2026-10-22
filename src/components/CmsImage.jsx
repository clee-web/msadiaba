import { useContent } from '../context/ContentContext';

export default function CmsImage({ imageRef, alt = '', ...props }) {
  const { resolveImage } = useContent();
  const src = resolveImage(imageRef);
  if (!src) return <div className="img-missing" {...props}>No image</div>;
  return <img src={src} alt={alt} {...props} />;
}
