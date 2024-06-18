import React, { useContext, useEffect, useRef, useState } from "react";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChatContext, UserContext } from "./contextAPI/allContext";
import { Input } from "./Input";
import { ChatUser } from "./ChatUser";

export const Chat = () => {
  const { user } = useContext(UserContext);
  const { chatId, chatUser } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getChat = () => {
      const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
        res.exists() && setMessages(res.data().messages);
      });
      return () => {
        unSub();
      };
    };
    chatId && getChat();
  }, [chatId]);

  const handleDelete = async (id) => {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayRemove(messages[id]),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {chatUser ? (
        <>
        <div className="container border border-info rounded my-2 d-flex flex-column vh-100 bg-info">
          <div className="d-flex align-items-center justify-content-between p-2 my-1 border rounded bg-white">
            <div className="user-info d-flex">
              <img
                src={
                  chatUser.photoURL
                    ? chatUser.photoURL
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="img"
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div className="user-name ms-3  d-flex flex-column">
                <span className="fs-5 fw-semibold">
                  {" "}
                  {chatUser.displayName}
                </span>
                <span> {chatUser.about && chatUser.about} </span>
              </div>
            </div>

            <div className="options-icons">
              <i className="fa-solid fa-phone ps-3" />
              <i className="fa-solid fa-video ps-3" />
              <i
                className="fa-solid fa-circle-info ps-3"
                data-bs-toggle="modal"
                data-bs-target="#chatUser-profile"
              />
              <ChatUser />
            </div>
          </div>

          <div
            className="user-chats rounded-4 mt-1 bg-secondary-subtle overflow-y-scroll"
            style={{ maxHeight: "550px" }}
          >
            <div className="text-center my-3">
              <h2 className="fs-2">Start your conversation</h2>
              <span>Double-click to remove messages</span>
            </div>
            {messages.map((message, index) => {
              return (
                <div className="clearfix" key={index}>
                  <div
                    className={`message d-flex float-${
                      message.senderId == user.id ? "end" : "start"
                    } mb-5`}
                    style={{ maxWidth: "60%" }}
                    onDoubleClick={() => {
                      if (message.senderId === user.id) {
                        handleDelete(index);
                      }
                    }}
                  >
                    <img
                      src={
                        message.senderId == user.id
                          ? user.photoURL
                            ? user.photoURL
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          : chatUser.photoURL
                          ? chatUser.photoURL
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="img"
                      className="rounded-circle"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="d-flex flex-column">
                      {message.imgURL && (
                        <img
                          src={message.imgURL}
                          className="rounded w-75"
                          alt="img"
                        />
                      )}

                      <div className="text ms-2 bg-info p-1 rounded-3 mt-1">
                        {message.text}
                        <div className="text-muted mt-2">
                          {message.time && message.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={endRef}></div>
          </div>
          <Input />
        </div>
        </>
      ) : (
        <div
          className="container border border-info rounded my-2 d-flex flex-column vh-100"
          style={{
            backgroundImage:
              "url(https://cdn.pixabay.com/animation/2022/11/16/11/48/11-48-15-802_512.gif)",
            backgroundSize: "conatin",

            backgroundPosition: "center",
          }}
        >
          <div className="mt-5 text-center">
            <h1 className="pt-5">Start your conversation</h1>
            <h3 className="pt-3">Click Add friend button or search</h3>
          </div>
        </div>
      )}
    </>
  );
};
