const API_BASE_URL = "https://api-challenge.agilefreaks.com";

const getToken = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/tokens`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to get token: ${response.status}`);
  }

  const data = await response.json();
  const accessToken = data.token;

  return accessToken;
};

export const calculateDistance = (position, shop) => {
  const dx = parseFloat(shop.x) - parseFloat(position.x);
  const dy = parseFloat(shop.y) - parseFloat(position.y);

  return Math.sqrt(dx * dx + dy * dy);
};

const getCoffeeShops = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/coffee_shops?token=${token}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to get coffee shops: ${response.status}`);
  }

  return response.json();
};

export const getNearestShops = async (position) => {
  try {
    const token = await getToken();
    const shops = await getCoffeeShops(token);

    const shopsWithDistance = shops.map((shop) => ({
      shop,
      distance: calculateDistance(position, shop),
    }));

    const sortedShops = shopsWithDistance.sort((a, b) => a.distance - b.distance);
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
