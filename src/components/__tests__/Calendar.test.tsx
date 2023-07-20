import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Calendar from "../Calendar/Calendar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MONTHS_ARRAY } from "../../utils/countryAndCalendarData";

describe("Calendar test", () => {
  beforeEach(() => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Calendar />
      </QueryClientProvider>
    );
  });

  test("Should show month by default", () => {
    const monthTextForYearView = screen.queryByText("January");
    expect(monthTextForYearView).toBeNull();
  });

  test("Should show year view", () => {
    expect(screen.queryByText("year")).toBeDefined();
    fireEvent(
      screen.getByText(/year/i),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(screen.getByText(/January/i)).toBeDefined();
    expect(screen.getByText(/January/i)).not.toBeNull();
    expect(screen.getByText(/February/i)).toBeDefined();
    expect(screen.getByText(/March/i)).toBeDefined();
    expect(screen.getByText(/April/i)).toBeDefined();
    expect(screen.getByText(/May/i)).toBeDefined();
    expect(screen.getByText(/June/i)).toBeDefined();
    expect(screen.getByText(/July/i)).toBeDefined();
    expect(screen.getByText(/August/i)).toBeDefined();
    expect(screen.getByText(/September/i)).toBeDefined();
    expect(screen.getByText(/October/i)).toBeDefined();
    expect(screen.getByText(/November/i)).toBeDefined();
    expect(screen.getByText(/December/i)).toBeDefined();
  });

  test("Should go to previous month", async () => {
    const currMonth = screen
      .getByTitle("Calendar title btn")
      .textContent?.split(" ")[0];
    const currMonthIndex = MONTHS_ARRAY.findIndex((m) => m === currMonth);
    expect(screen.getByTitle("Previous month")).toBeDefined();
    fireEvent(
      screen.getByTitle("Previous month"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(
      (await screen.findByTitle("Calendar title btn")).textContent?.split(
        " "
      )[0]
    ).toEqual(MONTHS_ARRAY[currMonthIndex - 1]);
  });

  test("Should go to next year", async () => {
    fireEvent(
      screen.getByText(/year/i),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(screen.getByTitle("Next year")).toBeDefined();
    expect(screen.getByText(/January/i)).toBeDefined();

    const currYear = screen
      .getByTitle("Calendar title btn")
      .textContent?.split(" ")[0];

    fireEvent(
      screen.getByTitle("Next year"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(
      (await screen.findByTitle("Calendar title btn")).textContent?.split(
        " "
      )[0]
    ).toEqual((Number(currYear) + 1).toString());
  });
});
