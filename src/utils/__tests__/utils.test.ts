import { describe, it, expect } from "vitest";

import { rangeOfNumbers } from "../countryAndCalendarData";

describe("Range of numbers function", () => {
  it("Should return empty array when nothing is provided", () => {
    expect(rangeOfNumbers(undefined as any, undefined as any)).toStrictEqual(
      []
    );
  });
  it("Should return array with one item when only start is provided", () => {
    expect(rangeOfNumbers(5, undefined as any)).toStrictEqual([5]);
  });
  it("Should work with start and end date", () => {
    expect(rangeOfNumbers(5, 10)).toStrictEqual([5, 6, 7, 8, 9, 10]);
  });
  it("Should work with strings", () => {
    expect(rangeOfNumbers("5" as any, "10" as any)).toStrictEqual([
      5, 6, 7, 8, 9, 10,
    ]);
  });
  it("Should work with reverse order", () => {
    expect(rangeOfNumbers(10, 5)).toStrictEqual([5, 6, 7, 8, 9, 10]);
  });
});
