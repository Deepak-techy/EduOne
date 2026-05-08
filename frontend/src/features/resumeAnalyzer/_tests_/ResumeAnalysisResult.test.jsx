import { render, screen, waitFor } from "@testing-library/react";
import ResumeAnalysisResult from "../ResumeAnalysisResult";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock React Router
const mockLocation = {
  state: {
    reportData: {
      _id: "res1",
      fullName: "John Doe",
      jobRole: "Developer",
      experienceLevel: "Fresher",
      score: 85,
      improvements: ["Improve A", "Improve B"],
      strengths: ["Strength 1"],
      categoryScores: { technical: 90 },
      missingKeywords: ["React"],
      summary: "Good resume",
    }
  }
};

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("ResumeAnalysisResult Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders score and basic info from location state", async () => {
    render(
      <MemoryRouter>
        <ResumeAnalysisResult />
      </MemoryRouter>
    );
    
    // Wait for the component to load data
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("(Developer)")).toBeInTheDocument();
      expect(screen.getByText("85")).toBeInTheDocument();
      expect(screen.getByText("Excellent")).toBeInTheDocument();
    });
  });

  test("renders category scores and strengths", async () => {
    render(
      <MemoryRouter>
        <ResumeAnalysisResult />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Scoring Categories")).toBeInTheDocument();
      expect(screen.getByText(/Technical/i)).toBeInTheDocument();
      expect(screen.getByText("Strengths")).toBeInTheDocument();
      expect(screen.getByText("Improvements")).toBeInTheDocument();
      expect(screen.getByText("Missing Keywords")).toBeInTheDocument();
    });
  });
});
