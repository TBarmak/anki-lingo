import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";

describe("App.tsx", async () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('Then should show "Anki Lingo" and blurb', async () => {
    // Act
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    // Assert
    const title = screen.queryAllByText("Anki Lingo");
    const blurb = screen.queryByText(
      "Automate generating Anki flashcards for learning foreign languages."
    );
    expect(title).not.toBeNull();
    expect(blurb).not.toBeNull();
  });
});
