import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResumeAnalyzerForm from "../ResumeAnalyzerForm";
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

// Mock resumeService
const mockAnalyzeResume = vi.fn();
vi.mock("../../../services/resumeService", () => ({
  resumeService: {
    analyzeResume: (...args) => mockAnalyzeResume(...args),
  },
}));

// Mock window.URL
global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test-url");

describe("ResumeAnalyzerForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form inputs", () => {
    render(
      <MemoryRouter>
        <ResumeAnalyzerForm />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Analyze Your Resume")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/software engineer/i)).toBeInTheDocument();
  });

  test("shows error when fields are empty on submit", () => {
    render(
      <MemoryRouter>
        <ResumeAnalyzerForm />
      </MemoryRouter>
    );
    
    const submitBtn = screen.getByText(/Save & Analyze Resume/i);
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/Please fill all fields and upload a resume/i)).toBeInTheDocument();
  });

  test("submits form successfully and navigates", async () => {
    mockAnalyzeResume.mockResolvedValueOnce({
      data: {
        data: {
          resume: { _id: "resume123" }
        }
      }
    });

    render(
      <MemoryRouter>
        <ResumeAnalyzerForm />
      </MemoryRouter>
    );
    
    // Fill inputs
    fireEvent.change(screen.getByPlaceholderText(/enter name/i), { target: { value: "John Doe", name: "candidateName" } });
    fireEvent.change(screen.getByPlaceholderText(/software engineer/i), { target: { value: "Developer", name: "jobRole" } });
    
    // Select experience
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Experienced (5+ years)", name: "experience" } });
    
    // Fill description
    fireEvent.change(screen.getByPlaceholderText(/paste job description/i), { target: { value: "Need a developer", name: "jobDescription" } });
    
    // Mock file upload
    const file = new File(["test file content"], "resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText("Upload Resume").querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for the UI to update with "Uploaded!"
    expect(await screen.findByText(/Uploaded!/i)).toBeInTheDocument();
    
    const submitBtn = screen.getByText(/Save & Analyze Resume/i);
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockAnalyzeResume).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/resume-analyzer/result/resume123");
    });
  });
});
