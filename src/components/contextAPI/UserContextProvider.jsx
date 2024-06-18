import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserContext } from "./allContext";

const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const fetchUserInfo = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        alert("User not found");
      }
    } catch (error) {
      alert(error.message)
    }
  };

  useEffect(() => {
    
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user.uid) {
        fetchUserInfo(user.uid);      
      }
    });

    return () => {
      unSub();
    };

  }, [user]);



  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider };
