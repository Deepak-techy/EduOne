import PostCard from "./PostCard";

const Feed = ({ posts, refreshPosts }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          refreshPosts={refreshPosts}
        />
      ))}
    </div>
  );
};

export default Feed;