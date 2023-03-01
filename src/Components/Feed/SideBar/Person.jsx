import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../firebase";
import Button from "../../Button/Button";
import usefbaseimg from "../../Hooks/usefbaseimg";
const Person = (props) => {
  const navigate = useNavigate();
  // const [url, seturl] = useState();
  const { profile } = props;
  const { img, isloading, getImage } = usefbaseimg();

  useEffect(() => {
    if (props.profilepic) {
      getImage(`users`, props.profilepic, props.id);
      // const imgRef = ref(storage, `users/${props.id}/${props.profilepic}`);
      // getDownloadURL(imgRef)
      //   .then((url) => seturl(url))
      //   .catch((e) => console.log(e));
    }
  }, [profile]);

  return (
    <div
      onClick={() => navigate(`/Profile/${props.id}`)}
      key={props.id}
      name={`${props.id}`}
      className="person"
    >
      <h1>{props.username}</h1>
      <img
        src={
          props.profilepic
            ? `${img}`
            : "https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar"
        }
        alt=""
        style={{ width: "5rem", height: "5rem", borderRadius: "3rem" }}
      />
      <Button
        onClick={(e) => {
          props.AddToFollowing(e, { ...props.user });
        }}
      >
        {props.isfollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default Person;
