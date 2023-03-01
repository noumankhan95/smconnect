import "./Editprofile.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { useRef, useState, useCallback, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Button from "../../../Components/Button/Button";
const EditProfile = (props) => {
  const user = useSelector((state) => state.authreducer);
  const [profile, setprofile] = useState();
  const [display, setdisplay] = useState();
  const [showUser, setshowUser] = useState(user);
  const [isupdating, setisupdating] = useState(false);
  const { uid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setdisplay(user.profile);
    if (uid) {
      getDoc(doc(db, "users", uid)).then((doc) =>
        setshowUser((p) => ({ ...p, ...doc.data() }))
      );
    }
  }, [uid, user]);
  const [input, setinput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const imgref = useRef();
  const changeProfileclick = useCallback(() => {
    imgref.current.click();
  }, []);
  const imgchangeHandler = useCallback((e) => {
    setprofile(e.target.files[0]);
    setdisplay(URL.createObjectURL(e.target.files[0]));

    // console.log(e.target.files[0].name);
  }, []);
  const changeInput = useCallback((e) => {
    setinput((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);
  const submitHandler = useCallback(() => {
    setisupdating((p) => true);
    if (profile) {
      const imgref = ref(storage, `users/${user.id}/${profile.name}`);
      const uploadTask = uploadBytesResumable(imgref, profile);
      uploadTask?.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          console.log("percentage :" + percent);
          // setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
          });
        }
      );
    }
    setDoc(
      doc(db, "users", user.id),
      {
        ...(input.email ? { email: input.email } : {}),
        ...(input.username ? { username: input.username } : {}),
        ...(profile ? { profilepic: profile?.name } : {}),
      },
      { merge: true }
    )
      .then((r) => {
        console.log(r);
        navigate(`/Profile/${uid}`);
      })
      .catch((e) => console.log(e))
      .finally((_) => setisupdating(false));
  }, [profile, user, input]);
  return (
    <section className="profile">
      <div className="profileInfo">
        <h3>Edit Profile</h3>
        <div className="editheadArea">
          <div className="editheadimg">
            <img
              src={
                display
                  ? display
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Person_icon_BLACK-01.svg/1924px-Person_icon_BLACK-01.svg.png"
              }
              alt=""
            />
            <h4 onClick={changeProfileclick}> Edit Picture</h4>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imgref}
              onChange={imgchangeHandler}
            />
          </div>
        </div>
        <div className="changeInfo">
          Username
          <input type="text" name="username" onChange={changeInput} />
          About <input type="text" name="about" onChange={changeInput} />
          {/* Email
          <input type="text" name="email" onChange={changeInput} /> */}
          <Button onClick={submitHandler} custom={"cmnt"}>
            {isupdating ? "Updating" : "Update"}
          </Button>
        </div>
      </div>
    </section>
  );
};
export default EditProfile;
