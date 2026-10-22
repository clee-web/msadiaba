import { useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { getPath } from '../../lib/paths';
import { DEFAULT_CONTENT } from '../../content/defaults';

function FieldRow({ label, children }) {
  return (
    <label className="afield">
      <span className="afield-label">{label}</span>
      {children}
    </label>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <FieldRow label={label}>
      <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </FieldRow>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <FieldRow label={label}>
      <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </FieldRow>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <FieldRow label={label}>
      <span className="acolor">
        <input type="color" value={value ?? '#000000'} onChange={(e) => onChange(e.target.value)} />
        <code>{value}</code>
      </span>
    </FieldRow>
  );
}

function ImageField({ label, value, onChange, path }) {
  const { images, uploadImage } = useContent();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const library = Object.values(images);

  const preview = value?.startsWith('idb:') ? images[value.slice(4)]?.url : value;

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const ref = await uploadImage(file);
      onChange(ref);
    } catch {
      setError('Upload failed. Try a smaller image.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const defaultValue = path ? getPath(DEFAULT_CONTENT, path) : undefined;

  return (
    <div className="afield">
      <span className="afield-label">{label}</span>
      <div className="aimage">
        {preview ? <img className="aimage-preview" src={preview} alt="" /> : <div className="aimage-preview aimage-empty">No image</div>}
        <div className="aimage-actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="avisually-hidden-file"
            aria-label={`${label} — upload file`}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button type="button" className="abtn" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? 'Uploading…' : 'Upload new'}
          </button>
          {library.length > 0 && (
            <select
              className="aimage-pick"
              value=""
              onChange={(e) => e.target.value && onChange(e.target.value)}
            >
              <option value="">Pick from library…</option>
              {library.map((img) => (
                <option key={img.id} value={`idb:${img.id}`}>{img.name}</option>
              ))}
            </select>
          )}
          {typeof defaultValue === 'string' && value !== defaultValue && (
            <button type="button" className="abtn abtn-ghost" onClick={() => onChange(defaultValue)}>
              Reset to default
            </button>
          )}
        </div>
        {error && <p className="aerror">{error}</p>}
      </div>
    </div>
  );
}

function ListEditor({ def, content, update }) {
  const items = getPath(content, def.path) || [];
  const isStringList = !!def.stringItems;

  const setItems = (next) => update(def.path, next);
  const move = (index, dir) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item);
    setItems(next);
  };
  const remove = (index) => setItems(items.filter((_, i) => i !== index));
  const add = () => setItems([...items, isStringList ? def.defaultItem : structuredClone(def.defaultItem)]);

  return (
    <div className="afield">
      <span className="afield-label">{def.label}</span>
      <div className="alist">
        {items.map((item, index) => (
          <div className="alist-item" key={index}>
            <div className="alist-head">
              <strong>{def.itemLabel} {index + 1}</strong>
              <span className="alist-tools">
                <button type="button" title="Move up" disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
                <button type="button" title="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button>
                <button type="button" title="Delete" className="alist-del" onClick={() => remove(index)}>✕</button>
              </span>
            </div>
            {isStringList ? (
              <input
                type="text"
                value={item ?? ''}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = e.target.value;
                  setItems(next);
                }}
              />
            ) : (
              def.itemFields.map((f) => {
                const change = (v) => {
                  const next = [...items];
                  next[index] = { ...next[index], [f.key]: v };
                  setItems(next);
                };
                if (f.type === 'image') {
                  return <ImageField key={f.key} label={f.label} value={item[f.key]} onChange={change} />;
                }
                if (f.type === 'textarea') {
                  return <TextAreaField key={f.key} label={f.label} value={item[f.key]} onChange={change} />;
                }
                return <TextField key={f.key} label={f.label} value={item[f.key]} onChange={change} />;
              })
            )}
          </div>
        ))}
        <button type="button" className="abtn abtn-block" onClick={add}>+ Add {def.itemLabel.toLowerCase()}</button>
      </div>
    </div>
  );
}

export default function Field({ def, content, update }) {
  const value = getPath(content, def.path);
  const onChange = (v) => update(def.path, v);

  switch (def.type) {
    case 'text':
      return <TextField label={def.label} value={value} onChange={onChange} />;
    case 'textarea':
      return <TextAreaField label={def.label} value={value} onChange={onChange} />;
    case 'color':
      return <ColorField label={def.label} value={value} onChange={onChange} />;
    case 'image':
      return <ImageField label={def.label} value={value} onChange={onChange} path={def.path} />;
    case 'list':
      return <ListEditor def={def} content={content} update={update} />;
    default:
      return null;
  }
}
