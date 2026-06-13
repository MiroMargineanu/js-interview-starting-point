import { calculateDistance, getNearestShops } from "../src/app";

const sibiuCoffeeShops = [
  { name: "Tucano Coffee", x: "45.797", y: "24.152" },
  { name: "Minimalist Coffee", x: "45.800", y: "24.148" },
  { name: "Beans & Dots", x: "45.795", y: "24.155" },
  { name: "Vero Café", x: "45.810", y: "24.160" },
];

const mockFetch = (shops) => {
  const shopsResponse = { ok: true, json: async () => shops };

  const tokenResponse = {
    ok: true,
    json: async () => ({ token: "test-token" }),
  };

  Object.assign(global, {
    fetch: jest
      .fn()
      .mockResolvedValueOnce(tokenResponse)
      .mockResolvedValueOnce(shopsResponse),
  });
};

afterEach(jest.restoreAllMocks);

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

describe("getNearestShops", () => {
  test("Returns an array.", async () => {
    mockFetch(sibiuCoffeeShops);
    const result = await getNearestShops({ x: "0", y: "0" });
    expect(Array.isArray(result)).toBe(true);
  });

  test("Returns at most 3 shops.", async () => {
    mockFetch(sibiuCoffeeShops);
    const result = await getNearestShops({ x: "0", y: "0" });
    expect(result.length).toBeLessThanOrEqual(3);
  });

  test("Returns shops sorted from nearest to farthest.", async () => {
    mockFetch(sibiuCoffeeShops);
    const result = await getNearestShops({ x: "0", y: "0" });
    const distances = result.map(({ distance }) => distance);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  test("Returns an empty array and logs an error when the token request fails.", async () => {
    Object.assign(global, {
      fetch: jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 503,
      }),
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("Error: Failed to get token: 503");
  });

  test("Returns an empty array and logs an error when the shops request fails.", async () => {
    Object.assign(global, {
      fetch: jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: "test-token" }),
        })
        .mockResolvedValueOnce({ ok: false, status: 503 }),
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: Failed to get coffee shops: 503",
    );
  });

  test("Returns an empty array and logs an error on a network failure.", async () => {
    Object.assign(global, {
      fetch: jest.fn().mockRejectedValueOnce(new Error("Network error")),
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("Error: Network error");
  });
});
