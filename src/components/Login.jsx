import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {Loading} from "../components/Loading"

export const Login = ({ handleFlip }) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // alert("Logged Successfully");

      // window.location.reload();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert(error.message)
        setErr(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-front">
      <div className="card-body text-center">
        <h3 className="card-title">Login </h3>
        <form onSubmit={handleLogin}>
          <div className="form-outline mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              name="email"
            />
          </div>

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
              Login
            </button>
          )}

          <div className="text-center">
            <p>Don't have an account ? </p>
            <span onClick={handleFlip} className="text-info">
              Sign Up
            </span>
          </div>

          {err && <p className="text-center my-2">Wrong Credentials !</p>}
        </form>
      </div>
    </div>
  );
};
