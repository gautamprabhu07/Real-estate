import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import { 
  FiSend, 
  FiX, 
  FiMessageSquare, 
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical 
} from "react-icons/fi";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { HiOutlineEmojiHappy } from "react-icons/hi";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
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
      setIsMinimized(false);
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
      e.target.text.style.height = "auto";
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

  const unreadCount = chats?.filter(c => !c.seenBy.includes(currentUser.id)).length || 0;

  return (
    <div className={`chat-container ${chat ? "chat-active" : ""}`}>
      <div className="chat-sidebar">
        <div className="chat-sidebar__header">
          <div className="header__title">
            <FiMessageSquare className="header__icon" />
            <h2>Messages</h2>
          </div>
          {unreadCount > 0 && (
            <div className="header__badge">{unreadCount}</div>
          )}
        </div>

        <div className="chat-sidebar__list">
          {!chats?.length ? (
            <div className="chat-empty-state">
              <div className="empty-state__icon">
                <FiMessageSquare />
              </div>
              <h3>No conversations yet</h3>
              <p>Start chatting with property owners to get started</p>
            </div>
          ) : (
            chats.map((c) => (
              <div
                key={c.id}
                className={`chat-item ${chat?.id === c.id ? "active" : ""} ${
                  !c.seenBy.includes(currentUser.id) ? "unread" : ""
                }`}
                onClick={() => handleOpenChat(c.id, c.receiver)}
              >
                <div className="chat-item__avatar">
                  <img
                    src={getAvatarSrc(c.receiver)}
                    alt={`${c.receiver.username || "User"} avatar`}
                  />
                  {!c.seenBy.includes(currentUser.id) && (
                    <div className="avatar__badge" />
                  )}
                </div>

                <div className="chat-item__content">
                  <div className="content__header">
                    <span className="content__name">{c.receiver.username}</span>
                    <span className="content__time">{format(c.lastMessageDate)}</span>
                  </div>
                  <div className="content__message">
                    <p>{c.lastMessage}</p>
                    {!c.seenBy.includes(currentUser.id) && (
                      <div className="message__unread-indicator" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {chat && (
        <div className={`chat-window ${isMinimized ? "minimized" : ""}`}>
          <div className="chat-window__header">
            <div className="header__user">
              <div className="user__avatar">
                <img src={getAvatarSrc(chat.receiver)} alt={`${chat.receiver.username} avatar`} />
                <div className="avatar__status" />
              </div>
              <div className="user__info">
                <span className="user__name">{chat.receiver.username}</span>
                <span className="user__status">Active now</span>
              </div>
            </div>
            <div className="header__actions">
              <button 
                className="action-btn minimize-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <button 
                className="action-btn close-btn" 
                onClick={() => setChat(null)} 
                aria-label="Close chat"
              >
                <FiX />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-window__body">
                {chat.messages.length === 0 ? (
                  <div className="chat-empty-state">
                    <div className="empty-state__icon">
                      <HiOutlineEmojiHappy />
                    </div>
                    <h3>Start the conversation</h3>
                    <p>Send a message to begin chatting</p>
                  </div>
                ) : (
                  chat.messages.map((message, index) => {
                    const isSent = message.userId === currentUser.id;
                    const showAvatar = index === 0 || 
                      chat.messages[index - 1].userId !== message.userId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`message ${isSent ? "sent" : "received"} ${
                          showAvatar ? "show-avatar" : ""
                        }`}
                      >
                        {!isSent && showAvatar && (
                          <img 
                            src={getAvatarSrc(chat.receiver)} 
                            alt="avatar" 
                            className="message__avatar"
                          />
                        )}
                        <div className="message__bubble">
                          <p>{message.text}</p>
                          <span className="message__time">
                            {format(message.createdAt)}
                            {isSent && (
                              <BsCheck2All className="message__check" />
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>

              <form className="chat-window__input" onSubmit={handleSubmit}>
                <textarea
                  name="text"
                  placeholder="Type a message..."
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
                <button type="submit" className="send-btn" aria-label="Send message">
                  <FiSend />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;