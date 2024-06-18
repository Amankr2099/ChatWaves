import EmojiPicker from "emoji-picker-react";
import React, { useContext, useRef, useState } from "react";
import { ChatContext, UserContext } from "./contextAPI/allContext";
import upload from "../lib/upload";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { v4 as uniqueId } from "uuid";

export const Input = () => {
  const [emojiOption, setEmojiOption] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const inputFile = useRef(null);

  const { chatId, chatUser } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  const addEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setEmojiOption(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (file) {
      const imgURL = await upload(file);
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
          imgURL: imgURL,
        }),
      });
    } else {
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
        }),
      });
    }

    //update userchats

    await updateDoc(doc(db, "userchats", user.id), {
      [chatId + ".lastmessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userchats", chatUser.id), {
      [chatId + ".lastmessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setFile(null);
  };

  return (
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

        <input
          type="file"
          accept="image/*"
          className="d-none"
          ref={inputFile}
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <label htmlFor="file" className="position-relative">
          <i
            className="fa-solid fa-images ps-3"
            onClick={() => inputFile.current.click()}
          />
          <div className="picker position-absolute bottom-50 start-0 ">
            {file && (
              <>
                <i
                  className="fa-solid fa-xmark fs-2"
                  onClick={() => setFile(null)}
                />
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded"
                  width="300px"
                />
              </>
            )}
          </div>
        </label>
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
  );
};
