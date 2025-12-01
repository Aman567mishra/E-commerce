// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider, db } from "../firebaseConfig";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const currentUser = result.user;

    if (currentUser) {
      const userRef = doc(db, "User_Data", currentUser.uid);
      const snapshot = await getDoc(userRef);

      // If user doesn't exist in Firestore, add them
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
          role: "user",
          createdAt: serverTimestamp()
        });
      }
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
