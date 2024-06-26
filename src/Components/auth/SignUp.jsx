import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import "./css/SignUp.css";
import googleIcon from "./google-icon.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");

  const register = (e) => {
    e.preventDefault();
    if (!email || !password || !copyPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (copyPassword !== password) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
      })
      .catch((error) => setError(error.message));
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("User signed in with Google:", user);
        setError("");
      })
      .catch((error) => {
        console.error("Google sign in error:", error);
        setError(error.message);
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={register}>
        <h2>Create an account</h2>
        <input
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <input
          className="input-field"
          placeholder="Confirm Password"
          value={copyPassword}
          onChange={(e) => setCopyPassword(e.target.value)}
          type="password"
          required
        />
        <button className="submit-button" type="submit">Create</button>
        {error && <p className="error-message">{error}</p>}
        <div className="divider">or</div>
        <button className="google-signin-button" type="button" onClick={signInWithGoogle}>
          <img src={googleIcon} alt="Google Icon" className="google-icon" />
          Sign Up with Google
        </button>
      </form>
    </div>
  );
};

export default SignUp;