import { getNearestShops } from "../src/app";
import { getToken, getCoffeeShops } from "../src/apiClient";

jest.mock("../src/apiClient");

const sibiuCoffeeShops = [
  { name: "Tucano Coffee", x: "45.797", y: "24.152" },
  { name: "Minimalist Coffee", x: "45.800", y: "24.148" },
  { name: "Beans & Dots", x: "45.795", y: "24.155" },
  { name: "Vero Café", x: "45.810", y: "24.160" },
];

afterEach(jest.restoreAllMocks);

describe("getNearestShops", () => {
  beforeEach(() => {
    getToken.mockResolvedValue("test-token");
    getCoffeeShops.mockResolvedValue(sibiuCoffeeShops);
  });

  test("Returns an array.", async () => {
    const result = await getNearestShops({ x: "0", y: "0" });
    expect(Array.isArray(result)).toBe(true);
  });

  test("Returns at most 3 shops.", async () => {
    const result = await getNearestShops({ x: "0", y: "0" });
    expect(result.length).toBeLessThanOrEqual(3);
  });

  test("Returns shops sorted from nearest to farthest.", async () => {
    const result = await getNearestShops({ x: "0", y: "0" });
    const distances = result.map(({ distance }) => distance);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  test("Returns an empty array and logs an error when the token request fails.", async () => {
    getToken.mockRejectedValue(new Error("Failed to get token: 503"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("Error: Failed to get token: 503");
  });

  test("Returns an empty array and logs an error when the shops request fails.", async () => {
    getCoffeeShops.mockRejectedValue(
      new Error("Failed to get coffee shops: 503"),
    );

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      "Error: Failed to get coffee shops: 503",
    );
  });

  test("Returns an empty array and logs an error on a network failure.", async () => {
    getToken.mockRejectedValue(new Error("Network error"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNearestShops({ x: "0", y: "0" });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("Error: Network error");
  });
});
