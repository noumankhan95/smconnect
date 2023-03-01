import "./Post.css";
import PostHeader from "./PostHeader/PostHeader";
import Postbody from "./Postbody/Postbody";
import PostFooter from "./PostFooter/PostFooter";
import { getDocs } from "firebase/firestore/lite";
import {
  onSnapshot,
  collection,
  QuerySnapshot,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
const Post = (props) => {
  const [Posts, setPosts] = useState([]);
  const [isloading, setisloading] = useState(true);
  useEffect(() => {
    const postRef = collection(db, "posts");
    const q = query(postRef);
    const sub = onSnapshot(q, (QuerySnapshot) => {
      setisloading(true);
      const posts = [];

      QuerySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setPosts((p) => posts);
      setisloading(false);
    });

    return () => sub;
  }, []);
  if (isloading) {
    return (
      <div className="spinner">
        <Oval visible={true} height={40} width={40} />
      </div>
    );
  }
  return Posts?.map((p) => (
    <div className="Post" key={p.id}>
      <PostHeader {...p} />
      <Postbody {...p} />
      <PostFooter {...p} />
    </div>
  ));
};

export default Post;
