import { calculateDistance } from "../src/distance";

describe("calculateDistance", () => {
  test("Returns 0 when the position and shop are at the same coordinates.", () => {
    expect(calculateDistance({ x: "1", y: "1" }, { x: "1", y: "1" })).toBe(0);
  });

  test("Computes the correct distance for a 3-4-5 right triangle.", () => {
    expect(calculateDistance({ x: "0", y: "0" }, { x: "3", y: "4" })).toBe(5);
  });

  test("Handles negative coordinates.", () => {
    expect(calculateDistance({ x: "-3", y: "0" }, { x: "0", y: "-4" })).toBe(5);
  });
});
