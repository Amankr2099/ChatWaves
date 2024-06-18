import React, { useContext, useEffect, useRef, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { UserContext } from "./contextAPI/allContext";
import { doc, updateDoc } from "firebase/firestore";
import upload from "../lib/upload";
import { Login } from "./Login";

export const Profile = () => {
  const { user } = useContext(UserContext);

  const [editOption, setEditOption] = useState(false);
  const [reauth, setReAuth] = useState(false);
  const inputFile = useRef(null);

  const [username, setUsername] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [fullname, setFullname] = useState(user.fullname);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [about, setAbout] = useState(user.about && user.about);
  const [profilePic, setProfilePic] = useState(null);

  const changeImage = () => {
    inputFile.current.click();
  };

  const updateImage = async (e) => {
    e.preventDefault();
    try {
      const imgURL = await upload(profilePic);
      updateDoc(doc(db, "users", user.id), {
        photoURL: imgURL,
      });
      alert("Image updated !");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // console.log("Signed Out");
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <div className="my-1 border rounded bg-white text-center">
        <div className="pt-2">
          <img
            src={
              user.photoURL
                ? user.photoURL
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="img"
            className="rounded-circle"
            data-bs-toggle="modal"
            data-bs-target="#profile"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <span className="d-block py-1">{user.fullname}</span>
        </div>
      </div>

      <div className="modal fade" tabIndex={-1} id="profile">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2 ">
            <div className="modal-header">
              <h5 className="modal-title">Profile</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="my-2 text-center">
              <img
                src={
                  profilePic
                    ? URL.createObjectURL(profilePic)
                    : user.photoURL
                    ? user.photoURL
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                className="rounded-circle object-fit-cover img-fluid my-1"
                style={{ width: "100px", height: "100px" }}
                alt="Profile"
                onClick={changeImage}
              />

              {profilePic && (
                <button
                  type="button"
                  className="btn btn-info btn-rounded btn-md mt-1 d-block mx-auto"
                  onClick={updateImage}
                >
                  Update Pic
                </button>
              )}

              <input
                type="file"
                accept="image/*"
                className="d-none"
                ref={inputFile}
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                }}
              />
            </div>

            <div className="modal-body text-center text-white bg-primary rounded">
              <h4 className="mb-2">{user.fullname}</h4>
              <p className="text-muted mb-3">{user.displayName} </p>

              <div className="d-flex justify-content-around">
                <button
                  type="button"
                  className="btn btn-info btn-rounded btn-md"
                  onClick={() => {
                    setEditOption(!editOption);
                  }}
                >
                  <i
                    className={`fa-solid fa-${
                      editOption ? "xmark" : "pen"
                    } px-2`}
                  />
                  {editOption ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editOption && (
                <>
                  <div className=" text-center mt-2 mb-2 d-flex flex-column p-2">
                    <label htmlFor="">Add about ...</label>
                    <div className="d-flex ">
                      <input
                        type="text"
                        value={about}
                        placeholder={about}
                        className="rounded form-control w-75 mx-auto"
                        onChange={(e) => {
                          setAbout(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-info btn-rounded btn-sm "
                        onClick={() => {
                          updateDoc(doc(db, "users", user.id), {
                            about: about,
                          })
                            .then(() => {
                              alert("Updated !");
                            })
                            .catch((err) => {
                              alert(err.message);
                            });
                        }}
                      >
                        <i className={`fa-solid fa-check ps-1`} />
                      </button>
                    </div>
                    <label htmlFor="">Full Name</label>
                    <div className="d-flex ">
                      <input
                        type="text"
                        value={fullname}
                        placeholder={fullname}
                        className="rounded form-control w-75 mx-auto"
                        onChange={(e) => {
                          setFullname(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-info btn-rounded btn-sm "
                        onClick={() => {
                          updateDoc(doc(db, "users", user.id), {
                            fullname: fullname,
                          })
                            .then(() => {
                              alert("Full Name Updated !");
                            })
                            .catch((err) => {
                              alert(err.message);
                            });
                        }}
                      >
                        <i className={`fa-solid fa-check ps-1`} />
                      </button>
                    </div>

                    <label htmlFor="">Username</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        placeholder={username}
                        value={username}
                        className="rounded form-control w-75 mx-auto"
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-info btn-rounded btn-sm "
                        onClick={() => {
                          updateDoc(doc(db, "users", user.id), {
                            displayName: username,
                          })
                            .then(() => {
                              alert("Username Updated !");
                            })
                            .catch((err) => {
                              alert(err.message);
                            });
                        }}
                      >
                        <i className={`fa-solid fa-check ps-1`} />
                      </button>
                    </div>

                    <label htmlFor="">Email</label>
                    <div className="d-flex">
                      <input
                        type="email"
                        value={email}
                        placeholder={email}
                        className="rounded form-control w-75 mx-auto"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-info btn-rounded btn-sm "
                        onClick={() => {
                          updateDoc(doc(db, "users", user.id), {
                            email: email,
                          })
                            .then(() => {
                              alert("Email Updated !");
                            })
                            .catch((err) => {
                              alert(err.message);
                            });
                        }}
                      >
                        <i className={`fa-solid fa-check ps-1`} />
                      </button>
                    </div>

                    <label htmlFor="">Password</label>
                    <div className="d-flex">
                      <input
                        type="password"
                        className="rounded form-control w-75 mx-auto"
                        placeholder="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-info btn-rounded btn-sm "
                        onClick={() => {
                          setReAuth(true);
                        }}
                      >
                        <i className={`fa-solid fa-check ps-1`} />
                      </button>
                      
                    </div>
                    {reauth && (
                        <div className="d-flex mt-2">
                          <input
                            type="password"
                            className="rounded form-control w-75 mx-auto"
                            placeholder="old password"
                            value={oldPassword}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-rounded btn-sm "
                            onClick={async () =>  {
                              const credentials = await EmailAuthProvider.credential( user.email, oldPassword);
                              reauthenticateWithCredential(auth.currentUser,credentials)
                                .then(() => {
                                  // User re-authenticated.
                                  updatePassword(auth.currentUser, password)
                                    .then(() => {
                                      alert("Password Updated !");
                                      setPassword("")
                                      setOldPassword("")
                                      setReAuth(false)
                                    })
                                    .catch((err) => {
                                      alert(err.message);
                                    });
                                })
                                .catch((error) => {
                                  alert(error.message);
                                });
                            }}
                          >
                            <i className={`fa-solid fa-check ps-1`} />
                          </button>
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
