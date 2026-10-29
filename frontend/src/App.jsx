import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import getCurrentUser from "./customHooks/getCurrentUser";
import getOtherUsers from "./customHooks/getOtherUsers";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

const App = () => {
  getCurrentUser();
  getOtherUsers();

  const { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch()
  useEffect(() => {
    // Wait until the logged-in user's ID is available
    if (userData) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: userData._id,
        },
      });
      dispatch(setSocket(socketio))

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users))
      })

      return () => socketio.close()
    }
    else {
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }



  }, [userData?._id]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/profile"
        element={
          userData ? <Profile /> : <Navigate to="/signup" replace />
        }
      />
    </Routes>
  );
};

export default App;