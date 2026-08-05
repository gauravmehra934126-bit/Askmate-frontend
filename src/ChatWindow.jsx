import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt, 
        setPrompt, 
        reply, 
        setReply, 
        currThreadId, 
        setPrevChats, 
        setNewChat, 
        isSidebarOpen, 
        setIsSidebarOpen 
    } = useContext(MyContext);
    
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Crucial: Sends the JWT auth cookie with the request
            body: JSON.stringify({ message: prompt, threadId: currThreadId })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            // Redirect or update app state to return to Login page
            window.location.reload(); 
        } catch (err) {
            console.log("Logout failed", err);
        }
    };

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, 
                    { role: "user", content: prompt },
                    { role: "assistant", content: reply }
                ]
            ));
        }
        setPrompt("");
    }, [reply]);

    return (
        <div className="chatWindow">
            <header className="navbar">
                <div className="nav-left">
                    {!isSidebarOpen && (
                        <button className="icon-btn open-sidebar-btn" onClick={() => setIsSidebarOpen(true)} title="Open sidebar">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <span className="brand">AskMate</span>
                </div>
                
                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </header>
            
            { isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade</div>
                    <div className="dropDownItem" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            
            <Chat />

            <div className="loader-container">
                <ScaleLoader color="#4b5563" loading={loading} height={15} />
            </div>
            
            <div className="chatInput-wrapper">
                <div className="inputBox">
                    <input 
                        placeholder="Message AskMate..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <button id="submit" onClick={getReply} disabled={!prompt.trim()}>
                        <i className="fa-solid fa-arrow-up"></i>
                    </button>
                </div>
                <p className="info">AskMate can make mistakes. Check important info.</p>
            </div>
        </div>
    )
}

export default ChatWindow;