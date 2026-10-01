import {
  buildPreview, deleteProject, extractCode, languageOf, listProjects, newProject, saveProject, validateFileName,
} from './projectStore';

beforeEach(() => localStorage.clear());

test('languageOf maps extensions', () => {
  expect(languageOf('index.html')).toBe('html');
  expect(languageOf('a.tsx')).toBe('typescript');
  expect(languageOf('x.css')).toBe('css');
  expect(languageOf('README')).toBe('text');
});

test('save, list and delete projects', () => {
  const p = saveProject(newProject('Demo'));
  expect(listProjects().map(x => x.name)).toEqual(['Demo']);
  expect(p.files.map(f => f.name)).toEqual(['index.html', 'style.css', 'app.js']);
  deleteProject(p.id);
  expect(listProjects()).toEqual([]);
});

test('validateFileName rejects duplicates and folders', () => {
  const p = newProject('Demo');
  expect(validateFileName(p, 'app.js')).toMatch(/exists/);
  expect(validateFileName(p, 'a/b.js')).toMatch(/Folders/);
  expect(validateFileName(p, ' ')).toMatch(/Enter/);
  expect(validateFileName(p, 'util.js')).toBeNull();
});

test('buildPreview inlines css and js and escapes </script>', () => {
  const p = newProject('Demo');
  p.files.push({ name: 'evil.js', content: 'const s = "</script>";' });
  const doc = buildPreview(p);
  expect(doc).toContain('<style>');
  expect(doc).toContain('Tapped $' + '{taps} times');
  expect(doc).toContain('"<\\/script>"');
  expect(doc.indexOf('<style>')).toBeLessThan(doc.indexOf('</head>'));
});

test('extractCode returns the first fenced block', () => {
  expect(extractCode('Here:\n```js\nlet a = 1;\n```\nDone')).toBe('let a = 1;\n');
  expect(extractCode('no code')).toBeNull();
});
