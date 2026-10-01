/**
 * bCode mobile project store. The desktop editor keeps its files in memory
 * only, so the phone app persists projects in localStorage: a project is a
 * list of files (HTML / CSS / JS / TS / JSON / Markdown). `buildPreview`
 * combines a project's index.html, CSS and JS into one document for Run.
 */
export type Lang = 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown' | 'text';

export interface CodeFile {
  name: string;
  content: string;
}

export interface CodeProject {
  id: string;
  name: string;
  files: CodeFile[];
  updatedAt: number;
}

const KEY = 'bcode_mobile_projects';

function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function languageOf(name: string): Lang {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'css') return 'css';
  if (ext === 'js' || ext === 'jsx' || ext === 'mjs') return 'javascript';
  if (ext === 'ts' || ext === 'tsx') return 'typescript';
  if (ext === 'json') return 'json';
  if (ext === 'md') return 'markdown';
  return 'text';
}

export function starterFiles(): CodeFile[] {
  return [
    {
      name: 'index.html',
      content: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My bApp</title>
  </head>
  <body>
    <h1>Hello, Bitcoin</h1>
    <button id="tap">Tap me</button>
    <p id="out"></p>
  </body>
</html>
`,
    },
    {
      name: 'style.css',
      content: `body {
  font-family: system-ui, sans-serif;
  background: #000;
  color: #f2f2f2;
  padding: 24px;
}
h1 { color: #16a34a; }
button {
  background: #F5B800;
  border: 0;
  border-radius: 10px;
  padding: 12px 20px;
  font-weight: 700;
}
`,
    },
    {
      name: 'app.js',
      content: `let taps = 0;
document.getElementById('tap').addEventListener('click', () => {
  taps += 1;
  document.getElementById('out').textContent = \`Tapped \${taps} times\`;
});
`,
    },
  ];
}

export function listProjects(): CodeProject[] {
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw ? (JSON.parse(raw) as CodeProject[]) : [];
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeAll(all: CodeProject[]): void {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function saveProject(p: CodeProject): CodeProject {
  const saved = { ...p, updatedAt: Date.now() };
  const all = listProjects().filter(x => x.id !== p.id);
  writeAll([saved, ...all]);
  return saved;
}

export function newProject(name: string): CodeProject {
  return { id: uid(), name, files: starterFiles(), updatedAt: Date.now() };
}

export function deleteProject(id: string): void {
  writeAll(listProjects().filter(p => p.id !== id));
}

/** Returns an error message, or null when the name is usable. */
export function validateFileName(project: CodeProject, name: string): string | null {
  const n = name.trim();
  if (!n) return 'Enter a file name';
  if (/[\\/]/.test(n)) return 'Folders are not supported';
  if (project.files.some(f => f.name === n)) return 'A file with that name exists';
  return null;
}

/** One HTML document from index.html + every .css and .js file, for the Run preview. */
export function buildPreview(project: CodeProject): string {
  const html = project.files.find(f => languageOf(f.name) === 'html')?.content
    ?? '<!doctype html><html><head></head><body></body></html>';
  const css = project.files.filter(f => languageOf(f.name) === 'css').map(f => f.content).join('\n');
  const js = project.files.filter(f => languageOf(f.name) === 'javascript').map(f => f.content).join('\n;\n');
  // Keep "</script>" inside user code from closing the tag early.
  const safeJs = js.replace(/<\/script/gi, '<\\/script');
  const style = css ? `<style>\n${css}\n</style>` : '';
  const script = js ? `<script>\n${safeJs}\n</script>` : '';
  let doc = html;
  doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, `${style}</head>`) : style + doc;
  doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, `${script}</body>`) : doc + script;
  return doc;
}

/** First fenced code block in an AI reply, or null. */
export function extractCode(reply: string): string | null {
  const m = reply.match(/```[\w-]*\n([\s\S]*?)```/);
  return m ? m[1] : null;
}
