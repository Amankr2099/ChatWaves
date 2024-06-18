import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {auth, db} from "../../lib/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { ChatContext } from "./allContext";

const ChatContextProvider = ({ children }) => {

  const [chatId,setChatId] = useState(null)
  const [chatUser,setChatUser] = useState(null)

  return (
    <ChatContext.Provider
    value={{chatId,setChatId,chatUser,setChatUser}}
    >
        {children}
    </ChatContext.Provider>
  )
};

export { ChatContextProvider };
