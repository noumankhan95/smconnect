import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    isSignedIn: true,
    id: "",
    username: "",
    email: "",
    profile: "",
    followers: [],
    following: [],
    profilepic: "",
  },
  reducers: {
    userSignIn(state, action) {
      console.log(action);
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.profilepic = action.payload.profilepic || "";
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.isSignedIn = true;
    },
    userlogout(state, action) {
      state.isSignedIn = false;
    },
    setSigninTrue(state) {
      state.isSignedIn = true;
    },
    setProfilepic(state, action) {
      state.profile = action.payload.profile;
    },
  },
});
export const Authactions = {
  signin: authSlice.actions.userSignIn,
  logout: authSlice.actions.userlogout,
  signIntrue: authSlice.actions.setSigninTrue,
  setProfile: authSlice.actions.setProfilepic,
};
export function logoutUser() {
  return (dispatch) =>
    signOut(auth)
      .then((r) => dispatch(Authactions.logout()))
      .catch((e) => console.log(e));
}
export function loginUserPersistent(input) {
  return (dispatch) => {
    getDoc(doc(db, "users", input.id)).then((user) => {
      if (user.data()) {
        dispatch(
          Authactions.signin({
            username: user.data().username,
            email: input.email,
            id: input.id,
            followers: user.data().followers,
            following: user.data().following,
            profilepic: user.data().profilepic,
          })
        );
        if (user.data().profilepic) {
          const pathRef = ref(
            storage,
            `users/${user.id}/${user.data().profilepic}`
          );
          getDownloadURL(pathRef)
            .then((url) => dispatch(Authactions.setProfile({ profile: url })))
            .catch((e) => console.log(e));
        }
      }
    });
  };
}
export function signupUser(input) {
  return async (dispatch) => {
    return createUserWithEmailAndPassword(auth, input.email, input.password)
      .then((ucredential) => {
        const userRef = doc(db, "users", ucredential.user.uid);
        setDoc(userRef, {
          id: ucredential.user.uid,
          email: input.email,
          username: input.username,
          profilepic: "",
          followers: [],
          following: [],
        })
          .then((r) => console.log(r))
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        throw e;
      });
  };
}

export function signinUser(input) {
  return async (dispatch) => {
    return signInWithEmailAndPassword(auth, input.email, input.password)
      .then((ucredential) => {
        console.log(ucredential);
        dispatch(
          Authactions.signin({
            id: ucredential.user.uid,
            email: ucredential.user.email,
          })
        );
        // navigate("/feed");
      })
      .catch((e) => console.log(e));
  };
}

export default authSlice.reducer;
