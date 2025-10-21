import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

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

  return (
    <div className="chat">
      <div className="chat__list">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className={`chat__item ${
              chat?.id === c.id ? "active" : ""
            }`}
            key={c.id}
            onClick={() => handleOpenChat(c.id, c.receiver)}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "#ffffff"
                  : "rgba(254, 205, 81, 0.2)",
            }}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <div className="chat__details">
              <span className="chat__username">{c.receiver.username}</span>
              <p className="chat__preview">{c.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chat__window">
          <div className="chat__header">
            <div className="header__user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              <span>{chat.receiver.username}</span>
            </div>
            <button className="chat__close" onClick={() => setChat(null)}>
              ×
            </button>
          </div>

          <div className="chat__body">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`chat__message ${
                  message.userId === currentUser.id ? "sent" : "received"
                }`}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <form className="chat__input" onSubmit={handleSubmit}>
            <textarea
              name="text"
              placeholder="Type a message..."
              rows="1"
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
