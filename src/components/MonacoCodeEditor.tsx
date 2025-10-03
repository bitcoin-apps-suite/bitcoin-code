import React, { useRef, useEffect } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

interface MonacoCodeEditorProps {
  tab: Tab;
  onContentChange: (content: string) => void;
  theme?: string;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  tab,
  onContentChange,
  theme = 'bitcoin-dark'
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Define Bitcoin Code dark theme
    monaco.editor.defineTheme('bitcoin-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: '22c55e', fontStyle: 'bold' },
        { token: 'string', foreground: 'fbbf24' },
        { token: 'number', foreground: 'fb923c' },
        { token: 'function', foreground: '60a5fa' },
        { token: 'variable', foreground: 'e879f9' },
        { token: 'type', foreground: '34d399' },
        { token: 'constant', foreground: 'f87171' },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#22c55e40',
        'editor.selectionHighlightBackground': '#22c55e20',
        'editorCursor.foreground': '#22c55e',
        'editorWhitespace.foreground': '#404040',
        'editorLineNumber.foreground': '#666666',
        'editorLineNumber.activeForeground': '#22c55e',
        'editor.findMatchBackground': '#22c55e40',
        'editor.findMatchHighlightBackground': '#22c55e20',
        'editorBracketMatch.background': '#22c55e30',
        'editorBracketMatch.border': '#22c55e',
      }
    });

    // Register Bitcoin-specific language snippets
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          {
            label: 'bitcoin-transaction',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'const transaction = {',
              '  to: "${1:recipient}",',
              '  amount: ${2:0.001},',
              '  data: "${3:metadata}",',
              '  fee: ${4:0.0001}',
              '};'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a Bitcoin transaction object',
            range: range
          },
          {
            label: 'bitcoin-wallet',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'const wallet = new BitcoinWallet({',
              '  network: "${1:mainnet}",',
              '  type: "${2:HD}",',
              '  seed: "${3:your-seed-phrase}"',
              '});'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a Bitcoin wallet instance',
            range: range
          },
          {
            label: 'smart-contract',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'const contract = new SmartContract({',
              '  script: `${1:// Your Bitcoin script here}`,',
              '  inputs: [${2:inputs}],',
              '  outputs: [${3:outputs}]',
              '});'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a Bitcoin smart contract',
            range: range
          }
        ];
        return { suggestions };
      }
    });

    // Add Bitcoin-related hover information
    monaco.languages.registerHoverProvider('javascript', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return;

        const bitcoinTerms: { [key: string]: string } = {
          'BitcoinSDK': 'Main SDK for Bitcoin blockchain interactions',
          'transaction': 'A Bitcoin transaction object with inputs and outputs',
          'wallet': 'Bitcoin wallet for managing keys and addresses',
          'mainnet': 'Bitcoin main network (live blockchain)',
          'testnet': 'Bitcoin test network for development',
          'satoshi': 'Smallest unit of Bitcoin (0.00000001 BTC)',
          'UTXO': 'Unspent Transaction Output',
          'privateKey': 'Secret key for signing transactions',
          'publicKey': 'Public key derived from private key',
          'address': 'Bitcoin address for receiving payments'
        };

        if (bitcoinTerms[word.word]) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${word.word}**` },
              { value: bitcoinTerms[word.word] }
            ]
          };
        }
      }
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set Bitcoin dark theme
    monaco.editor.setTheme('bitcoin-dark');
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 13,
      fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
      lineHeight: 20,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      parameterHints: { enabled: true },
      formatOnPaste: true,
      formatOnType: true
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save functionality
      console.log('Save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find')?.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
      // Format document
      editor.getAction('editor.action.formatDocument')?.run();
    });
  };

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'py': 'python',
      'go': 'go',
      'rs': 'rust',
      'sol': 'solidity',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'xml': 'xml',
      'sh': 'shell'
    };
    return languageMap[extension || ''] || 'plaintext';
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={getLanguageFromPath(tab.path)}
        value={tab.content}
        onChange={(value) => onContentChange(value || '')}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoCodeEditor;