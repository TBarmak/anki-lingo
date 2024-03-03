import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

describe("App.tsx", async () => {
  it('Then should show "Anki Lingo" and blurb', async () => {
    // Act
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Assert
    const title = screen.queryAllByText("Anki Lingo");
    const blurb = screen.queryByText(
      "Automate generating anki flashcards for learning foreign languages."
    );
    expect(title).not.toBeNull();
    expect(blurb).not.toBeNull();
  });
});
