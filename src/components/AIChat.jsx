import React, { useContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../lib/firebase";
import { v4 as uniqueId } from "uuid";

import {  GoogleGenerativeAI } from "@google/generative-ai";
import { ChatContext, UserContext } from "./contextAPI/allContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
import { signOut } from "firebase/auth";
import { ChatUser } from "./ChatUser";

export const AIChat = () => {
  const [emojiOption, setEmojiOption] = useState(false);
  const [text, setText] = useState("");

  const { chatId,setAiCharacter } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  const addEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setEmojiOption(false);
  };

  

  const { aiCharacter } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async (id) => {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayRemove(messages[id]),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getChat = () => {
      const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
        if (res.exists()) {
          setMessages(res.data().messages);
          const formattedHistory = res.data().messages.map((message) => ({
            role: message.role, // Assuming message object has a role property
            parts: [{ text: message.text }],
          }));
          setHistory(formattedHistory);
        }
      });
      return () => {
        unSub();
      };
    };
    chatId && getChat();
  }, [chatId]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: aiCharacter.characterPrompt + 'User name is ' + user.fullname
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const getResponse = async (input) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: history,
      });
  
      const result = await chatSession.sendMessage(input);
      console.log(history);
  
      if (result.response) {
        if (result.response.text() === "You are banned !") {
          setAiCharacter(null)
          signOut(auth).then(()=>{
            alert("You are banned !")
          })
          return
        }
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: uniqueId(),
            text: result.response.text(),
            senderId: aiCharacter.id,
            time: new Date().toLocaleString("en-IN", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }),
            role: "model",
          }),
        });
      }
      // console.log(result.response.text());
    } catch (error) {
      alert(error.message)
    }
    
  };
  const handleSend = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uniqueId(),
        text,
        senderId: user.id,
        time: new Date().toLocaleString("en-IN", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        role:"user"
      }),
    });
    //update userchats
    await updateDoc(doc(db, "userchats", user.id), {
      [chatId + ".lastmessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    getResponse(text)

  };

  return (
    <div className="container border border-info rounded my-2 d-flex flex-column vh-100 bg-info">
      <div className="d-flex align-items-center justify-content-between p-2 my-1 border rounded bg-white">
        <div className="user-info d-flex">
          <img
            src={aiCharacter.photoURL}
            alt="img"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div className="user-name ms-3  d-flex flex-column">
            <span className="fs-5 fw-semibold"> {aiCharacter.displayName}</span>
            <span> {aiCharacter.about} </span>
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
        <div className="text-center my-3 text-secondary">
          <h2 className="fs-2">Start your conversation</h2>
          <span>Chat with ai character</span>
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
                      : aiCharacter.photoURL
                      ? aiCharacter.photoURL
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
      <div className="chat-input bg-white d-flex align-items-center rounded-5 py-2 my-2">
        <div className="input-icons d-flex align-items-center">
          <div className=" emoji position-relative ps-3">
            <i
              className="fa-solid fa-face-smile"
              onClick={() => {
                setEmojiOption((prev) => !prev);
              }}
            />
            <div className="picker position-absolute bottom-50 start-0 ">
              <EmojiPicker open={emojiOption} onEmojiClick={addEmoji} />
            </div>
          </div>
        </div>

        <form className="w-100 ms-3" onSubmit={handleSend}>
          <input
            type="text"
            className="ms-3 py-1 rounded-4 border-info ps-3 w-100"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Type message ...."
          />
        </form>
        <button
          className="btn ms-2 rounded-5 "
          type="submit"
          onClick={handleSend}
        >
          <i className="fa-solid fa-paper-plane fs-4" />{" "}
        </button>
      </div>
    </div>
  );
};


// You are Alex, a 22-year-old college student, known for your chill and friendly demeanor. You are in the same class as the user and are good friends with them. When chatting with the user, you always maintain a positive and humorous tone, focusing on lighthearted and fun conversations. You are never negative and always find a way to keep the mood upbeat. You live in the moment and your conversations reflect your easy-going and present-focused nature.

// Conversation Style:
// User will start the conversation
// Ask the user about their life and experiences in a lighthearted manner
// Share funny and positive anecdotes
// keep your responses short about 50-70 words maximum
// Keep the conversation fun and engaging
// Avoid negativity, always steer the conversation towards positivity and humor

// Personality Traits:
// Age: 22
// Role: College student, friend of the user
// Nature: Chill, friendly, funny, positive
// Focus: Present moment, fun conversations