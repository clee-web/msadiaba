import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CONTENT_VERSION, DEFAULT_CONTENT } from '../content/defaults';
import { deepMerge, setPath } from '../lib/paths';
import { idbAll, idbClear, idbDelete, idbPut } from '../lib/db';

const CONTENT_KEY = 'madiaba-content-v1';

const ContentContext = createContext(null);

function loadSavedContent() {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.__v !== CONTENT_VERSION) return null;
    return deepMerge(DEFAULT_CONTENT, saved);
  } catch {
    return null;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => loadSavedContent() || DEFAULT_CONTENT);
  const [images, setImages] = useState({});
  const [ready, setReady] = useState(false);
  const objectUrls = useRef({});

  const refreshImages = useCallback(async () => {
    const records = await idbAll();
    for (const url of Object.values(objectUrls.current)) URL.revokeObjectURL(url);
    const map = {};
    const urls = {};
    for (const rec of records) {
      if (!objectUrls.current[rec.id]) objectUrls.current[rec.id] = URL.createObjectURL(rec.blob);
      urls[rec.id] = objectUrls.current[rec.id];
      map[rec.id] = { id: rec.id, name: rec.name, size: rec.size, url: urls[rec.id] };
    }
    objectUrls.current = urls;
    setImages(map);
  }, []);

  useEffect(() => {
    refreshImages().finally(() => setReady(true));
  }, [refreshImages]);

  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    } catch (err) {
      console.warn('Could not save content:', err);
    }
  }, [content]);

  const update = useCallback((path, value) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      setPath(next, path, value);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(CONTENT_KEY);
    setContent(structuredClone(DEFAULT_CONTENT));
  }, []);

  const uploadImage = useCallback(async (file) => {
    const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'image/jpeg' });
    const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await idbPut({ id, name: file.name, size: file.size, blob });
    await refreshImages();
    return `idb:${id}`;
  }, [refreshImages]);

  const deleteImage = useCallback(async (id) => {
    await idbDelete(id);
    if (objectUrls.current[id]) {
      URL.revokeObjectURL(objectUrls.current[id]);
      delete objectUrls.current[id];
    }
    await refreshImages();
  }, [refreshImages]);

  const resolveImage = useCallback((ref) => {
    if (!ref) return '';
    if (ref.startsWith('idb:')) return images[ref.slice(4)]?.url || '';
    return ref;
  }, [images]);

  const exportAll = useCallback(async () => {
    const records = await idbAll();
    const imageData = {};
    for (const rec of records) {
      imageData[rec.id] = { name: rec.name, dataUrl: await fileToDataUrl(rec.blob) };
    }
    const payload = { app: 'madiaba-cbo', version: 1, exportedAt: new Date().toISOString(), content, images: imageData };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madiaba-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importAll = useCallback(async (file) => {
    const payload = JSON.parse(await file.text());
    if (!payload || payload.app !== 'madiaba-cbo' || !payload.content) {
      throw new Error('Not a valid Madiaba CBO backup file.');
    }
    await idbClear();
    for (const [id, img] of Object.entries(payload.images || {})) {
      const res = await fetch(img.dataUrl);
      const blob = await res.blob();
      await idbPut({ id, name: img.name || 'imported', size: blob.size, blob });
    }
    await refreshImages();
    setContent(deepMerge(DEFAULT_CONTENT, payload.content));
  }, [refreshImages]);

  const value = useMemo(() => ({
    content, images, ready, update, resetAll,
    uploadImage, deleteImage, resolveImage, exportAll, importAll,
  }), [content, images, ready, update, resetAll, uploadImage, deleteImage, resolveImage, exportAll, importAll]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
