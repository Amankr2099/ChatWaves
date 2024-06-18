import React, { useContext, useEffect, useState } from "react";
import { Profile } from "./Profile";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AddUser } from "./AddUser";
import { ChatContext, UserContext } from "./contextAPI/allContext";

export const List = () => {
  // const userList = [
  //   {
  //     name: "Alice Johnson",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Alice Johnson",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Alice Johnson",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Alice Johnson",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Alice Johnson",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Bob Smith",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Carol Martinez",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "David Brown",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Eva Davis",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Franklin Harris",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Grace Lee",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Henry Walker",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Isabella Hall",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  //   {
  //     name: "Jack Allen",
  //     profilePic:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   },
  // ];

  const { user } = useContext(UserContext);
  const { setChatId, setChatUser } = useContext(ChatContext);

  const [search,setSearch] = useState('')

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const getUserList = () => {
      const unsub = onSnapshot(doc(db, "userchats", user.id), async (res) => {
        const usersData = res.data();
        if(usersData){
          setUserList(Object.entries(usersData));
        }
      });
      return () => {
        unsub();
      };
    };

    user.id && getUserList();
  }, [user.id]);

  const handleSelectedUser = async (receivedId) => {
    try {
      const res = await getDoc(doc(db, "users", receivedId));
      setChatUser(res.data());
      const combinedId =
        user.id > receivedId ? user.id + receivedId : receivedId + user.id;
      setChatId(combinedId);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container border border-info rounded my-2 d-flex flex-column vh-md-100 bg-info-subtle">
      <Profile />
      <div className="searchBar d-flex flex-row align-items-center my-3">
        <input type="text" placeholder="Search name" className="form-control" onChange={(e)=>setSearch(e.target.value)}/>
        <i className="fa fa-search ps-3" />
      </div>

      <div className="addUser text-center">
        <button
          className="btn btn-outline-info rounded my-1"
          data-bs-toggle="modal"
          data-bs-target="#addUser"
        >
          Add new friend <i className="fa fa-plus ps-2" />{" "}
        </button>

        <AddUser />
      </div>

      <div className="user-list overflow-y-scroll">
        {userList &&
          userList.filter((user)=>{
            return search.toLowerCase() === '' ? user : user[1].userInfo.fullname.toLowerCase().includes(search)
          })
            .sort((a, b) => b[1].date - a[1].date)
            .map((user, index) => {
              return (
                <div
                  className="d-flex align-items-center p-2 my-1 border rounded bg-info"
                  key={index}
                  onClick={() => handleSelectedUser(user[1].userInfo.id)}
                >
                  <img
                    src={
                      user[1].userInfo.photoURL
                        ? user[1].userInfo.photoURL
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="img"
                    className="rounded-circle"
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="user-name ms-1  d-flex flex-column">
                    <span>{user[1].userInfo.fullname}</span>
                    <span className="text-secondary">
                      {user[1].lastmessage && (user[1].lastmessage.text).slice(0,25) + '...'}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
