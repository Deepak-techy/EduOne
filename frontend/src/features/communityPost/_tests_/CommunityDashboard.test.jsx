import { render, screen, fireEvent } from "@testing-library/react";
import CommunityDashboard from "../pages/CommunityDashboard";
import { vi } from "vitest";

// Mock React Router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Auth Context
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { fullName: "Jane Doe" },
  }),
}));

describe("CommunityDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dashboard with user name", () => {
    render(<CommunityDashboard />);
    
    expect(screen.getByText(/Jane/i)).toBeInTheDocument();
    expect(screen.getByText("Community Feed")).toBeInTheDocument();
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  test("navigates to feed on clicking feed card", () => {
    render(<CommunityDashboard />);
    
    const feedCard = screen.getByText("Community Feed").closest("div.group");
    fireEvent.click(feedCard);
    
    expect(mockNavigate).toHaveBeenCalledWith("/community/feed");
  });

  test("navigates to profile on clicking profile card", () => {
    render(<CommunityDashboard />);
    
    const profileCard = screen.getByText("My Profile").closest("div.group");
    fireEvent.click(profileCard);
    
    expect(mockNavigate).toHaveBeenCalledWith("/community/profile");
  });
});