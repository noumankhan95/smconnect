import "./FeedData.css";
import Post from "../../Post/Post";
import Status from "../../Status/Status";
const FeedData = (props) => {
  return (
    <section className="feedData">
      <Status/>
      <Post />
    </section>
  );
};

export default FeedData;
