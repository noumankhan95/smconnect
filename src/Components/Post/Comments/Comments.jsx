import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import "./SingleComment.css";
import { db } from "../../../firebase";
const Comments = (props) => {
  // const user = useSelector((state) => state.authreducer.id);
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    const CommentsRef = doc(db, "posts", props.id);
    const unsub = onSnapshot(CommentsRef, (doc) => {
      if (!doc.exists) return;
      const c = [];
      const { cooments } = doc.data();

      cooments?.forEach((i) => c.push({ ...i }));
      setcomments((p) => c);
    });
    return () => unsub;
  }, []);
  if (comments.length === 0) {
    return <h4>No Comments</h4>;
  }
  return (
    <>
      <h4 style={{ textAlign: "start", margin: "1rem" }}>Comments:</h4>
      {comments.map((c) => (
        <div className="scomment">
          <div className="PostFooterImg">
            <img src="https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar" />
          </div>
          <div className="scommentdata">
            <h4>{c.user.email}</h4>
            <hr style={{ width: "100%" }} />
            <p style={{textAlign:'start'}}>{c.comment}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Comments;
