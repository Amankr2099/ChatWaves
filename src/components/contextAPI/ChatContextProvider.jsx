import { useEffect, useState } from "react";
import { ChatContext } from "./allContext";

const ChatContextProvider = ({ children }) => {

  const [chatId,setChatId] = useState(null)
  const [chatUser,setChatUser] = useState(null)
  const [aiCharacter,setAiCharacter] = useState(null)

  return (
    <ChatContext.Provider
    value={{chatId,setChatId,chatUser,setChatUser,aiCharacter,setAiCharacter}}
    >
        {children}
    </ChatContext.Provider>
  )
};

export { ChatContextProvider };
