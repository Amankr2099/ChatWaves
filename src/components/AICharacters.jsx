import React, { useContext, useEffect, useState } from "react";
import { ChatContext, UserContext } from "./contextAPI/allContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const AICharacters = () => {
  const [aiCharacters, setaiCharacters] = useState([]);

  const { user } = useContext(UserContext);
  const {aiCharacter,setAiCharacter} = useContext(ChatContext)
  
  const getCharacters = async () => {
    try {
      const fetchedCharacters = await getDocs(collection(db, "characters"));
      fetchedCharacters.forEach((character) => {
        setaiCharacters((pre) => {
          const characterData = character.data();
          
          if (!pre.some((char) => char.id === characterData.id)) {
            return [...pre, characterData];
          }
          return pre;
        })
      })
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    getCharacters();
  }, [user.id]);

  const handleAdd = async (aiCharacter) => {
    //check if chats exists
    const combinedId =
      user.id > aiCharacter.id
        ? user.id + aiCharacter.id
        : aiCharacter.id + user.id;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
        await updateDoc(doc(db, "userchats", user.id), {
          [combinedId + ".userInfo"]: {
            id: aiCharacter.id,
            fullname: aiCharacter.fullname,
            photoURL: aiCharacter.photoURL,
            isAiCharacter:true
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        setAiCharacter(aiCharacter)
      }
    } catch (error) {
      // console.log(error);
      alert(error.message);
    }
  };

  return (
    <div
      className="modal fade"
      id="add-aiCharacters"
      tabIndex="-1"
      aria-labelledby="add-aiCharactersLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fs-5" id="add-aiCharactersLabel">
              Talk to ai characters
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-footer d-flex flex-column justify-content-center">
          {aiCharacters.map((character, index) => {
              return (
                <div
                  className="d-block align-items-center p-2 my-1 border rounded "
                  key={index}
                >
                  <img
                    src={character.photoURL}
                    alt={character.displayName}
                    className="rounded-circle"
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-3">{character.fullname}</span>
                  <button
                    className="btn btn-info small-btn ms-3"
                    onClick={() => handleAdd(character)}
                  >
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
