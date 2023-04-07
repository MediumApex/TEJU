import React, { useState } from "react";
import "./App.css";
import "./normal.css";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "Ask me anything",
    },
  ]);

  const clearChat = () => {
    setChatLog([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add user's message to the chat log
    const userMessage = { user: "me", message: input };
    const chatLogNew = [...chatLog, userMessage];
    setChatLog(chatLogNew);
    setInput("");

    // Send a request to the API with the chat log
    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });
    const data = await response.json();

    // Add the model's response to the chat log
    const modelMessage = { user: "gpt", message: data.messages };
    setChatLog([...chatLogNew, modelMessage]);
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-input-textarea"
              rows="1"
              placeholder="Write your message here"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  const { user, message: text } = message;
  const isGpt = user === "gpt";

  return (
    <div className={`chat-message ${isGpt ? "chat-message-chatgpt" : ""}`}>
      <div className="chat-message-center">
        <div className={`avatar ${isGpt ? "chat-message-chatgpt" : ""}`}></div>
        <div className="message">{text}</div>
      </div>
    </div>
  );
};

export default App;
