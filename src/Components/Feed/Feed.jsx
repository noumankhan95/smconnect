import "./Feed.css";
import Sidebar from "./SideBar/SideBar";
import FeedData from "./FeedData/FeedData";

const Feed = (props) => {
  return (
    <section className="feedContainer">
      <FeedData />
      <Sidebar />
    </section>
  );
};

export default Feed;
