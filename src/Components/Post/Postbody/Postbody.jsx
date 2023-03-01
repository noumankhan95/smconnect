import "./Postbody.css";
import { useEffect, useState } from "react";
import useFbaseimg from "../../Hooks/usefbaseimg";
import { Oval } from "react-loader-spinner";
const Postbody = (props) => {
  const { img, getImage } = useFbaseimg();
  const [isloading, setisloading] = useState(false);
  console.log(props)
  useEffect(() => {
    if (
      props.filename &&
      !props.filename.includes("https://firebasestorage.googleapis")
    ) {
      //
      setisloading((p) => true);
      setTimeout(() => {
        getImage("posts", props.filename, props.id).finally((_) =>
          setisloading((p) => false)
        );
      }, 5000);
    } else if (
      props.filename &&
      props.filename.includes("https://firebasestorage.googleapis")
    ) {
      // setisloading(true);
      setisloading((p) => true);
      getImage("posts", props.filename, props.id).finally((_) =>
        setisloading((p) => false)
      );
    }
  }, []);
  console.log("isloading? ", isloading);
  return (
    <div className="postBody">
      {img && !isloading && (
        <img
          src={img}
          style={{
            height: "20rem",
            margin: "auto",
            objectFit: "contain",
            borderRadius: "2rem",
          }}
        />
      )}
      {isloading && <Oval visible={isloading} />}
      <p className="postContent">{props.postData}</p>
    </div>
  );
};

export default Postbody;
