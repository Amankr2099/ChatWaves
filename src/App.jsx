import { useContext } from "react";
import { List } from "./components/List";
import { Chat } from "./components/Chat";
import { UserContext } from "./components/contextAPI/allContext";
import { Home } from "./components/Home";

function App() {

  const {user} = useContext(UserContext)

  return (
    <>
      <div className="container ">
        {user ? (
          <div className="row">
            <div className="col-md-3">
              <List />
            </div>
            <div className="col">
              <Chat />
            </div>
          </div>
        ) : (
          <Home/>
        )}
      </div>
    </>
  );
}

export default App;
