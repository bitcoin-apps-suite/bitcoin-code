/**
 * Lightweight CodeMirror 6 editor for phones (Monaco is desktop-only).
 * The parent owns the text; this component reports edits through onChange
 * and exposes insert / undo / redo for the symbol bar.
 */
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab, undo, redo } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { Lang } from './projectStore';

export interface MobileCodeEditorHandle {
  insert: (text: string) => void;
  undo: () => void;
  redo: () => void;
  focus: () => void;
}

interface Props {
  value: string;
  language: Lang;
  onChange: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
}

function langExtension(lang: Lang): Extension {
  switch (lang) {
    case 'html': return html();
    case 'css': return css();
    case 'javascript': return javascript({ jsx: true });
    case 'typescript': return javascript({ jsx: true, typescript: true });
    case 'json': return javascript();
    default: return [];
  }
}

const mobileTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px', backgroundColor: '#000' },
  '.cm-scroller': {
    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
    lineHeight: '1.55',
    overscrollBehavior: 'contain',
  },
  '.cm-content': { caretColor: '#F5B800', paddingBottom: '40vh' },
  '.cm-cursor': { borderLeftColor: '#F5B800', borderLeftWidth: '2px' },
  '.cm-gutters': { backgroundColor: '#0d0d0f', borderRight: '1px solid #26262b', color: '#5c5c66' },
  '.cm-activeLine': { backgroundColor: 'rgba(22,163,74,.08)' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(22,163,74,.15)', color: '#16a34a' },
});

const MobileCodeEditor = forwardRef<MobileCodeEditorHandle, Props>(
  ({ value, language, onChange, onFocusChange }, ref) => {
    const host = useRef<HTMLDivElement>(null);
    const view = useRef<EditorView | null>(null);
    // Latest callbacks without recreating the editor.
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocusChange);
    onChangeRef.current = onChange;
    onFocusRef.current = onFocusChange;
    const valueRef = useRef(value);
    valueRef.current = value;

    useEffect(() => {
      if (!host.current) return;
      const v = new EditorView({
        parent: host.current,
        state: EditorState.create({
          doc: valueRef.current,
          extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            langExtension(language),
            oneDark,
            mobileTheme,
            EditorView.lineWrapping,
            EditorView.contentAttributes.of({
              autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Code editor',
            }),
            EditorView.updateListener.of(u => {
              if (u.docChanged) onChangeRef.current(u.state.doc.toString());
              if (u.focusChanged) onFocusRef.current?.(u.view.hasFocus);
            }),
          ],
        }),
      });
      view.current = v;
      return () => { v.destroy(); view.current = null; };
    }, [language]);

    // Replace the document when the parent swaps in different text (e.g. AI insert).
    useEffect(() => {
      const v = view.current;
      if (v && v.state.doc.toString() !== value) {
        v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      insert: (text: string) => {
        const v = view.current;
        if (!v) return;
        const { from, to } = v.state.selection.main;
        v.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
          scrollIntoView: true,
        });
        v.focus();
      },
      undo: () => { if (view.current) undo(view.current); },
      redo: () => { if (view.current) redo(view.current); },
      focus: () => view.current?.focus(),
    }), []);

    return <div ref={host} className="bcm-cm" data-testid="code-editor" />;
  },
);

MobileCodeEditor.displayName = 'MobileCodeEditor';
export default MobileCodeEditor;
