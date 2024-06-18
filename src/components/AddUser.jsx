import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { db } from "../lib/firebase";
import { Loading } from "./Loading";
import { UserContext } from "./contextAPI/allContext";

export const AddUser = () => {
  const [addedUser, setAddedUser] = useState(null);
  const [isLoading,setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const {user} = useContext(UserContext)

  const handleSearch =  async(e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const usersRef = collection(db, "users");

      const q = query(usersRef, where("displayName", "==", username));
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        setLoading(false)
        setAddedUser(querySnapShot.docs[0].data())
      }else{
        setLoading(false)
        setNotFound(true)
      }
    } catch (error) {
    setLoading(false)
    alert(error.message)
    }
  };

  const handleAdd = async()=>{
    //check if chats exists
    const combinedId = user.id > addedUser.id ? user.id + addedUser.id : addedUser.id + user.id

    try {
      const res = await getDoc(doc(db,"chats",combinedId))
      if (!res.exists()) {
        await setDoc(doc(db,"chats",combinedId),{
          messages:[]
        })
        await updateDoc(doc(db,"userchats",user.id),{
          [combinedId + ".userInfo"]:{
            id:addedUser.id,
            fullname:addedUser.fullname,
            photoURL:addedUser.photoURL,
          },
          [combinedId + ".date"]:serverTimestamp()
        })
        await updateDoc(doc(db,"userchats",addedUser.id),{
          [combinedId + ".userInfo"]:{
            id:user.id,
            fullname:user.fullname,
            photoURL:user.photoURL,
          },
          [combinedId + ".date"]:serverTimestamp()
        })
      }
    } catch (error) {
      // console.log(error);
      alert(error.message)
    }

    setAddedUser(null)

  }


  return (
    <div
      className="modal fade"
      id="addUser"
      tabIndex="-1"
      aria-labelledby="addUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fs-5" id="addUserLabel">
              Search Friend
            </h3>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
          <form onSubmit={handleSearch}>

            <div className="searchBar d-flex flex-row align-items-center my-3">
                <input
                  type="text"
                  placeholder="Search name"
                  className="form-control"
                  name="username"
                />
                <button type="sumbit" className="btn btn-transparent"><i className="fa fa-search ps-3" /></button>
                
            </div>
            </form>

          </div>
          <div className="modal-footer d-flex justify-content-center">
            {addedUser ? (
              <div className="d-flex align-items-center p-2 my-1 border rounded">
                <img
                  src={addedUser.photoURL ? addedUser.photoURL : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt={addedUser.username}
                  className="rounded-circle"
                  style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />
                <span className="ms-3">{addedUser.displayName}</span>
                <button className="btn btn-info small-btn ms-3" onClick={handleAdd} >Add</button>
              </div>
            ) : (
              <div >
                {
                    isLoading ? (
                        <Loading/>
                    ):(
                      <div>
                      {
                        notFound ? (
                          <span className="text-secondary">
                           Not found
                          </span>
                        ):(
                          <span className="text-secondary">
                           Search by username
                          </span>
                        )
                      }
                      </div>
                        
                    )
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
