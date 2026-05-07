import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePostModal from "../components/CreatePostModal";
import { vi } from "vitest";

// Mock the community service
vi.mock("../../../services/communityService", () => ({
  communityService: {
    createPost: vi.fn(),
  },
}));

describe("CreatePostModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders modal when open", () => {
    render(<CreatePostModal open={true} setOpen={vi.fn()} role="Student" refreshPosts={vi.fn()} />);
    
    expect(screen.getByText("Create Post")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    const { container } = render(<CreatePostModal open={false} setOpen={vi.fn()} role="Student" refreshPosts={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("input updates on typing", () => {
    render(<CreatePostModal open={true} setOpen={vi.fn()} role="Student" refreshPosts={vi.fn()} />);
    
    const titleInput = screen.getByPlaceholderText(/What's your post about\?/i);
    fireEvent.change(titleInput, { target: { value: "New Post" } });

    expect(titleInput.value).toBe("New Post");
  });

  test("submit button creates post and closes modal", async () => {
    const { communityService } = await import("../../../services/communityService");
    const setOpenMock = vi.fn();
    const refreshPostsMock = vi.fn();
    
    render(<CreatePostModal open={true} setOpen={setOpenMock} role="Student" refreshPosts={refreshPostsMock} />);
    
    const titleInput = screen.getByPlaceholderText(/What's your post about\?/i);
    const contentInput = screen.getByPlaceholderText(/Share your thoughts/i);
    
    fireEvent.change(titleInput, { target: { value: "My Title" } });
    fireEvent.change(contentInput, { target: { value: "My Content" } });
    
    const submitBtn = screen.getByText("Publish Post");
    fireEvent.click(submitBtn);
    
    expect(communityService.createPost).toHaveBeenCalledWith({
      title: "My Title",
      content: "My Content"
    });
    
    await waitFor(() => {
      expect(setOpenMock).toHaveBeenCalledWith(false);
      expect(refreshPostsMock).toHaveBeenCalled();
    });
  });
});