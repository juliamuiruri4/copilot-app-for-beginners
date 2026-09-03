import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App, { filterBooks, type BookFiltersState } from "../App";
import { books } from "../data/books";

const defaultFilters: BookFiltersState = {
  searchTerm: "",
  selectedGenre: "all",
  readingStatus: "all"
};

describe("filterBooks", () => {
  it("matches title and author searches without depending on letter case", () => {
    const results = filterBooks(books, {
      ...defaultFilters,
      searchTerm: "hobbit"
    });

    expect(results.map((book) => book.title)).toEqual(["The Hobbit"]);
  });

  it("filters by genre and reading status together", () => {
    const results = filterBooks(books, {
      ...defaultFilters,
      selectedGenre: "Fantasy",
      readingStatus: "unread"
    });

    expect(results.map((book) => book.title)).toEqual(["The Night Circus"]);
  });

  it("updates the unread count for the books shown after filtering", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Fantasy" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "unread" } });

    expect(screen.getByRole("heading", { name: "1 books shown" })).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(1);

    const stats = screen.getByRole("region", { name: /reading stats/i });
    expect(within(stats).getByLabelText("Total: 1")).toBeTruthy();
    expect(within(stats).getByLabelText("Unread: 1")).toBeTruthy();
  });
});
