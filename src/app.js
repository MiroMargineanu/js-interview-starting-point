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

    const nearest = sortedShops.slice(0, 3);

    nearest.forEach(({ shop, distance }) => {
      console.log(`${shop.name}, ${distance.toFixed(4)}`);
    });

    return nearest;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return [];
  }
};
