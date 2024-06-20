import { useContext } from "react";
import { List } from "./components/List";
import { Chat } from "./components/Chat";
import { ChatContext, UserContext } from "./components/contextAPI/allContext";
import { Home } from "./components/Home";
import { AIChat } from "./components/AIChat";

function App() {
  const { user } = useContext(UserContext);
  const { aiCharacter,setAiCharacter } = useContext(ChatContext);

  return (
    <>
      <div className="container ">
        {user ? (
          <div className="row">
            <div className="col-md-3">
              <List />
            </div>
            <div className="col">{aiCharacter ? <AIChat /> : <Chat />}</div>
          </div>
        ) : (
          <Home />
        )}
      </div>
    </>
  );
}

export default App;
