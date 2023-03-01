import "./Profile.css";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import Follow from "../../Components/Follow/Follow";
import { doc, getDoc } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
const Profile = (props) => {
  const user = useSelector((state) => state.authreducer);
  const [showUser, setshowUser] = useState(user);
  const { uid } = useParams();
  const [isloading, setisloading] = useState(false);
  const { profile } = user;
  useEffect(() => {
    if (uid) {
      setisloading(true);
      getDoc(doc(db, "users", uid))
        .then((doc) => {
          setshowUser((p) => ({ ...doc.data() }));
          setisloading(false);
        })
        .catch((e) => {
          setisloading(false);
        });
    }
  }, [uid, user]);
  // const profileRef = ref(`/users/${user}`);
  const [showFollowers, setshowFollowers] = useState({
    folllowers: false,
    following: false,
  });
  console.log(showUser, user);
  if (isloading) {
    return (
      <div className="profile">
        <Oval visible={true} />
      </div>
    );
  }
  return (
    <section className="profile">
      <div className="profileInfo">
        <h3>Profile</h3>
        <h2
          style={{
            textAlign: "center",
            width: "100%",
            margin: "1rem",
            fontSize: "1.4rem",
            fontWeight: "lighter",
          }}
        >
          {showUser?.email}
        </h2>
        <div className="headArea">
          <div className="headimg">
            <img
              src={
                user?.profile
                  ? user?.profile
                  : "https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar"
              }
              alt=""
            />
          </div>
          <div>
            <h2>{showUser.username || "Welcome"}</h2>
          </div>
          {user.id === showUser.id && (
            <div className="headinfo">
              <div>
                <NavLink
                  to={`/editprofile/${showUser.id}`}
                  className="editprofileLink"
                >
                  Edit Profile
                </NavLink>
              </div>
            </div>
          )}
        </div>
        <div className="Actions">
          <button
            onClick={(e) => {
              console.log(e.target);
              e.stopPropagation();
              setshowFollowers((p) => ({ followers: false, following: true }));
            }}
          >
            Following
          </button>
          <button
            onClick={(e) => {
              console.log(e.target);
              e.stopPropagation();
              setshowFollowers((p) => ({ followers: true, following: false }));
            }}
          >
            Followers
          </button>
        </div>
        <div className="peopleList">
          {showFollowers && <Follow {...showFollowers} />}
        </div>
      </div>
    </section>
  );
};
export default Profile;
