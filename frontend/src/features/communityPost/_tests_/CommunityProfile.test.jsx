import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommunityProfile from "../pages/CommunityProfile";
import { vi } from "vitest";

// Mock React Router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Auth Context
const mockUpdateProfile = vi.fn();
const mockUser = { _id: "u1", fullName: "John Smith", userName: "johns" };
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    updateProfile: mockUpdateProfile,
  }),
}));

// Mock community service
vi.mock("../../../services/communityService", () => ({
  communityService: {
    getBookmarks: vi.fn().mockResolvedValue({ data: { data: { bookmarks: [] } } }),
    getPosts: vi.fn().mockResolvedValue({ data: { data: { posts: [] } } }),
  },
}));

// Mock Feed to prevent full rendering
vi.mock("../components/Feed", () => ({
  default: () => <div data-testid="mock-feed">Mock Feed</div>,
}));

describe("CommunityProfile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders profile info", async () => {
    render(<CommunityProfile />);
    
    await waitFor(() => {
      expect(screen.getByText("My Profile", { selector: "h1" })).toBeInTheDocument();
      expect(screen.getByText("John Smith")).toBeInTheDocument();
      expect(screen.getByText("@johns")).toBeInTheDocument();
    });
  });

  test("navigates to feed on button click", () => {
    render(<CommunityProfile />);
    
    // There are two 'Go to Feed' buttons based on responsive classes, we click the first one
    const feedBtns = screen.getAllByText(/Go to Feed/i);
    fireEvent.click(feedBtns[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith("/community/feed");
  });

  test("opens edit profile modal", async () => {
    render(<CommunityProfile />);
    
    const settingsBtn = screen.getByTitle("Edit Profile");
    fireEvent.click(settingsBtn);
    
    expect(screen.getByText("Edit Profile", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Smith")).toBeInTheDocument();
  });
});