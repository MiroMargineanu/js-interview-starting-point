import { getToken, getCoffeeShops } from "./apiClient.js";
import { calculateDistance } from "./distance.js";

/*
 * Finds the three coffee shops nearest to the given position of the user.
 */

export const getNearestShops = async (position) => {
  try {
    const token = await getToken();
    const shops = await getCoffeeShops(token);

    const shopsWithDistance = shops.map((shop) => ({
      shop,
      distance: calculateDistance(position, shop),
    }));

    const sortedShops = shopsWithDistance.sort(
      (alpha, beta) => alpha.distance - beta.distance,
    );

    const nearestThreeShops = sortedShops.slice(0, 3);

    return nearestThreeShops;
  } catch (error) {
    throw error;
  }
};
