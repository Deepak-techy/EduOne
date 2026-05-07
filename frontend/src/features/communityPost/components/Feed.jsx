import PostCard from "./PostCard";

const Feed = ({ posts, refreshPosts, refreshBookmarks, bookmarks }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          refreshPosts={refreshPosts}
          refreshBookmarks={refreshBookmarks}
          bookmarks={bookmarks}
        />
      ))}
    </div>
  );
};

export default Feed;