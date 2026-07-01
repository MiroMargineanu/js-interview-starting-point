import { API_BASE_URL, getToken, getCoffeeShops } from "../src/apiClient";

const TOTAL_RETRY_DELAY_MS = 1000 + 2000 + 3000;

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("getToken", () => {
  test("Returns the token on success.", async () => {
    Object.assign(global, {
      fetch: jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "test-token" }),
      }),
    });

    await expect(getToken()).resolves.toBe("test-token");
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/v1/tokens`, {
      method: "POST",
    });
  });

  test("Retries after a failure and resolves once a later attempt succeeds.", async () => {
    jest.useFakeTimers();

    Object.assign(global, {
      fetch: jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 503 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: "test-token" }),
        }),
    });

    const promise = getToken();
    await jest.advanceTimersByTimeAsync(1000);

    await expect(promise).resolves.toBe("test-token");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("Gives up and throws after exhausting all retries.", async () => {
    jest.useFakeTimers();

    Object.assign(global, {
      fetch: jest.fn().mockResolvedValue({ ok: false, status: 503 }),
    });

    const promise = getToken();
    promise.catch(() => {});
    await jest.advanceTimersByTimeAsync(TOTAL_RETRY_DELAY_MS);

    await expect(promise).rejects.toThrow("Failed to get token: 503");
    expect(fetch).toHaveBeenCalledTimes(4);
  });
});

describe("getCoffeeShops", () => {
  test("Returns the shop list on success.", async () => {
    const shops = [{ name: "Tucano Coffee", x: "45.797", y: "24.152" }];

    Object.assign(global, {
      fetch: jest
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => shops }),
    });

    await expect(getCoffeeShops("test-token")).resolves.toEqual(shops);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/v1/coffee_shops?token=test-token`,
    );
  });

  test("Gives up and throws after exhausting all retries.", async () => {
    jest.useFakeTimers();

    Object.assign(global, {
      fetch: jest.fn().mockResolvedValue({ ok: false, status: 503 }),
    });

    const promise = getCoffeeShops("test-token");
    promise.catch(() => {});
    await jest.advanceTimersByTimeAsync(TOTAL_RETRY_DELAY_MS);

    await expect(promise).rejects.toThrow("Failed to get coffee shops: 503");
    expect(fetch).toHaveBeenCalledTimes(4);
  });
});
