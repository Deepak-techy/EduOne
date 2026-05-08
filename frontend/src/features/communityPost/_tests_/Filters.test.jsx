import { render, screen, fireEvent } from "@testing-library/react";
import Filters from "../components/Filters";
import { vi } from "vitest";

describe("Filters Component", () => {
  test("renders filter buttons", () => {
    render(<Filters filter="all" setFilter={vi.fn()} role="Student" refreshPosts={vi.fn()} />);
    
    expect(screen.getByText(/all/i, { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText(/student/i, { selector: 'button', exact: false })).toBeInTheDocument();
    expect(screen.getByText(/announcement/i, { selector: 'button', exact: false })).toBeInTheDocument();
  });

  test("clicking filter triggers setFilter", () => {
    const setFilterMock = vi.fn();
    render(<Filters filter="all" setFilter={setFilterMock} role="Student" refreshPosts={vi.fn()} />);
    
    // Find the 'student' tab button
    const studentTab = screen.getByText("student");
    fireEvent.click(studentTab);
    
    expect(setFilterMock).toHaveBeenCalledWith("student");
  });

  test("renders Create Announcement for Admin", () => {
    render(<Filters filter="all" setFilter={vi.fn()} role="Admin" refreshPosts={vi.fn()} />);
    expect(screen.getByText("Create Announcement")).toBeInTheDocument();
  });
});