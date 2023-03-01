import "./Follow.css";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import { Oval } from "react-loader-spinner";
const Follow = (props) => {
  const user = useSelector((state) => state.authreducer);
  const [followList, setfollowList] = useState([]);
  const { followers, following } = props;
  const [isloading, setisloading] = useState(false);
  useEffect(() => {
    if (user.id) {
      setisloading((p) => true);
      getDoc(doc(db, "users", user.id))
        .then((user) => {
          const f = followers ? user.data().followers : user.data().following;

          setfollowList((p) => [...f]);
          setisloading((p) => false);
        })
        .catch((e) => setisloading((p) => false));
    }
  }, [followers, following, user]);
  if (isloading) {
    return (
      <div className="people">
        <Oval visible={true} />
      </div>
    );
  }
  return (
    <div className="people">
      {followList.length > 0 && followList.map((f) => <ProfileAvatar {...f} />)}
      {followList.length === 0 && (
        <div>No {props.followers ? "followers" : "following"}</div>
      )}
    </div>
  );
};

export default Follow;
