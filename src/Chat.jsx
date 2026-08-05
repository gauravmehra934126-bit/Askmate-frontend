import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null);
            return;
        }
        if(!prevChats?.length) return;

        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply])

    return (
        <div className="chats">
            {newChat && (
                <div className="welcome-container">
                    <h1>Hi, I'm AskMate</h1>
                    <p>How can I help you today?</p>
                </div>
            )}
            
            {prevChats?.slice(0, -1).map((chat, idx) => (
                <div className={chat.role === "user" ? "userRow" : "gptRow"} key={idx}>
                    {chat.role === "user" ? (
                        <div className="userMessage">{chat.content}</div> 
                    ) : (
                        <div className="gptMessage">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            ))}

            {prevChats.length > 0 && (
                <div className="gptRow">
                    <div className="gptMessage">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestReply === null ? prevChats[prevChats.length-1].content : latestReply}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat;
