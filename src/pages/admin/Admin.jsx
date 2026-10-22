import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { SECTIONS } from './schemas';
import Field from './fields';
import { changePassword, ensureAdminAccount, isAuthed, setAuthed, verifyPassword, DEFAULT_PASSWORD } from '../../lib/auth';
import './admin.css';

function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    await ensureAdminAccount();
    if (await verifyPassword(password)) {
      setAuthed(true);
      onSuccess();
    } else {
      setError('Wrong password. Try again.');
    }
    setBusy(false);
  };

  return (
    <div className="alogin-wrap">
      <form className="alogin-card" onSubmit={submit}>
        <h1>Madiaba CBO</h1>
        <p className="alogin-sub">Admin Dashboard</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="aerror">{error}</p>}
        <button className="abtn abtn-block" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        <p className="alogin-hint">Default password: <code>{DEFAULT_PASSWORD}</code> — change it in Security after signing in.</p>
        <Link className="alogin-back" to="/">← Back to website</Link>
      </form>
    </div>
  );
}

function ImageLibrary() {
  const { images, deleteImage } = useContent();
  const library = Object.values(images).sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="apanel">
      <h2>Image Library</h2>
      <p className="apanel-note">
        Every image you upload appears here and can be reused in any section. Images are stored in this browser
        and included in backups. Upload photos from the section editors or reuse them here.
      </p>
      {library.length === 0 ? (
        <p className="apanel-note">No uploaded images yet. Upload one from any “Image” field in the section editors.</p>
      ) : (
        <div className="alib-grid">
          {library.map((img) => (
            <div className="alib-card" key={img.id}>
              <img src={img.url} alt={img.name} />
              <div className="alib-meta">
                <span title={img.name}>{img.name}</span>
                <small>{(img.size / 1024).toFixed(0)} KB</small>
              </div>
              <button type="button" className="abtn abtn-ghost abtn-danger" onClick={() => {
                if (window.confirm(`Delete “${img.name}”? Sections using it will show a placeholder.`)) deleteImage(img.id);
              }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Backup() {
  const { exportAll, importAll, resetAll } = useContent();
  const fileRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleImport = async (file) => {
    if (!file) return;
    if (!window.confirm('Importing replaces ALL current content and images. Continue?')) return;
    try {
      await importAll(file);
      setMessage('Backup imported successfully.');
    } catch (err) {
      setMessage(`Import failed: ${err.message}`);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="apanel">
      <h2>Backup & Restore</h2>
      <p className="apanel-note">
        All content and photos are saved in this browser (localStorage + IndexedDB) and update the live site instantly.
        Use export/import to move your content to another computer or keep a safe copy.
      </p>
      <div className="abackup-actions">
        <button type="button" className="abtn" onClick={exportAll}>Export backup (JSON)</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => handleImport(e.target.files?.[0])} />
        <button type="button" className="abtn abtn-ghost" onClick={() => fileRef.current?.click()}>Import backup</button>
        <button type="button" className="abtn abtn-ghost abtn-danger" onClick={() => {
          if (window.confirm('Reset ALL content to the original defaults? Uploaded images stay in the library.')) {
            resetAll();
            setMessage('Content reset to defaults.');
          }
        }}>
          Reset content to defaults
        </button>
      </div>
      {message && <p className="apanel-note">{message}</p>}
    </div>
  );
}

function Security() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 6) { setMessage('New password must be at least 6 characters.'); return; }
    if (next !== confirm) { setMessage('New passwords do not match.'); return; }
    const ok = await changePassword(current, next);
    setMessage(ok ? 'Password changed.' : 'Current password is wrong.');
    if (ok) { setCurrent(''); setNext(''); setConfirm(''); }
  };

  return (
    <div className="apanel">
      <h2>Security</h2>
      <p className="apanel-note">
        This password protects the admin screen. It is stored (hashed) in this browser — for stronger protection
        a server-side login would be needed.
      </p>
      <form className="asec-form" onSubmit={submit}>
        <label className="afield"><span className="afield-label">Current password</span>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></label>
        <label className="afield"><span className="afield-label">New password (min 6 characters)</span>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required /></label>
        <label className="afield"><span className="afield-label">Repeat new password</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></label>
        <button className="abtn" type="submit">Change password</button>
        {message && <p className="apanel-note">{message}</p>}
      </form>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const { content, update } = useContent();
  const [tab, setTab] = useState(SECTIONS[0].id);

  return (
    <div className="aadmin">
      <aside className="aside">
        <div className="aside-brand">
          <strong>Madiaba CBO</strong>
          <small>Admin Dashboard</small>
        </div>
        <nav className="aside-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} className={tab === s.id ? 'active' : ''} onClick={() => setTab(s.id)}>
              {s.label}
            </button>
          ))}
          <button className={tab === 'library' ? 'active' : ''} onClick={() => setTab('library')}>Image Library</button>
          <button className={tab === 'backup' ? 'active' : ''} onClick={() => setTab('backup')}>Backup & Restore</button>
          <button className={tab === 'security' ? 'active' : ''} onClick={() => setTab('security')}>Security</button>
        </nav>
        <div className="aside-foot">
          <Link to="/">View website</Link>
          <button onClick={onLogout}>Sign out</button>
        </div>
      </aside>
      <main className="amain">
        <div className="amain-bar">
          <span>Changes save automatically and appear on the site instantly.</span>
          <Link className="abtn abtn-sm" to="/">View site ↗</Link>
        </div>
        {SECTIONS.filter((s) => s.id === tab).map((s) => (
          <div className="apanel" key={s.id}>
            <h2>{s.label}</h2>
            {s.fields.map((def, i) => (
              <Field key={i} def={def} content={content} update={update} />
            ))}
          </div>
        ))}
        {tab === 'library' && <ImageLibrary />}
        {tab === 'backup' && <Backup />}
        {tab === 'security' && <Security />}
      </main>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthedState] = useState(isAuthed());
  if (!authed) return <Login onSuccess={() => setAuthedState(true)} />;
  return <Dashboard onLogout={() => { setAuthed(false); setAuthedState(false); }} />;
}
