import "./Avatar.css";
import { storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
const ProfileAvatar = (props) => {
  const [url, seturl] = useState("");
  useEffect(() => {
    if (props.profilepic) {
      const imgref = ref(storage, `users/${props.id}/${props.profilepic}`);
      getDownloadURL(imgref)
        .then((url) => {
          console.log(url);
          seturl((p) => url);
        })
        .catch((e) => console.log(e));
    }
  }, []);
  return (
    <NavLink to={`/Profile/${props.id}`} className="pavatar">
      <img
        src={
          url
            ? url
            : "https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar"
        }
        style={{ width: "5rem", height: "5rem", borderRadius: "5rem" }}
      />
      <h5>{props.username}</h5>
    </NavLink>
  );
};

export default ProfileAvatar;
