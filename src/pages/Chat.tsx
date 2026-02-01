import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../App.css'

export default function Chat() {
  const { messages, initialize, sendMessage, uploadPdf, createNewChat, switchChat, savedChats, uuid, isUploading, isLoading, isMedGamma, toggleMedGamma, triggerEmergency } = useChatStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isUploading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const text = inputValue;
    setInputValue('');
    setSelectedFile(null);
    setIsTyping(true);

    if (selectedFile) {
        await uploadPdf(selectedFile);
    }
    
    if (text.trim()) {
        await sendMessage(text);
    }
    
    setIsTyping(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'application/pdf') {
           setSelectedFile(file);
           e.target.value = ''; 
        } else {
           alert("Please upload a PDF file.");
        }
      }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
            <h2>History</h2>
            <button onClick={() => createNewChat()} className="new-chat-btn ">
                + New Chat
            </button>
        </div>
        <div className="chat-list">
            {savedChats.map((chatId) => (
                <div 
                    key={chatId} 
                    className={`chat-item ${chatId === uuid ? 'active' : ''} cursor-pointer`}
                    onClick={() => {
                        console.log("Switching to chat:", chatId);
                        switchChat(chatId);
                    }}
                >
                    <span className="chat-icon">💬</span>
                    <div className="chat-info">
                        <span className="chat-id cursor-pointer">Chat {chatId.substring(0, 8)}</span>
                        <span className="chat-date cursor-pointer">Saved Session</span>
                    </div>
                </div>
            ))}
            {savedChats.length === 0 && (
                <div className="empty-history">
                    <span>No history yet</span>
                </div>
            )}
        </div>
      </div>

      <div className={`chat-window ${isMedGamma ? 'medgamma-mode' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="bot-avatar">
            <span>{isMedGamma ? '⚕️' : 'AI'}</span>
          </div>
          <div className="header-info">
            <h1>{isMedGamma ? 'MedGamma Health' : 'Chat Assistant'}</h1>
            <div className="status-indicator">
              <span className={`status-dot ${isLoading ? 'loading' : ''}`}></span>
              <span className="status-text">{isLoading ? 'Connecting...' : 'Online'}</span>
            </div>
          </div>
          
          <div className="header-actions">
             {/* Health Mode Toggle */}
             <button 
                className={`mode-toggle ${isMedGamma ? 'active' : ''}`}
                onClick={toggleMedGamma}
                title="Toggle Health Mode"
             >
                {isMedGamma ? '🏥 Health Mode ON' : '🔄 Switch to Health'}
             </button>

             {/* SOS Button - Only in MedGamma */}
             {isMedGamma && (
                 <button 
                    className="sos-btn"
                    onClick={() => {
                        if(window.confirm("ARE YOU SURE? This will trigger an EMERGENCY ALERT.")) {
                            triggerEmergency();
                        }
                    }}
                 >
                    🚨 SOS
                 </button>
             )}
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((msg) => (
            msg ? (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
            ) : (
              <div className="message bot">
                <span className="typing-dots">
                  Typing...
                </span>
              </div>
            )
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="input-area" onSubmit={handleSendMessage}>
          
          {/* Selected File Chip */}
          {selectedFile && (
            <div className="file-chip">
              <span className="file-icon">📄</span>
              <span className="file-name">{selectedFile.name}</span>
              <button 
                type="button" 
                className="remove-file-btn"
                onClick={() => setSelectedFile(null)}
              >
                ×
              </button>
            </div>
          )}
          
          {/* PDF Upload Button */}
          <div className="attachment-btn-wrapper">
            <input 
                type="file" 
                ref={fileInputRef} 
                accept="application/pdf" 
                style={{ display: 'none' }} 
                onChange={handleFileSelect}
            />
            <button 
                type="button" 
                className="icon-button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" color='white' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </button>
          </div>

          <div className="input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button type="submit" className="send-button" disabled={!inputValue.trim() && !isUploading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
