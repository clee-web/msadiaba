import { useContent } from '../../context/ContentContext';

export default function Values() {
  const { content } = useContent();
  return (
    <section className="values-strip">
      <div className="container values-grid">
        {content.values.items.map((value, i) => (
          <article className="value" key={i}>
            <div className="value-icon">{value.icon}</div>
            <div><h3>{value.title}</h3><p>{value.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
