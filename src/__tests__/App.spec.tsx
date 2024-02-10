import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App.tsx", async () => {
  it('Then should show header with "Anki Lingo"', async () => {
    // Act
    render(<App />);

    // Assert
    const title = screen.queryByText("Anki Lingo");
    expect(title).not.toBeNull();
  });
});
