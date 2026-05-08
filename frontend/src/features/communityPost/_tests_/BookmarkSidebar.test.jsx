import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookmarkSidebar from "../components/BookmarkSidebar";
import { vi } from "vitest";

// Mock the community service
vi.mock("../../../services/communityService", () => ({
  communityService: {
    removeBookmark: vi.fn(),
  },
}));

describe("BookmarkSidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders bookmarked posts", () => {
    const bookmarks = [{ _id: "1", postId: { _id: "post1", title: "Saved Post", content: "Content here" } }];
    
    render(<BookmarkSidebar bookmarks={bookmarks} />);
    
    expect(screen.getByText("Saved Post")).toBeInTheDocument();
  });

  test("shows empty state", () => {
    render(<BookmarkSidebar bookmarks={[]} />);
    
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });

  test("opens modal on clicking a post", () => {
    const bookmarks = [{ _id: "1", postId: { _id: "post1", title: "Saved Post", content: "Modal Content Here" } }];
    
    render(<BookmarkSidebar bookmarks={bookmarks} />);
    
    fireEvent.click(screen.getByText("Saved Post"));
    
    expect(screen.getAllByText("Modal Content Here").length).toBeGreaterThan(1);
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  test("removes a bookmark", async () => {
    const { communityService } = await import("../../../services/communityService");
    const refreshBookmarksMock = vi.fn();
    const bookmarks = [{ _id: "1", postId: { _id: "post1", title: "Saved Post", content: "Content here" } }];
    
    render(<BookmarkSidebar bookmarks={bookmarks} refreshBookmarks={refreshBookmarksMock} />);
    
    // Find the trash icon wrapper button
    const removeBtn = screen.getByTitle("Remove bookmark");
    fireEvent.click(removeBtn);
    
    expect(communityService.removeBookmark).toHaveBeenCalledWith("post1");
    await waitFor(() => expect(refreshBookmarksMock).toHaveBeenCalled());
  });
});