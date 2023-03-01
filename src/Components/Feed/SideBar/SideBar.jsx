import "./SideBar.css";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileAvatar from "../../ProfileAvatar/ProfileAvatar";
import Person from "./Person";
import { Oval } from "react-loader-spinner";
const Sidebar = (props) => {
  const [users, setusers] = useState([]);
  const user = useSelector((state) => state.authreducer);
  const [isloading, setisloading] = useState(false);
  const [shownotification, setshownotification] = useState(false);
  const [isfollowing, setisfollowing] = useState(false);
  useEffect(() => {
    setisloading((p) => true);
    getDocs(collection(db, "users"))
      .then((u) => {
        const us = [];
        u.docs.forEach((doc) => us.push(doc.data()));
        setusers((p) => [
          ...us.filter((i) => i.id !== user?.id),
          // ?.filter(
          //   (i) =>
          //     i.id !==
          //     user?.following?.reduce((p, c) => p.push(i.id !== c.id), [])
          // ),
        ]);
        setisloading((p) => false);
      })
      .catch((e) => setisloading((p) => false));
  }, [user]);
  useEffect(() => {
    if (shownotification) {
      setTimeout(() => {
        setshownotification((p) => false);
      }, 1000);
    }
  }, [shownotification]);
  const AddToFollowing = useCallback(
    (e, toUser) => {
      e.stopPropagation();
      setisfollowing((p) => true);
      console.log(toUser);
      const { followers, following, profile, ...ToUser } = toUser;
      setDoc(
        doc(db, "users", user.id),
        { following: arrayUnion({ ...ToUser }) },
        { merge: true }
      )
        .then((r) => {
          const { followers, following, profile, ...User } = user;
          setisfollowing((p) => false);
          return setDoc(
            doc(db, "users", ToUser.id),
            { followers: arrayUnion({ ...User }) },
            { merge: true }
          );
        })
        .then((r) => {
          setisfollowing((p) => false);
          setshownotification((p) => true);
          setusers((e) => [...e.filter((e) => e.id !== toUser.id)]);
        })
        .catch((e) => {
          setisfollowing((p) => false);
          console.log(e);
        });
    },
    [user]
  );

  return (
    <aside className="aside">
      <div>
        <h1 className="browseText">Browse Users</h1>
        <hr />
        {isloading && (
          <div className="spinner">
            <Oval visible={true} height={40} width={30} />
          </div>
        )}
        {!isloading &&
          users?.map((u) => (
            <Person
              {...u}
              AddToFollowing={AddToFollowing}
              user={{ ...u }}
              isfollowing={isfollowing}
              key={u.id}
              // shownotification={showNotification}
            />
          ))}
      </div>

      {shownotification && (
        <div className="follownot">
          <h3>USer Followed</h3>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
