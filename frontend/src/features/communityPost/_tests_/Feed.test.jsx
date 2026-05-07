import { render, screen } from "@testing-library/react";
import Feed from "../components/Feed";
import { vi } from "vitest";

// Mock PostCard
vi.mock("../components/PostCard", () => ({
  default: ({ post }) => <div data-testid="mock-post-card">{post.title}</div>
}));

const mockPosts = [
  { _id: "1", title: "Post 1" },
  { _id: "2", title: "Post 2" },
];

describe("Feed Component", () => {
  test("renders list of posts", () => {
    render(<Feed posts={mockPosts} />);
    
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-post-card").length).toBe(2);
  });

  test("renders nothing or empty when no posts", () => {
    const { container } = render(<Feed posts={[]} />);
    expect(screen.queryByTestId("mock-post-card")).not.toBeInTheDocument();
  });
});