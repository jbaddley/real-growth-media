"use client";
import { useEffect, useState } from "react";
import { UserContext } from "../lib/userContext";
import { useRouter } from "next/navigation";
import { magic } from "../lib/magic";

const Provider = ({ children }) => {
  const [user, setUser] = useState({});
  const logout = () => {
    magic.user.logout().then(() => {
      setUser({});
    });
  };
  const router = useRouter();
  useEffect(() => {
    // Set loading to true to display our loading message within pages/index.js
    setUser({ loading: true });
    // Check if the user is authenticated already
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        // Pull their metadata, update our state, and route to dashboard
        magic.user.getMetadata().then((userData) => setUser(userData));
        router.push("/");
      } else {
        // If false, route them to the login page and reset the user state
        router.push("/login");
        setUser({ user: null });
      }
    });
    // Add an empty dependency array so the useEffect only runs once upon page load
  }, []);
  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

export default Provider;
