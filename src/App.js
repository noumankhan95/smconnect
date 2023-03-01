import "./App.css";
import Header from "./Components/Header/Header";
import Auth from "./Pages/Auth/Auth";
import Feed from "./Components/Feed/Feed";

import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/Editprofile/Editprofile";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { Authactions } from "./store/authreducer";
import { loginUserPersistent } from "./store/authreducer";
import Authenticated from "./Components/HOC/Authenticated";
function App() {
  const signedIn = useSelector((state) => state.authreducer.isSignedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    const sub = auth.onAuthStateChanged((auth) => {
      if (!auth) {
        dispatch(Authactions.logout());
      } else {
        dispatch(loginUserPersistent({ email: auth.email, id: auth.uid }));
      }
    });
    return () => sub;
  }, [signedIn, dispatch]);
  return (
    <div className="App">
      <Routes>
        <Route path="/Auth" element={<Auth />} />
        {signedIn ? (
          <Route element={<Authenticated />}>
            <Route path="/feed" element={<Feed />} />

            <Route path="/Profile/:uid" element={<Profile />} />
            <Route path="/editprofile/:uid" element={<EditProfile />} />
            <Route path="*" element={<Navigate to={"/feed"} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to={"/Auth"} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
