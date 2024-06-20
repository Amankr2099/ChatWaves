import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import upload from "../lib/upload";
import { Loading } from "../components/Loading";
import { v4 as uniqueId } from "uuid";


export const SignUp = ({ handleFlip }) => {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [err, setErr] = useState(false);

  // const handleAddingCharacter = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const formData = new FormData(e.target);
  //   const { fullname, username, about } = Object.fromEntries(formData);
  //   try {
  //     const imgURL = await upload(profilePic);
  //     const uniqueId = uniqueId()
  //     await setDoc(doc(db, "characters", uniqueId), {
  //       id: uniqueId,
  //       displayName: username,
  //       fullname,
  //       photoURL: imgURL,
  //       about
  //     });

  //     alert("Registerd Successfully")
  //     // window.location.reload();
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.error) {
  //       alert(error.response.data.error);
  //     } else {
  //       // alert("An error occurred while registering. Please try again later.");
  //       alert(error.message);
  //       setErr(true);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { fullname, username, email, password } =
      Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgURL = await upload(profilePic);
      await setDoc(doc(db, "users", res.user.uid), {
        displayName: username,
        fullname,
        email,
        photoURL: imgURL,
        id: res.user.uid,
      });

      await setDoc(doc(db, "userchats", res.user.uid), {});

      // alert("Registerd Successfully")
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        // alert("An error occurred while registering. Please try again later.");
        alert(error.message);
        setErr(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-back">
      <div className="card-body text-center">
        <h3 className="card-title">Signup </h3>
        <form onSubmit={handleSignup}>
          <div className="mb-4 text-center">
            <img
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              className="rounded-circle img-fluid"
              style={{ width: "100px" }}
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              className="mx-auto d-block mt-2"
              onChange={(e) => {
                setProfilePic(e.target.files[0]);
              }}
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="form-outline">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  name="fullname"
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-outline">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  name="username"
                />
              </div>
            </div>
          </div>

          <div className="form-outline mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              name="email"
            />
          </div>

{/* <div className="form-outline mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="About.."
              name="about"
            />
          </div> */}

          <div className="form-outline mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
            />
          </div>

          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="btn btn-primary d-block mx-auto mb-4"
              disabled={loading}
            >
              Sign up
            </button>
          )}

          <div className="text-center">
            <p>Already have an account ? </p>
            <span onClick={handleFlip} className="text-info">
              Login
            </span>
          </div>

          {err && (
            <p className="text-center my-2">
              An error occurred while logging in
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
