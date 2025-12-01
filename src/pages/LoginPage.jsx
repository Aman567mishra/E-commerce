import React from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}
    </div>
  );
};

export default LoginPage;
