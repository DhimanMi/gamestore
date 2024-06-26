import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./css/AuthDetails.css";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const setUser = (user) => {
    setAuthUser(user || null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="auth-container">
      {authUser ? (
        <div className="auth-details">
          <p>{`Signed in as ${authUser.email}`}</p>
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <p className="signed-out-message">Signed Out</p>
      )}
    </div>
  );
};

export default AuthDetails;