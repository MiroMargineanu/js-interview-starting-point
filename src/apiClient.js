/*
 * Client for the coffee shop API, retrying failed requests with an increasing retry timeout.
 */

export const API_BASE_URL = "https://api-challenge.agilefreaks.com";
export const BASE_RETRY_DELAY = 1000;
export const MAX_RETRY_ATTEMPTS = 3;

const isRetryable = (error) => !error.status || error.status >= 500;

const delayRetry = (waitingTime) =>
  new Promise((resolve) => setTimeout(resolve, waitingTime));

/*
 * Retries the passed callback function recursively until the maximum attempts is hit.
 */

const retryWrapper = async (functionToRetry, attempt = 0) => {
  try {
    return await functionToRetry();
  } catch (error) {
    if (attempt >= MAX_RETRY_ATTEMPTS || !isRetryable(error)) {
      throw error;
    }

    await delayRetry(BASE_RETRY_DELAY * Math.pow(2, attempt));
    return retryWrapper(functionToRetry, attempt + 1);
  }
};

/*
 * Requests an access token from the API.
 */

export const getToken = () =>
  retryWrapper(async () => {
    const response = await fetch(`${API_BASE_URL}/v1/tokens`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = new Error(`Failed to get token: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const accessToken = data.token;

    return accessToken;
  });

/*
 * Fetches the full list of coffee shops of Sibiu using the access token.
 */

export const getCoffeeShops = (token) =>
  retryWrapper(async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/coffee_shops?token=${token}`,
    );

    if (!response.ok) {
      const error = new Error(`Failed to get coffee shops: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  });
