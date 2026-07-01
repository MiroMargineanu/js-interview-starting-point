/*
 * Computes the Euclidean distance between two { x, y } coordinate pairs.
 */

export const calculateDistance = (position, shop) => {
  const dx = parseFloat(shop.x) - parseFloat(position.x);
  const dy = parseFloat(shop.y) - parseFloat(position.y);

  return Math.sqrt(dx * dx + dy * dy);
};
