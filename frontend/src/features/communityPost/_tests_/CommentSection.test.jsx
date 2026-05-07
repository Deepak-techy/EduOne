import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentSection from "../components/CommentSection";
import { vi } from "vitest";

// Mock Auth Context
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "user1", role: "Student" },
  }),
}));

// Mock community service
vi.mock("../../../services/communityService", () => ({
  communityService: {
    getComments: vi.fn().mockResolvedValue({
      data: {
        data: {
          comments: [
            { _id: "c1", text: "Nice post!", userId: { _id: "user2", fullName: "Jane Doe" } }
          ]
        }
      }
    }),
    addComment: vi.fn().mockResolvedValue({}),
    deleteComment: vi.fn(),
  },
}));

describe("CommentSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads and renders comments", async () => {
    render(<CommentSection postId="post1" postAuthorId="user3" />);
    
    // Check loading state
    // Once loaded, comments should appear
    await waitFor(() => {
      expect(screen.getByText("Nice post!")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  test("adds new comment", async () => {
    const { communityService } = await import("../../../services/communityService");
    render(<CommentSection postId="post1" postAuthorId="user3" />);
    
    await waitFor(() => {
      expect(screen.getByText("Nice post!")).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/write a comment/i);
    fireEvent.change(input, { target: { value: "Hello" } });

    const submitBtn = screen.getByRole("button", { name: /send comment/i });
    fireEvent.click(submitBtn);

    expect(communityService.addComment).toHaveBeenCalledWith("post1", "Hello");
  });
});