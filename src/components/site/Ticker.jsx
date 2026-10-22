import { useContent } from '../../context/ContentContext';

export default function Ticker() {
  const { content } = useContent();
  const words = content.ticker?.words || [];
  if (!words.length) return null;
  const row = [...words, ...words];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row.map((word, i) => (
          <span key={i}>{word}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}
