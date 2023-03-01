import "./PostHeader.css";
import { useSelector } from "react-redux";
import Button from "../../Button/Button";
import { useCallback, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import useFbaseimg from "../../Hooks/usefbaseimg";
const PostHeader = (props) => {
  const user = useSelector((state) => state.authreducer);
  const { getImage, img, isloading } = useFbaseimg();
  useEffect(() => {
    if (!props.isStatus && props.user?.profilepic) {
      getImage("users", props.user.profilepic, props.user.id);
    }
  }, []);
  const DeletePostHandler = useCallback(() => {
    deleteDoc(doc(db, "posts", props.id))
      .then((r) => console.log(r))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className={`Postheader ${props.isStatus ? "statusHeader" : ""}`}>
      <div className="profileHeader">
        {!props.isStatus && (
          <img
            src={
              props.user?.profilepic
                ? img
                : `https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar`
            }
            style={{
              height: "5rem",
              width: "5rem",
              borderRadius: "5rem",
              objectFit: "cover",
            }}
          />
        )}
        {props.isStatus && (
          <img
            src={
              user.profile
                ? user.profile
                : `https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar`
            }
            style={{
              height: "5rem",
              width: "5rem",
              borderRadius: "5rem",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <div className={`userinfo ${props.isStatus ? "statusUserinfo" : ""}`}>
        <h3>{props.isStatus ? user.email : props.user?.email}</h3>
        <p>{!props.isStatus ? props.user?.username : user.username}</p>
      </div>
      {!props.isStatus && user.id === props.user.id && (
        <h3
          style={{ color: "red", marginLeft: "40rem", cursor: "pointer" }}
          onClick={DeletePostHandler}
        >
          Delete Post
        </h3>
      )}
    </div>
  );
};

export default PostHeader;
