import "./PostFooter.css";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import Comments from "../Comments/Comments";
import Button from "../../Button/Button";
const PostFooter = (props) => {
  const [comment, setcomment] = useState("");
  const user = useSelector((state) => state.authreducer);
  const [showComments, setshowComments] = useState(false);
  const { id } = props;
  const commentChangeHandler = (e) => {
    e.preventDefault();
    setcomment(e.target.value);
  };
  const addCommentHandler = useCallback(() => {
    setDoc(
      doc(db, "posts", id),
      { cooments: arrayUnion({ comment, user }) },
      { merge: "true" }
    );
  }, [comment, user, id]);
  const toggleCommentHandler = useCallback(() => {
    setshowComments((p) => !p);
  }, []);
  return (
    <>
      <div className="PostFooter">
        <div className="PostFooterImg">
          <img src="https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar" />
        </div>
        <textarea
          type="text"
          placeholder="Add Comment"
          className="PostFooterText"
          onChange={commentChangeHandler}
        ></textarea>
        <Button onClick={addCommentHandler} custom={"cmnt"}>
          Add Comment
        </Button>
        <Button onClick={toggleCommentHandler} custom={"cmnt"}>
          Show Comment
        </Button>
      </div>
   
      {showComments && <Comments {...props} />}
    </>
  );
};

export default PostFooter;
