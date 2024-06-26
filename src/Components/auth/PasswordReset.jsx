import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import "./css/PasswordReset.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (!email) throw new Error("Please enter your email to reset the password.");
      
      await sendPasswordResetEmail(auth, email);
      
      setError("");
      setSuccess(true);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="password-reset-container">
      <form className="password-reset-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Password Reset</h2>
        <input
          className="input-field"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <button className="submit-button" onClick={handleResetPassword}>
          Reset Password
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Password reset email has been sent.</p>}
      </form>
    </div>
  );
};

export default PasswordReset;