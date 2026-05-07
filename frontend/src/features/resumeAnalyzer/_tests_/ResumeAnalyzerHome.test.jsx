import { render, screen, fireEvent } from "@testing-library/react";
import ResumeAnalyzerHome from "../ResumeAnalyzerHome";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock React Router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ResumeAnalyzerHome Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders home page content", () => {
    render(
      <MemoryRouter>
        <ResumeAnalyzerHome />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Resume Analyzer/i, { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText(/Your AI companion/i)).toBeInTheDocument();
  });

  test("navigates to analyzer form on button click", () => {
    render(
      <MemoryRouter>
        <ResumeAnalyzerHome />
      </MemoryRouter>
    );
    
    const analyzeBtn = screen.getByText(/Analyze Resume Now/i);
    fireEvent.click(analyzeBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith("/resume-analyzer/analyzer");
  });
});
