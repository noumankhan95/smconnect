import "./Status.css";
import PostHeader from "../Post/PostHeader/PostHeader";
import { useCallback, useState, useRef } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Button from "../Button/Button";

const Status = (props) => {
  const [input, setinput] = useState();
  const [image, setimage] = useState();
  const [isSubmitting, setisSubmitting] = useState(false);
  const User = useSelector((state) => state.authreducer);
  const addmediaref = useRef();
  const submitPost = useCallback(() => {
    const Postref = collection(db, "posts");
    let uploadTask;
    const file = image?.image;
    const { followers, following, profile, ...user } = User;
    setisSubmitting((p) => true);
    addDoc(Postref, { ...input, user, filename: file?.name || "" })
      .then((r) => {
        setisSubmitting((p) => false);
        if (file) {
          const imgref = ref(storage, `posts/${r.id}/${file?.name}`);
          uploadTask = uploadBytesResumable(imgref, file);

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
        setinput((p) => ({ postData: "" }));
        setimage((p) => ({ image: "" }));
      })
      .catch((e) => setisSubmitting((p) => false));
  }, [input, image, User]);
  const setData = useCallback((e) => {
    e.preventDefault();
    setinput((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);
  const fileHandler = useCallback((e) => {
    e.preventDefault();
    setimage((p) => ({ ...p, [e.target.name]: e.target.files[0] }));
  }, []);
  const openMedia = useCallback(() => {
    addmediaref.current.click();
  }, []);
  return (
    <section className="status">
      <PostHeader isStatus={true} />
      <textarea
        cols="30"
        rows="10"
        className="statusText"
        placeholder="        Whats On Your Mind"
        name="postData"
        onChange={setData}
        value={input.postData}
      ></textarea>
      {image?.image && (
        <img
          src={URL.createObjectURL(image?.image)}
          style={{ width: "10rem", height: "10rem" }}
        />
      )}
      <div className="statusFooter">
        <input
          type="file"
          onChange={fileHandler}
          name="image"
          style={{ display: "none" }}
          ref={addmediaref}
        />
        <Button onClick={openMedia} custom={"media"}>
          Add Media
        </Button>
        <button onClick={submitPost}>
          {isSubmitting ? "Posting" : "Post"}
        </button>
      </div>
    </section>
  );
};
export default Status;
