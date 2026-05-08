import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function renderWithProviders(ui, { user = null } = {}) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user }}>
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>
  );
}