import FeedCard from "../components/FeedCard";
import classes from "./pages.module.css";

const Feed = ({ feedsData }) => {
  return (
    <div className={classes.feedsBody}>
      {!!feedsData.length && feedsData.map((feed) => <FeedCard data={feed} />)}
    </div>
  );
};
export default Feed;
