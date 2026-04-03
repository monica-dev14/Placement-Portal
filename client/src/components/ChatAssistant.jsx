import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ChatAssistant.css';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewHistory, setViewHistory] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello Monica! I am your SIT Placement Mentor. How can I help you?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !viewHistory) scrollToBottom();
    }, [messages, isOpen, viewHistory]);

    // 1. FETCH HISTORY
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://placement-portal-green-five.vercel.app/api/history');
            setHistoryList(res.data);
            setViewHistory(true);
        } catch (err) {
            console.error("History fetch error:", err);
            alert("History fetch aagala, Monica. Check backend!");
        } finally {
            setLoading(false);
        }
    };

    // 2. DELETE ALL HISTORY
    const deleteHistory = async () => {
        if (window.confirm("Monica, are you sure you want to delete all history?")) {
            try {
                await axios.delete('https://placement-portal-green-five.vercel.app/api/history');
                setHistoryList([]); 
                alert("History Deleted!");
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    // 3. TOGGLE & AUTO-SAVE
    const handleToggle = async () => {
        if (isOpen) {
            if (messages.length > 1) {
                try {
                    await axios.post('https://placement-portal-green-five.vercel.app/api/history/save', { messages });
                    console.log("✅ Chat Session Saved!");
                } catch (err) {
                    console.error("❌ Save failed:", err);
                }
            }
            setMessages([{ role: 'ai', text: 'Hello Monica! I am your SIT Placement Mentor.' }]);
            setIsOpen(false);
            setViewHistory(false);
        } else {
            setIsOpen(true);
        }
    };

    // 4. SEND MESSAGE
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('https://placement-portal-green-five.vercel.app/api/chat', { prompt: input });
            if (response.data && response.data.reply) {
                setMessages([...updatedMessages, { role: 'ai', text: response.data.reply }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...updatedMessages, { role: 'ai', text: "AI is currently offline!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-portal-wrapper">
            <div className="chat-toggle-icon" onClick={handleToggle}>
                {isOpen ? '✖' : '💬'}
            </div>

            {isOpen && (
                <div className="modern-chat-window">
                    <div className="chat-top-header">
                        <div className="header-info">
                            <div className="avatar-placeholder">SM</div>
                            <div>
                                <h3>SIT Mentor</h3>
                                <span className="online-status">Online</span>
                            </div>
                        </div>
                        <button className="history-btn" onClick={() => viewHistory ? setViewHistory(false) : fetchHistory()}>
                            {viewHistory ? 'Back' : '📜'}
                        </button>
                    </div>

                    <div className="chat-messages-body">
                        {viewHistory ? (
                            <div className="history-list">
                                <h4>Past Sessions</h4>
                                {historyList.length === 0 ? <p>No history found.</p> : (
                                    <>
                                        {historyList.map((item, idx) => (
                                            <div key={idx} className="history-item">
                                                <div className="history-info">
                                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                                    <small>{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                                </div>
                                                <button onClick={() => { setMessages(item.messages); setViewHistory(false); }}>View</button>
                                            </div>
                                        ))}
                                        <button className="clear-all-btn" onClick={deleteHistory}>
                                             Clear All History
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message-bubble-row ${msg.role}`}>
                                        <div className="bubble-content">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {loading && <div className="typing-indicator"><span></span><span></span><span></span></div>}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {!viewHistory && (
                        <div className="chat-input-footer">
                            <input 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                                placeholder="Ask SIT Mentor..." 
                            />
                            <button onClick={handleSend} disabled={loading}>Send</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;