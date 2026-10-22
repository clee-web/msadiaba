export function scrollToHash(href) {
  if (!href || !href.startsWith('#')) return false;
  const el = document.querySelector(href);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth' });
  history.replaceState(null, '', href);
  return true;
}
