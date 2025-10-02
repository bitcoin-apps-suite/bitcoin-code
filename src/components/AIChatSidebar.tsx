import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader, Code, FileText, GitBranch } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeSnippet?: string;
  language?: string;
}

interface AIChatSidebarProps {
  width: number;
  onResize?: (width: number) => void;
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ width, onResize }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Bitcoin Code AI assistant. I can help you with:\n\n• Writing Bitcoin smart contracts\n• Debugging blockchain code\n• Git operations with Bitcoin hashing\n• Code optimization and best practices\n\nWhat would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI service later)
    setTimeout(() => {
      const responses = [
        "I can help you implement that Bitcoin transaction logic. Here's a code snippet to get you started:",
        "For blockchain development, I recommend using these patterns. Let me show you an example:",
        "That's a great question about Bitcoin scripting! Here's how you can approach it:",
        "I see you're working with wallet integration. Here's the recommended way to handle that:",
        "For git operations on the blockchain, we'll hash your commits into Bitcoin transactions. Here's the flow:"
      ];

      const codeSnippets = [
        `// Bitcoin transaction creation
const tx = new BitcoinTransaction({
  inputs: [...previousOutputs],
  outputs: [
    { address: recipientAddress, amount: satoshis }
  ]
});

// Sign and broadcast
const signedTx = wallet.sign(tx);
await blockchain.broadcast(signedTx);`,
        `// Smart contract deployment
class BitcoinContract {
  constructor(bytecode: string) {
    this.code = bytecode;
  }
  
  async deploy() {
    const tx = await this.createDeploymentTx();
    return await blockchain.broadcast(tx);
  }
}`,
        `// Git commit to blockchain
const commitHash = await git.commit('Add new feature');
const blockchainTx = await bitcoin.createDataTx({
  data: JSON.stringify({
    type: 'git_commit',
    hash: commitHash,
    message: 'Add new feature',
    timestamp: Date.now()
  })
});`
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        codeSnippet: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        language: 'typescript'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chat-sidebar" style={{ width: `${width}px` }}>
      <div className="chat-header">
        <div className="chat-title">
          <Bot size={16} />
          <span>Bitcoin AI Assistant</span>
        </div>
        <div className="chat-status">
          <div className="status-dot online"></div>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-header">
              <div className="message-avatar">
                {message.type === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            <div className="message-content">
              {message.content}
              {message.codeSnippet && (
                <div className="code-snippet">
                  <div className="code-header">
                    <Code size={12} />
                    <span>{message.language}</span>
                  </div>
                  <pre><code>{message.codeSnippet}</code></pre>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-header">
              <div className="message-avatar">
                <Bot size={14} />
              </div>
              <span className="message-time">now</span>
            </div>
            <div className="message-content typing">
              <Loader size={16} className="spinning" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="quick-actions">
          <button className="quick-action" title="Explain this code">
            <Code size={14} />
          </button>
          <button className="quick-action" title="Generate docs">
            <FileText size={14} />
          </button>
          <button className="quick-action" title="Commit to blockchain">
            <GitBranch size={14} />
          </button>
        </div>
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Bitcoin development, blockchain patterns, or git operations..."
            rows={3}
            disabled={isLoading}
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatSidebar;