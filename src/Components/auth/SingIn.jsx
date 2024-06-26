import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import "./css/SignIn.css";
import googleIcon from "./google-icon.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      setError("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setError("Sorry, couldn't log in. Please check your email and password");
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google:", result.user);
      setError("");
    } catch (error) {
      console.error("Google sign in error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleLogIn}>
        <h2>Log in</h2>
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
        <button className="submit-button" type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
        <div className="divider">or</div>
        <button className="google-signin-button" type="button" onClick={handleSignInWithGoogle}>
          <img src={googleIcon} alt="Google Icon" className="google-icon" />
          Sign In with Google
        </button>
      </form>
    </div>
  );
};

export default SignIn;