import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"; // Matches your exact file name with capital 'U'
import "./App.css";

import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("login"); // "login" or "signup"

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  // If the user is not authenticated, show Login or SignUp pages
  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        {authView === "login" ? (
          <Login 
            onSwitchToSignup={() => setAuthView("signup")} 
            onLoginSuccess={() => setIsAuthenticated(true)} 
          />
        ) : (
          <SignUp 
            onSwitchToLogin={() => setAuthView("login")} 
          />
        )}
      </div>
    );
  }

  // Once authenticated, render the chat application
  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
};

export default App;