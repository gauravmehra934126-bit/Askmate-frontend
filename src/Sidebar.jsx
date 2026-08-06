import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { API_URL } from "./constants";

function Sidebar() {
    const {
        allThreads, 
        setAllThreads, 
        currThreadId, 
        setNewChat, 
        setPrompt, 
        setReply, 
        setCurrThreadId, 
        setPrevChats, 
        isSidebarOpen, 
        setIsSidebarOpen
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            // Added credentials: "include" so the HTTP-only cookie is sent to the backend
            const response = await fetch(`${API_URL}/thread`, {
            credentials: "include"
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`${API_URL}/thread/${newThreadId}`, {
             credentials: "include"
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    };   

    const deleteThread = async (threadId) => {
        try {
            await fetch(`${API_URL}/thread/${threadId}`, {
          method: "DELETE",
          credentials: "include"
         });
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <section className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
            <div className="sidebar-header">
                <button className="icon-btn" onClick={() => setIsSidebarOpen(false)} title="Close sidebar">
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
                
                <button className="new-chat-btn" onClick={createNewChat}>
                    <span>New chat</span>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": ""}
                        >
                            <span className="thread-title">{thread.title}</span>
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
               
            </div>
        </section>
    );
}

export default Sidebar;