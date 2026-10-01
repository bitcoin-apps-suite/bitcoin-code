/**
 * Phone-first bCode app. Rendered instead of the desktop IDE when the
 * viewport is <= 768px or the page is inside bWallet (see shell.ts).
 *
 * Screens: projects -> files -> full-screen CodeMirror editor.
 * Extras: symbol bar above the keyboard, Run preview (sandboxed iframe),
 * AI assistant in a bottom sheet (uses the user's own API key, kept in
 * this browser only by AIService), silent BRC-100 sign-in inside bWallet.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './mobile-app.css';
import { hasCWI, signInWithCWI, CWIUser } from './cwi';
import {
  CodeProject, buildPreview, deleteProject, extractCode, languageOf, listProjects,
  newProject, saveProject, validateFileName,
} from './projectStore';
import MobileCodeEditor, { MobileCodeEditorHandle } from './MobileCodeEditor';
import { AIService, AIMessage } from '../services/AIService';
import { HandCashService } from '../services/HandCashService';

export interface MobileAppProps {
  appName: string;
  user: { handle: string; publicKey?: string } | null;
  onLogin: (user: CWIUser) => void;
  /** Fallback sign-in for normal mobile browsers (no window.CWI). */
  onRequestLogin: () => void;
}

const SYMBOLS = ['⇥', '{', '}', '(', ')', '[', ']', ';', ':', '=', '<', '>', '/', '"', "'", '`', '$', '.', ',', '!', '&', '|', '+', '-', '*'];
const PROVIDERS = [
  { id: 'claude', name: 'Claude' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'gemini', name: 'Gemini' },
];

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
  return inset;
}

function configuredProviders(): string[] {
  try {
    const raw = localStorage.getItem('aiApiKeys');
    const keys = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return Object.keys(keys).filter(k => keys[k]);
  } catch {
    return [];
  }
}

interface ChatMsg { role: 'user' | 'assistant'; content: string; error?: boolean }

export default function MobileApp({ appName, user, onLogin, onRequestLogin }: MobileAppProps) {
  const [projects, setProjects] = useState<CodeProject[]>(() => listProjects());
  const [project, setProject] = useState<CodeProject | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const editorRef = useRef<MobileCodeEditorHandle>(null);
  const kb = useKeyboardInset();
  const cwi = hasCWI();

  // Silent BRC-100 sign-in inside bWallet: no chooser, no modal.
  useEffect(() => {
    if (user || !cwi) return;
    let cancelled = false;
    setSigningIn(true);
    withTimeout(signInWithCWI(), 10000)
      .then(u => { if (!cancelled) onLogin(u); })
      .catch(err => console.warn('bWallet silent sign-in failed', err))
      .finally(() => { if (!cancelled) setSigningIn(false); });
    return () => { cancelled = true; };
  }, [user, cwi, onLogin]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1800);
  }, []);

  /** Project with the open file's draft applied. */
  const current = useMemo((): CodeProject | null => {
    if (!project) return null;
    if (!fileName) return project;
    return { ...project, files: project.files.map(f => (f.name === fileName ? { ...f, content: draft } : f)) };
  }, [project, fileName, draft]);

  const persist = useCallback((): CodeProject | null => {
    if (!current) return null;
    const saved = saveProject(current);
    setProject(saved);
    setProjects(listProjects());
    setDirty(false);
    return saved;
  }, [current]);

  const openProject = (p: CodeProject) => { setProject(p); setFileName(null); };

  const openFile = (name: string) => {
    if (!project) return;
    setFileName(name);
    setDraft(project.files.find(f => f.name === name)?.content ?? '');
    setDirty(false);
  };

  const back = () => {
    if (dirty) persist();
    if (fileName) { setFileName(null); setEditing(false); return; }
    setProject(null);
    setProjects(listProjects());
  };

  const createProject = () => {
    const name = window.prompt('Project name', `Project ${listProjects().length + 1}`);
    if (!name || !name.trim()) return;
    const p = saveProject(newProject(name.trim()));
    setProjects(listProjects());
    openProject(p);
  };

  const createFile = () => {
    if (!current) return;
    const name = window.prompt('File name (e.g. utils.js)', 'new.js');
    if (name === null) return;
    const err = validateFileName(current, name);
    if (err) { flash(err); return; }
    const saved = saveProject({ ...current, files: [...current.files, { name: name.trim(), content: '' }] });
    setProject(saved);
    setProjects(listProjects());
    setFileName(name.trim());
    setDraft('');
    setDirty(false);
  };

  const removeFile = (name: string) => {
    if (!current || !window.confirm(`Delete ${name}?`)) return;
    const saved = saveProject({ ...current, files: current.files.filter(f => f.name !== name) });
    setProject(saved);
    setProjects(listProjects());
  };

  const handleSave = () => { if (persist()) flash('Saved'); };

  const handleRun = () => {
    const p = current;
    if (!p) return;
    if (dirty) persist();
    setPreview(buildPreview(p));
  };

  const handleShare = async () => {
    if (!current) return;
    const file = fileName ? current.files.find(f => f.name === fileName) : null;
    const title = file ? file.name : current.name;
    const text = file ? file.content : buildPreview(current);
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    try {
      if (nav.share) { await nav.share({ title, text }); return; }
      await navigator.clipboard.writeText(text);
      flash('Copied');
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') flash('Share unavailable');
    }
  };

  const onEdit = useCallback((v: string) => { setDraft(v); setDirty(true); }, []);

  const insertSymbol = (s: string) => editorRef.current?.insert(s === '⇥' ? '  ' : s);

  const signedIn = !!user;
  const title = fileName ?? project?.name ?? appName;
  const inEditor = !!(project && fileName);

  return (
    <div className="bsm-root bcm-root">
      <header className="bsm-topbar">
        {project ? (
          <button className="bsm-icon-btn" onClick={back} aria-label="Back">‹</button>
        ) : (
          <span className="bsm-logo" aria-hidden="true">{'</>'}</span>
        )}
        <div className="bsm-title">
          {title}
          {dirty && <span className="bsm-dot" aria-label="Unsaved" />}
        </div>
        {signedIn ? (
          <span className="bsm-user" title={user?.publicKey}>{user?.handle}</span>
        ) : signingIn ? (
          <span className="bsm-user">Signing in…</span>
        ) : cwi ? null : (
          <button className="bsm-pill" onClick={onRequestLogin}>Sign in</button>
        )}
      </header>

      {!project && (
        <main className="bsm-home">
          {projects.length === 0 ? (
            <div className="bsm-empty">
              <div className="bsm-empty-icon">{'</>'}</div>
              <p>No projects yet</p>
              <button className="bsm-primary" onClick={createProject}>Create a project</button>
            </div>
          ) : (
            <ul className="bsm-list">
              {projects.map(p => (
                <li key={p.id} className="bsm-list-item">
                  <button className="bsm-list-main" onClick={() => openProject(p)}>
                    <span className="bsm-list-icon">{'{}'}</span>
                    <span className="bsm-list-text">
                      <span className="bsm-list-title">{p.name}</span>
                      <span className="bsm-list-sub">
                        {p.files.length} files · {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </span>
                  </button>
                  <button
                    className="bsm-icon-btn bsm-muted"
                    aria-label={`Delete ${p.name}`}
                    onClick={() => {
                      if (window.confirm(`Delete "${p.name}"?`)) { deleteProject(p.id); setProjects(listProjects()); }
                    }}
                  >×</button>
                </li>
              ))}
            </ul>
          )}
        </main>
      )}

      {project && !fileName && current && (
        <main className="bsm-home">
          <ul className="bsm-list" data-testid="file-list">
            {current.files.map(f => (
              <li key={f.name} className="bsm-list-item">
                <button className="bsm-list-main" onClick={() => openFile(f.name)}>
                  <span className={`bsm-list-icon bcm-lang-${languageOf(f.name)}`}>
                    {f.name.split('.').pop()?.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="bsm-list-text">
                    <span className="bsm-list-title">{f.name}</span>
                    <span className="bsm-list-sub">{f.content.split('\n').length} lines</span>
                  </span>
                </button>
                <button className="bsm-icon-btn bsm-muted" aria-label={`Delete ${f.name}`} onClick={() => removeFile(f.name)}>×</button>
              </li>
            ))}
          </ul>
        </main>
      )}

      {inEditor && (
        <main className="bcm-editor" style={editing && kb ? { bottom: kb + 48 } : undefined}>
          <MobileCodeEditor
            key={`${project?.id}/${fileName}`}
            ref={editorRef}
            value={draft}
            language={languageOf(fileName as string)}
            onChange={onEdit}
            onFocusChange={setEditing}
          />
        </main>
      )}

      {inEditor && editing && (
        <div className="bcm-symbols" style={{ bottom: kb }} role="toolbar" aria-label="Symbols">
          <button className="bcm-sym" onMouseDown={e => e.preventDefault()} onClick={() => editorRef.current?.undo()} aria-label="Undo">↶</button>
          <button className="bcm-sym" onMouseDown={e => e.preventDefault()} onClick={() => editorRef.current?.redo()} aria-label="Redo">↷</button>
          {SYMBOLS.map(s => (
            <button key={s} className="bcm-sym" onMouseDown={e => e.preventDefault()} onClick={() => insertSymbol(s)}>{s}</button>
          ))}
        </div>
      )}

      {!(inEditor && editing) && (
        <nav className="bsm-actionbar">
          {!project ? (
            <button className="bsm-action bsm-action-gold" onClick={createProject}>
              <span className="bsm-action-icon">＋</span>New project
            </button>
          ) : (
            <>
              {inEditor ? (
                <button className="bsm-action" onClick={handleSave}><span className="bsm-action-icon">⤓</span>Save</button>
              ) : (
                <button className="bsm-action" onClick={createFile}><span className="bsm-action-icon">＋</span>New file</button>
              )}
              <button className="bsm-action" onClick={handleRun}><span className="bsm-action-icon">▶</span>Run</button>
              <button className="bsm-action" onClick={handleShare}><span className="bsm-action-icon">⇪</span>Share</button>
              <button className="bsm-action bsm-action-gold" onClick={() => setAiOpen(true)}>
                <span className="bsm-action-icon">✦</span>AI
              </button>
            </>
          )}
        </nav>
      )}

      {preview !== null && (
        <div className="bcm-preview" role="dialog" aria-label="Preview">
          <div className="bcm-preview-bar">
            <span>Preview</span>
            <button className="bsm-pill" onClick={() => setPreview(null)}>Close</button>
          </div>
          <iframe title="Preview" sandbox="allow-scripts" srcDoc={preview} className="bcm-preview-frame" />
        </div>
      )}

      {aiOpen && (
        <AISheet
          fileName={fileName}
          code={inEditor ? draft : null}
          onClose={() => setAiOpen(false)}
          onInsert={code => {
            if (!inEditor) return;
            setDraft(code);
            setDirty(true);
            setAiOpen(false);
            flash('Code replaced. Save to keep it');
          }}
        />
      )}

      {toast && <div className="bsm-toast bcm-toast" role="status">{toast}</div>}
    </div>
  );
}

function AISheet({ fileName, code, onClose, onInsert }: {
  fileName: string | null;
  code: string | null;
  onClose: () => void;
  onInsert: (code: string) => void;
}) {
  const ai = useMemo(() => new AIService(new HandCashService()), []);
  const [providers, setProviders] = useState<string[]>(configuredProviders);
  const [provider, setProvider] = useState<string>(() => configuredProviders()[0] ?? 'claude');
  const [keyDraft, setKeyDraft] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [msgs, busy]);

  const hasKey = providers.includes(provider);

  const saveKey = () => {
    if (!keyDraft.trim()) return;
    ai.setApiKey(provider, keyDraft.trim());
    setKeyDraft('');
    setProviders(configuredProviders());
  };

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    const next: ChatMsg[] = [...msgs, { role: 'user', content: q }];
    setMsgs(next);
    setBusy(true);
    const context: AIMessage[] = [];
    if (code !== null && fileName) {
      context.push({ role: 'user', content: `I'm editing ${fileName}:\n\`\`\`\n${code}\n\`\`\`` });
      context.push({ role: 'assistant', content: 'Got it. What would you like to change?' });
    }
    msgs.filter(m => !m.error).forEach(m => context.push({ role: m.role, content: m.content }));
    try {
      const res = await ai.generateResponse(q, provider, context);
      setMsgs([...next, { role: 'assistant', content: res.content }]);
    } catch (err) {
      setMsgs([...next, { role: 'assistant', content: (err as Error).message || 'Request failed', error: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bcm-sheet-backdrop" onClick={onClose}>
      <section className="bcm-sheet" role="dialog" aria-label="AI assistant" onClick={e => e.stopPropagation()}>
        <div className="bcm-sheet-grip" />
        <div className="bcm-sheet-head">
          <strong>AI assistant</strong>
          <select className="bcm-select" value={provider} onChange={e => setProvider(e.target.value)} aria-label="Provider">
            {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="bsm-icon-btn bsm-muted" onClick={onClose} aria-label="Close">×</button>
        </div>
        {!hasKey ? (
          <div className="bcm-keyform">
            <p>Add your {PROVIDERS.find(p => p.id === provider)?.name} API key. It stays in this browser only.</p>
            <input
              className="bsm-input" type="password" value={keyDraft} placeholder="API key"
              onChange={e => setKeyDraft(e.target.value)} autoComplete="off"
            />
            <button className="bsm-primary" onClick={saveKey}>Save key</button>
          </div>
        ) : (
          <>
            <div className="bcm-msgs" ref={listRef}>
              {msgs.length === 0 && (
                <p className="bcm-hint">{fileName ? `Ask about ${fileName}.` : 'Ask anything about your code.'}</p>
              )}
              {msgs.map((m, i) => {
                const block = m.role === 'assistant' && !m.error ? extractCode(m.content) : null;
                return (
                  <div key={i} className={`bcm-msg ${m.role}${m.error ? ' err' : ''}`}>
                    <pre>{m.content}</pre>
                    {block !== null && code !== null && (
                      <button className="bsm-pill bcm-insert" onClick={() => onInsert(block)}>Use this code</button>
                    )}
                  </div>
                );
              })}
              {busy && <div className="bcm-msg assistant"><pre>…</pre></div>}
            </div>
            <div className="bcm-compose">
              <input
                className="bsm-input" value={input} placeholder="Ask the AI"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                enterKeyHint="send"
              />
              <button className="bsm-pill" onClick={send} disabled={busy}>Send</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
