const ICONS = {
  stoves: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <circle cx="8" cy="13" r="2" />
      <circle cx="16" cy="13" r="2" />
      <path d="M8 17h8" />
      <path d="M7 5c0-1 .8-1 .8-2M12 5c0-1 .8-1 .8-2M17 5c0-1 .8-1 .8-2" />
    </>
  ),
  agriculture: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4.5 3.5-8 9-8 0 5.5-3.5 9-9 9z" />
      <path d="M12 17c-3.5 0-6.5-2.5-6.5-6 3.8 0 6.5 2.3 6.5 6z" />
    </>
  ),
  youth: (
    <>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9z" />
      <path d="M6.5 11.2v4.1c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.1" />
      <path d="M21.5 9v5" />
    </>
  ),
  catering: (
    <>
      <path d="M3 18h18" />
      <path d="M4.5 17a7.5 7.5 0 0 1 15 0" />
      <path d="M12 9.5V8" />
      <circle cx="12" cy="7" r="1" />
    </>
  ),
  srh: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7M9 18h6" />
    </>
  ),
  justice: (
    <>
      <path d="M12 3v18M8 21h8M4 7h16" />
      <path d="M4 7 1.5 13a3 3 0 0 0 5 0z" />
      <path d="M20 7l-2.5 6a3 3 0 0 0 5 0z" />
    </>
  ),
  advocacy: (
    <>
      <path d="M3 10.5v3A1.5 1.5 0 0 0 4.5 15H7l8 4V5L7 9H4.5A1.5 1.5 0 0 0 3 10.5z" />
      <path d="M18 9a4 4 0 0 1 0 6" />
      <path d="M7 15v4" />
    </>
  ),
};

export default function ThematicIcon({ name }) {
  const icon = ICONS[name];
  if (!icon) return <span>{name}</span>;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon}
    </svg>
  );
}
