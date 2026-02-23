import { useEffect, useState } from "react";
import Feed from "./components/Feed";
import BookmarkSidebar from "./components/BookmarkSidebar";
import Filters from "./components/Filters";
import { communityService } from "../../services/communityService";

const CommunityPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [bookmarks, setBookmarks] = useState([]);

  const loadPosts = async () => {
    const res = await communityService.getPosts(filter);
    setPosts(res.data);
  };

  const loadBookmarks = async () => {
    const res = await communityService.getBookmarks();
    setBookmarks(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, [filter]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      
      {/* Main Feed */}
      <div className="col-span-3">
        <Filters
          filter={filter}
          setFilter={setFilter}
          role={user?.role}
          refreshPosts={loadPosts}
        />

        <Feed posts={posts} refreshPosts={loadPosts} />
      </div>

      {/* Bookmark Sidebar */}
      <BookmarkSidebar bookmarks={bookmarks} />

    </div>
  );
};

export default CommunityPage;