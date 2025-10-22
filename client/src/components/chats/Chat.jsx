import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text.trim()) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const markRead = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          markRead();
        }
      });
    }
    return () => socket.off("getMessage");
  }, [socket, chat]);

  const generateAvatar = (seed) => {
    return createAvatar(bottts, {
      seed,
      size: 56,
      backgroundType: ["gradientLinear"],
      backgroundColor: ["b6e3f4", "c0aede", "d1f4a5"],
    }).toDataUri();
  };

  const getAvatarSrc = (user) => {
    if (user.avatar) return user.avatar;
    return generateAvatar(user.username || user.id || "anonymous");
  };

  return (
    <div className={`chat ${chat ? "chat-open" : ""}`}>
      <aside className="chat__sidebar">
        <header className="sidebar__header">
          <h1>Messages</h1>
          {chats && (
            <div className="sidebar__header-badge">
              {chats.filter(c => !c.seenBy.includes(currentUser.id)).length}
            </div>
          )}
        </header>

        <div className="chat__list">
          {!chats?.length ? (
            <div className="chat__empty">
              <div className="empty__content">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="#ccc" strokeWidth="2" />
                  <path d="M20 28C20 26.8954 20.8954 26 22 26H42C43.1046 26 44 26.8954 44 28V36C44 37.1046 43.1046 38 42 38H28L20 44V28Z" fill="#eee" />
                  <circle cx="28" cy="32" r="2" fill="#bbb" />
                  <circle cx="32" cy="32" r="2" fill="#bbb" />
                  <circle cx="36" cy="32" r="2" fill="#bbb" />
                </svg>
                <h3>No conversations yet</h3>
                <p>Start chatting with property owners</p>
              </div>
            </div>
          ) : (
            chats.map((c) => (
              <div
                key={c.id}
                className={`chat__item ${chat?.id === c.id ? "active" : ""} ${
                  !c.seenBy.includes(currentUser.id) ? "unread" : ""
                }`}
                onClick={() => handleOpenChat(c.id, c.receiver)}
              >
                <div className="chat__avatar-wrapper">
                  <img
                    src={getAvatarSrc(c.receiver)}
                    alt={`${c.receiver.username || "User"} avatar`}
                    className="chat__avatar"
                  />
                  {!c.seenBy.includes(currentUser.id) && <div className="chat__unread-dot" />}
                </div>

                <div className="chat__details">
                  <div className="chat__details-header">
                    <span className="chat__username">{c.receiver.username}</span>
                    <span className="chat__time">{format(c.lastMessageDate)}</span>
                  </div>
                  <p className="chat__preview">{c.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {chat && (
        <section className="chat__window">
          <div className="chat__header">
            <div className="header__user">
              <img src={getAvatarSrc(chat.receiver)} alt={`${chat.receiver.username} avatar`} />
              <div className="header__user-info">
                <span className="header__username">{chat.receiver.username}</span>
                <span className="header__status">Active now</span>
              </div>
            </div>
            <button className="chat__close" onClick={() => setChat(null)} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="chat__body">
            {chat.messages.length === 0 ? (
              <div className="chat__empty">
                <div className="empty__content">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="#ccc" strokeWidth="2" />
                    <path d="M16 20C16 19.4477 16.4477 19 17 19H31C31.5523 19 32 19.4477 32 20V26C32 26.5523 31.5523 27 31 27H22L16 31V20Z" fill="#eee" />
                  </svg>
                  <h3>Start the conversation</h3>
                </div>
              </div>
            ) : (
              chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat__message ${
                    message.userId === currentUser.id ? "sent" : "received"
                  }`}
                >
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="chat__input" onSubmit={handleSubmit}>
            <textarea
              name="text"
              placeholder="Type a message..."
              rows="1"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button type="submit" aria-label="Send message">Send</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Chat;
