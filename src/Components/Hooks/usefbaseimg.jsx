import { useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
const useFbaseimg = () => {
  const [img, setimg] = useState("");
  const [isloading, setisloading] = useState(true);

  function getImage(collection, file, opt = "") {
    let imgref;
    setisloading((p) => true);
    if (!opt) {
      imgref = ref(storage, `${collection}/${file}`);
    } else {
      imgref = ref(storage, `${collection}/${opt}/${file}`);
    }

    return getDownloadURL(imgref)
      .then((r) => setimg((p) => r))
      .catch((e) => console.log(e))
      .finally((_) => setisloading((p) => false));
  }

  return {
    img,
    isloading,
    getImage,
  };
};

export default useFbaseimg;
