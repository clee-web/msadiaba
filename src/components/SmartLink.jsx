export default function SmartLink({ href, className, children, onNavigate, ...props }) {
  const handleClick = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      onNavigate?.();
    }
  };
  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
