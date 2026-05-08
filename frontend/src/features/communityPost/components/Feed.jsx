import PostCard from "./PostCard";

const Feed = ({ posts, refreshPosts, refreshBookmarks, bookmarks, reportedPostIds = [] }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          refreshPosts={refreshPosts}
          refreshBookmarks={refreshBookmarks}
          bookmarks={bookmarks}
          isAlreadyReported={reportedPostIds.includes(post._id)}
        />
      ))}
    </div>
  );
};

export default Feed;