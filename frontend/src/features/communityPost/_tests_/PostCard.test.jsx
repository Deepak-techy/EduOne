import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCard from "../components/PostCard";
import { vi } from "vitest";

// Mock the Auth Context
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "user123", role: "Student" },
  }),
}));

// Mock the community service
vi.mock("../../../services/communityService", () => ({
  communityService: {
    upvotePost: vi.fn(),
    downvotePost: vi.fn(),
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    deletePost: vi.fn(),
  },
}));

// Mock CommentSection to prevent full rendering
vi.mock("../components/CommentSection", () => ({
  default: () => <div data-testid="comment-section">Comments</div>,
}));

const mockPost = {
  _id: "post123",
  title: "Test Post Title",
  content: "Test post content here.",
  author: { _id: "author123", fullName: "John Doe", userName: "johndoe" },
  authorRole: "Student",
  upvotes: ["user1", "user2"],
  downvotes: ["user3"],
  commentsCount: 5,
};

describe("PostCard Component", () => {
  const refreshPostsMock = vi.fn();
  const refreshBookmarksMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders post title, content, and author", () => {
    render(<PostCard post={mockPost} refreshPosts={refreshPostsMock} />);
    
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.getByText("Test post content here.")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  test("displays upvotes and downvotes count", () => {
    render(<PostCard post={mockPost} refreshPosts={refreshPostsMock} />);
    
    expect(screen.getByText("2")).toBeInTheDocument(); // upvotes
    expect(screen.getByText("1")).toBeInTheDocument(); // downvotes
  });

  test("upvote button calls service and refresh", async () => {
    const { communityService } = await import("../../../services/communityService");
    render(<PostCard post={mockPost} refreshPosts={refreshPostsMock} />);
    
    const buttons = screen.getAllByRole("button");
    const upvoteBtn = buttons[0]; // First button is delete if owner/admin, but let's select by icon or order.
    // Let's find upvote by text content '2' parent
    const upvoteButton = screen.getByText("2").closest("button");
    
    fireEvent.click(upvoteButton);
    
    expect(communityService.upvotePost).toHaveBeenCalledWith("post123");
    await waitFor(() => expect(refreshPostsMock).toHaveBeenCalled());
  });

  test("bookmark toggle works", async () => {
    const { communityService } = await import("../../../services/communityService");
    render(<PostCard post={mockPost} refreshPosts={refreshPostsMock} refreshBookmarks={refreshBookmarksMock} bookmarks={[]} />);
    
    // Find bookmark button, it's the last button before comments
    // Using query by checking for SVG
    const buttons = screen.getAllByRole("button");
    const bookmarkBtn = buttons[buttons.length - 1]; // Last button is bookmark if comments are closed
    
    fireEvent.click(bookmarkBtn);
    
    expect(communityService.addBookmark).toHaveBeenCalledWith("post123");
    await waitFor(() => expect(refreshBookmarksMock).toHaveBeenCalled());
  });

  test("toggles comment section", () => {
    render(<PostCard post={mockPost} refreshPosts={refreshPostsMock} />);
    
    expect(screen.queryByTestId("comment-section")).not.toBeInTheDocument();
    
    const commentsButton = screen.getByText("5").closest("button");
    fireEvent.click(commentsButton);
    
    expect(screen.getByTestId("comment-section")).toBeInTheDocument();
  });
});